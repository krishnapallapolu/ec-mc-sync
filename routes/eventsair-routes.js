const express = require('express');
const router = express.Router();

const {
  fetchAccessToken,
  fetchEvents,
  fetchContacts
} = require('../services/eventsair');

// === Route: Get Token ===
router.get('/token', async (req, res) => {
  try {
    const token = await fetchAccessToken();
    res.json({ access_token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Route: Get Events ===
router.get('/events', async (req, res) => {
  try {
    const token = await fetchAccessToken();
    const events = await fetchEvents(token);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Route: Get Contacts for Event ===
router.get('/events/:id/contacts', async (req, res) => {
  try {
    const token = await fetchAccessToken();
    const contacts = await fetchContacts(token, req.params.id);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
