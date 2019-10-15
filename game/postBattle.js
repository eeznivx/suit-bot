const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");
const endgame = require("./endgame");
const game = require("./index");

function handle(event, msg, group_session) {
  
  msg.push(reply.postBattleFlex(event, group_session));
  
  let alive = 0;
  for (let i = 0; i < group_session.players.length; i++) {
    if (group_session.players[i].health > 0) {
      alive++;
    }
  }

  if (alive === 1) {
    group_session.state = "endgame";
    for (let i = 0; i < group_session.players[i].length; i++) {
      if (group_session.players[i].health > 0) {
        let winner_index = i;
        return endgame(event, msg, group_session, winner_index);
      }
    }
  } else if (alive === 0){
    // draw?
  } else {
    // ke preBattle
    group_session.state = "preBattle";
    return game(event, msg, group_session);
  }
}

module.exports = handle;
