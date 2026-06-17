import { Router } from "express";
import { RestaurantsController } from "./restaurants.controller.js";
import { authMiddleware } from "../../shared/middlewares/authMiddleware.js";
import { roleMiddleware } from "../../shared/middlewares/roleMiddleware.js";

export const restaurantsRouter = Router();

const restaurantsController = new RestaurantsController();

restaurantsRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return restaurantsController.create(req, res);
  },
);
restaurantsRouter.get(
  "/me",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return restaurantsController.getMyRestaurant(req, res);
  },
);

restaurantsRouter.patch(
  "/me",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return restaurantsController.updateMyRestaurant(req, res);
  },
);

restaurantsRouter.get("/", (req, res) => {
  return restaurantsController.getPublicRestaurants(req, res);
});

restaurantsRouter.get("/:id/products", (req, res) => {
  return restaurantsController.getPublicRestaurantProducts(req, res);
});

restaurantsRouter.get("/:id", (req, res) => {
  return restaurantsController.getPublicRestaurantById(req, res);
});
