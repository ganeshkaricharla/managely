import React, { useState, useEffect, use } from "react";
import styles from "./assets/TasksController.module.css";
import { getProject, createTask } from "../api";
import TaskList from "./TaskList";
import CreateTaskModal from "./CreateTaskModal";
const TasksController = ({ project_id, project_name }) => {
  const [project, setProject] = useState(null);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const fetchProject = async () => {
    try {
      const response = await getProject(project_id);
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const handleCreateTaskModalOpen = () => {
    setCreateTaskModalOpen(!createTaskModalOpen);
    setRefreshTasks(!refreshTasks);
  };

  const handleCreateTask = async () => {
    // Logic to create a new task
    console.log("Create task button clicked for project:", project_id);
    setCreateTaskModalOpen(true);
  };

  useEffect(() => {
    if (project_id) {
      fetchProject();
    }
  }, [project_id]);

  return project_id ? (
    <div className={styles.container}>
      <h2 className={styles.title}>{project_name}</h2>
      <p className={styles.title_description}>
        {project && project.description}
      </p>
      <button
        className={styles.task_controller_button}
        onClick={handleCreateTask}
      >
        + Create
      </button>
      <hr />

      <TaskList project_id={project_id} refreshTasks={refreshTasks} />
      <CreateTaskModal
        project_id={project_id}
        isOpen={createTaskModalOpen}
        onClose={handleCreateTaskModalOpen}
      />
    </div>
  ) : (
    <div className={styles.loading}>
      <p>No Project Selected</p>
    </div>
  );
};

export default TasksController;
