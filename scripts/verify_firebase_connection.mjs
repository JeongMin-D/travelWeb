import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBtAkLtJdJ3aOoGlcHu0VdOGmABG7l_8Is",
  authDomain: "my-travel-web-a1cb7.firebaseapp.com",
  projectId: "my-travel-web-a1cb7",
  storageBucket: "my-travel-web-a1cb7.firebasestorage.app",
  messagingSenderId: "535718528471",
  appId: "1:535718528471:web:3ea9e3916f55c6fd273792",
  measurementId: "G-559P8TCQXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  console.log('Testing live Firebase Firestore connection for project: my-travel-web-a1cb7');

  const collections = ['users', 'trips', 'expenses', 'visited', 'custom_destinations'];
  for (const col of collections) {
    try {
      const snap = await getDocs(collection(db, col));
      console.log(`📂 Collection [${col}]: ${snap.size} documents found.`);
      snap.forEach(d => console.log(`   - ID: ${d.id}, data:`, JSON.stringify(d.data()).slice(0, 100)));
    } catch (e) {
      console.error(`❌ Error fetching [${col}]:`, e.message);
    }
  }
}

testConnection();
