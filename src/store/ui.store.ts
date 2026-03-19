import { create } from 'zustand';

interface UIStoreState {
    sidebarOpen: boolean;
    collapsedSections: Record<number, boolean>;
    showNotifications: boolean;
    activeModal: string | null;

    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSection: (index: number) => void;
    toggleNotifications: () => void;
    setShowNotifications: (show: boolean) => void;
    openModal: (id: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIStoreState>()((set) => ({
    sidebarOpen: false,
    collapsedSections: {},
    showNotifications: false,
    activeModal: null,

    toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen })),

    setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

    toggleSection: (index) =>
        set((s) => ({
            collapsedSections: {
                ...s.collapsedSections,
                [index]: !s.collapsedSections[index],
            },
        })),

    toggleNotifications: () =>
        set((s) => ({ showNotifications: !s.showNotifications })),

    setShowNotifications: (show) =>
        set({ showNotifications: show }),

    openModal: (id) => set({ activeModal: id }),
    closeModal: () => set({ activeModal: null }),
}));
