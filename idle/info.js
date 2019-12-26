const flex = require("/app/helper/flex");
function handle(client, event, args, user_session) {
  let flex_text = {
    header: "",
    body: ""
  };

  flex_text.header = "Info " + user_session.name;
  flex_text.body = "Total Kill : " + user_session.killAmount;
  
  let flexMsg = flex.getFlex(flex_text);
  client.replyMessage(event.replyToken, flexMsg);
  
}

module.exports = handle;
