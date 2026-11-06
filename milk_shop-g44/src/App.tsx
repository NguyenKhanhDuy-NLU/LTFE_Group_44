import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import AppRoutes from "./routes/AppRoutes";
export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}


