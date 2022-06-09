const wooApi = require("../WoocommerceConnect");
const catchAsync = require("../helper/catchAsync");
const getAllProducts = async (options) => {
  response = await wooApi.get(`products/`, options);
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
  deleteProduct,
};
/* (async () => {
  const updateProduct1 = await updateProduct(5224, {
    regular_price: "50000",
  })
  console.log(updateProduct1)
})() */
