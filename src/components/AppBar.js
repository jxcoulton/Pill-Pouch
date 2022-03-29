import React from "react";
import Identify from "./Identify";
import SignOut from "./SignOut";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme, Grid } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

//created search style
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

export default function SearchAppBar() {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" theme={theme}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Grid
            container
            justifyContent="space-between"
            sx={{ paddingTop: "20px", paddingBottom: "30px" }}
          >
            <Grid item xs={10} sm={4}>
              <Typography variant="h4" sx={{ paddingBottom: "20px" }}>
                Pill-Pal
              </Typography>
            </Grid>
            <Grid
              item
              container
              xs={2}
              justifyContent="flex-end"
              alignItems="center"
              order={{ sm: 1 }}
            >
              <Grid item>
                <SignOut />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Search>
                <Identify />
              </Search>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
