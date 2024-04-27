const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert('./clubhub-ca026-firebase-adminsdk-z6y6t-649749ce21.json'),
});

const db = admin.firestore();

const importData = async () => {
  const data = JSON.parse(fs.readFileSync('./pages/clubs/ClubInfo.json', 'utf8'));

  for (const [key, value] of Object.entries(data)) {
    const docRef = db.collection('clubs').doc(key);
    await docRef.set(value, { merge: true })
      .catch(error => console.error('Error writing document: ', error));
  }
};

importData();

