const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Base routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to EventsAir API</h1>
    <p>Use the following endpoints:</p>
    <ul>
      <li><a href="/api/token">Get Access Token</a></li>
      <li><a href="/api/events">Fetch Events</a></li>
      <li><a href="/api/events/:id/contacts">Fetch Contacts</a></li>
    </ul>
  `);
});

// Plug in the modular route
const eventsAirRoutes = require('./routes/eventsair-routes');
app.use('/api', eventsAirRoutes);  // routes are now under /api/...

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
