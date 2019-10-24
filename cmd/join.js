function handle (client, event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  //console.log(group_session);
  if (group_session === undefined){
    return Promise.resolve(null);
  }
  console.log(group_session);
  console.log(user_session);
  if (group_session.state !== "new"){
    if (group_session.state === "idle"){
      return replyText('💡 ' + user_session.name + ", belum ada game yg dibuat. ketik '/new' utk buat");
    } else {
      return replyText('💡 ' + user_session.name + ", sedang ada game yang berjalan");
    }
  }
  
  
  if (user_session.status === "active"){
    if (user_session.groupId !== group_session.groupId){
      return replyText('💡 ' + user_session.name + ", kamu sedang bermain di group lain");
    } else {
      return replyText('💡 ' + user_session.name + ", kamu sudah bergabung");
    }
  }
  
  if (group_session.players.length === 8){
    return replyText('💡 ' + user_session.name + ', maaf max pemain hanya 8 pemain');
  }
  
  user_session.status = "active";
  user_session.groupId = group_session.groupId;
  
  saveUserData();
  
  var new_player = {
    id : user_session.id,
    name: user_session.name,
    killAmount: user_session.killAmount,
    batuAmount: user_session.batuAmount,
    guntingAmount: user_session.guntingAmount,
    kertasAmount: user_session.kertasAmount,
    attack : "",
    attacker: [],
    health: 0,
    killStreak: 0
  }
  
  if (group_session.mode === 'team'){
    new_player.team = '';
  }
  
  group_session.players.push(new_player);
  
  saveGroupData();
  
  replyText('💡 ' + user_session.name + " berhasil join game!");
 
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