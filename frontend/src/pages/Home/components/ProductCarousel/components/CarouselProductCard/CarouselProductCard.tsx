import type { FeaturedProduct } from "../../../../../../types/Product"


type CarouselProductCardProps = {
    product:FeaturedProduct,
}

export function CarouselProductCard({product}:CarouselProductCardProps){
    return(
        <li>{product.name}</li>
    )
}