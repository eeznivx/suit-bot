const fs = require("fs");
const client = require("../src/client");
const reply = require("../api/reply");
const baseUserPath = "./data/users/";
const baseGroupPath = "./data/groups/";
var userData, groupData;

module.exports = {
  receive(event, args) {
    if (!event.source.hasOwnProperty("userId")) {
      return reply.text(
        event,
        "This bot only support LINE version 7.5.0 or higher.\nTry updating, block, and re-add this bot."
      );
    }
    
    // su
    if (event.source.userId !== process.env.DEV_ID){
      //return reply.text(event, "lagi dibuat gamenya, sabar yak");
    }

    var userId = event.source.userId;
    var userPath = baseUserPath + userId + "_user.json";

    if (!fs.existsSync(userPath)) {
      var new_user = {
        id: userId,
        name: "",
        status: "inactive",
        groupId: "",
        win: 0,
        lose: 0,
        points: 0
      };
      userData = new_user;
    } else {
      let raw = fs.readFileSync(userPath);
      userData = JSON.parse(raw);
    }

    if (event.source.type === "group" || event.source.type === "room") {
      var groupId;
      if (event.source.type === "group") {
        groupId = event.source.groupId;
      } else {
        groupId = event.source.rommId;
      }

      var groupPath = baseGroupPath + groupId + "_group.json";

      if (!fs.existsSync(groupPath)) {
        var new_group = {
          groupId: groupId,
          state: "idle",
          mode: "classic",
          players: []
        };
        groupData = new_group;
      } else {
        let raw = fs.readFileSync(groupPath);
        groupData = JSON.parse(raw);
      }
      
    }

    if (userData.name === "") {
      client
        .getProfile(userData.id)
        .then(profile => {
          userData.name = profile.displayName;
          this.forwardProcess(event, args, userPath, userData);
        })
        .catch(err => {
          console.log(err);
          return reply.text(
            event,
            "💡 Gagal bergabung kedalam game! Add bot ini untuk bergabung."
          );
        });
    } else {
      this.forwardProcess(event, args, userPath, userData);
    }
  },

  forwardProcess: function(event, args, userPath, userData) {
    fs.writeFileSync(userPath, JSON.stringify(userData, null, 2));
    const cmd = require("../cmd");
    cmd(event, args, userData, groupData);
  },
  
  saveUserData: function(userData){
    var userPath = baseUserPath + userData.id + "_user.json";
    fs.writeFileSync(userPath, JSON.stringify(userData, null, 2));
  },
  
  saveGroupData: function(GroupData){
    var groupPath = baseGroupPath + groupData.groupId + "_group.json";
    fs.writeFileSync(groupPath, JSON.stringify(groupData, null, 2));
  },
  
  resetAllPlayers : function(players) {
    for (var i in players) {
      let reset_player = {
        id      : players[i].id,
        status  : 'inactive',
        groupId : players[i].groupId,
        name    : players[i].name,
        win     : players[i].win,
        lose    : players[i].lose,
        points  : players[i].points,
      };

      this.saveUserData(reset_player);
    }
  },
  
};
