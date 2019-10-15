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
      // userData = JSON.stringify(new_user, null, 2);
      userData = new_user;
    } else {
      userData = fs.readFileSync(userPath, "utf8");
    }

    // user_session = JSON.parse(userData);

    if (event.source.type === "group" || event.source.type === "room") {
      var groupId;
      if (event.source.type === "group") {
        groupId = event.source.groupId;
      } else {
        groupId = event.source.rommId;
      }

      var groupPath = baseGroupPath + groupId + "_group.json";

      if (!fs.existsSync(userPath)) {
        var new_group = {
          groupId: groupId,
          state: "idle",
          mode: "classic",
          players: []
        };
        // groupData = JSON.stringify(new_group, null, 2);
        groupData = new_group;
      } else {
        groupData = fs.readFileSync(groupPath, "utf8");
      }

      // group_session = JSON.parse(groupData);

      // if (user_session.groupId === ""){
      //   user_session.groupId = group_session.groupId;
      // }

      if (userData.groupId === "") {
        userData.groupId = groupData.groupId;
      }
      
      fs.writeFileSync(groupPath, JSON.stringify(groupData, null, 2));
      
    }

    // if (user_session.name === ""){
    //   client
    //     .getProfile(user_session.id)
    //     .then((profile) => {
    //       user_session.name = profile.displayName;
    //     })
    //   .catch((err) => {
    //     return reply.text(event, '💡 Gagal bergabung kedalam game! Add bot ini untuk bergabung.');
    //   })
    // }

    if (userData.name === "") {
      client
        .getProfile(userData.id)
        .then(profile => {
          userData.name = profile.displayName;
          this.forwardProcess(event, userPath, userData);
        })
        .catch(err => {
          console.log(err);
          return reply.text(
            event,
            "💡 Gagal bergabung kedalam game! Add bot ini untuk bergabung."
          );
        });
    } else {
      this.forwardProcess(event, userPath, userData);
    }
  },

  forwardProcess: function(event, userPath, userData) {
    fs.writeFileSync(userPath, JSON.stringify(userData, null, 2));
    const cmd = require("../cmd");
    cmd(event, userData, groupData);
  }
};
