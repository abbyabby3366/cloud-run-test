require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

// Helper for Google Cloud Structured Logging
const cloudLog = (severity, message) => {
  const logEntry = {
    severity: severity.toUpperCase(),
    message: message,
    component: "cloud-run-demo",
    time: new Date().toISOString()
  };
  console.log(JSON.stringify(logEntry));
};

// Middleware to log every visit
app.use((req, res, next) => {
  cloudLog('INFO', `${req.method} ${req.url} - Visit from ${req.ip}`);
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
app.get('/log/emergency', (req, res) => {
  cloudLog('EMERGENCY', '🚨 SYSTEM DOWN! This is an Emergency log.');
  res.json({ status: 'Emergency logged to server' });
});

app.get('/log/alert', (req, res) => {
  cloudLog('ALERT', '🔔 Action required: Alerting developers.');
  res.json({ status: 'Alert logged to server' });
});

app.get('/log/critical', (req, res) => {
  cloudLog('CRITICAL', '⚠️ CRITICAL: Core component failure.');
  res.json({ status: 'Critical log sent' });
});

app.get('/log/error', (req, res) => {
  cloudLog('ERROR', '❌ Just a standard Error log.');
  res.json({ status: 'Error logged' });
});

app.get('/log/warn', (req, res) => {
  cloudLog('WARNING', '⚠️ Warning: Unexpected input received.');
  res.json({ status: 'Warning logged' });
});

app.get('/log/info', (req, res) => {
  cloudLog('INFO', 'ℹ️ Basic Info log.');
  res.json({ status: 'Info logged' });
});

app.get('/log/success', (req, res) => {
  cloudLog('NOTICE', '✅ Everything is running perfectly.');
  res.json({ status: 'Notice logged' });
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
