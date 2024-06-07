import "./DeletePost.css";

function DeletePost({ closeModal, post, deletePost }) {
  const stopClickPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modalBackground" onClick={() => closeModal()}>
      <div
        id="delete__modalContainer"
        className="modalContainer deleteModalContainer"
        onClick={stopClickPropagation}
      >
        <div className="titleCloseBtn">
          <button onClick={() => closeModal()}>X</button>
        </div>
        <div className="delete__post__container">
          <h3>Are you sure you want to delete this post?</h3>
          <div className="button-container">
            <button className="btn cancel_btn" onClick={() => closeModal()}>
              Cancel
            </button>
            <button className="btn" onClick={() => deletePost(post.id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePost;
