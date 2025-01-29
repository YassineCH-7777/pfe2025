Optimisation de Découpe Intelligente / Smart Cutting Optimization

    🚀 Démarrage Rapide / Quick Start
        Prérequis / Requirements
            Python 3.8+
            MySQL 8.0+
            Bibliothèques Python : flask + flask-cors | scikit-learn | mysql-connector-python | joblib | tensorflow + numpy

        # 1. Cloner le dépôt
            git clone https://github.com/votre-repo/pfe2025.git
            cd pfe2025

        # 2. Créer l'environnement virtuel
            python -m venv venv
            source venv/bin/activate  # Linux/Mac
            venv\Scripts\activate     # Windows

        # 3. Installer les dépendances
            cd optimisation-decoupe/backend
            pip install -r requirements.txt

        # 4. Configurer la base de données MySQL
            CREATE DATABASE subscribers;
            CREATE TABLE subscribers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

    ⚙️ Configuration / Setup
        Modifier les informations de connexion MySQL dans server.py :
            db_config = {
                'host': 'localhost',
                'user': 'votre_utilisateur',
                'password': 'votre_mot_de_passe',
                'database': 'subscribers'
            }
        Démarrer l'API :
            cd optimisation-decoupe/backend
            python server.py

    📡 Utilisation de l'API / API Usage
        Optimisation de découpe
            curl -X POST http://localhost:5000/api/optimize \
            -H "Content-Type: application/json" \
            -d '{
                "panels": {"width": 1200, "height": 2400},
                "pieces": [
                    {"width": 300, "height": 450},
                    {"width": 200, "height": 600}
                ]
            }'
            ou via les inputs dans la page 'Optimisation'
            
        Télécharger le G-code
            curl -O http://localhost:5000/api/download
            ou le button <Télécharger Gcode>

    🧠 Composants IA / AI Components
        Composant:	Description
        Random Forest:	Prédiction du temps de découpe optimal
        Deep Q-Network (DQN):	Optimisation intelligente du placement

        Entraîner le modèle :
            curl -X POST http://localhost:5000/api/train
            ou 
                cd optimisation-decoupe/backend
                python train_dqn_model.py

    🛠 Dépendances Techniques / Tech Stack
        Backend : Flask, MySQL
        Machine Learning : scikit-learn, TensorFlow
        Optimisation : Algorithme de placement glouton
        Sécurité : CORS, validation des entrées

Développé avec ❤️ par Yassine CHATBI & Ilyas BAALOU - GI