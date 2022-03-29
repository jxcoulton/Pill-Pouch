import React from "react";
import SearchAppBar from "./AppBar";
import Profile from "./Profile";
import Interactions from "./Interactions";
import Resources from "./Resources";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import { Tabs } from "@mui/material";
import { useTheme } from "@mui/system";

export function Dashboard() {
  const [value, setValue] = React.useState("1");
  const theme = useTheme();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="main-body">
      <SearchAppBar />
      <Box sx={{ minHeight: "85vh" }}>
        <TabContext value={value}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "primary.main",
            }}
          >
            <Tabs
              onChange={handleChange}
              variant="fullWidth"
              scrollButtons="auto"
              value={value}
              textColor="secondary"
              TabIndicatorProps={{
                style: { backgroundColor: theme.palette.secondary.main },
              }}
              sx={{ width: "100%" }}
            >
              <Tab label="Profile" value="1" theme={theme} />
              <Tab label="Interactions" value="2" theme={theme} />
              <Tab label="Resources" value="3" theme={theme} />
            </Tabs>
          </Box>
          <TabPanel value="1" theme={theme}>
            <Profile />
          </TabPanel>
          <TabPanel value="2" theme={theme}>
            <Interactions />
          </TabPanel>
          <TabPanel value="3" theme={theme}>
            <Resources />
          </TabPanel>
        </TabContext>
      </Box>
      <Footer />
    </div>
  );
}
