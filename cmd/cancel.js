const helper = require("../helper");

function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  };
  
  console.log(group_session);
  console.log(user_session);
  if (group_session.state !== "new") {
    if (group_session.state === "idle") {
      return replyText(
        "💡 belum ada game yg dibuat. ketik '/new' utk buat"
      );
    } else {
      return replyText("💡 game sedang berjalan");
    }
  }

  if (user_session.status !== "active") {
    return replyText('💡 ' + user_session.name + ", kmu tidak bergabung didalam game");
  }

  for (
    var i = helper.indexOfPlayer(user_session, group_session);
    i < group_session.players.length - 1;
    i++
  ) {
    group_session.players[i] = group_session.players[parseInt(i) + 1];
  }
  
  group_session.players.pop();
  user_session.status = "inactive";
  
  text += '💡 ' + user_session.name + " meninggalkan game";
  
  if (group_session.players.length === 0){
    group_session.state = "idle";
    text += "\n" + "💡 Game di stop karena tidak ada pemain lagi";
  }
  
  saveUserData();
  saveGroupData();
  
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
  
}

module.exports = handle;