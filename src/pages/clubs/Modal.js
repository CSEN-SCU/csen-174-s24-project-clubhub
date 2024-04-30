// import React from 'react'
import "./Modal.css";
import React from "react";
//import { React, useState } from "react";

function slugify(input) {
  if (!input) return "";

  // make lower case and trim
  var slug = input.toLowerCase().trim();

  // remove accents from charaters
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // replace invalid chars with spaces
  slug = slug.replace(/[^a-z0-9\s-]/g, " ").trim();

  // replace multiple spaces or hyphens with a single hyphen
  slug = slug.replace(/[\s-]+/g, "-");

  return slug;
}

function Modal({ closeModal, clubInfo }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={() => closeModal(false)}> X </button>
        </div>
        <div className="title">
          <h1 id="clubname">{clubInfo.ClubName}</h1>
          <div className="ProfileButton">
            <button>Club Profile Page</button>
          </div>
        </div>
        <div className="body">
          <div id="AboutUs" className="component">
            <h5>About Us</h5>
            <p className="modal__text">{clubInfo.AboutUs}</p>
          </div>
          <div id="AcademicBackground" className="component">
            <h5>Academic Background</h5>
            <div className="tags">
              {clubInfo?.AcademicBackground?.map((word, index) => (
                <span key={index} className={`${slugify(word)} modal__span`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div id="PracticeArea" className="component">
            <h5>Practice Area</h5>
            <div className="tags">
              {clubInfo?.PracticeArea?.map((word, index) => (
                <span key={index} className={`${slugify(word)} modal__span`}>
                  {word}
                </span>
              ))}
            </div>
          </div>

          <div className="twoStack">
            <div className="component" id="ContactName">
              <h5>Contact Name</h5>
              <p className="modal__text">{clubInfo.ContactName}</p>
            </div>
            <div className="component" id="ContactEmail">
              <h5>Contact Email</h5>
              <p className="modal__text">{clubInfo.Contact}</p>
            </div>
          </div>

          <div className="twoStack">
            <div className="component" id="Website">
              <h5>Website</h5>
              <a className="modal__link" href={clubInfo.Website}> {clubInfo.Website} </a>
            </div>
            <div className="component" id="ChatChannel">
              <h5>Chat Channel</h5>
              <a className="modal__link" href={clubInfo.ChatChannel}>{clubInfo.ChatChannel}</a>
            </div>
          </div>

          <div className="twoStack">
            <div className="component" id="UnderOrGrad">
              <h5>Undergrate or Graduate</h5>
              <p className="modal__text">{clubInfo.UndergraduateorGraduate}</p>
            </div>
            <div className="component" id="CurrentProjects">
              <h5>Current Projects</h5>
              <p className="modal__text">{clubInfo.CurrentProjects}</p>
            </div>
          </div>

          <div className="twoStack">
            <div className="component" id="TimeCommitment">
              <h5>Time Commitment</h5>
              <p className="modal__text">{clubInfo.TimeCommitment}</p>
            </div>
            <div className="component" id="RelaxedSerious">
              <h5>Relaxed or Seriousness</h5>
              <p className="modal__text">{clubInfo.RelaxedSerious}</p>
            </div>
          </div>

          <div className="twoStack">
            <div className="component" id="MembershipFee">
              <h5>Membership Fee</h5>
              <p className="modal__text">{clubInfo.MembershipFee}</p>
            </div>
            <div className="component" id="NationalOrganization">
              <h5>National Organization</h5>
              <p className="modal__text">{clubInfo.NationalOrganization}</p>
            </div>
          </div>

          <div className="twoStack">
            <div className="component" id="IntroductionVideo">
              <h5>Introduction Video</h5>
              <p className="modal__text">{clubInfo.IntroductionVideo}</p>
            </div>
            <div className="component" id="CoverPhoto">
              <h5>Cover Photo</h5>
              <p className="modal__text">{clubInfo.CoverPhoto}</p>
              {/* Need to find how to access this */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
