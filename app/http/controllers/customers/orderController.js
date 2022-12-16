const Order = require("../../../models/order");
const Menu = require("../../../models/menu");
const https = require('https');
const moment = require("moment");
const PaytmChecksum = require('paytmchecksum');
const { mkdir } = require("fs");
function orderContoller() {
  return {
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      }).limit(12);

      res.header(
        "Cache-Control",
        "no-cache, private, must-revalidate, max-stale=0, no-store, post-check=0, pre-check=0"
      );
      res.render("customers/orders", { orders: orders, moment: moment });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // Authourised user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order: order });
      }
      return res.redirect("/");
    },
    async store(req, res) {

      /**
      * import checksum generation utility
      * You can get this utility from https://developer.paytm.com/docs/checksum/
      */
      // const eventEmitter = req.app.get("eventEmitter");
      // var getAllresponse = JSON.parse(JSON.stringify(req.body));
      // var paymentChecksumres = getAllresponse.CHECKSUMHASH
      // var isVerifyChecksumhash = PaytmChecksum.verifySignature(getAllresponse, process.env.MERCHANT_KEY, paymentChecksumres);
      // if(isVerifyChecksumhash){
      //   const order=getAllresponse.newOrder 
      //   const mid=getAllresponse.mid
      //   /* initialize an object */
      //   var paytmParams = {};

      //   /* body parameters */
      //   paytmParams.body = {

      //     /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
      //     "mid": mid,

      //     /* Enter your order id which needs to be check status for */
      //     "orderId": order._id
      //   };

      //   /**
      //   * Generate checksum by parameters we have in body
      //   * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
      //   */
      //   var response = "";
      //   PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.MERCHANT_KEY).then(function (checksum) {
      //     /* head parameters */
      //     paytmParams.head = {

      //       /* put generated checksum value here */
      //       "signature": checksum
      //     };

      //     /* prepare JSON string for request */
      //     var post_data = JSON.stringify(paytmParams);

      //     var options = {

      //       /* for Staging */
      //       hostname: 'securegw-stage.paytm.in',

      //       /* for Production */
      //       // hostname: 'securegw.paytm.in',

      //       port: 443,
      //       path: '/v3/order/status',
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //         'Content-Length': post_data.length
      //       }
      //     };

      //     // Set up the request
      //     var post_req = https.request(options, function (post_res) {
      //       post_res.on('data', function (chunk) {
      //         response += chunk;
      //       });

      //       post_res.on('end', function () {
      //         console.log('Response: ', response);
      //         var res_obj= JSON.parse(response)

      //         var isVerifySignature=PaytmChecksum.verifySignature(JSON.stringify(res_obj.body),process.env.MERCHANT_KEY,res_obj.head.signature)
      //         if(isVerifySignature){
      //               if(res_obj.body.resultInfo.resultCode==="01"){
      //           order
      //           .save()
      //           .then((result) => {
      //             Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
      //               placedOrder
      //                 .save()
      //                 .then((ord) => {
       

      //                   eventEmitter.emit("orderPlaced", ord);
      //                   let obj = req.session.cart.items
      //                   for (set in obj) {
      //                     (async () => {
      //                       let new_count = obj[set].item.count + obj[set].qty
      
      //                       try {
      //                         await Menu.findOneAndUpdate({ name: obj[set].item.name }, { count: new_count }, { useFindAndModify: false });
      //                       } catch (e) {
      //                         console.log(e)
      //                       }
      //                     })();
      //                   }
      //                   delete req.session.cart;
      //                   return res.json({
      //                     message:
      //                       "Order placed successfully",
      //                   });
      //                 })
      //                 .catch((err) => {
      //                   console.log(err);
      //                 });
      //             });
      //           })
      //           .catch((err) => {
      //             return res.status(500).json({ message: "Something went wrong" });
      //           });
      //         }
      //         else{

      //         }
      //         }
      //         else{
      //           console.log("Signature mismatched")
      //         }
      //       });
      //     });
       
      //     // post the data
      //     post_req.write(post_data);
      //     post_req.end();

      //   });
      // }else
      // {
      // console.log("mismatched signature")
      // }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        });
        order
          .save()
          .then((result) => {
            Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
              placedOrder
                .save()
                .then((ord) => {

                  const eventEmitter = req.app.get("eventEmitter");
                  eventEmitter.emit("orderPlaced", ord);
                  let obj = req.session.cart.items
                  for (set in obj) {
                    (async () => {
                      let new_count = obj[set].item.count + obj[set].qty

                      try {
                        await Menu.findOneAndUpdate({ name: obj[set].item.name }, { count: new_count }, { useFindAndModify: false });
                      } catch (e) {
                        console.log(e)
                      }
                    })();
                  }
                  delete req.session.cart;
                  return res.json({
                    message:
                      "Order placed successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          })
          .catch((err) => {
            return res.status(500).json({ message: "Something went wrong" });
          });
    }
  };
}

module.exports = orderContoller;