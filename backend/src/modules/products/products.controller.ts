import { ProductsService } from "./products.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { Request, Response } from "express";

const productsService = new ProductsService();

export class ProductsController {
  async create(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const product = await productsService.create(req.user.id, req.body);
    return res.status(201).json({ product });
  }

  async getMyProducts(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const products = await productsService.getMyProducts(req.user.id);

    return res.status(200).json({ products });
  }

  async updateMyProduct(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      throw new AppError("ID do produto inválido", 400);
    }

    const product = await productsService.update(
      req.user.id,
      productId,
      req.body,
    );

    return res.status(200).json({ product });
  }
}
