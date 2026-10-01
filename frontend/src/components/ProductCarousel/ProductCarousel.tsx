import { useEffect, useState, useRef, useLayoutEffect } from "react";
import type { FeaturedProduct } from "../../types/Product";
import { GetFeaturedProducts } from "../../services/productService";
import { RESUME_DELAY } from "../../shared/constants/ui-rules";

import { CarouselProductCard } from "./components/CarouselProductCard/CarouselProductCard";

import styles from "./ProductCarousel.module.css";

export function ProductCarousel() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    [],
  );
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  const carouselRef = useRef<HTMLUListElement>(null);
  const isPointerOverRef = useRef(false);
  const isInteractingRef = useRef(false);
  const resumeAtRef = useRef(0);
  const scrollAccumulatorRef = useRef(0);

  function handlePointerEnter(event: React.PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;

    isPointerOverRef.current = true;
  }

  function handleTouchStart() {
    isInteractingRef.current = true;
  }

  function handleTouchEnd() {
    isInteractingRef.current = false;
    resumeAtRef.current = performance.now() + RESUME_DELAY;
  }

  function handleTouchCancel() {
    isInteractingRef.current = false;
    resumeAtRef.current = performance.now() + RESUME_DELAY;
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;

    isPointerOverRef.current = false;
    resumeAtRef.current = performance.now() + RESUME_DELAY;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;

    isInteractingRef.current = true;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;

    isInteractingRef.current = false;
    resumeAtRef.current = performance.now() + RESUME_DELAY;
  }

  function handleWheel() {
    resumeAtRef.current = performance.now() + RESUME_DELAY;
  }

  function handleScroll() {
    const carousel = carouselRef.current;

    if (!carousel || featuredProducts.length === 0) return;

    const card = carousel.children[0] as HTMLElement;

    if (!card) return;

    const carouselStyles = getComputedStyle(carousel);
    const gap = parseFloat(carouselStyles.columnGap) || 0;

    const itemWidth = card.offsetWidth + gap;
    const copyWidth = itemWidth * featuredProducts.length;

    if (carousel.scrollLeft < copyWidth * 0.5) {
      carousel.scrollLeft += copyWidth;
    }

    if (carousel.scrollLeft > copyWidth * 2.5) {
      carousel.scrollLeft -= copyWidth;
    }

    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;

    let closestCardIndex = 0;
    let smallestDistance = Infinity;

    Array.from(carousel.children).forEach((child, index) => {
      const card = child as HTMLElement;

      const distance = Math.abs(card.offsetLeft - carouselCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestCardIndex = index;
      }
    });

    const realProductIndex = closestCardIndex % featuredProducts.length;

    setActiveProductIndex(realProductIndex);
  }

  useEffect(() => {
    async function loadFeaturedProducts() {
      const data = await GetFeaturedProducts();

      setFeaturedProducts(data.products);
    }
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    if (featuredProducts.length === 0) return;

    let animationFrameId: number;
    let previousTime = performance.now();

    const speed = 30;

    function animate(currentTime: number) {
      const carousel = carouselRef.current;

      if (!carousel) return;

      const elapsedTime = (currentTime - previousTime) / 1000;
      previousTime = currentTime;

      const canAutoScroll =
        !isPointerOverRef.current &&
        !isInteractingRef.current &&
        currentTime >= resumeAtRef.current;

      if (canAutoScroll) {
        scrollAccumulatorRef.current += speed * elapsedTime;

        if (scrollAccumulatorRef.current >= 1) {
          const pixels = Math.floor(scrollAccumulatorRef.current);

          carousel.scrollLeft += pixels;
          scrollAccumulatorRef.current -= pixels;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [featuredProducts]);

  useLayoutEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || featuredProducts.length === 0) return;

    const middleIndex = Math.floor(carousel.children.length / 2);
    const targetCard = carousel.children[middleIndex] as HTMLElement;

    if (!targetCard) return;

    carousel.scrollLeft =
      targetCard.offsetLeft -
      (carousel.clientWidth - targetCard.offsetWidth) / 2;
  }, [featuredProducts]);

  const carouselProducts = [
    ...featuredProducts,
    ...featuredProducts,
    ...featuredProducts,
  ];

  return (
    <section className={styles.productCarousel}>
      <ul
        className={styles.featuredProductsList}
        ref={carouselRef}
        onScroll={handleScroll}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onWheel={handleWheel}
      >
        {carouselProducts.map((product, index) => {
          return (
            <CarouselProductCard
              key={`${product.id}-${index}`}
              product={product}
            />
          );
        })}
      </ul>
      <div className={styles.carouselIndexes}>
        {featuredProducts.map((product, index) => (
          <span
            key={product.id}
            className={`${styles.carouselIndexesIndicator} ${
              index === activeProductIndex ? styles.activeIndicator : ""
            }`}
          />
        ))}
      </div>
    </section>
  );
}
