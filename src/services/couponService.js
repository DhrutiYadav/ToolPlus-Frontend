import * as couponApi from "../api/couponApi";

const couponService = {
  getAllCoupons: async () => {
    return await couponApi.getAllCoupons();
  },
  getCouponById: async (id) => {
    return await couponApi.getCouponById(id);
  },
  createCoupon: async (data) => {
    return await couponApi.createCoupon(data);
  },
  updateCoupon: async (id, data) => {
    return await couponApi.updateCoupon(id, data);
  },
  deleteCoupon: async (id) => {
    return await couponApi.deleteCoupon(id);
  },
  activateCoupon: async (id) => {
    return await couponApi.activateCoupon(id);
  },
  deactivateCoupon: async (id) => {
    return await couponApi.deactivateCoupon(id);
  },
  validateCoupon: async (code, amount) => {
    return await couponApi.validateCoupon(code, amount);
  }
};

export default couponService;
