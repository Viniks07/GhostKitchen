import type { FeaturedProduct } from "../../../../types/Product";
import styles from "./CarouselProductCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { formatPrice } from "../../../../shared/utils/formatPrice";

type CarouselProductCardProps = {
  product: FeaturedProduct;
};

export function CarouselProductCard({ product }: CarouselProductCardProps) {
  return (
    <li className={styles.productCardContainer}>
      <article className={styles.productCard}>
        <div className={styles.imageContainer}>
          <img
            className={styles.productImage}
            src={product.imageUrl}
            alt={`Foto de ${product.description}`}
          />
        </div>
        <div className={styles.infoContainer}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.restaurantName}>{product.restaurant.name}</p>

          <div className={styles.priceRatingRow}>
            <p className={styles.productPrice}>
              {formatPrice(product.priceInCents)}
            </p>

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
