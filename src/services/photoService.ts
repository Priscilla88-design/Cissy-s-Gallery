import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Photo } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrors';

const COLLECTION_NAME = 'photos';

export function subscribeToPhotos(userId: string, albumId: string, callback: (photos: Photo[]) => void) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('albumId', '==', albumId)
  );

  return onSnapshot(q, (snapshot) => {
    const photos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Photo[];
    
    // Sort in-memory as requested to avoid manual index requirement
    const sortedPhotos = photos.sort((a, b) => b.createdAt - a.createdAt);
    callback(sortedPhotos);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  });
}

export async function addPhoto(url: string, title: string, description: string, userId: string, category: string, albumId: string): Promise<string> {
  const photoData = {
    url, // This is the base64 string
    title,
    description,
    userId,
    category,
    albumId,
    createdAt: Date.now(),
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), photoData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    return '';
  }
}

export async function deletePhoto(photoId: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, photoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${photoId}`);
  }
}
