import React from 'react';
import { Link } from 'react-router-dom';
import "./AccPost.css";

function AccPost({ closeModal, post }) {
    const stopClickPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modalBackground" onClick={() => closeModal()}>
            <div id='acc__modalContainer' className="modalContainer" onClick={stopClickPropagation}>
                <div className="titleCloseBtn">
                    <button onClick={() => closeModal()}>X</button>
                </div>
                <div className='acc__post__container'>
                    <h3><span>{post.name}</span> presents...</h3>
                    <div className='acc__post__content'>
                        <h2>{post.title}</h2>
                        <div className='acc__post__component'><p>{post.text}</p></div>
                        <img src={post.imageUrl} alt={post.title} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccPost;