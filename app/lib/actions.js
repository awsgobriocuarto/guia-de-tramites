"use server";

const API_BASE_URL = process.env.API_BASE_URL;
const API_VERSION = process.env.API_VERSION;
const API_TOKEN = process.env.API_TOKEN;

if (!API_BASE_URL || !API_TOKEN) {
  throw new Error("API_BASE_URL o API_TOKEN no están definidas en el entorno");
}

const API_URL = `${API_BASE_URL}/api${API_VERSION ? `/${API_VERSION}` : ""}`;

const API_OPTIONS = {
  headers: {
    Authorization: API_TOKEN,
  },
  cache: "no-store",
};

export async function searchFormalitiesAction(query) {
  const response = await fetch(
    `${API_URL}/tramites?search=${query}`,
    API_OPTIONS,
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  return response.json();
}
