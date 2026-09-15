import { AppError } from "../errors/AppError.js";
import { MAX_IMAGE_URL_LENGTH } from "../constants/business-rules.js";

function ensureValidImageUrl(imageUrl: string) {
  let url: URL;

  try {
    url = new URL(imageUrl);
  } catch {
    throw new AppError("URL da imagem inválida", 400);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new AppError("URL da imagem inválida", 400);
  }
}

export function validateImageUrlForCreate(
  imageUrl: unknown,
): string | undefined {
  if (imageUrl === undefined) {
    return undefined;
  }

  if (typeof imageUrl !== "string") {
    throw new AppError("URL da imagem com formato inválido", 400);
  }

  const trimmedImageUrl = imageUrl.trim();

  if (!trimmedImageUrl) {
    return undefined;
  }

  if (trimmedImageUrl.length > MAX_IMAGE_URL_LENGTH) {
    throw new AppError(
      `URL da imagem deve conter no máximo ${MAX_IMAGE_URL_LENGTH} caracteres`,
      400,
    );
  }

  ensureValidImageUrl(trimmedImageUrl);

  return trimmedImageUrl;
}

export function validateImageUrlForUpdate(
  imageUrl: unknown,
): string | null | undefined {
  if (imageUrl === undefined) {
    return undefined;
  }

  if (imageUrl === null) {
    return null;
  }

  if (typeof imageUrl !== "string") {
    throw new AppError("URL da imagem com formato inválido", 400);
  }

  const trimmedImageUrl = imageUrl.trim();

  if (!trimmedImageUrl) {
    return null;
  }

  if (trimmedImageUrl.length > MAX_IMAGE_URL_LENGTH) {
    throw new AppError(
      `URL da imagem deve conter no máximo ${MAX_IMAGE_URL_LENGTH} caracteres`,
      400,
    );
  }

  ensureValidImageUrl(trimmedImageUrl);

  return trimmedImageUrl;
}
