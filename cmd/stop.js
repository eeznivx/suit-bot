const helper = require("/app/helper");
function handle (client, event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session === undefined){
    return Promise.resolve(null);
  }
  console.log(group_session);
  console.log(user_session);
 
  if (group_session.state === "idle"){
    return replyText("tidak ada game yang berjalan");
  }
  
  if (helper.indexOfPlayer(user_session, group_session) === -1){
    return replyText(user_session.name + ", kamu belum bergabung digame");
  }
  
  group_session.state = "idle";
  resetAllPlayers(group_session.players);
  group_session.players.length = 0;
  saveGroupData();
  
  text += "game di stop " + user_session.name;
  replyText(text);
  
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
  
  function resetAllPlayers(players){
    const data = require('/app/src/data');
    data.resetAllPlayers(players);
  }
  
}

module.exports = handle