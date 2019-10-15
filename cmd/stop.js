const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");

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
 
  if (group_session.state === "idle"){
    return reply.text(event, "tidak ada game yang berjalan");
  }
  
  group_session.state = "idle";
  data.resetAllPlayers(group_session.players);
  group_session.players.length = 0;
  data.saveGroupData(group_session);
  
  text += "game di stop " + user_session.name;
  reply.text(event, text);
}

module.exports = handle