const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");

const states = [
  {
    text: "battle",
    handler: require("./battle")
  },
  {
    text: "preBattle",
    handler: require("./preBattle")
  },
  {
    text: "endgame",
    handler: require("./endgame")
  },
  {
    text: "postBattle",
    handler: require("./postBattle")
  }
]

function receive(event, msg, group_session){
  for (let i = 0; i < states.length; i++){
    if (states[i].text === group_session.state){
      return states[i].handler(event, msg, group_session);
    }
  }
  
}

module.exports = receive