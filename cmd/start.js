const helper = require("/app/helper");
const flex = require("/app/helper/flex");
function handle (client, event, args, user_session, group_session){
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session === undefined){
    return Promise.resolve(null);
  }
  
  console.log(group_session);
  console.log(user_session);
 
  if (group_session.state !== "new"){
    if (group_session.state === "idle"){
      return replyText("💡 " + user_session.name + ", belum ada game yg dibuat. ketik '/new' utk buat");
    } else {
      return replyText("💡 " + user_session.name + ", game masih berjalan");
    }
  }
  
  if (helper.indexOfPlayer(user_session, group_session) === -1){
    return replyText("💡 " + user_session.name + ", kamu belum bergabung digame");
  }
  
  if (group_session.players.length < 2){
    return replyText("💡 " + user_session.name + ", minimal pemain sebanyak 2 orang");
  }
  
  
  let health = 0;
  
  ///check game mode
  if (group_session.mode === 'classic'){
    health = group_session.players.length;
  } else if (group_session.mode === 'team'){
    if (helper.isEven(group_session.players.length) === false){
      return replyText("💡 Game mode Team tidak bisa distart jika jumlah pemain ganjil");
    }
    
    helper.shuffleArray(group_session.players);
    
    let halfPlayersAmount = group_session.players.length/2;
    
    group_session.players.forEach((item, index) => {
      if (index >= halfPlayersAmount){
        item.team = 'B';
      } else {
        item.team = 'A';
      }
    })
    
    health = halfPlayersAmount + 1;
  }
  
  
  for (let i = 0; i < group_session.players.length; i++){
    group_session.players[i].health = health;
  }
  
  group_session.state = "preBattle";
  
  saveGroupData();
 
  var msg = flex.getPreBattle(group_session);
  client.replyMessage(event.replyToken, msg);
  
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