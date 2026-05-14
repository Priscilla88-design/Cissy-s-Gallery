import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Album } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrors';

const COLLECTION_NAME = 'albums';

export function subscribeToAlbums(userId: string, callback: (albums: Album[]) => void) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('ownerId', '==', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const albums = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Album[];
    callback(albums);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  });
}

export async function createAlbum(name: string, description: string, userId: string): Promise<string> {
  const albumData = {
    name,
    description,
    ownerId: userId,
    createdAt: Date.now(),
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), albumData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
    return '';
  }
}

export async function deleteAlbum(albumId: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, albumId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${albumId}`);
  }
}
