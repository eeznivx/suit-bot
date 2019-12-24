const fs = require("fs");
const baseUserPath = "./data/users/";
const baseGroupPath = "./data/groups/";

module.exports = {
  receive: function(client, event) {
    this.client = client;
    this.event = event;
    this.group_session = {};
    
    let groupId = "";
    if (this.event.source.type === "group") {
      groupId = this.event.source.groupId;
    } else if (this.event.source.type === "room") {
      groupId = this.event.source.roomId;
    }

    let path = baseGroupPath + groupId + "_group.json";

    var data = fs.readFileSync(path);
    this.group_session = JSON.parse(data);

    switch (event.type) {
      case "join":
        return this.joinEvent();
      case "follow":
        return this.followEvent();
      case "memberJoined":
        return this.memberJoinedEvent();
      case "memberLeft":
        return this.memberLeftEvent();
      case "leave":
        return this.leaveEvent();
    }
  },

  leaveEvent: function() {
    this.group_session.state = "idle";
    this.resetAllPlayers(this.group_session.players);
    this.saveGroupData();
  },

  memberJoinedEvent: function() {
    ///tunggu jadi official
    //     let newComers = this.event.joined.members;
    //     let newComerName = [];

    //     newComers.forEach((item) => {
    //       this.client.getProfile(item.userId)
    //         .then((profile) => {
    //           newComerName.push(profile.displayName);
    //         })
    //     })

    //     let text = "👋 Selamat datang! " + newComerName.join(", ") + " Maen Suit yok";

    let text = "👋 Selamat datang! Maen Suit yok";
    this.sendResponse(text);
  },

  memberLeftEvent: function() {
    ///tunggu jadi official
    //     let leftMembers = this.event.left.members;
    //     let leftMembersName = [];
    //     leftMembers.forEach((item) => {
    //       this.client.getProfile(item.userId)
    //         .then((profile) => {
    //           leftMembersName.push(profile.displayName);
    //         })
    //     })
    // let text = "👋 Sampai jumpa lagi! " + leftMembersName.join(", ");
    // let text = "👋 Sampai jumpa lagi!";
    // this.sendResponse(text);
  },

  joinEvent: function() {
    let text =
      '😀 Thanks udah undang bot ini! Untuk memulai game bisa ketik "/new". ';
    text += '📜 Untuk bantuan bisa ketik "/help".';
    this.sendResponse(text);
  },

  followEvent: function() {
    let text =
      "😄 Thanks udah add bot ini! Undang bot ini ke group / room chat kamu untuk mulai bermain! ";
    text += "Untuk bantuan bisa ketik '/help'";
    this.sendResponse(text);
  },

  sendResponse: function(text) {
    return this.client.replyMessage(this.event.replyToken, {
      type: "text",
      text: text
    });
  },

  saveGroupData: function() {
    const data = require("/app/src/data");
    data.saveGroupData(this.group_session);
  },

  resetAllPlayers: function(players) {
    const data = require("/app/src/data");
    data.resetAllPlayers(players);
  }
};
