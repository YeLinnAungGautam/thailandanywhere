"use strict";

require("dotenv").config();

const request = require("request"),
    express = require("express"),
    { urlencoded, json } = require("body-parser"),
    app = express();

app.use(urlencoded({ extended: true }));

app.use(json());

app.get("/", function (_req, res) {
    res.send("Hello World");
});

app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post("/webhook", (req, res) => {
    let body = req.body;

    if (body.object === "page") {
        body.entry.forEach(function (entry) {
            let webhookEvent = entry.messaging[0];
            let senderPsid = webhookEvent.sender.id;
            if (webhookEvent.message) {
                // if (webhookEvent.message.quick_reply) {
                //     const payload = webhookEvent.message.quick_reply.payload;
                //     console.log("payload", payload);
                //     handlePostback(
                //         senderPsid,
                //         webhookEvent.message.quick_reply
                //     );
                // }
                if(!Intro(senderPsid,webhookEvent.message)){
                    callSendAPI(senderPsid);
                }
                if(!ChoosePackages(senderPsid,webhookEvent.message)){
                    callSendAPI(senderPsid);
                }
            } 
            // else {
            //         handleMessage(senderPsid, webhookEvent.message);
            //         // sendQuickReply(senderPsid,webhookEvent.message)
            //     }

        });
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

function Intro(senderPsid, receivedMessage) {
    let response;

    if (receivedMessage.text === "hi" || receivedMessage.text =="HI" || receivedMessage.text === "Hello" || receivedMessage.text === "hello") {
        response = {
            text: `မင်္ဂလာပါရှင့် 🙏 Thailand Anywhere မှ ကြိုဆိုပါတယ်။ထိုင်းနိုင်ငံအတွင်း ခရီးသွားဝန်ဆောင်မှုနဲ့ ပတ်သတ်ပြီး ကူညီဖို့အသင့်ပါရှင့်။ Thailand Anywhere ၏ ဝန်ဆောင်မှုများအားလုံးကို သိရှိနိုင်ရန် အောက်တွင်ရွေးချယ်ပေးပါနော်။🙇`,
            quick_replies: [
                {
                    content_type: "text",
                    title: "လေယာဥ်လက်မှတ်",
                    payload : "AIR_TIC"
                },
                {
                    content_type: "text",
                    title: "ဟိုတယ်Booking",
                    payload : "HB"
                },
                {
                    content_type: "text",
                    title: "Group Tour",
                    payload: "GT"
                },
                {
                    content_type: "text",
                    title: "Private Van Tour",
                    payload: "PVT"
                },
                {
                    content_type: "text",
                    title: "Entrance tickets",
                    payload: "ET"
                },
                {
                    content_type: "text",
                    title: "Airport transfer",
                    payload: "AT"
                },
            ],
        };
    }
    callSendAPI(senderPsid, response);
}
function ChoosePackages(senderPsid,receivedMessage) {
  let response;

  if(receivedMessage.text === 'Group Tour'){
    response = {
      text: "Thailand Anywhere မှ စီစဥ်ပေးထားသော အပတ်စဥ် စနေ ၊ တနင်္ဂ‌နွေနေ့တိုင်း ထွက်သော Group Tour ခရီးစဥ်များကို ကြည့်ရှုမည်။",
      quick_replies: [
        {
            content_type: "text",
            title: "Kanchanaburi",
            payload : 'KAN'
        },
        {
            content_type: "text",
            title: "Khao Yai",
            payload : "KHAO"
        },
    ],
    }
  }
  callSendAPI(senderPsid, response);
//   return true;
}
function GroupTourPackage(senderPsid,receivedMessage){
    let response;
    if(receivedMessage.text === 'Kanchanaburi'){
       response = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"Welcome!",
                  "image_url":"https://raw.githubusercontent.com/fbsamples/original-coast-clothing/main/public/styles/male-work.jpg",
                  "subtitle":"We have the right hat for everyone.",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "tall"
                  },
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"https://www.originalcoastclothing.com/",
                      "title":"View Website"
                    },{
                      "type":"postback",
                      "title":"Start Chatting",
                      "payload":"DEVELOPER_DEFINED_PAYLOAD"
                    }              
                  ]      
                }
              ]
            }
          }
       }
    }

}

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
    let response;
    console.log("Hello I am here");
    let payload = receivedPostback.payload;

    if (payload === "MM_LANGUAGE") {
        response = { text: "Hi I am burmese" };
    } else if (payload === "ENG_LANGUAGE") {
        response = { text: "Hi I am english" };
    }
    callSendAPI(senderPsid, response);
}

function callSendAPI(senderPsid, response) {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    let requestBody = {
        'recipient': {
          'id': senderPsid
        },
        'message': response
      };

    request(
        {
            uri:
                "https://graph.facebook.com/v15.0/me/messages?access_token=" +
                PAGE_ACCESS_TOKEN,
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: "POST",
            json: requestBody,
        },
        (err, _res, _body) => {
            if (!err) {
                console.log("Message sent!");
            } else {
                console.error("Unable to send message:" + err);
            }
        }
    );
}

const listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + listener.address().port);
});