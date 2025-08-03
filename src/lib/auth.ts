import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}
