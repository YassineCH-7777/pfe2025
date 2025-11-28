from flask import Flask, request, send_file, jsonify
from flask_cors import CORS  # Importation de CORS
import mysql.connector
import re
# Removed unused import
import os
from sklearn.ensemble import RandomForestRegressor
import joblib
import logging
import jwt, bcrypt, datetime
import firebase_admin
from firebase_admin import db, credentials
from functools import wraps

logging.basicConfig(level=logging.DEBUG)

SECRET_KEY = "your_secret_key"  # Clé secrète pour JWT

# Initialisation de Flask
app = Flask(__name__)

# Activation de CORS pour toutes les routes en autorisant http://localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Ajout manuel des en-têtes CORS dans l'after_request afin de s'assurer que 
# les réponses (même en cas d'erreur) les contiennent.
@app.after_request
def after_request(response):
    response.headers["Content-Type"] = "application/json"
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    return response

# Connexion à Firebase
cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://projet-10992-default-rtdb.firebaseio.com/"
})
ref = db.reference()

# Gestion des erreurs 404 et 500
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

# ROUTE : Inscription utilisateur
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "Tous les champs sont requis"}), 400

    if not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Email invalide"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user_ref = ref.child("users").order_by_child("email").equal_to(email).get()

    logging.debug("User Ref: %s", user_ref)

    if user_ref and any(user_ref):  # Si un utilisateur existe déjà
        return jsonify({"error": "Cet email est déjà utilisé"}), 400

    ref.child("users").push({
        "email": email,
        "firstName": first_name,
        "lastName": last_name,
        "password": hashed_password
    })
    
    return jsonify({"message": "Utilisateur enregistré avec succès"}), 201

# ROUTE : Connexion utilisateur
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    users = ref.child("users").order_by_child("email").equal_to(email).get()
    
    if not users:
        return jsonify({"error": "Utilisateur non trouvé"}), 400
    
    for user_id, user in users.items():
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            token = jwt.encode(
                {"user_id": user_id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)},
                SECRET_KEY,
                algorithm="HS256"
            )
            return jsonify({"token": token, "message": "Connexion réussie"})
    
    return jsonify({"error": "Mot de passe incorrect"}), 400


@app.route('/api/contact', methods=['POST'])
def receive_contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not name or not email or not message:
            return jsonify({'error': 'Champs manquants'}), 400

        formatted_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        ref = db.reference("/")
        ref.child("contact_messages").push({
            'name': name,
            'email': email,
            'message': message,
            'timestamp': formatted_date
        })

        return jsonify({'success': True, 'message': 'Message reçu !'}), 200

    except Exception as e:
        print('Erreur serveur :', str(e))
        return jsonify({'error': str(e)}), 500

# Décorateur pour protéger les routes nécessitant une authentification
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
        if not token:
            logging.error("Token manquant dans la requête")
            return jsonify({"error": "Token manquant!"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data.get("user_id")
        except Exception as e:
            logging.error("Erreur lors du décodage du token : " + str(e), exc_info=True)
            return jsonify({"error": "Token invalide!"}), 401
        return f(*args, **kwargs)
    return decorated

# ROUTE : Rafraîchir le token
@app.route('/api/refresh-token', methods=['POST'])
def refresh_token():
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "En-tête Authorization manquant"}), 401
        token = auth_header[7:]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"], options={"verify_exp": False})
        new_token = jwt.encode(
            {"user_id": decoded["user_id"], "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"access_token": new_token})
    except Exception as e:
        logging.error("Erreur lors du rafraîchissement du token : " + str(e), exc_info=True)
        return jsonify({"error": "Échec du rafraîchissement du token"}), 500

# Fonction d'extraction de l'ID utilisateur depuis le token
def get_user_id_from_token(request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header.startswith("Bearer "):
            return None
            
        token = auth_header[7:]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})
        user_ref = ref.child("users").child(decoded['user_id']).get()
        if not user_ref:
            return None
            
        return decoded['user_id']
    except jwt.ExpiredSignatureError:
        raise jwt.ExpiredSignatureError("Token expiré")
    except Exception as e:
        logging.error(str(e))
        return None

# ROUTE : Récupération du profil utilisateur
@app.route('/api/me', methods=['GET'])
@token_required
def get_user_profile():
    user_id = get_user_id_from_token(request)
    user_data = ref.child("users").child(user_id).get()
    if user_data:
        user_data.pop('password', None)
        return jsonify({"user": user_data})
    return jsonify({"error": "Utilisateur non trouvé"}), 404

# ROUTE : Détails d'une optimisation
@app.route('/api/projects/<optimization_id>', methods=['GET'])
@token_required
def get_optimization_details(optimization_id):
    try:
        user_id = get_user_id_from_token(request)
        if not user_id:
            logging.error("Utilisateur non authentifié lors de la récupération des détails d'optimisation.")
            return jsonify({"error": "Utilisateur non authentifié"}), 401

        logging.info(f"Récupération des détails pour l'optimisation : {optimization_id} de l'utilisateur : {user_id}")

        optimization_data = ref.child("optimization_history").child(optimization_id).get()
        if not optimization_data:
            logging.error(f"Optimisation {optimization_id} non trouvée.")
            return jsonify({"error": "Optimisation non trouvée"}), 404

        if optimization_data.get("userId") != user_id:
            logging.error("Accès non autorisé aux détails de l'optimisation pour l'utilisateur : " + user_id)
            return jsonify({"error": "Accès non autorisé"}), 403

        return jsonify(optimization_data)
    except Exception as e:
        logging.error("Erreur lors de la récupération des détails de l'optimisation: " + str(e), exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

# ROUTE : Mise à jour du profil
@app.route('/api/update-profile', methods=['PUT'])
@token_required
def update_profile():
    data = request.json
    user_id = request.user_id
    user_ref = ref.child(f"users/{user_id}")
    user = user_ref.get()

    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    updates = {}
    if "firstName" in data and data["firstName"]:
        updates["firstName"] = data["firstName"]
    if "lastName" in data and data["lastName"]:
        updates["lastName"] = data["lastName"]
    if "email" in data and data["email"]:
        updates["email"] = data["email"]
    if "newPassword" in data:
        old_password = data.get("oldPassword")
        if not old_password:
            return jsonify({"error": "Ancien mot de passe requis"}), 400
        if not bcrypt.checkpw(old_password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({"error": "Ancien mot de passe incorrect"}), 400
        updates["password"] = bcrypt.hashpw(data["newPassword"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    if not updates:
        return jsonify({"error": "Aucune donnée valide à mettre à jour"}), 400

    user_ref.update(updates)
    return jsonify({"message": "Profil mis à jour avec succès", "reload": True})

# ROUTE : Historique des optimisations
@app.route('/api/history', methods=['GET'])
@token_required
def history():
    try:
        user_id = get_user_id_from_token(request)
        if not user_id:
            logging.error("User ID introuvable dans le token.")
            return jsonify({"error": "Utilisateur non authentifié"}), 401

        logging.info(f"Récupération de l'historique pour l'utilisateur : {user_id}")

        data = ref.child("optimization_history").order_by_child("userId").equal_to(user_id).get()
        logging.debug("Données retournées depuis Firebase : " + str(data))

        history_list = []
        if data is None:
            history_list = []
        elif isinstance(data, dict):
            history_list = [dict(id=k, **v) for k, v in data.items()]
        elif isinstance(data, list):
            history_list = data
        else:
            logging.error("Type de données inattendu retourné par Firebase : " + str(type(data)))

        history_list.sort(key=lambda x: x.get("timestamp") or "", reverse=True)
        return jsonify({"history": history_list})
    except Exception as e:
        logging.error("Erreur lors de la récupération de l'historique : " + str(e), exc_info=True)
        return jsonify({"error": "Internal server error"}), 500
    
# ROUTE : Suppression d'une entrée dans l'historique
@app.route('/api/history/<optimization_id>', methods=['DELETE'])
@token_required
def delete_optimization_history(optimization_id):
    try:
        user_id = get_user_id_from_token(request)
        if not user_id:
            logging.error("Utilisateur non authentifié lors de la suppression de l'historique.")
            return jsonify({"error": "Utilisateur non authentifié"}), 401

        logging.info(f"Tentative de suppression de l'optimisation {optimization_id} par l'utilisateur {user_id}")

        optimization_ref = ref.child("optimization_history").child(optimization_id)
        optimization_data = optimization_ref.get()

        if not optimization_data:
            logging.error(f"Optimisation {optimization_id} non trouvée dans Firebase.")
            return jsonify({"error": "Optimisation non trouvée"}), 404

        logging.debug(f"User ID from token: {user_id}, User ID from optimization: {optimization_data.get('userId')}")
        if optimization_data.get("userId") != user_id:
            logging.error(f"Accès non autorisé pour supprimer l'optimisation {optimization_id} par l'utilisateur {user_id}")
            return jsonify({"error": "Accès non autorisé"}), 403

        optimization_ref.delete()
        logging.info(f"Optimisation {optimization_id} supprimée avec succès par l'utilisateur {user_id}")
        return jsonify({"message": "Entrée supprimée avec succès"}), 200

    except Exception as e:
        logging.error("Erreur lors de la suppression de l'historique : " + str(e), exc_info=True)
        return jsonify({"error": "Erreur interne du serveur", "details": str(e)}), 500

# Fonction interne pour sauvegarder l’optimisation dans Firebase
def save_optimization_history_firebase(project_name, panels, pieces, layout, gcode, tool_params):
    ref.child("optimization_history").push({
        "projectName": project_name,
        "panels": panels,
        "pieces": pieces,
        "layout": layout,
        "gCode": gcode,
        "toolParams": tool_params,
        "timestamp": datetime.datetime.now().isoformat()
    })

# ROUTE : Sauvegarde de l’historique (accessible depuis React)
@app.route('/api/save-optimization', methods=['POST'])
@token_required
def save_optimization_history():
    try:
        user_id = get_user_id_from_token(request)
        if not user_id:
            return jsonify({"error": "Utilisateur non authentifié"}), 401

        data = request.json
        project_name = data.get("projectName")
        panels = data.get("panels")
        pieces = data.get("pieces")
        layout = data.get("layout")
        tool_params = data.get("toolParams")
        
        g_code_file_path = './output/cutting_plan.gcode'
        if os.path.exists(g_code_file_path):
            with open(g_code_file_path, 'r') as file:
                g_code = file.read()  
        else:
            return jsonify({"error": "Fichier G-code introuvable"}), 404

        if not all([project_name, panels, pieces, layout, g_code, tool_params]):
            return jsonify({"error": "Tous les champs sont requis"}), 400

        ref.child("optimization_history").push({
            "projectName": project_name,
            "panels": panels,
            "pieces": pieces,
            "layout": layout,
            "gCode": g_code,
            "toolParams": tool_params,
            "timestamp": datetime.datetime.now().isoformat(),
            "userId": user_id
        })
        
        return jsonify({"message": "Historique sauvegardé"}), 201
    except Exception as e:
        logging.error("Erreur lors de la sauvegarde de l'historique : " + str(e), exc_info=True)
        return jsonify({"error": "Internal server error"}), 500

# ROUTE : Optimisation
@app.route('/api/optimize', methods=['POST'])
def optimize():
    try:
        data = request.json
        if not data:
            logging.error("No data provided")
            return jsonify({"error": "No data provided"}), 400

        panels = data.get("panels")
        if not panels or "width" not in panels or "height" not in panels:
            logging.error("Panel dimensions (width and height) are required")
            return jsonify({"error": "Panel dimensions (width and height) are required"}), 400

        panel_width = float(panels["width"])
        panel_height = float(panels["height"])
        if panel_width <= 0 or panel_height <= 0:
            logging.error("Panel dimensions must be positive")
            return jsonify({"error": "Panel dimensions must be positive"}), 400

        pieces = data.get("pieces", [])
        if not pieces or not isinstance(pieces, list):
            logging.error("Pieces must be a list of objects")
            return jsonify({"error": "Pieces must be a list of objects"}), 400

        for piece in pieces:
            if "width" not in piece or "height" not in piece:
                logging.error("Each piece must have width and height")
                return jsonify({"error": "Each piece must have width and height"}), 400
            if float(piece["width"]) <= 0 or float(piece["height"]) <= 0:
                logging.error("Piece dimensions must be positive")
                return jsonify({"error": "Piece dimensions must be positive"}), 400

        tool_number    = int(data.get("tool_number", 1))
        tool_diameter  = float(data.get("tool_diameter", 6))
        tool_length    = float(data.get("tool_length", 50))
        safe_z_height  = float(data.get("safe_z_height", 5))
        cut_depth      = float(data.get("cut_depth", 5))
        project_name   = data.get("projectName", "Projet Sans Nom")
        
        tool_params = {
            "tool_number": tool_number,
            "tool_diameter": tool_diameter,
            "tool_length": tool_length,
            "safe_z_height": safe_z_height,
            "cut_depth": cut_depth
        }

        pieces = sorted(pieces, key=lambda p: -float(p["width"]) * float(p["height"]))

        layout = []
        current_x, current_y = 0, 0
        row_height = 0

        layout = None
        dqn_layout = None  # For debugging
        try:
            from backend.ml.train_dqn_model import DQNTrainer
            dqn_trainer = DQNTrainer()
            model_path = "./ml/dqn_trained_model.keras"
            if os.path.exists(model_path):
                dqn_trainer.model = joblib.load(model_path)
            else:
                logging.warning("DQN model not found, falling back to heuristic")
                raise Exception("DQN model not found")

            state = {
                "main_panel": {
                    "width": panel_width,
                    "height": panel_height
                },
                "additional_panels": [
                    {
                        "width": float(piece["width"]),
                        "height": float(piece["height"]),
                        "quantity": float(piece.get("quantity", 1.0))
                    } for piece in pieces
                ],
                "existing_cuts": [{"start_x": 0, "start_y": 0, "end_x": 0, "end_y": 0} for _ in range(8)]
            }

            state_vector = dqn_trainer._state_to_vector(state)
            layout = []
            current_cuts = state["existing_cuts"].copy()
            done = False
            max_steps = max(len(pieces) * 3, 8)
            step = 0
            placed_pieces = []

            while not done and step < max_steps:
                action = dqn_trainer.model.predict(state_vector.reshape(1, -1))[0]
                next_state_vector, reward, done = dqn_trainer._simulate_step(state_vector, action)
                next_state = dqn_trainer._vector_to_state(next_state_vector)

                new_cuts = next_state["existing_cuts"]
                for i, cut in enumerate(new_cuts):
                    if i >= len(current_cuts) or cut != current_cuts[i]:
                        width = abs(cut["end_x"] - cut["start_x"])
                        height = abs(cut["end_y"] - cut["start_y"])
                        if width > 0 and height > 0 and cut["start_x"] + width <= panel_width and cut["start_y"] + height <= panel_height:
                            for piece in pieces:
                                piece_id = f"{piece['width']}_{piece['height']}"
                                if (abs(width - float(piece["width"])) < 1e-4 and 
                                    abs(height - float(piece["height"])) < 1e-4 and
                                    placed_pieces.count(piece_id) < float(piece.get("quantity", 1.0))):
                                    layout.append({
                                        "id": f"P{len(layout) + 1}",
                                        "x": cut["start_x"],
                                        "y": cut["start_y"],
                                        "width": width,
                                        "height": height
                                    })
                                    placed_pieces.append(piece_id)
                                    logging.debug(f"Placed piece: {piece_id} at x={cut['start_x']}, y={cut['start_y']}")
                                    break
                current_cuts = [c.copy() for c in new_cuts]
                state_vector = next_state_vector
                step += 1

            dqn_layout = layout.copy()  # Save for debugging
            logging.debug(f"DQN layout: {layout}")
            if not is_valid_layout(layout, pieces, panel_width, panel_height):
                logging.warning("Invalid layout detected")
                raise Exception("Invalid layout")
                logging.warning("DQN produced invalid layout, falling back to heuristic")
                raise Exception("Invalid DQN layout")

        except Exception as e:
            logging.info(f"DQN optimization failed: {str(e)}, using heuristic")
            # Heuristic with area and layout validation
            pieces = sorted(pieces, key=lambda p: -float(p["width"]) * float(p["height"]))
            layout = []
            current_x, current_y = 0, 0
            row_height = 0
            max_y = 0  # Track max height used

        for index, piece in enumerate(pieces):
            width = float(piece["width"])
            height = float(piece["height"])

            if current_x + width <= panel_width:
                layout.append({
                    "id": f"P{index + 1}",
                    "x": current_x,
                    "y": current_y,
                    "width": width,
                    "height": height
                })
                current_x += width
                row_height = max(row_height, height)
            elif current_y + row_height + height <= panel_height:
                current_x = 0
                current_y += row_height
                row_height = height
                layout.append({
                    "id": f"P{index + 1}",
                    "x": current_x,
                    "y": current_y,
                    "width": width,
                    "height": height
                })
                current_x += width
            else:
                logging.error("Failed to fit all pieces within the panel")
                return jsonify({"error": "Failed to fit all pieces within the panel"}), 400

        gcode_content = generate_gcode(
            layout, feedrate=1000, tool_number=tool_number, tool_diameter=tool_diameter, 
            tool_length=tool_length, safe_z_height=safe_z_height, 
            spindle_speed=1000, cut_depth=cut_depth
        )

        os.makedirs("output", exist_ok=True)
        file_path = "./output/cutting_plan.gcode"
        with open(file_path, "w") as file:
            file.write(gcode_content)

        user_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
            try:
                decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_token.get("user_id")
            except Exception as e:
                logging.error("Erreur lors du décodage du token : " + str(e))

        if user_id:
            ref.child("optimization_history").push({
                "projectName": project_name,
                "panels": panels,
                "pieces": pieces,
                "layout": layout,
                "gCode": gcode_content,
                "toolParams": tool_params,
                "timestamp": datetime.datetime.now().isoformat(),
                "userId": user_id
            })

        return jsonify({"message": "Optimization completed", "layout": layout})

    except Exception as e:
        logging.error(f"Error during optimization: {str(e)}", exc_info=True)
        return jsonify({"error": f"An internal error occurred: {str(e)}"}), 500

# ROUTE : Téléchargement du fichier G-code
@app.route('/api/download', methods=['GET'])
def download():
    file_path = os.path.abspath("./output/cutting_plan.gcode")
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return {"error": "File not found"}, 404

# Fonction pour vérifier si la disposition est valide
def is_valid_layout(layout, pieces, panel_width, panel_height):
    used_pieces = {}
    for piece in pieces:
        piece_id = f"{piece['width']}_{piece['height']}"
        used_pieces[piece_id] = used_pieces.get(piece_id, 0) + piece.get("quantity", 1)

    for item in layout:
        if item["x"] + item["width"] > panel_width or item["y"] + item["height"] > panel_height:
            return False
        piece_id = f"{item['width']}_{item['height']}"
        if piece_id not in used_pieces or used_pieces[piece_id] <= 0:
            return False
        used_pieces[piece_id] -= 1

    return all(count == 0 for count in used_pieces.values())

# Fonction pour générer le G-code
def generate_gcode(pieces, feedrate, tool_number=1, tool_diameter=6, tool_length=50, safe_z_height=5, spindle_speed=1000, cut_depth=5):
    gcode = []
    gcode.append("G21 ; Set units to millimeters")
    gcode.append("G90 ; Absolute positioning")
    gcode.append(f"T{tool_number} M6 ; Select tool {tool_number} ({tool_diameter}mm diameter, {tool_length}mm length)")
    gcode.append(f"M3 S{spindle_speed} ; Start spindle at {spindle_speed} RPM")
    gcode.append("; Define a safe Z height to raise the tool between moves")
    gcode.append(f"#100={safe_z_height}  ; Safe Z height")
    gcode.append("G0 X0 Y0 Z0 ; Move to start position (safe height)")

    for i, piece in enumerate(pieces, start=1):
        x, y, width, height = piece["x"], piece["y"], piece["width"], piece["height"]
        gcode.append(f"; Rectangle {i}")
        gcode.append(f"G1 Z[#100] F500 ; Raise tool to safe height")
        gcode.append(f"G1 X{x} Y{y} F1000 ; Move to start of rectangle")
        gcode.append(f"G1 Z-{cut_depth} F200 ; Lower tool into material ({cut_depth}mm depth)")
        gcode.append(f"G1 X{x + width} Y{y} F1000 ; Draw width")
        gcode.append(f"G1 X{x + width} Y{y + height} F1000 ; Draw height")
        gcode.append(f"G1 X{x} Y{y + height} F1000 ; Close rectangle")
        gcode.append(f"G1 X{x} Y{y} F1000 ; Return to start of rectangle")

    gcode.append("M5 ; Stop spindle")
    gcode.append("G1 Z[#100] F500 ; Raise tool to safe height")
    gcode.append("M02 ; End of program")
    return "\n".join(gcode)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
