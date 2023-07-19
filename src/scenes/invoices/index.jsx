import { Box, Typography, useTheme, Button, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { fetchDataInvoices } from "../../Data/mockData";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

const Invoices = () => {
  const [mockDataInvoices, setMockDataInvoices] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    // Call the fetchDataInvoices function
    fetchDataInvoices()
      .then((data) => {
        // Update the value of mockDataInvoices
        setMockDataInvoices(data);
        console.log(data);
        // Do something with the retrieved data
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.cost}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
  ];

  const handleExport = () => {
    if (selectedRow) {
      const csvData = [
        {
          ID: selectedRow.id,
          Name: selectedRow.name,
          "Phone Number": selectedRow.phone,
          Email: selectedRow.email,
          Cost: selectedRow.cost,
          Date: selectedRow.date,
        },
      ];

      // Create a CSVLink element with the CSV data
      const csvLink = (
        <CSVLink data={csvData} filename="selected_row.csv">
          Export/Print Selected Row
        </CSVLink>
      );

      // Trigger the CSV download by programmatically clicking the hidden CSVLink
      const link = document.createElement("a");
      link.href = csvLink.props.href;
      link.download = csvLink.props.filename;
      link.click();
    }
  };

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={mockDataInvoices}
          columns={columns}
          // onRowClick={(params) => setSelectedRow(params.row)}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      {selectedRow && (
        <Box mt={2}>
          <Typography variant="h6">Selected Row:</Typography>
          <Typography>Name: {selectedRow.name}</Typography>
          <Typography>Email: {selectedRow.email}</Typography>
          <Typography>Phone Number: {selectedRow.phone}</Typography>
          <Typography>Cost: ${selectedRow.cost}</Typography>
          <Typography>Date: {selectedRow.date}</Typography>
        </Box>
      )}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={!selectedRow}
        >
          Export/Print Selected Row
        </Button>
      </Box>
    </Box>
  );
};

export default Invoices;
