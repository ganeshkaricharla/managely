import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTimeline } from "../api";
import styles from "./assets/Timeline.module.css";

const Timeline = () => {
  const { projectId, taskId } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const data = await fetchTimeline(projectId, taskId);
        setTimeline(data);
      } catch (err) {
        setError("Failed to load timeline. Please try again later.");
      }
    };

    loadTimeline();
  }, [projectId, taskId]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Task Timeline</h1>
      <ul className={styles.timelineList}>
        {timeline.map((event, index) => (
          <li key={index} className={styles.timelineItem}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <span>{event.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
