import React, { useState, useEffect } from "react";
import TaskSideBar from "../components/TaskSideBar";
import TasksController from "../components/TasksController";
import styles from "./assets/Tasks.module.css";

const TasksPage = () => {
  const [selectedProject, setSelectedProject] = useState({});

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <TaskSideBar onProjectSelect={handleProjectSelect} />
      </div>
      <div className={styles.controller}>
        <TasksController
          project_id={selectedProject.id}
          project_name={selectedProject.name}
        />
      </div>
    </div>
  );
};

export default TasksPage;
