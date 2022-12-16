const https = require('https');
const PaytmChecksum = require('paytmchecksum');
const Order = require("../../../models/order");
function paytmController() {
    return {
      async index(req, res) {
const order = new Order({
    customerId: req.user._id,
    items: req.session.cart.items,
    });

var paytmParams = {};
paytmParams.body = {
    "requestType"   : "Payment",
    "mid"           : process.env.MID,
    "websiteName"   : "WEBSTAGING",
    "orderId"       : order._id,
    "txnAmount"     : {
        "value"     : req.session.cart.totalPrice,
        "currency"  : "INR",
    },
    "userInfo"      : {
        "custId"    : req.user._id,
    },
};

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
var get_res;
PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.MERCHANT_KEY).then(function(checksum){

    paytmParams.head = {
        "signature"    : checksum,
        "channelId" : "WEB",
        "version": "v1"
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        hostname: 'securegw-stage.paytm.in',

        /* for Production */
        // hostname: 'securegw.paytm.in',

        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${process.env.MID}&orderId=${order._id}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
 
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            get_res=JSON.parse(response)
            console.log('Response: ', get_res);
        });
    });
    // var isVerifySignature = PaytmChecksum.verifySignature(response.body,process.env.MERCHANT_KEY,response.head.signature);
    // if (isVerifySignature) {
    //     return res.json({   get_res: response, order,mid: process.env.MID,key: process.env.MERCHANT_KEY,bill: req.session.cart.totalPrice });
    // } else {
    //     System.out.append("Checksum Mismatched");
    // }
    post_req.write(post_data);
    post_req.end();
});
}}}
module.exports= paytmController