import ProfileAllergies from "./ProfileAllergies";
import ProfileConditions from "./ProfileConditions";
import ProfileMedications from "./ProfileMedications";
import ProfileEmergencyContact from "./ProfileEmergencyContact";
import ProfileUser from "./ProfileUser";
import { Grid } from "@mui/material";
import { Card } from "@mui/material";
import { useTheme } from "@mui/system";

const Profile = () => {
  const theme = useTheme();

  return (
    <Grid container>
      <Grid item md={4} sm={6} xs={12}>
        <Card variant="outlined" theme={theme}>
          <ProfileUser />
          <br />
          <ProfileEmergencyContact />
        </Card>
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <Card variant="outlined" theme={theme}>
          <ProfileConditions />
          <br />
          <ProfileAllergies />
        </Card>
      </Grid>
      <Grid item md={4} sm={12} xs={12}>
        <Card variant="outlined" theme={theme}>
          <ProfileMedications />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
