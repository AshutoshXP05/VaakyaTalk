import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import toast, { Toaster } from "react-hot-toast"


function App() {
  return (
    <div className="h-screen" data-theme="forest">
 
      <button onClick={ () => toast.success("Hello Ashutosh")}> Click Button</button>
       
    <Routes>

      <Route path="/" element={<HomePage />} />
      <Route path="/call" element={<CallPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/notification" element={<NotificationPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/signup" element={<SignUpPage />} />

    </Routes>

    <Toaster />

    </div>
  )
}

export default App