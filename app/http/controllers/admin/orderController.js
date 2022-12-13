const order = require("../../../models/order");

function orderController() {
  return {
     index (req, res) {
       order.find({ status: { $ne: "completed" } }, null, {
        sort: { "createdAt": -1 },
      }).limit(20).populate("customerId")
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render("admin/orders");
          }
        });
    },
  };
}

module.exports = orderController;