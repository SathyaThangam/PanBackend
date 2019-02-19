const express = require('express');
const app = express();
var cors = require('cors');
const Nexmo = require('nexmo');

// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
// app.listen(5000)

var MongoClient = require('mongodb').MongoClient;

const port = 5000   
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

var url = "mongodb://localhost:27017/";


global.myotp = "" ;
global.phno = "";
app.post('/saveData', (req, res) => {
var count = 0;
  const alldata = req.body;
  console.log(alldata.phonenumber)


  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("panform");
    //Find the first document in the customers collection:
    dbo.collection("formtable").findOne({id : `${alldata.phonenumber}`}, function(err, result) {
      if (err) throw err;
      // res.json(
      //   result
      // )
      // console.log("results",result);
      count = 1;
      if(count == 0 )
      {
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("panform");
          var myobj = {id :  alldata.phonenumber, alldata  };
          dbo.collection("formtable").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });
      }
      
      if(count == 1)
      {
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("panform");
            var myquery = { id : `${global.phno}` };
            var newvalues = { $set: {alldata } };
            dbo.collection("formtable").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
            });
          });
      }
      
      db.close();
    });
  });

})

  app.post('/sendnumber', (req, res) => {
    alldata = req.body;
    console.log(alldata.phonenumber)
    global.phno = alldata.phonenumber
    const otplib =  require('otplib');
    const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'
    // Alternatively: const secret = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(secret);
    
    global.myopt = token;
    console.log("data",myopt)
    console.log("global data",global.myopt)
    const accountSid = 'AC6ac3c01907e59f108e0bdf3fbf5ec5e8';
    const authToken = '9293070191b4a6b103c273c2150452b1';
    const client = require('twilio')(accountSid, authToken);

    client.messages
      .create({
        body: 'The OTP is' + token,
        from: '+12024996362',
        to: "+91" + alldata.phonenumber,
      })
      .then(message => console.log(message.sid))
    .done();

    alldata.phonenumber = "";

      })



  app.get('/sendmsg', (req, res) => {
    console.log(global.myopt)
    res.send(global.myopt)
 
    });


  // app.post('/updateData', (req, res) => {
  //   const alldata = req.body.data;
  //   console.log(alldata)
  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("invoicedb");
  //   var myquery = { id : "1" };
  //   var newvalues = { $set: {alldata } };
  //   dbo.collection("invoicedata").updateOne(myquery, newvalues, function(err, res) {
  //     if (err) throw err;
  //     console.log("1 document updated");
  //     db.close();
  //   });
  // });

  // })

  app.get('/viewData', (req, res) => {
    console.log("phno",global.phno)
    console.log("otp...",global.myopt)

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("panform");
      //Find the first document in the customers collection:
      dbo.collection("formtable").findOne({id : `${global.phno}`}, function(err, result) {
        if (err) throw err;
        res.json(
          result
        )
        console.log("results",result);
        db.close();
      });
    });


  })
  


app.listen(port, () => console.log(`server runned on port:${port}`))



// const accountSid = 'AC6ac3c01907e59f108e0bdf3fbf5ec5e8';
// const authToken = '9293070191b4a6b103c273c2150452b1';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+12024996362',
//      to: '+919566612348'
//    })
//   .then(message => console.log(message.sid))
// .done();



// const otplib =  require('otplib');
// const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'
// // Alternatively: const secret = otplib.authenticator.generateSecret();
// const token = otplib.authenticator.generate(secret);
// console.log("data",token)
// const isValid = otplib.authenticator.check(token, secret);
// // or
// const isValid = otplib.authenticator.verify({ token, secret })