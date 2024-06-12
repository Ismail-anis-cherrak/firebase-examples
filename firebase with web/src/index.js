/*
  * To install Firebase in your project, run the following command in your terminal:
  * npm install firebase
*/


// * Import the necessary Firebase functions
import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged
} from 'firebase/auth'

// * Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDmXgb_58lO7aK_ujN37pGlNxzWGEU0YpI",
  authDomain: "fb9-sandbox.firebaseapp.com",
  projectId: "fb9-sandbox",
  storageBucket: "fb9-sandbox.appspot.com",
  messagingSenderId: "867529587246",
  appId: "1:867529587246:web:dc754ab7840c737f47bdbf"
}

// ! Initialize Firebase
initializeApp(firebaseConfig)

// * Initialize Firestore service
const db = getFirestore()
// * Initialize Firebase Auth service
const auth = getAuth()

// * Reference to the 'books' collection in Firestore
const colRef = collection(db, 'books')

// ? Query to get books by a specific author and order by creation date
const q = query(colRef, where("author", "==", "patrick rothfuss"), orderBy('createdAt'))

// ! Realtime collection data listener
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = []
  snapshot.docs.forEach(doc => {
    books.push({ ...doc.data(), id: doc.id })
  })
  console.log(books)
})

// ? Adding documents to the 'books' collection
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

// ? Deleting documents from the 'books' collection
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
})

// ? Fetching a single document (& realtime updates)
const docRef = doc(db, 'books', 'gGu4P9x0ZHK9SspA1d9j')

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})

// ? Updating a document in the 'books' collection
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title'
  })
  .then(() => {
    updateForm.reset()
  })
})

// ? Signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// ? Logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user logged in:', cred.user)
      loginForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// ! Subscribing to auth changes
// * This function listens for authentication state changes.
// * Whenever a user logs in or out, this listener triggers, allowing us to respond accordingly.
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
})

// ? Unsubscribing from changes (auth & db)
// * This section allows us to unsubscribe from all real-time listeners when we no longer need them.
// * It's useful to avoid memory leaks or unwanted updates.
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})

