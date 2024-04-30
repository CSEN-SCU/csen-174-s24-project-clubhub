import React from 'react'
import "./Modal.css"
//import { React, useState } from "react";

function Modal({closeModal, clubInfo}){
    return(
        <div className = "modalBackground"> 
        <div className = "modalContainer">
        <div className="titleCloseBtn">
            <button onClick={()=> closeModal(false)}> X </button>
        </div>
            <div className = "title">
                <h1 id="clubname">{clubInfo.ClubName}</h1>
            </div>
            <div className = "body">

                <div id = "AboutUs" className = "component">
                    <h5>About Us</h5>
                    <p>{clubInfo.AboutUs}</p>
                </div>
                <div id = "AcademicBackground" className = "component">
                    <h5>Academic Background</h5> 
                    {/* for loop */}
                    <p>{clubInfo.AcademicBackground}</p>
                </div>
                <div id = "PracticeArea" className = "component">
                    <h5>Practice Area</h5>
                    {/* for loop */}
                    <p>{clubInfo.PracticeArea}</p>
                </div>

                <div id = "Contact" className ="component">
                    <h5>Contact Name</h5>
                    <p>{clubInfo.ContactName}</p>
                    <h5>Contact Email</h5>
                    <p>{clubInfo.Contact}</p>
                </div>

                <div id = "Sites" className ="component">
                    <h5>Website</h5>
                    <a>{clubInfo.Website}</a>
                    <h5>Chat Channel</h5>
                    <a>{clubInfo.ChatChannel}</a>
                </div>
                
            </div>
            <div className = "footer">
                <button>Club Profile Page</button>
            </div>
            </div>
            </div>
    )
}

export default Modal