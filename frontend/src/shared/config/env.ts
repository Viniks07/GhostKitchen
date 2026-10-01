function getViteEnv(name: string): string {
  const key = `VITE_${name}`;
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`${key} não configurado`);
  }

  return value;
}

export const env = {
  API_URL: getViteEnv("API_URL"),
};
