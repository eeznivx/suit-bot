const fs = require("fs");
const baseUserPath = "./data/users/";
const baseGroupPath = "./data/groups/";
var user_session = {};
var group_session = {};
const cmd = require("../cmd");
const personal = require("../personal");

module.exports = {
  receive: function(client, event, args) {
    this.client = client;
    this.event = event;
    this.args = args;

    if (!this.event.source.hasOwnProperty("userId")) {
      return this.replyText(
        "This bot only support LINE version 7.5.0 or higher.\nTry updating, block, and re-add this bot."
      );
    }
    
    if (event.source.groupId !== process.env.DEV_GROUP){
       return this.replyText("👋 Sorry, botnya sedang maintenance");
    } 
   
    searchUser(this.event.source.userId);

    function searchUser(id) {
      let path = baseUserPath + id + "_user.json";
      var data;
      try {
        data = fs.readFileSync(path);
        searchUserCallback(data);
      } catch (err) {
        var newUser = {
          id: id,
          name: "",
          status: "inactive",
          groupId: "",
          killAmount: 0
        };

        var newUserData = JSON.stringify(newUser, null, 2);
        searchUserCallback(newUserData);
      }
    }

    function searchUserCallback(data) {
      
      user_session = JSON.parse(data);

      if (user_session.name === "") {
        client
          .getProfile(user_session.id)
          .then(profile => {
            user_session.name = profile.displayName;
            saveUserDataInitial(user_session);
          })
          .catch(err => {
            client
              .getGroupMemberProfile(event.source.groupId, user_session.id)
              .then(profile => {
                return client.replyMessage(event.replyToken, {
                  type: "text",
                  text:
                    "💡 " +
                    profile.displayName +
                    " gagal bergabung ke game! Add dulu botnya"
                });
              })
              .catch(err => {
                // error handling
                console.log("ada error di getGroupMemberProfile");
                console.log(event);
              });
          });
      } else {
        saveUserDataInitial(user_session);
      }
    }

    function saveUserDataInitial(user_session) {
      let path = baseUserPath + user_session.id + "_user.json";
      try {
        fs.writeFileSync(path, JSON.stringify(user_session, null, 2));
        if (event.source.type === "group") {
          searchGroup(event.source.groupId);
        } else if (event.source.type === "room") {
          searchGroup(event.source.roomId);
        } else if (user_session.status === "active") {
          searchGroup(user_session.groupId);
        }
      } catch (err) {
        console.log("error write file", err);
      }
    }

    function searchGroup(id) {
      let path = baseGroupPath + id + "_group.json";
      var data;
      try {
        data = fs.readFileSync(path);
        searchGroupCallback(data);
      } catch (err) {
        var newGroup = {
          groupId: id,
          name: "",
          players: [],
          state: "idle",
          mode: "classic"
        };

        var newGroupData = JSON.stringify(newGroup, null, 2);
        searchGroupCallback(newGroupData);
      }
    }

    function searchGroupCallback(data) {
      group_session = JSON.parse(data);
      forwardProcess(client, event, args, user_session, group_session);
    }

    function forwardProcess(client, event, args, user_session, group_session) {
      if (event.source.type === 'user'){
        personal(client, event, args, user_session, group_session);
      } else {
        cmd(client, event, args, user_session, group_session);
      }
    }
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },

  saveUserData: function(user_session) {
    let path = baseUserPath + user_session.id + "_user.json";
    try {
      fs.writeFileSync(path, JSON.stringify(user_session, null, 2));
    } catch (err) {
      console.log("error write file", err);
    }
  },

  saveGroupData: function(group_session) {
    let path = baseGroupPath + group_session.groupId + "_group.json";
    try {
      fs.writeFileSync(path, JSON.stringify(group_session, null, 2));
    } catch (err) {
      console.log("error write file", err);
    }
  },

  resetAllPlayers: function(players) {
    for (var i in players) {
      let reset_player = {
        id: players[i].id,
        status: "inactive",
        groupId: players[i].groupId,
        name: players[i].name,
        killAmount: players[i].killAmount
      };

      this.saveUserData(reset_player);
    }
  }
};
