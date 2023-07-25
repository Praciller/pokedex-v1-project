import React from "react";
import Wrapper from "../sections/Wrapper";
import avatarImage from "../assets/Pakon.jpg";
import {FaInstagram, FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

function About() {
  return (
    <div className="profile">
      <img src={avatarImage} alt="" className="profile-image" />
      <h1 className="profile-text">Hi, I'm Pakon Poomson</h1>
      <h2 className="profile-text">My Fisrt Project ReactJS</h2>
      <h4 className="profile-text">
        This project is created with React, Redux Toolkit, Typescript, Firebase and SCSS with Netlify Deployment.
      </h4>
      <div className="profile-links">
        <a href="https://github.com/Praciller">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/pakon-poomson/">
          <FaLinkedin />
        </a>
        <a href="https://www.facebook.com/Pracill">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com/pracillct/">
          <FaInstagram />
        </a>
      </div>
    </div>
  );
}

export default Wrapper(About);
