import type { Request, Response } from "express";

import { CategoriesService } from "./categories.service.js";

const categoriesService = new CategoriesService();

export class CategoriesController {
  async getCategories(_req: Request, res: Response) {
    const categories = await categoriesService.getCategories();

    return res.status(200).json({ categories });
  }
}
