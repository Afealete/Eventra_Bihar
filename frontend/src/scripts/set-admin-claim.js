#!/usr/bin/env node
const { cert, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

function getServiceAccountFromEnv() {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) return null;
  return {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    // privateKey may have escaped newlines; convert them back
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
}

const serviceAccount = getServiceAccountFromEnv();
if (!serviceAccount) {
  console.error('Missing Firebase service account environment variables.');
  console.error('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

initializeApp({
  credential: cert(serviceAccount),
});

const email = process.argv[2];
if (!email) {
  console.error('Usage: node src/scripts/set-admin-claim.js user@example.com');
  process.exit(1);
}

(async () => {
  try {
    const auth = getAuth();
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully set admin claim for ${email} (uid: ${user.uid})`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to set admin claim:', err.message || err);
    process.exit(1);
  }
})();
