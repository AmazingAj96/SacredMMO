// Relay.js (future multiplayer relay)
// Handles broadcasting events between players via Firebase
module.exports = function relayEvent(player, action) {
  console.log(`Relaying event: ${player} -> ${action}`);
};