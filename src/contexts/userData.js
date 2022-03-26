import { createContext, useState } from "react";

const UserDataContext = createContext({});

export const UserDataProvider = ({ children }) => {
  const [currentMeds, setCurrentMeds] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [foundMeds, setFoundMeds] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [updateMedications, setUpdateMedications] = useState([]);

  return (
    <UserDataContext.Provider
      value={{
        userInfo,
        currentMeds,
        setCurrentMeds,
        setUserInfo,
        foundMeds,
        setFoundMeds,
        openDialog,
        setOpenDialog,
        updateMedications,
        setUpdateMedications,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
