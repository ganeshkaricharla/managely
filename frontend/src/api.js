import axios from "axios";
import { API_BASE_URL } from "./config";

// Fetch all files
export const fetchFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/files`);
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

// Fetch file content
export const fetchFileContent = async (filePath) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/file?path=${encodeURIComponent(filePath)}`
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching file content:", error);
    throw error;
  }
};

// Save file content
export const saveFileContent = async (filePath, content) => {
  try {
    await axios.post(`${API_BASE_URL}/api/file`, {
      path: filePath,
      content,
    });
  } catch (error) {
    console.error("Error saving file content:", error);
    throw error;
  }
};

// Create a new folder
export const createFolder = async (path, name) => {
  try {
    await axios.post(`${API_BASE_URL}/api/create_folder`, {
      path,
      name,
    });
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

// Create a new file
export const createFile = async (path, content = "") => {
  try {
    await axios.post(`${API_BASE_URL}/api/create_file`, {
      path,
      content,
    });
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

// Fetch all projects
export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/projects/`);
    return response.data.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProject = async (projectId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/projects/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};
// Create a new project
export const createProject = async (name, description) => {
  try {
    await axios.post(`${API_BASE_URL}/api/projects/`, { name, description });
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Update a project
export const updateProject = async (projectId, updatedData) => {
  try {
    await axios.put(`${API_BASE_URL}/api/projects/${projectId}`, updatedData);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Fetch tasks for a project
export const getTasks = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tasks/${projectId}`);
    return response.data.tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Create a new task
export const createTask = async (projectId, taskData) => {
  try {
    await axios.post(`${API_BASE_URL}/api/tasks/`, {
      ...taskData,
      project_id: projectId,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update a task
export const updateTask = async (projectId, taskId, updatedData) => {
  try {
    await axios.put(`${API_BASE_URL}/api/tasks/${projectId}`, {
      task_id: taskId,
      ...updatedData,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (projectId, taskId) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/tasks/${projectId}/task/${taskId}`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
