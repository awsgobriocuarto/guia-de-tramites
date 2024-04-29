const API_URL = "https://admin.tramitesdev.riocuarto.gob.ar";
const API_TOKEN = "Bearer 1|Dn58lwU4vJcuXXSMtdAyYBhyc5NZyRXWZFNgMney";
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
  const res = await fetch(`${API_URL}/api/categories`, API_OPTIONS);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function fetchAreas() {
  const res = await fetch(`${API_URL}/api/areas`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
export async function fetchAreasById(id) {
  const res = await fetch(`${API_URL}/api/areas/${id}`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function fetchFormalities(params = "") {
  const res = await fetch(`${API_URL}/api/tramites${params}`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
export async function fetchFormalitiesBySlug(slug = "") {
  const res = await fetch(`${API_URL}/api/tramites/${slug}`, API_OPTIONS);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
