import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "primary.main",
        margin: 0,
        padding: "20px",
      }}
    >
      <p>
        Disclaimer: This is for educational purposes, the safety and security of
        information entered on this platform can not be guaranteed. By signing
        up you confirm that you understand the risks and can not hold any
        persons connected with the creation of this application responsible for
        any misinformation received or not receive, or for the mishandling of
        any private information.
      </p>
    </Box>
  );
};

export default Footer;
