import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/PaymentSuccess.css";

// Confetti piece component
const ConfettiPiece = ({ style }) => (
  <div className="confetti-piece" style={style}></div>
);

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const [showConfetti, setShowConfetti] = useState(Boolean(state.orderId));

  useEffect(() => {
    if (!state.orderId) return;
    const t = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(t);
  }, [state.orderId]);

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const confettiColors = [
          "#f97316",
          "#3b82f6",
          "#22c55e",
          "#ec4899",
          "#a855f7",
          "#eab308",
        ];
        const left = ((i * 37) % 100) + 0.5;
        const size = 6 + (i % 10);
        const color = confettiColors[i % confettiColors.length];
        const delay = (i % 5) * 0.4;
        const duration = 2.5 + (i % 4) * 0.35;
        const radius = i % 2 === 0 ? "50%" : "2px";
        const rotation = (i * 27) % 360;
        return {
          id: i,
          style: {
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            borderRadius: radius,
            transform: `rotate(${rotation}deg)`,
          },
        };
      }),
    [],
  );

  const handleShare = (platform) => {
    const text = encodeURIComponent(
      "Just got an amazing lifetime deal on ToolPlus! 🚀 Check it out:",
    );
    const url = encodeURIComponent("https://toolplus.app/deals");
    if (platform === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${text}%20${url}`,
        "_blank",
      );
    }
  };

  if (!state.orderId) {
    return (
      <div className="container py-12 text-center min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col relative min-w-0 break-words shadow-lg border-0 bg-white dark:bg-slate-900 transition-colors p-12 rounded-2xl payment-empty-card">
          <div className="mb-6">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-full inline-flex items-center justify-center transition-colors payment-icon-circle">
              <i className="bi bi-bag-x payment-icon-medium payment-empty-icon"></i>
            </div>
          </div>
          <h1 className="font-bold text-slate-900 dark:text-white mb-6">
            No Recent Purchases Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
            We couldn't find a recent order associated with this session.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
            >
              Go Home
            </button>
            <Link
              to="/deals"
              className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Browse Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = state.timestamp
    ? new Date(state.timestamp).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-12 payment-page-container">
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {confettiPieces.map((p) => (
            <ConfettiPiece key={p.id} style={p.style} />
          ))}
        </div>
      )}

      <div className="flex flex-col relative min-w-0 break-words shadow-lg border-0 bg-white dark:bg-slate-900 transition-colors p-12 rounded-2xl payment-card">
        {/* Success icon */}
        <div className="mb-6">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full inline-flex items-center justify-center transition-colors payment-icon-circle">
            <i className="bi bi-check-circle-fill text-emerald-500 payment-icon-large"></i>
          </div>
        </div>

        <h1 className="font-bold text-slate-900 dark:text-white mb-2">
          Payment Successful! 🎉
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 mb-6 text-left transition-colors">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Order ID
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              #{state.orderId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Date
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              {orderDate}
            </span>
          </div>
        </div>

        {state.deals && state.deals.length > 0 && (
          <div className="mb-6 text-left">
            <h5 className="font-bold text-slate-900 dark:text-white mb-6">
              Order Summary
            </h5>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr className="text-left">
                    <th className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-200">
                      Product
                    </th>

                    <th className="w-28 px-5 py-4 text-center font-semibold">
                      Price
                    </th>

                    <th className="w-20 px-5 py-4 text-center font-semibold">
                      Qty
                    </th>

                    <th className="w-36 px-5 py-4 text-right font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {state.deals.map((deal, idx) => (
                    <tr
                      key={idx}
                      className="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
                    >
                      <td className="min-w-[260px] px-5 py-4">
                        <div className="flex items-center gap-3">
                          {deal.imageUrl ? (
                            <img
                              src={
                                /^(https?:)?\/\//.test(deal.imageUrl)
                                  ? deal.imageUrl
                                  : `${import.meta.env.BASE_URL}${deal.imageUrl.replace(
                                      /^\//,
                                      "",
                                    )}`
                              }
                              alt={deal.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700">
                              📦
                            </div>
                          )}

                          <span className="font-semibold text-slate-900 dark:text-white">
                            {deal.title || "Software Deal"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                        ₹{(deal.discountPrice || 0).toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                        {deal.quantity}
                      </td>

                      <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-white">
                        ₹
                        {((deal.discountPrice || 0) * deal.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-4 text-right font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Total
                    </td>

                    <td className="px-5 py-4 text-right text-xl font-bold text-orange-500">
                      ₹{(state.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Share flex flex-wrap -mx-6 */}
        <div className="flex items-center justify-center gap-3 mb-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">
          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Share this deal:
          </span>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
            onClick={() => handleShare("whatsapp")}
          >
            <i className="bi bi-whatsapp"></i> WhatsApp
          </button>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
          >
            <i className="bi bi-bag-check mr-2"></i>View Orders
          </Link>
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* confetti styles moved to PaymentSuccess.css */}
    </div>
  );
};

export default PaymentSuccess;
