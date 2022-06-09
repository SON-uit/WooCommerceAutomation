const puppeteer = require("puppeteer");
const fs = require("fs");

module.exports = async (productUrl) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });
  const baseURL = productUrl; // product's link in tiki page
  await page.goto(baseURL, {
    waitUntil: "networkidle2",
  });
  let sku = baseURL.split("-");
  sku = sku[sku.length - 1].split(".")[0];
  const productInfo = await page.evaluate((sku) => {
    //Name of Product
    const productName = document.querySelector(".header .title").innerText;
    // Regular Price of Product
    const regularPrice =
      (
        document.querySelector(".product-price__list-price") ||
        document.querySelector(".sale .list-price") ||
        document.querySelector(".product-price__current-price")
      ).innerText
        .match(/\d/g)
        .join("") * 1;
    // Sale Price of Product
    const salePrice =
      (
        document.querySelector(".flash-sale-price > span") ||
        document.querySelector(".product-price__current-price")
      ).innerText
        .match(/\d/g)
        .join("") * 1 || 0;
    return {
      sku: sku,
      productName,
      regularPrice,
      salePrice,
    };
  }, sku);
  await browser.close();
  return Promise.resolve(productInfo);
};
