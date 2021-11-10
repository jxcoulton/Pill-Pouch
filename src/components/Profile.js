import { useHistory } from "react-router";
import { useState, useContext } from "react";
import { useAuth } from "../contexts/Auth";
import { supabase } from "../supabase";
import Toastify from "toastify-js";
import UserDataContext from "../contexts/userData";

const Profile = () => {
  const {
    userInfo,
    userAllergies,
    userEmerContact,
    setStateChange,
    stateChange,
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
      <h1>Profile Page</h1>
      <div>
        <h3>My Information</h3>
        <form onChange={handleChangeUser}>
          <h5>
            Name:{" "}
            {Object.keys(userInfo).length !== 0 ? userInfo[0].full_name : "N/A"}
          </h5>
          <input placeholder="full name" name="full_name" />
          <h5>
            Username:{" "}
            {Object.keys(userInfo).length !== 0 ? userInfo[0].username : `N/A`}
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
            {Object.keys(userEmerContact).length !== 0
              ? userEmerContact.ec_full_name
              : `N/A`}
          </h5>
          <input placeholder="full name" name="ec_full_name" />
          <h5>
            Relationship:{" "}
            {Object.keys(userEmerContact).length !== 0
              ? userEmerContact.ec_relationship
              : `N/A`}
          </h5>
          <input placeholder="relationship" name="ec_relationship" />
          <h5>
            Phone Number:{" "}
            {Object.keys(userEmerContact).length !== 0
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
    </div>
  );
};

export default Profile;
