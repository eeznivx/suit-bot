const helper = require("/app/helper");
module.exports = {
  eliminated: function(attackerName, attackerAttack, victimName){
    let texts = [
      attackerName + ' berhasil mengalahkan ' + victimName + ' dengan ' + attackerAttack,
      victimName + ' terkena ' + attackerAttack + ' milik ' + attackerName,
      attackerName + ' melempar ' + attackerAttack + ' dan hedsot kan ' + victimName
    ];
    
    let text = helper.random(texts);
    return text;
  },
  
  shutdown: function(attackerName, attackerAttack, victimName){
    let texts = [
      victimName + ' GET REKT!',
      attackerName + ' berhasil menumbangkan ' + victimName,
      victimName + ' SHUTDOWN',
      victimName + ' telah gugur gais'
    ];
    
    let text = helper.random(texts);
    return text;
  },
}