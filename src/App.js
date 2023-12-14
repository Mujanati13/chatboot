import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../src/output.css";
import Accueil from "./pages/accueil";
import ChatBoot from "./pages/chatboot ";
import Contact from "./pages/contact";
import Quations from "./pages/quations";
import Legale from "./pages/legales";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="accueil" element={<Accueil />}></Route>
          <Route path="chatbot" element={<ChatBoot />}></Route>
          <Route path="contact" element={<Contact />}></Route>
          <Route path="question" element={<Quations />}></Route>
          <Route path="legal" element={<Legale />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
