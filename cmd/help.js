function handle (client, event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  
  function test(){
    console.log(user_session);
  }
  
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