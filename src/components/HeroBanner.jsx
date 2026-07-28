import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HeroBanner.css";

function HeroBanner() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = heroSearch.trim();
    if (q) {
      navigate(`/deals?search=${encodeURIComponent(q)}`);
    } else {
      navigate("/deals");
    }
  };

  return (
    <section
      className="
        relative
        mx-auto
        mt-2
        mb-5
        max-w-[1450px]
        flex
        items-center
        justify-between
        gap-8
        xl:gap-12
        2xl:gap-16
        overflow-hidden
        rounded-[20px]
        border
        border-slate-200
        bg-gradient-to-br
        from-orange-50
        via-white
        to-orange-50
        py-8
        shadow-sm
        dark:border-slate-700
        dark:from-slate-900
        dark:via-slate-800
        dark:to-slate-900
        px-6
        sm:px-8
        lg:px-14
        xl:px-20
        2xl:px-24
        lg:py-10
        xl:py-12
      "
    >
      <motion.div
        className="relative z-10 w-full
          max-w-[900px]
          xl:max-w-[980px]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.span
          className="
            inline-flex
            items-center
            rounded-full
            border
            border-orange-200
            bg-orange-50
            px-3.5
            py-1.5
            text-xs
            font-semibold
            tracking-wide
            text-orange-600
            shadow-sm
            dark:border-orange-500/30
            dark:bg-orange-500/10
            dark:text-orange-400
            "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🚀 Lifetime Software Deals
        </motion.span>

        <motion.h1
          // className="
          //   mt-0
          //   mb-1

          //   text-[2.85rem]
          //   sm:text-[3.9rem]
          //   lg:text-[6.2rem]
          //   font-extrabold
          //   tracking-tight

          //   leading-[1.1]
          //   sm:leading-[1.06]
          //   lg:leading-[1.02]

          //   text-slate-900
          //   transition-colors
          //   dark:text-white
          // "

          className="
            font-display
            font-extrabold
            tracking-tight
            text-slate-900
          dark:text-white
            leading-[1.02]
            mb-5
            text-[3rem]
            sm:text-[4rem]
            lg:text-[6rem]
            xl:text-[6.75rem]
            2xl:text-[7.25rem]
            "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Discover Amazing Tools
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">
            Without Monthly Fees
          </span>
        </motion.h1>

        <motion.p
          className="
            mt-0
            mb-2
            max-w-[700px]

            text-[14px]
            leading-6

            font-normal

            text-slate-500
            dark:text-slate-400

            lg:text-[16px]
            lg:leading-7
          "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Find powerful software deals for entrepreneurs, developers, and
          growing businesses. Save up to 95% today!
        </motion.p>

        {/* Hero Search Bar */}
        <motion.form
          onSubmit={handleHeroSearch}
          className="w-full max-w-full lg:max-w-[520px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <div
            className="
              flex
              items-center
              rounded-full
              border
              border-slate-300/70
              bg-white/95
              h-12
              sm:h-[52px]
              px-4
              sm:px-5
              gap-3
              shadow-black/5
              backdrop-blur-sm
              transition-all
              duration-300
              focus-within:border-orange-500
              focus-within:shadow-orange-500/20
              dark:border-slate-700
              dark:bg-slate-800/90
            "
          >
            <svg
              className="
                shrink-0
                text-slate-400
                "
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              mr-2
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              className="
                flex-1
                h-full
                bg-transparent
                text-sm
                sm:text-base
                min-w-0
                font-medium
                tracking-tight
                text-slate-900
                outline-none
                placeholder:text-slate-400
                placeholder:font-medium
                dark:text-slate-100
              "
              placeholder="Search 500+ software deals..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
            />
            <button
              type="submit"
              className="

                flex
                items-center
                justify-center
                bg-orange-500
                hover:bg-orange-600
                h-8
                sm:h-9
                min-w-[100px]
                sm:min-w-[120px]
                px-5
                sm:px-7
                text-sm
                text-white
                font-semibold

                transition-all

                !rounded-full
              "
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Trust Badges */}
        <motion.div
          className="mb-3 flex
            flex-wrap
            justify-center
            lg:justify-start
            gap-2
            sm:gap-3
            mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { icon: "⭐", text: "4.8 Rating" },
            { icon: "🔥", text: "500+ Deals" },
            { icon: "🛡️", text: "Secure Payments" },
            { icon: "✅", text: "60-Day Guarantee" },
            { icon: "⚡", text: "Instant Access" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center bg-white dark:bg-slate-800 px-3
                sm:px-4 py-1 sm:py-1.5 gap-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <span className="flex items-center gap-1.5 text-[15px]">
                {badge.icon}
              </span>
              <span className="font-semibold !text-slate-700 dark:!text-slate-300 text-[14px]">
                {badge.text}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-4
            flex
            flex-wrap
            gap-3
            sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/deals"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              px-6
              sm:px-7
              py-2
              text-sm
              sm:text-base
              font-semibold
              text-white
              shadow-md
              transition-all
              duration-300
              hover:bg-blue-700
              hover:-translate-y-0.5
              hover:shadow-lg
              active:translate-y-0
            "
          >
            Browse All Deals →
          </Link>

          <Link
            to="/categories"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-slate-300
              bg-white/90
              backdrop-blur-sm
              px-6
              sm:px-7
              py-2.5
              text-sm
              sm:text-base
              font-semibold
              text-slate-700
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-orange-500
              hover:bg-orange-50
              hover:text-orange-600
              hover:shadow-md
              dark:border-slate-700
              dark:bg-slate-800/80
              dark:text-slate-300
              dark:hover:border-orange-500
              dark:hover:bg-slate-700
              dark:hover:text-orange-400
            "
          >
            View Categories
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated SVG Illustration */}
      <motion.div
        className="
          relative
          z-10
          hidden
          lg:flex
          items-center
          justify-center
          flex-1
          lg:max-w-[42%]
          lg:-translate-y-3 xl:-translate-y-4
        "
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <div
          className="
            hero-illustration
            drop-shadow-2xl
            w-[360px]
            xl:w-[420px]
            2xl:w-[470px]
            shrink-0
          "
        >
          <svg
            className="w-full h-auto"
            viewBox="0 0 380 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main dashboard card */}
            <rect
              x="40"
              y="60"
              width="200"
              height="140"
              rx="16"
              fill="white"
              className="hero-svg-card-light"
              filter="url(#shadow1)"
            />
            <rect
              x="40"
              y="60"
              width="200"
              height="140"
              rx="16"
              fill="#1e293b"
              className="hero-svg-card-dark"
              filter="url(#shadow1)"
            />
            {/* Card header bar */}
            <rect
              x="40"
              y="60"
              width="200"
              height="40"
              rx="16"
              fill="#f97316"
            />
            <rect x="40" y="82" width="200" height="18" fill="#f97316" />
            {/* Header dots */}
            <circle cx="62" cy="80" r="5" fill="rgba(255,255,255,0.5)" />
            <circle cx="80" cy="80" r="5" fill="rgba(255,255,255,0.5)" />
            <circle cx="98" cy="80" r="5" fill="rgba(255,255,255,0.5)" />
            {/* Stat rows */}
            <rect x="56" y="118" width="80" height="8" rx="4" fill="#e2e8f0" />
            <rect x="56" y="134" width="120" height="6" rx="3" fill="#e2e8f0" />
            <rect x="56" y="148" width="60" height="6" rx="3" fill="#e2e8f0" />
            {/* Progress bar */}
            <rect x="56" y="162" width="168" height="8" rx="4" fill="#f1f5f9" />
            <rect x="56" y="162" width="120" height="8" rx="4" fill="#f97316" />
            {/* Price badge on card */}
            <rect
              x="160"
              y="114"
              width="64"
              height="32"
              rx="10"
              fill="#fff7ed"
            />
            <text
              x="170"
              y="134"
              fontSize="13"
              fontWeight="700"
              fill="#f97316"
              fontFamily="system-ui"
            >
              ₹999
            </text>

            {/* Floating tool icons */}
            {/* Tool card 1 - top right */}
            <g className="hero-float-1">
              <rect
                x="260"
                y="30"
                width="100"
                height="70"
                rx="12"
                fill="white"
                filter="url(#shadow2)"
              />
              <rect
                x="268"
                y="42"
                width="40"
                height="40"
                rx="8"
                fill="#eff6ff"
              />
              <text x="276" y="68" fontSize="20">
                ⚡
              </text>
              <rect
                x="316"
                y="50"
                width="36"
                height="6"
                rx="3"
                fill="#e2e8f0"
              />
              <rect
                x="316"
                y="62"
                width="26"
                height="5"
                rx="2.5"
                fill="#e2e8f0"
              />
            </g>

            {/* Tool card 2 - bottom right */}
            <g className="hero-float-2">
              <rect
                x="270"
                y="130"
                width="100"
                height="70"
                rx="12"
                fill="white"
                filter="url(#shadow2)"
              />
              <rect
                x="278"
                y="142"
                width="40"
                height="40"
                rx="8"
                fill="#f0fdf4"
              />
              <text x="285" y="168" fontSize="20">
                🛡️
              </text>
              <rect
                x="326"
                y="150"
                width="36"
                height="6"
                rx="3"
                fill="#e2e8f0"
              />
              <rect
                x="326"
                y="162"
                width="26"
                height="5"
                rx="2.5"
                fill="#e2e8f0"
              />
            </g>

            {/* Tool card 3 - bottom left */}
            <g className="hero-float-3">
              <rect
                x="30"
                y="230"
                width="100"
                height="65"
                rx="12"
                fill="white"
                filter="url(#shadow2)"
              />
              <rect
                x="40"
                y="242"
                width="36"
                height="36"
                rx="8"
                fill="#fef3c7"
              />
              <text x="46" y="266" fontSize="20">
                🏆
              </text>
              <rect
                x="84"
                y="250"
                width="38"
                height="6"
                rx="3"
                fill="#e2e8f0"
              />
              <rect
                x="84"
                y="262"
                width="28"
                height="5"
                rx="2.5"
                fill="#e2e8f0"
              />
            </g>

            {/* Notification badge */}
            <g className="hero-float-4">
              <rect
                x="170"
                y="210"
                width="160"
                height="50"
                rx="12"
                fill="white"
                filter="url(#shadow2)"
              />
              <circle cx="194" cy="235" r="14" fill="#dcfce7" />
              <text x="186" y="240" fontSize="16">
                ✅
              </text>
              <rect
                x="216"
                y="226"
                width="96"
                height="7"
                rx="3.5"
                fill="#e2e8f0"
              />
              <rect
                x="216"
                y="239"
                width="72"
                height="5"
                rx="2.5"
                fill="#e2e8f0"
              />
            </g>

            {/* Defs */}
            <defs>
              <filter id="shadow1" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="10"
                  floodColor="#00000020"
                />
              </filter>
              <filter id="shadow2" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="8"
                  floodColor="#00000018"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-bl from-orange-100/50 to-transparent dark:from-orange-500/10 rounded-full blur-3xl opacity-50 z-0 translate-x-1/4 -translate-y-1/4"></div>

      {/* "As Seen On" Strip */}
      <div
        className="
          absolute
          bottom-0
          left-0
          flex
          w-full
          flex-wrap
          items-center
          gap-2.5
          border-t
          border-slate-200/60
          bg-white/40
          px-6
          py-2
          backdrop-blur-md
          dark:border-slate-700/50
          dark:bg-slate-900/40
          "
      >
        <span className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-[0.18em] mr-2">
          As seen on
        </span>
        {["Product Hunt", "TechCrunch", "Forbes", "Indie Hackers"].map(
          (brand) => (
            <span
              key={brand}
              className="
                rounded-full
                border
                border-slate-200
                bg-white/70
                px-2.5
                py-0.5
                text-xs
                font-semibold
                text-slate-500
                transition
                hover:border-orange-500
                hover:text-orange-500
                dark:border-slate-700
                dark:bg-slate-800/60
                "
            >
              {brand}
            </span>
          ),
        )}
      </div>
    </section>
  );
}

export default HeroBanner;
