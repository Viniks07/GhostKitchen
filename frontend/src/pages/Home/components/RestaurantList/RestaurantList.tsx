import { useState, useEffect } from "react";
import styles from "./RestaurantList.module.css";
import { GetRestaurants } from "../../../../services/restaurantService";
import type { Restaurant } from "../../../../types/Restaurant";
import { RestaurantListCard } from "./RestaurantCard/RestaurantListCard";

export function RestaurantList() {
  const [allRestaurant, setAllRestaurant] = useState<Restaurant[]>([]);

  useEffect(() => {
    async function loadAllRestaurant() {
      const data = await GetRestaurants();
      setAllRestaurant(data.restaurants);
    }
    loadAllRestaurant();
  }, []);

  return (
    <section className={styles.RestaurantListContainer}>
      <ul className={styles.restaurantList}>
        {allRestaurant.map((restaurant) => (
          <RestaurantListCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </ul>
    </section>
  );
}
