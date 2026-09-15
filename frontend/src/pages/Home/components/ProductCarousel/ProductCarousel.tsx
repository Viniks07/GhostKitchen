import { useEffect, useState } from "react";
import type { FeaturedProduct } from "../../../../types/Product";
import { GetFeaturedProducts } from "../../../../services/productService";

import { CarouselProductCard } from "./components/CarouselProductCard/CarouselProductCard";

export function ProductCarousel() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    [],
  );

  useEffect(() => {
    async function loadFeaturedProducts() {
      const data = await GetFeaturedProducts();

      setFeaturedProducts(data.products);
    }
    loadFeaturedProducts();
  }, []);

  return (<div>
    <ul>{featuredProducts.map((product) => { 
      return <CarouselProductCard key={`${product.id}`} product={product}/>
      })}
      </ul>
  </div>);
}
