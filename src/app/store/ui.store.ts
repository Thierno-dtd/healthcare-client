
import { create } from 'zustand';

interface UIState {
    // Sidebar
    sidebarOpen: boolean;
    collapsedSections: Record<number, boolean>;

    // Notifications
    showNotifications: boolean;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSection: (index: number) => void;
    toggleNotifications: () => void;
    setShowNotifications: (show: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
    sidebarOpen: false,
    collapsedSections: {},
    showNotifications: false,

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

    toggleSection: (index: number) =>
        set((state) => ({
            collapsedSections: {
                ...state.collapsedSections,
                [index]: !state.collapsedSections[index],
            },
        })),

    toggleNotifications: () =>
        set((state) => ({ showNotifications: !state.showNotifications })),
    setShowNotifications: (show: boolean) => set({ showNotifications: show }),
}));