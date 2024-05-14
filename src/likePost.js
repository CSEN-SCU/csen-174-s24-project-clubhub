import { firestore } from './Firebase';
import { doc, setDoc, FieldValue } from "firebase/firestore";

const likePost = async (postId) => {
  const postRef = doc(firestore, "posts", postId);
  await setDoc(postRef, { likes: FieldValue.increment(1) }, { merge: true });
};

export default likePost;
