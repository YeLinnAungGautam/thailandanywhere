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
                if (webhookEvent.message.quick_reply) {
                    const payload = webhookEvent.message.quick_reply.payload;
                    console.log("payload", payload);
                    handlePostback(
                        senderPsid,
                        webhookEvent.message.quick_reply
                    );
                }
                else{
                    Intro(senderPsid,webhookEvent.message);
                    // callSendAPI(senderPsid);
                }
                // if(!ChoosePackages(senderPsid,webhookEvent.message)){
                //     callSendAPI(senderPsid);
                // }
                // if(!KanchanaburiGroupTour(senderPsid,webhookEvent.message)){
                //     callSendAPI(senderPsid);
                // }
            } 
            else {
                if (webhookEvent.postback) {
                    const postback = webhookEvent.postback;
                    console.log("postback", postback);
                    handlePostback(senderPsid, postback);
                }
                }

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
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, response);
}
function ChoosePackages(senderPsid) {
  let response;
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
  sendTypingOn(senderPsid, "typing_on");
  callSendAPI(senderPsid, response);
//   return true;
}
function KanchanaburiGroupTour(senderPsid,receivedMessage){
    let response;
       response = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"Welcome!",
                  "image_url":"https://scontent-sin6-2.xx.fbcdn.net/v/t45.5328-4/305949146_5400476563372725_8902643845604913423_n.jpg?stp=dst-jpg_p960x960&_nc_cat=109&ccb=1-7&_nc_sid=c48759&_nc_ohc=6ehqFOsCzY4AX8FC0Jl&_nc_ht=scontent-sin6-2.xx&oh=00_AfBUDX2h2jdovRz_syX-YzpofbXMBBRhMcQuT7oE-mpYcQ&oe=63BB39BE",
                  "subtitle":"We have the right hat for everyone.",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "tall"
                  },
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"ခရီးစဥ် အသေးစိတ်",
                      "payload":"KAN_DET"
                    },
                    {
                        "type":"postback",
                        "title":"Booking တင် မည်။",
                        "payload":"MKB_KAN"
                    }               
                  ]      
                }
              ]
            }
          }
       }
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, response);
}
function KhaoyaiGroupTour(senderPsid,receivedMessage){
    let response;
       response = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"Welcome!",
                  "image_url":"https://scontent-sin6-2.xx.fbcdn.net/v/t45.5328-4/305949146_5400476563372725_8902643845604913423_n.jpg?stp=dst-jpg_p960x960&_nc_cat=109&ccb=1-7&_nc_sid=c48759&_nc_ohc=6ehqFOsCzY4AX8FC0Jl&_nc_ht=scontent-sin6-2.xx&oh=00_AfBUDX2h2jdovRz_syX-YzpofbXMBBRhMcQuT7oE-mpYcQ&oe=63BB39BE",
                  "subtitle":"We have the right hat for everyone.",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "tall"
                  },
                  "buttons":[
                    {
                      "type":"postback",
                      "title":"ခရီးစဥ် အသေးစိတ်",
                      "payload":"KHAOYAI_DET"
                    },
                    {
                        "type":"postback",
                        "title":"Booking တင် မည်။",
                        "payload":"KHAOYAI_BKG"
                    }               
                  ]      
                }
              ]
            }
          }
       }
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, response);
}
function TripDetailsForKanchanaburi(senderPsid)
{
    let message = {
        text: "ဒီနေရာတွင် အလုံးရေ 2000 နဲ့ ခရီးစဉ်ကို ရှင်းပြလို့ ရပါတယ်",
    };
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, message);
}
function TripDetailsForKhaoyai(senderPsid){
    let message = {
        text: "ကျွန်တော် သည် Khao Yai ဖြစ်ပါသည်။ အလုံးရေ 2000 နဲ့ ခရီးစဉ်ကို ရှင်းပြလို့ ရပါတယ်",
    };
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, message);
}
function makingBooking(senderPsid, payload) {
    if (payload === "MKB_KAN" || payload === "KHAOYAI_BKG") {
        let responseOne = {
            text: "Booking တင်ရန်အတွက် အချိန် နှင့် နေရက်ကို ပို့ပေးထားပါ။ Customer Service ထံမှ မကြာခင်အချိန်အတွင်း စာပြန်ပြီး Booking Confirm ‌ေပေးပါမည်။",
        };

        let responseTwo = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: "Payment",
                            image_url:
                                "https://scontent-sin6-2.xx.fbcdn.net/v/t45.5328-4/305949146_5400476563372725_8902643845604913423_n.jpg?stp=dst-jpg_p960x960&_nc_cat=109&ccb=1-7&_nc_sid=c48759&_nc_ohc=6ehqFOsCzY4AX8FC0Jl&_nc_ht=scontent-sin6-2.xx&oh=00_AfBUDX2h2jdovRz_syX-YzpofbXMBBRhMcQuT7oE-mpYcQ&oe=63BB39BE",
                            subtitle:
                                "ငွေလွဲရန်အတွက် အောက်ပါ အကောင့်များကို နှိပ်ပြီး ကြည့်ပေးပါ။",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "KBZ Bank",
                                    payload: "ACC_KBZ",
                                },
                                {
                                    type: "postback",
                                    title: "Thai Bank",
                                    payload: "ACC_THAI",
                                },
                            ],
                        },
                    ],
                },
            },
        };
        sendTypingOn(senderPsid, "typing_on");
        sendTypingOn(senderPsid, "typing_on");
        callSendAPI(senderPsid, responseTwo);
        sendTypingOn(senderPsid, "typing_on");
        sendTypingOn(senderPsid, "typing_on");
        callSendAPI(senderPsid, responseOne);
    }
}
function AirportCarType(senderPsid){
    let response;
    response = {
      text: "ကားအမျိုးအစား ကို ရွေးချယ်ပေးပါ",
      quick_replies: [
        {
            content_type: "text",
            title: "Salon (2 person)",
            payload : 'TWOPERSON'
        },
        {
            content_type: "text",
            title: "Fortuner /Innova (4 person)",
            payload : "FOURPERSON"
        },
        {
            content_type: "text",
            title: "Van (Above 4 Person)",
            payload : "FOURABOVE"
        },
    ],
  }
  sendTypingOn(senderPsid, "typing_on");
  callSendAPI(senderPsid, response);
}
function ChooseAirport(senderPsid){
    let response;
    response = {
        text: "လေဆိပ် အကြို/အပို့ လုပ်ဖို့အတွက် လူကြီးမင်း သွားလိုတဲ့ လေဆိပ်ကို ‌ရွေးချယ်ပေးပါ။",
        quick_replies: [
            {
                content_type: "text",
                title: "ဒွန်မောင်း",
                payload: 'DUN_MAUNG'
            },
            {
                content_type: "text",
                title: "သုဝဏ္ဏဘူမိ",
                payload: 'SUWANA_BUMI'
            }
        ]
    }
    sendTypingOn(senderPsid, "typing_on");
  callSendAPI(senderPsid, response);
}
function BookingForAirportTransfer(senderPsid){
    let response;
       response = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"Welcome!",
                  "image_url":"https://scontent-sin6-2.xx.fbcdn.net/v/t45.5328-4/305949146_5400476563372725_8902643845604913423_n.jpg?stp=dst-jpg_p960x960&_nc_cat=109&ccb=1-7&_nc_sid=c48759&_nc_ohc=6ehqFOsCzY4AX8FC0Jl&_nc_ht=scontent-sin6-2.xx&oh=00_AfBUDX2h2jdovRz_syX-YzpofbXMBBRhMcQuT7oE-mpYcQ&oe=63BB39BE",
                  "subtitle":"We have the right hat for everyone.",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "tall"
                  },
                  "buttons":[
                    {
                        "type":"postback",
                        "title":"Booking တင် မည်။",
                        "payload":"BKK_AIRPORT"
                    },
                    {
                        "type":"postback",
                        "title":"နောက်သို့",
                        "payload":"TOBACK"
                    }           
                  ]      
                }
              ]
            }
          }
       }
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, response);
}
function makingBookingForAirport(senderPsid){
    let responseOne = {
        text: "လာကြို/ လိုက်ပို့ ပေးရမည့် လူကြီးမင်း ၏ လေယာဥ်လက်မှတ် ပုံပို့ပါရန်",
    };
    let responseTwo = {
        text: "လာကြို/ လိုက်ပို့ ပေးရမည့် Hotel လိပ်စာ ပို့ပေးပါရန်",
    }
    let responseThree = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Payment",
                        image_url:
                            "https://scontent-sin6-2.xx.fbcdn.net/v/t45.5328-4/305949146_5400476563372725_8902643845604913423_n.jpg?stp=dst-jpg_p960x960&_nc_cat=109&ccb=1-7&_nc_sid=c48759&_nc_ohc=6ehqFOsCzY4AX8FC0Jl&_nc_ht=scontent-sin6-2.xx&oh=00_AfBUDX2h2jdovRz_syX-YzpofbXMBBRhMcQuT7oE-mpYcQ&oe=63BB39BE",
                        subtitle:
                            "ငွေလွဲရန်အတွက် အောက်ပါ အကောင့်များကို နှိပ်ပြီး ကြည့်ပေးပါ။",
                        buttons: [
                            {
                                type: "postback",
                                title: "KBZ Bank",
                                payload: "ACC_KBZ",
                            },
                            {
                                type: "postback",
                                title: "Thai Bank",
                                payload: "ACC_THAI",
                            },
                        ],
                    },
                ],
            },
        },
    };
        sendTypingOn(senderPsid, "typing_on");
        sendTypingOn(senderPsid, "typing_on");
        callSendAPI(senderPsid, responseOne);
        sendTypingOn(senderPsid, "typing_on");
        sendTypingOn(senderPsid, "typing_on");
        callSendAPI(senderPsid, responseTwo);
        sendTypingOn(senderPsid, "typing_on");
        sendTypingOn(senderPsid, "typing_on");
        callSendAPI(senderPsid, responseThree);
}



// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
    let response;
    console.log("Hello I am here");
    let payload = receivedPostback.payload;

    if (payload === "GT") {
        ChoosePackages(senderPsid);
    }
    else if(payload === "KAN"){
         KanchanaburiGroupTour(senderPsid);
    } 
    else if (payload === "KAN_DET") {
        TripDetailsForKanchanaburi(senderPsid);
    }
    else if (payload === "MKB_KAN") {
        makingBooking(senderPsid, payload);
    }
    else if(payload === "KHAO"){
        KhaoyaiGroupTour(senderPsid);
   } 
    else if (payload === "KHAOYAI_DET"){
        TripDetailsForKhaoyai(senderPsid);
    }
    else if(payload === "KHAOYAI_BKG"){
        makingBooking(senderPsid, payload);
    }
    //AirPort Transfer
    else if(payload === "AT"){
        ChooseAirport(senderPsid);
    }
    else if(payload === "DUN_MAUNG"){
        AirportCarType(senderPsid);
    }
    else if(payload === "SUWANA_BUMI"){
        AirportCarType(senderPsid);
    }
    else if(payload === "TWOPERSON"){
        BookingForAirportTransfer(senderPsid);
    }
    else if(payload === "BKK_AIRPORT"){
        makingBookingForAirport(senderPsid);
    }
    else if(payload === "TOBACK"){
        ChooseAirport(senderPsid);
    }
    else{
        callSendAPI(senderPsid, response);
    }
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
function sendTypingOn(senderPsid, actions) {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    let requestBody = {
        recipient: {
            id: senderPsid,
        },
        sender_action: actions,
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