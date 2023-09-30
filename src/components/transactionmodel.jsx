import React from "react";
import { Box, Typography, Modal, Card, CardContent } from "@mui/material";

const TransactionModal = ({ isOpen, onClose, transaction }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
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
        <Typography variant="h6">Transaction Details</Typography>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" color="white">
              Transaction ID: {transaction.id}
            </Typography>
            <Typography>Name: {transaction.name}</Typography>
            <Typography>Date: {transaction.date}</Typography>
            <Typography>Cost: ${transaction.cost}</Typography>
            <Typography>phone: {transaction.phone}</Typography>
            <Typography>Payment Status: {transaction.paymentStatus}</Typography>
            <Typography>Company: {transaction.company}</Typography>
            <Typography>Product: {transaction.product}</Typography>
            <Typography>Quantity: {transaction.quantity}</Typography>
            {/* Add more details as needed */}
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default TransactionModal;
