import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { fetchProductData } from "../../Data/mockData"; // Replace this with the actual data fetching function for products

import Header from "../../components/Header";
import Button from "@mui/material/Button";

const Products = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // Call the fetchProductData function (replace with actual data fetching)
    fetchProductData()
      .then((data) => {
        // Update the value of productData
        setProductData(data);
        console.log(data);
        // Do something with the retrieved data
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    // Add more columns as needed
  ];
  return (
    <Box m="20px">
      <Header title="Products" subtitle="Managing the Products" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        // Custom styling here as needed
      >
        <DataGrid checkboxSelection rows={productData} columns={columns} />
        <Box display="flex" justifyContent="end" mt="20px" mb="30px">
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => {
              window.location.href = "/form"; // Replace with the appropriate URL for creating a new product
            }}
          >
            Create New Product
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Products;
