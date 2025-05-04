import React, { useState, useEffect } from "react";
import styles from "./assets/TaskSidebar.module.css";
import { getAllProjects, createProject } from "../api";

function TaskSideBar({ onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [currentProject, setCurrentProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await getAllProjects();
      setProjects(response);
      if (response.length > 0) {
        setCurrentProject(response[0].name);
        onProjectSelect(response[0]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleCreateProject = () => {
    if (newProjectName && newProjectDescription) {
      createProject(newProjectName, newProjectDescription)
        .then(() => {
          alert("Project created successfully");
          fetchProjects();
        })
        .catch((error) => {
          console.error("Error creating project:", error);
          alert("Error creating project");
        });
      setNewProjectName("");
      setNewProjectDescription("");
      setIsCreatingProject(false);
    } else {
      alert("Please fill in all fields");
    }
  };

  const toggleCreateProject = () => {
    if (isCreatingProject) {
      const container = document.querySelector(
        `.${styles.createProjectContainer}`
      );
      container.classList.add(styles.collapsing);
      setTimeout(() => {
        setIsCreatingProject(false);
        container.classList.remove(styles.collapsing);
      }, 300); // Match the CSS transition duration
    } else {
      setIsCreatingProject(true);
    }
  };

  const onProjectSelectHandler = (project) => {
    onProjectSelect(project);
    setCurrentProject(project.name);
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className={styles.sidebar}>
      <h1 className={styles.title}>Tasks Manager</h1>
      <div className={styles.links}>
        <a href="/" className={styles.searchLink}>
          Home
        </a>
        <a href="/search" className={styles.searchLink}>
          Search
        </a>
      </div>
      <div className={styles.breadcrumbs}>
        <span className={styles.breadcrumbsItem}>👉 {currentProject}</span>
      </div>
      <div
        className={`${styles.createProjectContainer} ${
          isCreatingProject ? styles.expanded : ""
        }`}
      >
        <button
          onClick={toggleCreateProject}
          className={styles.createProjectButton}
          style={{ display: isCreatingProject ? "none" : "block" }}
        >
          New Project
        </button>
        {isCreatingProject && (
          <div className={styles.createProjectForm}>
            <div className={styles.createProjectFormRow}>
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div className={styles.createProjectFormRow}>
              <input
                type="text"
                placeholder="Project Description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div className={`${styles.createProjectFormRow} ${styles.buttons}`}>
              <button onClick={handleCreateProject}>Create</button>
              <button
                onClick={toggleCreateProject}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className={styles.projectList}>
        {projects.map((project) => (
          <li key={project.id} className={styles.projectItem}>
            <p onClick={() => onProjectSelectHandler(project)}>
              {project.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskSideBar;
