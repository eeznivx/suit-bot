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

  if (group_session.state === "idle" || group_session.state === "new") {
    return Promise.resolve(null);
  }

  let index = helper.indexOfPlayer(user_session, group_session);
  if (index === -1) {
    return Promise.resolve(null);
  }

  if (group_session.state !== "preBattle") {
    // return replyText(
    //   "💡 " + user_session.name + ", masih belum saatnya attack"
    // );
    return Promise.resolve(null);
  }

  if (group_session.players[index].health <= 0) {
    return replyText("💡 " + user_session.name + ", kamu sudah tereleminasi");
  }

  if (group_session.players[index].attack !== "") {
    // return replyText("💡 " + user_session.name + ", kamu sudah memilih attack");
    return Promise.resolve(null);
  } else {
    text += "💡 " + user_session.name + " berhasil memilih attack";
  }

  group_session.players[index].attack = args[1];

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
    console.log("game mode", group_session.mode);

    if (group_session.mode === "classic") {
      classicMode(msg);
    } else if (group_session.mode === "team") {
      teamMode(msg);
    }
  }

  function classicMode(msg) {
    let spotlights = [];
    let detailText = {};
    var detailTexts = [];

    for (let i = 0; i < group_session.players.length; i++) {
      //targets cuma bisa direset pas ganti attacker
      var targets = [];
      var targetIndex = -1;

      if (
        group_session.players[i].attack !== "" &&
        group_session.players[i].health > 0
      ) {
        group_session.players[i].energy++;

        for (let u = 0; u < group_session.players.length; u++) {
          var attackerId = group_session.players[i].id;

          var victimId = group_session.players[u].id;

          var attackerAttack = group_session.players[i].attack;

          var victimAttack = group_session.players[u].attack;

          if (attackerId === victimId) {
            continue;
          }

          if (attackerAttack === victimAttack) {
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

        //init
        //untuk detailTexts
        detailText[i] = {
          type: "text",
          text: "",
          size: "md",
          wrap: true
        };

        //apply buff
        if (group_session.players[i].buff.name !== "") {
          let buffName = group_session.players[i].buff.name;

          if (group_session.players[i].buff.justUsed === true) {
            group_session.players[i].buff.justUsed = false;
            detailText[i].text +=
              group_session.players[i].name +
              " menggunakan " +
              buffName +
              "\n\n";
          }
        }

        if (targets.length !== 0) {
          //for enhance damage
          var enhanceDamage = 0;

          //apply buff
          if (group_session.players[i].buff.name !== "") {
            let buffName = group_session.players[i].buff.name;

            if (buffName === "lifesteal") {
              group_session.players[i].health++;
            } else if (buffName === "enhance-damage") {
              enhanceDamage += 1;
            }
          }

          let attackerName = "";
          let victimName = "";
          let attackerDamage = "";

          targetIndex = helper.getPlayerById(
            helper.random(targets),
            group_session
          );

          group_session.players[targetIndex].energy++;

          group_session.players[targetIndex].attacker.push(
            group_session.players[i].name
          );

          group_session.players[targetIndex].health -=
            group_session.players[i].damage + enhanceDamage;

          attackerName =
            group_session.players[i].name +
            " (❤️ " +
            group_session.players[i].health +
            ")";

          let infoDamage = group_session.players[i].damage + enhanceDamage;
          attackerDamage = "🎯 " + infoDamage + " damage ";

          victimName =
            group_session.players[targetIndex].name +
            " (❤️ " +
            group_session.players[targetIndex].health +
            ")";

          //default, kedepan pake random response
          detailText[i].text +=
            attackerName +
            " menyerang " +
            victimName +
            " dengan " +
            attackerDamage +
            "\n";

          //kasih header special
          if (group_session.players[targetIndex].health === 0) {
            group_session.players[i].killStreak++;

            var attackerStreak = group_session.players[i].killStreak;

            let attackerAttack = group_session.players[i].attack;

            let eliminatedText = helperText.eliminated(
              attackerName,
              attackerAttack,
              victimName
            );

            flex_text[i] = {
              header: "🔥 Spotlight 🔥",
              body: "🎯 " + eliminatedText
            };

            // flex_text[i].body += "\n" + '💀 ' + victimName + " get rekt by " + attackerName + "!";
            if (group_session.players[targetIndex].killStreak > 1) {
              let shutdownText = helperText.shutdown(
                attackerName,
                args[1],
                victimName
              );
              flex_text[i].body += "\n\n" + "💀 " + shutdownText;
            }

            if (group_session.players[i].killStreak > 1) {
              flex_text[i].body +=
                "\n\n" +
                "🔥 " +
                attackerName +
                " dapat " +
                attackerStreak +
                " streak!";
            }
            spotlights.push(flex_text[i]);
          }

          detailTexts.push(detailText[i]);
        }

        //kurangi duration buff
        if (group_session.players[i].buff.name !== "") {
          group_session.players[i].buff.duration--;

          if (group_session.players[i].buff.duration < 1) {
            group_session.players[i].buff.name = "";
          }
        }
      }
    }

    let alive = 0;

    group_session.players.forEach(item => {
      if (item.health > 0) {
        alive++;
      } else if (item.health < 0) {
        item.health = 0;
      }
    });

    console.log("yang alive", alive);

    //spotlights
    if (spotlights.length > 0) {
      let flexMsg = flex.getFlex(spotlights);
      msg.push(flexMsg);
    }

    let postBattleFlex = flex.getPostBattle(group_session, detailTexts);
    msg.push(postBattleFlex);

    if (alive === 1) {
      for (let i = 0; i < group_session.players.length; i++) {
        if (group_session.players[i].health > 0) {
          let winner_index = i;
          console.log("winner index", i);
          return classicEndgame(msg, winner_index);
        }
      }
    } else if (alive === 0) {
      // draw?
      drawGame(msg);
    } else {
      // ke preBattle

      return preBattle(msg);
    }
  }

  function teamMode(msg) {
    let spotlights = [];
    let detailText = {};
    var detailTexts = [];

    let team_a_battle = [];
    let team_b_battle = [];

    group_session.players.forEach(item => {
      if (item.health > 0) {
        if (item.team === "A") {
          team_a_battle.push(item);
        } else {
          team_b_battle.push(item);
        }
      }
    });

    for (let i = 0; i < group_session.players.length; i++) {
      //targets cuma bisa direset pas ganti attacker
      var targets = [];
      var targetIndex = -1;

      if (
        group_session.players[i].attack !== "" &&
        group_session.players[i].health > 0
      ) {
        group_session.players[i].energy++;

        for (let u = 0; u < group_session.players.length; u++) {
          var attackerId = group_session.players[i].id;

          var victimId = group_session.players[u].id;

          var attackerAttack = group_session.players[i].attack;

          var victimAttack = group_session.players[u].attack;

          var attackerTeam = group_session.players[i].team;

          var victimTeam = group_session.players[u].team;

          if (attackerId === victimId) {
            continue;
          }

          if (attackerTeam === victimTeam) {
            continue;
          }

          if (attackerAttack === victimAttack) {
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

        if (targets.length !== 0) {
          //for enhance damage
          var enhanceDamage = 0;

          //apply buff
          if (group_session.players[i].buff.name !== "") {
            let buffName = group_session.players[i].buff.name;
            if (buffName === "lifesteal") {
              group_session.players[i].health++;
            } else if (buffName === "enhance-damage") {
              enhanceDamage += 1;
            }
          }

          targetIndex = helper.getPlayerById(
            helper.random(targets),
            group_session
          );

          group_session.players[targetIndex].energy++;

          group_session.players[targetIndex].health -=
            group_session.players[i].damage + enhanceDamage;

          group_session.players[targetIndex].attacker.push(
            group_session.players[i].name
          );

          //untuk detailText
          detailText[i] = {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          };

          var attackerName =
            "(" +
            group_session.players[i].team +
            ")" +
            group_session.players[i].name +
            "(❤️ " +
            group_session.players[i].health +
            ")";
          var victimName =
            "(" +
            group_session.players[targetIndex].team +
            ")" +
            group_session.players[targetIndex].name +
            "(❤️ " +
            group_session.players[targetIndex].health +
            ")";

          let infoDamage = group_session.players[i].damage + enhanceDamage;
          var attackerDamage = "🎯 " + infoDamage + " damage ";

          //default, kedepan pake random response
          detailText[i].text +=
            attackerName +
            " menyerang " +
            victimName +
            " dengan " +
            attackerDamage +
            "\n";

          //kasih header special
          if (group_session.players[targetIndex].health === 0) {
            group_session.players[i].killStreak++;

            var attackerStreak = group_session.players[i].killStreak;

            let eliminatedText = helperText.eliminated(
              attackerName,
              args[1],
              victimName
            );

            flex_text[i] = {
              header: "🔥 Spotlight 🔥",
              body: "🎯 " + eliminatedText
            };

            if (group_session.players[targetIndex].killStreak > 1) {
              let shutdownText = helperText.shutdown(
                attackerName,
                args[1],
                victimName
              );
              flex_text[i].body += "\n" + "💀 " + shutdownText;
            }

            if (group_session.players[i].killStreak > 1) {
              flex_text[i].body +=
                "\n\n" +
                "🔥 " +
                attackerName +
                " dapat " +
                attackerStreak +
                " streak!";
            }

            spotlights.push(flex_text[i]);
          }

          detailTexts.push(detailText[i]);
        }

        //kurangi duration buff
        if (group_session.players[i].buff.name !== "") {
          group_session.players[i].buff.duration--;

          if (group_session.players[i].buff.duration < 1) {
            group_session.players[i].buff.name = "";
          }
        }
      }
    }

    let teamAName = [];
    let teamBName = [];

    let team_a_alive = 0;
    let team_b_alive = 0;

    group_session.players.forEach(item => {
      if (item.team === "A") {
        if (item.health > 0) {
          team_a_alive++;
        } else if (item.health < 0) {
          item.health = 0;
        }

        teamAName.push(item.name);
      } else {
        if (item.health > 0) {
          team_b_alive++;
        } else if (item.health < 0) {
          item.health = 0;
        }

        teamBName.push(item.name);
      }
    });

    //spotlights
    if (spotlights.length > 0) {
      let flexMsg = flex.getFlex(spotlights);
      msg.push(flexMsg);
    }

    let postBattleFlex = flex.getPostBattle(group_session, detailTexts);
    msg.push(postBattleFlex);

    if (team_a_alive === 0 && team_b_alive !== 0) {
      teamEndGame(msg, teamBName);
    } else if (team_b_alive === 0 && team_a_alive !== 0) {
      teamEndGame(msg, teamAName);
    } else if (team_a_alive === 0 && team_b_alive === 0) {
      //draw
      console.log("draw game team");
      drawGame(msg);
    } else {
      return preBattle(msg);
    }
  }

  function teamEndGame(msg, winner_team_name) {
    console.log("ini diendgame team");
    let winnerName = winner_team_name.join(", ");
    let headerText = "🎉 Pemenangnya adalah " + winnerName + " 🎉";
    let endGameFlex = flex.getEndGame(group_session, headerText);

    msg.push(endGameFlex);

    group_session.players.forEach(item => {
      item.killAmount += item.killStreak;
    });

    group_session.state = "idle";
    resetAllPlayers(group_session.players);
    group_session.players.length = 0;
    saveGroupData();
    client.replyMessage(event.replyToken, msg).catch(err => {
      console.log(err);
    });
  }

  function classicEndgame(msg, winner_index) {
    console.log("ini diendgame classic");
    let winnerName = group_session.players[winner_index].name;
    let headerText = "🎉 Pemenangnya adalah " + winnerName + " 🎉";
    let endGameFlex = flex.getEndGame(group_session, headerText);

    msg.push(endGameFlex);

    group_session.players.forEach(item => {
      item.killAmount += item.killStreak;
    });

    group_session.state = "idle";
    resetAllPlayers(group_session.players);
    group_session.players.length = 0;
    saveGroupData();
    client.replyMessage(event.replyToken, msg);
  }

  function drawGame(msg) {
    console.log("ini draw game");
    let headerText = "⛔ Game Draw bois ⛔";
    let endGameFlex = flex.getEndGame(group_session, headerText);

    msg.push(endGameFlex);

    group_session.players.forEach(item => {
      item.killAmount += item.killStreak;
    });

    group_session.state = "idle";
    resetAllPlayers(group_session.players);
    group_session.players.length = 0;
    saveGroupData();
    client.replyMessage(event.replyToken, msg).catch(err => console.log(err));
  }

  function preBattle(msg) {
    group_session.state = "preBattle";
    group_session.round++;

    for (let i = 0; i < group_session.players.length; i++) {
      group_session.players[i].attack = "";
      group_session.players[i].attacker = [];
    }

    let preBattleFlexMsg = flex.getPreBattle(group_session);
    msg.push(preBattleFlexMsg);

    saveGroupData();

    client.replyMessage(event.replyToken, msg).catch(err => console.log(err));
  }

  function resetAllPlayers(players) {
    const data = require("/app/src/data");
    data.resetAllPlayers(players);
  }
}

module.exports = handle;
