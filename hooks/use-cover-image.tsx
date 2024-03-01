import { create } from "zustand";

type CoverImageStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
	isOpen: false,
	onClose() {
		set({ isOpen: false });
	},
	onOpen() {
		set({ isOpen: true });
	},
}));


