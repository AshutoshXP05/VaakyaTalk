fetch("http://localhost:3000/api/auth/onboarding", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include", // Make sure cookies are sent
  body: JSON.stringify({
    userName: "Ashutosh",
    bio: "Language enthusiast",
    nativeLanguage: "Hindi",
    learningLanguage: "English",
    location: "India"
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
