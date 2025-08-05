const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sacredsystemmmo-default-rtdb.firebaseio.com"
});

const db = admin.database();

const app = express();
app.use(bodyParser.json());
app.use(cors());


}

const db = admin.database();

app.post('/sync', (req, res) => {
  const { player, action, timestamp } = req.body;
  if (!player || !action) {
    return res.status(400).json({ error: 'Missing player or action' });
  }

  const logRef = db.ref('gameLogs').push();
  logRef.set({ player, action, timestamp: timestamp || new Date().toISOString() });

  console.log(`Synced: ${player} -> ${action}`);
  res.json({ status: 'success' });
});

app.get('/', (req, res) => {
  res.send('Sacred MMO Live Sync Server Running!');
});

app.get('/sync', async (req, res) => {
  res.json({ status: 'success', logs: ['test log 1', 'test log 2'] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
