#!/bin/sh

node -e "
  const http = require('http');
  const req = http.get('http://localhost:3000/health', (res) => {
    if (res.statusCode === 200) {
      process.exit(0); // Succès
    } else {
      process.exit(1); // Échec (ex: 503 si la BDD est down)
    }
  });

  req.on('error', () => process.exit(1)); // Échec si l'application ne répond pas
"