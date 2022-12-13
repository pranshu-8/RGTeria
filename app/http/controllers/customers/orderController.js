const Order = require("../../../models/order");
const Menu = require("../../../models/menu");
const moment = require("moment");
function orderContoller() {
  return {
    async store (req, res) {
      let obj = req.session.cart.items;
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
                for(set in obj){ 
                    (async() =>{
                  let new_count= obj[set].item.count+obj[set].qty
                  
                  try{
                  await Menu.findOneAndUpdate({name: obj[set].item.name},{count: new_count}, {useFindAndModify: false});
                  }catch(e){
                    console.log(e)
                  }})();
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
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      }).limit(10);

      //   console.log(orders);
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
    }
  };
}

module.exports = orderContoller;