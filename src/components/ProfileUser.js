import React, { useState, useContext, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import UserDataContext from "../contexts/userData";
import { Button, TextField, useTheme, Typography } from "@mui/material";
import Toastify from "toastify-js";

const ProfileUser = () => {
  const { userInfo, setUserInfo } = useContext(UserDataContext);
  const { user } = useAuth();
  const [updateUserProfile, setUpdateUserProfile] = useState();
  const [resendProfile, setResendProfile] = useState();
  const theme = useTheme();

  //fetch user info from database
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { error, data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user?.id);
        if (error) throw new Error(error);
        if (data) {
          if (data.length === 0) {
            await supabase
              .from("profiles")
              .insert({ username: user?.email, user_id: user?.id });
          } else {
            setUserInfo(data[0]);
          }
        }
      } catch (error) {
        setUserInfo([]);
      }
    };
    fetchUserInfo();
  }, [user, resendProfile, setUserInfo]);

  const handleChangeUser = (e) => {
    setUpdateUserProfile({
      ...updateUserProfile,
      [e.target.name]: e.target.value,
    });
  };

  //retrieve updated profile info
  const updateName = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("profiles")
      .update(updateUserProfile)
      .eq("user_id", user?.id);
    if (error) throw error;
    Toastify({
      text: `Profile information updated`,
      duration: 3000,
      position: "left",
    }).showToast();
    setResendProfile(!resendProfile);
    setUpdateUserProfile();
    e.target.parentElement.reset();
  };

  return (
    <>
      <Typography variant="h5">Personal Information</Typography>
      <form
        onChange={handleChangeUser}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          variant="standard"
          helperText="Full Name"
          name="full_name"
          placeholder={
            Object.keys(userInfo).length !== 0 ? userInfo.full_name : ""
          }
          theme={theme}
        />
        <Button
          theme={theme}
          type="submit"
          onClick={(e) => {
            updateName(e);
          }}
          variant="contained"
        >
          Update Profile
        </Button>
      </form>
    </>
  );
};

export default ProfileUser;
