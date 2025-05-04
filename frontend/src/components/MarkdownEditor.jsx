import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import styles from "./assets/MarkdownEditor.module.css";

function MermaidDiagram({ code }) {
  useEffect(() => {
    mermaid.init(undefined, `.${styles.mermaidDiagram}`);
  }, [code]);

  return <div className={styles.mermaidDiagram}>{code}</div>;
}

function MarkdownEditor({ content, onSave, isEditable }) {
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    setEditContent(content);
    setEditMode(false);
  }, [content]);

  const handleSave = () => {
    onSave(editContent);
    setEditMode(false);
  };

  // Inside the handlePrint function of MarkdownEditor.jsx

  const handlePrint = () => {
    // We need to wait for mermaid diagrams to render
    setTimeout(() => {
      const printWindow = window.open("", "_blank");

      // Get the complete content with rendered mermaid diagrams
      const contentToPrint = document
        .querySelector(`.${styles.preview}`)
        .cloneNode(true);

      // Create the HTML content with proper styling
      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Document</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 20px;
              color: #333;
              max-width: 100%;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 24px;
              margin-bottom: 16px;
              font-weight: 600;
              line-height: 1.25;
            }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.25em; }
            p { 
              margin-bottom: 16px; 
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            pre {
              background-color: #f6f8fa;
              border-radius: 3px;
              padding: 16px;
              overflow: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
              max-width: 100%;
            }
            code {
              background-color: rgba(27, 31, 35, 0.05);
              border-radius: 3px;
              padding: 0.2em 0.4em;
              font-family: monospace;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            blockquote {
              border-left: 0.25em solid #dfe2e5;
              padding-left: 1em;
              color: #6a737d;
            }
            svg {
              max-width: 100%;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @page {
              size: auto;
              margin: 20mm;
            }
          </style>
        </head>
        <body>
          <div id="content"></div>
          <script>
            document.getElementById('content').innerHTML = ${JSON.stringify(
              contentToPrint.outerHTML
            )};
            window.onload = function() { 
              setTimeout(function() {
                window.print(); 
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

      // Write the content to the new window and trigger print
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }, 1000); // Give diagrams time to render
  };

  const renderers = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      if (!inline && match && match[1] === "mermaid") {
        return <MermaidDiagram code={String(children).replace(/\n$/, "")} />;
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
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
        <button className={styles.button} onClick={handlePrint}>
          Print
        </button>
      </div>
      {editMode ? (
        <textarea
          className={styles.textarea}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      ) : (
        <div
          className={styles.preview}
          onDoubleClick={isEditable ? () => setEditMode(true) : undefined}
        >
          <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default MarkdownEditor;
