import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("vaakyatalk-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("vaakyatalk-theme", theme);
    set({ theme });
  },
}))