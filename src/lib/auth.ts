import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    if (auth.currentUser) {
        return resolve(auth.currentUser);
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      () => {
        resolve(null);
      }
    );
  });
}
