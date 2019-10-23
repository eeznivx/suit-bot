const helper = require("/app/helper");
module.exports = {
  eliminated: function(attackerName, attackerAttack, victimName){
    let texts = [
      attackerName + ' berhasil mengalahkan ' + victimName + ' dengan ' + attackerAttack,
      victimName + ' terkena ' + attackerAttack + ' milik ' + attackerName,
      attackerName + ' melempar ' + attackerAttack + ' dan hedsot kan ' + victimName
    ];
    
    let text = helper.random(texts);
    //return console.log('texts eliminated', text);
    return text;
  }
}