const reply = require("../api/reply");
const data = require("../src/data");

function handle (event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session === undefined){
    return reply.text(event, "mainkan di group/room chat kamu");
  }
  console.log(group_session);
  console.log(user_session);
  if (group_session.state !== "idle"){
    if (group_session.state === "new"){
      return reply.text(event, "sudah ada game yang dibuat, ketik '/join' untuk gabung");
    } else {
      return reply.text(event, "sedang ada game yang berjalan");
    }
  }
  
  group_session.state = "new";
  data.saveGroupData(group_session);
  reply.newGameFlex(event, group_session);
}

module.exports = handle