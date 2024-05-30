import "./Post.css";
import { React, useState, useRef } from "react";
import { firestore, storage, auth } from "../../Firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import imageCompression from "browser-image-compression";

function Post({ closeModal }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const user = auth.currentUser;
  const userID = user.uid;
  const fileInputRef = useRef();

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
        setImageUrl(url);
      } catch (error) {
        console.error("Error compressing file: ", error);
      }
    }
  };

  const removeFile = () => {
    setImageUrl("");
    fileInputRef.current.value = "";
  };

  const stopClickPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!title || !text) {
      alert("Posts must include a title and description before submission");
      return;
    }

    alert(`You entered: ${text}`);
    try {
      let postData = {
        text: text,
        timestamp: new Date(),
      };

      const userDocRef = await getDoc(doc(firestore, `users/${userID}`));
      if (userDocRef.exists()) {
        const userData = userDocRef.data();
        postData.name = userData.name;
        postData.avatar = userData.profilePic;
        postData.title = title;
      } else {
        console.log("No such document!");
      }

      if (fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const storageRef = ref(storage, `images/${compressedFile.name}`);
        const uploadResult = await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(uploadResult.ref);

        postData.imageUrl = downloadURL;
      }

      const docRef = await addDoc(collection(firestore, "posts"), {
        ...postData,
        userID: userID,
      });

      if (userID) {
        setText("");
        setImageUrl("");
        setTitle("");
        fileInputRef.current.value = "";
        closeModal(false);
        localStorage.removeItem(`userPosts_${userID}`);
        alert("Post submitted successfully!");
      } else {
        const docRef = await addDoc(collection(firestore, "posts"), {
          text: text,
          timestamp: new Date(),
        });
        localStorage.removeItem(`userPosts_${userID}`);
        alert("Post submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting post: ", error);
      alert("There was an error submitting your post. Please try again.");
    }
  };

  return (
    <div className="postBackground" onClick={() => closeModal(false)}>
      <div className="postContainer" onClick={stopClickPropagation}>
        <div className="postCloseBtn">
          <button onClick={() => closeModal(false)}> X </button>
        </div>
        <div className="postTitle">
          <h2>Tell us about your event...</h2>
        </div>
        <div className="postBody">
          <div className="postFileContainer">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              className="postFileInput"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {imageUrl && (
              <div className="imagePreview">
                <img src={imageUrl} alt="Preview" className="postImage" />
                <button className="postRemoveFileBtn btn" onClick={removeFile}>
                  Remove File
                </button>{" "}
              </div>
            )}
          </div>

          <div className="postDescContainer">
            <textarea
              type="text"
              className="postTitleInput"
              placeholder="Enter title of your event..."
              value={title}
              onChange={handleTitleChange}
            />
            <textarea
              type="text"
              className="postDescInput"
              placeholder="Description of your event..."
              value={text}
              onChange={handleTextChange}
            />
          </div>
        </div>

        <div className="PostFooter">
          <button className="postSubmitBtn btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
