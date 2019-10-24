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
    state : 'preBattle',
    mode: 'team',
    players : [
      {
        name: 'sasa',
        attack: 'gunting',
        attacker: ['soso', 'sisi'],
        health: 3,
        team: 'A',
        killStreak: 2
      },
      {
        name: 'soso',
        attack: 'gunting',
        attacker: [],
        health: 0,
        team: 'A',
        killStreak: 2
      },
      {
        name: 'sisi',
        attack: 'gunting',
        attacker: [],
        health: 3,
        team: 'B',
        killStreak: 2
      },
      {
        name: 'sese',
        attack: 'gunting',
        attacker: [],
        health: 3,
        team: 'B',
        killStreak: 2
      }
    ]
  }
  
  let flexMsg = flex.getPlayerList(dummy, "lalla");
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
