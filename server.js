const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/products', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'products.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to load products' });
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.post('/api/intake', (req, res) => {
  const entry = { ...req.body, date: new Date().toISOString() };
  const file = path.join(__dirname, 'data', 'intakes.json');
  let list = [];
  try {
    if (fs.existsSync(file)) {
      list = JSON.parse(fs.readFileSync(file));
    }
    list.push(entry);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ error: 'Unable to save intake' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
