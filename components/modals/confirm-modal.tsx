"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ConfirmModalProps {
	children: React.ReactNode;
	confirm: () => void;
}

export function ConfirmModal({ children, confirm }: ConfirmModalProps) {
	const handleConfirm = () => {
		confirm();
	};
	return (
		<section onClick={(e) => e.stopPropagation()}>
			<AlertDialog>
				<AlertDialogTrigger>{children}</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure ?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</section>
	);
}
