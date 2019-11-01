const helper = require('/app/helper/flex');
function handle (client, event, args, user_session, group_session){
  let flex_text = {
    header: "hai",
    body: "hoi"
  }
  
  console.log(group_session);
  console.log(user_session);
  if (group_session.state !== "idle" && group_session.state !== 'new'){
    return replyText('💡 Tidak bisa mengganti mode saat game sedang berjalan');
  }
  
  if (args[1] === undefined){
    return replyText('💡 cth : "/mode classic" atau "/mode team"');
  }
  
  let mode = args[1];
  
  switch(mode){
    case 'classic':
    case 'team':
      group_session.mode = args[1];
      break;
      
    default:
      return replyText('💡 cth : "/mode classic" atau "/mode team"');
  }
  
  saveGroupData();
  
  replyText('💡 Game mode berhasil diubah ke ' + args[1]);
  
  
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
  
}

module.exports = handle