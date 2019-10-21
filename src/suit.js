const flex = require('/app/helper/flex');
const keywords = require('/keywords');
module.exports = {
  receive: function(client, event, args, user_session, group_session){
    this.client = client;
    this.event = event;
    this.args = args;
    this.user_session = user_session;
    this.group_session = group_session;
    
    
    
  },
  
  replyText: function(texts){
    texts = Array.isArray(texts) ? texts : [texts];
    return this.client.replyMessage(
      this.event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  },
  
  newGameFlex: function(){
    var flex_msg = {
      type: "flex",
      altText: "ada pesan untuk kamu!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            {
              type: "text",
              text: "Game baru telah dibuat!",
              weight: "bold",
              size: "xl",
              wrap: true
            }
          ]
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "postback",
                label: "gabung",
                data: "/join"
              }
            }
          ]
        }
      }
    };
    return this.client.replyMessage(this.event.replyToken, flex_msg).catch(err => {
      console.log(err.originalError.config.data);
    });
  },
  
  getPreBattleFlex: function(){
    var flex_msg = flex.getPreBattleFlex(this.group_session);
    return flex_msg;
  },
  
  getPostBattleFlex: function(){
    var flex_msg = flex.getPostBattleFlex(this.group_session);
    return flex_msg;
  },
  
}