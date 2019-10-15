const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");
const game = require("./index");
const client = require("../src/client");

function handle(event, msg, group_session) {
  
  msg.push(reply.preBattleFlex(event, group_session));
  
  for (let i = 0; i < group_session.players.length; i++){
    group_session.players[i].attackResult = "";
    group_session.players[i].attack = "pending";
    group_session.players[i].attacker = [];
  }
  
  data.saveGroupData(group_session);
  
  client.replyMessage(event.replyToken, msg);
}

module.exports = handle;
