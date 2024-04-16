import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVcmO3ibqY6ipNsEENaU7r7nwsOMN5P6M",
  authDomain: "clubhub-ca026.firebaseapp.com",
  projectId: "clubhub-ca026",
  storageBucket: "clubhub-ca026.appspot.com",
  messagingSenderId: "1072190558895",
  appId: "1:1072190558895:web:7745514191b0563739fa5a",
  measurementId: "G-NVPCTP2SLM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      profilePic: user.photoURL,
    }, { merge: true });

    localStorage.setItem("userId", user.uid);
    window.location.reload();
  } catch (error) {
    console.error("Failed to sign in with Google: ", error);
  }
};

export { auth, firestore, signInWithGoogle };
