const keywords = require("./keywords");

function receive(event, args, user_session, group_session){
  for (let i = 0; i < keywords.length; i++){
    if (keywords[i].text === args[0]){
      return keywords[i].handle(event, args, user_session, group_session);
    }
  }
}

module.exports = receive