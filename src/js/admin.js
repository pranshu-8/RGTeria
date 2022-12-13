const axios = require("axios");
const moment = require("moment");
const Noty = require("noty");

function initAdmin(socket) {
  var orderTableBody = document.querySelector("#orderTableBody");
  var orderCount= document.querySelector("#orderTableCountBody");
  var orders = [];
  let orderMap = [];
  var markup,markup1;
  axios__WEBPACK_IMPORTED_MODULE_0___default().get("/admin/orders", {
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    }
  }).then(function (res) {
    orders = res.data;
    orders.reverse()
    let mapOrder= new Map()
    orders.forEach((food)=>{
        var parsedItem = Object.values(food.items);
        parsedItem.forEach(function (menuItem) {
        if(mapOrder.has(menuItem.item.name)===true){
           let ct= mapOrder.get(menuItem.item.name)
           ct= menuItem.qty +ct
           mapOrder.delete(menuItem.item.name)
           mapOrder.set(menuItem.item.name,ct)
        }
        else{
          mapOrder.set(menuItem.item.name,menuItem.qty)
        }
       });
    });
    let obj = Object.fromEntries(mapOrder)
    let obj1=Object.entries(obj)
    obj1.map((ele)=>{
      let temp= ele[0]
      ele[0]=ele[1]
      ele[1]=temp
    })
    obj1.sort();
    obj1.reverse();
    obj1.forEach((elem) => {
      let objpush={}
      objpush[elem[0]]=elem[1]
      orderMap.push(objpush)
    })
    markup = generateMarkup(orders);
   markup1= generateMark(orderMap);
    orderTableBody.innerHTML = markup;
   orderCount.innerHTML= markup1;
   
  })["catch"](function (err) {
    console.log(err);
  });
  var total_cost=0
  var temp=0
  function renderItems(items) {
    var parsedItems = Object.values(items);

    let tem=parsedItems.map(function (menuItem) {
        total_cost+=((menuItem.item.price)*(menuItem.qty))
      return "\n                <p>".concat(menuItem.item.name, " - ").concat(menuItem.qty, " pcs </p>\n            ");
    }).join("");
    temp=total_cost
    total_cost=0
return tem
  }
  function generateMarkup(orders) {
    return orders.map(function (order) {
      return "\n                <tr>\n                <td class=\"border px-4 py-2 \">\n                    <p class=\"text-red-500\">".concat(order._id, "</p>\n                    <div class=\"font-semibold\">").concat(renderItems(order.items), "\n          <p>Total Bill:  ₹").concat(temp ,"</div> \n                </td>\n                <td class=\"border px-4 py-2 text-purple-600 font-semibold uppercase\">").concat(order.customerId.name, "</td>\n                                <td class=\"border px-4 py-2\">\n                    <div class=\"inline-block relative w-64\">\n                        <form action=\"/admin/order/status\" method=\"POST\">\n                            <input type=\"hidden\" name=\"orderId\" value=\"").concat(order._id, "\">\n                            <select name=\"status\" onchange=\"this.form.submit()\"\n                                class=\"block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline\">\n                                <option value=\"order_placed\"\n                                    ").concat(order.status === "order_placed" ? "selected" : "", ">\n                                    Placed</option>\n                                <option value=\"confirmed\" ").concat(order.status === "confirmed" ? "selected" : "", ">\n                                    Confirmed</option>\n                                <option value=\"prepared\" ").concat(order.status === "prepared" ? "selected" : "", ">\n                                    Prepared</option>\n                               <option value=\"completed\" ").concat(order.status === "completed" ? "selected" : "", ">\n                                    Completed\n                                </option>\n                            </select>\n                        </form>\n                        <div\n                            class=\"pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700\">\n                            <svg class=\"fill-current h-4 w-4\" xmlns=\"http://www.w3.org/2000/svg\"\n                                viewBox=\"0 0 20 20\">\n                                <path\n                                    d=\"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z\" />\n                            </svg>\n                        </div>\n                    </div>\n                </td>\n                <td class=\"border px-4 py-2\">\n                    ").concat(moment__WEBPACK_IMPORTED_MODULE_1___default()(order.createdAt).format("hh:mm A"), "\n                </td>\n                                  ").concat( "</tr>\n" );
    }).join("");
  }
  // Socket
  function generateMark(orderMap) {
      orderCount.innerHTML ="";
      return orderMap.map(function (order) {
          return "\n                <tr >\n                <td class=\"border px-16 py-2 \">\n                    <p class=\"text-purple-500\">".concat( Object.values(order)," </p> </td>\n  <td class=\"border px-16 py-2 \">\n                    <p class=\"text-purple-500\"> ").concat( Object.keys(order)," </p> </td>\n   </tr>\n" );
        }).join("");
  
   }

  socket.on("orderPlaced", function (order) {
    new (noty__WEBPACK_IMPORTED_MODULE_2___default())({
      type: "success",
      timeout: 1000,
      text: "New order",
      progressBar: false
    }).show();
    orders.push(order);
    let mapOrder= new Map()
    orders.forEach((food)=>{
        var parsedItem = Object.values(food.items);
        parsedItem.forEach(function (menuItem) {
        if(mapOrder.has(menuItem.item.name)===true){
           let ct= mapOrder.get(menuItem.item.name)
           ct= menuItem.qty +ct
           mapOrder.delete(menuItem.item.name)
           mapOrder.set(menuItem.item.name,ct)
        }
        else{
          mapOrder.set(menuItem.item.name,menuItem.qty)
        }
       });
    });
    let obj = Object.fromEntries(mapOrder)
    let obj1=Object.entries(obj)
    obj1.map((ele)=>{
      let temp= ele[0]
      ele[0]=ele[1]
      ele[1]=temp
    })
    obj1.sort();
    obj1.reverse();
    orderMap.length=0;
    obj1.forEach((elem) => {
      let objpush={}
      objpush[elem[0]]=elem[1]
      orderMap.push(objpush)
    })
    orderTableBody.innerHTML ="";
    orderCount.innerHTML ="";
    orderTableBody.innerHTML = generateMarkup(orders);
    orderCount.innerHTML=generateMark(orderMap);
  });
}
module.exports= {initAdmin}