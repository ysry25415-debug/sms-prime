import { create } from "zustand";

type ShellState = {
  mobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
};

export const useShellStore = create<ShellState>((set) => ({
  mobileNavOpen: false,
  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen }))
}));
