const flex = require('/app/helper/flex');
function handle (client, event, args, user_session){
  let flex_text = {
    header: "",
    body: ""
  }
  
  flex_text.header = "👊✌️✋";
  flex_text.body += "Bot Suit ini diadaptasi dari game Rock Paper Scissor, ";
  flex_text.body += "dimana pemain bisa melawan pemain lain dengan serangan yang sudah dipilih. ";
  flex_text.body += "Terima kasih untuk grup Avalon City, RANDOM, LOW, dan semua pemain" + '\n';
  flex_text.body += "-Eriec (Creator)";
  
  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);  
}

module.exports = handle