import logoImage from "../../assets/images/logo/main-icon.svg"
import { HamburgerMenu } from "./components/HamburgerMenu/HamburgerMenu";
import gpsIcon from "../../assets/images/logo/gps-icon.svg"
import styles from "./Header.module.css";

type HeaderProps = {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
};

export function Header({ isMenuOpen, onToggleMenu }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.profileImageContainer}>
        <img
          className={styles.profileImage}
          src={logoImage}
          alt="Sua foto de perfil"
        />
      </div>
      <div className={styles.addressContainer}>
        <div className={styles.gpsIconContainer}>
          <img src={gpsIcon} alt="" />  
        </div>
        <p className={styles.address}>Rua das Flores, 123</p>
      </div>
      <div className={styles.hamburgerMenuContainer}>
        <HamburgerMenu isOpen={isMenuOpen} onToggle={onToggleMenu} />
      </div>
    </header>
  );
}
