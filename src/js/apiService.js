const  axios = require("axios");
const Noty =require("noty");

 function placeOrder(formObject) {
  axios
    .post("/orders", formObject)
    .then((res) => {
      console.log("ae munde paagal ")
      new Noty({
        type: "success",
        timeout: 1000,
        text: res.data.message,
        progressBar: false,
      }).show();
      setTimeout(() => {
        window.location.href = "/customer/orders";
      }, 1000);
    })
    .catch((err) => {
      new Noty({
        type: "success",
        timeout: 1000,
        text: err.res.data.message,
        progressBar: false,
      }).show();
    });
}
module.exports= placeOrder
