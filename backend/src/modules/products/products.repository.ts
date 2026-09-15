import { prisma } from "../../shared/database/prisma.js";
import type { CreateProductData, UpdateProductData } from "./products.dto.js";

type FeaturedProductByRelevanceRow = {
  id: number;
  restaurantId: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  priceInCents: number;
  isAvailable: boolean;
  totalOrdered: number;
  averageRating: number;
  reviewCount: number;
  relevanceScore: number;
  restaurantName: string;
  restaurantSlug: string;
  restaurantIsOpen: boolean;
};

export type FeaturedProductByRelevance = {
  id: number;
  restaurantId: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  priceInCents: number;
  isAvailable: boolean;
  totalOrdered: number;
  averageRating: number;
  reviewCount: number;
  relevanceScore: number;
  restaurant: {
    id: number;
    name: string;
    slug: string;
    isOpen: boolean;
  };
};

export class ProductsRepository {
  async createProduct(restaurantId: number, productData: CreateProductData) {
    return prisma.product.create({
      data: {
        restaurantId,
        ...productData,
      },
      select: {
        id: true,
        restaurantId: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        priceInCents: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findRestaurantByUserId(userId: number) {
    return prisma.restaurant.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  async findProductById(productId: number) {
    return prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        restaurantId: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        priceInCents: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findProductsByIds(productIds: number[]) {
    return prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        restaurantId: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        priceInCents: true,
        isAvailable: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            slug: true,
            isOpen: true,
          },
        },
      },
    });
  }

  async findProductBySlug(restaurantId: number, slug: string) {
    return prisma.product.findFirst({
      where: {
        restaurantId,
        slug,
      },
      select: {
        id: true,
      },
    });
  }

  async findProductsByRestaurantId(restaurantId: number) {
    return prisma.product.findMany({
      where: {
        restaurantId,
      },
      select: {
        id: true,
        restaurantId: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        priceInCents: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateProductById(productId: number, productData: UpdateProductData) {
    return prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...productData,
      },
      select: {
        id: true,
        restaurantId: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        priceInCents: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findMostOrderedProductStatsByRestaurantId(
    restaurantId: number,
    limit: number,
  ) {
    return prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          status: "DELIVERED",
          restaurantId,
        },
        product: {
          restaurantId,
          isAvailable: true,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });
  }

  async findFeaturedProductsByRelevance(
    limit: number,
  ): Promise<FeaturedProductByRelevance[]> {
    const products = await prisma.$queryRaw<FeaturedProductByRelevanceRow[]>`
    WITH product_order_stats AS (
      SELECT
        oi."productId",
        SUM(oi.quantity)::int AS "totalOrdered"
      FROM "OrderItem" oi
      INNER JOIN "Order" o ON o.id = oi."orderId"
      WHERE o.status = 'DELIVERED'
      GROUP BY oi."productId"
    ),
    restaurant_review_stats AS (
      SELECT
        rr."restaurantId",
        AVG(rr.rating)::float AS "averageRating",
        COUNT(rr.id)::int AS "reviewCount"
      FROM "RestaurantReview" rr
      GROUP BY rr."restaurantId"
    )
    SELECT
      p.id,
      p."restaurantId",
      p.name,
      p.slug,
      p.description,
      p."imageUrl",
      p."priceInCents",
      p."isAvailable",
      pos."totalOrdered",
      COALESCE(rrs."averageRating", 0)::float AS "averageRating",
      COALESCE(rrs."reviewCount", 0)::int AS "reviewCount",
      (
        pos."totalOrdered"
        * (COALESCE(rrs."averageRating", 0) / 5.0)
        * LEAST(COALESCE(rrs."reviewCount", 0) / 10.0, 1.0)
      )::float AS "relevanceScore",
      r.name AS "restaurantName",
      r.slug AS "restaurantSlug",
      r."isOpen" AS "restaurantIsOpen"
    FROM "Product" p
    INNER JOIN "Restaurant" r ON r.id = p."restaurantId"
    INNER JOIN product_order_stats pos ON pos."productId" = p.id
    LEFT JOIN restaurant_review_stats rrs ON rrs."restaurantId" = r.id
    WHERE
      p."isAvailable" = true
      AND r."isOpen" = true
    ORDER BY "relevanceScore" DESC, pos."totalOrdered" DESC
    LIMIT ${limit};
  `;

    return products.map((product) => ({
      id: product.id,
      restaurantId: product.restaurantId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      imageUrl: product.imageUrl,
      priceInCents: product.priceInCents,
      isAvailable: product.isAvailable,
      totalOrdered: product.totalOrdered,
      averageRating: product.averageRating,
      reviewCount: product.reviewCount,
      relevanceScore: product.relevanceScore,
      restaurant: {
        id: product.restaurantId,
        name: product.restaurantName,
        slug: product.restaurantSlug,
        isOpen: product.restaurantIsOpen,
      },
    }));
  }
}
