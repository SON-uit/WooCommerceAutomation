const express = require("express");
const orderApi = require("../api/api.order");
const router = express.Router();

router.get("/", async function (req, res) {
  let page = 1;
  if (req.query !== null) {
    page = req.query.page;
  }
  const orders = await orderApi.getAllOrder({
      page: page,
      per_page: 20,
  });
  return res.status(200).json({
    message: "Success",
    length: orders.length,
    data: orders,
  });
});
module.exports = router;