module.exports= function paypage (req,res,next){
    if(req?.session?.cart?.items) return next();
    else res.redirect("/menu")
      }