const express = require('express');
const multer = require('multer');
const userid=require('userid');
const adminRoutes = express.Router();
const endUserControllers=require('../controllers/endUserControllers');
const authControllers = require('../controllers/authControllers');
// using session as a middleware

adminRoutes.use((req, res, next) => {
    if (req.session.usertype === "admin") {
        //console.log(req.session) very important to see what happens if u log.console only the req session 
        next();

    } else {
        res.redirect('/auth/login')
    }
});

adminRoutes.route('/').get((req, res) => {
    
    res.render('admin');
});


adminRoutes.route('/changepassword').get((req, res) => {
    if (req.session.user) {
        res.render('changepassword')
    } else {
        res.redirect('/')
    }
});
adminRoutes.route('/changepassword').post((req, res) => {
    authControllers.changePassword(req.session.user._id, req.body.newPassword, (result) => {
        console.log(result)
        //console.log(req.session.loginSuccess)
        req.session.destroy();
        res.redirect('/auth/login')
    })
});




const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, callback){
        callback(null, Date.now()+'-'+file.originalname)
    }
});
const upload = multer({ storage: storage });
adminRoutes.use('/addBlog',upload.array('UploadToDB',10));


/////

// adminRoutes.route('/addblog').get((req, res) => {
adminRoutes.route('/addBlog').get((req, res) => {
    authControllers.getCategories((ok, result)=>{
        if(ok){
            console.log(result);
            res.render('addBlog',{result});
        }else{
            res.send(result);
        }
        
    })

});
adminRoutes.route('/addBlog').post((req, res) => {
    let photosArr = [];
    for (let i = 0; i < req.files.length; i++) {
        photosArr.push(req.files[i].destination.replace("./public","")   // replace ./public with nothing    Z.B (/public/admin/auth =>  /admin/auth)
        +req.files[i].filename);
    }
    authControllers.addBlog(
        req.body.titleInput,
        req.body.keywordsInput,
        req.body.descTextarea,
        req.body.categorySelect,
        req.body.newCategory,
        photosArr,(result)=>{
            authControllers.getCategories((ok, result)=>{
                if(ok){
                    console.log(result);
                    res.render('addBlog',{result});
                }else{
                    res.send(result);
                }
            })
        }
         );
});

        // title,quote, description, catValue, newCategory, imgUrl, done




adminRoutes.route('/blogsmanag').get((req, res)=>{
    endUserControllers.getBlogs((ok, result)=>{
        if(ok){
            res.render('blogsmanag',{ result });
        }else{
            res.send(result);
        }
        
    });

});
adminRoutes.route('/blogsedite/:id').get((req, res)=>{
    const blogId = req.params.id;
authControllers.getBlog(blogId,(chekBlog, blog)=>{

    if(chekBlog){
    authControllers.getCategories((ok, categories)=>{
        if(ok){
            res.render('blogsedite',{categories, blog});   // we pass two thing categories and adv
        }else{
            res.send(result);
        }
    });
}else{
    res.send(blog);
}



});

});


adminRoutes.route('/usersmanag').get((req, res)=>{
    endUserControllers.getUsers((ok, result)=>{
        if(ok){
            res.render('usersmanag',{ result });
        }else{
            res.send(result);
        }
        
    });

});







adminRoutes.route('/userinfo/:id').get((req, res)=>{
    var blogId = req.params.id;
    // console.log(blogId);
    // console.log(userid)
authControllers.getUser(blogId,(chekBlog, blog)=>{

    if(chekBlog){
        res.render('userinfo',{blog})

        // if(blogId ===req.session.user._id){
        //     res.redirect('userpersonalinfo')
        // }else{
            adminRoutes.route('/userinfo/:id').post((req, res) => {
            
                console.log(blogId)
             
                 authControllers.changePersonalInfo(blogId, req.body.firstName,req.body.lastName,req.body.dateOfBirth,req.body.gender,req.body.chooseUserName,req.body.phoneNumber,req.body.passwordname, (result) => {
                     console.log(result)
                     
                    //  req.session.destroy();
                     res.redirect('/admin/usersmanag')
                 })
             });
        // }

        
        
    }else{
        res.send(blog)
    }


});

});










adminRoutes.route('/userpersonalinfo').get((req, res) => {
    if (req.session.user) {
        const id=req.session.user._id;
        console.log(id);
        // res.render('userpersonalinfo')
        authControllers.getUser(id,(check,data)=>{

            if(check){
                res.render('userpersonalinfo',{data})
            }
        })
        
    } else {
        res.redirect('/')
    }
});
adminRoutes.route('/userpersonalinfo').post((req, res) => {
    authControllers.changePersonalInfo(req.session.user._id, req.body.firstName,req.body.lastName,req.body.dateOfBirth,req.body.gender,req.body.chooseUserName,req.body.phoneNumber,req.body.passwordname, (result) => {
        console.log(result)
        
        req.session.destroy();
        res.redirect('/auth/login')
    })
});

    




module.exports = adminRoutes