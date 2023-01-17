const Menu = require("../../../models/menu");
// const Order = require("../../../models/order");

function orderController() {
  return {
    update : async (req, res) =>{
        let {names,instock,fare,new_name}=req.body;
        let meal= await Menu.findOne({name: names});
        let money = meal.price
        let avail= meal.availibility
        let ima= meal.image
         instock==='0'? instock=false: instock=true;
        let change=null;
        if(new_name!=undefined && new_name==='') new_name=undefined
        else if(fare!=undefined && fare<=0) fare=undefined
        let updates= () =>{
            if(fare!=undefined){
              change= {price : fare, name: names,availibility: avail ,image: ima}
            }
            else if(new_name!=undefined){
                change= {  name: new_name,price : money, availibility: avail ,image: ima}
            }
            else if(instock!=undefined)change= {availibility: instock,name: names, price: money ,image: ima}
        }
        updates();
        if(change!=null) await Menu.findOneAndUpdate({name: names}, change, {useFindAndModify: false});
        const eventEmitter=req.app.get("eventEmitter")
        let s="babu"
        eventEmitter.emit("availchange",s)
        res.redirect("/admin/available")
    },
    index : async (req, res) =>{
        const menu = await Menu.find().sort({count : -1}).sort({availibility: 1});
        res.render("admin/availibility", { menu: menu });
    },
  };
}

module.exports = orderController;
