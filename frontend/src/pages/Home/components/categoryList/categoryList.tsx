import { useEffect, useState } from "react";
import styles from "./categoryList.module.css";
import { getCategories } from "../../../../services/categoryService";
import type { Category } from "../../../../types/category";

type CategoryListProps = {
  selectedCategory: number | null;
  selectCategory: (categoryId: number) => void;
};

export function CategoryList({
  selectedCategory,
  selectCategory,
}: CategoryListProps) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadAllCategories() {
      const data = await getCategories();
      setAllCategories(data.categories);
    }
    loadAllCategories();
  }, []);

  return (
    <ul className={styles.categoryList}>
      {allCategories.map((category) => (
        <li key={category.id}>
          <button
            className={`${styles.categoryListOption} ${selectedCategory === category.id ? styles.selectedCategory : ""}`}
            onClick={() => selectCategory(category.id)}
            type="button"
            aria-pressed={selectedCategory === category.id}
          >
            <img
              className={styles.categoryImage}
              src={category.imageUrl}
              alt={`Categoria ${category.name}`}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
