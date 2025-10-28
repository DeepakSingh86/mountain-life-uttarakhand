// server.js (demo server with view/like APIs and simple admin auth)
// Install: npm i express express-session body-parser bcryptjs lowdb
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Low, JSONFile } = require('lowdb');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const adapter = new JSONFile(path.join(__dirname, 'data.json'));
const db = new Low(adapter);

(async function initDB(){
  await db.read();
  db.data ||= { assets: {}, admin: { username: 'admin', hash: bcrypt.hashSync('changeMe123', 10) } };
  await db.write();
})();

app.use(session({
  secret: 'replace-with-secure-secret',
  resave: false, saveUninitialized: false,
  cookie: { maxAge: 24*60*60*1000 }
}));

app.post('/api/bulk-metadata', async (req, res) => {
  const ids = req.body.ids || [];
  await db.read();
  const out = {};
  for (const id of ids) {
    out[id] = db.data.assets[id] || { views:0, likes:0 };
  }
  res.json(out);
});

app.post('/api/view', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error:'missing id' });
  await db.read();
  db.data.assets[id] ||= { views:0, likes:0 };
  db.data.assets[id].views += 1;
  await db.write();
  res.json({ id, views: db.data.assets[id].views });
});

app.post('/api/like', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error:'missing id' });
  await db.read();
  db.data.assets[id] ||= { views:0, likes:0, likedUsers:[] };
  db.data.assets[id].likes += 1;
  await db.write();
  res.json({ id, likes: db.data.assets[id].likes });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  const admin = db.data.admin;
  if (admin && admin.username === username && bcrypt.compareSync(password, admin.hash)) {
    req.session.isAdmin = true;
    res.json({ ok:true });
  } else res.status(401).json({ ok:false });
});

function requireAdmin(req, res, next){
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ error:'unauthorized' });
}

app.get('/admin/stats', requireAdmin, async (req, res) => {
  await db.read();
  res.json({ assets: db.data.assets });
});

app.post('/admin/logout', (req,res)=>{
  req.session.destroy(()=>res.json({ok:true}));
});

app.listen(3000, ()=>console.log('Server running on :3000'));