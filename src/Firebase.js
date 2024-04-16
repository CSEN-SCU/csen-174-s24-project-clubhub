import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
    })
    .catch((error) => {
      console.log(error);
    });
};
