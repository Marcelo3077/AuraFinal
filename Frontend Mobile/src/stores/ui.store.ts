import { create } from 'zustand';

interface UIState {
    isLoading: boolean;
    isSidebarOpen: boolean;

    setLoading: (loading: boolean) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isLoading: false,
    isSidebarOpen: false,

    setLoading: (loading) => set({ isLoading: loading }),

    toggleSidebar: () => set((state) => ({
        isSidebarOpen: !state.isSidebarOpen
    })),

    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
