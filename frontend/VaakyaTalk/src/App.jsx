import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import toast, { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios.js"


function App() {

  // delete => post put delete 
  // get => get 

  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],

    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me")
      // const data = await response.json()
      return response.data;
    },
    retry: false, // console error single time 
  })

  const authUser = authData?.user

  return (
    <div className="h-screen" data-theme="forest">

      <button onClick={() => toast.success("Hello Ashutosh")}> Click Button</button>


      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login"  />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login"  />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"  />} />
        <Route path="/notification" element={authUser ? <NotificationPage /> : <Navigate to="/login"  />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login"  />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"  />} />
      </Routes>

      <Toaster />


    </div>
  )
}

export default App