const CronJob = require("cron").CronJob;
const fs = require("fs");
const apiOrder = require("../../api/api.order");
const isOvertime = function (createOrderDate) {
  // over 2 week
  const overTwoWeek = Date.parse(createOrderDate) + 3600 * 24 * 14 * 1000;
  if (Date.now() > overTwoWeek) {
    return true;
  } else {
    return false;
  }
};
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
const job = new CronJob(
  "0 0 0 */14 * *",
  async function () {
    const currentTime = getCurrentTime();
    console.log(`Cronjob Start At ${currentTime}`);
    //get all processing order and cancelled order in schedule time 
    const onHoldOrder = await apiOrder.getAllOrder({
      status: "on-hold",
    });
    const cancelledOrder = await apiOrder.getAllOrder({
        status: "cancelled",
      });
    //check process order is overtime
    const ordersOverTime = onHoldOrder
      .filter((order) => isOvertime(order.date_modified))
      .map((order) => order.id);
    // add cancelledOrder to ArrDeleteOrder to delete
    cancelledOrder.forEach((order) => ordersOverTime.push(order.id));
    await Promise.all(ordersOverTime.map(async (orderId) => {
        const deletedOrder = await apiOrder.deleteOrderById(orderId);
        console.log ('Deleted order'+ deletedOrder.id)
    }))
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
//job.stop();
