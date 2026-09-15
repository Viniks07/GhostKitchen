import { CategoriesRepository } from "./categories.repository.js";

const categoriesRepository = new CategoriesRepository();

export class CategoriesService {
  async getCategories() {
    const categories = await categoriesRepository.findAll();

    return categories;
  }
}
