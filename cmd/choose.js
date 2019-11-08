const helper = require("/app/helper");
const flex = require("/app/helper/flex");
const helperText = require("/app/helper/text");
const cards = require("/app/helper/cards");

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

  console.log(args);
  if (group_session.state === "idle" || group_session.state === "new") {
    return Promise.resolve(null);
  }

  let index = helper.indexOfPlayer(user_session, group_session);
  if (index === -1) {
    return Promise.resolve(null);
  }

  if (group_session.state !== "chooseCard") {
    return replyText(
      "💡 " + user_session.name + ", masih belum saatnya pilih kartu"
    );
  }

  if (group_session.players[index].health <= 0) {
    return replyText("💡 " + user_session.name + ", kamu sudah tereleminasi");
  }

  if (group_session.players[index].choose !== "pending") {
    return replyText("💡 " + user_session.name + ", kamu sudah memilih kartu");
  }
  
  for (let i = 0; i < cards.length; i++){
    if (cards[i].name === args[1]){
      group_session.players[index].cards.push(cards[i]);
      text += "💡 " + user_session.name + " berhasil memilih kartu " + cards[i].name;
      break;
    }
  }
  
  let pending = 0;
  for (let i = 0; i < group_session.players.length; i++) {
    if (
      group_session.players[i].health > 0 &&
      group_session.players[i].choose === "pending"
    ) {
      pending++;
    }
  }

  if (pending === 0) {
    let msg = { type: "text", text: text };
    preBattle([msg]);
  } else {
    saveGroupData();
    replyText(text);
  }
  
  function preBattle(msg) {
    group_session.state = "preBattle";
    group_session.round++;

    for (let i = 0; i < group_session.players.length; i++) {
      group_session.players[i].attack = "";
      group_session.players[i].attacker = [];
    }

    let preBattleFlexMsg = flex.getPreBattle(group_session);
    msg.push(preBattleFlexMsg);

    saveGroupData();

    client.replyMessage(event.replyToken, msg).catch(err => console.log(err));
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
