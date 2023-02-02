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
            text: `Thailand Anywhere team is happy to serve you on your holiday plans. We offer car rental services, hotel booking, entry tickets, group tours and custom travel plans at great prices!🙇\n\nPlease select below to find out all about Thailand Anywhere's services and book your desired products.🙇`,
            quick_replies: [
                {
                    content_type: "text",
                    title: "Group Tour",
                    payload: "GT",
                },
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

// send intro
async function sendIntro(senderPsid) {
    let response = {
        text: `မင်္ဂလာပါရှင့် 🙏 Thailand Anywhere မှ ကြိုဆိုပါတယ်။ထိုင်းနိုင်ငံအတွင်း ခရီးသွားဝန်ဆောင်မှုနဲ့ ပတ်သတ်ပြီး ကူညီဖို့အသင့်ပါရှင့်။ Thailand Anywhere ၏ ဝန်ဆောင်မှုများအားလုံးကို သိရှိနိုင်ရန် အောက်တွင်ရွေးချယ်ပေးပါနော်။🙇`,
        quick_replies: [
            {
                content_type: "text",
                title: "Group Tour",
                payload: "GT",
            },
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
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, response);
}

async function ChoosePackages(senderPsid) {
    let response;
    // response = {
    //     text: "Thailand Anywhere မှ စီစဥ်ပေးထားသော အပတ်စဥ် စနေ ၊ တနင်္ဂ‌နွေနေ့တိုင်း ထွက်သော Group Tour ခရီးစဥ်များကို ကြည့်ရှုမည်။",
    // };
    let responseTwo = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: "Kanchanaburi",
                        image_url:
                            "http://thailandanywhere.npthosting.cyou/kanchanaburi/Caurosal-kanchanaburi.jpg",
                        subtitle: "Every Saturday at 7am\n1850฿ per Person",
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
                            "http://thailandanywhere.npthosting.cyou/khaoyai/Caurosal-khao%20yai.jpg",
                        subtitle: "Every Saturday at 7am\n1950฿ per Person",
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
                    {
                        title: "Pattya",
                        image_url:
                            "http://thailandanywhere.npthosting.cyou/pattaya/caurosal-pattaya.jpg",
                        subtitle: "Every Saturday at 7am\n1850฿ per Person",
                        buttons: [
                            {
                                type: "postback",
                                title: "Learn More",
                                payload: "PATTYA",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GROUP_TOUR_BAC3",
                            },
                        ],
                    },
                    {
                        title: "Ayutthaya",
                        image_url:
                            "http://thailandanywhere.npthosting.cyou/ayutthaya/caurosal-ayutthaya.jpg",
                        subtitle: "Every Saturday at 7am\n1850฿ per Person",
                        buttons: [
                            {
                                type: "postback",
                                title: "Learn More",
                                payload: "AYUTTHAYA",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GROUP_TOUR_BAC4",
                            },
                        ],
                    },
                ],
            },
        },
    };
    // sendTypingOn(senderPsid, "typing_on");
    // await callSendAPI(senderPsid, response);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseTwo);
    //   return true;
}
async function KanchanaburiImages(senderPsid) {
    let responseOne = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi/1.jpg",
            },
        },
    };
    let responseTwo = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi/2.jpg",
            },
        },
    };
    let responseThree = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi/3.jpg",
            },
        },
    };
    let responseFour = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi/4.jpg",
            },
        },
    };
    let responseFive = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi/5.jpg",
            },
        },
    };
    let responseSix = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi/6.jpg",
            },
        },
    };
    let responseSeven = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/kanchanaburi/7.jpg",
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
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseSix);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseSeven);
}
async function KhoyaiGroupTourImages(senderPsid) {
    let responseOne = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/khaoyai/1.jpg",
            },
        },
    };
    let responseTwo = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/khaoyai/2.jpg",
            },
        },
    };
    let responseThree = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/khaoyai/2-b.jpg",
            },
        },
    };
    let responseFour = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/khaoyai/3.jpg",
            },
        },
    };
    let responseFive = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/khaoyai/4.jpg",
            },
        },
    };
    let responseSix = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/khaoyai/5.jpg",
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
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseSix);
}
async function PattyaGroupTourImages(senderPsid) {
    let responseOne = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/1.jpg",
            },
        },
    };
    let responseTwo = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/2.jpg",
            },
        },
    };
    let responseThree = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/2a.jpg",
            },
        },
    };
    let responseFour = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/3.jpg",
            },
        },
    };
    let responseFive = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/4.jpg",
            },
        },
    };
    let responseSix = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/5.jpg",
            },
        },
    };
    let responseSeven = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/6.jpg",
            },
        },
    };
    let responseEight = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/pattaya/7.jpg",
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
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseSix);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseSeven);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseEight);
}
async function AyutthayaGroupTourImages(senderPsid) {
    let responseOne = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/ayutthaya/1.jpg",
            },
        },
    };
    let responseTwo = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/ayutthaya/2.jpg",
            },
        },
    };
    let responseThree = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/ayutthaya/3.jpgg",
            },
        },
    };
    let responseFour = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/ayutthaya/4.jpg",
            },
        },
    };
    let responseFive = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/ayutthaya/5.jpg",
            },
        },
    };
    let responseSix = {
        attachment: {
            type: "image",
            payload: {
                url: "http://thailandanywhere.npthosting.cyou/ayutthaya/6.jpg",
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
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseSix);
}
async function KanchanaburiGroupTour(senderPsid, receivedMessage) {
    let response;
    let responseOne = {
        text: "🌳🍀🚐🇹🇭🚐🌳The self-guided tour to Kanchanaburi is full of great sight-seeing activities and relaxing nature retreats. 🏞️ Our itinerary takes travelers to 6 of the best spots in Kanchanaburi. 📸 🤗 The self-guided group tour is a must buy for travelers looking to explore Kanchanaburi.\n\n--------------------------------------------------\n\nPrice: 1850 thb per person\n\n--------------------------------------------------\n\n🤩🤗 Package Inclusion:\n\n🎟️ Entrance fees for all activities,\n🚐 Luxury van transportation,\n🚲 Coffee at Chan Nature’s Cafe\n🥗 Lunch at Floating Ratch Restaurant\n🕒 12 to 13 hours    \n\n--------------------------------------------------\n\nTravel itinerary:\n\n📍Pick-up point: Platinum Mall at 7:00 a.m.\n📍First Stop: Wat Tham Suea\n📍Second Stop: Floating Ratch Restaurant\n📍Third Stop: River Kwai Bridge\n📍Fourth Stop: Saiyok Waterfall\n📍Fifth Stop: Chan Nature’s Cafe\n📍Sixth Stop: Giant Tree\n📍Drop-Off: Platinum Mall\n\n--------------------------------------------------\n\nBrief Summary:\n\nWat Tham Suea is an iconic pagoda with statues of Buddha hidden within a cave-like structure. 🏞️🍃Lunch at Floating Ratch Restaurant with a breath-taking view of River Kwai.🪴River Kwai Bridge was built during the World War II that took the lives of over 100,000 prisoners. Soak in the pleasant Saiyok Waterfall and travel to a picturesque margaret farm at Chan Nature’s Cafe. Last stop at Giant Tree, the largest tree you will probably see in your life time before heading back to Bangkok.\n\n--------------------------------------------------\n\nTerms and Conditions:\n\nTicket sales are closed 10 hours before departure of the trip. Customers pay a 10% deposit for confirmation of the trip. Trip requires a minimum of 4 travelers to depart. Full refund will be transferred if the trip does not meet the minimum number of passengers.\n\n--------------------------------------------------\n\nCancellation:\n\nFor full refund of deposit, customers need to cancel 48 hours before departure of the trip.",
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
                            "http://thailandanywhere.npthosting.cyou/kanchanaburi/Caurosal-kanchanaburi.jpg",
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
async function PattayaGroupTour(senderPsid, receivedMessage) {
    let response;
    let responseOne = {
        text: "🌳🍀🚐🇹🇭🚐🌳The self-guided tour to Pattaya is for those who love the sand and the beach. 🏞️ Our itinerary takes travelers to 6 exciting spots in Pattaya. 📸 🤗 This self-guided group tour is thrilling and relaxing.\n\n--------------------------------------------------\n\nPrice: 1850 thb per person\n\n--------------------------------------------------\n\n🤩🤗 Package Inclusion:\n\n🎟️ Entrance fees for all activities,\n🚐 Luxury van transportation,\n🥗 Lunch at Som Tan Pa Mon Restaurant\n🕒 12 to 13 hours\n\n--------------------------------------------------\n\nTravel itinerary:\n\n📍Pick-up point: Platinum Mall at 7:00 a.m.\n📍First Stop: Chonburi Skywalk\n📍Second Stop: Great & Grand\n📍Third Stop: Som Tan Pa Mon Restaurant\n📍Fourth Stop: Pattaya View Point\n📍Fifth Stop: Laser Buddha\n📍Sixth Stop: Pattaya Beach\n📍Drop-Off: Platinum Mall\n\n--------------------------------------------------\n\nBrief Summary:\n\nPattaya is a must-visit destination when in Thailand. Visit the glass skywalk that stands 25m above ground level and is 226m long. The hike upwards is simply picturesque with flowers and nature. Next is a visit to the Great & Grand theme park where ice creams and candy statues are larger than people! This is the perfect spot to take selfies! Lunch is served at Som Tan Pa Mon Restaurant. Later, the Pattaya View Point for 360 view of the city and Laser Buddha nearby for breath-taking and calming experience. Lastly, our visit to Pattaya Beach to take away your inner beach desires before heading back to Bangkok.\n\n--------------------------------------------------\n\nTerms and Conditions:\n\nTicket sales are closed 10 hours before departure of the trip. Customers pay a 10% deposit for confirmation of the trip. Trip requires a minimum of 4 travelers to depart. Full refund will be transferred if the trip does not meet the minimum number of passengers.\n\n--------------------------------------------------\nCancellation:\n\nFor full refund of deposit, customers need to cancel 48 hours before departure of the trip.",
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
                            "http://thailandanywhere.npthosting.cyou/pattaya/caurosal-pattaya.jpg",
                        buttons: [
                            {
                                type: "postback",
                                title: "Book Now",
                                payload: "CHOOSE_DAYANDTIME_PATTAYA",
                            },
                            {
                                type: "postback",
                                title: "Talk To Agent",
                                payload: "PATTAYA_DET_TALK_TO AGENT",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GB_PATTAYA",
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
async function KhaoyaiGroupTour(senderPsid, receivedMessage) {
    let response;
    let responseOne = {
        text: "🌳🍀🚐The Khao Yai group tour is refreshing, relaxing and soul cleansing. This group tour leaves every Sunday.\n\nOur best selling self-guided group tour to Khao Yai is a sight to be seen when visiting Thailand! Travelers experience picturesque scenes of nature, wild-life, culture and much more.\n\n--------------------------------------------------\n\nPrice: 1850 thb per person\n\n--------------------------------------------------\n\nPackage Inclusion:\n\n🎟️ Entrance fees for all activities,\n🚐 12 hours of trip with luxury van,\n🚲 Bicycle ride and\n🥗 Lunch at Timber Tales Restaurant\n🕒 Total trip hours are 12 to 13 hours\n\n--------------------------------------------------\n\nTravel itinerary:\n\n📍Pick-up point: Platinum Mall at 7:00 a.m.\n📍First Stop: Primo Piazza, Khao Yai\n📍Second Stop: Timber Tales Restaurant\n📍Third Stop: Pete Maze\n📍Fourth Stop: Khao Yai Thing\n📍Drop-Off: Platinum Mall\n\n--------------------------------------------------\n\nBrief Summary:\n\nThis day trip tour will take you to many breath-taking spots in Khao Yai. Our first stop is Primo Piazza 🏞️🐑🚐. A small Italian town in the middle of the mountains where you can enjoy the essence of Khao Yai city. 🏞️🍃🪴Pete Maze, another landmark of Khao Yai, where travelers will enter a maze made of trees. 🍀🚲🌫️🌬️Lastly, we will visit the famous Khao Yai Thiang, which has big white windmills, almost like in the Japanese Anime movie. Here our travelers are provided a free bike trip on the edge of the mountain.\n\n--------------------------------------------------\n\nTerms and Conditions:\n\nTicket sales are closed 10 hours before departure of the trip. Customers pay a 10% deposit for confirmation of the trip. Trip requires a minimum of 4 travelers to depart. Full refund will be transferred if the trip does not meet the minimum number of passengers.\n\n--------------------------------------------------\n\nCancellation:\n\nFor full refund of deposit, customers need to cancel 48 hours before departure of the trip.",
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
                            "http://thailandanywhere.npthosting.cyou/khaoyai/Caurosal-khao%20yai.jpg",
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
async function AyutthayaGroupTour(senderPsid, receivedMessage) {
    let response;
    let responseOne = {
        text: "🌳🍀🚐🇹🇭🚐🌳The self-guided tour to Ayutthaya is a step into history, heritage and marvelous architecture. 🏞️ Our itinerary takes travelers to 5 exciting spots in Ayutthaya and Nakhon Nayok. 📸 🤗 This self-guided group tour is historical and memorable.\n\n------------------------\n\nPrice: 1850 thb per person\n\n------------------------\n\n🤩🤗 Package Inclusion:\n\n🎟️ Entrance fees for all activities,\n🚐 Luxury van transportation,\n🥗 Lunch at Malakor Restaurant\n🕒 12 to 13 hours\n\n------------------------\n\nTravel itinerary:\n\n📍Pick-up point: Platinum Mall at 7:00 a.m.\n📍First Stop: Bang Pa-In Palace\n📍Second Stop: Wat Yai Chai Mongkhon\n📍Third Stop: Lunch at Malakor Restaurant\n📍Fourth Stop: Wat Phra Mahathat\n📍Fifth Stop: Wat Maniwong\n📍Drop-Off: Platinum Mall\n\n------------------------\n\nBrief Summary:\n\nHistory of Thailand is remarkably well preserved and in this tour, you will see it first-hand. Travelers visit Bang Pa-In Palace where the story of love, war and passion of ancient Thai kings are well documented. The palace is well-renowned globally and graceful. Then travelers stop at Wat Yai Chai Mongkhon pagoda that dates back to the 1900s. Structures here still remain intact today. An average of 4.3 stars (600+ reviews) makes Malakor Restaurant the perfect place to have lunch. Afterwards to a Temple that is believed to be one of Ayutthaya oldest; dating back to late 1300s. Last destination is perhaps one of the most iconic pagodas in Thailand, Wat Maniwong. It is full of dragon statues and treasures; a perfect place to take breath-taking photos.\n\n------------------------\n\nTerms and Conditions:\n\nTicket sales are closed 10 hours before departure of the trip. Customers pay a 10% deposit for confirmation of the trip. Trip requires a minimum of 4 travelers to depart. Full refund will be transferred if the trip does not meet the minimum number of passengers.\n\n------------------------\n\nCancellation:\n\nFor full refund of deposit, customers need to cancel 48 hours before departure of the trip.",
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
                            "http://thailandanywhere.npthosting.cyou/ayutthaya/caurosal-ayutthaya.jpg",
                        buttons: [
                            {
                                type: "postback",
                                title: "Book Now",
                                payload: "CHOOSE_DAYANDTIME_AYUTTHAYA_DET",
                            },
                            {
                                type: "postback",
                                title: "Talk To Agent",
                                payload: "AYUTTHAYA_DET_TALK_TO AGENT",
                            },
                            {
                                type: "postback",
                                title: "Go Back",
                                payload: "GB_AYUTTHAYA",
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
async function ChooseDateAndTimeForPattaya(senderPsid) {
    let responseOne = {
        text: "When would you like to book?",
        quick_replies: [
            {
                content_type: "text",
                title: "This Friday",
                payload: "THIS_F_PATTAYA",
            },
            {
                content_type: "text",
                title: "Next Friday",
                payload: "NEXT_F_PATTAYA",
            },
            {
                content_type: "text",
                title: "Future Dates",
                payload: "FUTURE_D_PATTAYA",
            },
            {
                content_type: "text",
                title: "Talk To Agent",
                payload: "TALK_TO_AGENT_PATTAYA",
            },
        ],
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
}
async function ChooseDateAndTimeForAyutthaya(senderPsid) {
    let responseOne = {
        text: "When would you like to book?",
        quick_replies: [
            {
                content_type: "text",
                title: "This Friday",
                payload: "THIS_F_AYUTTHAYA",
            },
            {
                content_type: "text",
                title: "Next Friday",
                payload: "NEXT_F_AYUTTHAYA",
            },
            {
                content_type: "text",
                title: "Future Dates",
                payload: "FUTURE_D_AYUTTHAYA",
            },
            {
                content_type: "text",
                title: "Talk To Agent",
                payload: "TALK_TO_AGENT_AYUTTHAYA",
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
        text: "Our travel assistant will get back to you as soon as possible. Thank you for your patience.",
    };
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
        payload === "THIS_F_KANCHANABURI" ||
        payload === "FUTURE_D_KANCHANABURI" ||
        payload === "NEXT_F_KANCHANABURI"
    ) {
        let responseOne = {
            text: "Please confirm your booking by paying 10% deposit. How would you like to Pay.",
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
                                "https://external.xx.fbcdn.net/emg1/v/t13/6971723891701891183?stp=dst-src&url=https%3A%2F%2Fwww.nttdata.com%2Fth%2Fen%2F-%2Fmedia%2Fnttdataapac%2Fndth%2Fservices%2Fcard-and-payment-services%2Fservices_card_and_payment_services_header_2732x1536_1.jpg%3Fh%3D1536%26iar%3D0%26w%3D2732%26rev%3Dcda4f237fa8c46248b1376544031309e&utld=nttdata.com&ccb=13-1&oh=06_AbGzI2TbbMy3TlKGdaLz-XQErRjw2x5Y3sXaJfut6rioYA&oe=63DD593E&_nc_sid=73babb",
                            subtitle: "Online",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Thai Bank",
                                    payload: "BANK_KANCHANABURI",
                                },
                                {
                                    type: "postback",
                                    title: "Cash",
                                    payload: "CASH_KANCHANABURI",
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
async function makingBookingKhaoYai(senderPsid, payload) {
    if (
        payload === "THIS_F_KHOYAI" ||
        payload === "NEXT_F_KHOYAI" ||
        payload === "FUTURE_D_KHOYAI"
    ) {
        let responseOne = {
            text: "Please confirm your booking by paying 10% deposit. How would you like to Pay.",
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
                                "https://external.xx.fbcdn.net/emg1/v/t13/6971723891701891183?stp=dst-src&url=https%3A%2F%2Fwww.nttdata.com%2Fth%2Fen%2F-%2Fmedia%2Fnttdataapac%2Fndth%2Fservices%2Fcard-and-payment-services%2Fservices_card_and_payment_services_header_2732x1536_1.jpg%3Fh%3D1536%26iar%3D0%26w%3D2732%26rev%3Dcda4f237fa8c46248b1376544031309e&utld=nttdata.com&ccb=13-1&oh=06_AbGzI2TbbMy3TlKGdaLz-XQErRjw2x5Y3sXaJfut6rioYA&oe=63DD593E&_nc_sid=73babb",
                            subtitle: "Choose Your Payment Method",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Thai Bank",
                                    payload: "BANK_KHAOYAI",
                                },
                                {
                                    type: "postback",
                                    title: "Cash",
                                    payload: "CASH_KHAOYAI",
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
async function makingBookingPhattaya(senderPsid, payload) {
    if (
        payload === "THIS_F_PATTAYA" ||
        payload === "NEXT_F_PATTAYA" ||
        payload === "FUTURE_D_PATTAYA"
    ) {
        let responseOne = {
            text: "Please confirm your booking by paying 10% deposit. How would you like to Pay.",
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
                                "https://external.xx.fbcdn.net/emg1/v/t13/6971723891701891183?stp=dst-src&url=https%3A%2F%2Fwww.nttdata.com%2Fth%2Fen%2F-%2Fmedia%2Fnttdataapac%2Fndth%2Fservices%2Fcard-and-payment-services%2Fservices_card_and_payment_services_header_2732x1536_1.jpg%3Fh%3D1536%26iar%3D0%26w%3D2732%26rev%3Dcda4f237fa8c46248b1376544031309e&utld=nttdata.com&ccb=13-1&oh=06_AbGzI2TbbMy3TlKGdaLz-XQErRjw2x5Y3sXaJfut6rioYA&oe=63DD593E&_nc_sid=73babb",
                            subtitle: "Choose Your Payment Method",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Thai Bank",
                                    payload: "BANK_PHATTAYA",
                                },
                                {
                                    type: "postback",
                                    title: "Cash",
                                    payload: "CASH_PHATTAYA",
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
async function makingBookingAyutthaya(senderPsid, payload) {
    if (
        payload === "THIS_F_AYUTTHAYA" ||
        payload === "NEXT_F_AYUTTHAYA" ||
        payload === "FUTURE_D_AYUTTHAYA"
    ) {
        let responseOne = {
            text: "Please confirm your booking by paying 10% deposit. How would you like to Pay.",
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
                                "https://external.xx.fbcdn.net/emg1/v/t13/6971723891701891183?stp=dst-src&url=https%3A%2F%2Fwww.nttdata.com%2Fth%2Fen%2F-%2Fmedia%2Fnttdataapac%2Fndth%2Fservices%2Fcard-and-payment-services%2Fservices_card_and_payment_services_header_2732x1536_1.jpg%3Fh%3D1536%26iar%3D0%26w%3D2732%26rev%3Dcda4f237fa8c46248b1376544031309e&utld=nttdata.com&ccb=13-1&oh=06_AbGzI2TbbMy3TlKGdaLz-XQErRjw2x5Y3sXaJfut6rioYA&oe=63DD593E&_nc_sid=73babb",
                            subtitle: "Choose Your Payment Method",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "Thai Bank",
                                    payload: "BANK_AYUTTHAYA",
                                },
                                {
                                    type: "postback",
                                    title: "Cash",
                                    payload: "CASH_AYUTTHAYA",
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
async function Payment(senderPsid) {
    let responseOne = {
        text: "Bank Name - KASIKORNBANK\n\nA/C NO. - 128-8-91451-2\n\nA/C Name - MR.THIHA@KUMAR BHUSAL",
    };
    let responseTwo = {
        text: "Please sent us the screenshots of payment receipt.Thank You!",
    };
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseOne);
    sendTypingOn(senderPsid, "typing_on");
    await callSendAPI(senderPsid, responseTwo);
}

// Handles messaging_postbacks events
async function handlePostback(senderPsid, receivedPostback) {
    let response;
    // console.log("Hello I am here");
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
    //Start Kha Yao Group Tour
    else if (payload === "KHAO") {
        await KhoyaiGroupTourImages(senderPsid);
        await KhaoyaiGroupTour(senderPsid);
    } else if (payload === "KHOYAI_DET_TALK_TO AGENT") {
        TalkToAgent(senderPsid);
    } else if (payload === "GB_KHOYAI") {
        ChoosePackages(senderPsid);
    } else if (payload === "CHOOSE_DAYANDTIME_KHOYAI_DET") {
        ChooseDateAndTimeForKhoYai(senderPsid);
    } else if (payload === "THIS_F_KHOYAI") {
        makingBookingKhaoYai(senderPsid, payload);
    } else if (payload === "NEXT_F_KHOYAI") {
        makingBookingKhaoYai(senderPsid, payload);
    } else if (payload === "FUTURE_D_KHOYAI") {
        ChooseDate(senderPsid);
        makingBookingKhaoYai(senderPsid, payload);
    } else if (payload === "TALK_TO_AGENT_KHOYAI") {
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
    } else if (payload === "GB_KAN") {
        ChoosePackages(senderPsid);
    }
    //Pattaya
    else if (payload === "PATTYA") {
        await PattyaGroupTourImages(senderPsid);
        await PattayaGroupTour(senderPsid);
    } else if (payload === "PATTAYA_DET_TALK_TO AGENT") {
        TalkToAgent(senderPsid);
    } else if (payload === "GB_PATTAYA") {
        ChoosePackages(senderPsid);
    } else if (payload === "CHOOSE_DAYANDTIME_PATTAYA") {
        ChooseDateAndTimeForPattaya(senderPsid);
    } else if (payload === "THIS_F_PATTAYA") {
        makingBookingPhattaya(senderPsid, payload);
    } else if (payload === "NEXT_F_PATTAYA") {
        makingBookingPhattaya(senderPsid, payload);
    } else if (payload === "FUTURE_D_PATTAYA") {
        ChooseDate(senderPsid);
        makingBookingPhattaya(senderPsid, payload);
    } else if (payload === "TALK_TO_AGENT_PATTAYA") {
        TalkToAgent(senderPsid);
    }
    // End Pattaya
    //Start Ayuttaya
    else if (payload === "AYUTTHAYA") {
        await AyutthayaGroupTourImages(senderPsid);
        await AyutthayaGroupTour(senderPsid);
    }
    else if (payload === "AYUTTHAYA_DET_TALK_TO AGENT") {
        TalkToAgent(senderPsid);
    } 
    else if (payload === "GB_AYUTTHAYA") {
        ChoosePackages(senderPsid);
    } 
    else if (payload === "CHOOSE_DAYANDTIME_AYUTTHAYA_DET") {
        ChooseDateAndTimeForAyutthaya(senderPsid);
    } 
    else if (payload === "THIS_F_AYUTTHAYA") {
        makingBookingAyutthaya(senderPsid, payload);
    } else if (payload === "NEXT_F_AYUTTHAYA") {
        makingBookingAyutthaya(senderPsid, payload);
    } else if (payload === "FUTURE_D_AYUTTHAYA") {
        ChooseDate(senderPsid);
        makingBookingAyutthaya(senderPsid, payload);
    } else if (payload === "TALK_TO_AGENT_AYUTTHAYA") {
        TalkToAgent(senderPsid);
    }
    // End Ayuttaya
    else if (payload === "AIR_TIC") {
        TalkToAgent(senderPsid);
    } else if (payload === "AIR_TIC") {
        TalkToAgent(senderPsid);
    } else if (payload === "AIR_TIC") {
        TalkToAgent(senderPsid);
    } else if (payload === "AIR_TIC") {
        TalkToAgent(senderPsid);
    }
    //Payment Group Tour
    else if (payload === "BANK_KHAOYAI") {
        Payment(senderPsid);
    }
    else if (payload === "BANK_KANCHANABURI") {
        Payment(senderPsid);
    }
    else if (payload === "BANK_PHATTAYA") {
        Payment(senderPsid);
    }
    else if (payload === "CASH_KHAOYAI") {
        TalkToAgent(senderPsid);
    }
    else if (payload === "CASH_KANCHANABURI") {
        TalkToAgent(senderPsid);
    }
    else if (payload === "CASH_PHATTAYA") {
        TalkToAgent(senderPsid);
    }
    //End Payment Group Tour
    // general
    else if (payload === "GET_STARTED") {
        await sendIntro(senderPsid);
    } else if (payload === "CARE_HELP") {
        await TalkToAgent(senderPsid);
    } else {
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
