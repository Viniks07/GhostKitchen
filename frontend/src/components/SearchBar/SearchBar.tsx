import styles from "./SearchBar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export function SearchBar() {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <form className={styles.searchBar}>
      <label htmlFor="searchBar" className={styles.searchBarTitle}>
        Descubra sua próxima refeição
      </label>
      <div className={styles.searchBarInputContainer}>
        <input
          id="searchBar"
          className={styles.searchBarInput}
          type="search"
          placeholder="O que vai pedir hoje?"
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
        <button type="button" className={styles.searchBarButton}>
          <FontAwesomeIcon
            className={`${styles.searchBarButtonIcon} ${
              inputFocused
                ? styles.searchBarButtonIconFocused
                : styles.searchBarButtonIconUnfocused
            }`}
            icon={inputFocused ? faXmark : faMagnifyingGlass}
          />
        </button>
      </div>
    </form>
  );
}
