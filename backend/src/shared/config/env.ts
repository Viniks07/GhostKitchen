import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} não configurado`);
  }

  return value;
}

function getRequiredNumberEnv(name: string): number {
  const value = getRequiredEnv(name);
  const numberValue = Number(value);

  if (Number.isNaN(numberValue) || numberValue <= 0) {
    throw new Error(`${name} inválida`);
  }

  return numberValue;
}

export const env = {
  PORT: getRequiredNumberEnv("PORT"),
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  FRONTEND_URL: getRequiredEnv("FRONTEND_URL"),
  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
  SESSION_EXPIRES_IN: getRequiredNumberEnv("SESSION_EXPIRES_IN"),
  NODE_ENV: getRequiredEnv("NODE_ENV"),
};
