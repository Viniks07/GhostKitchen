import { AppError } from "../errors/AppError.js";
import { createSlug } from "./createSlug.js";

type GenerateUniqueSlugParams = {
  value: string;
  errorMessage: string;
  exists: (slug: string) => Promise<boolean>;
};

export async function generateUniqueSlug({
  value,
  errorMessage,
  exists,
}: GenerateUniqueSlugParams): Promise<string> {
  const baseSlug = createSlug(value);

  if (!baseSlug) {
    throw new AppError(errorMessage, 400);
  }

  let slug = baseSlug;
  let suffix = 2;

  while (await exists(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
