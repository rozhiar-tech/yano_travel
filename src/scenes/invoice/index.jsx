import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  addDoc,
  collection,
  getFirestore,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import app from "../../firebase/firebaseInit";


const db = getFirestore(app);

const Invoice = () => {
  const [companyNames, setCompanyNames] = useState([]);
  const [products, setProducts] = useState([]);
  const [capital, setCapital] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [successMessage, setSuccessMessage] = useState("");
  const [nextInvoiceId, setNextInvoiceId] = useState(0);

  useEffect(() => {
    const getLatestTransactionId = async () => {
      const transactionRef = doc(db, "transactionId", "5APtEZfJz8O0dxsc7CM8");

      try {
        const doc = await getDoc(transactionRef);
        // Extract the amount field from the document
        const { id } = doc.data();
        // Set the local state to the amount
        setNextInvoiceId(id);
      } catch (error) {
        console.error("Error getting capital: ", error);
      }
    };
    getLatestTransactionId();
  });

  const handleFormSubmit = async (values) => {
    const { name, cost, date, email, phone, profit, quantity, extraInfo } =
      values;
    const invoice = {
      name,
      cost: cost * quantity,
      date,
      email,
      id: nextInvoiceId,
      phone,
      profit,
      quantity,
      extraInfo, // Add this line for the "Extra Information" field
      company: selectedCompany,
      paymentStatus: "pending",
      product: selectedProduct,
    };

    try {
      // Add the invoice to the "invoices" collection
      await addDoc(collection(db, "invoices"), invoice);

      setNextInvoiceId((prevId) => prevId + 1);

      // Update the capital by subtracting the cost
      const newCapital = capital - cost;

      // Update the capital in Firestore
      const capitalRef = doc(db, "capital", "m7Wn6t1mggr5BqQGiqtX"); // Replace "your_document_id_here" with the actual document ID for the capital data
      await updateDoc(capitalRef, { amount: newCapital });
      const transactionRef = doc(db, "transactionId", "5APtEZfJz8O0dxsc7CM8");
      await updateDoc(transactionRef, { id: nextInvoiceId + 1 });

      setSuccessMessage("Invoice created successfully");

      // Update the local state to reflect the new capital value
      setCapital(newCapital);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedCompany(event.target.value);
  };
  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  useEffect(() => {
    const getAllUserNames = async () => {
      // Get a reference to the "users" collection in Firestore
      const usersRef = collection(db, "users");
      const names = [];
      // Perform a query to get all documents in the "users" collection
      try {
        const querySnapshot = await getDocs(usersRef);
        // Loop through each document in the query snapshot
        querySnapshot.forEach((doc) => {
          // Extract the firstName and lastName fields from each document
          const { name } = doc.data();
          // Construct the full name and add it to the names array
          const fullName = `${name}`;
          names.push(fullName);
        });

        setCompanyNames(names); // Return the array of names
      } catch (error) {
        console.error("Error getting users: ", error);
        return [];
      }
    };
    const getAllProducts = async () => {
      // Get a reference to the "users" collection in Firestore
      const productsRef = collection(db, "products");
      const names = [];
      // Perform a query to get all documents in the "users" collection
      try {
        const querySnapshot = await getDocs(productsRef);
        // Loop through each document in the query snapshot
        querySnapshot.forEach((doc) => {
          // Extract the firstName and lastName fields from each document
          const { name } = doc.data();
          // Construct the full name and add it to the names array
          const fullName = `${name}`;
          names.push(fullName);
        });

        setProducts(names); // Return the array of names
      } catch (error) {
        console.error("Error getting users: ", error);
        return [];
      }
    };
    const getCapital = async () => {
      // Get a reference to the "capital" document in Firestore
      const capitalRef = doc(db, "capital", "m7Wn6t1mggr5BqQGiqtX"); // Replace "your_document_id_here" with the actual document ID for the capital data
      // Perform a query to get the document
      try {
        const doc = await getDoc(capitalRef);
        // Extract the amount field from the document
        const { amount } = doc.data();
        // Set the local state to the amount
        setCapital(amount);
      } catch (error) {
        console.error("Error getting capital: ", error);
      }
    };
    getCapital();
    getAllProducts();
    getAllUserNames();
  }, []);

  return (
    <Box m="20px">
      <Header title="Invoice" subtitle="Create a New Invoice" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Cost"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cost}
                name="cost"
                error={!!touched.cost && !!errors.cost}
                helperText={touched.cost && errors.cost}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date}
                name="date"
                error={!!touched.date && !!errors.date}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={nextInvoiceId}
                name="id"
                error={!!touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                disabled
              />

              <TextField
                fullWidth
                variant="filled"
                type="tel"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Profit"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.profit}
                name="profit"
                error={!!touched.profit && !!errors.profit}
                helperText={touched.profit && errors.profit}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                name="quantity"
                error={!!touched.profit && !!errors.profit}
                helperText={touched.profit && errors.profit}
                sx={{ gridColumn: "span 2" }}
              />

              <select
                value={selectedCompany}
                onChange={handleSelectChange}
                style={{
                  padding: "8px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  border: "1px solid #888",
                  backgroundColor: "#888",
                  color: "#333",
                }}
              >
                {companyNames.map((companyName) => (
                  <option key={companyName} value={companyName}>
                    {companyName}
                  </option>
                ))}
              </select>
              <select
                value={selectedProduct}
                onChange={handleProductChange}
                style={{
                  padding: "8px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  border: "1px solid #888",
                  backgroundColor: "#888",
                  color: "#333",
                }}
              >
                {products.map((produc) => (
                  <option key={produc} value={produc}>
                    {produc}
                  </option>
                ))}
              </select>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Extra Information"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.extraInfo}
                name="extraInfo"
                error={!!touched.extraInfo && !!errors.extraInfo}
                helperText={touched.extraInfo && errors.extraInfo}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            {successMessage !== "" ? (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  color: "black",
                }}
              >
                <p>{successMessage}</p>
                <button
                  onClick={() => setSuccessMessage("")}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            ) : null}

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Invoice
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  name: yup.string().required("Required"),
  cost: yup.number().required("Required"),
  date: yup.date().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  id: yup.string().required("Required"),
  phone: yup.string().required("Required"),
  profit: yup.number().required("Required"),
  extraInfo: yup.string().required("Required"),
});

const initialValues = {
  name: "",
  cost: "",
  date: "",
  email: "",
  id: 1,
  phone: "",
  profit: "",
  quantity: "",
  extraInfo: "", // Add this line for the "Extra Information" field
};

export default Invoice;
