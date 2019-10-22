const helper = require("/app/helper");
const flex = require("/app/helper/flex");

function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  };
  console.log(args);
  if (group_session.state === "idle" || group_session.state === "new") {
    return Promise.resolve(null);
  }

  let index = helper.indexOfPlayer(user_session, group_session);
  if (index === -1) {
    return Promise.resolve(null);
  }

  if (group_session.state !== "preBattle") {
    return replyText(user_session.name + ", masih belum saatnya attack");
  }
  
  if (group_session.players[index].health <= 0){
    return replyText(user_session.name + ', kamu sudah tereleminasi');
  }
  
  if (group_session.players[index].attack !== ''){
    //text += user_session.name + " mengganti attacknya";
    return replyText(user_session.name + ', kamu sudah memilih attack');
  } else {
    text += user_session.name + " berhasil memilih attack";
  }
  
  group_session.players[index].attack = args[1];
  
  let pending = 0;
  for (let i = 0; i < group_session.players.length; i++) {
    if (group_session.players[i].health > 0 && group_session.players[i].attack === "") {
      pending++;
    }
  }

  if (pending === 0) {
    let msg = { type: "text", text: text };
    battle([msg]);
  } else {
    saveGroupData();
    replyText(text);
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

  function battle(msg) {
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].attack !== "") {
        console.log('ini i ', group_session.players[i]);
        var attacker = group_session.players[i].id;
        
        let targets = [];
        let targetIndex = -1;
        for (let u = 0; u < group_session.players.length; u++) {
           var victim = group_session.players[u].id;
          
          console.log('ini u', group_session.players[u]);
          if (attacker !== victim && group_session.players[u].attack !== "") {
            if (
              group_session.players[i].attack === "batu" &&
              group_session.players[u].attack === "gunting"
            ) {
              targets.push(group_session.players[u].id);
            } else if (
              group_session.players[i].attack === "gunting" &&
              group_session.players[u].attack === "kertas"
            ) {
              targets.push(group_session.players[u].id);
            } else if (
              group_session.players[i].attack === "kertas" &&
              group_session.players[u].attack === "batu"
            ) {
              targets.push(group_session.players[u].id);
            }
          }
          console.log('ini targets', targets)
          if (targets.length !== 0) {
            targetIndex = helper.getPlayerById(
              helper.random(targets),
              group_session
            );
            group_session.players[targetIndex].health--;
            group_session.players[targetIndex].attacker.push(group_session.players[i].name);
            targets.length = 0;
          }
        }
      }
    }
    
    let postBattleFlex = flex.getPostBattle(group_session);
    msg.push(postBattleFlex);

    let alive = 0;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].health > 0) {
        alive++;
      }
    }
    
    console.log('yang alive', alive)

    if (alive === 1) {
      for (let i = 0; i < group_session.players.length; i++) {
        if (group_session.players[i].health > 0) {
          let winner_index = i;
          console.log('winner index', i)
          return endgame(msg, winner_index);
        }
      }
    } else if (alive === 0) {
      // draw?
      drawgame(msg);
    } else {
      // ke preBattle
      group_session.state = "preBattle";
      
      return preBattle(msg);
    }
  }

  function endgame(msg, winner_index) {
    console.log("ini diendgame");
    let winnerName = group_session.players[winner_index].name;
    let headerText = "Pemenangnya adalah " + winnerName;
    let endGameFlex = flex.getEndGame(group_session, headerText);
      
    msg.push(endGameFlex);

    group_session.state = "idle";
    resetAllPlayers(group_session.players);
    group_session.players.length = 0;
    saveGroupData();
    client.replyMessage(event.replyToken, msg);
  }
  
  function drawgame(msg) {
    console.log("ini draw game");
    let headerText = "Game Draw bois";
    let endGameFlex = flex.getEndGame(group_session, headerText);
      
    msg.push(endGameFlex);

    group_session.state = "idle";
    resetAllPlayers(group_session.players);
    group_session.players.length = 0;
    saveGroupData();
    client.replyMessage(event.replyToken, msg);
  }

  function preBattle(msg) {
    let preBattleFlexMsg = flex.getPreBattle(group_session);
    msg.push(preBattleFlexMsg);

    for (let i = 0; i < group_session.players.length; i++) {
      group_session.players[i].attack = "";
      group_session.players[i].attacker = [];
    }

    saveGroupData();

    client.replyMessage(event.replyToken, msg).catch((err) => console.log(err));
  }

  function resetAllPlayers(players) {
    const data = require("/app/src/data");
    data.resetAllPlayers(players);
  }
}

module.exports = handle;
