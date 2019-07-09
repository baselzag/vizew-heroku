const {MongoClient,ObjectID} = require('mongodb')

const conf = require('../conf');
const dbUrl = conf.dbUrl;
const dbName = conf.dbName;

function addUser(firstName, lastName, dateOfBirth, gender, userName, email, phoneNumber, password, active, verify, callback) {
    (async function mongo() {
        let client;
        try {
            client=await MongoClient.connect(dbUrl,{useNewUrlParser:true});
        const db= client.db(dbName);
        const username1=await db.collection('users').findOne({
            userName:userName
            
        });
        const email1=await db.collection('users').findOne({
            email:email
            
        });
        const phone1=await db.collection('users').findOne({
            phoneNumber:phoneNumber
            
        });
        if(username1 || email1 || phone1){
            client.close();
            callback(false)
    
            } else {
                const response = await db.collection('users').insertOne({
                    firstName: firstName,
                    lastName: lastName,
                    dateBirth: dateOfBirth,
                    gender: gender,
                    userName: userName,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: password,
                    active: active,
                    verify: verify
                });
                //console.log(response.ops[0].active)
                client.close();
                callback(true)
            }
        } catch (error) {
            console.log(error.message);
            client.close();
            callback(false)

        }
    }())
}

function checkUserforlogin(userName, password, callback) {
    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
            const db = client.db(dbName);
            const col = await db.collection('users');
            const user = await col.findOne({
                userName: userName,
                password: password,
            });
            //console.log(user)
            client.close();
            callback(user)

        } catch (error) {
            console.log(error.message)
            client.close();
            callback(null)

        }
    }())
}

function checkAdminforlogin(active, callback) {
    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
            const db = client.db(dbName);
            const col = await db.collection('users');
            const admin = await col.findOne({
                active: true
            });
            //console.log(user)
            client.close();
            callback(admin)

        } catch (error) {
            client.close();
            callback(null)

        }
    }())
}

function changePassword(id, newPassword, done) {
    (async function mongo() {
        let client;
        try {
            client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
            const db = client.db(dbName);
            const col = await db.collection('users');
            const response = await col.updateOne(
                {
                    _id:new ObjectID(id)  // _id: fieldname in DB , new.. that means the object wich have this id 
            },
            {
                $set:{
                    password: newPassword  // password:field name in DB and newPassword is input text name
                }
            });
            done(response)


        } catch (error) {
            done(error.message)
        }
        client.close();
    }())
}

function addBlog(title,keyWords, description, catValue, newCategory, imgUrl, done ){  // done is callback
    
    (async function mongo(){
    let client;
    try {
        client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
        const db = client.db(dbName);
        if(catValue === '-1'){
            const catResponse = await db.collection('categories').insertOne({title: newCategory});
            console.log(catResponse.insertedId);
            catValue = catResponse.insertedId;
        }
        const response = await db.collection('Blogs').insertOne({
            title: title,
        keyWords: keyWords,
        description: description,
        category: catValue,
        imgUrl: imgUrl
    });
        client.close();
        done(response);
    } catch (error) {
        client.close();
        done(error.message);
    }
    }());
    }
    //impotant: we must write this code in main.js (public/js/main.js )

 
// // hide show category field in newadv.ejs
// function checkCat(){
//     let selectedOption = $("#categorySelect").children("option:selected").val();
//  //alert(selectedOption);
//  if(selectedOption === "-1"){
//  //alert(selectedOption);
//  $('#newcatContainer').removeClass('d-none');
//  }else{
//  $('#newcatContainer').addClass('d-none');
//  }
//  }
//  checkCat();
//     $("#categorySelect").change(()=>{
//         checkCat();
//     });



    function getCategories(done){
        (async function mongo(){
            let client;
            try {
                client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
                const db = client.db(dbName);
                const cats = await db.collection('categories').find().toArray();
                client.close();
                done(true, cats);
            } catch (error) {
                client.close();
                done(false, error.message);
            }
        }())
    }
   

    function getBlog(id, done){  // done callback
        (async function mongo(){
            let client;
            try {
                client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
                const db = client.db(dbName);
                const blog = await db.collection('Blogs').findOne({
                    _id: new ObjectID(id)    // this is filter   // it will convert to objectID (its like this in mongo DB)
                });
                client.close();
                done(true, blog);
    
            } catch (error) {
                client.close();
                done(false, error.message);
            }
        }())
    }




    function getUser(id, done){  // done callback
        (async function mongo(){
            let client;
            try {
                client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
                const db = client.db(dbName);
                const blog = await db.collection('users').findOne({
                    _id: new ObjectID(id)    // this is filter   // it will convert to objectID (its like this in mongo DB)
                });
                client.close();
                done(true, blog);
    
            } catch (error) {
                client.close();
                done(false, error.message);
            }
        }())
    }




    function changePersonalInfo(id,firstName,lastName,dateOfBirth,gender,userName,phoneNumber, newPassword, done) {
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
                const db = client.db(dbName);
                const col = await db.collection('users');
                const response = await col.updateOne(
                    {
                        _id:new ObjectID(id)  
                },
                {
                    $set:{
                        firstName: firstName,
                        lastName: lastName,
                        dateBirth: dateOfBirth,
                        gender: gender,
                        userName: userName,
                        phoneNumber: phoneNumber,
                        password: newPassword
                        
                          
                    }
                });
                done(true,response)
    
    
            } catch (error) {
                done(false,error.message)
            }
            client.close();
        }())
    }


    



    



module.exports = {addUser,checkUserforlogin,checkAdminforlogin,changePassword,addBlog,getCategories,getBlog,changePersonalInfo,getUser}