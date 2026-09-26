const API_URL = "http://localhost:5000/api/hotels";
export const getHotels = async ({
  search = "",
  minPrice = "",
  maxPrice = "",
  limit = 6,
  offset = 0,
} = {}) => {
  const params = new URLSearchParams();
  if (search.trim() !== "") {
    params.append("title", search.trim());
  }
  if (minPrice !== "") {
    params.append("minPrice", minPrice);
  }
  if (maxPrice !== "") {
    params.append("maxPrice", maxPrice);
  }
  params.append("limit", limit);
  params.append("offset", offset);
  const response = await fetch(
    `${API_URL}?${params.toString()}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch hotels"
    );
  }
  return data;
};
export const deleteHotel = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete hotel"
    );
  }
  return data;
};
export const createHotel = async (formData) => {
  const response = await fetch(
    API_URL,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create hotel"
    );
  }
  return data;
};
export const updateHotel = async (id, formData) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update hotel"
    );
  }
  return data;
};
export const getHotelById = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch hotel"
    );
  }
  return data;
};