import { useHistory } from "react-router";
import { useState } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import Toastify from "toastify-js";
import { useEffect } from "react/cjs/react.development";

const Profile = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]);
  const [userEmerContact, setUserEmerContact] = useState([]);
  const [updateUserProfile, setUpdateUserProfile] = useState([]);
  const [updateEmergencyContact, setUpdateEmergencyContact] = useState([]);
  const [addedAllergy, setAddedAllergy] = useState([]);

  useEffect(() => {
    getUserProfile();
    getUserAllergies();
    getUserEmerContact();
  }, []);

  async function getUserProfile() {
    try {
      const { error, data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserInfo([]);
      if (data) setUserInfo(data[0]);
    } catch {
      setUserInfo([]);
    }
  }

  async function getUserEmerContact() {
    try {
      const { error, data } = await supabase
        .from("emergency_contact")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserEmerContact([]);
      if (data) setUserEmerContact(data[0]);
    } catch {
      setUserEmerContact([]);
    }
  }

  async function getUserAllergies() {
    try {
      const { error, data } = await supabase
        .from("allergies")
        .select("*")
        .eq("user_id", user?.id);
      if (error) setUserAllergies([]);
      if (data) setUserAllergies(data);
    } catch {
      setUserAllergies([]);
    }
  }

  async function handleReturnToPage() {
    history.push("/");
  }

  const allergyList = () => {
    const allergies = [];
    userAllergies.forEach((allergy, index) => {
      allergies.push(
        <li id={allergy.allergy_id} key={index} className="currentMedsList">
          <h5 value={index}>{allergy.allergen}</h5>
          <input
            type="image"
            className="delete_button"
            onClick={deleteCurrentAllergy}
            title="Delete"
            src="https://www.nicepng.com/png/detail/207-2079285_delete-comments-delete-icon-transparent.png"
            alt="delete button"
          />
        </li>
      );
    });
    return allergies;
  };

  async function deleteCurrentAllergy(e) {
    e.preventDefault();
    const allergyId = e.target.parentElement.id;
    const allergyName = e.target.previousElementSibling.innerHTML;
    const { error } = await supabase
      .from("allergies")
      .delete()
      .eq("user_id", user?.id)
      .eq("allergy_id", allergyId);
    if (error) {
      Toastify({
        text: `something went wrong`,
        duration: 3000,
      }).showToast();
    } else {
      Toastify({
        text: `${allergyName} allergy has be removed`,
        duration: 3000,
      }).showToast();
    }
    getUserAllergies();
  }

  const handleChangeUser = (e) => {
    setUpdateUserProfile({
      ...updateUserProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeEC = (e) => {
    setUpdateEmergencyContact({
      ...updateEmergencyContact,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAllergy = (e) => {
    setAddedAllergy(e.target.value);
  };

  const updateName = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("profiles")
      .update(updateUserProfile)
      .eq("user_id", user?.id); //matching id of row to update
    if (error) throw error;

    Toastify({
      text: `your profile has been updated`,
      duration: 3000,
    }).showToast();
    getUserProfile();
    setUpdateUserProfile([]);
    e.target.parentElement.reset();
  };

  const updateEC = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("emergency_contact")
      .update(updateEmergencyContact)
      .eq("user_id", user?.id); //matching id of row to update
    if (error) throw error;

    Toastify({
      text: `emergency contact has been updated`,
      duration: 3000,
    }).showToast();
    getUserEmerContact();
    setUpdateEmergencyContact([]);
    e.target.parentElement.reset();
  };

  const updateAllergy = async (e) => {
    e.preventDefault();

    await supabase
      .from("allergies")
      .insert({ allergen: addedAllergy, user_id: user?.id })
      .eq("user_id", user?.id); //matching id of row to update

    Toastify({
      text: `${addedAllergy} allergy has be added`,
      duration: 3000,
    }).showToast();
    getUserAllergies();
    setAddedAllergy([]);
    e.target.parentElement.reset();
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <h3>My Information</h3>
        <form onChange={handleChangeUser}>
          <h5>
            Name: {userInfo.full_name !== null ? userInfo.full_name : `N/A`}
          </h5>
          <input placeholder="full name" name="full_name" />
          <h5>
            Username: {userInfo.username !== null ? userInfo.username : `N/A`}
          </h5>
          <input placeholder="username" name="username" />
          <br />
          <button
            onClick={(e) => {
              updateName(e);
            }}
          >
            Update Profile
          </button>
        </form>
      </div>
      <div>
        <h3>My Allergies</h3>
        <h5>
          Allergies:
          {Object.keys(userAllergies).length !== 0 ? allergyList() : `N/A`}
        </h5>
        <form onChange={handleAddAllergy}>
          <input placeholder="add allergy" name="allergen" />
          <br />
          <button
            onClick={(e) => {
              updateAllergy(e);
            }}
          >
            Add Allergy
          </button>
        </form>
      </div>
      <div>
        <h3>My Contacts</h3>
        <form onChange={handleChangeEC}>
          <h5>
            Emergency Contact Name:{" "}
            {userEmerContact.ec_full_name !== null
              ? userEmerContact.ec_full_name
              : `N/A`}
          </h5>
          <input placeholder="full name" name="ec_full_name" />
          <h5>
            Relationship:{" "}
            {userEmerContact.ec_relationship !== null
              ? userEmerContact.ec_relationship
              : `N/A`}
          </h5>
          <input placeholder="relationship" name="ec_relationship" />
          <h5>
            Phone Number:{" "}
            {userEmerContact.ec_phone !== null
              ? userEmerContact.ec_phone
              : `N/A`}
          </h5>
          <input placeholder="phone number" name="ec_phone" />
          <br />
          <button
            onClick={(e) => {
              updateEC(e);
            }}
          >
            Update Emergency Contact
          </button>
        </form>
      </div>
      <button onClick={handleReturnToPage}>Home</button>
      {/* <input
                type="image"
                className="edit_button"
                title="edit"
                src="https://webstockreview.net/images/clipart-pen-pen-icon-15.png"
                alt="edit button"
              /> */}
    </div>
  );
};

export default Profile;
