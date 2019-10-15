const reply = require("../api/reply");
const data = require("../src/data");

function handle (event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  reply.preBattleFlex(event, group_session);
}

module.exports = handle