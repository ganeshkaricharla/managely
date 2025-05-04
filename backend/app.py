from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={"*": {"origins": "http://localhost:5173"}})

from routes import files, projects, tasks
app.register_blueprint(files.bp, url_prefix="/")
app.register_blueprint(projects.bp, url_prefix="/api/projects")
app.register_blueprint(tasks.bp, url_prefix="/api/tasks")
# Ensure tasks directory exists


if __name__ == '__main__':
    app.run(debug=True)
