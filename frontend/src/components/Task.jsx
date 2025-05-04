import styles from "./assets/Task.module.css";

function Task({ task }) {
  return (
    <div
      className={`${styles.taskCard} ${styles[`taskcard_${task.priority}`]} ${
        styles[`taskcard_${task.status}`]
      }`}
    >
      <div className={styles.taskHeader}>
        <h2 className={styles.taskName}>{task.name}</h2>
        {/* <p className={styles.taskDescription}>{task.description}</p> */}
      </div>
      <div className={styles.taskPills}>
        <p
          className={`${styles.taskStatus} ${
            styles[`taskstatus_${task.status}`]
          }`}
        >
          {task.status}
        </p>
        <p
          className={`${styles.taskPriority} ${
            styles[`taskpriority_${task.priority}`]
          }`}
        >
          {task.priority}
        </p>
      </div>
    </div>
  );
}

export default Task;
