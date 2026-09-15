/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RestaurantReview" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantReview_orderId_key" ON "RestaurantReview"("orderId");

-- CreateIndex
CREATE INDEX "RestaurantReview_restaurantId_idx" ON "RestaurantReview"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantReview_clientId_idx" ON "RestaurantReview"("clientId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_restaurantId_slug_key" ON "Product"("restaurantId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- AddForeignKey
ALTER TABLE "RestaurantReview" ADD CONSTRAINT "RestaurantReview_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantReview" ADD CONSTRAINT "RestaurantReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantReview" ADD CONSTRAINT "RestaurantReview_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
