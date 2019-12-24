const flex = require('/app/helper/flex');
function handle (client, event, args, user_session, group_session){
  let flex_text = {
    header: "",
    body: ""
  }
  
  flex_text.header = "📚 Commands";
  
  let cmds = [
    "/buff untuk memperkuat player dengan menggunakan energy", "/help untuk bantuan game",
    "/info beri info pemain", "/about info tentang game"
  ]
  
  let num = 1;
  cmds.forEach((item, index) => {
    flex_text.body += num + '. ' + item;
    
    if (index !== cmds.length-1){
      flex_text.body += '\n';
      num++;
    }
    
  })
  
  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);
}

module.exports = handle