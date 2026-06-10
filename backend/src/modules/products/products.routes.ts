import { Router } from "express";
import { ProductsController } from "./products.controller.js";
import { authMiddleware } from "../../shared/middlewares/authMiddleware.js";
import { roleMiddleware } from "../../shared/middlewares/roleMiddleware.js";

export const productsRouter = Router();

const productsController = new ProductsController();

productsRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return productsController.create(req, res);
  },
);

productsRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return productsController.getMyProducts(req, res);
  },
);

productsRouter.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["RESTAURANT"]),
  (req, res) => {
    return productsController.updateMyProduct(req, res);
  },
);
