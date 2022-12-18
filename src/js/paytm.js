  var mid = "<%= mid  %>";
  console.log(mid)
  window.alert("Tanmay")
  const baseUrl = "http://localhost:5000"
  function initiateClientModule(data) {
    var amount = "<%= test  %>";

    var order = data.order
    const script = document.createElement("script");
    script.src = ` https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/${mid}.js`;
    script.crossOrigin = `anonymous`;
    script.onload = () => {
      // console.log(session.cart.totalPrice)

      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
          "orderId": data.order._id, /* update order id */
          "token": data.get_res.body.txnToken, /* update token value */
          "tokenType": "TXN_TOKEN",
          "amount": amount /* update amount */
        },

        "merchant": {

          mid: mid,
          redirect: false
        },

        "handler": {
          "notifyMerchant": function (eventName, data) {
            console.log("notifyMerchant handler function called");
            console.log("eventName => ", eventName);
            console.log("data => ", data);
          },
          "transactionStatus": async function (data) {
            console.log("transaction completed")
            console.log(data)
            window.Paytm.CheckoutJS.close();
            if (data.STATUS === "TXN_SUCCESS") {

              const response = await fetch(`http://localhost:5000/customer/transaction`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order, data })
              })
              response.json().then(async (data) => {
                //order is generated successfully
                const resp = await fetch(`http://localhost:5000/orders`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ order: data.order })
                })
                resp.json().then((data) => {
                  //order is generated successfully
                  if (data.redirects === true) {
                    window.location.href = "/customer/orders";
                  }
                  
                }).catch(error => {
                  console.log(error)
                  alert("error in initiating payment")
                })
              }


              ).catch(error => {
                console.log(error)
                alert("error in initiating payment")
              })



            } else if (data.STATUS === 'TXN_FAILURE') {
              alert("Payment failure. Please book again.")

            } else {
              alert("Something wend wrong while payment contact to admin!!")
            }




          }


        }
      };


      if (window.Paytm && window.Paytm.CheckoutJS) {
        window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
          // initialze configuration using init method
          window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
            // after successfully updating configuration, invoke JS Checkout
            window.Paytm.CheckoutJS.invoke();
            document.getElementById('pay-st').innerHTML = "Order Now"
          }).catch(function onError(error) {
            console.log("error => ", error);
          });
        });
      }

    }

    document.body.appendChild(script);


  }

  //start payment function
  async function startPayment() {
    //call api to start payment
    const loader = document.getElementById('pay-st')
    loader.innerHTML = "Paytm Checkout Loading..."

    const response = await fetch(`${baseUrl}/customer/paytmToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })


    response.json().then(data => {
      //order is generated successfully
      console.log(data)
      if(data.get_res.body.resultInfo.resultStatus==="S") initiateClientModule(data)
      else alert("error in initiating payment")

    }).catch(error => {
      console.log(error)
      alert("error in initiating payment")
    })


  }