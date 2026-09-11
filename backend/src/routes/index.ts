import { Router } from "express";
import { usersRouter } from "../modules/users/users.routes.js";
import { restaurantsRouter } from "../modules/restaurants/restaurants.routes.js";
import {
  productsRouter,
  publicProductsRouter,
} from "../modules/products/products.routes.js";
import {
  ordersRouter,
  restaurantOrdersRouter,
} from "../modules/orders/orders.routes.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { addressesRouter } from "../modules/addresses/addresses.routes.js";

export const routes = Router();

routes.use("/auth", authRouter);

routes.use("/users", usersRouter);

routes.use("/products", publicProductsRouter);

routes.use("/restaurants/orders", restaurantOrdersRouter);
routes.use("/restaurants/products", productsRouter);
routes.use("/restaurants", restaurantsRouter);

routes.use("/orders", ordersRouter);

routes.use("/addresses", addressesRouter);
