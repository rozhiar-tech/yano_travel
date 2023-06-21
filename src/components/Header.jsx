import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";
import { tokens } from "../theme";

function Header({ title, subtitle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h1"
        fontWeight={"bold"}
        color={colors.yallowAccent[100]}
      >
        {title}
      </Typography>
      <Typography variant="h3" color="secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}

export default Header;
