import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

//Css
import "./App.css";

//Material UI
import { CircularProgress } from "@mui/material";

//Components
import NavBar from "../src/components/NavBar/NavBar";
import Footer from "../src/components/Footer/Footer";

//Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Search from "./pages/Search/Search";
import Post from "./pages/Post/Post";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreatePost from "./pages/CreatePost/CreatePost";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditPost from "./pages/EditPost/EditPost";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <CircularProgress color="black" size={40} />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<Search />} />
            <Route path="/posts/:id" element={<Post />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/posts/create"
              element={user ? <CreatePost /> : <Navigate to="/login" />}
            />
            <Route
              path="/posts/edit/:id"
              element={user ? <EditPost /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
