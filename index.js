const express = require('express');
const app = express();
const apiProduct = require("./api/api.product");
const catchAsync = require("./helper/catchAsync")
const PORT = 3000;

app.listen(PORT, function()  {
  console.log('listening on port'+PORT);
})
app.get('/api/products', catchAsync(async function(req, res) {
  const product = await apiProduct.getProductById(1540);
  res.status(200).send(product.name);
}))
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Something broke!')
})