const express = require("express");
const app = express();
const cors = require("cors");
const apiProduct = require("./api/api.product");
const catchAsync = require("./helper/catchAsync");

//WEB AUTIOMATION
//const confirmOrderAutomation = require("./feature/cronjob/confirmOrder");
//const deleteOrderAutomation = require("./feature/cronjob/deleteOrder");
const updateInventoryAutomation = require("./feature/cronjob/updateInventory");
/////
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.listen(PORT, function () {
  console.log("listening on port" + PORT);
});
/// ROUTE
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
//Middaleware

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ERROR Handling
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("Something broke!");
});
