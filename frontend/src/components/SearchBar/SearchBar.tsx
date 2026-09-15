import styles from "./SearchBar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export function SearchBar() {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <form className={styles.searchBarContainer}>

      <div className={styles.searchBarInputContainer}>
        <input
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
