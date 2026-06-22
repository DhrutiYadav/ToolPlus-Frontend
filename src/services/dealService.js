import * as dealApi from "../api/dealApi";

export const mapDealResponse = (deal) => {
  if (!deal) return null;
  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "https://localhost:7033";
  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  const imageSrc =
    deal.imageUrl && deal.imageUrl.trim() !== ""
      ? deal.imageUrl.startsWith("http")
        ? deal.imageUrl
        : `${API_BASE_URL}${deal.imageUrl}`
      : defaultImage;
  return {
    ...deal,
    imageSrc,
    salePrice: deal.discountPrice,
    stockQuantity: deal.stock
  };
};

export const getDeals = async () => {
  const data = await dealApi.getDeals();
  return (data || []).map(mapDealResponse);
};

export const getDealById = async (id) => {
  const data = await dealApi.getDealById(id);
  return mapDealResponse(data);
};

export const createDeal = async (dealData) => {
  const payload = {
    ...dealData,
    discountPrice: parseFloat(dealData.salePrice || 0),
    stock: parseInt(dealData.stockQuantity || 0, 10),
    shortDescription: dealData.description ? (dealData.description.substring(0, 100) + "...") : "",
    startDate: dealData.startDate || new Date().toISOString(),
    endDate: dealData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    features: dealData.features || "Key Features included",
    terms: dealData.terms || "Standard terms apply"
  };
  const data = await dealApi.createDeal(payload);
  return mapDealResponse(data);
};

export const updateDeal = async (id, dealData) => {
  const payload = {
    ...dealData,
    discountPrice: parseFloat(dealData.salePrice || 0),
    stock: parseInt(dealData.stockQuantity || 0, 10),
    shortDescription: dealData.description ? (dealData.description.substring(0, 100) + "...") : "",
    startDate: dealData.startDate || new Date().toISOString(),
    endDate: dealData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    features: dealData.features || "Key Features included",
    terms: dealData.terms || "Standard terms apply"
  };
  const data = await dealApi.updateDeal(id, payload);
  return mapDealResponse(data);
};

export const deleteDeal = async (id) => {
  return await dealApi.deleteDeal(id);
};

export const searchDeals = async (searchTerm = "", pageNumber = 1, pageSize = 10) => {
  const data = await dealApi.searchDeals(searchTerm, pageNumber, pageSize);
  if (data && data.items) {
    data.items = data.items.map(mapDealResponse);
  }
  return data;
};

export const getDealsByCategoryId = async (categoryId) => {
  const data = await dealApi.getDealsByCategoryId(categoryId);
  return (data || []).map(mapDealResponse);
};

export const uploadDealImage = async (id, file) => {
  const data = await dealApi.uploadDealImage(id, file);
  return mapDealResponse(data);
};
