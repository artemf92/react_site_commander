import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth
} from 'firebase/auth'

import 'firebase/database'
import { getDatabase } from 'firebase/database'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAjaskJoz-7vPeEOai8emAW7MKorbFJRIo',
  authDomain: 'sitegenerator-8af7c.firebaseapp.com',
  projectId: 'sitegenerator-8af7c',
  storageBucket: 'sitegenerator-8af7c.appspot.com',
  messagingSenderId: '290026501427',
  appId: '1:290026501427:web:3ef4563570d899eb303a46'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const database = getFirestore(app)

// console.log(db)

export const createUser = async (email, password) => {
  return createUserWithEmailAndPassword(getAuth(app), email, password)
}

export const signInUser = async (email, password) => {
  return signInWithEmailAndPassword(getAuth(app), email, password)
}

export default app
