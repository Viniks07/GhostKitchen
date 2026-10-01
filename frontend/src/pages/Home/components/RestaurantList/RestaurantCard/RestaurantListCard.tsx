import type { Restaurant } from "../../../../../types/Restaurant";
import styles from "./RestaurantListCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

type RestaurantListCardProps = {
  restaurant: Restaurant;
};

export function RestaurantListCard({ restaurant }: RestaurantListCardProps) {
  return (
    <li
      className={`${styles.RestaurantListCard} ${!restaurant.isOpen ? styles.closed : ""}`}
    >
      <article className={styles.restaurantContainer}>
        <div className={styles.imageContainer}>
          <img
            className={styles.restaurantImage}
            src={restaurant.imageUrl}
            alt={`Foto do restaurante ${restaurant.name}`}
          />
        </div>
        <div className={styles.restaurantInfoContainer}>
          <h3 className={styles.restaurantName}> {restaurant.name} </h3>
          <p className={styles.restaurantDescription}>
            “{restaurant.description}”
          </p>
          <div className={styles.restaurantRatingContainer}>
            <div className={styles.restaurantRating}>
              <FontAwesomeIcon className={styles.starIcon} icon={faStar} />
              4,8
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
