import React from "react";
import { Link, Card, Typography, useTheme } from "@mui/material";

const Resources = () => {
  const theme = useTheme();

  return (
    <Card theme={theme} variant="outlined">
      <Typography
        variant="button"
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        <Link
          theme={theme}
          underline="hover"
          href="https://apps2.deadiversion.usdoj.gov/pubdispsearch/spring/main;jsessionid=ETV-RUjzIiOTdJAeLdIkesgeocjtKdDFK0Qr-9kF.web2?execution=e1s1"
          target="_blank"
          rel="noreferrer"
        >
          Medication Disposal
        </Link>
        <Link
          theme={theme}
          underline="hover"
          href="https://www.goodrx.com/"
          target="_blank"
          rel="noreferrer"
        >
          Save on Prescriptions
        </Link>
        <Link
          theme={theme}
          underline="hover"
          href="https://www.fda.gov/drugs/drug-safety-and-availability/drug-recalls"
          target="_blank"
          rel="noreferrer"
        >
          Recall Notices
        </Link>
        <Link
          theme={theme}
          underline="hover"
          href="https://triage.webpoisoncontrol.org/#!/exclusions"
          target="_blank"
          rel="noreferrer"
        >
          Poison control website
        </Link>
        <Link theme={theme} underline="hover" href="tel:1-800-222-1222">
          poison control number (1-800-222-1222)
        </Link>
      </Typography>
    </Card>
  );
};
export default Resources;
