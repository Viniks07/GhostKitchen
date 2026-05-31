import { Router } from "express";
import { AddressesController } from "./addresses.controller.js";
import { authMiddleware } from "../../shared/middlewares/authMiddleware.js";

export const addressesRouter = Router();

const addressesController = new AddressesController();

addressesRouter.post("/", authMiddleware, (req, res) => {
  return addressesController.create(req, res);
});

addressesRouter.get("/me", authMiddleware, (req, res) => {
  return addressesController.getMyAddress(req, res);
});

addressesRouter.patch("/me", authMiddleware, (req, res) => {
  return addressesController.updateMyAddress(req, res);
});

addressesRouter.delete("/me", authMiddleware, (req, res) => {
  return addressesController.deleteMyAddress(req, res);
});