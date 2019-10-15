const reply = require("../api/reply");

function handle (event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  reply.regularFlex(event, flex_text);
}

module.exports = handle