const CronJob = require("cron").CronJob;
const fs = require("fs");
const apiOrder = require("../../api/api.order");
const apiProduct = require("../../api/api.product");
const Mail = require("../sendMail");
const shopURL = "https://bluecishop.xyz/";
/*
*	(all value) sử dụng trong trường hợp tất cả các giá trị đều đúng.
-	(range of values -) sử dụng để mô tả khoảng giá trị
,	(value list separator) sử dụng để liệt kê các giá trị
/	(step values) sử dụng để chỉ rõ số lần tăng
*/
function getCurrentTime() {
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const date = new Date(Date.now());
  return new Intl.DateTimeFormat("vi-VN", options).format(date);
}
function addNewOrderIdToTxt(...arrOrderIds) {
  console.log("Start add new orders to txt");

  let addString = `At ${getCurrentTime()}\n`;
  arrOrderIds.forEach((el) => (addString += `#${el}\n`));

  fs.appendFileSync("selectedOrderIds.txt", addString, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });

  console.log("End add new orders to txt");
}
function selectedOrderIds() {
  const text = fs.readFileSync("selectedOrderIds.txt", "utf8");
  const result = text
    .split("\n")
    .filter((el) => el.startsWith("#"))
    .map((el) => +el.trim().replace("#", ""));
  return result;
}
const getOrderAndMail = new CronJob(
  "*/2 * * * *",
  async function () {
    const currentTime = getCurrentTime();
    console.log(`Cronjob Start At ${currentTime}`);
    //get all processing order in schedule time
    const allOrders = await apiOrder.getAllOrder({
      status: "processing",
      before: new Date(Date.now()).toISOString(),
      after: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    });
    const newOrder = allOrders;
    if (newOrder.length !== 0) {
      // stored new selected order in txt 
      addNewOrderIdToTxt(...newOrder.map((el) => el.id));
      // send confirmMail to customer with selected orders
      await Promise.all(
        newOrder.map(async function (order) {
          // add product image link into order line_items
          for (let i = 0; i < order.line_items.length; i++) {
            const getProduct = await apiProduct.getProductById(order.line_items[i].product_id);
            order.line_items[i].mainImg = getProduct.images[0].src;
          }
          // send mail
          const confirmMail = new Mail(order.billing, shopURL, order);
          await confirmMail.sendMail();
          console.log(`Send Confirm Mail Successfully to ${order.billing.first_name} ${order.billing.last_name}`)
        })
      );
    }
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
getOrderAndMail.start();
//getOrderAndMail.stop();
