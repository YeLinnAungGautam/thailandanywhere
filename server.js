'use strict';

// Use dotenv to read .env vars into Node
require('dotenv').config();

// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  bodyParser = require('body-parser'),
  { text } = require('body-parser'),
  app = express();
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

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
app.post('/webhook', function(req, res) {
  // let body = req.body;
  var event = req.body.entry[0].messaging;
  for (i = 0; i < event.length; i++) {
    var webhookEvent = event[i];
    if (webhookEvent.message) {
      if(!sendQuickReply(webhookEvent.sender.id, webhookEvent.message.receivedMessage)){
        sendMessage(webhookEvent.sender.id);
      }
    }
    if (webhookEvent.message) {
      if(!sendReply(webhookEvent.sender.id, webhookEvent.message.receivedMessage)){
        sendMessage(webhookEvent.sender.id);
      }
    }
  }
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
});

// Handles messages events
function sendQuickReply(recipientId, receivedMessage) {
  receivedMessage = receivedMessage || "";
  var values = receivedMessage.split();
  if (values[0] === 'hi' || values[0] === 'Hi') {
    message = {
      text: "Choose Language",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Myanmar",
          "payload":"mm"
        },
        {
          "content_type":"text",
          "title":"English",
          "payload":"eng"
        },
      ]
    }
    // Send the response message
    sendMessage(recipientId, message);
    return true;
  }
}
function sendReply(recipientId, receivedMessage){
  
  receivedMessage = receivedMessage || "";
  var values = receivedMessage.split();
  if (values[0] === 'Myanmar' || values[0] === 'နောက်သို့') {
    message= {
      text: "Choose Your City",
      quick_replies: [
        {
          "content_type":"text",
          "title":"စွန့်စားမှုခရီး",
          "payload":"advmm"
        },
        {
          "content_type":"text",
          "title":"ခရီးတို",
          "payload":"shteng"
        },
      ]
    }
    // Send the response message
    sendMessage(recipientId, message);
    return true;
  }
}
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
// // Handles messaging_postbacks events
// function handlePostback(senderPsid, receivedPostback) {
//   let response;

//   // Get the payload for the postback
//   let payload = receivedPostback.payload;

//   // Set the response based on the postback payload
//   if (payload === 'mm') {
//     response = { 'text': 'Hello I am Burmese haha' };
//   } else if (payload === 'eng') {
//     response = { 'text': 'Hi I am english' };
//   }
//   // Send the message to acknowledge the postback
//   callSendAPI(senderPsid, response);
// }

// Sends response messages via the Send API
// function callSendAPI(senderPsid, response) {

//   // The page access token we have generated in your app settings
//   const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

//   // Construct the message body
//   let requestBody = {
//     'recipient': {
//       'id': senderPsid
//     },
//     'message': response
//   };

//   // Send the HTTP request to the Messenger Platform
//   request({
//     'uri': 'https://graph.facebook.com/v2.6/me/messages',
//     'qs': { 'access_token': PAGE_ACCESS_TOKEN },
//     'method': 'POST',
//     'json': requestBody
//   }, (err, _res, _body) => {
//     if (!err) {
//       console.log('Message sent!');
//     } else {
//       console.error('Unable to send message:' + err);
//     }
//   });
// }
// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

