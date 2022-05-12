const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
require('dotenv').config()
const api = new WooCommerceRestApi({
  url: process.env.URL,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  version: "wc/v3",
});
console.log('-----------------WooCommerce connect-----------------')
module.exports = api