"use client";

import { SettingsModal } from "@/components/modals/settings-modal";
import { useIsClient } from "usehooks-ts";

export function ModalProvider() {
	const isClient = useIsClient();

	if (!isClient) return null;
	return (
		<>
			<SettingsModal />
		</>
	);
}
