import os
import json
import uuid
import shutil
from config import TASK_ROOT_FOLDER
from utils.projects import Projects

META_DATA_FILE_NAME = 'project.metadata.json'
TASKS_FILE_NAME = 'tasks.json'

class Tasks:

    def __init__(self):
        self.projects_o = Projects()
        self.tasks = []
    
    def save_tasks(self, project_path):
        """
        Save the tasks to the TASK_ROOT_FOLDER.
        """
        try:
            if not os.path.exists(project_path):
                return False, "Project folder does not exist"
            tasks_file_path = os.path.join(project_path, TASKS_FILE_NAME)
            with open(tasks_file_path, 'w') as f:
                json.dump(self.tasks, f)
            return True
        except Exception as e:
            print(f"Error saving tasks: {e}")
            return False
    
 
    def get_tasks(self, project_id):
        """
        Get the tasks for a specific project.
        """
        try:
            status, project = self.projects_o.get_project(project_id)
            if not status:
                return False, "Project not found"
            project_path = project.get('path')
            if not os.path.exists(project_path):
                return False, "Project folder does not exist"
            tasks_file_path = os.path.join(project_path, TASKS_FILE_NAME)
            if not os.path.exists(tasks_file_path):
                return False, "Tasks file does not exist"
            with open(tasks_file_path, 'r') as f:
                self.tasks = json.load(f)
                
            return True, self.tasks
        except Exception as e:
            print(f"Error getting tasks: {e}")
            return False, "An error occurred while getting the tasks"
        
    def create_task(self, task_name, description, project_id, status="pending", priority="low"):
        """
        Create a new task in the TASK_ROOT_FOLDER.
        """
        print(f"Creating task: {task_name}")
        try:
            if not os.path.exists(TASK_ROOT_FOLDER):
                return False, "Task folder does not exist"
            
            project_status, project = self.projects_o.get_project(project_id)
            project_path = project.get('path')
            if not os.path.exists(project_path):
                return False, "Project folder does not exist"
            

            task_file_path = os.path.join(project_path, TASKS_FILE_NAME)
            if not os.path.exists(task_file_path):
                with open(task_file_path, 'w') as f:
                    json.dump([], f)
            with open(task_file_path, 'r') as f:
                self.tasks = json.load(f)
            

            task_id = str(uuid.uuid4())
            task = {
                "name": task_name,
                "description": description,
                "id": task_id,
                "project_id": project_id,
                "status": status,
                "priority": priority
            }
            self.tasks.append(task)
            self.save_tasks(project_path=project_path)
            return True, "Task created successfully"
        except Exception as e:
            print(f"Error creating task: {e}")
            return False, "An error occurred while creating the task"

    def delete_task(self, task_id, project_id):
        """
        Delete a task from the TASK_ROOT_FOLDER.
        """
        try:
            status, project = self.projects_o.get_project(project_id)
            if not status:
                return False, "Project not found"
            project_path = project.get('path')
            if not os.path.exists(project_path):
                return False, "Project folder does not exist"
            tasks_file_path = os.path.join(project_path, TASKS_FILE_NAME)
            if not os.path.exists(tasks_file_path):
                return False, "Tasks file does not exist"
            with open(tasks_file_path, 'r') as f:
                tasks = json.load(f)
            
            task_to_delete = None
            for task in tasks:
                if task['id'] == task_id:
                    task_to_delete = task
                    break
            
            if not task_to_delete:
                return False, "Task not found"
            
            tasks.remove(task_to_delete)
            with open(tasks_file_path, 'w') as f:
                json.dump(tasks, f)
            
            return True, "Task deleted successfully"
        except Exception as e:
            print(f"Error deleting task: {e}")
            return False, "An error occurred while deleting the task"
    
    def update_task(self, task_id, project_id, task_name=None, description=None, status=None):
        """
        Update a task in the TASK_ROOT_FOLDER.
        """
        try:
            status, project = self.projects_o.get_project(project_id)
            if not status:
                return False, "Project not found"
            project_path = project.get('path')
            if not os.path.exists(project_path):
                return False, "Project folder does not exist"
            tasks_file_path = os.path.join(project_path, TASKS_FILE_NAME)
            if not os.path.exists(tasks_file_path):
                return False, "Tasks file does not exist"
            with open(tasks_file_path, 'r') as f:
                tasks = json.load(f)
            
            task_to_update = None
            for task in tasks:
                if task['id'] == task_id:
                    task_to_update = task
                    break
            
            if not task_to_update:
                return False, "Task not found"
            
            if task_name:
                task_to_update['name'] = task_name
            if description:
                task_to_update['description'] = description
            if status:
                task_to_update['status'] = status
            
            with open(tasks_file_path, 'w') as f:
                json.dump(tasks, f)
            
            return True, "Task updated successfully"
        except Exception as e:
            print(f"Error updating task: {e}")
            return False, "An error occurred while updating the task"
    
    def get_task(self, task_id, project_id):
        """
        Get a specific task from the TASK_ROOT_FOLDER.
        """
        try:
            status, project = self.projects_o.get_project(project_id)
            if not status:
                return False, "Project not found"
            project_path = project.get('path')
            if not os.path.exists(project_path):
                return False, "Project folder does not exist"
            tasks_file_path = os.path.join(project_path, TASKS_FILE_NAME)
            if not os.path.exists(tasks_file_path):
                return False, "Tasks file does not exist"
            with open(tasks_file_path, 'r') as f:
                tasks = json.load(f)
            
            for task in tasks:
                if task['id'] == task_id:
                    return True, task
            
            return False, "Task not found"
        except Exception as e:
            print(f"Error getting task: {e}")
            return False, "An error occurred while getting the task"

