// init project
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new line.Client(config);

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(err);
  })
})

function handleEvent(event){
           
}

// listen for requests :)
app.listen(3000, () => {
  console.log("Your app is listening on port 3000");
});