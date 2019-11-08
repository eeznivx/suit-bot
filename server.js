// init project
const line = require("@line/bot-sdk");
const express = require("express");
const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);

app.post("/callback", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(event => handle(event)))
    .then(result => res.json(result))
    .catch(err => {
      console.log(err);
    });
});

function handle(event) {
  // if (event.source.type === "group") {
  //   client.leaveGroup(event.source.groupId);
  // } else if (this.event.source.type === "room") {
  //   client.leaveRoom(event.source.roomId);
  // }

  const data = require("./src/data");

  if (event.type === "postback") {
    var args = event.postback.data.substr(1).split(" ");
    return data.receive(client, event, args);
  }

  //handle event follow sama member join
  if (
    event.type === "follow" ||
    event.type === "join" ||
    event.type === "memberJoined" ||
    event.type === "memberLeft"
  ) {
    const other = require("./src/other");
    return other.receive(client, event);
  }

  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  if (event.message.text.startsWith("/")) {
    var args = event.message.text.substr(1).split(" ");
    data.receive(client, event, args);
  }
}

// listen for requests :)
app.listen(3000, () => {
  console.log("Your app is listening on port 3000");
});
