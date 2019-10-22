const fs = require("fs");
const baseUserPath = "./data/users/";
const baseGroupPath = "./data/groups/";
var user_session = {};
var group_session = {};
const cmd = require("../cmd");

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

    searchUser(this.event.source.userId);

    function searchUser(id) {
      let path = baseUserPath + id + "_user.json";
      fs.readFile(path, function(err, data) {
        if (err) {
          var newUser = {
            id: id,
            name: "",
            status : "inactive",
            groupId: ''
          };

          var newUserData = JSON.stringify(newUser, null, 2);
          searchUserCallback(newUserData);
        } else {
          searchUserCallback(data);
        }
      });
    }

    function searchUserCallback(data) {
      user_session = JSON.parse(data);
      console.log(user_session);

      if (user_session.name === "") {
        client.getProfile(user_session.id)
          .then(profile => {
            user_session.name = profile.displayName;
            saveUserDataInitial(user_session);
          })
        .catch((err) => {
          return client.replyMessage(event.replyToken, {type:'text', text:"di add dulu botnya geng"});
        })
      } else {
        saveUserDataInitial(user_session);
      }
    }

    function saveUserDataInitial(user_session) {
      let path = baseUserPath + user_session.id + "_user.json";
      fs.writeFile(path, JSON.stringify(user_session, null, 2), function(err) {
        if (err) {
          console.log("error write file", err);
        } else {
          if (event.source.type === "group") {
            searchGroup(event.source.groupId);
          } else if (event.source.type === "room") {
            searchGroup(event.source.roomId);
          } else if (event.source.type === "user") {
            //forwardProcess(client, event, args, user_session);
          }
        }
      });
    }

    function searchGroup(id) {
      let path = baseGroupPath + id + "_group.json";
      fs.readFile(path, function(err, data) {
        if (err) {
          var newGroup = {
            groupId: id,
            name: "",
            players: [],
            state: "idle"
          };

          var newGroupData = JSON.stringify(newGroup, null, 2);
          searchGroupCallback(newGroupData);
        } else {
          searchGroupCallback(data);
        }
      });
    }
    
    function searchGroupCallback(data){
      group_session = JSON.parse(data);
      console.log(group_session);
      forwardProcess(client, event, args, user_session, group_session);
      
    }
    
    function forwardProcess(client, event, args, user_session, group_session){
      return cmd(client, event, args, user_session, group_session);
    }
    
  },

  replyText: function(texts) {
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },
  
  saveUserData: function(user_session){
    let path = baseUserPath + user_session.id + "_user.json";
      fs.writeFile(path, JSON.stringify(user_session, null, 2), function(err) {
        if (err) {
          console.log("error write file", err);
        }
      });
  },
  
  saveGroupData: function(group_session){
    let path = baseGroupPath + group_session.groupId + "_group.json";
      fs.writeFile(path, JSON.stringify(group_session, null, 2), function(err) {
        if (err) {
          console.log("error write file", err);
        }
      });
  },
  
   resetAllPlayers : function(players) {
    for (var i in players) {
      let reset_player = {
        id      : players[i].id,
        status  : 'inactive',
        groupId : players[i].groupId,
        name    : players[i].name
      };

      this.saveUserData(reset_player);
    }
  },
  
};
