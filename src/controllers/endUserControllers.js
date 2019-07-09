const {MongoClient, ObjectID} = require('mongodb');
const conf = require('../conf');
const dbUrl = conf.dbUrl;
const dbName = conf.dbName;


// get all Blogs from database
function getBlogs(done){ // done is parameter for getAdvs and done is callback function in the same time
(async function mongo(){
let client;
try {
    client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
    const db = client.db(dbName);
    let data = await db.collection('Blogs').find().toArray();
    for (let i = 0; i < data.length; i++) {
        console.log( data[i].category);
       let category = await db.collection('categories').findOne({_id: new ObjectID(data[i].category)});
       console.log( category);
       data[i].category = category.title;
    }
    client.close();
    done(true,data);   // if there is data ,the function done will return true and return data 
} catch (error) {
    client.close();
    done(false,error.stack);
}
}());
}







function getUsers(done){ // done is parameter for getAdvs and done is callback function in the same time
    (async function mongo(){
    let client;
    try {
        client = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
        const db = client.db(dbName);
        let data = await db.collection('users').find().toArray();
        
        client.close();
        done(true,data);   // if there is data ,the function done will return true and return data 
    } catch (error) {
        client.close();
        done(false,error.stack);
    }
    }());
    }

module.exports = {getBlogs,getUsers};