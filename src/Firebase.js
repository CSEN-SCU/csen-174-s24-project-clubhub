import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

const studentSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user.email.endsWith("@scu.edu")) {
      throw new Error("SCU_EMAIL_REQUIRED");
    }

    const userRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(userRef);

    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        profilePic: docSnap.exists()
          ? docSnap.data().profilePic
          : user.photoURL,
        bio: docSnap.exists() ? docSnap.data().bio : "",
        userType: "student",
        following: docSnap.exists() ? docSnap.data().following : [],
        follower: docSnap.exists() ? docSnap.data().follower : [],
      },
      { merge: true }
    );

    localStorage.setItem("userId", user.uid);
  } catch (error) {
    console.error("Failed to sign in with Google:", error.message);
    throw error;
  }
};

const clubSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(firestore, "users", user.uid);
    const docSnap = await getDoc(userRef);

    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        profilePic: docSnap.exists()
          ? docSnap.data().profilePic
          : user.photoURL,
        bio: docSnap.exists() ? docSnap.data().bio : "",
        userType: "club owner",
        following: docSnap.exists() ? docSnap.data().following : [],
        follower: docSnap.exists() ? docSnap.data().follower : [],
      },
      { merge: true }
    );

    localStorage.setItem("userId", user.uid);
    const clubsRef = collection(firestore, "clubs");
    const q = query(clubsRef, where("Contact", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error("No matching club found for email:", user.email);
      throw new Error("NOT_A_CLUB_OWNER");
    } else {
      const userRef = doc(firestore, "users", user.uid);
      await setDoc(
        userRef,
        {
          name: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          userType: "club owner",
        },
        { merge: true }
      );
      localStorage.setItem("userId", user.uid);
    }
  } catch (error) {
    console.error("Failed to sign in with Google:", error.message);
    throw error;
  }
};

export {
  auth,
  firestore,
  storage,
  studentSignInWithGoogle,
  clubSignInWithGoogle,
};
