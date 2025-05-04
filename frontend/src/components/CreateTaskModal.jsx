import React from "react";
import styles from "./assets/CreateTaskModal.module.css";
import { useState } from "react";
import { createTask } from "../api";
function CreateTaskModal({ project_id, isOpen, onClose }) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [taskPriority, setTaskPriority] = useState("low");

  const handleCreateTask = () => {
    // Logic to create a new task
    console.log("Create task button clicked for project:", project_id);
    const taskData = {
      name: taskName,
      description: taskDescription,
      status: taskStatus,
      priority: taskPriority,
    };
    createTask(project_id, taskData)
      .then(() => {
        console.log("Task created successfully");
        onClose();
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
    setTaskName("");
    setTaskDescription("");
    setTaskStatus("pending");
    setTaskPriority("low");
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className={styles.modal_overlay} onClick={onClose}>
        {" "}
      </div>
      <div className={styles.modal}>
        <h2>Create New Task</h2>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="deferred">Deferred</option>
        </select>
        <select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleCreateTask}>Create Task</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default CreateTaskModal;
