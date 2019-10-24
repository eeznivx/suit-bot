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
    for (let i = 0; i < group_session.players.length; i++) {
			if (group_session.players[i].id === id) {
				return i;
			}
		}
  },
  shuffleArray: function(o) {
		for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
  
  isEven: function(n){
    return n % 2 == 0;
  },
  
  
}