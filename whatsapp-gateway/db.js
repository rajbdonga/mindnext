/**
 * MindNext MongoDB Engine & Hybrid Sync Manager
 * Supports MongoDB local (mongodb://127.0.0.1:27017/mindnext) or MongoDB Atlas URI.
 * Provides graceful fallback to local JSON if MongoDB is ever temporarily unavailable.
 */

const mongoose = require('mongoose');
const Campaign = require('./models/Campaign');
const Contact = require('./models/Contact');
const Inquiry = require('./models/Inquiry');
const ActivityLog = require('./models/ActivityLog');
const FastShareFile = require('./models/FastShareFile');

const DEFAULT_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindnext';

let dbState = {
  isConnected: false,
  uri: DEFAULT_URI,
  dbName: 'mindnext',
  host: '127.0.0.1',
  port: 27017,
  lastConnectedAt: null,
  error: null
};

async function connectToMongo(uriToUse = DEFAULT_URI) {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    console.log(`[MongoDB] Connecting to ${uriToUse} ...`);
    const conn = await mongoose.connect(uriToUse, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000
    });

    dbState.isConnected = true;
    dbState.uri = uriToUse;
    dbState.dbName = conn.connection.name || 'mindnext';
    dbState.host = conn.connection.host || '127.0.0.1';
    dbState.port = conn.connection.port || 27017;
    dbState.lastConnectedAt = new Date();
    dbState.error = null;

    console.log(`[MongoDB] SUCCESS: Connected to MongoDB database "${dbState.dbName}" at ${dbState.host}:${dbState.port}`);
    return { ok: true, state: getDbStatus() };
  } catch (err) {
    dbState.isConnected = false;
    dbState.error = err.message;
    console.warn(`[MongoDB] Connection warning: ${err.message}. Operating in hybrid local JSON fallback mode.`);
    return { ok: false, error: err.message, state: getDbStatus() };
  }
}

mongoose.connection.on('disconnected', () => {
  dbState.isConnected = false;
  console.log('[MongoDB] Disconnected from server. Operating in local fallback mode.');
});

mongoose.connection.on('reconnected', () => {
  dbState.isConnected = true;
  dbState.lastConnectedAt = new Date();
  console.log('[MongoDB] Reconnected successfully to database.');
});

function getDbStatus() {
  return {
    ok: true,
    connected: dbState.isConnected,
    engine: dbState.isConnected ? 'mongodb' : 'json_fallback',
    uri: dbState.uri.replace(/:([^:@]{3,})@/, ':***@'), // hide password in cloud URIs
    dbName: dbState.dbName,
    host: dbState.host,
    port: dbState.port,
    lastConnectedAt: dbState.lastConnectedAt,
    error: dbState.error
  };
}

module.exports = {
  connectToMongo,
  getDbStatus,
  models: {
    Campaign,
    Contact,
    Inquiry,
    ActivityLog,
    FastShareFile
  }
};
