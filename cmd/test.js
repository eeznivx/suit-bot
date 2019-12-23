const flex = require("/app/helper/flex");
function handle(client, event, args, user_session, group_session) {
  let flex_text = {
    header: "",
    body: ""
  };

  //disable test
  return Promise.resolve(null)

  let dummy = {
    state: "preBattle",
    mode: "team",
    players: [
      {
        name: "sasa",
        attack: "",
        attacker: ["soso", "sisi"],
        health: 3,
        energy: 5,
        team: "A",
        killStreak: 2
      },
      {
        name: "soso",
        attack: "",
        attacker: [],
        health: 0,
        energy: 5,
        team: "A",
        killStreak: 2
      },
      {
        name: "sisi",
        attack: "",
        attacker: [],
        health: 3,
        energy: 5,
        team: "B",
        killStreak: 2
      },
      {
        name: "sese",
        attack: "",
        attacker: [],
        health: 3,
        energy: 5,
        team: "B",
        killStreak: 2
      }
    ],
    round: "77"
  };

  let detailDummy = [
    {
      type: "text",
      text: "sasa menyerang sisi",
      size: "md",
      wrap: true
    }
  ];

  let flexMsg = flex.getPreBattle(dummy);
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
