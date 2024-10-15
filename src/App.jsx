import { Navbar } from "./components/Layout/Navbar";
import { AppRouter } from "./router/AppRouter";
import Footer from "./components/Layout/Footer/Footer";

function App() {
  return (
    <>
      <Navbar />
      <AppRouter />
      <Footer />
    </>
  )
}
export default App;