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
      }).limit(15);

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
    async failure (req,res) {
      let data={}
      const eventEmitter = req.app.get("eventEmitter");
      data.id=req.user._id
      data.message="Payment Failed. Please reorder."
      data.type='error'
      eventEmitter.emit("orderplacedUser", data);
      return res.json({ redirectsy: false });
    },
    async store(req, res) {
      const {order} = req.body
      const neworder= new Order(  {_id: order._id,  customerId: order.customerId,
        items: order.items})
        const eventEmitter = req.app.get("eventEmitter");
        neworder.save().then((result) => {
            Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
              placedOrder
                .save()
                .then((ord) => {
                  let data={}
                  data.id=ord._id
                  eventEmitter.emit("orderPlaced", data);
                  data.id=ord.customerId._id
                  data.message="Order Placed Successfully"
                  data.type='success'
                  eventEmitter.emit("orderplacedUser", data);
                  let obj = req.session.cart.items
                  for (set in obj) {
                    (async () => {
                      let new_count = obj[set].item.count + obj[set].qty

                      try {
                        await Menu.findOneAndUpdate({ name: obj[set].item.name }, { count: new_count }, { useFindAndModify: false });
                      } catch (e) {
                        console.log(e)
                        delete req.session.cart;
                        return res.json({redirects:true })
                       
                      }
                    })();
                  }
                  delete req.session.cart;
                return res.json({redirects:true })
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          })
          .catch((err) => {
            let data={}
            data.id=req.user._id
            data.message="Payment done.Order couldn't be saved.Please contact admin."
            data.type='error'
            eventEmitter.emit("orderplacedUser", data);
            delete req.session.cart;
            return res.json({ redirects: false });
          });
    }
  };
}

module.exports = orderContoller;