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
  
  let index = helper.indexOfPlayer(user_session, group_session);
  
  let flexMsg = flex.getBonus();
  
  if (group_session.players[index].perk === "") {
    client.replyMessage(event.replyToken, flexMsg);
  } else {
    let text = {
      type: "text",
      text: "Kamu menggunakan perk " + group_session.players[index].perk
    }
    client.replyMessage(event.replyToken, [text, flexMsg]);
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
