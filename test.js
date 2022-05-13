/* const apiOrder = require("./api/api.order");
const apiProduct = require("./api/api.product");
const Mail = require("./feature/sendMail");
const selectedOrder = [];
const shopURL = "https://bluecishop.xyz/";
(async function () {
  console.log("Cronjob Start");
  const allOrders = await apiOrder.getAllOrder({
    status: "processing",
  });
  const newOrder = allOrders.filter((el) => !selectedOrder.includes(el.id));
  newOrder.forEach((el) => selectedOrder.push(el.id));
  const emailsCustomer = [];
  newOrder.forEach((el) => emailsCustomer.push(el.billing.email));
  const test = new Mail(newOrder[0].billing, shopURL, newOrder[0].line_items);
  await test.sendMail();
})();
 */

/* let s= new Date().toLocaleString();

console.log(s); */
const CronJob = require("cron").CronJob;
const apiOrder = require("./api/api.order");
const apiProduct = require("./api/api.product");
const updateProductInStock = new CronJob(
  "*/30 * * * * *",
  async function () {
    const allOrders = await apiOrder.getAllOrder({
      status: "processing",
    });
    const newOrder = allOrders;
    await Promise.all(
      newOrder.map(async function (order) {
        for (let i = 0; i < order.line_items.length; i++) {
          const getProduct = await apiProduct.getProductById(
            order.line_items[i].product_id
          );
          order.line_items[i].mainImg = getProduct.images[0].src;
        }
        console.log(order);
        /* const updatedProduct = await apiProduct.updateProduct(
				product.product_id,
				{
					stock_quantity: stock_quantity
				})
			console.log(`${product.name} so luong ${product.quantity} gia ${product.price} tong ${product.total}`) */
      })
    );
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
updateProductInStock.start();
