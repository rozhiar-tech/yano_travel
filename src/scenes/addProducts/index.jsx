import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { v4 as uuidv4 } from "uuid"; // Import the UUID generator function
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate to programmatically navigate after form submission
import app from "../../firebase/firebaseInit";

const db = getFirestore(app);

const ProductForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleFormSubmit = async (values) => {
    const { productName } = values;

    try {
      // Add a new product to the products collection
      const newProduct = {
        id: uuidv4(), // Generate a unique ID using UUID
        name: productName,
      };

      await addDoc(collection(db, "products"), newProduct);

      alert("Product added successfully");
      navigate("/products"); // Navigate to the products page after successful form submission
    } catch (error) {
      console.error("Error adding product: ", error);
    }

    console.log(values);
  };

  return (
    <Box m="20px">
      <Header title="ADD PRODUCT" subtitle="Add a New Product" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={productSchema}
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
            <Box display="grid" gap="30px">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Product Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.productName}
                name="productName"
                error={!!touched.productName && !!errors.productName}
                helperText={touched.productName && errors.productName}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add Product
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const productSchema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
});

const initialValues = {
  productName: "",
};

export default ProductForm;
