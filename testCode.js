const fs = require("fs");
const CronJob = require("cron").CronJob;
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

function writeFileStore() {
  let text = "Seleted Order By CronJob: \n";
  fs.writeFileSync("programming.txt", text);
}
function addNewOrderIdToTxt(...orderId) {
  let addString = `At ${getCurrentTime()}\n`;
  orderId.forEach((el) => (addString += `#${el}\n`));
  fs.appendFileSync("selectedOrderIds.txt", addString, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}
function selectedOrderIds() {
  const text = fs.readFileSync("selectedOrderIds.txt", "utf8");
  const result = text
    .split("\n")
    .filter((el) => el.startsWith("#"))
    .map((el) => +el.trim().replace("#", ""));
  return result;
}
//writeFileStore ()
let count = 0;
const job = new CronJob(
  "*/10 * * * * *",
  function () {
    addNewOrderIdToTxt(count, (count += 1), (count += 2));
    count++;
    const temp = selectedOrderIds();
    console.log(temp)
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
