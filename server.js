const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

// app configuration
app.set('port', (process.env.PORT || 3000));

// setup our express application
app.use(morgan('dev')); // log every request to the console.
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json()); 

// app routes
require('./routes/webhook_verify')(app);
// warming up the engines !! setta !! go !!!.
app.listen(app.get('port'), function() {
  const url = 'http://localhost:' + app.set('port');
  console.log('Application running on port: ', app.get('port'));
});

// handler receiving messages
app.post('/webhook', function (req, res) { 
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
           
          // receivedPostback(event);
          // console.log("Postback received: " + JSON.stringify(event.postback));
          // receivedPostback(payload_event);
    } 
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
    
        } else { 
            // TODO: Handle errors
            res.send(body);
        }
    });
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
  
