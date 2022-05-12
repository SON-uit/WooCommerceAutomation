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
  "0 */1 * * * *",
  async function () {
    const allOrders = await apiOrder.getAllOrder({
      status: "processing",
    });
	allOrders.forEach(async function(order) {
		await Promise.all(order.line_items.map(async function (product) {
			const getProduct = await apiProduct.getProductById(product.product_id);
			console.log(getProduct.name);
			/* const updatedProduct = await apiProduct.updateProduct(
				product.product_id,
				{
					stock_quantity: stock_quantity
				})
			console.log(`${product.name} so luong ${product.quantity} gia ${product.price} tong ${product.total}`) */
		}))
	})
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
updateProductInStock.start();
