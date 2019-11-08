const helper = require("/app/helper");
const flex = require("/app/helper/flex");
const helperText = require("/app/helper/text");
const cards = require("/app/helper/cards");

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
    return replyText(
      "💡 " + user_session.name + ", masih belum saatnya attack"
    );
  }

  if (group_session.players[index].health <= 0) {
    return replyText("💡 " + user_session.name + ", kamu sudah tereleminasi");
  }

  if (group_session.players[index].attack !== "") {
    return replyText("💡 " + user_session.name + ", kamu sudah memilih attack");
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
    ///init flex detail text
    let bubbleDetail = {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "📣 Detail",
            weight: "bold",
            size: "xl",
            wrap: true,
            color: "#F6F6F6"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: []
      },
      styles: {
        header: {
          backgroundColor: "#2D4059"
        }
      }
    };

    let detailText = {};
    var detailTexts = [];

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

          if (attackerAttack === victimAttack) {
            console.log("attackerAttack sama dengan victimAttack, skip");
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
          //init
          //untuk detailText
          detailText[i] = {
            type: "text",
            text: "",
            size: "md",
            wrap: true
          };

          let attackerName = "";
          let victimName = "";

          targetIndex = helper.getPlayerById(
            helper.random(targets),
            group_session
          );
          console.log(
            "target yang kenak ",
            group_session.players[targetIndex].name
          );

          group_session.players[targetIndex].attacker.push(
            group_session.players[i].name
          );

          //skill random jan lupa buat utk team mode
          let playerCards = group_session.players[i].cards;
          console.log("playerCards", playerCards);
          let choosenCard = helper.random(playerCards);
          console.log("chooseCard", choosenCard);
          //buat loop cards dari helper, lalu  taruh switch utk cek
          for (let y = 0; y < cards.length; y++) {
            if (cards[i].name === choosenCard.name) {
              switch (choosenCard.type) {
                case "plusDamage":
                  break;

                case "plusHealth":
                  //ini ga perlu loop kedalem
                  break;

                case "spellDamage":
                  //gimana kalo spell, TODO : pindahin ke atas nehhh
                  break;

                case "spellStun":
                  break;

                case "basicAttack":
                  //basic attack
                  //ini tidak semua berdamage
                  group_session.players[targetIndex].health -=
                    group_session.players[i].damage;

                  attackerName =
                    group_session.players[i].name +
                    "(❤️" +
                    group_session.players[i].health +
                    ")";
                  victimName =
                    group_session.players[targetIndex].name +
                    "(-🎯" +
                    group_session.players[i].damage +
                    ")";

                  //default, kedepan pake random response
                  detailText[i].text +=
                    attackerName + " menyerang " + victimName;
                  break;
              }
            }
          }

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

            // flex_text[i].body += "\n" + '💀 ' + victimName + " get rekt by " + attackerName + "!";
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
                "\n" +
                "🔥 " +
                attackerName +
                " dapat " +
                attackerStreak +
                " streak!";
            }

            let flexMsg = flex.getFlex(flex_text[i]);
            msg.push(flexMsg);
          }

          detailTexts.push(detailText[i]);
        }
      }
    }

    let alive = 0;
    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].health > 0) {
        alive++;
      }
    }
    console.log("yang alive", alive);

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

      return chooseCard(msg);
    }
  }

  function teamMode(msg) {
    ///init flex detail text
    let bubbleDetail = {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "📣 Detail",
            weight: "bold",
            size: "xl",
            wrap: true,
            color: "#F6F6F6"
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: []
      },
      styles: {
        header: {
          backgroundColor: "#2D4059"
        }
      }
    };

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

          var attackerTeam = group_session.players[i].team;
          console.log("attackerTeam", attackerTeam);
          var victimTeam = group_session.players[u].team;
          console.log("victimTeam", victimTeam);

          if (attackerId === victimId) {
            console.log("attacker id sama victim id sama, skipkan");
            continue;
          }

          if (attackerTeam === victimTeam) {
            console.log("sama team, skipkan");
            continue;
          }

          if (attackerAttack === victimAttack) {
            console.log("attackerAttack sama dengan victimAttack, skip");
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
          group_session.players[targetIndex].health -=
            group_session.players[i].damage;
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
            "(❤️" +
            group_session.players[i].health +
            ")";
          var victimName =
            "(" +
            group_session.players[targetIndex].team +
            ")" +
            group_session.players[targetIndex].name +
            "(-🎯" +
            group_session.players[i].damage +
            ")";

          //default, kedepan pake random response
          detailText[i].text += attackerName + " menyerang " + victimName;

          //tunggu ada sistem damage
          // attackerName + " menyerang " + victimName + " (-1 damage)";

          //kasih header special
          if (group_session.players[targetIndex].health === 0) {
            group_session.players[i].killStreak++;

            var attackerStreak = group_session.players[i].killStreak;

            // opt_text[i] = {
            //   type: 'text',
            //   text: attackerName + ' mengeleminasi ' + victimName + '!'
            // }

            let eliminatedText = helperText.eliminated(
              attackerName,
              args[1],
              victimName
            );
            console.log("eliminated text", eliminatedText);
            // body: '🎯 ' + attackerName + " mengeleminasi " + victimName + "!"

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
              flex_text[i].body += "\n" + "💀 " + shutdownText;
            }

            if (group_session.players[i].killStreak > 1) {
              // opt_text[i].text += '\n' + attackerName + ' dapat ' + attackerStreak + ' streak!';
              flex_text[i].body +=
                "\n" +
                "🔥 " +
                attackerName +
                " dapat " +
                attackerStreak +
                " streak!";
            }

            // msg.push(opt_text[i]);

            let flexMsg = flex.getFlex(flex_text[i]);
            msg.push(flexMsg);
          }

          detailTexts.push(detailText[i]);
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
        }

        teamAName.push(item.name);
      } else {
        if (item.health > 0) {
          team_b_alive++;
        }

        teamBName.push(item.name);
      }
    });

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
      //ke prebattle
      //atau ke bonus round power ups itu

      return chooseCard(msg);
    }
  }

  function teamEndGame(msg, winner_team_name) {
    console.log("ini diendgame team");
    let winnerName = winner_team_name.join(", ");
    let headerText = "🎉 Pemenangnya adalah " + winnerName + " 🎉";
    let endGameFlex = flex.getEndGame(group_session, headerText);

    msg.push(endGameFlex);

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

    group_session.state = "idle";
    resetAllPlayers(group_session.players);
    group_session.players.length = 0;
    saveGroupData();
    client.replyMessage(event.replyToken, msg);
  }

  function chooseCard(msg) {
    //cp
    group_session.state = "chooseCard";

    for (let i = 0; i < group_session.players.length; i++) {
      if (group_session.players[i].health > 0) {
        group_session.players[i].choose = "pending";
      }
    }

    let chooseCardFlexMsg = flex.getChooseCard(group_session);
    msg.push(chooseCardFlexMsg);

    saveGroupData();

    client.replyMessage(event.replyToken, msg);
  }

  function resetAllPlayers(players) {
    const data = require("/app/src/data");
    data.resetAllPlayers(players);
  }
}

module.exports = handle;
