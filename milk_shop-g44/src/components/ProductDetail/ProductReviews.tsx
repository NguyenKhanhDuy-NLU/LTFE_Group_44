import { useState } from "react";
import type { NewReviewInput, Review } from "../../types";
import { calculateReviewStats, formatReviewDate, getInitial } from "../../utils/reviewUtils";
import { getAvatarImage } from "../../utils/getAvatarImage";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";
interface ProductReviewsProps {
  reviews: Review[];
  onSubmitReview: (input: NewReviewInput) => Promise<void>;
}
type StarFilter = "all" | 1 | 2 | 3 | 4 | 5;
type ReviewSort = "newest" | "oldest";
const REVIEWS_PER_PAGE = 5;
function ReviewAvatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className="review-avatar review-avatar-initial">{getInitial(name)}</div>;
  }
  return <img className="review-avatar" src={getAvatarImage(src)} alt={name} loading="lazy" onError={() => setFailed(true)} />;
}
export default function ProductReviews({ reviews, onSubmitReview }: ProductReviewsProps) {
  const [starFilter, setStarFilter] = useState<StarFilter>("all");
  const [sortBy, setSortBy] = useState<ReviewSort>("newest");
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
  const stats = calculateReviewStats(reviews);
  const filtered = reviews.filter((review) => starFilter === "all" || review.rating === starFilter);
  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sortBy === "newest" ? diff : -diff;
  });
  const visibleReviews = sorted.slice(0, visibleCount);

  function changeFilter(filter: StarFilter) {
    setStarFilter(filter);
    setVisibleCount(REVIEWS_PER_PAGE); // đổi bộ lọc thì quay về đầu danh sách
  }

  function changeSort(value: ReviewSort) {
    setSortBy(value);
    setVisibleCount(REVIEWS_PER_PAGE);
  }

  async function handleSubmit(input: NewReviewInput) {
    await onSubmitReview(input);
    setStarFilter("all");
    setSortBy("newest");
    setVisibleCount(REVIEWS_PER_PAGE);
  }
  return (
    <section id="reviews" className="card card-body mt-3" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="h5 fw-bold mb-3">
        Đánh giá &amp; nhận xét của khách hàng
      </h2>
      {stats.total === 0 ? (
        <div className="review-empty">
          <i className="bi bi-chat-square-text fs-2 text-muted"></i>
          <p className="mb-0 mt-2 fw-semibold">Chưa có đánh giá nào cho sản phẩm này</p>
          <p className="mb-0 small text-muted">Hãy là người đầu tiên chia sẻ cảm nhận của bạn.</p>
        </div>
      ) : (
        <div className="row g-4 align-items-center review-summary">
          <div className="col-md-4 text-center">
            <div className="review-score">
              {stats.average.toFixed(1)}
              <span className="review-score-max">/5</span>
            </div>
            <StarRating value={stats.average} className="fs-5" />
            <div className="small text-muted mt-1">{stats.total} lượt đánh giá</div>
          </div>
          <div className="col-md-8">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[String(star)] || 0;
              const percent = Math.round((count / stats.total) * 100);
              return (
                <button
                  type="button"
                  key={star}
                  className={"review-bar-row" + (starFilter === star ? " active" : "")}
                  onClick={() => changeFilter(starFilter === star ? "all" : (star as StarFilter))}
                  aria-label={"Lọc " + star + " sao, " + count + " đánh giá"}
                >
                  <span className="review-bar-label">
                    {star} <i className="bi bi-star-fill"></i>
                  </span>
                  <span className="progress flex-grow-1" style={{ height: "8px" }}>
                    <span className="progress-bar review-bar-fill" style={{ width: percent + "%" }}></span>
                  </span>
                  <span className="review-bar-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {stats.total > 0 && (
        <>
          <hr />
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className={"btn btn-sm " + (starFilter === "all" ? "btn-primary" : "btn-outline-secondary")}
                onClick={() => changeFilter("all")}
              >
                Tất cả ({stats.total})
              </button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={"btn btn-sm " + (starFilter === star ? "btn-primary" : "btn-outline-secondary")}
                  onClick={() => changeFilter(star as StarFilter)}
                >
                  {star} sao ({stats.distribution[String(star)] || 0})
                </button>
              ))}
            </div>
            <select
              className="form-select form-select-sm review-sort-select"
              value={sortBy}
              aria-label="Sắp xếp đánh giá"
              onChange={(event) => changeSort(event.target.value as ReviewSort)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
          {sorted.length === 0 ? (
            <div className="alert alert-light border text-center mb-0">
              Chưa có đánh giá {starFilter} sao nào.{" "}
              <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={() => changeFilter("all")}>
                Xem tất cả
              </button>
            </div>
          ) : (
            <ul className="list-unstyled mb-0">
              {visibleReviews.map((review) => (
                <li key={review.id} className="review-item">
                  <ReviewAvatar src={review.userAvatar} name={review.userName} />
                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="fw-semibold">{review.userName}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 small">
                      <StarRating value={review.rating} />
                      <span className="text-muted">{formatReviewDate(review.createdAt)}</span>
                    </div>
                    <p className="mb-0 mt-1 review-comment">{review.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {sorted.length > visibleCount && (
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setVisibleCount(visibleCount + REVIEWS_PER_PAGE)}
              >
                Xem thêm {Math.min(REVIEWS_PER_PAGE, sorted.length - visibleCount)} đánh giá
                <span className="text-muted ms-1">
                  (còn {sorted.length - visibleCount})
                </span>
              </button>
            </div>
          )}
        </>
      )}
      <hr />
      <ReviewForm onSubmit={handleSubmit} />
    </section>
  );
}


