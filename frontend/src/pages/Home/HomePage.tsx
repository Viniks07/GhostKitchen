import { Header } from "../../components/Header/Header";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { ProductCarousel } from "./components/ProductCarousel/ProductCarousel";

import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <div className={styles.pageBody}>
      <Header name="Vinícius" gender="M" />
      <h1 className={styles.searchBarTitle}>Descubra sua próxima refeição</h1>
      <SearchBar />
      <ProductCarousel />
    </div>
  );
}
