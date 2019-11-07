module.exports = {
  receive: function(client, event) {
    this.client = client;
    this.event = event;

    switch (event.type) {
      case "join":
        return this.joinEvent();
      case "follow":
        return this.followEvent();
      case "memberJoined":
        return this.memberJoinedEvent();
      case "memberLeft":
        return this.memberLeftEvent();
    }
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
    text += "Jika kamu pengguna baru, setup hero mu dengan ketik '/setup'";
    this.sendResponse(text);
  },
  
   sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },
  
};
