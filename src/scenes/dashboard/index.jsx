import React from "react";
import Header from "../../components/Header";
import { Box } from "@mui/material";

function index() {
  return (
    <Box m={4}>
      <Header title={"Dashboard"} subtitle={"Welcome to Your Dashboard"} />
    </Box>
  );
}

export default index;
