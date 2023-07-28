import { Box, Button, Select, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { addDoc, collection, getFirestore, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import app from "../../firebase/firebaseInit";
import { v4 as uuidv4, v4 } from "uuid";

const db = getFirestore(app);

const Invoice = () => {
  const [companyNames, setCompanyNames] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = (values) => {
    const { name, cost, date, email, id, phone, profit } = values;
    const invoice = {
      name,
      cost,
      date,
      email,
      id,
      phone,
      profit,
    };
    addDoc(collection(db, "invoices"), invoice)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        setSuccessMessage("Invoice created successfully");
        alert("Invoice created successfully");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;

    // const selectedCompany = companyNames.find((company) => {
    //   return company === value;
    // });

    // const { email, phone, id } = selectedCompany;
    // setFieldValue("email", email);
    // setFieldValue("phone", phone);
    // setFieldValue("id", id);
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

              <Select
                fullWidth
                variant="filled"
                label="Status"
                value={companyNames}
                onChange={handleChange}
              >
                {companyNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
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
