import { toast } from "react-toastify";
import * as paymentService from "../api/paymentApi";

export const invokeRazorpayFlow = async ({
  items,
  appliedCouponCode = null,
  navigate,
  onSuccessCallback = null,
  onFailureCallback = null,
  finallyCallback = null,
}) => {
  try {
    const paymentItems = items.map((i) => ({
      dealId: i.dealId,
      quantity: i.quantity,
    }));

    const order = await paymentService.createPaymentOrder(
      appliedCouponCode,
      paymentItems,
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount * 100,
      currency: order.currency,
      name: "ToolPlus",
      description: "Purchase Deals",
      order_id: order.razorpayOrderId,
      handler: async function (response) {
        try {
          await paymentService.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );
          
          if (onSuccessCallback) {
            await onSuccessCallback();
          }

          toast.success("Payment successful! Your orders have been placed.");
          navigate("/payment-success", {
            state: {
              orderId: order.razorpayOrderId,
              amount: order.amount,
              deals: items,
            },
          });
        } catch (err) {
          toast.error("Payment verification failed.");
          navigate("/payment-failed", {
            state: { reason: "Verification failed", amount: order.amount },
          });
        }
      },
      theme: {
        color: "#f97316",
      },
      modal: {
        ondismiss: function() {
          toast.info("Payment cancelled.");
          if (finallyCallback) finallyCallback();
        }
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      toast.error(response.error.description);
      if (onFailureCallback) onFailureCallback();
      navigate("/payment-failed", {
        state: { reason: response.error.description, amount: order.amount },
      });
    });
    rzp1.open();
  } catch (error) {
    const msg =
      error.response?.data?.message || "Checkout failed. Please try again.";
    toast.error(msg);
    if (finallyCallback) finallyCallback();
  }
};
