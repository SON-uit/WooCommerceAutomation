const CronJob = require("cron").CronJob;
const apiProduct = require("../../api/api.product");
const crawler = require("../crawler");
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
// convert product data in API to link product itself in Tiki Page
function createLinkProduct(product) {
  const tikiUrl = "https://tiki.vn/";
  const { slug, sku } = product;
  return `${tikiUrl}${slug}-${sku}.html`;
}
function isPriceChanged(newProductData, product) {
  return (
    newProductData.regular_price !== product.regular_price ||
    newProductData.sale_price !== product.sale_price
  );
}
const job = new CronJob(
  "* */8 * * *",
  async function () {
    const currentTime = getCurrentTime();
    console.log(`Cronjob Update Invetory Start At: ${currentTime}`);
    //update one product
    const product = await apiProduct.getProductById(5221);
    /*  //create productLink
      const productLink = createLinkProduct(product)
      // crawler base on product link -> return data was crawled
      const crawlerProductData = await crawler(productLink);
      crawlerProductData.salePrice = 70000;
      console.log(crawlerProductData);
      // update Options -> return options to update product
      const updateOptions = {
        regular_price: crawlerProductData.regularPrice.toString(),
        sale_price: crawlerProductData.salePrice.toString(),
      }
      // updated product
      const updatedProduct = await apiProduct.updateProduct(5221,updateOptions)
      //console.log(updatedProduct)  */

    // update many product by category
    const products = await apiProduct.getAllProducts({
      page: 2,
      per_page: 3,
    }); //options
    await Promise.all(
      products.map(async (product) => {
        //create link  to go to  tiki website 
        const productLink = createLinkProduct(product);
        // crawl product in tiki web
        const crawlerProductData = await crawler(productLink);
        crawlerProductData.salePrice = 80000;
        // update Options -> return options to update product
        const updateOptions = {
          regular_price: crawlerProductData.regularPrice.toString(),
          sale_price: crawlerProductData.salePrice.toString(),
        };
        // check if price change? if change update, if no do nothing.
        if (isPriceChanged(updateOptions, product)) {
          // updated product
          const updatedProduct = await apiProduct.updateProduct(
            product.id,
            updateOptions
          );
          console.log(`${product.id} ${product.name}Updated Successfully`);
        }
      })
    );
  },
  null,
  true,
  "Asia/Ho_Chi_Minh"
);
console.log("Update Inventory Automation Start....");
job.start();
