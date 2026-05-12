import { collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, Timestamp, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Photo } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrors';

const COLLECTION_NAME = 'photos';

export function subscribeToPhotos(userId: string, callback: (photos: Photo[]) => void) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const photos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Photo[];
    callback(photos);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  });
}

export async function addPhoto(url: string, title: string, description: string, userId: string, category: string): Promise<string> {
  const photoData = {
    url,
    title,
    description,
    userId,
    category,
    albumId: 'all',
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
