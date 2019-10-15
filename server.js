// init project
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(event => handle(event)))
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
    });
});

function handle(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  if (event.message.text.startsWith("/")) {
    var args = event.message.text.substr(1).split(" ");
    
    const data = require("./src/data");
    
    data.receive(event, args);
  }
}

// listen for requests :)
app.listen(3000, () => {
  console.log("Your app is listening on port 3000");
});
