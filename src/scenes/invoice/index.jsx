import { Box, Button, TextField, Link } from "@mui/material";
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
import { v4 as uuidv4 } from "uuid";

const db = getFirestore(app);

const Invoice = () => {
  const [companyNames, setCompanyNames] = useState([]);
  const [products, setProducts] = useState([]);
  const [capital, setCapital] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = async (values) => {
    const { name, cost, date, email, id, phone, profit } = values;
    const invoice = {
      name,
      cost,
      date,
      email,
      id,
      phone,
      profit,
      company: selectedCompany,
      paymentStatus: "pending",
      product: selectedProduct,
    };
    try {
      // Add the invoice to the "invoices" collection
      await addDoc(collection(db, "invoices"), invoice);

      // Update the capital by subtracting the cost
      const newCapital = capital - cost;

      // Update the capital in Firestore
      const capitalRef = doc(db, "capital", "m7Wn6t1mggr5BqQGiqtX"); // Replace "your_document_id_here" with the actual document ID for the capital data
      await updateDoc(capitalRef, { amount: newCapital });

      console.log("Invoice added successfully.");
      setSuccessMessage("Invoice created successfully");
      alert("Invoice created successfully");

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
    const getAllUserNames = () => {
      // Get a reference to the "users" collection in Firestore
      const usersRef = collection(db, "users");
      const names = [];
      // Perform a query to get all documents in the "users" collection
      return getDocs(usersRef)
        .then((querySnapshot) => {
          // Loop through each document in the query snapshot
          querySnapshot.forEach((doc) => {
            // Extract the firstName and lastName fields from each document
            const { name } = doc.data();
            // Construct the full name and add it to the names array
            const fullName = `${name}`;
            names.push(fullName);
          });

          setCompanyNames(names); // Return the array of names
        })
        .catch((error) => {
          console.error("Error getting users: ", error);
          return []; // Return an empty array in case of an error
        });
    };
    const getAllProducts = () => {
      // Get a reference to the "users" collection in Firestore
      const productsRef = collection(db, "products");
      const names = [];
      // Perform a query to get all documents in the "users" collection
      return getDocs(productsRef)
        .then((querySnapshot) => {
          // Loop through each document in the query snapshot
          querySnapshot.forEach((doc) => {
            // Extract the firstName and lastName fields from each document
            const { name } = doc.data();
            // Construct the full name and add it to the names array
            const fullName = `${name}`;
            names.push(fullName);
          });

          setProducts(names); // Return the array of names
        })
        .catch((error) => {
          console.error("Error getting users: ", error);
          return []; // Return an empty array in case of an error
        });
    };
    const getCapital = () => {
      // Get a reference to the "capital" document in Firestore
      const capitalRef = doc(db, "capital", "m7Wn6t1mggr5BqQGiqtX"); // Replace "your_document_id_here" with the actual document ID for the capital data
      // Perform a query to get the document
      return getDoc(capitalRef)
        .then((doc) => {
          // Extract the amount field from the document
          const { amount } = doc.data();
          // Set the local state to the amount
          setCapital(amount);
        })
        .catch((error) => {
          console.error("Error getting capital: ", error);
        });
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
                value={values.id}
                name="id"
                error={!!touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                sx={{ gridColumn: "span 2" }}
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
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Invoice
              </Button>
            </Box>
            {successMessage && (
              <Box mt="20px" color="green">
                {successMessage}
              </Box>
            )}
          </form>
        )}
      </Formik>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button type="submit" color="secondary" variant="contained">
          Create Invoice
        </Button>
      </Box>
      {successMessage && (
        <Box mt="20px" color="green">
          {successMessage}
        </Box>
      )}
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
});

const initialValues = {
  name: "",
  cost: "",
  date: "",
  email: "",
  id: uuidv4().slice(0, 8),
  phone: "",
  profit: "",
};

export default Invoice;
