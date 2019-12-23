const helper = require("/app/helper");
const flex = require("/app/helper/flex");
const helperText = require("/app/helper/text");

function handle(client, event, args, user_session, group_session) {
  let flex_text = {
    header: "",
    body: ""
  };
  
  if (group_session.state !== "preBattle"){
    return Promise.resolve(null);
  }
  
  let players = group_session.players;
  let index = helper.indexOfPlayer(user_session, group_session);
  
  let flexMsg = flex.getBuff();
  
  flex_text.header = "Player Info";
  flex_text.body = "❤️ Health : " + players[index].health + "\n";
  flex_text.body += "⚡ Energy : " + players[index].energy + "\n";
  flex_text.body += "🎯 Damage : " + players[index].damage;
  
  if (players[index].buff.name !== ""){
    flex_text.body += "\n" + "🌀 Buff : " + players[index].buff.name + "\n";
    flex_text.body += "🌀 Buff Duration : " + players[index].buff.duration + " round";
  }
  
  let playerInfo = flex.getFlex(flex_text);
  
  if (group_session.players[index].buff.name === "") {
    client.replyMessage(event.replyToken, [playerInfo, flexMsg]);
  } else {
    client.replyMessage(event.replyToken, playerInfo);
  }

  function saveUserData() {
    const data = require("/app/src/data");
    data.saveUserData(user_session);
  }

  function saveGroupData() {
    const data = require("/app/src/data");
    data.saveGroupData(group_session);
  }

  function replyText(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
}

module.exports = handle;
