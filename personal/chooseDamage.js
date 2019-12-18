const helper = require("/app/helper");
const flex = require("/app/helper/flex");
const helperText = require("/app/helper/text");

function handle (client, event, args, user_session, group_session){
  let flex_text = {
    header: "",
    body: ""
  }
  
  let index = helper.indexOfPlayer(user_session, group_session);
  let players = group_session.players;
  
  if (group_session.state !== "preBattle"){
    return Promise.resolve(null);
  }
  
  group_session.players[index].perk = "damage";
  
  saveGroupData();
  
  
  
  //end
  
  flex_text.header = "🎯 Damage Perk";
  
  flex_text.body = "Kamu memilih Perk Damage, setiap kamu kill pemain, damage kamu bertambah 1";
  flex_text.body += "\nKamu bisa ganti perk lagi, tetapi harus pada saat awal round";
  
  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);
  
  function saveGroupData(){
    const data = require("/app/src/data");
    data.saveGroupData(group_session);
  }
  
}

module.exports = handle