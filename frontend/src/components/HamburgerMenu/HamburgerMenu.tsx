import { useState } from "react";
import styles from "./HamburgerMenu.module.css";

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      className={`${styles.menu} ${isOpen ? styles.open : ""}`}
      aria-label={isOpen? "Fechar menu": "Abrir Menu"}
      aria-expanded={isOpen}
      onClick={() => setIsOpen((previous) => !previous)}
    >
      <span></span>
    </button>
  );
}
