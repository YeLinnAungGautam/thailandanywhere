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
                else if(!sendQuickReply(senderPsid,webhookEvent.message)){
                    handleMessage(senderPsid, webhookEvent.message);
                }
                else {
                    handleMessage(senderPsid, webhookEvent.message);
                    // sendQuickReply(senderPsid,webhookEvent.message)
                }
            }
           

        });
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

function handleMessage(senderPsid, receivedMessage) {
    let response;

    if (receivedMessage.text) {
        response = {
            text: `Hello Welcome From Thailandanywhere.Please Choose Your Language`,
            quick_replies: [
                {
                    content_type: "text",
                    title: "Myanmar",
                    payload: "MM_LANGUAGE",
                },
                {
                    content_type: "text",
                    title: "English",
                    payload: "ENG_LANGUAGE",
                },
            ],
        };
    }
    callSendAPI(senderPsid, response);
}
function sendQuickReply(senderPsid,receivedMessage) {
  let response;

  if(receivedMessage.text === 'Myanmar'){
    response = {
      text: "ကျေးဇူးပြူပြီးသွားမယ့် ခရီးစဥ်ကို ရွေးချယ်ပါ",
      quick_replies: [
        {
            content_type: "text",
            title: "စွန့်စားမှု",
            payload: "MM_LAN",
        },
        {
            content_type: "text",
            title: "ခရီးတို",
            payload: "ENG_LAN",
        },
    ],
    }
  }
  callSendAPI(senderPsid, response);
//   return true;
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