from flask import Blueprint, request, jsonify
from config import TASK_ROOT_FOLDER
from utils.tasks import Tasks
from utils.projects import Projects

tasks_o = Tasks()
projects_o = Projects()
bp = Blueprint('tasks', __name__)

@bp.route('/', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        task_name = data.get('name')
        description = data.get('description')
        project_id = data.get('project_id')
        status = data.get('status', 'pending')  # Default to 'pending' if not provided
        priority = data.get('priority', 'low')  # Default to 'low' if not provided
        print(f"Creating task with name: {task_name}, description: {description}, status: {status}, and project_id: {project_id}")
        if not task_name or not project_id:
            return jsonify({"error": "Task name and project ID are required"}), 400

        status, message = tasks_o.create_task(task_name, description, project_id, status,priority)
        if not status:
            return jsonify({"error": message}), 500

        return jsonify({"message": message}), 201
    except Exception as e:
        print(f"Error creating task: {e}")
        return jsonify({"error": "An error occurred while creating the task"}), 500

@bp.route('/<project_id>', methods=['GET'])
def get_tasks(project_id):
    try:
        status, tasks = tasks_o.get_tasks(project_id)
        if not status:
            return jsonify({"error": tasks}), 500

        return jsonify({"tasks": tasks}), 200
    except Exception as e:
        print(f"Error getting tasks: {e}")
        return jsonify({"error": "An error occurred while getting the tasks"}), 500

@bp.route('/<project_id>', methods=['PUT'])
def update_task(project_id):
    try:
        data = request.get_json()
        task_id = data.get('task_id')
        task_name = data.get('name')
        description = data.get('description')

        if not task_id or not task_name or not project_id:
            return jsonify({"error": "Task ID, name, and project ID are required"}), 400

        status, message = tasks_o.update_task(task_id, task_name, description, project_id)
        if not status:
            return jsonify({"error": message}), 500

        return jsonify({"message": message}), 200
    except Exception as e:
        print(f"Error updating task: {e}")
        return jsonify({"error": "An error occurred while updating the task"}), 500
    
@bp.route('/<project_id>/task/<task_id>', methods=['DELETE'])
def delete_task(project_id,task_id):
    try:
        print(f"Deleting task with ID: {task_id} from project ID: {project_id}")

        if not task_id or not project_id:
            return jsonify({"error": "Task ID and project ID are required"}), 400

        status, message = tasks_o.delete_task(task_id, project_id)
        if not status:
            return jsonify({"error": message}), 500

        return jsonify({"message": message}), 200
    except Exception as e:
        print(f"Error deleting task: {e}")
        return jsonify({"error": "An error occurred while deleting the task"}), 500

@bp.route('/<project_id>/task/<task_id>', methods=['GET'])
def get_task(project_id, task_id):
    try:
        status, task = tasks_o.get_task(task_id, project_id)
        if not status:
            return jsonify({"error": task}), 500

        return jsonify({"task": task}), 200
    except Exception as e:
        print(f"Error getting task: {e}")
        return jsonify({"error": "An error occurred while getting the task"}), 500

