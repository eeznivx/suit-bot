const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");
const game = require("./index");

function handle(event, msg, group_session) {
  for (let i = 0; i < group_session.players.length; i++){
    let self = i;
    let targets = [];
    let target = {};
    for (let u = 0; u < group_session.players.length; u++){
      if (u !== i && group_session.players[u].attackResult !== ""){
        if (group_session.players[self].attackResult === "batu" && group_session.players[u].attackResult === "gunting"){
          targets.push(group_session.players[u].id);
        } else if (group_session.players[self].attackResult === "gunting" && group_session.players[u].attackResult === "kertas"){
          targets.push(group_session.players[u].id);
        } else if (group_session.players[self].attackResult === "kertas" && group_session.players[u].attackResult === "batu"){
          targets.push(group_session.players[u].id);
        }
      }
      
      target = helper.getPlayerById(helper.random(targets), group_session);
      target.health--;
      target.attacker.push(group_session.players[self].name);
    }
  }
  
  group_session.state = "postBattle";
  return game(event, msg, group_session);
}

module.exports = handle;
