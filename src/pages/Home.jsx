import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBanner from "../components/HeroBanner";
import CategoryCard from "../components/CategoryCard";
import DealCard from "../components/DealCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { Package, Users, Layout, Percent, Star, Quote, ShieldCheck, Zap } from "lucide-react";
import { getCategories } from "../services/categoryService";
import { getDeals } from "../services/dealService";

const CountUpStat = ({ end, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
};

function Home() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesData, dealsData] = await Promise.all([
          getCategories(),
          getDeals(),
        ]);
        
        // Show top 3 categories and top 6 deals on the homepage
        setCategories((categoriesData || []).slice(0, 3));
        setDeals((dealsData || []).slice(0, 6));
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page py-4">
      {/* Hero Header */}
      <HeroBanner />

      {/* Trust Statistics Section */}
      <section className="trust-statistics-section py-4 mb-4">
        <div className="container px-0">
          <div className="row g-4">
            {[
              { icon: <Package size={28} />, end: 500, suffix: "+", label: "Software Deals" },
              { icon: <Users size={28} />, end: 10000, suffix: "+", label: "Happy Customers" },
              { icon: <Layout size={28} />, end: 50, suffix: "+", label: "Categories" },
              { icon: <Percent size={28} />, end: 95, suffix: "%", label: "Average Savings" }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="col-6 col-md-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className="bg-white dark:bg-slate-900 p-4 rounded-4 text-center shadow-sm h-100 d-flex flex-column align-items-center justify-content-center border border-slate-100 dark:border-slate-800 transition-colors"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 p-3 rounded-circle mb-3 transition-colors">
                    {stat.icon}
                  </div>
                  <h3 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">
                    <CountUpStat end={stat.end} suffix={stat.suffix} />
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 fs-7 mb-0 fw-medium transition-colors">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="container py-4">
          <SkeletonLoader />
        </div>
      ) : (
        <>
          {/* Top Categories Section */}
          {categories.length > 0 && (
            <section className="categories-section py-5 my-3">
              <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                  <span className="text-orange-500 fw-bold text-uppercase fs-7 tracking-wider transition-colors">Categories</span>
                  <h2 className="fw-extrabold text-slate-900 dark:text-white mt-1 transition-colors">Browse by Category</h2>
                </div>
                <Link to="/categories" className="btn btn-outline-primary rounded-pill px-4 fw-bold hover-lift">
                  View All &rarr;
                </Link>
              </div>
              <div className="row g-4">
                {categories.map((category) => (
                  <div key={category.id} className="col-md-4">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Deals Section */}
          <section className="featured-deals-section py-5 my-3">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <span className="text-orange-500 fw-bold text-uppercase fs-7 tracking-wider transition-colors">Hottest Offers</span>
                <h2 className="fw-extrabold text-slate-900 dark:text-white mt-1 transition-colors">Featured Lifetime Deals</h2>
              </div>
              <Link to="/deals" className="btn btn-outline-primary rounded-pill px-4 fw-bold hover-lift">
                See More Deals &rarr;
              </Link>
            </div>
            
            {deals.length === 0 ? (
              <div className="text-center py-5 border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 shadow-sm transition-colors empty-state-container">
                <div className="empty-state-icon bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 mx-auto transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="fw-bold text-slate-900 dark:text-white transition-colors">No Deals Available</h4>
                <p className="text-slate-500 dark:text-slate-400 mx-auto transition-colors" style={{ maxWidth: "400px" }}>
                  There are no active deals right now. Please check back later!
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {deals.map((deal, index) => (
                  <motion.div 
                    key={deal.id} 
                    className="col-lg-4 col-md-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <DealCard deal={deal} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Testimonials Section */}
          <section className="testimonials-section py-5 my-3 bg-white dark:bg-slate-900 rounded-4 p-4 card-shadow transition-colors">
            <div className="text-center mb-5">
              <span className="text-orange-500 fw-bold text-uppercase fs-7 tracking-wider transition-colors">Wall of Love</span>
              <h2 className="fw-extrabold text-slate-900 dark:text-white mt-1 transition-colors">What Our Customers Say</h2>
            </div>
            <div className="row g-4">
              {/* Testimonial 1 */}
              <div className="col-md-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-4 card-shadow hover-lift h-100 position-relative transition-colors">
                  <Quote className="position-absolute top-0 end-0 mt-3 me-3 text-orange-500 dark:text-orange-400 opacity-25" size={40} />
                  <div className="d-flex text-warning mb-3">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 fs-6 fw-medium mb-4 transition-colors">
                    "Saved thousands on software purchases. The lifetime deals are unbelievable and the support is top-notch."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-orange-500 text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 transition-colors" style={{ width: '45px', height: '45px' }}>SJ</div>
                    <div>
                      <h6 className="fw-bold mb-0 text-slate-900 dark:text-white transition-colors">Sarah Johnson</h6>
                      <small className="text-slate-500 dark:text-slate-400 transition-colors">Startup Founder</small>
                    </div>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="col-md-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-4 card-shadow hover-lift h-100 position-relative transition-colors">
                  <Quote className="position-absolute top-0 end-0 mt-3 me-3 text-orange-500 dark:text-orange-400 opacity-25" size={40} />
                  <div className="d-flex text-warning mb-3">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 fs-6 fw-medium mb-4 transition-colors">
                    "This platform has completely transformed how our agency discovers new tools. It's my go-to marketplace."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-slate-800 dark:bg-slate-700 text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 transition-colors" style={{ width: '45px', height: '45px' }}>MD</div>
                    <div>
                      <h6 className="fw-bold mb-0 text-slate-900 dark:text-white transition-colors">Michael Davis</h6>
                      <small className="text-slate-500 dark:text-slate-400 transition-colors">Marketing Director</small>
                    </div>
                  </div>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="col-md-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-4 card-shadow hover-lift h-100 position-relative transition-colors">
                  <Quote className="position-absolute top-0 end-0 mt-3 me-3 text-orange-500 dark:text-orange-400 opacity-25" size={40} />
                  <div className="d-flex text-warning mb-3">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 fs-6 fw-medium mb-4 transition-colors">
                    "Every week I find a new gem here. The 60-day refund policy makes trying out new software completely risk-free!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-emerald-500 text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 transition-colors" style={{ width: '45px', height: '45px' }}>EL</div>
                    <div>
                      <h6 className="fw-bold mb-0 text-slate-900 dark:text-white transition-colors">Emily Chen</h6>
                      <small className="text-slate-500 dark:text-slate-400 transition-colors">Freelance Designer</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Why ToolPlus Section */}
      <section className="benefits-section py-5 my-5 bg-orange-50 dark:bg-orange-500/10 rounded-4 p-5 text-center position-relative overflow-hidden shadow-sm transition-colors">
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white dark:bg-slate-900 opacity-50 dark:opacity-20 z-0 transition-colors"></div>
        <div className="position-relative z-1">
          <span className="text-orange-500 fw-bold text-uppercase fs-7 tracking-wider transition-colors">Why Choose Us</span>
          <h2 className="fw-extrabold text-slate-900 dark:text-white mt-2 mb-4 transition-colors">The ToolPlus Guarantee</h2>
          
          <div className="row g-4 mt-2">
            <div className="col-md-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-3 shadow-sm h-100 card-shadow hover-lift transition-colors">
                <span className="fs-1 d-block mb-3">♾️</span>
                <h5 className="fw-bold mb-2 text-slate-900 dark:text-white transition-colors">Lifetime Access</h5>
                <p className="text-slate-500 dark:text-slate-400 fs-7 mb-0 transition-colors">Pay once, use forever. Say goodbye to heavy monthly subscriptions and recurring fees.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-3 shadow-sm h-100 card-shadow hover-lift transition-colors">
                <span className="fs-1 d-block mb-3">🛡️</span>
                <h5 className="fw-bold mb-2 text-slate-900 dark:text-white transition-colors">60-Day Guarantee</h5>
                <p className="text-slate-500 dark:text-slate-400 fs-7 mb-0 transition-colors">Try any software risk-free for 2 months. If you are not satisfied, get a 100% refund, no questions asked.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-3 shadow-sm h-100 card-shadow hover-lift transition-colors">
                <span className="fs-1 d-block mb-3">💬</span>
                <h5 className="fw-bold mb-2 text-slate-900 dark:text-white transition-colors">VIP Customer Support</h5>
                <p className="text-slate-500 dark:text-slate-400 fs-7 mb-0 transition-colors">Our support staff handles developer communication and assists you directly whenever issues occur.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;