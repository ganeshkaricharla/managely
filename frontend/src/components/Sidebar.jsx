import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./assets/Sidebar.module.css";
import { API_BASE_URL } from "../config";

function Sidebar({ files, onFileSelect, refreshFiles }) {
  const [currentPath, setCurrentPath] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  const getCurrentFolder = () => {
    let current = { children: files };
    for (const folder of currentPath) {
      const foundFolder = current.children.find(
        (item) => item.name === folder && item.type === "folder"
      );
      if (foundFolder) {
        current = foundFolder;
      } else {
        return []; // Return an empty array if the folder is not found
      }
    }
    return Array.isArray(current.children) ? current.children : []; // Ensure it always returns an array
  };

  const handleItemClick = (item) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, item.name]);
    } else {
      onFileSelect(item.path);
    }
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleCreateFolder = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/create_folder`, {
        path: currentPath.join("/"),
        name: newItemName,
      });
      setIsCreatingFolder(false);
      setNewItemName("");
      refreshFiles();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleCreateFile = async () => {
    try {
      let path = "";
      if (currentPath.length === 0) {
        path = newItemName;
      } else {
        path = `${currentPath.join("/")}/${newItemName}`;
      }
      await axios.post(`${API_BASE_URL}/api/create_file`, {
        path: path,
        content: "",
      });
      setIsCreatingFile(false);
      setNewItemName("");
      refreshFiles();
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const currentItems = getCurrentFolder();
  const folders = currentItems.filter((item) => item.type === "folder");
  const fileItems = currentItems.filter((item) => item.type === "file");

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>File Explorer</h2>
      <div className={styles.links}>
        <Link to="/tasks" className={styles.searchLink}>
          Tasks
        </Link>
        <Link to="/search" className={styles.searchLink}>
          Search
        </Link>
      </div>

      <div className={styles.breadcrumbs}>
        <span onClick={() => setCurrentPath([])}>👉</span>
        {currentPath.map((folder, index) => (
          <React.Fragment key={index}>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span onClick={() => handleBreadcrumbClick(index)}>
              📁 {folder}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.createOptions}>
        <button onClick={() => setIsCreatingFolder(true)}>New Folder</button>
        <button onClick={() => setIsCreatingFile(true)}>New File</button>
      </div>
      {isCreatingFolder && (
        <div className={styles.modal}>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Folder name"
          />
          <button onClick={handleCreateFolder}>Create</button>
          <button onClick={() => setIsCreatingFolder(false)}>Cancel</button>
        </div>
      )}
      {isCreatingFile && (
        <div className={styles.modal}>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="File name"
          />
          <button onClick={handleCreateFile}>Create</button>
          <button onClick={() => setIsCreatingFile(false)}>Cancel</button>
        </div>
      )}
      <ul className={styles.fileTree}>
        {folders.map(
          (item) =>
            item.name !== "Tasks" && (
              <li
                key={item.name}
                className={styles.folderItem}
                onClick={() => handleItemClick(item)}
              >
                📁 {item.name}
              </li>
            )
        )}
        {fileItems.map((item) => (
          <li
            key={item.path}
            className={styles.fileItem}
            onClick={() => handleItemClick(item)}
          >
            📄 {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
