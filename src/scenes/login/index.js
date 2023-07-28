import React from "react";
import { Paper, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase/firebaseInit";

const auth = getAuth(app);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <div>
      <Paper
        elevation={3}
        style={{ padding: 20, maxWidth: 300, margin: "auto" }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default LoginForm;
