import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  XCircle,
  AlertTriangle,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import "../styles/PaymentFailed.css";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [shake, setShake] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    setShake(true);
    const timer = setTimeout(() => setShake(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const failureReasons = [
    {
      title: "Insufficient Funds",
      desc: "Your card may not have enough balance to complete this transaction. Please check your account balance and try again."
    },
    {
      title: "Incorrect Card Details",
      desc: "The card number, expiry date, or CVV entered may be incorrect. Double-check your card information before retrying."
    },
    {
      title: "Bank Declined",
      desc: "Your bank may have declined the transaction for security reasons. Contact your bank or try a different payment method."
    }
  ];

  return (
    <div className="min-h-screen px-4 py-12 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 payment-failed-card">

        {/* Icon */}

        <div className="flex justify-center mb-6">
          <div
            className={`h-24 w-24 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center payment-failed-icon ${
              shake ? "payment-failed-shake" : ""
            }`}
          >
            <XCircle className="h-14 w-14 text-rose-500" />
          </div>
        </div>

        {/* Heading */}

        <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white">
          Payment Failed
        </h1>

        <p className="mt-3 text-center text-lg text-slate-600 dark:text-slate-400">
          We're sorry, but your payment could not be processed.
        </p>

        {/* Failure Reason */}

        {state.reason && (
          <div className="mt-8 rounded-2xl border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20 p-6">
            <p className="text-red-700 dark:text-red-400 leading-7">
              <span className="font-semibold">Reason:</span>{" "}
              {state.reason}
            </p>
          </div>
        )}

        {/* Accordion */}

        <div className="mt-10">

          <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Common reasons for failure
          </h3>

          <div className="space-y-3">

            {failureReasons.map((reason, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center justify-between bg-slate-50 dark:bg-slate-800 px-5 py-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">

                      <AlertTriangle className="h-5 w-5 text-amber-500" />

                      <span className="font-semibold text-slate-900 dark:text-white">
                        {reason.title}
                      </span>

                    </div>

                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />

                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">

                      <div className="bg-white dark:bg-slate-900 px-5 py-4 text-slate-600 dark:text-slate-400 leading-7">
                        {reason.desc}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Buttons */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3 font-medium text-white shadow hover:bg-blue-700 transition"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <Link
            to="/deals"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 px-7 py-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;