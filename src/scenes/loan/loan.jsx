import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Modal,
} from "@mui/material";
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import app from "../../firebase/firebaseInit";
import "./style.css";

const db = getFirestore(app);
const Loan = () => {
  const [loans, setLoans] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [capital, setCapital] = useState(0);

  const [loanDetails, setLoanDetails] = useState({
    loanedTo: "",
    loanedBy: "",
    amount: "",
  });
  const [isReceivingLoan, setIsReceivingLoan] = useState(false);
  const [PendingTransactions, setPendingTransactions] = useState([]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setLoanDetails({ loanedTo: "", loanedBy: "", amount: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoanDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddLoan = async () => {
    if (isReceivingLoan) {
      if (
        isNaN(loanDetails.amount) ||
        parseFloat(loanDetails.amount) <= 0 ||
        !loanDetails.loanDate ||
        !loanDetails.dueDate
      ) {
        // Handle invalid input
        return;
      }

      try {
        const newLoan = {
          loanedTo: loanDetails.loanedTo,
          loanedBy: loanDetails.loanedBy,
          amount: parseFloat(loanDetails.amount),
          loanDate: loanDetails.loanDate,
          dueDate: loanDetails.dueDate,
          loanType: "received",
        };

        // Add the new loan to the "loans" collection in Firebase
        const loansRef = collection(db, "loans"); // Update collection name if needed
        const newLoanRef = await addDoc(loansRef, newLoan);

        // Update state and reset loan details
        setLoans((prevLoans) => [
          ...prevLoans,
          { id: newLoanRef.id, ...newLoan },
        ]);

        setLoanDetails({ loanedTo: "", loanedBy: "", amount: "" });

        // Close the modal
        handleCloseModal();

        console.log("Loan added successfully.");
        console.log(capital);
      } catch (error) {
        console.error("Error adding loan: ", error);
        // Handle error state or display error message to the user
      }
    } else {
      if (
        isNaN(loanDetails.amount) ||
        parseFloat(loanDetails.amount) <= 0 ||
        !loanDetails.loanDate ||
        !loanDetails.dueDate
      ) {
        // Handle invalid input
        return;
      }

      try {
        const newLoan = {
          loanedTo: loanDetails.loanedTo,
          loanedBy: loanDetails.loanedBy,
          amount: parseFloat(loanDetails.amount),
          loanDate: loanDetails.loanDate,
          dueDate: loanDetails.dueDate,
          loanType: "given",
        };

        // Add the new loan to the "loans" collection in Firebase
        const loansRef = collection(db, "loans"); // Update collection name if needed
        const newLoanRef = await addDoc(loansRef, newLoan);

        // Fetch the current capital value from Firestore
        const capitalDocRef = doc(db, "capital", "m7Wn6t1mggr5BqQGiqtX"); // Update document path
        const capitalSnapshot = await getDoc(capitalDocRef);
        const currentCapital = capitalSnapshot.data().amount;

        // Calculate the new capital after subtracting the loan amount
        const newCapital = currentCapital - newLoan.amount;

        // Update the "capital" field in the Firestore document
        await updateDoc(capitalDocRef, { amount: newCapital });

        // Update state and reset loan details
        setLoans((prevLoans) => [
          ...prevLoans,
          { id: newLoanRef.id, ...newLoan },
        ]);
        setCapital(newCapital);
        setLoanDetails({ loanedTo: "", loanedBy: "", amount: "" });

        // Close the modal
        handleCloseModal();

        console.log("Loan added successfully.");
        console.log(capital);
      } catch (error) {
        console.error("Error adding loan: ", error);
        // Handle error state or display error message to the user
      }
    }
  };

  const handleReceiveLoan = () => {
    setIsReceivingLoan(true);
    setLoanDetails({
      loanedTo: "",
      loanedBy: "",
      amount: "",
      loanDate: "",
      dueDate: "",
    });
    handleOpenModal();
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loansRef = collection(db, "loans"); // Update the collection name if needed
        const querySnapshot = await getDocs(loansRef);

        const loadedLoans = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLoans(loadedLoans);
      } catch (error) {
        console.error("Error fetching loans: ", error);
      }
    };
    const getPendingTransactions = async () => {
      const transactionsRef = collection(db, "invoices"); // Replace "transactions" with the actual collection name
      const q = query(transactionsRef, where("paymentStatus", "==", "pending"));

      const querySnapshot = await getDocs(q);

      const pendingTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingTransactions(pendingTransactions);
    };

    // Call the fetchLoans function to load the loans
    fetchLoans();
    getPendingTransactions();
  }, []);

  return (
    <Box m="20px">
      <h2>Loan Management</h2>
      {/* Button to open the loan modal */}
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Loan
      </Button>
      <Button variant="contained" color="primary" onClick={handleReceiveLoan}>
        Receive Loan
      </Button>

      {/* Modal for adding a new loan */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6">Add New Loan</Typography>
          <TextField
            name="loanedTo"
            label="Loaned To"
            value={loanDetails.loanedTo}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 2 }}
          />

          <TextField
            name="loanedBy"
            label="Loaned By"
            value={loanDetails.loanedBy}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 2 }}
          />
          <Typography variant="h6">Date of Loan</Typography>

          <TextField
            name="loanDate"
            label="Loan Date"
            type="date"
            value={loanDetails.loanDate}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 2 }}
          />
          <Typography variant="h6">Date of return</Typography>

          <TextField
            name="dueDate"
            label="Due Date"
            type="date"
            value={loanDetails.dueDate}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 2 }}
          />

          <TextField
            name="amount"
            label="Amount"
            type="number"
            value={loanDetails.amount}
            onChange={handleInputChange}
            fullWidth
            sx={{ my: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddLoan}>
            Add Loan
          </Button>
        </Box>
      </Modal>

      {/* Display loans */}
      <Grid container spacing={2}>
        {loans.map((loan) => (
          <Grid item key={loan.id} xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              className={loan.loanType === "received" ? "receivedLoanCard" : ""}
            >
              <CardContent>
                <Typography variant="h6">Loaned To: {loan.loanedTo}</Typography>
                <Typography variant="body1">
                  Loaned By: {loan.loanedBy}
                </Typography>
                <Typography variant="body1">Amount: ${loan.amount}</Typography>
                <Typography variant="body1">
                  Date of Loan: {loan.loanDate}
                </Typography>
                <Typography variant="body1">
                  Due Date: {loan.dueDate}
                </Typography>
                {/* Add more loan details here */}
              </CardContent>
            </Card>
          </Grid>
        ))}
        {PendingTransactions.map((transaction) => (
          <Grid item key={transaction.id} xs={12} sm={6} md={4}>
            <Card variant="elevation">
              <CardContent>
                <Typography variant="h6">Name : {transaction.name}</Typography>
                <Typography variant="body1">
                  Cost : $ {transaction.cost}
                </Typography>
                <Typography variant="body1">
                  Email: {transaction.email}
                </Typography>
                <Typography variant="body1">
                  Quantity: {transaction.quantity}
                </Typography>
                <Typography variant="body1">
                  Extra Info: {transaction.extraInfo}
                </Typography>
                {/* Add more loan details here */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Loan;
