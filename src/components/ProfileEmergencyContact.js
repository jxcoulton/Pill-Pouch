import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import { Button, TextField, useTheme, Typography } from "@mui/material";
import Toastify from "toastify-js";

const ProfileEmergencyContact = () => {
  const { user } = useAuth();
  const [userEmerContact, setUserEmerContact] = useState([]);
  const [updateEmergencyContact, setUpdateEmergencyContact] = useState([]);
  const [resendEC, setResendEC] = useState();
  const theme = useTheme();

  //get emergency contact info from database on change to user or update
  useEffect(() => {
    const fetchUserEmerContact = async () => {
      try {
        const { error, data } = await supabase
          .from("emergency_contact")
          .select("*")
          .eq("user_id", user?.id);
        if (error) throw new Error(error);
        if (data) {
          if (data.length === 0) {
            await supabase
              .from("emergency_contact")
              .insert({ user_id: user?.id });
          } else {
            setUserEmerContact(data[0]);
          }
        }
      } catch (error) {
        setUserEmerContact([]);
      }
    };
    fetchUserEmerContact();
  }, [user, resendEC, setUserEmerContact]);

  const handleChangeEC = (e) => {
    setUpdateEmergencyContact({
      ...updateEmergencyContact,
      [e.target.name]: e.target.value,
    });
  };

  //update database emergency contact
  const updateEC = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("emergency_contact")
      .update(updateEmergencyContact)
      .eq("user_id", user?.id);
    if (error) throw error;

    Toastify({
      text: `Emergency contact information updated`,
      duration: 3000,
      position: "left",
    }).showToast();
    setResendEC(!resendEC);
    setUpdateEmergencyContact();

    e.target.parentElement.reset();
  };

  return (
    <>
      <Typography variant="h5">Emergency Contact</Typography>
      <form
        onChange={handleChangeEC}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField
          variant="standard"
          helperText="Full Name"
          placeholder={
            userEmerContact === undefined ? "" : userEmerContact.ec_full_name
          }
          name="ec_full_name"
          theme={theme}
        />
        <TextField
          variant="standard"
          helperText="Relationship"
          placeholder={
            userEmerContact === undefined ? "" : userEmerContact.ec_relationship
          }
          name="ec_relationship"
          theme={theme}
        />
        <TextField
          variant="standard"
          helperText="Phone Number"
          placeholder={
            userEmerContact === undefined ? "" : userEmerContact.ec_phone
          }
          name="ec_phone"
          theme={theme}
        />
        <Button
          theme={theme}
          type="submit"
          onClick={(e) => {
            updateEC(e);
          }}
          variant="contained"
        >
          Update Emergency Contact
        </Button>
      </form>
    </>
  );
};

export default ProfileEmergencyContact;
