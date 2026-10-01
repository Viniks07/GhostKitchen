export type Category = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
};

export type GetCategoryResponse = {
  categories: Category[];
};
