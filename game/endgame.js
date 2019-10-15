const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");
const game = require("./index");
const client = require("../src/client");

function handle (event, msg, group_session, winner_index){
  let opt_text = {
    type: "text",
    text: ""
  }
  
  opt_text.text += "Pemenangnya adalah " + group_session.players[winner_index].name;
  msg.push(opt_text);
  
  group_session.state = "idle";
  data.resetAllPlayers(group_session.players);
  group_session.players.length = 0;
  data.saveGroupData(group_session);
  client.replyMessage(event.replyToken, msg);
}

module.exports = handle