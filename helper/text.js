const helper = require("/app/helper");
module.exports = {
  eliminated: function(attackerName, attackerAttack, victimName){
    let texts = [
      attackerName + ' berhasil mengalahkan ' + victimName + ' dengan ' + attackerAttack,
      victimName + ' terkena ' + attackerAttack + ' milik ' + attackerName,
      attackerName + ' melempar ' + attackerAttack + ' dan hedsot kan ' + victimName,
      "ya, dan " + victimName + " tereliminasi",
      "dua tiga " + attackerAttack + ", kalahkan " + victimName,
      victimName + ": *exists*" + "\n" + attackerName + ": i'm about to destroy this man's whole career"
    ];
    
    let text = helper.random(texts);
    return text;
  },
  
  shutdown: function(attackerName, attackerAttack, victimName){
    let texts = [
      victimName + ' GET REKT!',
      attackerName + ' berhasil menumbangkan ' + victimName,
      victimName + ' SHUTDOWN',
      victimName + ' telah gugur gais',
      victimName + "didn't stand a chance against " + attackerName,
      attackerName + " has slain " + victimName
    ];
    
    let text = helper.random(texts);
    return text;
  },
}