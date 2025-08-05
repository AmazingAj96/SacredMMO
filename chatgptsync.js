// ChatGPTSync client-side example
// This file can POST every ChatGPT action to the /sync endpoint
async function syncAction(player, action) {
  const payload = {
    player,
    action,
    timestamp: new Date().toISOString()
  };

  await fetch('https://sacred-mmo.onrender.com/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

// Example usage:
syncAction('Aj', '*starts his adventure in the Toon Realm*');