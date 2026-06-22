import * as reviewApi from "../api/reviewApi";

export const getReviewsByDealId = async (dealId) => {
  return await reviewApi.getReviewsByDealId(dealId);
};

export const createReview = async (reviewData) => {
  return await reviewApi.createReview(reviewData);
};

export const calculateAverageRating = (reviewsList) => {
  if (!reviewsList || reviewsList.length === 0) return 0;
  const total = reviewsList.reduce((sum, r) => sum + r.rating, 0);
  return total / reviewsList.length;
};

export const formatReviewDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

export const renderStars = (rating) => {
  const rounded = Math.round(rating || 0);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
};
