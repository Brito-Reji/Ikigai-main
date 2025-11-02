import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sidebarOpen: false,
    mobileMenuOpen: false,
    theme: 'light',
    notifications: [],
    loading: {
        global: false,
        components: {}
    },
    modals: {
        isOpen: false,
        type: null,
        data: null
    }
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        setMobileMenuOpen: (state, action) => {
            state.mobileMenuOpen = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.push({
                id: Date.now(),
                ...action.payload
            });
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        setGlobalLoading: (state, action) => {
            state.loading.global = action.payload;
        },
        setComponentLoading: (state, action) => {
            const { component, loading } = action.payload;
            state.loading.components[component] = loading;
        },
        openModal: (state, action) => {
            state.modals.isOpen = true;
            state.modals.type = action.payload.type;
            state.modals.data = action.payload.data || null;
        },
        closeModal: (state) => {
            state.modals.isOpen = false;
            state.modals.type = null;
            state.modals.data = null;
        }
    }
});

export const {
    toggleSidebar,
    setSidebarOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    setGlobalLoading,
    setComponentLoading,
    openModal,
    closeModal
} = uiSlice.actions;

export default uiSlice.reducer;