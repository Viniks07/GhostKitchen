import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/authMiddleware.js";
import { roleMiddleware } from "../../shared/middlewares/roleMiddleware.js";
import { OrdersController } from "./orders.controller.js";

export const ordersRouter = Router();
export const restaurantOrdersRouter = Router();

const ordersController = new OrdersController();

ordersRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["CLIENT"]),
  (req, res) => {
    return ordersController.create(req, res);
  },
);

ordersRouter.get(
  "/me",
  authMiddleware,
  roleMiddleware(["CLIENT"]),
  (req, res) => {
    return ordersController.getMyOrders(req, res);
  },
);

ordersRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["CLIENT"]),
  (req, res) => {
    return ordersController.getMyOrderById(req, res);
  },
);

restaurantOrdersRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return ordersController.getMyRestaurantOrders(req, res);
  },
);

restaurantOrdersRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return ordersController.getMyRestaurantOrderById(req, res);
  },
);

restaurantOrdersRouter.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return ordersController.updateMyRestaurantOrderStatus(req, res);
  },
);
