import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("vakyatalk-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("vakyatalk-theme", theme);
    set({ theme });
  },
}))