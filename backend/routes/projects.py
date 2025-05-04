from flask import Blueprint, request, jsonify
from config import TASK_ROOT_FOLDER
from utils.projects import Projects

projects_o = Projects()

bp = Blueprint('projects', __name__)


@bp.route('/', methods=['POST'])
def create_project():
    try:
        data = request.get_json()
        project_name = data.get('name')
        description = data.get('description')

        print(f"Creating project with name: {project_name} and description: {description}")
        if not project_name:
            return jsonify({"error": "Project name is required"}), 400
        
        status, message = projects_o.create_project(project_name, description)
        if not status:
            return jsonify({"error": message}), 500
        
        return jsonify({"message": message}), 201
    except Exception as e:
        print(f"Error creating project: {e}")
        return jsonify({"error": "An error occurred while creating the project"}), 500

@bp.route('/', methods=['GET'])
def get_projects():
    print("Retrieving all projects")
    try:
        status, projects = projects_o.get_all_projects()
        if not status:
            return jsonify({"error": projects}), 500

        if projects:
            return jsonify({"projects": projects}), 200
        else:
            return jsonify({"error": "No projects found"}), 404
    except Exception as e:
        print(f"Error retrieving projects: {e}")
        return jsonify({"error": "An error occurred while retrieving the projects"}), 500

@bp.route('/<project_id>', methods=['GET'])
def get_project(project_id):
    try:
        status,project = projects_o.get_project(project_id)
        if not status:
            return jsonify({"error": project}), 500
        if project:
            return jsonify({"data": project}), 200
        return jsonify({"error": "Project not found"}), 404
    
    except Exception as e:
        print(f"Error retrieving project: {e}")
        return jsonify({"error": "An error occurred while retrieving the project"}), 500


@bp.route('/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        status, message = projects_o.delete_project(project_id)
        if not status:
            return jsonify({"error": message}), 500
        return jsonify({"message": message}), 200
    except Exception as e:
        print(f"Error deleting project: {e}")
        return jsonify({"error": "An error occurred while deleting the project"}), 500

@bp.route('/<project_id>', methods=['PUT'])
def update_project(project_id):
    try:
        data = request.get_json()
        project_name = data.get('name')
        description = data.get('description')

        status, message = projects_o.update_project(project_id, project_name, description)
        if not status:
            return jsonify({"error": message}), 500
        
        return jsonify({"message": message}), 200
    except Exception as e:
        print(f"Error updating project: {e}")
        return jsonify({"error": "An error occurred while updating the project"}), 500
