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
      const {order} = req.body
      const neworder= new Order(  {_id: order._id,  customerId: order.customerId,
        items: order.items})
        neworder.save().then((result) => {
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
                 res.json({redirects:true})
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