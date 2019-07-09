const express=require('express');
// const authControllers=require('../controllers/authControllers');
const endUserControllers=require('../controllers/endUserControllers');
const pagesRoutes=express.Router();
pagesRoutes.route('/').get((req, res)=>{
    endUserControllers.getBlogs((ok, result)=>{   // (ok,result) this is callback function called done(true,data),done(false,error.message)  that means done take two parameter (see that in endusercontroller)
if(ok){
    //res.send(result);
    res.render('index', {result});
}else{
    res.send(result);
}

    });

});

module.exports=pagesRoutes;