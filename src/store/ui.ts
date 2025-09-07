import { create } from "zustand";

interface UIState {
	sidebarOpen: boolean;
	theme: "light" | "dark" | "system";
	notification: Array<{
		id: string;
		type: "success" | "error" | "waring" | "info";
		title: string;
		message: string;
		timestamp: Date;
	}>;
}

interface UIActions {
	setSidebarOpen: (open: boolean) => void;
	toggleSidebar: () => void;
	setTheme: (theme: UIState["theme"]) => void;
	addNotification: (
		notification: Omit<UIState["notification"][0], "id" | "timestamp">,
	) => void;
	removeNotification: (id: string) => void;
	clearNotification: () => void;
}

export const uiStore = create<UIState & UIActions>((set, get) => ({
	sidebarOpen: false,
	theme: "system",
	notification: [],

	setSidebarOpen: (open) => set({ sidebarOpen: open }),

	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

	setTheme: (theme) => {
		set({ theme });
		localStorage.setItem("theme", theme);
	},

	addNotification: (notification) => {
		const id = Math.random().toString(36).substring(2, 9);

		set((state) => ({
			notification: [
				...state.notification,
				{ ...notification, id, timestamp: new Date() },
			],
		}));

		setTimeout(() => {
			get().removeNotification(id);
		}, 5000);
	},

	removeNotification: (id) =>
		set((state) => ({
			notification: state.notification.filter((n) => n.id !== id),
		})),

	clearNotification: () => set({ notification: [] }),
}));
