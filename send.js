require("dotenv").config();


module.exports.sendText = ({ recipient_id, message }) => {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    let requestBody = {
        recipient: {
            id: recipient_id,
        },
        message: message,
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
};
