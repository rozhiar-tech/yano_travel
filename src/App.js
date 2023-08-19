import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Invoice from "./scenes/invoice";
import Products from "./scenes/products";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calender/calender";
import app from "./firebase/firebaseInit";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import Login from "./scenes/login";

import { CirclesWithBar } from "react-loader-spinner";
import ProductForm from "./scenes/addProducts";
import Vault from "./scenes/voult";
import Loan from "./scenes/loan/loan";
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [loading, setLoading] = useState(true);

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    if (userId) {
      // Watch user database for changes if they are logged in
      onSnapshot(doc(db, "users", userId), (user) => {
        console.log(userId);
        setUserInfo(() => user.data());
        if (user.data().access === "Admin") {
          setIsAdmin(() => true);
        } else {
          setIsCompany(() => true);
        }
        setLoading(false);
      });
    }
  }, [userId]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(() => user.uid.toString());
      } else {
        setUserId(() => false);
        setIsAdmin(() => false);
        setIsCompany(() => false);
        setLoading(false);
      }

      // Authentication state has been checked, set loading to false
    });
  }, []);
  console.log(userInfo);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
              }}
            >
              <CirclesWithBar
                height="100"
                width="100"
                color="#fff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                outerCircleColor=""
                innerCircleColor=""
                barColor=""
                ariaLabel="circles-with-bar-loading"
              />
            </div>
          ) : isAdmin ? ( // Render if user is Admin
            <>
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  {/* <Route path="/faq" element={<FAQ />} /> */}
                  <Route path="/calendar" element={<Calendar />} />
                  {/* <Route path="/geography" element={<Geography />} /> */}
                  <Route path="/invoice" element={<Invoice />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/addProduct" element={<ProductForm />} />
                  <Route path="/vault" element={<Vault />} />
                  <Route path="/loan" element={<Loan />} />
                </Routes>
              </main>
            </>
          ) : isCompany ? ( // Render if user is Company
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </main>
          ) : (
            // Render login form if user is not logged in
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
              }}
            >
              <Login />
            </div>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
