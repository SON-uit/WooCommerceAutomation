const wooApi = require("../WoocommerceConnect");
const catchAsync = require("../helper/catchAsync");
const getAllOrder = async (options) => {
  const response = await wooApi.get(`orders`, options);
  //console.log(response.data[0].line_items[0])
  //response.data.forEach(el => console.log(el.date_modified))
  return Promise.resolve(response.data);
};
const upDateOrderStatus = async (id) => {
  const updatedOrder = await wooApi.put(`orders/${id}`, {
    status: "completed",
  });
  return Promise.resolve(updatedOrder.data);
};
const deleteOrderById = async (id) => {
  const deletedOrder = await wooApi.delete(`orders/${id}`, {
    force: true,
  });
  return Promise.resolve(deletedOrder.data);
};
module.exports = {
  getAllOrder,
  upDateOrderStatus,
  deleteOrderById,
};
//getAllOrder({})