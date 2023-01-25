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
                } else {
                    Intro(senderPsid, webhookEvent.message);
                    // callSendAPI(senderPsid);
                }
                // if(!ChoosePackages(senderPsid,webhookEvent.message)){
                //     callSendAPI(senderPsid);
                // }
                // if(!KanchanaburiGroupTour(senderPsid,webhookEvent.message)){
                //     callSendAPI(senderPsid);
                // }
            } else {
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

async function Intro(senderPsid, receivedMessage) {
    let response;
    if (
        receivedMessage.text === "hi" ||
        receivedMessage.text == "HI" ||
        receivedMessage.text === "Hello" ||
        receivedMessage.text === "hello" ||
        receivedMessage.text === "Hi"
    ) {
        response = {
            text: `မင်္ဂလာပါရှင့် 🙏 Thailand Anywhere မှ ကြိုဆိုပါတယ်။ထိုင်းနိုင်ငံအတွင်း ခရီးသွားဝန်ဆောင်မှုနဲ့ ပတ်သတ်ပြီး ကူညီဖို့အသင့်ပါရှင့်။ Thailand Anywhere ၏ ဝန်ဆောင်မှုများအားလုံးကို သိရှိနိုင်ရန် အောက်တွင်ရွေးချယ်ပေးပါနော်။🙇`,
            quick_replies: [
                {
                    content_type: "text",
                    title: "လေယာဥ်လက်မှတ်",
                    payload: "AIR_TIC",
                },
                {
                    content_type: "text",
                    title: "ဟိုတယ်Booking",
                    payload: "HB",
                },
                {
                    content_type: "text",
                    title: "Group Tour",
                    payload: "GT",
                },
                {
                    content_type: "text",
                    title: "Private Van Tour",
                    payload: "PVT",
                },
                {
                    content_type: "text",
                    title: "Entrance tickets",
                    payload: "ET",
                },
                {
                    content_type: "text",
                    title: "Airport transfer",
                    payload: "AT",
                },
            ],
        };
    }
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, response);
}

async function ChoosePackages(senderPsid) {
    let response;
    response = {
        text: "Thailand Anywhere မှ စီစဥ်ပေးထားသော အပတ်စဥ် စနေ ၊ တနင်္ဂ‌နွေနေ့တိုင်း ထွက်သော Group Tour ခရီးစဥ်များကို ကြည့်ရှုမည်။",
    };
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
                        subtitle: "Every Friday at 7am\nPrice per Person",
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
                            subtitle: "Every Friday at 7am\nPrice per Person",
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
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, response);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseTwo);
    //   return true;
}
async function KanchanaburiImages(senderPsid) {
    let responseOne = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_1.jpg",
            },
        },
    };
    let responseTwo = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_2.jpg",
            },
        },
    };
    let responseThree = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_3.jpg",
            },
        },
    };
    let responseFour = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_4.jpg",
            },
        },
    };
    let responseFive = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_5.jpg",
            },
        },
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseTwo);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseThree);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseFour);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseFive);
}
async function KhoyaiGroupTourImages(senderPsid){
    let responseOne = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_1.jpg",
            },
        },
    };
    let responseTwo = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_2.jpg",
            },
        },
    };
    let responseThree = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_3.jpg",
            },
        },
    };
    let responseFour = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_4.jpg",
            },
        },
    };
    let responseFive = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_5.jpg",
            },
        },
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseTwo);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseThree);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseFour);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseFive);
}
async function KanchanaburiGroupTour(senderPsid, receivedMessage) {
    let response;
    let responseOne = {
        text: "🇹🇭🚐🌳အပတ်စဉ် စနေနေ့တိုင်းထွက်ခွါမယ့် ထိုင်းနိုင်ငံရဲ့ စိတ်ဖိစီးမှုကင်းမဲ့ဇုန် ဖြစ်တဲ့ ကန်ချနာပူရီ‌ နေ့ချင်းပြန် ခရီးစဉ်လေး...🏞️ နေ့ချင်းပြန်သွားလို့ရတဲ့အပြင် ပုံမှန်ထက် ကားအသုံးပြုချိန် 2 နာရီ အပို သုံးပေးထားလို့ ကန်ချနာပူရီ မြို့ရဲ့ အထင်ကရ နေရာ‌တော်တော်များများ\nကိုလည်း သွားလည်လို့ ရမယ်။ 📸\nအမှတ်တရပေါင်းများစွာကို စိတ်လွတ် ကိုယ်လွတ် ဖန်တီးနိုင်ဖို့ ဒီခရီးစဉ်ထဲမှာ နေရာလှလှလေးတွေ ထည့်သွင်းရေးဆွဲ‌ပေးထားပါတယ်။\n-------------------------------------------------\nခရီးစဉ်ထဲာလည်ပတ်မယ့် နေရာတွေကတော့ ...🙏🙏🙏 ကန်ချနာပူရီမြို့ရဲ့ အထင်ကရနေရာတွေ ဖြစ်တဲ့ နာမည်ကျော် ဆုတောင်းပြည့် Wat Tham Suea ကျားဘုရား ၊🌉🛤️ ကန်ချနာပူရီမြို့ရဲ့ နာမည်ကျော် ကွေးမြစ်‌ဘေးက သေမင်းတမန်ရထားလမ်းပေါ်ရှိ River Kwai တံတား၊🥗🥣ကွေးမြစ်ထဲက ရေပေါ်‌စားသောက်ဆိုင်လေးဖြစ်တဲ့ Floating Raft Restaurant စားသောက်ဆိုင်၊🏞️🌊 Sai Yok Noi ရေတံခွန်၊🌸🍂☕ မာဂရက်ပန်းခင်းကြီးနဲ့ ဓာတ်ပုံရိုက်လို့ အရမ်းလှတဲ့ Chan Nature Cafe၊🌳💯 နှစ်ပေါင်းတစ်ရာကျော် သက်တမ်းရှိတဲ့ ဓာတ်ပုံရိုက်လို့အရမ်းလှတဲ့ Giant Rain Treeစတဲ့  နေရာ 6 ခုလုံးကို လည်ပတ်ဖို့အတွက် လိုက်ပါပို့‌ဆောင် ပေးမှာ ဖြစ်ပါတယ်။⏰ခရီးစဉ်အတွက် စုရပ်ကတော့ Platinum Mall အရှေ့မှာ မနက် 7 နာရီ ဆုံကြမှာ ဖြစ်ပြီး ည 9 နာရီမှာ Platinum Mall အရှေ့ကို ပြန်လည်ပို့ဆောင်ပေးမှာ ဖြစ်ပါတယ်။\n-------------------------------------------------\n🤗🚐ခရီးစဉ်အတွက် Luxury Van နဲ့စီစဉ်ပေးထားပြီး ကားထဲမှာ  📺TV ,Aircon အစုံအလင်နဲ့  လူ 4 ယောက်ပြည့်တာနဲ့ ခရီးစဉ်လေးကို ဇိမ်ရှိရှိ စထွက်နိုင်မှာဖြစ်ပါတယ်။\nစရိတ်ငြိမ်း ခရီးစဉ် ဖြစ်ပြီး အချိန် 14 နာရီကြာထိ ကား အသုံးပြုပေးထားပြီး 🔰ဝင်ကြေးများ🔰ကားခ 🔰ဆီဖိုး🔰နေ့လည်စာ အပြင် Chan Nature Cafe မှာ ကြိုက်နှစ်သက်ရာ Drink တစ်ခွက် သောက်လို့ရမှာဖြစ်ပြီး  အပိုဆောင်း ထပ်ပေးစရာမလိုပါဖူး။\n💯စျေး နှုန်းအ‌နေနဲ့ စရိတ်ငြိမ်း အပြီးအစီး ကိုမှ🔸 တစ်ဦးကို  ဘတ် 1850  ပဲ ကျသင့်မှာ ဖြစ်ပါတယ်။💯လူဦးရေ အကန့်အသတ်ရှိတာဖြစ်လို့ လူမပြည့်ခင် အမြန်ဆုံး စာရင်းကြိုပေးလိုက်တော့နော် 🤗🤗🤗လူများလေ ပိုတန်လေပဲဖြစ်လို့ မိသားစုတွေ သူငယ်ချင်းတွေနဲ့ ပိတ်ရက်မှာ လျှောက်လည်ဖို့အတွက်📲 အမြန်လူစုပြီး စာရင်းပေးဖို့ ဖိတ်ခေါ်ပါတယ်။",
    };
    response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Have Fun",
                        image_url:
                            "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_2.jpg",
                        buttons: [
                            {
                                type: "postback",
                                title: "Book Now",
                                payload: "CHOOSE_DAYANDTIME",
                            },
                            {
                                type: "postback",
                                title: "Talk To Agent",
                                payload: "KAN_DET_TALK_TO AGENT",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GB_KAN",
                            },
                        ],
                    },
                ],
            },
        },
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, response);
}
async function ChooseDateAndTimeForKanchanaburi(senderPsid) {
    let responseOne = {
        text: "When would you like to book?",
        quick_replies: [
            {
                content_type: "text",
                title: "This Friday",
                payload: "THIS_F_KANCHANABURI",
            },
            {
                content_type: "text",
                title: "Next Friday",
                payload: "NEXT_F_KANCHANABURI",
            },
            {
                content_type: "text",
                title: "Future Dates",
                payload: "FUTURE_D_KANCHANABURI",
            },
            {
                content_type: "text",
                title: "Talk To Agent",
                payload: "TALK_TO_AGENT_KANCHANABURI",
            },
        ],
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
}
async function ChooseDateAndTimeForKhoYai(senderPsid) {
    let responseOne = {
        text: "When would you like to book?",
        quick_replies: [
            {
                content_type: "text",
                title: "This Friday",
                payload: "THIS_F_KHOYAI",
            },
            {
                content_type: "text",
                title: "Next Friday",
                payload: "NEXT_F_KHOYAI",
            },
            {
                content_type: "text",
                title: "Future Dates",
                payload: "FUTURE_D_KHOYAI",
            },
            {
                content_type: "text",
                title: "Talk To Agent",
                payload: "TALK_TO_AGENT_KHOYAI",
            },
        ],
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
}
async function ChooseDate(senderPsid) {
    let responseOne = {
        text: "Please Give Us Your date",
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
}
async function TalkToAgent(senderPsid) {
    let response;
    response = {
        text: "Our travel assistant will get back to you with availability status",
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, response);
}
async function KhaoyaiGroupTour(senderPsid, receivedMessage) {
    let response;
    let responseOne = {
        text: "Just Hello",
    };
    response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Have Fun",
                        image_url:
                            "http://thailandanywhere.npthosting.cyou/kanchanaburi_grouptour_2.jpg",
                        buttons: [
                            {
                                type: "postback",
                                title: "Book Now",
                                payload: "CHOOSE_DAYANDTIME_KHOYAI_DET",
                            },
                            {
                                type: "postback",
                                title: "Talk To Agent",
                                payload: "KHOYAI_DET_TALK_TO AGENT",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GB_KHOYAI",
                            },
                        ],
                    },
                ],
            },
        },
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, response);
}
async function TripDetailsForKanchanaburi(senderPsid) {
    let message = {
        text: "ကျွန်တော်သည် Kanchanaburi ဖြစ်ပါသည်",
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, message);
}
async function makingBooking(senderPsid, payload) {
    if (
        payload === "MKB_KAN" ||
        payload === "KHAOYAI_BKG" ||
        payload === "THIS_F_KANCHANABURI" ||
        payload === "FUTURE_D_KANCHANABURI" ||
        payload === "NEXT_F_KANCHANABURI" ||
        payload === "THIS_F_KHOYAI" ||
        payload === "NEXT_F_KHOYAI" ||
        payload === "FUTURE_D_KHOYAI" 
    ) {
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
                            subtitle: "Online",
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
        await callSendAPI(senderPsid, responseOne);
        sendTypingOn(senderPsid, "typing_on");
        await callSendAPI(senderPsid, responseTwo);
    }
}

// Handles messaging_postbacks events
async function handlePostback(senderPsid, receivedPostback) {
    let response;
    console.log("Hello I am here");
    let payload = receivedPostback.payload;

    if (payload === "GT") {
        ChoosePackages(senderPsid);
    } else if (payload === "KAN") {
        await KanchanaburiImages(senderPsid);
        await KanchanaburiGroupTour(senderPsid);
    } else if (payload === "KAN_DET") {
        TripDetailsForKanchanaburi(senderPsid);
    } else if (payload === "MKB_KAN") {
        makingBooking(senderPsid, payload);
    } 
    //Start Kha Yai Group Tour
    else if (payload === "KHAO") {
        await KhoyaiGroupTourImages(senderPsid);
        await KhaoyaiGroupTour(senderPsid);
    } else if(payload === "KHOYAI_DET_TALK_TO AGENT"){
        TalkToAgent(senderPsid);
    }
    else if(payload === "GB_KHOYAI"){
        ChoosePackages(senderPsid);
    }
    else if(payload === "CHOOSE_DAYANDTIME_KHOYAI_DET"){
        ChooseDateAndTimeForKhoYai(senderPsid);
    }
    else if(payload === "THIS_F_KHOYAI"){
        makingBooking(senderPsid, payload);
    }
    else if(payload === "NEXT_D_KHOYAI"){
        makingBooking(senderPsid, payload);
    }
    else if(payload === "FUTURE_D_KHOYAI"){
        ChooseDate(senderPsid);
        makingBooking(senderPsid, payload);
    }
    else if(payload === "TALK_TO_AGENT_KHOYAI"){
        TalkToAgent(senderPsid);
    }
    //End KhoYai Group Tour
    else if (payload === "KAN_DET_TALK_TO AGENT") {
        TalkToAgent(senderPsid);
    } else if (payload === "CHOOSE_DAYANDTIME") {
        ChooseDateAndTimeForKanchanaburi(senderPsid);
    } else if (payload === "FUTURE_D_KANCHANABURI") {
        ChooseDate(senderPsid);
        makingBooking(senderPsid, payload);
    } else if (payload === "THIS_F_KANCHANABURI") {
        makingBooking(senderPsid, payload);
    } else if (payload === "NEXT_F_KANCHANABURI") {
        makingBooking(senderPsid, payload);
    } else if (payload === "TALK_TO_AGENT_KANCHANABURI") {
        TalkToAgent(senderPsid);
    }else if (payload === "GB_KAN"){
        ChoosePackages(senderPsid);
    } 
    else {
        await callSendAPI(senderPsid, response);
    }
}

async function callSendAPI(senderPsid, response) {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    let requestBody = {
        recipient: {
            id: senderPsid,
        },
        message: response,
    };

    return new Promise((resolve, reject) => {
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
                    resolve(_res);
                } else {
                    console.error("Unable to send message:" + err);
                    reject(err);
                }
            }
        );
    });
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
