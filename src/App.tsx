import type React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import FlightSearchPage from "./pages/FlightSearchPage"
import FlightListPage from "./pages/FlightListPage"
import ReviewTripPage from "./pages/ReviewTripPage"
import CheckoutPage from "./pages/CheckoutPage"
import { FlightProvider } from "./context/FlightContext"

const App: React.FC = () => {
  return (
    <FlightProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FlightSearchPage />} />
          <Route path="/flights" element={<FlightListPage />} />
          <Route path="/review-trip" element={<ReviewTripPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Router>
    </FlightProvider>
  )
}

export default App

