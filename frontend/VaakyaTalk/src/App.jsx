import { Route, Routes } from "react-router"
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

    const {data, isLoading, error } = useQuery({
    queryKey: ["todos"],

    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me")
      // const data = await response.json()
      return response.data;
    }, 
    retry: false, // console error single time 
    })

    console.log(data);
    console.log({isLoading});
    console.log({error});

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