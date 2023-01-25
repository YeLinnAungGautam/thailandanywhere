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
    if (receivedMessage.text === "hi" || receivedMessage.text =="HI" || receivedMessage.text === "Hello" || receivedMessage.text === "hello" || receivedMessage.text === "Hi") {
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
      text: "Thailand Anywhere မှ စီစဥ်ပေးထားသော အပတ်စဥ် စနေ ၊ တနင်္ဂ‌နွေနေ့တိုင်း ထွက်သော Group Tour ခရီးစဥ်များကို ကြည့်ရှုမည်။", }
    let responseTwo = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Kanchanaburi",
                        image_url:
                            "https://scontent-sin6-2.xx.fbcdn.net/v/t45.5328-4/306167946_5176274215818133_7958764666120436857_n.jpg?stp=dst-jpg_p960x960&_nc_cat=108&ccb=1-7&_nc_sid=c48759&_nc_ohc=CMKaUN4jt5sAX-05uP_&_nc_ht=scontent-sin6-2.xx&oh=00_AfDZmcwPtyySgpBFnrX8i5q5q9s1DeEmVTj0fvLJs72nXw&oe=63D4F962",
                        subtitle:
                            "Every Friday at 7am\nPrice per Person",
                        buttons: [
                            {
                                type: "postback",
                                title: "Learn More",
                                payload: "KAN",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GROUP_TOUR_BAC1",
                            },
                        ],
                    },
                    {
                        title: "Khao Yai",
                        image_url:
                            "https://scontent-sin6-3.xx.fbcdn.net/v/t45.5328-4/286706997_5404239662998297_8288395513428964828_n.jpg?stp=dst-jpg_p960x960&_nc_cat=104&ccb=1-7&_nc_sid=c48759&_nc_ohc=q7B5wAtkS_UAX_4x0aX&_nc_ht=scontent-sin6-3.xx&oh=00_AfD0HjaWOPXOId0R9NK0R3ii3cFwdDVpxYuMQmPGb5U-rg&oe=63D40C8E",
                        subtitle:
                            "Every Friday at 7am",
                        buttons: [
                            {
                                type: "postback",
                                title: "Learn More",
                                payload: "KHAO",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GROUP_TOUR_BAC2",
                            },
                        ],
                    },    
                ],
            },
        },
    } 
  sendTypingOn(senderPsid, "typing_on");
  callSendAPI(senderPsid, response);
  sendTypingOn(senderPsid, "typing_on");
  callSendAPI(senderPsid, responseTwo);
//   return true;
}
function KanchanaburiImages(senderPsid){
    let responseOne={
        'attachment':{
            'type': 'image',
            'payload': {
                'url': "https://cdn.britannica.com/60/8160-050-08CCEABC/German-shepherd.jpg"
            }
        }
    };
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, response);
}
async function KanchanaburiGroupTour(senderPsid,receivedMessage){
    let response;
       response = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"Have Fun",
                  "image_url":"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Flets-go&psig=AOvVaw3FQBjvPsZC9osLJGm1Qdm9&ust=1674647629788000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCNDXrNuS4PwCFQAAAAAdAAAAABAF",
                  "buttons":[
                    {
                        "type":"postback",
                        "title":"Book Now",
                        "payload":"CHOOSE_DAYANDTIME"
                    },
                    {
                        "type":"postback",
                        "title":"Talk To Agent",
                        "payload":"KAN_DET_TALK_TO AGENT"
                    },
                    {
                        "type":"postback",
                        "title":"Go Back",
                        "payload":"GT_KAN"
                    }               
                  ]      
                }
              ]
            }
          }
       };
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, response);
}
function ChooseDateAndTimeForKanchanaburi(senderPsid){
    let responseOne = {
        text: "Please confirm your booking for this Friday by paying 10% deposit. How would you like to Pay.",
        quick_replies: [
            {
                content_type: "text",
                title: "This Friday",
                payload: 'THIS_F_KANCHANABURI'
            },
            {
                content_type: "text",
                title: "Next Friday",
                payload: 'NEXT_F_KANCHANABURI'
            },
            {
                content_type: "text",
                title: "Future Dates",
                payload: 'FUTURE_D_KANCHANABURI'
            },
            {
                content_type: "text",
                title: "Talk To Agent",
                payload: 'TALK_TO_AGENT_KANCHANABURI'
            }
        ]
    };
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, responseOne);
}
function ChooseDate(senderPsid){
    let responseOne = {
        text: "Please Give Us Your date"
    }
    sendTypingOn(senderPsid, "typing_on");
    callSendAPI(senderPsid, responseOne);
}
function TalkToAgent(senderPsid){
    let response; 
    response = {
      text: "Our travel assistant will get back to you with availability status", }
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
                  "image_url":"https://scontent-sin6-2.xx.fbcdn.net/v/t45.5328-4/295467281_5487283001336382_5037642418235754208_n.jpg?stp=dst-jpg_p960x960&_nc_cat=109&ccb=1-7&_nc_sid=c48759&_nc_ohc=CXj5wQ0qZTcAX8kWHpy&_nc_ht=scontent-sin6-2.xx&oh=00_AfAJVav7VsY2wMUgtPaM1Axy4nwm6Y5YjbMl-Lp9M3iakg&oe=63CBFF60",
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
        text: "ကျွန်တော်သည် Kanchanaburi ဖြစ်ပါသည်",
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
    if (payload === "MKB_KAN" || payload === "KHAOYAI_BKG" || payload === "THIS_F_KANCHANABURI" || payload === "FUTURE_D_KANCHANABURI" || payload === "NEXT_F_KANCHANABURI") {
        let responseOne = {
            text: "Please confirm your booking for this Friday by paying 10% deposit. How would you like to Pay.",
        };

        let responseTwo = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: "How would you like to pay",
                            image_url:
                                "https://www.nttdata.com/th/en/-/media/nttdataapac/ndth/services/card-and-payment-services/services_card_and_payment_services_header_2732x1536_1.jpg?h=1536&iar=0&w=2732&rev=cda4f237fa8c46248b1376544031309e",
                            subtitle:
                                "Online",
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

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
    let response;
    console.log("Hello I am here");
    let payload = receivedPostback.payload;

    if (payload === "GT") {
        ChoosePackages(senderPsid);
    }
    else if(payload === "KAN"){
         KanchanaburiImages(senderPsid);
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
    else if(payload === "KAN_DET_TALK_TO AGENT"){
        TalkToAgent(senderPsid);
    }
    else if(payload === "CHOOSE_DAYANDTIME"){
        ChooseDateAndTimeForKanchanaburi(senderPsid);
    } 
    else if(payload === "FUTURE_D_KANCHANABURI"){
        ChooseDate(senderPsid);
        makingBooking(senderPsid,payload);
    }
    else if(payload === "THIS_F_KANCHANABURI"){
        makingBooking(senderPsid,payload);
    }
    else if(payload === "NEXT_F_KANCHANABURI"){
        makingBooking(senderPsid,payload);
    }
    else if(payload === "TALK_TO_AGENT_KANCHANABURI"){
        TalkToAgent(senderPsid);
    }
    else{
        callSendAPI(senderPsid, response);
    }
}

async function callSendAPI(senderPsid, response) {
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