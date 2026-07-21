import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBanner from "../components/HeroBanner";
import CategoryCard from "../components/CategoryCard";
import DealCard from "../components/DealCard";
import SkeletonLoader from "../components/SkeletonLoader";
import {
  Package, Users, Layout, Percent, Star, Quote,
  ShieldCheck, Zap, Search, ShoppingCart, Infinity as InfinityIcon
} from "lucide-react";
import { getCategories } from "../services/categoryService";
import { getDeals } from "../services/dealService";
import "../styles/Home.css";

// CountUpStat — only triggers when visible via IntersectionObserver
const CountUpStat = ({ end, suffix = "", duration = 2, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [trigger, end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
};

function Home() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesData, dealsData] = await Promise.all([
          getCategories(),
          getDeals(),
        ]);
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

  // Intersection observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: <Package size={28} />, end: 500, suffix: "+", label: "Software Deals" },
    { icon: <Users size={28} />, end: 10000, suffix: "+", label: "Happy Customers" },
    { icon: <Layout size={28} />, end: 50, suffix: "+", label: "Categories" },
    { icon: <Percent size={28} />, end: 95, suffix: "%", label: "Average Savings" }
  ];

  const howItWorksSteps = [
    {
      icon: <Search size={28} />,
      step: "01",
      title: "Browse Deals",
      desc: "Search through 500+ curated software deals across 50+ categories. Find tools that match your workflow."
    },
    {
      icon: <ShoppingCart size={28} />,
      step: "02",
      title: "Buy Once",
      desc: "Pay a single one-time fee. No hidden costs, no monthly subscriptions. Checkout in seconds."
    },
    {
      icon: <InfinityIcon size={28} />,
      step: "03",
      title: "Use Forever",
      desc: "Get lifetime access to the software. Updates, features, support — all included, forever."
    }
  ];

  const whyUsItems = [
    {
      icon: <InfinityIcon size={24} />,
      title: "Lifetime Access",
      desc: "Pay once, use forever. Say goodbye to heavy monthly subscriptions and recurring fees.",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10"
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "60-Day Guarantee",
      desc: "Try any software risk-free for 2 months. If not satisfied, get a 100% refund, no questions asked.",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
      icon: <Zap size={24} />,
      title: "VIP Customer Support",
      desc: "Our support staff handles developer communication and assists you directly whenever issues occur.",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Header */}
      <HeroBanner />

      {/* Trust Statistics Section */}
      <section className="trust-statistics-section py-6 mb-6" ref={statsRef}>
        <div className="container px-0">
          <div className="flex flex-wrap -mx-6 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="col-6 col-md-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="bg-white dark:bg-slate-900 p-[20px] rounded-2xl text-center shadow-sm flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 transition-all duration-300 group"
                  whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                >
                  <div className="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 p-2 w-[48px] h-[48px] flex items-center justify-center rounded-full mb-[10px] transition-transform duration-300 group-hover:scale-110 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20">
                    {stat.icon}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">
                    <CountUpStat end={stat.end} suffix={stat.suffix} trigger={statsVisible} />
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-0 font-medium transition-colors">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="container py-6">
          <SkeletonLoader />
        </div>
      ) : (
        <>
          {/* Top Categories Section */}
          {categories.length > 0 && (
            <section className="categories-section py-6 my-2">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-orange-500 font-bold uppercase text-sm tracking-wider transition-colors">Browse 50+ Categories</span>
                  <h2 className="font-extrabold text-slate-900 dark:text-white mt-1 transition-colors">Find Your Next Tool</h2>
                </div>
                <Link to="/categories" className="btn btn-outline-secondary border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 rounded-full px-6 font-bold hover-lift transition-all duration-300 hover:shadow-sm">
                  View All &rarr;
                </Link>
              </div>
              <div className="flex flex-wrap -mx-6 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="col-md-4">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Deals Section */}
          <section className="featured-deals-section py-6 my-2">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-orange-500 font-bold uppercase text-sm tracking-wider transition-colors">Hottest Offers</span>
                <h2 className="font-extrabold text-slate-900 dark:text-white mt-1 transition-colors">Featured Lifetime Deals</h2>
              </div>
              <Link to="/deals" className="btn btn-outline-secondary border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 rounded-full px-6 font-bold hover-lift transition-all duration-300 hover:shadow-sm">
                See More Deals &rarr;
              </Link>
            </div>

            {deals.length === 0 ? (
              <div className="text-center py-12 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm transition-colors empty-state-container">
                <div className="empty-state-icon bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 mx-auto transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white transition-colors">No Deals Available</h4>
                <p className="text-slate-500 dark:text-slate-400 mx-auto transition-colors home-copy-width-sm">
                  There are no active deals right now. Please check back later!
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap -mx-6 gap-4">
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

          {/* How It Works Section */}
          <section className="how-it-works-section py-[48px] my-6 bg-gradient-to-br from-orange-50/60 to-amber-50/30 dark:from-slate-900 dark:to-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="text-center mb-[40px]">
              <span className="text-orange-500 font-bold uppercase text-sm tracking-wider transition-colors">Simple Process</span>
              <h2 className="font-extrabold text-slate-900 dark:text-white mt-1 transition-colors">How It Works</h2>
            </div>
            <div className="relative">
              {/* Connecting line (desktop only) */}
              <div className="how-it-works-line hidden md:block"></div>
              <div className="flex flex-wrap -mx-6 gap-6 relative">
                {howItWorksSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="col-md-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <div className="text-center relative p-[24px]">
                      <div className="how-step-number">{step.step}</div>
                      <div className="how-step-icon bg-orange-500 text-white rounded-full inline-flex items-center justify-center mb-6 shadow-md">
                        {step.icon}
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2 transition-colors">{step.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-0 transition-colors">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section - horizontal scroll on mobile */}
          <section className="testimonials-section py-6 my-2 transition-colors">
            <div className="text-center mb-6">
              <span className="text-orange-500 font-bold uppercase text-sm tracking-wider transition-colors">Wall of Love</span>
              <h2 className="font-extrabold text-slate-900 dark:text-white mt-1 transition-colors">What Our Customers Say</h2>
            </div>
            <div className="testimonials-scroll-container">
              <div className="flex flex-wrap -mx-6 gap-4 flex-nowrap flex-md-wrap overflow-auto overflow-md-visible pb-2 pb-md-0 home-testimonials-flex flex-wrap -mx-6">
                {/* Testimonial 1 */}
                <div className="col-10 col-md-4 home-testimonial-item">
                  <div className="bg-white dark:bg-slate-900 p-[24px] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover-lift relative transition-all duration-300 hover:shadow-md group h-full">
                    <Quote className="absolute top-0 end-0 mt-6 mr-4 text-orange-500 dark:text-orange-400 opacity-25" size={40} />
                    <div className="flex text-warning mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-base font-medium mb-[12px] transition-colors">
                      "Saved thousands on software purchases. The lifetime deals are unbelievable and the support is top-notch."
                    </p>
                    <div className="flex items-center">
                      <div className="bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-4 transition-colors home-avatar-45">SJ</div>
                      <div>
                        <h6 className="font-bold mb-0 text-slate-900 dark:text-white transition-colors">Sarah Johnson</h6>
                        <small className="text-slate-500 dark:text-slate-400 transition-colors">Startup Founder</small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Testimonial 2 */}
                <div className="col-10 col-md-4 home-testimonial-item">
                  <div className="bg-white dark:bg-slate-900 p-[24px] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover-lift relative transition-all duration-300 hover:shadow-md group h-full">
                    <Quote className="absolute top-0 end-0 mt-6 mr-4 text-orange-500 dark:text-orange-400 opacity-25" size={40} />
                    <div className="flex text-warning mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-base font-medium mb-[12px] transition-colors">
                      "This platform has completely transformed how our agency discovers new tools. It's my go-to marketplace."
                    </p>
                    <div className="flex items-center">
                      <div className="bg-slate-800 dark:bg-slate-700 text-white rounded-full flex items-center justify-center font-bold mr-4 transition-colors home-avatar-45">MD</div>
                      <div>
                        <h6 className="font-bold mb-0 text-slate-900 dark:text-white transition-colors">Michael Davis</h6>
                        <small className="text-slate-500 dark:text-slate-400 transition-colors">Marketing Director</small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Testimonial 3 */}
                <div className="col-10 col-md-4 home-testimonial-item">
                  <div className="bg-white dark:bg-slate-900 p-[24px] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover-lift relative transition-all duration-300 hover:shadow-md group h-full">
                    <Quote className="absolute top-0 end-0 mt-6 mr-4 text-orange-500 dark:text-orange-400 opacity-25" size={40} />
                    <div className="flex text-warning mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-base font-medium mb-[12px] transition-colors">
                      "Every week I find a new gem here. The 60-day refund policy makes trying out new software completely risk-free!"
                    </p>
                    <div className="flex items-center">
                      <div className="bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mr-4 transition-colors home-avatar-45">EC</div>
                      <div>
                        <h6 className="font-bold mb-0 text-slate-900 dark:text-white transition-colors">Emily Chen</h6>
                        <small className="text-slate-500 dark:text-slate-400 transition-colors">Freelance Designer</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Why ToolPlus Section — with Lucide icons */}
      <section className="benefits-section py-[40px] my-2 bg-gradient-to-br from-slate-50 to-orange-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-2xl p-6 text-center relative overflow-hidden shadow-sm transition-colors border border-slate-100 dark:border-slate-800">
        <div className="absolute top-0 start-0 w-full h-full bg-white dark:bg-slate-900 opacity-50 dark:opacity-20 z-0 transition-colors"></div>
        <div className="relative z-1">
          <span className="text-orange-500 font-bold uppercase text-sm tracking-wider transition-colors">Why Choose Us</span>
          <h2 className="font-extrabold text-slate-900 dark:text-white mt-1 mb-6 transition-colors">The ToolPlus Guarantee</h2>

          <div className="flex flex-wrap -mx-6 gap-4 mt-1">
            {whyUsItems.map((item, index) => (
              <motion.div
                key={index}
                className="col-md-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
              >
                <div className="bg-white dark:bg-slate-800 p-[24px] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-full hover-lift transition-all duration-300 hover:shadow-md">
                  <div className={`${item.bg} ${item.color} w-[52px] h-[52px] rounded-full flex items-center justify-center mx-auto mb-6 transition-colors`}>
                    {item.icon}
                  </div>
                  <h5 className="font-bold mb-2 text-slate-900 dark:text-white transition-colors">{item.title}</h5>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-0 transition-colors">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* How It Works stepper line */
        .how-it-works-line {
          position: absolute;
          top: 56px;
          left: 25%;
          right: 25%;
          height: 2px;
          background: linear-gradient(to right, #f97316, #fb923c, #f97316);
          opacity: 0.3;
          z-index: 0;
        }
        .how-step-icon {
          width: 64px;
          height: 64px;
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .how-step-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 28px rgba(249, 115, 22, 0.4);
        }
        .how-step-number {
          position: absolute;
          top: 8px;
          right: 24px;
          font-size: 4rem;
          font-weight: 900;
          color: rgba(249, 115, 22, 0.06);
          font-family: 'Outfit', sans-serif;
          line-height: 1;
          pointer-events: none;
        }
        .testimonials-scroll-container {
          overflow: hidden;
        }
        @media (max-width: 767px) {
          .testimonials-scroll-container > .flex flex-wrap -mx-6 {
            overflow-x: auto;
            flex-wrap: nowrap;
            margin: 0 -12px;
            padding: 0 12px 16px;
          }
          .testimonials-scroll-container > .flex flex-wrap -mx-6::-webkit-scrollbar {
            height: 4px;
          }
          .testimonials-scroll-container > .flex flex-wrap -mx-6::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 2px;
          }
          .testimonials-scroll-container > .flex flex-wrap -mx-6::-webkit-scrollbar-thumb {
            background: #f97316;
            border-radius: 2px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;