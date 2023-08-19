import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { fetchDataInvoices } from "../../Data/mockData";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
const Invoices = () => {
  const [mockDataInvoices, setMockDataInvoices] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    setSelectedRow(mockDataInvoices[0]);
    // Call the fetchDataInvoices function
    fetchDataInvoices()
      .then((data) => {
        // Update the value of mockDataInvoices
        setMockDataInvoices(data);
        setPaymentStatus(data.paymentStatus);
        console.log(data);
        // Do something with the retrieved data
      })
      .catch((error) => {
        console.log("Error:", error);
        console.log(paymentStatus);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    {
      field: "paymentStatus",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { paymentStatus } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            onClick={() => {
              console.log(paymentStatus);
              if (paymentStatus === "pending") {
                setPaymentStatus("aproved");
              }
            }}
            backgroundColor={
              paymentStatus === "aproved"
                ? colors.greenAccent[600]
                : paymentStatus === "pending"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {paymentStatus === "aproved" && <AdminPanelSettingsOutlinedIcon />}
            {paymentStatus === "pending" && <SecurityOutlinedIcon />}
            {paymentStatus === "pending" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {paymentStatus}
            </Typography>
          </Box>
        );
      },
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
