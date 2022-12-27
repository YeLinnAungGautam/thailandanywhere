'use strict';

// Use dotenv to read .env vars into Node
require('dotenv').config();

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  { urlencoded, json } = require('body-parser'),
  app = express();

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// Parse application/json
app.use(json());

// Respond with 'Hello World' when a GET request is made to the homepage
app.get('/', function (_req, res) {
  res.send('Hello World');
});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Creates the endpoint for your webhook
app.post('/webhook', (req, res) => {
  var events = req.body.entry[0].messaging; 
  for (i = 0; i < events.length; i++) {
    var event = events[i];

    if (event.message) {
      if (!carouselMessage(event.sender.id, event.message.text)) {
        sendMessage(event.sender.id);
      }
    }   
    if (event.message) {
      if (!sendButtonMessage(event.sender.id, event.message.text)) {
        sendMessage(event.sender.id);
      } 
    }  
    if(event.message){
      if(!sendQuickReply(event.sender.id, event.message.text)){
        sendMessage(event.sender.id); 
      }
    }
    if(event.message){
      if(!sendReplymm(event.sender.id, event.message.text)){
        sendMessage(event.sender.id); 
      }
    } 
    else if (event.postback) { 
      receivedPostback(event.sender.id, event.postback);
      sendMessage(event.sender.id);
    }    
  };
  res.sendStatus(200);
});
function setupGetStartedButton(res){
  var messageData = {
          "get_started":{
              "payload":"getstarted"
          }
  };
  // Start the request
  request({
      url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ PAGE_ACCESS_TOKEN,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      form: messageData
  },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // Print out the response body
        res.send(body);
      } 
      else { 
        // TODO: Handle errors
        res.send(body);
      }
      }
    );
}
// generic function sending messages
function sendMessage(recipientId, message) { 
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
      method: 'POST',
      json: {
          recipient: {id: recipientId},
          message: message,
      }
  }, 
  function(error, response, body) {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
  });
}; 
//handle postback message
function receivedPostback(recipientId, payload_event){
  var message;
  var payload = payload_event.payload; 
  if(payload === "getstarted"){
    message = { "text": "Hi Welcome!" };
     sendMessage(recipientId, message);
     return true;
  }
  if(payload === "YGN_MMAD"){
    message = { "text": "ကျွန်တော်သည်ရန်ကုန်ဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  }
  if(payload === "MDY_MMAD"){
    message = { "text": "ကျွန်တော်သည်မန္တလေးဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "NPW_MMAD"){
    message = { "text": "ကျွန်တော်သည်နေပြည်တော်ဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "MDY_MMST"){
    message = { "text": "ကျွန်တော်သည်မန္တလေးခရီးတိုဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  }
  if(payload === "BGO_MMST"){
    message = { "text": "ကျွန်တော်သည်ပဲခူးခရီးတိုဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  }
  if(payload === "PYP_MMST"){
    message = { "text": "ကျွန်တော်သည်ဖျာပုံခရီးတိုဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "CHA_MMRX"){
    message = { "text": "ကျွန်တော်သည်ချောင်သာခရီးဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "NWG_MMRX"){
    message = { "text": "ကျွန်တော်သည်ငွေဆောင်ခရီးဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "NGA_MMRX"){
    message = { "text": "ကျွန်တော်သည်ငပလီခရီးဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "TGI_MMUN"){
    message = { "text": "ကျွန်တော်သည်တောင်ကြီးခရီးဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "BGN_MMUN"){
    message = { "text": "ကျွန်တော်သည်ပုဂံခရီးဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "POL_MMUN"){
    message = { "text": "ကျွန်တော်သည်မေခရီးဖြစ်သည်။" };
     sendMessage(recipientId, message);
     return true;
  } 
  if(payload === "TO_BACK"){
     message = sendReplymm(recipientId, 'နောက်သို့');
     sendMessage(recipientId, message);
     return true;
  }  
};

// send rich message with kitten
function carouselMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split();
    if (values[0] === 'စွန့်စားမှုခရီး') {
            message = {
                "attachment": {
                    "type": "template",
                    "payload": { 
                        "template_type": "generic",
                        "elements": [
                          {
                            "title": "ရန်ကုန်",
                            "subtitle": "ရန်ကုန်အကြောင်းအရာ",
                            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Travel-Burma-yangon-shwedagon-pagoda.jpg/1280px-Travel-Burma-yangon-shwedagon-pagoda.jpg",
                            "buttons": [{
                              "type": "web_url",
                              "url": "https://www.neptunemm.com/",
                              "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                              },
                              {
                                "type": "postback",
                                "title": "အကြောင်းအရာကြည့်ရန်",
                                "payload": "YGN_MMAD",
                              },
                              {
                                "type": "postback",
                                "title": "နောက်သို့",
                                "payload": "TO_BACK",
                              } 
                            ] 
                        },
                        {
                          "title": "မန္တလေး",
                          "subtitle": "မန္တလေးအကြောင်းအရာ",
                          "image_url": "https://www.shweyemonhotelmandalay.com/wp-content/uploads/2017/11/attraction-mandalay-750x500.jpg",
                          "buttons": [{
                            "type": "web_url",
                            "url": "https://www.neptunemm.com/",
                            "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                            },
                            {
                              "type": "postback",
                              "title": "အကြောင်းအရာကြည့်ရန်",
                              "payload": "MDY_MMAD",
                            },
                            {
                              "type": "postback",
                              "title": "နောက်သို့",
                              "payload": "TO_BACK",
                            } 
                          ] 
                      },
                      {
                        "title": "နေပြည်တော်",
                        "subtitle": "နေပြည်တော်အကြောင်းအရာ",
                        "image_url": "https://static01.nyt.com/images/2007/10/04/world/04myan.600.jpg?quality=90&auto=webp",
                        "buttons": [{
                          "type": "web_url",
                          "url": "https://www.neptunemm.com/",
                          "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                          },
                          {
                            "type": "postback",
                            "title": "အကြောင်းအရာကြည့်ရန်",
                            "payload": "NPW_MMAD",
                          },
                          {
                            "type": "postback",
                            "title": "နောက်သို့",
                            "payload": "TO_BACK",
                          } 
                        ] 
                    }
                      ]
                    } 
                }
            };
            sendMessage(recipientId, message);
            return true;  
    }
    if (values[0] === 'ခရီးတို') {
      message = {
          "attachment": {
              "type": "template",
              "payload": {
                  "template_type": "generic",
                  "elements": [
                    {
                      "title": "မန္တလေး",
                      "subtitle": "မန္တလေးအကြောင်းအရာ",
                      "image_url": "https://www.shweyemonhotelmandalay.com/wp-content/uploads/2017/11/attraction-mandalay-750x500.jpg",
                      "buttons": [{
                        "type": "web_url",
                        "url": "https://www.neptunemm.com/",
                        "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                        },
                        {
                          "type": "postback",
                          "title": "အကြောင်းအရာကြည့်ရန်",
                          "payload": "MDY_MMST",
                        },
                        {
                          "type": "postback",
                          "title": "နောက်သို့",
                          "payload": "TO_BACK",
                        } 
                      ] 
                  },
                  {
                    "title": "ပဲခူး",
                    "subtitle": "ပဲခူးအကြောင်းအရာ",
                    "image_url": "https://media.tacdn.com/media/attractions-splice-spp-674x446/07/1f/9d/1c.jpg",
                    "buttons": [{
                      "type": "web_url",
                      "url": "https://www.neptunemm.com/",
                      "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                      },
                      {
                        "type": "postback",
                        "title": "အကြောင်းအရာကြည့်ရန်",
                        "payload": "BGO_MMST",
                      },
                      {
                        "type": "postback",
                        "title": "နောက်သို့",
                        "payload": "TO_BACK",
                      } 
                    ] 
                },
                {
                  "title": "ဖျာပုံ",
                  "subtitle": "ဖျာပုံအကြောင်းအရာ",
                  "image_url": "https://64.media.tumblr.com/3dc3d4db5e25b503147642c1cc06c0cb/tumblr_nkcg1qVCkK1tk3lfgo1_1280.jpg",
                  "buttons": [{
                    "type": "web_url",
                    "url": "https://www.neptunemm.com/",
                    "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                    },
                    {
                      "type": "postback",
                      "title": "အကြောင်းအရာကြည့်ရန်",
                      "payload": "PYP_MMST",
                    },
                    {
                      "type": "postback",
                      "title": "နောက်သို့",
                      "payload": "TO_BACK",
                    } 
                  ] 
              }
                ]
              } 
          }
      };
      sendMessage(recipientId, message);
      return true;  
} 
if (values[0] === 'အပန်းဖြေခရီး') {
  message = {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "generic",
              "elements": [
                {
                  "title": "ချောင်းသာ",
                  "subtitle": "ချောင်းသာအကြောင်းအရာ",
                  "image_url": "https://www.go-myanmar.com/files/destination-photo/chaung_tha.jpg",
                  "buttons": [{
                    "type": "web_url",
                    "url": "https://www.neptunemm.com/",
                    "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                    },
                    {
                      "type": "postback",
                      "title": "အကြောင်းအရာကြည့်ရန်",
                      "payload": "CHA_MMRX",
                    },
                    {
                      "type": "postback",
                      "title": "နောက်သို့",
                      "payload": "TO_BACK",
                    } 
                  ] 
              },
              {
                "title": "ငွေဆောင်",
                "subtitle": "ငွေဆောင်အကြောင်းအရာ",
                "image_url": "https://www.withustravels.com/wp-content/uploads/2015/09/Ngwe-Saung-Beach-1.jpg",
                "buttons": [{
                  "type": "web_url",
                  "url": "https://www.neptunemm.com/",
                  "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                  },
                  {
                    "type": "postback",
                    "title": "အကြောင်းအရာကြည့်ရန်",
                    "payload": "NWG_MMRX",
                  },
                  {
                    "type": "postback",
                    "title": "နောက်သို့",
                    "payload": "TO_BACK",
                  } 
                ] 
            },
            {
              "title": "ငပလီ",
              "subtitle": "ငပလီအကြောင်းအရာ",
              "image_url": "https://www.traveldailymedia.com/assets/2019/01/Hilton-Ngapali.jpg",
              "buttons": [{
                "type": "web_url",
                "url": "https://www.neptunemm.com/",
                "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                },
                {
                  "type": "postback",
                  "title": "အကြောင်းအရာကြည့်ရန်",
                  "payload": "NGA_MMRX",
                },
                {
                  "type": "postback",
                  "title": "နောက်သို့",
                  "payload": "TO_BACK",
                } 
              ] 
          }
            ]
          } 
      }
  };
  sendMessage(recipientId, message);
  return true;  
}  
if (values[0] === 'မသိသောခရီး') {
  message = {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "generic",
              "elements": [
                {
                  "title": "တောင်ကြီး",
                  "subtitle": "တောင်ကြီးအကြောင်းအရာ",
                  "image_url": "https://discoverydmc.com/wp-content/uploads/2017/09/taunggyi-1.jpg",
                  "buttons": [{
                    "type": "web_url",
                    "url": "https://www.neptunemm.com/",
                    "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                    },
                    {
                      "type": "postback",
                      "title": "အကြောင်းအရာကြည့်ရန်",
                      "payload": "TGI_MMUN",
                    },
                    {
                      "type": "postback",
                      "title": "နောက်သို့",
                      "payload": "TO_BACK",
                    } 
                  ] 
              },
              {
                "title": "ပုဂံ",
                "subtitle": "ပုဂံအကြောင်းအရာ",
                "image_url": "https://cdn.destguides.com/files/store/itinerary/90/background_image/jpeg_max-7eb11f893896fba0bde46e91619e5737.jpeg",
                "buttons": [{
                  "type": "web_url",
                  "url": "https://www.neptunemm.com/",
                  "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                  },
                  {
                    "type": "postback",
                    "title": "အကြောင်းအရာကြည့်ရန်",
                    "payload": "BGN_MMUN",
                  },
                  {
                    "type": "postback",
                    "title": "နောက်သို့",
                    "payload": "TO_BACK",
                  } 
                ] 
            },
            {
              "title": "မေမြို့",
              "subtitle": "မေမြို့အကြောင်းအရာ",
              "image_url": "https://d13jio720g7qcs.cloudfront.net/images/tours/740_390/5eb27a2adb486.jpg",
              "buttons": [{
                "type": "web_url",
                "url": "https://www.neptunemm.com/",
                "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                },
                {
                  "type": "postback",
                  "title": "အကြောင်းအရာကြည့်ရန်",
                  "payload": "POL_MMUN",
                },
                {
                  "type": "postback",
                  "title": "နောက်သို့",
                  "payload": "TO_BACK",
                } 
              ] 
          }
            ]
          } 
      }
  };
  sendMessage(recipientId, message);
  return true;  
}  
    return false;  
};   

function sendButtonMessage(recipientId, text) { 
  text = text || "";
  var values = text.split();
  if (values[0] === 'button') { 
          message = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "button",
                "text": "This is test text",
                buttons:[{
                  type: "web_url",
                  url: "https://www.neptunemm.com/",
                  title: "Open Web URL"
                }, {
                  type: "postback",
                  title: "Trigger Postback",
                  payload: "DEVELOPER_DEFINED_PAYLOAD"
                }, {
                  type: "phone_number",
                  title: "Call Phone Number",
                  payload: "09967669132"
                }]
              }
            }
          }  
        sendMessage(recipientId, message);    
                return true;   
}    
};   
  
  function sendQuickReply(recipientId, text) { 
    text = text || "";
    var values = text.split(); 
    if (values[0] === 'hi' || values[0] === 'Hi') {
            message = {
                text: "Choose Language",
                quick_replies: [
                  { 
                    "content_type":"text",
                    "title":"Myanmar",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
                  },
                  {
                    "content_type":"text",
                    "title":"English",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                  },
                ]
              }
            sendMessage(recipientId, message);    
                          return true; 
    }
  }; 
  function sendReplymm(recipientId, text) { 
    text = text || "";
    var values = text.split(); 
    if (values[0] === 'Myanmar' || values[0] === 'နောက်သို့') {
            message = {
                text: "Choose Your City",
                quick_replies: [
                  { 
                    "content_type":"text",
                    "title":"စွန့်စားမှုခရီး",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
                  },
                  {
                    "content_type":"text",
                    "title":"ခရီးတို",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                  },
                  {
                    "content_type":"text",
                    "title":"အပန်းဖြေခရီး",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
                  },
                  {
                    "content_type":"text",
                    "title":"မသိသောခရီး",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                  }
                ]
              }
            sendMessage(recipientId, message);    
                          return true; 
    } 
    if (values[0] === 'English') {
      message = {
          text: "Choose Your City",
          quick_replies: [
            { 
              "content_type":"text",
              "title":"Adventure",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
            },
            {
              "content_type":"text",
              "title":"Short Trip",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
            },
            {
              "content_type":"text",
              "title":"Relax",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
            }, 
            {
              "content_type":"text",
              "title":"Unknown",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
            }
          ]
        }
      sendMessage(recipientId, message);    
                    return true; 
}
  };

