import React, { useState, useEffect } from "react";
import styles from "./assets/TaskList.module.css";
import { getTasks, deleteTask } from "../api";
import Task from "./Task";

function TaskList({ project_id, refreshTasks }) {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("inprogress"); // For filtering by status
  const [sortCriteria, setSortCriteria] = useState("status"); // For sorting

  const fetchTasks = async () => {
    try {
      const response = await getTasks(project_id);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const applyFiltersAndSorting = () => {
    let filteredTasks = [...tasks];

    // Apply filtering
    if (filterStatus) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filterStatus
      );
    }

    // Apply sorting
    const statusOrder = {
      inprogress: 1,
      pending: 2,
      completed: 3,
      deferred: 4,
    };
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    filteredTasks.sort((a, b) => {
      if (sortCriteria === "status") {
        return statusOrder[a.status] - statusOrder[b.status];
      } else if (sortCriteria === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

    return filteredTasks;
  };

  useEffect(() => {
    if (project_id) {
      fetchTasks();
    }
  }, [project_id, refreshTasks]);

  const filteredAndSortedTasks = applyFiltersAndSorting();

  return (
    <div>
      {/* Filter and Sort Controls */}
      <div className={styles.controls}>
        <label className={styles.filter_label}>
          Filter By Status: &nbsp;
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="inprogress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="deferred">Deferred</option>
          </select>
        </label>
        <label className={styles.filter_label}>
          Sort by: &nbsp;
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="priority">Priority</option>
          </select>
        </label>
      </div>

      {/* Task List */}
      <div className={styles.task_list_items} aria-label="Task List">
        {filteredAndSortedTasks.length > 0 ? (
          filteredAndSortedTasks.map((task) => (
            <Task key={task.id} task={task} />
          ))
        ) : (
          <div className={styles.task_item} role="listitem">
            <p>No tasks available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskList;
