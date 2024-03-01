"use client";

import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { SettingsModal } from "@/components/modals/settings-modal";
import { useIsClient } from "usehooks-ts";

export function ModalProvider() {
	const isClient = useIsClient();
	if (!isClient) return null;

	return (
		<>
			<SettingsModal />
			<CoverImageModal />
		</>
	);
}
