import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// NPC Listener
onValue(ref(db, 'realtime/npcs'), (snapshot) => {
  const div = document.getElementById('npcs');
  div.innerHTML = '';
  snapshot.forEach((npc) => {
    const data = npc.val();
    div.innerHTML += `<p>🧙 ${data.name} (${data.type}) - ${data.realm}</p>`;
  });
});

// Raids Listener
onValue(ref(db, 'realtime/raids'), (snapshot) => {
  const div = document.getElementById('raids');
  div.innerHTML = '';
  snapshot.forEach((raid) => {
    const data = raid.val();
    div.innerHTML += `<p>⚔️ ${data.name} - Power: ${data.power}</p>`;
  });
});

// Logs Listener
onValue(ref(db, 'realtime/logs'), (snapshot) => {
  const div = document.getElementById('logs');
  div.innerHTML = '';
  snapshot.forEach((log) => {
    const data = log.val();
    div.innerHTML += `<p>📜 ${data.message}</p>`;
  });
});

// ChatGPT Sync Example (spawn NPC)
window.spawnNPC = function(name, type, realm) {
  push(ref(db, 'realtime/npcs'), {
    name,
    type,
    realm,
    timestamp: Date.now()
  });
};

window.addLog = function(message) {
  push(ref(db, 'realtime/logs'), {
    message,
    timestamp: Date.now()
  });
};
