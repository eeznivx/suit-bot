const helper = require("/app/helper");
const flex = require("/app/helper/flex");
const helperText = require("/app/helper/text");

function handle(client, event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "",
    body: ""
  };

  let opt_text = {
    type: "text",
    text: ""
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
    return replyText('💡 ' + user_session.name + ", masih belum saatnya attack");
  }

  if (group_session.players[index].health <= 0) {
    return replyText('💡 ' + user_session.name + ", kamu sudah tereleminasi");
  }

  if (group_session.players[index].attack !== "") {
    return replyText('💡 ' + user_session.name + ", kamu sudah memilih attack");
  } else {
    text += '💡 ' + user_session.name + " berhasil memilih attack";
  }

  group_session.players[index].attack = args[1];
  
  switch(args[1]){
    case 'batu':
      group_session.players[index].batuAmount++;
      break;
      
    case 'gunting':
      group_session.players[index].guntingAmount++;
      break;
      
    case 'kertas':
      group_session.players[index].kertasAmount++;
      break;
  }

  let pending = 0;
  for (let i = 0; i < group_session.players.length; i++) {
    if (
      group_session.players[i].health > 0 &&
      group_session.players[i].attack === ""
    ) {
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
      //targets cuma bisa direset pas ganti attacker
      var targets = [];
      var targetIndex = -1;

      if (group_session.players[i].attack !== "") {
        for (let u = 0; u < group_session.players.length; u++) {
          var attackerId = group_session.players[i].id;
          console.log("attackerId", attackerId);
          var victimId = group_session.players[u].id;
          console.log("victimId", victimId);

          var attackerAttack = group_session.players[i].attack;
          console.log("attackerAttack", attackerAttack);
          var victimAttack = group_session.players[u].attack;
          console.log("victimAttack", victimAttack);

          if (attackerId === victimId) {
            console.log("attacker id sama victim id sama, skipkan");
            continue;
          }

          if (victimAttack !== "") {
            if (attackerAttack === "batu" && victimAttack === "gunting") {
              targets.push(group_session.players[u].id);
            } else if (
              attackerAttack === "gunting" &&
              victimAttack === "kertas"
            ) {
              targets.push(group_session.players[u].id);
            } else if (attackerAttack === "kertas" && victimAttack === "batu") {
              targets.push(group_session.players[u].id);
            }
          }
        }

        console.log("ini targets", targets);

        if (targets.length !== 0) {
          targetIndex = helper.getPlayerById(
            helper.random(targets),
            group_session
          );
          console.log(
            "target yang kenak ",
            group_session.players[targetIndex].name
          );
          group_session.players[targetIndex].health--;
          group_session.players[targetIndex].attacker.push(
            group_session.players[i].name
          );

          //kasih header special
          if (group_session.players[targetIndex].health === 0) {
            group_session.players[i].killStreak++;
            
            var attackerName = group_session.players[i].name;
            var attackerStreak = group_session.players[i].killStreak;
            var victimName = group_session.players[targetIndex].name;

            // opt_text[i] = {
            //   type: 'text',
            //   text: attackerName + ' mengeleminasi ' + victimName + '!'
            // }

            let eliminatedText = helperText.eliminated(attackerName, args[1], victimName);
            console.log('eliminated text' , eliminatedText);
            // body: '🎯 ' + attackerName + " mengeleminasi " + victimName + "!"
            
            flex_text[i] = {
              header: "🔥 Spotlight 🔥",
              body: '🎯 ' + eliminatedText
            };
            
            if (group_session.players[targetIndex].killStreak > 1){
              flex_text[i].body +=
                "\n" + '💀 ' + victimName + " get rekt by " + attackerName + "!";
            }

            if (group_session.players[i].killStreak > 1) {
              // opt_text[i].text += '\n' + attackerName + ' dapat ' + attackerStreak + ' streak!';
              flex_text[i].body +=
                "\n" + '🔥 ' + attackerName + " dapat " + attackerStreak + " streak!";
            }

            // msg.push(opt_text[i]);
            
            let flexMsg = flex.getFlex(flex_text[i]);
            msg.push(flexMsg);
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

    console.log("yang alive", alive);

    ///TODO: ganti kondisi menang sesuai mode game
    console.log("game mode", group_session.mode);
    
    
    //ini sementara doang
    if (alive === 1) {
      for (let i = 0; i < group_session.players.length; i++) {
        if (group_session.players[i].health > 0) {
          let winner_index = i;
          console.log("winner index", i);
          return endgame(msg, winner_index);
        }
      }
    } else if (alive === 0) {
      // draw?
      drawgame(msg);
    } else {
      // ke preBattle
      //TODO: buat ini bisa ke state pilih power ups
      group_session.state = "preBattle";
      return preBattle(msg);
    }
  }

  function endgame(msg, winner_index) {
    console.log("ini diendgame");
    let winnerName = group_session.players[winner_index].name;
    let headerText = "🎉 Pemenangnya adalah " + winnerName + ' 🎉';
    let endGameFlex = flex.getEndGame(group_session, headerText);

    msg.push(endGameFlex);

    group_session.players.forEach((item) => {
      item.killAmount += item.killStreak;
    })
    
    group_session.state = "idle";
    resetAllPlayers(group_session.players);
    group_session.players.length = 0;
    saveGroupData();
    client.replyMessage(event.replyToken, msg);
  }

  function drawgame(msg) {
    console.log("ini draw game");
    let headerText = "⛔ Game Draw bois ⛔";
    let endGameFlex = flex.getEndGame(group_session, headerText);

    msg.push(endGameFlex);
    
    group_session.players.forEach((item) => {
      item.killAmount += item.killStreak;
    })

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

    client.replyMessage(event.replyToken, msg).catch(err => console.log(err));
  }

  function resetAllPlayers(players) {
    const data = require("/app/src/data");
    data.resetAllPlayers(players);
  }
}

module.exports = handle;
