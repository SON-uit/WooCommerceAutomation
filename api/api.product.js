const wooApi = require("../WoocommerceConnect");
const catchAsync = require("../helper/catchAsync");
const getAllProducts = async (pageNumber) => {
  const response = await wooApi.get(`products/1540`, {
    page: pageNumber,
    per_page: 20,
  });
  return Promise.resolve(response.data);
};
const getProductById = async (productId) => {
  const response = await wooApi.get(`products/${productId}`);
  return Promise.resolve(response.data);
};
const updateProduct = async (productId, options) => {
  const response = await wooApi.put(`products/${productId}`, options);
  return Promise.resolve(response.data);
};
const deleteProduct = async (productId) => {
  const response = await wooApi.delete(`products/${productId}`);
  return Promise.resolve(response.data);
};
module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
};
