import type { RatingDistribution, Review } from "../types";
export interface ReviewStats {
  average: number;
  total: number;
  distribution: RatingDistribution;
}
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  const distribution: RatingDistribution = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  let sum = 0;
  for (const review of reviews) {
    const key = String(review.rating);
    if (key in distribution) {
      distribution[key] = distribution[key] + 1;
    }
    sum = sum + review.rating;
  }
  const total = reviews.length;
  const average = total === 0 ? 0 : Math.round((sum / total) * 10) / 10;
  return { average, total, distribution };
}
export function formatReviewDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
export function getInitial(name: string): string {
  const words = name.trim().split(/\s+/);
  const lastWord = words[words.length - 1] || "";
  if (lastWord === "") {
    return "?";
  }
  const first = lastWord.charAt(0).replace(/[đĐ]/, "D");
  const plain = first.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return plain.toUpperCase();
}
