import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import type { NewReviewInput } from "../../types";
interface ReviewFormProps {
  onSubmit: (input: NewReviewInput) => Promise<void>;
}
const ratingLabels = ["", "Rất tệ", "Không tốt", "Bình thường", "Tốt", "Rất tốt"];
export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const shownRating = hoverRating || rating;

  function validate(): boolean {
    const newErrors: { rating?: string; comment?: string } = {};
    if (rating < 1 || rating > 5) {
      newErrors.rating = "Vui lòng chọn số sao đánh giá";
    }
    if (comment.trim() === "") {
      newErrors.comment = "Vui lòng nhập nội dung nhận xét";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    setSubmitError("");
    if (!user) {
      setSubmitError("Bạn cần đăng nhập để gửi đánh giá");
      return;
    }
    if (!validate()) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ rating: rating, comment: comment });
      setRating(0);
      setComment("");
      setErrors({});
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  }
  if (!user) {
    return (
      <div className="review-login-prompt">
        <i className="bi bi-lock fs-3 text-muted"></i>
        <h3 className="h6 fw-bold mt-2 mb-1">Đăng nhập để viết đánh giá</h3>
        <p className="small text-muted mb-3">Bạn cần có tài khoản và đăng nhập mới có thể bình luận về sản phẩm.</p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/login" state={{ from: location.pathname + "#reviews" }} className="btn btn-primary btn-sm">
            Đăng nhập
          </Link>
          <Link to="/register" className="btn btn-outline-primary btn-sm">
            Đăng ký
          </Link>
        </div>
      </div>
    );
  }
  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="h6 fw-bold mb-3">Viết đánh giá của bạn</h3>
      {success && (
        <div className="alert alert-success py-2 small" role="status">
          <i className="bi bi-check-circle me-1"></i>
          Cảm ơn bạn! Đánh giá đã được gửi và lưu lại.
        </div>
      )}
      {submitError && (
        <div className="alert alert-danger py-2 small" role="alert">
          {submitError}
        </div>
      )}
      <p className="small text-muted mb-3">
        <i className="bi bi-person-check me-1"></i>
        Đang bình luận với tên <strong>{user.fullName}</strong>
      </p>
      <div className="mb-3">
        <div className="form-label small fw-semibold mb-1">Đánh giá của bạn</div>
        <div className="d-flex align-items-center gap-2">
          <div className="star-picker" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="star-picker-btn"
                aria-label={star + " sao"}
                aria-pressed={rating === star}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
              >
                <i className={"bi " + (star <= shownRating ? "bi-star-fill" : "bi-star")}></i>
              </button>
            ))}
          </div>
          {shownRating > 0 && <span className="small text-muted">{ratingLabels[shownRating]}</span>}
        </div>
        {errors.rating && <div className="text-danger small mt-1">{errors.rating}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="review-comment" className="form-label small fw-semibold">
          Nhận xét
        </label>
        <textarea
          id="review-comment"
          rows={4}
          maxLength={500}
          style={{ resize: "none" }}
          className={"form-control" + (errors.comment ? " is-invalid" : "")}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        ></textarea>
        {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
        <div className="form-text text-end">{comment.length}/500</div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Đang gửi...
          </>
        ) : (
          "Gửi đánh giá"
        )}
      </button>
    </form>
  );
}


