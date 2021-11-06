import { useHistory } from "react-router";

const Profile = () => {
  const history = useHistory();
  async function handleReturnToPage() {
    history.push("/");
  }

  // const updateItem = async (newValue, columnName) => {
  //   try {
  //     const { error } = await supabase
  //       .from("profiles")
  //       .update({ columnName: newValue })
  //       // .eq("user_id", user?.id)
  //       .eq("user_id", user?.id); //matching id of row to update

  //     if (error) throw error;
  //   } catch (error) {
  //     alert(error.error_description || error.message);
  //   }
  // };
  return (
    <div>
      <h1>Profile Page</h1>
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
