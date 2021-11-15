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
    userConditions,
  } = useContext(UserDataContext);

  const history = useHistory();
  const { user } = useAuth();
  const [updateUserProfile, setUpdateUserProfile] = useState([]);
  const [updateEmergencyContact, setUpdateEmergencyContact] = useState([]);
  const [addedAllergy, setAddedAllergy] = useState([]);
  const [addedCondition, setAddedCondition] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleReturnToPage() {
    history.push("/");
  }

  const allergyList = () => {
    const allergies = [];
    userAllergies.forEach((allergy, index) => {
      allergies.push(
        <li id={allergy.allergy_id} key={index} className="current-meds-list">
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
    return (
      <div className="my-history-block-sections">
        <div className="found-meds-list">{allergies}</div>
      </div>
    );
  };

  const conditionList = () => {
    const conditions = [];
    userConditions.forEach((condition, index) => {
      conditions.push(
        <li
          id={condition.condition_id}
          key={index}
          className="current-meds-list"
        >
          <h5 value={index}>{condition.condition}</h5>
          <input
            type="image"
            className="delete_button"
            onClick={deleteCurrentCondition}
            title="Delete"
            src="https://www.nicepng.com/png/detail/207-2079285_delete-comments-delete-icon-transparent.png"
            alt="delete button"
          />
        </li>
      );
    });
    return (
      <div className="my-history-block-sections">
        <div className="found-meds-list">{conditions}</div>
      </div>
    );
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

  const handleAddCondition = (e) => {
    setAddedCondition(e.target.value);
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
      position: "left",
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
      position: "left",
    }).showToast();
    setStateChange(!stateChange);
    setUpdateEmergencyContact([]);
    e.target.parentElement.reset();
  };

  const updateAllergy = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    await supabase
      .from("allergies")
      .insert({ allergen: addedAllergy, user_id: user?.id })
      .eq("user_id", user?.id);

    Toastify({
      text: `${addedAllergy} allergy has be added`,
      duration: 3000,
      position: "left",
    }).showToast();
    setDeleteLoading(false);
    setStateChange(!stateChange);
    setAddedAllergy([]);
    e.target.parentElement.reset();
  };

  async function deleteCurrentAllergy(e) {
    e.preventDefault();
    setDeleteLoading(true);
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
        position: "left",
      }).showToast();
    } else {
      Toastify({
        text: `${allergyName} allergy has be removed`,
        duration: 3000,
        position: "left",
      }).showToast();
    }
    setDeleteLoading(false);
    setStateChange(!stateChange);
  }

  const updateCondition = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    await supabase
      .from("conditions")
      .insert({ condition: addedCondition, user_id: user?.id })
      .eq("user_id", user?.id);

    Toastify({
      text: `${addedCondition} has be added to the chart`,
      duration: 3000,
      position: "left",
    }).showToast();
    setDeleteLoading(false);
    setStateChange(!stateChange);
    setAddedCondition([]);
    e.target.parentElement.reset();
  };

  async function deleteCurrentCondition(e) {
    e.preventDefault();
    setDeleteLoading(true);
    const conditionId = e.target.parentElement.id;
    const conditionName = e.target.previousElementSibling.innerHTML;
    const { error } = await supabase
      .from("conditions")
      .delete()
      .eq("user_id", user?.id)
      .eq("condition_id", conditionId);
    if (error) {
      Toastify({
        text: `something went wrong`,
        duration: 3000,
        position: "left",
      }).showToast();
    } else {
      Toastify({
        text: `${conditionName} has be removed from the chart`,
        duration: 3000,
        position: "left",
      }).showToast();
    }
    setDeleteLoading(false);
    setStateChange(!stateChange);
  }

  return (
    <div className="profile-box">
      <div className="head-wrap">
        <h2 className="web-name">Pill-Pal</h2>
        <h1 className="banner-title">Making medicine less scary</h1>
      </div>
      <div className="logged-in-buttons">
        <h4>
          Welcome,{" "}
          {Object.keys(userInfo).length !== 0
            ? userInfo[0].username || userInfo[0].full_name
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
      {loading ? (
        <Loading />
      ) : (
        <div className="profile-page-body">
          <div className="profile-page-section">
            <h3>My Information</h3>
            <div className="profile-box-line"></div>
            <form className="profile-form" onChange={handleChangeUser}>
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
          <div className="profile-page-section extra-height">
            <h3>My Health</h3>
            <div className="profile-box-line"></div>
            {deleteLoading ? (
              <Loading />
            ) : (
              <>
                <div className="profile-space-break">
                  <div className="profile-space-line"></div>
                  <h4>Conditions</h4>
                  <div className="profile-space-line"></div>
                </div>
                {Object.keys(userConditions).length !== 0
                  ? conditionList()
                  : `N/A`}
                <form className="profile-form" onChange={handleAddCondition}>
                  <input placeholder="Condition" name="condition" />
                  <br />
                  <button
                    onClick={(e) => {
                      updateCondition(e);
                    }}
                  >
                    Add Condition
                  </button>
                </form>
                <div className="profile-space-break">
                  <div className="profile-space-line"></div>
                  <h4>Allergies</h4>
                  <div className="profile-space-line"></div>
                </div>
                {Object.keys(userAllergies).length !== 0
                  ? allergyList()
                  : `N/A`}
                <form className="profile-form" onChange={handleAddAllergy}>
                  <input placeholder="Allergy" name="allergen" />
                  <br />
                  <button
                    onClick={(e) => {
                      updateAllergy(e);
                    }}
                  >
                    Add Allergy
                  </button>
                </form>
              </>
            )}
          </div>
          <div className="profile-page-section">
            <h3>My Contacts</h3>
            <div className="profile-box-line"></div>
            <form className="profile-form" onChange={handleChangeEC}>
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
        </div>
      )}
    </div>
  );
};

export default Profile;
