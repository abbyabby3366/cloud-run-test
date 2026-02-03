require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

// Middleware to log every visit
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Visit from ${req.ip}`);
  next();
});

// Function to serve index.html with injected secret
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace placeholder with secret from .env
  const secret = process.env.SECRET_PHRASE || "No secret found";
  content = content.replace('{{SECRET_PHRASE}}', secret);
  
  res.send(content);
});

// Debug Logging Endpoints
app.get('/log/error', (req, res) => {
  console.error('CRITICAL: Manual error triggered from UI!');
  res.json({ status: 'Error logged to server console' });
});

app.get('/log/warn', (req, res) => {
  console.warn('WARNING: Manual warning triggered from UI.');
  res.json({ status: 'Warning logged to server console' });
});

app.get('/log/info', (req, res) => {
  console.info('INFO: Manual info log triggered from UI.');
  res.json({ status: 'Info logged to server console' });
});

app.get('/log/success', (req, res) => {
  console.log('✅ SUCCESS: Everything is running perfectly.');
  res.json({ status: 'Success message logged' });
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
