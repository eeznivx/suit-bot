const helper = require("/app/helper");
const flex = require("/app/helper/flex");
const helperText = require("/app/helper/text");

function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "",
    body: ""
  };

  let opt_text = {
    type: "text",
    text: ""
  };

  if (group_session.state === "idle" || group_session.state === "new") {
    return Promise.resolve(null);
  }

  let index = helper.indexOfPlayer(user_session, group_session);
  if (index === -1) {
    return Promise.resolve(null);
  }

  if (group_session.state !== "preBattle") {
    // return replyText(
    //   "💡 " + user_session.name + ", masih belum saatnya attack"
    // );
    return Promise.resolve(null);
  }

  if (group_session.players[index].health <= 0) {
    return replyText("💡 " + user_session.name + ", kamu sudah tereleminasi");
  }

  if (group_session.players[index].attack !== "") {
    // return replyText("💡 " + user_session.name + ", kamu sudah memilih attack");
    return Promise.resolve(null);
  } else {
    text += "💡 " + user_session.name + " berhasil memilih attack";
  }

  group_session.players[index].attack = args[1];
  
  saveGroupData();

  let pending = 0;
  for (let i = 0; i < group_session.players.length; i++) {
    if (
      group_session.players[i].health > 0 &&
      group_session.players[i].attack === ""
    ) {
      pending++;
    }
  }

  if (pending === 0) {
    let msg = { type: "text", text: text };
    const battle = require("/app/src/suit");
    return battle(client, event, args, user_session, group_session, [msg]);
  } else {
    //saveGroupData();
    return replyText(text);
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
