import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserById } from "../api/userApi";
import { getMyOrders } from "../services/orderService";
import { getReviewsByDealId } from "../services/reviewService";
import { createReview, updateReview, deleteReview } from "../api/reviewApi";
import SkeletonLoader from "../components/SkeletonLoader";
import { toast } from "react-toastify";
import { Star, Package } from "lucide-react";

function MyReviews() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [purchasedDeals, setPurchasedDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviewsData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [profileData, ordersData] = await Promise.all([
        getUserById(user.id),
        getMyOrders(),
      ]);
      setProfile(profileData);

      // Deduplicate deals
      const uniqueDealsMap = new Map();
      (ordersData || []).forEach(order => {
        // Only consider completed orders or those without status (assume completed)
        const status = (order.status || "").toLowerCase();
        if (status === "completed" || !order.status) {
          (order.items || []).forEach(item => {
            if (!uniqueDealsMap.has(item.dealId)) {
              uniqueDealsMap.set(item.dealId, {
                orderId: order.orderId,
                dealId: item.dealId,
                title: item.dealTitle || `Deal Code #${item.dealId}`,
                image: item.imageUrl || null, // Might be null, will handle in UI
                purchaseDate: order.createdAt,
                review: null
              });
            }
          });
        }
      });

      const uniqueDeals = Array.from(uniqueDealsMap.values());

      // Fetch reviews for each deal
      const dealsWithReviews = await Promise.all(
        uniqueDeals.map(async (deal) => {
          if (!deal.dealId) return { ...deal, review: null };
          try {
            const reviews = await getReviewsByDealId(deal.dealId);
            // Match review by userId first, fallback to userName comparison
            const myReview = reviews.find(r => 
              (r.userId && profileData.id && r.userId === profileData.id) || 
              (r.userName && profileData.name && r.userName.toLowerCase() === profileData.name.toLowerCase())
            );
            return { ...deal, review: myReview || null };
          } catch (e) {
            console.error(`Error fetching reviews for deal ${deal.dealId}:`, e);
            return { ...deal, review: null };
          }
        })
      );

      setPurchasedDeals(dealsWithReviews);
    } catch (error) {
      console.error("Error loading reviews page:", error);
      toast.error("Could not load your reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [user]);

  const handleOpenWriteReview = (deal) => {
    setSelectedDeal(deal);
    setEditingReview(null);
    setRating(5);
    setComment("");
    setShowModal(true);
  };

  const handleOpenEditReview = (deal) => {
    setSelectedDeal(deal);
    setEditingReview(deal.review);
    setRating(deal.review.rating || 5);
    setComment(deal.review.comment || "");
    setShowModal(true);
  };

  const handleDeleteReview = async (deal) => {
    if (!deal.review) return;
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(deal.review.id);
        toast.success("Review deleted successfully.");
        fetchReviewsData();
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error(error.response?.data?.message || error.response?.data?.Message || "Failed to delete review.");
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Rating and comment are required.");
      return;
    }
    
    if (!selectedDeal?.dealId) {
      toast.error("Deal not found.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingReview) {
        await updateReview(editingReview.id, {
          rating: Number(rating),
          comment: comment.trim()
        });
        toast.success("Review updated successfully!");
      } else {
        await createReview({
          orderId: selectedDeal.orderId,
          rating: Number(rating),
          comment: comment.trim()
        });
        toast.success("Review submitted successfully!");
      }
      setShowModal(false);
      fetchReviewsData();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || error.response?.data?.Message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return (
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rounded ? "text-orange-500 fill-orange-500" : "text-slate-300 dark:text-slate-600 fill-transparent"}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) return <div className="py-5"><SkeletonLoader type="deal" /></div>;

  const unreviewedCount = purchasedDeals.filter(d => !d.review).length;
  const allReviewed = purchasedDeals.length > 0 && unreviewedCount === 0;

  return (
    <div className="profile-page py-4">
      <div className="mb-4">
        <h1 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">My Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Manage your reviews and rate your purchased deals.</p>
      </div>

      {purchasedDeals.length === 0 ? (
        <div className="text-center py-5 border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 shadow-sm mt-4 transition-colors empty-state-container d-flex flex-column align-items-center gap-2">
          <div className="empty-state-icon bg-orange-500 text-white rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: "80px", height: "80px" }}>
            <Star size={40} />
          </div>
          <h4 className="fw-bold text-slate-900 dark:text-white transition-colors">No reviews yet</h4>
          <p className="text-muted mx-auto mb-4 transition-colors" style={{ maxWidth: "400px" }}>
            Purchase a deal to leave your first review.
          </p>
          <Link to="/deals" className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm hover-lift">
            Browse Deals
          </Link>
        </div>
      ) : (
        <>
          {allReviewed && (
            <div className="alert alert-success bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm rounded-4 mb-4 d-flex align-items-center transition-colors">
              <span className="fs-3 me-3">🎉</span>
              <div>
                <h5 className="fw-bold mb-1">Awesome job!</h5>
                <p className="mb-0 text-emerald-700 dark:text-emerald-400 transition-colors">You've reviewed all your purchases. Thank you for your feedback!</p>
              </div>
            </div>
          )}

          <div className="row g-4">
            {purchasedDeals.map((deal) => (
              <div className="col-md-6 col-lg-4" key={deal.dealId}>
                <div className="card border border-slate-100 dark:border-slate-800 shadow-sm rounded-4 h-100 bg-white dark:bg-slate-900 transition-colors">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex align-items-start mb-3">
                      {deal.image ? (
                        <img src={deal.image} alt={deal.title} className="rounded-3 me-3 object-cover" style={{width: '56px', height: '56px'}} />
                      ) : (
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-3 me-3 d-flex align-items-center justify-content-center transition-colors" style={{width: '56px', height: '56px'}}>
                          <Package size={24} className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h5 className="fw-bold text-slate-900 dark:text-white mb-1 text-truncate transition-colors" style={{maxWidth: '200px'}}>{deal.title}</h5>
                        {deal.review ? (
                          renderStars(deal.review.rating)
                        ) : (
                          <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 mt-1 transition-colors">Not Reviewed</span>
                        )}
                      </div>
                    </div>

                    {deal.review ? (
                      <div className="flex-grow-1">
                        <p className="text-slate-900 dark:text-slate-100 mb-2 transition-colors" style={{fontSize: '0.95rem'}}>{deal.review.comment}</p>
                        <small className="text-slate-500 dark:text-slate-400 fw-medium d-block mb-4 transition-colors">
                          Reviewed on {formatDate(deal.review.createdAt)}
                        </small>
                      </div>
                    ) : (
                      <div className="flex-grow-1">
                        <small className="text-slate-500 dark:text-slate-400 fw-medium d-block mb-4 transition-colors">
                          Purchased on {formatDate(deal.purchaseDate)}
                        </small>
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-top border-slate-100 dark:border-slate-800 d-flex flex-wrap gap-2 justify-content-between align-items-center transition-colors">
                      {deal.review ? (
                        <>
                          <button 
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold hover-lift"
                            onClick={() => handleOpenEditReview(deal)}
                          >
                            Edit Review
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold hover-lift dark:border-rose-500 dark:text-rose-500 dark:hover:bg-rose-500 dark:hover:text-white"
                            onClick={() => handleDeleteReview(deal)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button 
                          className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm w-100 d-flex justify-content-center align-items-center hover-lift"
                          onClick={() => handleOpenWriteReview(deal)}
                        >
                          <span className="me-2">✍️</span> Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Review Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-slate-200 dark:border-slate-800 shadow-lg rounded-4 overflow-hidden bg-white dark:bg-slate-900 transition-colors">
              <div className="modal-header border-bottom border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pt-4 px-4 pb-3 transition-colors">
                <h5 className="modal-title fw-bold text-slate-900 dark:text-white transition-colors">
                  {editingReview ? "Edit Your Review" : "Write a Review"}
                </h5>
                <button type="button" className="btn-close dark:invert" onClick={() => setShowModal(false)}></button>
              </div>
              
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body px-4 py-4">
                  <div className="d-flex align-items-center mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-3 transition-colors">
                    <div className="bg-white dark:bg-slate-900 rounded-2 p-2 me-3 shadow-sm transition-colors border border-slate-100 dark:border-slate-700">
                      <span className="fs-4">📦</span>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-slate-900 dark:text-white transition-colors">{selectedDeal?.title}</h6>
                      <small className="text-slate-500 dark:text-slate-400 transition-colors">Purchased on {formatDate(selectedDeal?.purchaseDate)}</small>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold text-slate-900 dark:text-white mb-2 transition-colors">Star Rating</label>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="btn btn-link text-decoration-none p-0"
                          onClick={() => setRating(star)}
                        >
                          <span className={`fs-2 transition-colors ${rating >= star ? 'text-warning' : 'text-slate-300 dark:text-slate-700'}`}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-slate-900 dark:text-white transition-colors">Review Message</label>
                    <textarea 
                      className="form-control rounded-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors" 
                      rows="4" 
                      placeholder="What did you like or dislike about this product?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="modal-footer border-top border-slate-200 dark:border-slate-800 px-4 pb-4 pt-3 transition-colors bg-white dark:bg-slate-900">
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-pill font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" 
                    onClick={() => setShowModal(false)} 
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      editingReview ? "Update Review" : "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReviews;
