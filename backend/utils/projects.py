import os
import json
import uuid
import shutil
from config import TASK_ROOT_FOLDER
META_DATA_FILE_NAME = 'project.metadata.json'
TASKS_FILE_NAME = 'tasks.json'

class Projects:

    def get_all_projects(self):
        """
        Get all projects from the TASK_ROOT_FOLDER.
        """
        print(f"Retrieving projects from {TASK_ROOT_FOLDER}")
        try:
            if not os.path.exists(TASK_ROOT_FOLDER):
                return False, "Task folder does not exist"

            projects = []
            for project_name in os.listdir(TASK_ROOT_FOLDER):
                project_path = os.path.join(TASK_ROOT_FOLDER, project_name)
                if os.path.isdir(project_path):
                    metadata_file_path = os.path.join(project_path, META_DATA_FILE_NAME)
                    if os.path.exists(metadata_file_path):
                        with open(metadata_file_path, 'r') as f:
                            project_data = json.load(f)
                            projects.append(project_data)
                    tasks_file_path = os.path.join(project_path, TASKS_FILE_NAME)
                    if not os.path.exists(tasks_file_path):
                        with open(tasks_file_path, 'w') as f:
                            json.dump([], f)
                    else:
                        print(f"Tasks file already exists for project: {project_name}")
                        
            return True, projects
        except Exception as e:
            print(f"Error retrieving projects: {e}")
            return False, "An error occurred while retrieving the projects inside"
    
    def create_project(self, project_name, description):
        """
        Create a new project in the TASK_ROOT_FOLDER.
        """
        print(f"Creating project: {project_name}")
        try:

            if not os.path.exists(TASK_ROOT_FOLDER):
                os.makedirs(TASK_ROOT_FOLDER)
            project_id = str(uuid.uuid4())
            folder_name = project_name.replace(" ", "_").lower()
            project_path = os.path.join(TASK_ROOT_FOLDER, folder_name)
            if not os.path.exists(project_path):
                os.makedirs(project_path)
            else:
                return False, "Project already exists"
            metadata_file_path = os.path.join(project_path, META_DATA_FILE_NAME)
            if not os.path.exists(metadata_file_path):
                with open(metadata_file_path, 'w') as f:
                        json.dump({"name": project_name, "description": description, "id": project_id, "path": project_path}, f)
            return True, "Project created successfully"
        except Exception as e:
            print(f"Error creating project: {e}")
            return False, "An error occurred while creating the project"

        except Exception as e:
            print(f"Error creating project: {e}")
            return False, "An error occurred while creating the project"    
          
    def get_project(self, project_id):
        """
        Get a project by its ID.
        """
        print(f"Retrieving project with ID: {project_id}")
        try:
            if not os.path.exists(TASK_ROOT_FOLDER):
                return False, "Task folder does not exist"
            status, projects = self.get_all_projects()
            if not status:
                return False, projects
            
            for project in projects:
                if project['id'] == project_id:
                    return True, project
            return False, "Project not found"
        except Exception as e:
            print(f"Error retrieving project: {e}")
            return False, "An error occurred while retrieving the project"

    def change_project_name(self,project_id, name):
        # create a new folder with the new name
        # copy the contents of the old folder to the new folder
        # delete the old folder
        # update the metadata file with the new name
        # update the path in the metadata file
        # return success or failure
        try:
            if not os.path.exists(TASK_ROOT_FOLDER):
                return False, "Task folder does not exist"
            status, projects = self.get_all_projects()
            if not status:
                return False, projects
            for project in projects:
                if project['id'] == project_id:
                    old_path = project['path']
                    new_path = os.path.join(TASK_ROOT_FOLDER, name.replace(" ", "_").lower())
                    if old_path == new_path:
                        return True, "Project name is already the same"
                    if os.path.exists(new_path):
                        return False, "Project with this name already exists"
                    shutil.copytree(old_path, new_path)
                    project['name'] = name
                    project['path'] = new_path
                    metadata_file_path = os.path.join(new_path, META_DATA_FILE_NAME)
                    with open(metadata_file_path, 'w') as f:
                        json.dump(project, f)
                    # delete the old path folder completely
                    shutil.rmtree(old_path)
                    return True, "Project name changed successfully"
        except Exception as e:
            print(f"Error changing project name: {e}")
            return False, "An error occurred while changing the project name"
        
    def change_project_description(self,project_id, description):
        # update the metadata file with the new description
        # return success or failure
        try:
            if not os.path.exists(TASK_ROOT_FOLDER):
                return False, "Task folder does not exist"
            status, projects = self.get_all_projects()
            if not status:
                return False, projects
            for project in projects:
                if project['id'] == project_id:
                    project['description'] = description
                    metadata_file_path = os.path.join(project['path'], META_DATA_FILE_NAME)
                    with open(metadata_file_path, 'w') as f:
                        json.dump(project, f)
                    return True, "Project description changed successfully"
        except Exception as e:
            print(f"Error changing project description: {e}")
            return False, "An error occurred while changing the project description"

    def update_project(self, project_id, name, description):
        try:
            if not os.path.exists(TASK_ROOT_FOLDER):
                return False, "Task folder does not exist"
            
            if name:
                status, message = self.change_project_name(project_id, name)
                if not status:
                    return False, message
            
            if description:
                status, message = self.change_project_description(project_id, description)
                if not status:
                    return False, message
            return True, "Project updated successfully"
        except Exception as e:
            print(f"Error Updating project: {e}")
            return False, "An errot occured in process of updating"
            

    def delete_project(self, project_id):
        """
        Delete a project by its ID.
        """
        print(f"Deleting project with ID: {project_id}")
        try:
            if not os.path.exists(TASK_ROOT_FOLDER):
                return False, "Task folder does not exist"
            status, projects = self.get_all_projects()
            if not status:
                return False, projects
            
            for project in projects:
                if project['id'] == project_id:
                    project_path = project['path']
                    if os.path.exists(project_path):
                        shutil.rmtree(project_path)
                    else:
                        return False, "Project folder does not exist"
                    
                    return True, "Project deleted successfully"
            return False, "Project not found"
        except Exception as e:
            print(f"Error deleting project: {e}")
            return False, "An error occurred while deleting the project"