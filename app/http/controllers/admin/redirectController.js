const redirector = ()=>{ 
    return {
    index :(req,res)=>{
    const {changes}= req.body
    if(changes==="reset"){
       return res.redirect("/admin/reset")
      }
    else if(changes==="resume"){
      return res.redirect("/admin/resume")
    }
    else{
     return res.redirect("/admin/stop")
    }
   }
}
  }
module.exports= redirector