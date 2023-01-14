const Menu = require("../../../models/menu");
// const Order = require("../../../models/order");
const User= require("../../../models/user")
function newitemController() {
  return {
    update : async (req, res) =>{
        let {names,fare,img}=req.body;
        let meal= await Menu.findOne({name: names});
        if(male) return res.status(500).json({messages :"The item with same name already exists"})
        if(fare>0 && names!="" && img!=""){
            const obj= {
                name: names,
                price: fare,
                image: img,
                availibility: true
            }
            await Menu.create(obj);
        }
       res.render("/admin/newitem")
    },
    stop: async(req,res)=>{
      const eventEmitter =req.app.get("eventEmitter");
      let msgs="Food Bookings Closed"
      eventEmitter.emit("bookingclosed",msgs)
      await User.updateMany({},{book : false})
      let curr= "Closed";
      res.render("admin/newitem", {states: curr});
    },
    resume: async(req,res)=>{
      const eventEmitter =req.app.get("eventEmitter");
      let msgs="Food Bookings Resumed"
      eventEmitter.emit("bookingresumed",msgs)
      await User.updateMany({},{book : true})
      let curr= "Active";
      res.render("admin/newitem",{states: curr});
    },
    index : (req, res) =>{
        res.render("admin/newitem", {states: "Active"});
    },
    reset : async (req,res)=>{
      await Menu.updateMany({},{count : 0} )
      res.render("admin/newitem",{states: null});
    }
  };
}

module.exports = newitemController;
