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
  
  if (players[index].buff.name !== ""){
    return replyText("🌀 Buff " + players[index].buff.name + " kamu masih aktif.");
  }
  
  let buff = args[1];
  let buffCost = 0;
  
  if (buff !== undefined){
    group_session.players[index].buff.name = buff;
  }
  
  switch(buff){
    case "lifesteal":
      group_session.players[index].buff.duration = 3;
      buffCost = 5;
      
      flex_text.header = "❤️ Lifesteal";
      flex_text.body = "Setiap hit yang berhasil, maka akan menambah 1 ❤️" + "\n";
      flex_text.body += "⚡ Cost : " + buffCost + "\n";
      flex_text.body += "⌛ : 3 round";
      break;
      
    case "enhance-damage":
      group_session.players[index].buff.duration = 3;
      buffCost = 5;
      
      flex_text.header = "🎯 Enhance Damage";
      flex_text.body = "Setiap hit akan bertambah 1 damage" + "\n";
      flex_text.body += "⚡ Cost : " + buffCost + "\n";
      flex_text.body += "⌛ : 3 round";
      break;
      
    default:
      let getBuff = flex.getBuff(players[index]);
      return client.replyMessage(event.replyToken, getBuff);
  }
  
  if (args[2] === "set"){
    //berarti dia set
    let playerEnergy = group_session.players[index].energy;
    
    if (playerEnergy < buffCost){
      return replyText("⚡ Energy kamu tidak cukup.");
    }
    
    group_session.players[index].energy -= buffCost;
    
    group_session.players[index].buff.justUsed = true;
    
    saveGroupData();
    return replyText("🌀 Kamu memilih buff " + buff);
  } else {
    
    let flexMsg = flex.getChooseBuff(flex_text, buff);
    client.replyMessage(event.replyToken, flexMsg);
  }
  
  function saveGroupData(){
    const data = require("/app/src/data");
    data.saveGroupData(group_session);
  }
  
  function replyText(text){
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: text
    });
  }
  
}

module.exports = handle