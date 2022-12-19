const homeController = require("../app/http/controllers/homecontroller");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");
const availableController = require("../app/http/controllers/admin/availableControl");
const newitemController = require("../app/http/controllers/admin/newitemController");
const redirectController = require("../app/http/controllers/admin/redirectController");
const paytmController = require("../app/http/controllers/customers/paytmController");
const transactionController = require("../app/http/controllers/customers/transactionController");
const passport = require("passport");
// middlewares
const check = require("../app/http/middleware/check");
const guest = require("../app/http/middleware/guest");
const auth = require("../app/http/middleware/auth");
const admin = require("../app/http/middleware/admin");
const paypage = require("../app/http/middleware/paypage");
require("../../RGTeria/app/config/passport.js")

const initRoutes = (app) => {
  // routes

  //   home
  app.get("/", homeController().index);
  app.get("/menu", homeController().menu);

  //   auth
  app.get("/login", guest, authController().login);
  app.get("/google",guest,authController().google);
  app.get("/google/callback/",authController().google_call);
 // app.get("/register", guest, authController().register);
 // app.post("/register", upload, authController().postRegister);
  //app.post("/preview", authController().postPreview);
  app.post("/logout", authController().logout);
  //  cart
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);
  app.get("/clear", cartController().clear);
  // rank
  app.get("/rank",cartController().rank)
  // customer/order routes
  app.post("/orders", auth, orderController().store);
  app.post("/payFail", auth, orderController().failure);
  app.get("/customer/orders", auth, check, orderController().index);
  app.get("/customer/orders/:id", auth, orderController().show);
  app.post("/customer/paytmToken", auth,paypage ,paytmController().index);
  app.post("/customer/transaction",auth,transactionController().index);
  // Admin routes
  app.get("/admin/orders", admin, adminOrderController().index);
  app.post("/admin/order/status", admin, statusController().update);
  app.get("/admin/available",admin,availableController().index)
  app.post("/admin/available",admin,availableController().update)
  app.get("/admin/newitem",admin,newitemController().index)
  app.post("/admin/newitem",admin,newitemController().update)
  app.get("/admin/reset",admin,newitemController().reset)
  app.get("/admin/resume",admin,newitemController().resume)
  app.get("/admin/stop",admin,newitemController().stop)
  app.post("/admin/change",admin,redirectController().index)
  // contactus
  app.post("/contact_us", homeController().contact_us);
};

module.exports = initRoutes;
