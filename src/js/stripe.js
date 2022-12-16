const placeOrder= require("./apiService");
const https = require('https');
const PaytmChecksum = require('paytmchecksum');
const  axios = require("axios");
async function initStripe() {
  let card = null;

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }

  // Ajax call
  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      axios.get('/customer/paytmToken').then((res)=>{
        const {order,get_res,mid,key,bill}= res.body

     initiateClient(order,get_res,mid,key,bill)
      }).catch((e)=>{
        new Noty({
          type: "error",
          timeout: 1000,
          text: "Can't initiate payment",
          progressBar: false,
        }).show();
        })
     });
  }

function initiateClient(order,get_res,mid,key,bill){
  const script=document.createElement('script');
  script.crossOrigin="anonymous"
  script.src=`https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`
  script.onload= ()=>{
    var config = {
      "root": "",
      "flow": "DEFAULT",
      "data": {
      "orderId": order._id, /* update order id */
      "token": get_res.body.txnToken, /* update token value */
      "tokenType": "TXN_TOKEN",
      "amount":  bill/* update amount */
      },
      merchant:{
       mid,
       redirect: false
      },
      "handler": {
      "notifyMerchant": function(eventName,data){
      console.log("notifyMerchant handler function called");
      console.log("eventName => ",eventName);
      console.log("data => ",data);
      },
      "transaction status": function(data){
        window.Paytm.CheckoutJS.close();
        data.newOrder= order
        placeOrder(data);
      }
      }
      };
      if(window.Paytm && window.Paytm.CheckoutJS){
      window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
      window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
      window.Paytm.CheckoutJS.invoke();
      }).catch(function onError(error){
      console.log("error => ",error);
      });
      });
    }
  }
  document.body.appendChild(script)
}
}
module.exports= initStripe

