import { useHistory } from "react-router";
import { useState, useContext } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import Toastify from "toastify-js";
import Loading from "./Loading";
import UserDataContext from "../contexts/userData";

const Profile = () => {
  const {
    userInfo,
    userAllergies,
    userEmerContact,
    setStateChange,
    stateChange,
    loading,
  } = useContext(UserDataContext);

  const history = useHistory();
  const { user } = useAuth();
  const [updateUserProfile, setUpdateUserProfile] = useState([]);
  const [updateEmergencyContact, setUpdateEmergencyContact] = useState([]);
  const [addedAllergy, setAddedAllergy] = useState([]);

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
      .eq("user_id", user?.id);
    if (error) throw error;

    Toastify({
      text: `your profile has been updated`,
      duration: 3000,
    }).showToast();
    setStateChange(!stateChange);
    setUpdateUserProfile([]);
    e.target.parentElement.reset();
  };

  const updateEC = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("emergency_contact")
      .update(updateEmergencyContact)
      .eq("user_id", user?.id);
    if (error) throw error;

    Toastify({
      text: `emergency contact has been updated`,
      duration: 3000,
    }).showToast();
    setStateChange(!stateChange);
    setUpdateEmergencyContact([]);
    e.target.parentElement.reset();
  };

  const updateAllergy = async (e) => {
    e.preventDefault();

    await supabase
      .from("allergies")
      .insert({ allergen: addedAllergy, user_id: user?.id })
      .eq("user_id", user?.id);

    Toastify({
      text: `${addedAllergy} allergy has be added`,
      duration: 3000,
    }).showToast();
    setStateChange(!stateChange);
    setAddedAllergy([]);
    e.target.parentElement.reset();
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
    setStateChange(!stateChange);
  }

  return (
    <div>
      <div className="head-wrap">
        <h1>Pill-Pal</h1>
        <h1 className="banner-title">Medication doesn't have to be SCARY</h1>
      </div>
      <div className="logged-in-buttons">
        <h4>
          Welcome,{" "}
          {Object.keys(userInfo).length !== 0
            ? userInfo[0].full_name || userInfo[0].username
            : "User"}
          !
        </h4>
        <div className="logout-edit-buttons">
          <input
            type="image"
            className="edit-signout-button"
            onClick={handleReturnToPage}
            title="home"
            alt="home icon"
            src="http://cdn.onlinewebfonts.com/svg/img_158445.png"
          />
        </div>
      </div>
      <div className="profile-page-body">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="profile-page-section">
              <h3>My Information</h3>
              <form onChange={handleChangeUser}>
                <h5>Name</h5>
                <input
                  name="full_name"
                  placeholder={
                    Object.keys(userInfo).length !== 0
                      ? userInfo[0].full_name
                      : "N/A"
                  }
                />
                <h5>Username:</h5>
                <input
                  placeholder={
                    Object.keys(userInfo).length !== 0
                      ? userInfo[0].username
                      : `N/A`
                  }
                  name="username"
                />
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
            <div className="profile-page-section">
              <h3>My Allergies</h3>
              <h5>
                Allergies:
                {Object.keys(userAllergies).length !== 0
                  ? allergyList()
                  : `N/A`}
              </h5>
              <form onChange={handleAddAllergy}>
                <input placeholder="Add allergy" name="allergen" />
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
            <div className="profile-page-section">
              <h3>My Contacts</h3>
              <form onChange={handleChangeEC}>
                <h5>Emergency Contact Name:</h5>
                <input
                  placeholder={
                    Object.keys(userEmerContact).length !== 0
                      ? userEmerContact.ec_full_name
                      : `N/A`
                  }
                  name="ec_full_name"
                />
                <h5>Relationship:</h5>
                <input
                  placeholder={
                    Object.keys(userEmerContact).length !== 0
                      ? userEmerContact.ec_relationship
                      : `N/A`
                  }
                  name="ec_relationship"
                />
                <h5>Phone Number:</h5>
                <input
                  placeholder={
                    Object.keys(userEmerContact).length !== 0
                      ? userEmerContact.ec_phone
                      : `N/A`
                  }
                  name="ec_phone"
                />
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
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
