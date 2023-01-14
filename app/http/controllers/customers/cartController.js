 const { json } = require("express");
const mongoose= require("mongoose")
const User = require("../../../models/user");
const Menu=  require("../../../models/menu");
const cartController = () => {
  // factory functions
  return {
    index: async (req, res) => {
      const user= await User.find({_id :req?.session?.passport?.user})
      let listid= []
      let statuss
      for(set in req?.session?.cart?.items){
      //  console.log(Object(set).)
      listid.push(set)
      }
      // console.log(listid)
      let ct=0;
      for(it in req?.session?.cart?.items){
        let nm= listid[ct]
        let num =req?.session?.cart?.items
        
        let lt= num[nm].item.name
        const meal=  await Menu.find({name : lt})

        if(meal[0]?.availibility===true) {
          statuss=true
        }
        else{ 
          statuss=false
          break;
        }
        ct=ct+1;

      }
      res.render("customers/cart", {statuss});
    },
    update: (req, res) => {
      // for first time add item in cart
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }

      let cart = req.session.cart;

      // check if doesn't added in cart
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }

      return res.status(200).json({ totalqty: req.session.cart });
    },
    clear: (req,res)=>{
      delete req.session.cart;
      return res.redirect("/menu");
      },
     rank : async(req,res) =>{
        const foods = await Menu.find().sort({count: -1}).sort({price: -1});
        var arr=[]
        arr.push(['Food Item Name', 'Count'])
        let totalOrders=0
        
        foods.forEach(element => {
            arr.push([element.name,element.count])
            totalOrders+=element.count
          });
        return res.render("customers/rank", { foods: arr,totalOrders});
      },
  };
};

module.exports = cartController;
