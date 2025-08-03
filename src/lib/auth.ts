import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

// This function is intended for client-side use, for example in a useEffect hook.
// For server actions, the user should be passed from the client.
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
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
