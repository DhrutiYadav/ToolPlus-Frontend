import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBanner from "../components/HeroBanner";
import CategoryCard from "../components/CategoryCard";
import DealCard from "../components/DealCard";
import SkeletonLoader from "../components/SkeletonLoader";
import {
  Package,
  Users,
  Layout,
  Percent,
  Star,
  Quote,
  ShieldCheck,
  Zap,
  Search,
  ShoppingCart,
  Infinity as InfinityIcon,
} from "lucide-react";
import { getCategories } from "../services/categoryService";
import { getDeals } from "../services/dealService";

const CountUpStat = ({ end, suffix = "", duration = 2, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min(
        (timestamp - startTimestamp) / (duration * 1000),
        1,
      );
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [trigger, end, duration]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <Package size={28} />,
      end: 500,
      suffix: "+",
      label: "Software Deals",
    },
    {
      icon: <Users size={28} />,
      end: 10000,
      suffix: "+",
      label: "Happy Customers",
    },
    { icon: <Layout size={28} />, end: 50, suffix: "+", label: "Categories" },
    {
      icon: <Percent size={28} />,
      end: 95,
      suffix: "%",
      label: "Average Savings",
    },
  ];

  const howItWorksSteps = [
    {
      icon: <Search size={28} />,
      step: "01",
      title: "Browse Deals",
      desc: "Search through 500+ curated software deals across 50+ categories. Find tools that match your workflow.",
    },
    {
      icon: <ShoppingCart size={28} />,
      step: "02",
      title: "Buy Once",
      desc: "Pay a single one-time fee. No hidden costs, no monthly subscriptions. Checkout in seconds.",
    },
    {
      icon: <InfinityIcon size={28} />,
      step: "03",
      title: "Use Forever",
      desc: "Get lifetime access to the software. Updates, features, support — all included, forever.",
    },
  ];

  const whyUsItems = [
    {
      icon: <InfinityIcon size={24} />,
      title: "Lifetime Access",
      desc: "Pay once, use forever. Say goodbye to heavy monthly subscriptions and recurring fees.",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "60-Day Guarantee",
      desc: "Try any software risk-free for 2 months. If not satisfied, get a 100% refund, no questions asked.",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      icon: <Zap size={24} />,
      title: "VIP Customer Support",
      desc: "Our support staff handles developer communication and assists you directly whenever issues occur.",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
  ];

  return (
    <div className="home-page">
      <HeroBanner />

      {/* Trust Statistics Section */}
      <section className="trust-statistics-section py-8 mb-8" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl text-center shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <h3 className="font-extrabold text-3xl text-slate-900 dark:text-white mb-1">
                    <CountUpStat
                      end={stat.end}
                      suffix={stat.suffix}
                      trigger={statsVisible}
                    />
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SkeletonLoader />
        </div>
      ) : (
        <>
          {/* Top Categories */}
          {categories.length > 0 && (
            <section className="py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <span className="text-orange-500 font-bold uppercase text-sm tracking-wider">
                      Browse 50+ Categories
                    </span>
                    <h2 className="font-extrabold text-3xl text-slate-900 dark:text-white mt-1">
                      Find Your Next Tool
                    </h2>
                  </div>
                  <Link
                    to="/categories"
                    className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-full font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Featured Deals */}
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-orange-500 font-bold uppercase text-sm tracking-wider">
                    Hottest Offers
                  </span>
                  <h2 className="font-extrabold text-3xl text-slate-900 dark:text-white mt-1">
                    Featured Lifetime Deals
                  </h2>
                </div>
                <Link
                  to="/deals"
                  className="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-full font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  See More Deals →
                </Link>
              </div>

              {deals.length === 0 ? (
                <div className="text-center py-12 border border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    No Deals Available
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    There are no active deals right now. Please check back
                    later!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deals.map((deal, index) => (
                    <motion.div
                      key={deal.id}
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
            </div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works-section py-12 my-6 bg-gradient-to-br from-orange-50/70 to-amber-50/40 dark:from-slate-900 dark:to-slate-800/70 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 text-center mb-10">
              <span className="text-orange-500 font-bold uppercase text-sm tracking-wider">
                Simple Process
              </span>
              <h2 className="font-extrabold text-4xl text-slate-900 dark:text-white mt-2">
                How It Works
              </h2>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative">
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 opacity-30" />
              <div className="grid md:grid-cols-3 gap-8 relative">
                {howItWorksSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="text-center"
                  >
                    <div className="mx-auto w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                      {step.icon}
                    </div>
                    <div className="text-5xl font-black text-orange-100 dark:text-orange-900/30 mb-2">
                      {step.step}
                    </div>
                    <h4 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section - Wall of Love */}
          <section className="testimonials-section py-12 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-10">
                <span className="text-orange-500 font-bold uppercase text-sm tracking-wider">
                  Wall of Love
                </span>
                <h2 className="font-extrabold text-4xl text-slate-900 dark:text-white mt-2">
                  What Our Customers Say
                </h2>
              </div>

              <div className="overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                <div className="flex gap-6 md:grid md:grid-cols-3 md:gap-8 w-max md:w-auto">
                  {/* Testimonial 1 */}
                  <div className="w-[320px] md:w-auto flex-shrink-0 snap-center">
                    <div className="bg-slate-50 dark:bg-slate-800 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-full relative">
                      <Quote
                        className="absolute top-6 right-6 text-orange-500 dark:text-orange-400 opacity-20"
                        size={42}
                      />
                      <div className="flex text-amber-500 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-8 text-[15.5px]">
                        "Saved thousands on software purchases. The lifetime
                        deals are unbelievable and the support is top-notch."
                      </p>
                      <div className="flex items-center">
                        <div className="w-11 h-11 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mr-4 text-lg">
                          SJ
                        </div>
                        <div>
                          <h6 className="font-semibold text-slate-900 dark:text-white">
                            Sarah Johnson
                          </h6>
                          <small className="text-slate-500 dark:text-slate-400">
                            Startup Founder
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="w-[320px] md:w-auto flex-shrink-0 snap-center">
                    <div className="bg-slate-50 dark:bg-slate-800 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-full relative">
                      <Quote
                        className="absolute top-6 right-6 text-orange-500 dark:text-orange-400 opacity-20"
                        size={42}
                      />
                      <div className="flex text-amber-500 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-8 text-[15.5px]">
                        "This platform has completely transformed how our agency
                        discovers new tools. It's my go-to marketplace."
                      </p>
                      <div className="flex items-center">
                        <div className="w-11 h-11 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold mr-4 text-lg">
                          MD
                        </div>
                        <div>
                          <h6 className="font-semibold text-slate-900 dark:text-white">
                            Michael Davis
                          </h6>
                          <small className="text-slate-500 dark:text-slate-400">
                            Marketing Director
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="w-[320px] md:w-auto flex-shrink-0 snap-center">
                    <div className="bg-slate-50 dark:bg-slate-800 p-7 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-full relative">
                      <Quote
                        className="absolute top-6 right-6 text-orange-500 dark:text-orange-400 opacity-20"
                        size={42}
                      />
                      <div className="flex text-amber-500 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={20} fill="currentColor" />
                        ))}
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-8 text-[15.5px]">
                        "Every week I find a new gem here. The 60-day refund
                        policy makes trying out new software completely
                        risk-free!"
                      </p>
                      <div className="flex items-center">
                        <div className="w-11 h-11 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mr-4 text-lg">
                          EC
                        </div>
                        <div>
                          <h6 className="font-semibold text-slate-900 dark:text-white">
                            Emily Chen
                          </h6>
                          <small className="text-slate-500 dark:text-slate-400">
                            Freelance Designer
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why ToolPlus Section */}
          <section className="benefits-section py-12 bg-gradient-to-br from-slate-50 to-orange-50/60 dark:from-slate-900 dark:to-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <span className="text-orange-500 font-bold uppercase text-sm tracking-wider">
                Why Choose Us
              </span>
              <h2 className="font-extrabold text-3xl text-slate-900 dark:text-white mt-2 mb-10">
                The ToolPlus Guarantee
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {whyUsItems.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
                  >
                    <div
                      className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      {item.icon}
                    </div>
                    <h5 className="font-bold text-xl mb-3">{item.title}</h5>
                    <p className="text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Home;
