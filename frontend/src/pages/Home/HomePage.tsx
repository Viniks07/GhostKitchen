import { Header } from "../../components/Header/Header";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { ProductCarousel } from "../../components/ProductCarousel/ProductCarousel";
import styles from "./HomePage.module.css";
import { CategoryList } from "./components/categoryList/categoryList";
import { RestaurantList } from "./components/RestaurantList/RestaurantList";
import { Modal } from "../../components/Modal/Modal";
import { useState } from "react";

export function HomePage() {
  const [isHamburguerMenuOpen, setIsHamburguerMenuOpen] = useState(false);
  const [categorySelected, setCategorySelected] = useState<number | null>(null);

  function handleToggleHamburguerMenu() {
    setIsHamburguerMenuOpen((currentValue) => !currentValue);
  }

  function handleSelectCategory(categoryId: number) {
    setCategorySelected((currentValue) =>
      currentValue === categoryId ? null : categoryId,
    );
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.homePageContent}>
        <Header
          isMenuOpen={isHamburguerMenuOpen}
          onToggleMenu={handleToggleHamburguerMenu}
        />
        <Modal isOpen={isHamburguerMenuOpen} />
        <main>
          <SearchBar />
          <ProductCarousel />
          <h2 className={styles.sectionTitles}>Categorias</h2>
          <CategoryList
            selectedCategory={categorySelected}
            selectCategory={handleSelectCategory}
          />
          <h2 className={styles.sectionTitles}>Restaurantes</h2>
          <RestaurantList />
        </main>
        <footer></footer>
      </div>
    </div>
  );
}
