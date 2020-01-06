const helper = require('/app/helper/flex');
function handle (client, event, args, user_session, group_session){
  
  if (group_session.state !== "idle"){
    if (group_session.state === "new"){
      return replyText("💡 " + user_session.name + ", sudah ada game yang dibuat, ketik '/join' untuk gabung");
    } else {
      return replyText("💡 " + user_session.name + ", sedang ada game yang berjalan");
    }
  }
  
  group_session.state = "new";
  group_session.players.length = 0;
  group_session.time_default = 30;
  group_session.time = group_session.time_default;
  group_session.round = 1;
  
  saveGroupData();
  
  let flex_msg = helper.getNewGame(group_session);
  return client.replyMessage(event.replyToken, flex_msg);
  
  function saveUserData(){
    const data = require("/app/src/data");
    data.saveUserData(user_session);
  }
  
  function saveGroupData(){
    const data = require("/app/src/data");
    data.saveGroupData(group_session);
  }
  
  function replyText(texts){
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
      event.replyToken,
      texts.map(text => ({ type: "text", text }))
    );
  }
  
  function runTimer(){
    if (group_session.time !== 0){
      clearInterval(this.timerId);
    }
		group_session.time = group_session.time_default;
		var timerId = setInterval(() => {
			console.log(group_session.time);
			if (group_session.time === 0) {
        clearInterval(this.timerId);
			} else {
				group_session.time--;
        saveGroupData();
			}
		}, 1000);
    this.timerId = timerId;
  }
  
}

module.exports = handle