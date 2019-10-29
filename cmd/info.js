const flex = require("/app/helper/flex");
function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "",
    body: ""
  };

  let mostUsedAttack = "";
  let mostUsedAttackAmount = 0;
  let emoji = "";

  let max = 0;

  let attacksArr = [
    {
      name: "batu",
      value: user_session.batuAmount,
      emoji: "👊 "
    },
    {
      name: "gunting",
      value: user_session.guntingAmount,
      emoji: "✌️ "
    },
    {
      name: "kertas",
      value: user_session.kertasAmount,
      emoji: "✋ "
    }
  ];

  for (let i = 0; i < attacksArr.length; i++) {
    if (attacksArr[i].value > max) {
      max = attacksArr[i].value;
      mostUsedAttack = attacksArr[i].name;
      mostUsedAttackAmount = attacksArr[i].value;
      emoji = attacksArr[i].emoji;
    }
    console.log("dalam loop mostUsedAttack", mostUsedAttack);
  }

  flex_text.header = "Profile " + user_session.name;

  flex_text.body += "Total Kill : " + user_session.killAmount;

  console.log("luar loop mostUsedAttack", mostUsedAttack);

  if (max !== 0) {
    flex_text.header = emoji + "Profile " + user_session.name;
    flex_text.body += "\n" + "Fave Attack : " + mostUsedAttack;
    flex_text.body += "\n" + "Dipakai " + mostUsedAttackAmount + " kali";
  }

  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);

  Array.max = function(array) {
    return Math.max.apply(Math, array);
  };
}

module.exports = handle;
