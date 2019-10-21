const helper = require('/app/helper/flex');
function handle (client, event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session === undefined){
    return replyText("mainkan di group/room chat kamu");
  }
  console.log(group_session);
  console.log(user_session);
  if (group_session.state !== "idle"){
    if (group_session.state === "new"){
      return replyText("sudah ada game yang dibuat, ketik '/join' untuk gabung");
    } else {
      return replyText("sedang ada game yang berjalan");
    }
  }
  
  group_session.state = "new";
  // group_session.players = [];
  saveGroupData();
  
  let flex_msg = helper.getNewGame();
  return client.replyMessage(event.replyToken, flex_msg);
  
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