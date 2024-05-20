import "./Post.css";
import { React, useState, useRef } from "react";
import { firestore, storage, auth } from "../../Firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

function Post({ closeModal }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State for image preview URL
  const user = auth.currentUser;
  const userID = user.uid;

  // Ref to control the file input element
  const fileInputRef = useRef();

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle file input change and create a preview URL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); // Create URL for the selected file
      setImageUrl(url); // Store the preview URL
    }
  };

  // Clear the file selection and image preview
  const removeFile = () => {
    setImageUrl(""); // Clear the preview URL
    fileInputRef.current.value = ""; // Reset the file input
  };

  const stopClickPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    alert(`You entered: ${text}`);
    try {
      let postData = {
        text: text,
        timestamp: new Date(),
      };

      const userDocRef = await getDoc(doc(firestore, `users/${userID}`));
      if (userDocRef.exists()) {
        const userData = userDocRef.data();
        postData.name = userData.name; // Include the user's name in the post data
        postData.title = title;
      } else {
        console.log("No such document!");
      }

      if (fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);

        postData.imageUrl = downloadURL; // Include the image URL
      }

      // Add to the main collection (e.g., "posts")
      const docRef = await addDoc(collection(firestore, "posts"), {
        ...postData,
        userID: userID, // Add user ID to the main post
      });

      // Add to the user's document or collection
      if (userID) {
        setText("");
        setImageUrl("");
        setTitle("");
        fileInputRef.current.value = ""; //either reset the feild and leave the modal open

        closeModal(false); //or close the modal

        alert("Post submitted successfully!");
      } else {
        // If no file is selected, just add the text to Firestore
        const docRef = await addDoc(collection(firestore, "posts"), {
          text: text,
          timestamp: new Date(),
        });

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
          {/* File input for image upload */}
          <div className="postFileContainer">
            <input
              type="file"
              className="postFileInput"
              ref={fileInputRef} // Set the ref to the file input
              onChange={handleFileChange}
            />
            {imageUrl && (
              <div className="imagePreview">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="postImage" // CSS class for styling
                />
                <button className="postRemoveFileBtn btn" onClick={removeFile}>
                  Remove File
                </button>{" "}
              </div>
            )}
          </div>

          <div className = "postDescContainer">
          <textarea
              type="text"
              className = "postTitleInput"
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
