require("dotenv").config();

const Menu = require("../../models/menu");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});
const homeController = () => {
  // factory functions
  return {
    index: async (req, res) => {
      let users=req?.user?.role
      users==="customer"?users=req.users:users=false;
      let food = await Menu.find().sort({count: -1});
      let veg=[];
      let non_veg=[];
      food.forEach(function(foodies) {
        if(foodies.id[foodies.id.length-1]==='d' || foodies.id[foodies.id.length-1]==='e') {
            non_veg.push(foodies)
        }
        else{
          veg.push(foodies)
        }
      })
 
      return res.render("home", { veg, non_veg} );
    },
    menu: async (req, res) => {
      const foods = await Menu.find().sort({availibility: -1});
      return res.render("menu", { foods: foods });
    },
    contact_us: async (req, res) => {
      const { name, email, message } = req.body;

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ID, // generated ethereal user
          pass: process.env.EMAIL_PASS, // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      var mailOptions = {
        from: process.env.EMAIL_ID,
        to: [email, "pranshu05012002@gmail.com"],
        subject: "Thanks for contacting us!",
        html: `<p>Hello ${name}</p><p>Thanks for contacting us!   This auto-reply is just to let you know that we have received your email and will get back to you with a (human) response as soon as possible.</p>
        <p>Here's what was received : ${message}</p>
        <p>Cheers!</p>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return res.redirect("/");
    },
  };
};

module.exports = homeController;
