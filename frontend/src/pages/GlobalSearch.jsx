import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import styles from "./assets/GlobalSearch.module.css";
import MarkdownEditor from "../components/MarkdownEditor";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/search?query=${query}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Global Search</h1>
      <div className={styles.searchBox}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>
      <ul className={styles.resultsList}>
        {results.map((result, index) => (
          <li key={index} className={styles.resultItem}>
            <Link
              to={`/?path=${encodeURIComponent(result.path)}`}
              className={styles.resultLink}
            >
              <h3 className={styles.resultTitle}>{result.name}</h3>
              <p className={styles.resultPath}>{result.path}</p>
            </Link>
            <ul className={styles.matchList}>
              {result.matches.map((match, matchIndex) => (
                <li key={matchIndex} className={styles.matchItem}>
                  {match}
                </li>
              ))}
            </ul>
            {result.preview && (
              <MarkdownEditor content={result.preview} isEditable={false} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GlobalSearch;
