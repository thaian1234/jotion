import { create } from "zustand";

type CoverImageStore = {
	url?: string;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onReplace: (url: string) => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
	url: undefined,
	isOpen: false,
	onClose() {
		set({ isOpen: false, url: undefined });
	},
	onOpen() {
		set({ isOpen: true, url: undefined });
	},
	onReplace(url) {
		set({ url, isOpen: true });
	},
}));
