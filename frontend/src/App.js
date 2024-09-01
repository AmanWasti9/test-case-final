import logo from "./logo.svg";
import "./App.css";
// import Header from "./components/Header/Header";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SignIn from "./components/SignIn/form";
import SignUp from "./components/SignUp/form";
import DashboardPage from "./pages/DashboardPage";
// import WorkPage from "./pages/WorkPage";
import UploadPdfPage from "./pages/UploadPdfPage";
import PDFToImage from "./pages/PDFToImage";

function App() {
  return (
    <div id="top">
      <Router>
        <header>
          {/* <Header /> */}
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/test"
              element={<PDFToImage pdfUrl="../public/02_knn_notes.pdf" />}
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/work" element={<UploadPdfPage />} />
          </Routes>
        </main>
        <br />
        <br />
        <br />
        <br />
        <footer>
          <Footer />
        </footer>
        <br />
      </Router>
    </div>
  );
}

export default App;
