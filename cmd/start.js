const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");
const client = require("../src/client");

function handle (event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session === undefined){
    return Promise.resolve(null);
  }
  console.log(group_session);
  console.log(user_session);
 
  if (group_session.state !== "new"){
    if (group_session.state === "idle"){
      return reply.text(event, "belum ada game yg dibuat. ketik '/new' utk buat");
    } else {
      return reply.text(event, "game masih berjalan");
    }
  }
  
  if (helper.indexOfPlayer(user_session, group_session) === -1){
    return reply.text(event, user_session.name + ", kamu belum bergabung digame");
  }
  
  if (group_session.players.length < 2){
    return reply.text(event, "minimal pemain sebanyak 2 orang");
  }
  
  let health = group_session.players.length * 2;
  for (let i = 0; i < group_session.players.length; i++){
    group_session.players[i].health = health;
    group_session.players[i].attacker = [];
  }
  
  group_session.state = "preBattle";
  
  data.saveGroupData(group_session);
 
  var msg = reply.preBattleFlex(event, group_session);
  client.replyMessage(event.replyToken, msg);
}

module.exports = handle