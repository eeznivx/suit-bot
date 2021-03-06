const keywords = require("./keywords");

function receive(client, event, args, user_session, group_session){
  for (let i = 0; i < keywords.length; i++){
    if (keywords[i].text === args[0].toLowerCase()){
      return keywords[i].handle(client, event, args, user_session, group_session);
    }
  }
  
  replyText("💡 Commands yang diberikan salah, cek daftar commands di /cmd");
  
  function replyText(texts){
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
  
}

module.exports = receive