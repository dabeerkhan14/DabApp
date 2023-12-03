const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const phoneNumber = req.body.phoneNumber;
    const email = req.body.email;


    console.log(firstName, lastName, email, phoneNumber);

    //The data we want to send to the mailchimp Servers in the form of JSON string.
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phoneNumber
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);


    //Now we want to post data to an external server i.e mailchimp
    const url = "https://us11.api.mailchimp.com/3.0/lists/20ba48237c"
    const options = {
        method: "POST",
        auth: "Dabeer:63e24e90781dbd59bd22b6eece2d27e4-us11"
    }

    //in order to send our data to mailchimp server we use a constant name as request
    const request = https.request(url, options, function (response) {

        if(response.statusCode===200)
        res.sendFile(__dirname + "/success.html");
        else
        res.sendFile(__dirname +"/failure.html");
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(3000, function () {
    console.log("Server has started running on port 3000");
});


// API KEY
// 63e24e90781dbd59bd22b6eece2d27e4-us11

// List ID
// 20ba48237c