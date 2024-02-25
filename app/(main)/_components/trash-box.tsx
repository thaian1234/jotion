"use client";

import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontal, SearchIcon, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ItemSkeleton } from "./item";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface TrashBoxProps {}

export function TrashBox({}: TrashBoxProps) {
	const router = useRouter();
	const params = useParams();
	const documents = useQuery(api.documents.getTrash);
	const restore = useMutation(api.documents.restore);
	const remove = useMutation(api.documents.remove);

	const [search, setSearch] = useState("");

	const filteredDocuments = documents?.filter((doc) => {
		return doc.title.toLowerCase().includes(search.toLowerCase());
	});

	const onClick = (documentId: string) => {
		router.push(`/documents/${documentId}`);
	};

	const onRestore = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		documentId: Id<"documents">
	) => {
		e.stopPropagation();
		const promise = restore({ id: documentId });

		toast.promise(promise, {
			loading: "Restoring note...",
			success: "Note restored",
			error(error: Error) {
				return error.message;
			},
		});
	};
	const onRemove = (documentId: Id<"documents">) => {
		const promise = remove({ id: documentId });

		toast.promise(promise, {
			loading: "Deleting note...",
			success: "Note deleted",
			error(error: Error) {
				return error.message;
			},
		});

		if (params.documentId === documentId) {
			router.replace("/documents");
		}
	};

	if (documents === undefined) {
		return (
			<div className="h-full flex flex-col space-y-2 items-start justify-start p-4">
				<Skeleton className="w-full h-8" />
				{Array.from({
					length: 5,
				}).map((_, i) => (
					<Skeleton key={i} className="w-[40%] h-6" />
				))}
				<MoreHorizontal className="size-7 animate-pulse text-muted-foreground mx-auto" />
			</div>
		);
	}

	return (
		<section className="text-sm">
			<div className="flex items-center p-2">
				<div className="relative w-full mt-2">
					<SearchIcon className="size-4 absolute right-3 top-1/2  -translate-y-1/2 z-50" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-7 px-2 py-4 focus-visible:ring-transparent bg-secondary/80 relative"
						placeholder="Filter by page title..."
					/>
				</div>
			</div>
			<ScrollArea className="mt-1 pb-1 h-72">
				<p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
					No documents found
				</p>
				{filteredDocuments?.map((doc) => (
					<div
						key={doc._id}
						role="button"
						onClick={() => {
							onClick(doc._id);
						}}
						className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center p-1 text-primary justify-between pr-3"
					>
						<span className="truncate pl-2">{doc.title}</span>
						<div className="flex items-center space-x-1">
							<div
								onClick={(e) => onRestore(e, doc._id)}
								role="button"
								className="rounded-sm p-2 hover:bg-neutral-200"
							>
								<Undo className="size-4 text-muted-foreground" />
							</div>
							<ConfirmModal
								confirm={() => {
									onRemove(doc._id);
								}}
							>
								<div
									role="button"
									className="rounded-sm p-2 hover:bg-neutral-200"
								>
									<Trash className="size-4 text-muted-foreground text-rose-500" />
								</div>
							</ConfirmModal>
						</div>
					</div>
				))}
				<ScrollBar orientation="vertical" />
			</ScrollArea>
		</section>
	);
}
