require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

// Function to serve index.html with injected secret
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace placeholder with secret from .env
  const secret = process.env.SECRET_PHRASE || "No secret found";
  content = content.replace('{{SECRET_PHRASE}}', secret);
  
  res.send(content);
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
