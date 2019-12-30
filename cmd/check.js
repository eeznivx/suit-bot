const flex = require("/app/helper/flex");
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
  multiMsg.push(flexMsg, preBattleFlex);
  client.replyMessage(event.replyToken, multiMsg);

  function replyText(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
}

module.exports = handle;
