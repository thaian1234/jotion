"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { remove } from "@/convex/documents";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { redirect, useRouter } from "next/navigation";
import { startTransition } from "react";
import { toast } from "sonner";

interface BannerProps {
	documentId: Id<"documents">;
}

export function Banner({ documentId }: BannerProps) {
	const router = useRouter();

	const remove = useMutation(api.documents.remove);
	const restore = useMutation(api.documents.restore);

	const onRemove = () => {
		// const promise = remove({ id: documentId }).then(() => {
		// 	router.push(`/documents`);
		// });

		// toast.promise(promise, {
		// 	loading: "Deleting note...",
		// 	success: () => {
		// 		router.push(`/documents`);
		// 		return "Note deleted";
		// 	},
		// 	error(e) {
		// 		if (e instanceof ConvexError) {
		// 			return e.data;
		// 		}
		// 		return "Failed to delete note";
		// 	},
		// });
		startTransition(() => {
			remove({ id: documentId })
				.then(() => {
					toast.success("Note deleted");
				})
				.catch((e) => {
					if (e instanceof ConvexError) toast.error(e.data);
				});
		});
		router.replace("/documents");
	};
	const onRestore = () => {
		const promise = restore({ id: documentId });

		toast.promise(promise, {
			loading: "Restoring note...",
			success: "Note restored",
			error(e) {
				if (e instanceof ConvexError) {
					return e.data;
				}
				return "Failed to restore note";
			},
		});
	};
	return (
		<div className="w-full bg-red-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
			<p>This page is in the Trash.</p>
			<Button
				className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
				size={"sm"}
				onClick={onRestore}
				variant={"outline"}
			>
				Restore the page
			</Button>
			<ConfirmModal confirm={onRemove}>
				<Button
					className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
					size={"sm"}
					variant={"outline"}
				>
					Delete forever
				</Button>
			</ConfirmModal>
		</div>
	);
}
