const express = require("express");
const productApi = require("../api/api.product");
const router = express.Router();

router.get("/", async function (req, res) {
  let page = 1;
  if (req.query !== null) {
    page = req.query.page;
  }
  const products = await productApi.getAllProducts(page);
  return res.status(200).json({
    message: "Success",
    length: products.length,
    data: products,
  });
});
// update regular price or stock_quantity
router.put("/:producId", async function (req, res) {
  const { regular_price = "", stock_quantity = "" } = req.body;
  const options = {
    regular_price: regular_price,
    stock_quantity: stock_quantity,
  };
  const productId = req.params.producId * 1;
  const updatedProduct = await productApi.updateProduct(productId, options);
  return res.status(200).json({
    message: "Success",
    data: updatedProduct,
  });
});
router.delete("/:producId", async function (req, res) {
  const productid = req.params.producId* 1;
  const deletedProduct = await productApi.deleteProduct(productid);
  return res.status(200).json({
    message: "Delete Product Successfully",
    data: deletedProduct,
  });
});
module.exports = router;
