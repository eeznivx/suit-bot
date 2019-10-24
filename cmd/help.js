const flex = require('/app/helper/flex');
function handle (client, event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "",
    body: ""
  }
  
  flex_text.header = "🧭 Help";
  
  let helps = [
    "Batu menang vs Gunting", "Gunting menang vs Kertas", "Kertas menang vs Batu",
    "Untuk daftar perintah bisa ketik /cmd"
  ]
  
  let num = 1;
  helps.forEach((item, index) => {
    flex_text.body += num + '. ' + item;
    
    if (index !== helps.length-1){
      flex_text.body += '\n';
      num++;
    }
    
  })
  
  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);

  function saveUserData(){
    const data = require("/app/src/data");
    data.saveUserData(user_session);
  }
  
  function saveGroupData(){
    const data = require("/app/src/data");
    data.saveGroupData(group_session);
  }
  
  function replyText(texts){
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
  
  
}

module.exports = handle