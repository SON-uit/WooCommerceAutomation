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
  "*/2 * * * *", // for real job "* * */14 * *" (every14days)
  async function () {
    const currentTime = getCurrentTime();
    console.log(`Cronjob Delete Cancel Order Start At: ${currentTime}`);
    //get all processing order and cancelled order in schedule time
    const onHoldOrder = await apiOrder.getAllOrder({
      status: "on-hold",
    });
    const cancelledOrder = await apiOrder.getAllOrder({
      status: "cancelled",
      before: new Date(Date.now()).toISOString(),
      after: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      // for real job
      //after: new Date(Date.now() - 14 * 24* 60 * 60 * 1000).toISOString(),
    });
    //check process order is overtime
    const ordersOverTime = onHoldOrder
      .filter((order) => isOvertime(order.date_created))
      .map((order) => order.id);
    // add cancelledOrder to ArrDeleteOrder to delete
    cancelledOrder.forEach((order) => ordersOverTime.push(order.id));
    await Promise.all(
      ordersOverTime.map(async (orderId) => {
        const deletedOrder = await apiOrder.deleteOrderById(orderId);
        console.log("Deleted order" + deletedOrder.id);
      })
    );
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
console.log("Delete Overtime Order Automation Start....");
job.start();
