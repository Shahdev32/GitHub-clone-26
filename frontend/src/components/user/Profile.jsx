import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../user/Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />

      {/* Navigation Tabs */}
      <UnderlineNav aria-label="Repository" className="profile-tabs">
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": { textDecoration: "underline", color: "white" },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/repo")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": { textDecoration: "underline", color: "white" },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        id="logout"
      >
        Logout
      </button>

      {/* Centered Profile + Heatmap */}
      <div className="profile-page-container">
        <div className="profile-page-wrapper">
          {/* User Profile Section */}
          <div className="user-profile-section">
            <div className="profile-image"></div>
            <div className="name">
              <h3>{userDetails.username}</h3>
            </div>
            <button className="follow-btn">Follow</button>
            <div className="follower">
              <p>10 Follower</p>
              <p>3 Following</p>
            </div>
          </div>

          {/* HeatMap Section */}
          <div className="heat-map-section">
            <HeatMapProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
