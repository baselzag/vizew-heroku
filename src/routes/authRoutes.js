const express = require('express');
// const expressValidator=require('express-validator');
const authControllers = require('../controllers/authControllers');
const authRoutes = express.Router();






authRoutes.route('/register').get((req, res) => {
    res.render('register',{userExist:false})

});

    
authRoutes.route('/register').post((req, res) => {
    authControllers.addUser(req.body.firstName, req.body.lastName, req.body.dateOfBirth, req.body.gender, req.body.chooseUserName, req.body.emailname, req.body.phoneNumber, req.body.passwordname, active = false, verify = false, (check) => {
        // authControllers.addUser(req.body.firstname,req.body.lastname,req.body.username,req.body.email,req.body.password,
        //     req.body.phone,req.body.birthdate,req.body.gender,(user)=>{
        if (check) {


            let errorMessage = "";

            if (!req.body.firstName) {
                errorMessage = "Please enter first name <br>"
            }
            if (!req.body.lastName) {
                errorMessage += "Please enter the last name <br>"
            }
            if (!req.body.dateOfBirth) {
                errorMessage += "please enter date of birth<br>"
            }
            if (!req.body.gender) {
                errorMessage += "please enter your gender<br>"
            }
            if (!req.body.chooseUserName) {
                errorMessage += "please enter a user name<br>"
            }
            if (!req.body.emailname) {
                errorMessage += "please enter date of birth<br>"
            }
            if (!req.body.phoneNumber) {
                errorMessage += "Please enter phone number<br>"
            }
            if (!req.body.passwordname) {
                errorMessage += "please enter date of birth<br>"
            }

            if (errorMessage != "") {
                res.send(errorMessage)

            } else {


                req.session.chooseUserName = req.body.chooseUserName
                // was: req.session.username = req.body.emailname
                res.redirect('/userAdmin')
                // res.redirect('/admin')
            }

        } else {
            res.render('register',{userExist:true})
        }
    })
});






// authRoutes.route('/register').get((req,res,next)=>{
//     res.render('register',{userExist:false,success:false});
//     // res.render('register',{userExist:false,success:req.session.success,errors:req.session.errors});
//     // req.session.errors=null;
// });



// authRoutes.route('/register').post((req, res,next) => {
//     authControllers.addUser(req.body.firstName, req.body.lastName, req.body.dateOfBirth, req.body.gender, req.body.chooseUserName, req.body.emailname, req.body.phoneNumber, req.body.passwordname, active = false, verify = false, (check) => {
        
//         req.check('emailname','Invalid email address').isEmail();
//         req.check('passwordname','Password is Invalid').isLength({min:4}).equals(req.body.confirmPassword);


//         var errors =req.validationErrors();
//         if(errors){
//             req.session.errors=errors;
//             req.session.success=false;
//         } else{
//                 req.session.success=true;
//             }
        
//             res.redirect('/')
       
       



//         if (check) {

//                 req.session.chooseUserName = req.body.chooseUserName
//                 // was: req.session.username = req.body.emailname
//                 res.redirect('/userAdmin')
//                 // res.redirect('/admin')
          

//         } else {
//             res.render('register',{userExist:true})
//         }
//     })
// });







authRoutes.route('/login').get((req, res) => {
    res.render('login',{loginMessage:false});
});

authRoutes.route('/login').post((req, res) => {
    authControllers.checkUserforlogin(req.body.userNameloginname, req.body.passwordloginname, (user) => {
        if (user) { // this is the user comming from the function checkUserforlogin in callback(user)
            //console.log(active); this consol in this point breaks out the funciton why ????

            req.session.user = user; // this user is all the object that comes in session

            if (user.active) {
                req.session.usertype = "admin";
                res.redirect('/admin');
            } else {
                req.session.usertype = "user";
                res.redirect('/userAdmin')
            }

            //res.redirect('/userAdmin');
        } else {
            res.render('login',{loginMessage:true})
        }

    });

});

authRoutes.route('/logout').get((req, res) => {
    req.session.destroy();
    res.render('login',{loginMessage:false});
        // res.redirect('/')

    // ahmad version was like this:
    //res.redirect('/'); this will will redirect me to the main page ('/')=(index.ejs)
    // the destryo will never work if u didn't aim it to /auth/logout in the admin.ejs file(in <a href=""). 
    //otherwise it will never work,
    // one other point is if u have here res.redirect('/logout), the destruction of the session will actually take place, but 
    // it will then redirect me to a page without route
});

module.exports = authRoutes;