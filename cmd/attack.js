const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");

function handle (event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session.state === "idle" || group_session.state === "new"){
    return Promise.resolve(null);
  }
  
  let index = helper.indexOfPlayer(user_session, group_session);
  if (index === -1){
    return Promise.resolve(null);
  }
  
  if (group_session.state !== "preBattle"){
    return reply.text(event, user_session.name + ", masih belum saatnya attack");
  }
  
  group_session.players[index].attack = "done";
  group_session.players[index].attackResult = args[1];
  
  text += user_session.name + ", berhasil memilih attack"
  
  let pending = 0;
  for (let i = 0; i < group_session.players.length; i++){
    if (group_session.players[i].attack === "pending"){
      pending++;
    }
  }
  
  if (pending === 0){
    group_session.state = "battle";
    data.saveGroupData(group_session);
    const game = require("../game");
    var msg = [{type: "text", text: text}];
    game(event, msg, group_session);
  } else {
    data.saveGroupData(group_session);
    reply.text(event, text);
  }
}

module.exports = handle