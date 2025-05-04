import React, { useState, useEffect } from "react";
import { fetchFiles, fetchFileContent, saveFileContent } from "../api";
import Sidebar from "../components/Sidebar";
import MarkdownEditor from "../components/MarkdownEditor";
import styles from "./assets/Home.module.css";
import JsonEditor from "../components/JsonEditor";

function Home() {
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFilePath, setSelectedFilePath] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const fileData = await fetchFiles();
        setFiles(fileData);
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };

    loadFiles();
  }, []);

  const handleFileSelect = async (filePath) => {
    try {
      const content = await fetchFileContent(filePath);
      setSelectedFileContent(content);
      setSelectedFilePath(filePath);
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handleSaveContent = async (updatedContent) => {
    try {
      await saveFileContent(selectedFilePath, updatedContent);
      console.log("Content saved successfully:", updatedContent);
      setSelectedFileContent(updatedContent);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar
        files={files}
        onFileSelect={handleFileSelect}
        refreshFiles={() => fetchFiles()}
      />
      {/** Id selecte=d filepath has .md then redirect to markdown editor edlse to json editor */}
      {selectedFilePath.endsWith(".json") ? (
        <JsonEditor
          content={selectedFileContent}
          onSave={handleSaveContent}
          isEditable={false}
        />
      ) : (
        <MarkdownEditor
          content={selectedFileContent}
          onSave={handleSaveContent}
          isEditable={true}
        />
      )}
    </div>
  );
}

export default Home;
