import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import StatBox from "../../components/StatBox";

import {
  collection,
  getDocs,
  getFirestore,
  where,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import app from "../../firebase/firebaseInit";

import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const db = getFirestore(app);

const Vault = () => {
  const [capital, setCapital] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [additionalCapital, setAdditionalCapital] = useState(0);
  const [deductedCapital, setDeductedCapital] = useState(0);
  const [totalLoansGiven, setTotalLoansGiven] = useState(0);

  useEffect(() => {
    const getAllTransactions = () => {
      const invoicesRef = collection(db, "invoices");
      const allTransactions = [];
      return getDocs(invoicesRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const transaction = doc.data();
            allTransactions.push(transaction);
          });
          setTransactions(allTransactions);
        })
        .catch((error) => {
          console.error("Error getting transactions: ", error);
        });
    };
    getAllTransactions();

    // Fetch initial capital from Firestore or set it to 0
    const getCapital = () => {
      const capitalRef = collection(db, "capital");
      return getDocs(capitalRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const capital = doc.data().amount;
            setCapital(capital);
          });
        })
        .catch((error) => {
          console.error("Error getting capital: ", error);
        });
    };
    getCapital();
  }, []);
  useEffect(() => {
    // Fetch the total amount of loans given
    const fetchTotalLoansGiven = async () => {
      const loansRef = collection(db, "loans");
      const q = query(loansRef, where("loanType", "==", "given"));
      const querySnapshot = await getDocs(q);

      let totalLoansGiven = 0;
      querySnapshot.forEach((doc) => {
        const loan = doc.data();
        totalLoansGiven += loan.amount;
      });

      // Update the state with the total loans given
      setTotalLoansGiven(totalLoansGiven);
    };

    // Call the function to fetch total loans given
    fetchTotalLoansGiven();
  }, []);
  const handleDeductCapital = () => {
    if (isNaN(deductedCapital) || deductedCapital <= 0) {
      return;
    }

    const newCapital = capital - parseFloat(deductedCapital);

    // Update the capital in Firestore
    const capitalRef = doc(db, "capital", "m7Wn6t1mggr5BqQGiqtX");
    updateDoc(capitalRef, { amount: newCapital })
      .then(() => {
        console.log("Capital deducted successfully.");
        setCapital(newCapital);
        setDeductedCapital(0);
      })
      .catch((error) => {
        console.error("Error deducting capital: ", error);
      });
  };

  const calculateOutstandingAmount = (transaction) => {
    return transaction.cost - transaction.profit;
  };

  const handleUpdateCapital = () => {
    if (isNaN(additionalCapital) || additionalCapital <= 0) {
      return;
    }

    const newCapital = capital + parseFloat(additionalCapital);
    // Update the capital in Firestore

    const capitalRef = doc(db, "capital", "m7Wn6t1mggr5BqQGiqtX");
    updateDoc(capitalRef, { amount: newCapital })
      .then(() => {
        console.log("Capital updated successfully.");
        setCapital(newCapital);
        setAdditionalCapital(0);
      })
      .catch((error) => {
        console.error("Error updating capital: ", error);
      });
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <h2>Vault Summary</h2>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${transactions.length}`}
            subtitle="Total Transactions"
            progress="0.50"
            increase="+21%"
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${transactions.reduce((acc, t) => acc + t.profit, 0)}`}
            subtitle="Total Profit"
            progress="0.50" // Replace this with the appropriate progress value
            increase="+21%" // Replace this with the appropriate increase value
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${totalLoansGiven}`}
            subtitle="Total Loans Given"
            progress="0.50" // Replace this with the appropriate progress value
            increase="+10%" // Replace this with the appropriate increase value
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`$${capital}`}
            subtitle="Remaining Capital"
            progress="0.75" // Replace this with the appropriate progress value
            increase="+5%" // Replace this with the appropriate increase value
          />
        </Box>

        {/* Input field to add additional capital */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <TextField
            label="Additional Capital"
            type="number"
            value={additionalCapital}
            onChange={(e) => setAdditionalCapital(e.target.value)}
            sx={{ marginBottom: "10px", width: "200px", marginRight: "20px" }} // Adjust the width value as needed
          />
          <Button
            onClick={handleUpdateCapital}
            variant="contained"
            color="primary"
            sx={{ marginBottom: "10px" }}
          >
            Add Capital
          </Button>
        </Box>
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <TextField
            label="Deduct Capital"
            type="number"
            value={deductedCapital}
            onChange={(e) => setDeductedCapital(e.target.value)}
            sx={{ marginBottom: "10px", width: "200px", marginRight: "20px" }}
          />
          <Button
            onClick={handleDeductCapital}
            variant="contained"
            color="primary"
            sx={{ marginBottom: "10px" }}
          >
            Deduct Capital
          </Button>
        </Box>
      </Box>
      <h3>Transactions:</h3>
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          variant="outlined"
          sx={{ marginBottom: "10px" }}
        >
          <CardContent>
            <Typography variant="h6">
              Transaction ID: {transaction.id}
            </Typography>
            <Typography>Company: {transaction.company}</Typography>
            <Typography>Product: {transaction.product}</Typography>
            <Typography>Cost: ${transaction.cost}</Typography>
            <Typography>Profit: ${transaction.profit}</Typography>
            <Typography>Date: {transaction.date}</Typography>
            <Typography>
              Outstanding Amount: ${calculateOutstandingAmount(transaction)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Vault;
