import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDealById, uploadDealImage, deleteDeal, updateDeal } from "../services/dealService";
// import { purchaseDeal, getMyOrders } from "../services/orderService";
import { getMyOrders } from "../services/orderService";

import { 
  getReviewsByDealId, 
  createReview, 
  renderStars, 
  formatReviewDate 
} from "../services/reviewService";
import cartService from "../services/cartService";
import { useCart } from "../context/CartContext";
import SkeletonLoader from "../components/SkeletonLoader";
import { toast } from "react-toastify";
import "../styles/DealDetails.css"; // Reuse details styles or add custom overrides
import { invokeRazorpayFlow } from "../utils/razorpayUtils";
import AdminModal from "../components/AdminModal";
import { Star } from "lucide-react";

function DealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  
  // Image Upload State for Admins
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Edit Deal State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updatingDeal, setUpdatingDeal] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [associatedOrderId, setAssociatedOrderId] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showStickySidebar, setShowStickySidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviewsByDealId(id);
        setReviews((reviewsData || []).filter(r => r.isApproved));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setShowStickySidebar(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (user) {
        try {
          const ordersData = await getMyOrders();
          const matchingOrder = ordersData.find(
            (o) => o.dealId === Number(id) && o.status.toLowerCase() === "completed"
          );
          if (matchingOrder) {
            setHasPurchased(true);
            setAssociatedOrderId(matchingOrder.id);
          } else {
            setHasPurchased(false);
            setAssociatedOrderId(null);
          }
        } catch (error) {
          console.error("Error checking order status:", error);
        }
      } else {
        setHasPurchased(false);
        setAssociatedOrderId(null);
      }
    };

    checkPurchaseStatus();
  }, [user, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!associatedOrderId) {
      toast.error("You must have a completed order to review this deal.");
      return;
    }
    if (ratingInput < 1 || ratingInput > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }

    setSubmittingReview(true);
    try {
      await createReview({
        orderId: associatedOrderId,
        rating: ratingInput,
        comment: commentInput
      });

      toast.success("Review submitted successfully!");
      setCommentInput("");
      setRatingInput(5);

      // Auto-refresh reviews
      const updatedReviews = await getReviewsByDealId(id);
      const filteredReviews = (updatedReviews || []).filter(r => r.isApproved);
      setReviews(filteredReviews);
      
      const newCount = filteredReviews.length;
      const newAverage = newCount > 0 
        ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / newCount 
        : 0;

      setDeal(prev => ({
        ...prev,
        reviewCount: newCount,
        averageRating: newAverage
      }));

    } catch (error) {
      console.error("Failed to submit review:", error);
      const msg = error.response?.data?.message || error.response?.data?.Message || "Failed to submit review.";
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        const data = await getDealById(id);
        setDeal(data);
      } catch (error) {
        console.error("Error fetching deal details:", error);
        toast.error("Deal details could not be loaded.");
        navigate("/deals");
      } finally {
        setLoading(false);
      }
    };

    fetchDealDetails();
  }, [id, navigate]);

  const { refreshCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please log in to add items to cart.");
      navigate("/login");
      return;
    }

    if (quantity < 1) {
      toast.error("Invalid purchase quantity.");
      return;
    }

    if (deal.stock < quantity) {
      toast.error("Not enough codes in stock.");
      return;
    }

    setAddingToCart(true);
    try {
      await cartService.addToCart(deal.id, quantity);
      toast.success("Added to cart successfully");
      refreshCart();
    } catch (error) {
      console.error("Add to cart failed:", error);
      const msg = error.response?.data?.message || "Failed to add to cart.";
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  const handlePurchase = async () => {
    if (quantity < 1) {
      toast.error("Invalid purchase quantity.");
      return;
    }

    if (deal.stock < quantity) {
      toast.error("Not enough codes in stock.");
      return;
    }

    const buyNowItem = {
      id: "temp_" + deal.id,
      dealId: deal.id,
      title: deal.title,
      discountPrice: deal.discountPrice,
      originalPrice: deal.originalPrice,
      imageUrl: deal.imageSrc || deal.imageUrl,
      quantity: quantity
    };

    if (!user) {
      toast.info("Please log in to purchase codes.");
      navigate("/login", { state: { returnTo: `/deals/${deal.id}`, buyNowItem } });
      return;
    }

    setPurchasing(true);

    await invokeRazorpayFlow({
      items: [buyNowItem],
      navigate,
      finallyCallback: () => {
        setPurchasing(false);
      }
    });
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image file first.");
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadDealImage(deal.id, selectedFile);
      toast.success("Image uploaded and updated successfully!");
      
      // Update local deal state image
      setDeal((prev) => ({
        ...prev,
        imageUrl: result.imageUrl,
        imageSrc: result.imageSrc,
      }));
      
      setSelectedFile(null);
      // Reset input element
      e.target.reset();
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Ensure server folders are writeable.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteDeal = async () => {
    if (window.confirm("Are you sure you want to delete this deal permanently?")) {
      try {
        await deleteDeal(deal.id);
        toast.success("Deal deleted successfully.");
        navigate("/deals");
      } catch (error) {
        console.error("Error deleting deal:", error);
        toast.error("Could not delete deal.");
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdatingDeal(true);
    try {
      const payload = {
        ...deal,
        title: editForm.title,
        description: editForm.description,
        originalPrice: parseFloat(editForm.originalPrice),
        salePrice: parseFloat(editForm.salePrice),
        stockQuantity: parseInt(editForm.stockQuantity, 10),
      };
      const updated = await updateDeal(deal.id, payload);
      setDeal(updated);
      setIsEditing(false);
      toast.success("Deal updated successfully!");
    } catch (error) {
      console.error("Error updating deal:", error);
      toast.error("Failed to update deal.");
    } finally {
      setUpdatingDeal(false);
    }
  };

  const openEditForm = () => {
    setEditForm({
      title: deal.title || "",
      description: deal.description || "",
      originalPrice: deal.originalPrice || 0,
      salePrice: deal.discountPrice || 0,
      stockQuantity: deal.stock || 0,
    });
    setIsEditing(true);
  };

  if (loading) return (
    <div className="container py-12">
      <SkeletonLoader type="dealDetails" />
    </div>
  );
  if (!deal) return <div className="text-center py-12"><h3>Deal not found.</h3></div>;

  const savingsPercent = deal.originalPrice > 0 
    ? Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100)
    : 0;

  // Split Features & Terms by newline or semicolon for nice listing
  const featureList = deal.features
    ? deal.features.split(/[;\n]/).map(f => f.trim()).filter(Boolean)
    : ["AI Writing", "Analytics", "Collaboration", "API Access"];

  const termList = deal.terms
    ? deal.terms.split(/[;\n]/).map(t => t.trim()).filter(Boolean)
    : [];

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60";
  const imageSrc = deal?.imageSrc || defaultImage;

  const calculatedReviewCount = reviews.length;
  const calculatedAverageRating = calculatedReviewCount > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / calculatedReviewCount 
    : 0;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === "highest") {
      return b.rating - a.rating;
    } else if (sortOrder === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <div className="deal-details-page py-12">
      {/* Back button */}
      <Link to="/deals" className="no-underline font-bold text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 pl-0 mb-6 transition-colors">
        &larr; Back to all deals
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details Info */}
        <div className="lg:col-span-8">
          {/* Main Deal Header */}
          <div className="mb-6">
            {deal.categoryName && (
              <span className="inline-block text-[0.75em] leading-none text-center whitespace-nowrap align-baseline bg-orange-500 uppercase px-6 py-2 rounded font-bold mb-2 transition-colors">
                {deal.categoryName}
              </span>
            )}
            <h1 className="font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">{deal.title}</h1>
            <p className="lead text-slate-500 dark:text-slate-400 transition-colors">{deal.shortDescription}</p>
          </div>

          {/* Large Image */}
          <div className="deal-details-image-wrapper mb-12 rounded-2xl overflow-hidden border shadow-sm">
            <img
              src={imageSrc}
              alt={deal.title}
              className="w-full h-[520px] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
          </div>



          {/* ADMIN ONLY CONTROLS */}
          {isAdmin && (
            <div className="flex flex-col relative min-w-0 break-words border-primary p-6 rounded-2xl bg-primary-subtle shadow-sm my-12">
              <h4 className="font-bold text-primary mb-6">⚙️ Admin Control Panel</h4>
              
              <div className="grid md:grid-cols-12 gap-6 items-end mb-6">
                {/* Upload Section */}
                <div className="md:col-span-8">
                  <form onSubmit={handleImageUpload} className="flex items-center gap-2">
                    <div className="grow">
                      <label className="form-label font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Upload Deal Cover Image</label>
                      <input 
                        type="file" 
                        className="form-control" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        disabled={uploadingImage}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="mt-6 py-2 px-6 font-bold align-self-end"
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? "Uploading..." : "Upload"}
                    </button>
                  </form>
                </div>
                
                {/* Actions Section */}
                <div className="md:col-span-4 flex justify-end gap-2 md:text-right justify-content-md-end">
                  <button 
                    onClick={openEditForm} 
                    className="py-2 px-6 font-bold rounded-full shadow-sm text-dark"
                  >
                    ✏️ Edit Deal
                  </button>
                  <button 
                    onClick={handleDeleteDeal} 
                    className="py-2 px-6 font-bold rounded-full shadow-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              <AdminModal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Deal Information" size="lg">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-6">
                    <label className="form-label font-bold text-sm text-slate-900 dark:text-white">Title</label>
                    <input type="text" className="form-control bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-4 flex justify-end gap-2">
                      <label className="form-label font-bold text-sm text-slate-900 dark:text-white">Original Price ($)</label>
                      <input type="number" step="0.01" className="form-control bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={editForm.originalPrice} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} required />
                    </div>
                    <div className="md:col-span-4 flex justify-end gap-2">
                      <label className="form-label font-bold text-sm text-slate-900 dark:text-white">Sale Price ($)</label>
                      <input type="number" step="0.01" className="form-control bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={editForm.salePrice} onChange={e => setEditForm({...editForm, salePrice: e.target.value})} required />
                    </div>
                    <div className="md:col-span-4 flex justify-end gap-2">
                      <label className="form-label font-bold text-sm text-slate-900 dark:text-white">Stock Quantity</label>
                      <input type="number" className="form-control bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={editForm.stockQuantity} onChange={e => setEditForm({...editForm, stockQuantity: e.target.value})} required />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="form-label font-bold text-sm text-slate-900 dark:text-white">Description</label>
                    <textarea rows="4" className="form-control bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} required></textarea>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button type="button" className="font-bold px-6" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="submit" className="font-bold px-6" disabled={updatingDeal}>
                      {updatingDeal ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </AdminModal>
            </div>
          )}

                    {/* Tabbed Section */}
          <div className="deal-tabs mb-12">
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 overflow-auto">
              {['Overview', 'Features', 'Reviews'].map(tab => (
                <button
                  key={tab}
                  className={`px-6 py-6 font-bold rounded-none ${activeTab === tab ? 'text-orange-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                  style={{
                    borderBottom: activeTab === tab ? '2px solid #f97316' : '2px solid transparent',
                    background: 'transparent',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab} {tab === 'Reviews' && `(${calculatedReviewCount})`}
                </button>
              ))}
            </div>

            {activeTab === 'Overview' && (
              <div className="animation-fade-in">
          
          <div className="deal-full-description mb-12">
            <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 transition-colors">About this software</h3>
            <p className="text-slate-500 dark:text-slate-400 text-base transition-colors" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
              {deal.description || "No full description provided for this software package. Check features below for more info."}
            </p>
          </div>

          {/* Features checklist */}
          <div className="deal-features mb-12 p-6 rounded-2xl card-shadow bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors">
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">🛠️ Features Included</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureList.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full flex items-center justify-center mr-4 transition-colors" style={{width: '24px', height: '24px'}}>
                    <span className="font-bold text-sm">✓</span>
                  </div>
                  <span className="text-slate-900 dark:text-slate-100 font-medium text-base transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deal Terms */}
          {termList.length > 0 && (
            <div className="deal-terms mb-12">
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">📋 Deal Terms & Conditions</h4>
              <ul className="list-group list-group-flush border-0">
                {termList.map((term, idx) => (
                  <li key={idx} className="list-group-item bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 px-0 py-2 text-base transition-colors">
                    • {term}
                  </li>
                ))}
                <li className="list-group-item bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 px-0 py-2 text-base transition-colors">
                  • 60-day money-back guarantee, no questions asked.
                </li>
              </ul>
            </div>
          )}
              </div>
            )}

            {activeTab === 'Features' && (
              <div className="deal-features animation-fade-in">
                <ul className="list-group list-group-flush border-0 bg-transparent mb-6">
                  {(deal.shortDescription || '').split('. ').filter(Boolean).map((feature, idx) => (
                    <li key={idx} className="list-group-item bg-transparent border-0 flex items-start text-slate-600 dark:text-slate-300 py-2 text-base">
                      <span className="text-orange-500 mr-4 mt-1 font-bold">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="animation-fade-in">
{/* Reviews Section */}
          <div className="reviews-section mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">Customer Reviews</h3>

            {/* Review Aggregates */}
            <div className="flex items-center mb-6 p-6 rounded-2xl card-shadow bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="text-center mr-6 pr-6 border-r border-slate-200 dark:border-slate-800 transition-colors">
                <h1 className="font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">
                  {calculatedAverageRating ? calculatedAverageRating.toFixed(1) : "0.0"} Rating
                </h1>
                <div className="text-warning text-lg mb-1 flex justify-center">
                  {renderStars(calculatedAverageRating)}
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-bold text-base transition-colors">Based on {calculatedReviewCount || 0} reviews</span>
              </div>
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors">Share your thoughts</h5>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-0 transition-colors">
                  Only verified purchasers of this deal can write a review.
                </p>
              </div>
            </div>

            {/* Review Submission Form */}
            {user ? (
              hasPurchased ? (
                <div className="flex flex-col relative min-w-0 break-words p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mb-12 transition-colors">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">Write a review</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-6">
                      <label className="form-label font-bold text-sm text-slate-900 dark:text-white transition-colors mb-2 block">Rating</label>
                      <div className="flex gap-1" onMouseLeave={() => setHoveredRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={28}
                            className={`cursor-pointer transition-colors ${
                              (hoveredRating || ratingInput) >= star 
                                ? "text-orange-500 fill-orange-500" 
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                            onMouseEnter={() => setHoveredRating(star)}
                            onClick={() => setRatingInput(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="form-label font-bold text-sm text-slate-900 dark:text-white transition-colors">Comment</label>
                      <textarea
                        className="form-control bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
                        rows="4"
                        placeholder="Write your review here... What did you like or dislike?"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        disabled={submittingReview}
                        required
                      ></textarea>
                    </div>
                    
                      <button
                        type="submit"
                        className="px-6 py-2 font-bold rounded-full hover-lift"
                        disabled={submittingReview}
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                  </form>
                </div>
              ) : (
                <div className="relative px-4 border border-transparent py-6 mb-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 transition-colors">
                  ℹ️ Only customers who purchased this deal can write a review. 
                  <Link to="/deals" className="font-bold ml-1 no-underline text-orange-500 dark:text-orange-400">Explore deals</Link> to buy.
                </div>
              )
            ) : (
              <div className="relative px-4 border border-transparent py-6 mb-12 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 transition-colors">
                ⚠️ Please <Link to="/login" className="font-bold no-underline text-orange-500 dark:text-orange-400">log in</Link> to write a review.
              </div>
            )}

            {/* Review List */}
            {loadingReviews ? (
              <div className="text-center py-6">
                <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin text-orange-500" role="status"></span>
                <span className="ml-2 text-slate-500 dark:text-slate-400 transition-colors">Loading reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors empty-state-container">
                <div className="empty-state-icon bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 mx-auto transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white transition-colors">No Reviews Yet</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-0 transition-colors">Be the first reviewer to share your experience.</p>
              </div>
            ) : (
              <div className="reviews-list-container">
                <div className="flex justify-between items-center mb-6">
                  <h5 className="font-bold text-slate-900 dark:text-white mb-0">All Reviews</h5>
                  <div className="flex items-center">
                    <label className="mr-2 font-bold text-slate-600 dark:text-slate-300 text-sm">Sort Reviews</label>
                    <select
                      className="form-select form-select-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="newest">Newest ▼</option>
                      <option value="highest">Highest Rated ▼</option>
                      <option value="lowest">Lowest Rated ▼</option>
                    </select>
                  </div>
                </div>
                <div className="reviews-list flex flex-col gap-4">
                  {sortedReviews.map((r) => (
                  <div key={r.id} className="review-card p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-900 dark:text-white mb-0 transition-colors">{r.userName}</h5>
                        {r.role === "Admin" ? (
                          <span className="inline-block leading-none text-center whitespace-nowrap align-baseline rounded bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 text-xs px-2 py-1">Admin</span>
                        ) :(
                          <span className="inline-block leading-none text-center whitespace-nowrap align-baseline rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-xs px-2 py-1">Verified Buyer</span>
                        )}
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{formatReviewDate(r.createdAt)}</span>
                    </div>
                    <div className="text-warning mb-2 text-base">
                      {renderStars(r.rating)}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-base mb-0 transition-colors" style={{ whiteSpace: "pre-wrap" }}>
                      {r.comment}
                    </p>
                  </div>
                ))}
                </div>
              </div>
            )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Floating Purchase Card */}
        <div className="lg:col-span-4">
            <div className="sticky top-24 self-start">
            <div className="deal-purchase-card flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 card-shadow p-6 rounded-2xl bg-white dark:bg-slate-900 mb-6 transition-colors">
            <h5 className="uppercase text-slate-500 dark:text-slate-400 font-bold text-xs tracking-wider mb-2 transition-colors">Lifetime Deal Offer</h5>
            <h3 className="font-extrabold text-slate-900 dark:text-white mb-6 transition-colors">{deal.title}</h3>
            
            {/* Price section */}
            <div className="flex items-baseline mb-6">
              <span className="text-orange-500 font-extrabold text-3xl font-bold mr-2 transition-colors">
                ₹{deal.discountPrice.toFixed(2)}
              </span>
              <span className="line-through text-slate-500 dark:text-slate-400 text-lg mr-2 transition-colors">
                ₹{deal.originalPrice.toFixed(2)}
              </span>
              {savingsPercent > 0 && (
                <span className="inline-block leading-none text-center whitespace-nowrap align-baseline rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-1 text-xs font-bold transition-colors">
                  SAVE {savingsPercent}%
                </span>
              )}
            </div>

            {/* Dynamic ratings badge */}
            <div className="flex items-center mb-6 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
              {calculatedReviewCount > 0 ? (
                <>
                  <span className="text-warning mr-2 text-lg">{renderStars(calculatedAverageRating)}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm transition-colors">
                    {calculatedAverageRating?.toFixed(1) || "0.0"}/5 ({calculatedReviewCount} Review{calculatedReviewCount !== 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">No Reviews Yet</span>
              )}
            </div>

            {/* Stock and Purchase fields */}
            <div className="mb-6">
              {deal.stock > 0 ? (
                <>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm mb-2 font-semibold transition-colors">
                    <span>Availability:</span>
                    <span className={deal.stock <= 10 ? "text-rose-500 dark:text-rose-400 font-bold" : "text-emerald-600 dark:text-emerald-400"}>
                      {deal.stock} codes remaining
                    </span>
                  </div>
                  
                  {/* Quantity selector */}
                  <label className="form-label font-bold text-slate-900 dark:text-white text-sm mb-2 transition-colors">Select Quantity</label>
                  <select 
                    className="form-select mb-6 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={purchasing}
                  >
                    {[...Array(Math.min(10, deal.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} code{(i > 0) ? "s" : ""} (₹{(deal.discountPrice * (i + 1)).toFixed(2)})
                      </option>
                    ))}
                  </select>
                  
                  <div className="grid gap-2">
                    <button 
                      className="py-6 rounded-full font-bold uppercase tracking-wider shadow-sm flex justify-center items-center"
                      onClick={handleAddToCart}
                      disabled={addingToCart || purchasing}
                    >
                      {addingToCart ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" role="status" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                    <button 
                      className="py-6 rounded-full font-bold uppercase tracking-wider flex justify-center items-center"
                      onClick={handlePurchase}
                      disabled={addingToCart || purchasing}
                    >
                      {purchasing ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        "Buy Now"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="relative px-4 border border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded-lg text-center py-6 font-bold mb-0">
                  🚫 Out of stock. This deal is closed.
                </div>
              )}
            </div>

            {/* Trust Features below button */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
              <ul className="list-none mb-0 flex flex-col gap-2 text-slate-900 dark:text-white font-medium text-sm transition-colors">
                <li><span className="text-emerald-500 dark:text-emerald-400 mr-2">✓</span> Lifetime Access</li>
                <li><span className="text-emerald-500 dark:text-emerald-400 mr-2">✓</span> Instant Delivery</li>
                <li><span className="text-emerald-500 dark:text-emerald-400 mr-2">✓</span> Secure Checkout</li>
                <li><span className="text-emerald-500 dark:text-emerald-400 mr-2">✓</span> 60-Day Guarantee</li>
              </ul>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Buy Now Sidebar (Desktop) */}
      <div 
        className={`position-fixed bottom-0 end-0 p-6 hidden lg:block transition-all`} 
        style={{ zIndex: 1000, transform: showStickySidebar ? 'translateY(0)' : 'translateY(150%)', right: '2rem', bottom: '2rem' }}
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg flex items-center gap-4">
          <div>
            <h6 className="font-bold text-slate-900 dark:text-white mb-1" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {deal.title}
            </h6>
            <div className="text-orange-500 font-extrabold text-lg">₹{deal.discountPrice.toFixed(2)}</div>
          </div>
          <div className="flex gap-2">
            <button className="font-bold rounded-full" onClick={handleAddToCart} disabled={addingToCart || purchasing}>
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button className="font-bold rounded-full shadow-sm" onClick={handlePurchase} disabled={addingToCart || purchasing}>
              {purchasing ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealDetails;
