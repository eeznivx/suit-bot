module.exports = {
  indexOfPlayer: function(user_session, group_session) {
		let found = -1;
		for (var i in group_session.players) {
			if (group_session.players[i].id === user_session.id) {
				found = i;
			}
		}
		return found;
	},
  random: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
  getPlayerById: function(id, group_session){
    for (var i in group_session.players) {
			if (group_session.players[i].id === id) {
				return group_session.players[i];
			}
		}
  }
}