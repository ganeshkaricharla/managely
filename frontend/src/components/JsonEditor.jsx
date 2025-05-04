import React, { useState } from "react";
import styles from "./assets/JsonEditor.module.css";

function JsonEditor({ content, onSave, isEditable }) {
  const [editMode, setEditMode] = useState(false);
  const [jsonContent, setJsonContent] = useState(content);
  const [error, setError] = useState(null);

  const handleContentChange = (event) => {
    const updatedContent = event.target.value;
    setJsonContent(updatedContent);

    try {
      JSON.parse(updatedContent);
      setError(null);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  const handleSave = () => {
    if (!error) {
      onSave(jsonContent);
      setEditMode(false);
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.controls}>
        {isEditable && (
          <>
            <button
              className={styles.button}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Preview" : "Edit"}
            </button>
            {editMode && (
              <button className={styles.button} onClick={handleSave}>
                Save
              </button>
            )}
          </>
        )}
      </div>
      {editMode ? (
        <textarea
          className={styles.textarea}
          value={jsonContent}
          onChange={handleContentChange}
        />
      ) : (
        <pre className={styles.preview}>
          {JSON.stringify(JSON.parse(content), null, 2)}
        </pre>
      )}
    </div>
  );
}

export default JsonEditor;
