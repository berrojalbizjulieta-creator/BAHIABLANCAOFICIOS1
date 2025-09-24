// load-data.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, writeBatch } from 'firebase/firestore';

// IMPORTANTE: Reemplaza esto con tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAx9ZN9RvrruSNxc7CE-Xqo7AARhpNKmrk",
  authDomain: "studio-4820039016-5ae38.firebaseapp.com",
  projectId: "studio-4820039016-5ae38",
  storageBucket: "studio-4820039016-5ae38.appspot.com",
  messagingSenderId: "821979814317",
  appId: "1:821979814317:web:abd23395565fe4e58f6924"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AD_BANNERS_DATA = [
  {
    id: 1,
    imageUrl: 'https://storage.googleapis.com/studio-4820039016-5ae38.appspot.com/adBanners/ad1.jpg',
    alt: 'Publicidad de herramientas',
    imageHint: 'construction tools',
    storagePath: 'adBanners/ad1.jpg'
  },
  {
    id: 2,
    imageUrl: 'https://storage.googleapis.com/studio-4820039016-5ae38.appspot.com/adBanners/ad2.jpg',
    alt: 'Publicidad de materiales de construcción',
    imageHint: 'building materials',
    storagePath: 'adBanners/ad2.jpg'
  },
  {
    id: 3,
    imageUrl: 'https://storage.googleapis.com/studio-4820039016-5ae38.appspot.com/adBanners/ad3.jpg',
    alt: 'Publicidad de productos de limpieza',
    imageHint: 'cleaning supplies',
    storagePath: 'adBanners/ad3.jpg'
  },
];


async function clearCollection(collectionName) {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
        console.log(`La colección ${collectionName} ya está vacía.`);
        return;
    }
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Colección ${collectionName} limpiada.`);
}


async function uploadData() {
  try {
    console.log('Iniciando carga de datos...');
    
    // Limpiar la colección antes de cargar nuevos datos
    await clearCollection('adBanners');

    const bannersCollection = collection(db, 'adBanners');
    for (const banner of AD_BANNERS_DATA) {
      const { id, ...bannerData } = banner; // Excluimos el id del objeto a guardar
      await addDoc(bannersCollection, bannerData);
      console.log(`Banner "${banner.alt}" cargado.`);
    }

    console.log('¡Carga de datos completada exitosamente!');
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  } finally {
    // Firebase Node.js SDK no necesita cerrar la conexión explícitamente
    // pero si este script se ejecuta y no termina, puedes añadir un process.exit()
    process.exit(0);
  }
}

uploadData();
