import { Header } from "../../components/Header/Header";
import { SearchBar } from "../../components/SearchBar/SearchBar";

import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <div className={styles.pageBody}>
      <Header name="Vinícius" gender="M"/>
      <SearchBar/>
    </div>
  );
}
