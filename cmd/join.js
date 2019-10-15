const reply = require("../api/reply");
const data = require("../src/data");

function handle (event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session === undefined){
    return Promise.resolve(null);
  }
  console.log(group_session);
  console.log(user_session);
  if (group_session.state !== "new"){
    if (group_session.state === "idle"){
      return reply.text(event, "belum ada game yg dibuat. ketik '/new' utk buat");
    } else {
      return reply.text(event, "sedang ada game yang berjalan");
    }
  }
  
  
  if (user_session.status === "active"){
    if (user_session.groupId !== group_session.groupId){
      return reply.text(event, user_session.name + ", kamu sedang bermain di group lain");
    } else {
      return reply.text(event, user_session.name + ", kamu sudah bergabung");
    }
  }
  
  user_session.status = "active";
  user_session.groupId = group_session.groupId;
  
  data.saveUserData(user_session);
  
  var new_player = {
    id : user_session.id,
    name: user_session.name,
    win : user_session.win,
    lose: user_session.lose,
    points : user_session.points,
    attack : "pending",
    attackResult: ""
  }
  
  group_session.players.push(new_player);
  
  data.saveGroupData(group_session);
  
  reply.text(event, user_session.name + " berhasil join game!");
  
}

module.exports = handle