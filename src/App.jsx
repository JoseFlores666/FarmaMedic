import Footer from "./components/pages/Footer";
import { Navbar } from "./components/pages/Navbar";
import { AppRouter } from "./router/AppRouter";

function App() {
  return (
    <div>
      <Navbar />

      <AppRouter />

      <Footer />

    </div>

  )
}
export default App;