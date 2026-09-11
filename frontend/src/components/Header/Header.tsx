import { HamburgerMenu } from "../HamburgerMenu/HamburgerMenu";

import styles from "./Header.module.css";

type HeaderProps = {
  name: string;
  gender: string;
};

export function Header({ name, gender }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.profileImageContainer}>
        <img
          className={styles.profileImage}
          src="https://placehold.co/56x56/png"
          alt="Sua foto de perfil"
        />
        <div className={styles.textContainer}>
          <p className={styles.profileText}>
            {`Bem vind${gender === "M" ? "o" : "a"} de volta,`}
          </p>
          <strong className={styles.clientName}>{name}</strong>
        </div>
      </div>
      <div className={styles.hamburgerMenuContainer}>
        <HamburgerMenu />
      </div>
    </header>
  );
}
