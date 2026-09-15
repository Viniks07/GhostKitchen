import { Router } from "express";

import { CategoriesController } from "./categories.controller.js";

export const categoriesRouter = Router();

const categoriesController = new CategoriesController();

categoriesRouter.get("/", (req, res) => {
  return categoriesController.getCategories(req, res);
});
