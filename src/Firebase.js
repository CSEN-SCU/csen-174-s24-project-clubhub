import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
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
    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        userType: "student",
        following: [],
        follower: []
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
    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        bio: "",
        userType: "club owner",
        following: [],
        follower: []
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

export { auth, firestore, storage, studentSignInWithGoogle, clubSignInWithGoogle };
