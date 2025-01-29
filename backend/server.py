from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import mysql.connector
import re
import os
from sklearn.ensemble import RandomForestRegressor
import joblib
import logging

logging.basicConfig(level=logging.DEBUG)

# Charger le modèle s'il existe
os.makedirs("output", exist_ok=True)
MODEL_PATH = "./output/model.pkl"
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Autoriser toutes les origines

@app.route('/api/optimize', methods=['POST'])
def optimize():
    try:
        data = request.json
        if not data:
            logging.error("No data provided")
            return {"error": "No data provided"}, 400

        # Validation des dimensions du panneau
        panels = data.get("panels")
        if not panels or "width" not in panels or "height" not in panels:
            logging.error("Panel dimensions (width and height) are required")
            return {"error": "Panel dimensions (width and height) are required"}, 400

        panel_width = float(panels["width"])
        panel_height = float(panels["height"])

        if panel_width <= 0 or panel_height <= 0:
            logging.error("Panel dimensions must be positive")
            return {"error": "Panel dimensions must be positive"}, 400

        # Validation des pièces
        pieces = data.get("pieces", [])
        if not pieces or not isinstance(pieces, list):
            logging.error("Pieces must be a list of objects")
            return {"error": "Pieces must be a list of objects"}, 400

        for piece in pieces:
            if "width" not in piece or "height" not in piece:
                logging.error("Each piece must have width and height")
                return {"error": "Each piece must have width and height"}, 400
            if float(piece["width"]) <= 0 or float(piece["height"]) <= 0:
                logging.error("Piece dimensions must be positive")
                return {"error": "Piece dimensions must be positive"}, 400

        # Extraction des paramètres personnalisés avec des valeurs par défaut
        tool_number = int(data.get("tool_number", 1))
        tool_diameter = float(data.get("tool_diameter", 6))
        tool_length = float(data.get("tool_length", 50))
        safe_z_height = float(data.get("safe_z_height", 5))
        cut_depth = float(data.get("cut_depth", 5))

        # Trier les pièces par taille pour un placement efficace
        pieces = sorted(pieces, key=lambda p: -float(p["width"]) * float(p["height"]))

        layout = []
        current_x, current_y = 0, 0
        row_height = 0

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
                return {"error": "Failed to fit all pieces within the panel"}, 400

        # Générer le fichier G-code
        gcode_content = generate_gcode(
            layout, feedrate=1000, tool_number=tool_number, tool_diameter=tool_diameter, 
            tool_length=tool_length, safe_z_height=safe_z_height, 
            spindle_speed=1000, cut_depth=cut_depth
        )

        os.makedirs("output", exist_ok=True)
        file_path = "./output/cutting_plan.gcode"
        with open(file_path, "w") as file:
            file.write(gcode_content)

        logging.info("Optimization completed")
        return {"message": "Optimization completed", "layout": layout}

    except Exception as e:
        logging.error(f"Error during optimization: {str(e)}", exc_info=True)
        return {"error": f"An internal error occurred: {str(e)}"}, 500

@app.route('/api/train', methods=['POST'])
def train():
    try:
        data = request.json
        if not data:
            logging.error("No data provided")
            return {"error": "No data provided"}, 400

        X_train = data.get("features")
        y_train = data.get("targets")

        if not X_train or not y_train:
            return {"error": "Features and targets are required"}, 400
        if len(X_train) != len(y_train):
            return {"error": "Features and targets must have the same length"}, 400
        if not all(isinstance(x, (list, tuple)) and len(x) == 3 for x in X_train):
            return {"error": "Each feature must be a list or tuple of length 3"}, 400
        if not all(isinstance(y, (int, float)) for y in y_train):
            return {"error": "All target values must be numeric"}, 400

        global model
        model = RandomForestRegressor(n_estimators=10, random_state=42)
        model.fit(X_train, y_train)

        joblib.dump(model, MODEL_PATH)
        return {"message": "Model trained successfully with user data", "model_path": MODEL_PATH}

    except Exception as e:
        logging.error(f"Error during user model training: {str(e)}", exc_info=True)
        return {"error": f"An internal error occurred: {str(e)}"}, 500

@app.route('/api/download', methods=['GET'])
def download():
    file_path = os.path.abspath("./output/cutting_plan.gcode")
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return {"error": "File not found"}, 404

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

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'subscribers'
}
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@app.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.json
        if not data:
            logging.error("No data provided")
            return jsonify({"error": "No data provided"}), 400

        name = data.get("name")
        email = data.get("email")

        if not name or not email:
            logging.error("Name and email are required")
            return jsonify({"error": "Name and email are required"}), 400

        # Vérifier le format de l'email
        if not re.match(EMAIL_REGEX, email):
            logging.error("Invalid email format")
            return jsonify({"error": "Invalid email format"}), 400

        # Connexion à la base de données
        with mysql.connector.connect(**db_config) as conn:
            with conn.cursor() as cursor:
                # Vérifier si l'email existe déjà
                cursor.execute('SELECT id FROM subscribers WHERE email = %s', (email,))
                existing_subscriber = cursor.fetchone()

                if existing_subscriber:
                    logging.error("Email already exists")
                    return jsonify({"error": "Email already exists"}), 400

                # Insertion des données dans la base de données
                query = 'INSERT INTO subscribers (name, email) VALUES (%s, %s)'
                cursor.execute(query, (name, email))
                conn.commit()

        logging.info("Subscription saved successfully!")
        return jsonify({"message": "Subscription saved successfully!"}), 200

    except Exception as e:
        logging.error(f"Error during subscription: {str(e)}", exc_info=True)
        return jsonify({"error": f"An internal error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)