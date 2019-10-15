const reply = require("../api/reply");
const data = require("../src/data");
const helper = require("../helper");

function handle(event, args, user_session, group_session) {
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  };

  if (group_session === undefined) {
    return Promise.resolve(null);
  }
  console.log(group_session);
  console.log(user_session);
  if (group_session.state !== "new") {
    if (group_session.state === "idle") {
      return reply.text(
        event,
        "belum ada game yg dibuat. ketik '/new' utk buat"
      );
    } else {
      return reply.text(event, "game sedang berjalan");
    }
  }

  if (user_session.status !== "active") {
    return reply.text(event, user_session.name + ", kmu tidak bergabung didalam game");
  }

  for (
    var i = helper.indexOfPlayer(user_session, group_session);
    i < group_session.players.length - 1;
    i++
  ) {
    group_session.players[i] = group_session.players[parseInt(i) + 1];
  }
  
  group_session.players.pop();
  user_session.status = "inactive";
  
  text += user_session.name + " meninggalkan game";
  
  if (group_session.players.length === 0){
    group_session.state = "idle";
    text += "\n" + "game di stop karena tidak ada pemain lagi";
  }
  
  data.saveUserData(user_session);
  data.saveGroupData(group_session);
  
  reply.text(event, text);
  
}

module.exports = handle;
