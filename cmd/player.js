const helper = require('/app/helper/flex');
function handle (client, event, args, user_session, group_session){
  let text = "";
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  if (group_session === undefined){
    return Promise.resolve(null);
  }
  
  if (group_session.state === "idle"){
    return replyText("tidak ada game yang berjalan");
  }
  
  let flex_msg = helper.getPlayerList(group_session);
  return client.replyMessage(event.replyToken, flex_msg);
  
  function replyText(texts){
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
  
}

module.exports = handle