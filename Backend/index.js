//import the require dependencies
var express = require('express');
var app = express();
//var redis   = require("redis");
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const search=require("./routes/search");
var kafka=require("./kafka/client")
var cors = require('cors');
const signup=require("./routes/signup");
const updatebuyer=require("./routes/updatebuyer");
const orders=require("./routes/orders");
const data=require("./routes/data");
const login=require("./routes/login");

var mongoose = require('mongoose');

//var MongoClient = require('mongoose');

var mongo = require('mongodb');

var MongoClient =mongo.MongoClient;
//var Client =mongo.MongoClient;

//var url="mongodb+srv://sneema7:Nmat@123@grubhub-fribs.mongodb.net/test?retryWrites=true&w=majority";



var url = "mongodb://localhost:27017/";


MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log("Mongo not connected ",err);
    }
    else
    {console.log("Mongo connected ")}

});



//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
    cookie: { email: "" }
    //store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
}));


app.use(bodyParser.json());

//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Routes

app.use("/signupbuyer",signup);
app.use("/updatebuyer",updatebuyer);
app.use("/updateorders",orders);
app.use("/searchfood",search);
app.use("/getdata",data);
app.use("/signinbuyer",login);





app.post('/postorder', function (req, res) {

    

    kafka.make_request("PostOrder_topic",req.body,function(err,results){
        console.log("--------Inside Past Orders request----------");
        return res.status(200).send(results);
    });
   

});


app.post('/postmessege', function (req, res) {

  var checkstatus="";
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("grubhub");
        // var obj = { Name: user.name,id:user.id, Rid:user.rid,Description:req.body.order, RestaurentName: user.restname,RestaurentImage:user.restimage,status:'n'};
        var obj = { to: req.body.to,from:req.body.from, restname:req.body.restname,restimage:req.body.restimage, buyername: req.body.buyername,buyerimage:req.body.restimage,messege:req.body.messege};
        await dbo.collection("Messege").insertOne(obj, function (err, result) {
            if (err) checkstatus = "Failed Messege Insert"
            else checkstatus = "Success Messege inserted"
            db.close();
            res.end(checkstatus)
        });

    });

});


app.post('/getrestaurentmenu', function (req, res) {

    //*****handle errors */ HANDLING ERROR OF SQL
    console.log("Inside the searchfood  backend page")
    console.log(req.body)
    
    if (req.body.type === 'buyer')
        index = mongoose.Types.ObjectId(req.body.id);
    else
       index = mongoose.Types.ObjectId(req.body.id);
    //    index = user.id;

    var checkstatus = "";
    MongoClient.connect(url,async function (err, db) {
        if (err) throw err;
        var dbo = db.db("grubhub");
        var query = { Rid: index};
    
   
      await  dbo.collection("Items").find(query).toArray(function (err, result) {
            if (err) throw err;
            else {
                console.log("result");
                console.log(result)
                if (result.length >= 1) {
                    result1 = result;
                    result1check = true;
                    console.log(result);
    
                    var sections = [];
                    var finalresult = {};
    
                    result.forEach(element => {
                        console.log(element.Sections);
    
                        if (finalresult.hasOwnProperty(element.Sections)) {
                            let temp = finalresult[element.Sections];
                            temp.push(element)
                            finalresult[element.Sections] = temp;
                        }
                        else {
                            let temp = [];
                            temp.push(element)
                            finalresult[element.Sections] = temp;
    
                        }
                    });
    
                    console.log("finalresult");
                    console.log(finalresult);
                    res.send(finalresult);
    
                    
                 
                }
                else {
                    console.log("No data in restaiurent");
                    res.send("No data found");
                }

            }
          
            db.close();
        });
    });

});


app.post('/getpastorders', function (req, res) {


    kafka.make_request("pastOrder_topic",req.body,function(err,results){
        console.log("--------Inside Past Orders request----------");
        return res.status(200).send(results);

    // console.log("Inside the getorders  backend page")

    // var query;
    // MongoClient.connect(url,async function (err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("grubhub");
    //      if (req.body.type === 'd')
    //      query = {id:mongoose.Types.ObjectId(req.body.id),status:'d'};
    //    //   query = {id:user.id,status:'d'};
    //       else
    //       query = {id:mongoose.Types.ObjectId(req.body.id),status:{ $ne :'d'}};
    //     //  query = {id:user.id,status:{ $ne :'d'}};

    //   //  var query = { Name: req.body.food };
    //   await  dbo.collection("Orders").find(query).toArray(function (err, result) {
    //     if (err) {
    //         console.log("Error", err)
    //         res.end("Not able to connect to db--order buyer")
    //     }
    //     else {
    //         console.log("Order Success")
    //         console.log(result);
    //         if (result.length >= 1) {

    //             var finalresult = [];
    //             result.forEach(element => {

    //                 var orders = element.Description.split("/");
    //                 console.log("order is " + orders[0]);
    //                 orders = orders.slice(1);
    //                 console.log("order is " + orders[0]);

    //                 const data = {
    //                     resname: element.resname,
    //                     orderitems: orders
    //                 }
    //                 finalresult.push(data);
    //             });
                
    //             console.log(finalresult);
    //             res.send(finalresult);
    //         }
    //         else {
    //             res.send("No data found");
    //         }

    //     }
    //       //  res.send(checkstatus);
    //         db.close();
    //     });
    // });


});

});

//use rid in req from only buyer
//getting orders from the current restaurent
app.post('/getResOrders', function (req, res) {
    console.log("Inside the getResOrders  backend page")



kafka.make_request("resOrder_topic",req.body,function(err,results){
    console.log("--------Inside Res Orders request----------");
    return res.status(200).send(results);


});
    
});



//use rid in req from only buyer
//getting orders from the current restaurent
app.post('/getMesseges', function (req, res) {
    console.log("Inside the MESSEGES")

    MongoClient.connect(url,async function (err, db) {
    if (err) {
        console.log("Error", err)
        res.end("Not able to connect to db--order buyer")
    }
        var dbo = db.db("grubhub");
      console.log(req.body.id);
      query = {to:  req.body.id   };
         // query = {Rid:  mongoose.Types.ObjectId(user.id)   };
         
      //  var query = { Name: req.body.food };
      await  dbo.collection("Messege").find(query).toArray(function (err, result) {
        if (err) {
            console.log("Error", err)
            res.end("Not able to connect to db--order buyer")
        }
        else {
            console.log("Order Success")
            if (result.length >= 1) {
                console.log("GET RESTAURENT ORDERS")
                console.log(result);
                res.send(result);
            }
            else {
                console.log("-------GET RESTAURENT ORDERS")
                res.send("No data found");
            }
        }
          //  res.send(checkstatus);
            db.close();
        });
    });

    
});


//use req the res items
app.post('/postitem', function (req, res) {  
    console.log("Inside the postitem  backend page")

var checkstatus="";
    MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("grubhub");
        // var obj = { Name: req.body.itemName,Rid:user.id,Sections:req.body.section,Price:req.body.itemPrice, RestaurentName: user.restname,RestaurentImage:user.restimage, ItemImage: "" ,Cuisine:user.cuisine};
        var obj = { Name: req.body.itemName,Rid: mongoose.Types.ObjectId(req.body.id),Sections:req.body.section,Price:req.body.itemPrice, RestaurentName: req.body.restname,RestaurentImage:req.body.restimage, ItemImage: "" ,Cuisine:req.body.cuisine};
        await dbo.collection("Items").insertOne(obj, function (err, result) {
            if (err) checkstatus = "Failed Item Insert"
            else checkstatus = "Success Item inserted"
            db.close();
            res.end(checkstatus)
        });
    });
});
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
