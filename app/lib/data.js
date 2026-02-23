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

export async function fetchProducts() {
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, API_OPTIONS);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function fetchAreas() {
  const res = await fetch(`${API_URL}/areas`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
export async function fetchAreasById(id) {
  const res = await fetch(`${API_URL}/areas/${id}`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function fetchFormalities(params = "") {
  const res = await fetch(`${API_URL}/tramites${params}`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
export async function fetchFormalitiesBySlug(slug = "") {
  const res = await fetch(`${API_URL}/tramites/${slug}`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
