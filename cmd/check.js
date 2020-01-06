const flex = require("/app/helper/flex");
const helper = require("/app/helper");
function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "⏳ Pemain Pending",
    body: ""
  };

  let pending = [];

  if (group_session.state === "idle" || group_session.state === "new") {
    return Promise.resolve(null);
  }
  
  if (group_session.time > 0){
    return showPending();
  } else {
    let afk = [];
    group_session.players.forEach((item, index) => {
      if (item.health > 0 && item.attack === ""){
        autoAttack(item);
        afk.push(item.name);
      }
    });
    let msg = {
      type: "text",
      text: "⏳ Pemain Afk" + "\n"
    }
    msg.text += afk.join(", ");
    const battle = require("/app/src/suit");
    return battle(client, event, args, user_session, group_session, [msg]);
  }

  function showPending(){
    for (let i = 0; i < group_session.players.length; i++) {
      if (
        group_session.players[i].health > 0 &&
        group_session.players[i].attack === ""
      ) {
        pending.push(group_session.players[i].name);
      }
    }

    flex_text.body = pending.join(", ");

    let flexMsg = flex.getFlex(flex_text);

    let multiMsg = [];

    let preBattleFlex = flex.getPreBattle(group_session);
    
    let opt_text = {
      type: "text",
      text: "⏳ Sisa waktu " + group_session.time + " detik"
    }
    
    multiMsg.push(opt_text, flexMsg, preBattleFlex);
    return client.replyMessage(event.replyToken, multiMsg);
  }

  function replyText(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
  
  function autoAttack(player){
    let attacks = ["batu", "gunting", "kertas"];
    let attack = helper.random(attacks);
    player.attack = attack;
  }
  
  function saveGroupData(){
    const data = require("/app/src/data");
    data.saveGroupData(group_session);
  }
}

module.exports = handle;
