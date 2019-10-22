const flex = require("/app/helper/flex");
function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "",
    body: ""
  };
  
  //disable test
  return Promise.resolve(null)
  
  let dummy = {
    players : [
      {
        name: 'sasa',
        attack: 'batu',
        attacker: ['soso', 'sisi'],
        health: 3
      },
      {
        name: 'soso',
        attack: 'kertas',
        attacker: [],
        health: 3
      },
      {
        name: 'sisi',
        attack: 'kertas',
        attacker: [],
        health: 3
      }
    ]
  }
  
  let flexMsg = flex.getPlayerList(dummy);
  console.log(JSON.stringify(flexMsg.contents));
  client.replyMessage(event.replyToken, flexMsg);

  function replyText(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
}

module.exports = handle;
