const flex = require('/app/helper/flex');
function handle (client, event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "",
    body: ""
  }
  
  flex_text.header = "📚 Commands";
  
  let cmds = [
    "/new utk buat game baru", "/join utk join game yang sudah ada", "/cancel utk keluar dari game", "/stop utk stop game yang dibuat",
    "/player utk cek pemain yang bergabung", "/check utk cek status game yg sudah berjalan", "/info untuk cek profile user"
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