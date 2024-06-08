import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVcmO3ibqY6ipNsEENaU7r7nwsOMN5P6M",
  authDomain: "clubhub-ca026.firebaseapp.com",
  projectId: "clubhub-ca026",
  storageBucket: "clubhub-ca026.appspot.com",
  messagingSenderId: "1072190558895",
  appId: "1:1072190558895:web:7745514191b0563739fa5a",
  measurementId: "G-NVPCTP2SLM",
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

    const userQuery = query(
      collection(firestore, "users"),
      where("email", "==", user.email)
    );
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      userQuerySnapshot.forEach(async (doc) => {
        const existingData = doc.data();
        if (doc.id !== user.uid) {
          await setDoc(userRef, existingData, { merge: true });
          await deleteDoc(doc.ref);
        }
      });
    }

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
