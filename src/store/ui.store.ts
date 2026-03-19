import { create } from 'zustand';

interface UIState {
    sidebarOpen: boolean;
    collapsedSections: Record<number, boolean>;
    showNotifications: boolean;
    activeModal: string | null;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSection: (index: number) => void;
    toggleNotifications: () => void;
    setShowNotifications: (show: boolean) => void;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
    sidebarOpen: false,
    collapsedSections: {},
    showNotifications: false,
    activeModal: null,

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    toggleSection: (index) =>
        set((state) => ({
            collapsedSections: {
                ...state.collapsedSections,
                [index]: !state.collapsedSections[index],
            },
        })),

    toggleNotifications: () =>
        set((state) => ({ showNotifications: !state.showNotifications })),
    setShowNotifications: (show) => set({ showNotifications: show }),

    openModal: (modalId) => set({ activeModal: modalId }),
    closeModal: () => set({ activeModal: null }),
}));