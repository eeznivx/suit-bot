const flex = require("/app/helper/flex");
function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "",
    body: ""
  };

  let mostUsedAttack = "";
  let emoji = '';
  
  let max = -1;

  let attacksArr = [
    {
      name: 'batu',
      value: user_session.batuAmount,
      emoji: '✊ '
    },
    {
      name: 'gunting',
      value: user_session.guntingAmount,
      emoji: '✌️ '
    },
    {
      name: 'kertas',
      value: user_session.kertasAmount,
      emoji: '✋ '
    }
  ];

  for (let i = 0; i < attacksArr.length; i++) {
    if (attacksArr[i].value > max) {
      max = attacksArr[i].value;
      mostUsedAttack = attacksArr[i].name;
      emoji = attacksArr[i].emoji
    }
  }
  
  flex_text.header = "Profile " + user_session.name;

  flex_text.body += "Total Kill : " + user_session.killAmount;
  
  if (max !== -1){
    flex_text.header = emoji + "Profile " + user_session.name;
    flex_text.body += '\n' + "Fave Attack : " + mostUsedAttack;
  }

  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);

  Array.max = function(array) {
    return Math.max.apply(Math, array);
  };

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
