import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore, runTransaction, terminate } from 'firebase/firestore';

const email = process.env.VUCARE_ADMIN_EMAIL;
const password = process.env.VUCARE_ADMIN_PASSWORD;
if (!email || !password) throw new Error('Set VUCARE_ADMIN_EMAIL and VUCARE_ADMIN_PASSWORD before importing.');
const seedPath = resolve(import.meta.dirname, '..', 'database', 'seed-data.json');
const payload = JSON.parse(await readFile(seedPath, 'utf8'));
if (payload.format !== 'vucare-firestore-seed-v1') throw new Error('Run npm run db:prepare first.');

const app = initializeApp({ apiKey: 'AIzaSyCY7NEUAVwMtyrWN0NDnlAFQK-jFSVscnc', authDomain: 'crm-demo-9a7ec.firebaseapp.com', projectId: 'crm-demo-9a7ec', storageBucket: 'crm-demo-9a7ec.firebasestorage.app', messagingSenderId: '324049179296', appId: '1:324049179296:web:d5e31f0de4202e885dafc5' });
const auth = getAuth(app);
const db = getFirestore(app);
try {
  await signInWithEmailAndPassword(auth, email, password);
  const writes = Object.entries(payload.collections).flatMap(([collection, records]) => records.map(record => ({ collection, record })));
  let created = 0;
  for (const { collection, record } of writes) {
    const ref = doc(db, 'crm', collection, 'records', String(record.id));
    const added = await runTransaction(db, async transaction => {
      const existing = await transaction.get(ref);
      if (existing.exists()) return false;
      transaction.set(ref, record);
      return true;
    });
    if (added) created++;
    if (!(await getDocFromServer(ref)).exists()) throw new Error(`Verification failed: ${ref.path}`);
  }
  console.log(`Verified ${writes.length} records at crm/{module}/records/{recordId}; created ${created}, preserved ${writes.length - created}.`);
  console.log('The legacy vucare_crm/state record was not changed.');
} finally { await signOut(auth).catch(() => {}); await terminate(db); }
