const client = require("../src/client");
module.exports = {
  text : function (event, texts){
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(event.replyToken, texts.map((text) => ({ type: 'text', text })));
  },
}