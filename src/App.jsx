import { Navbar2 } from "./components/Layout/Navbar";
import { AppRouter } from "./router/AppRouter";
import Footer from "./components/Layout/Footer/Footer";
import Chatbot from "./components/Chatbot/Chatbot";
import Breadcrumbs from "./components/Breadcrumbs";

function App() {
  return (
    <>
      <Navbar2 />
      <Breadcrumbs/>
      <AppRouter />
      <Footer />
      <Chatbot/>
    </>
  )
}
export default App;