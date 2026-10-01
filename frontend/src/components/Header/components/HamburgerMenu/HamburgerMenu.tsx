import styles from "./HamburgerMenu.module.css";

type HamburgerMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function HamburgerMenu({ isOpen, onToggle }: HamburgerMenuProps) {
  return (
    <button
      className={`${styles.menu} ${isOpen ? styles.open : ""}`}
      aria-label={isOpen ? "Fechar menu" : "Abrir Menu"}
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <span></span>
    </button>
  );
}
