import { prisma } from "../../shared/database/prisma.js";

export class CategoriesRepository {
  async findAll() {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}
