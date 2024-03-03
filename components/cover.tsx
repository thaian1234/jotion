"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { startTransition } from "react";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
	initialData: Preloaded<typeof api.documents.getById>;
	preview?: boolean;
}

export function Cover({ initialData, preview }: CoverProps) {
	const { edgestore } = useEdgeStore();
	const coverImage = useCoverImage((state) => state);
	const params = useParams();
	const document = usePreloadedQuery(initialData);
	const removeCoverImage = useMutation(api.documents.removeCoverImage);
	const url = document?.coverImage;

	const onRemove = () => {
		if (!url) return;

		startTransition(() => {
			edgestore.publicFiles.delete({
				url: url,
			});
			removeCoverImage({
				id: params.documentId as Id<"documents">,
			})
				.then(() => {
					toast.success("Deleted cover image");
				})
				.catch(() => {
					toast.error("Failed to delete cover image");
				});
		});

		// removeCoverImage_Server(params.documentId as string);
	};

	return (
		<div
			className={cn(
				"relative w-full h-[45vh] group aspect-video",
				!url && "h-[12vh]",
				url && "bg-muted"
			)}
		>
			{!!url && (
				<Image
					src={url}
					fill
					alt="Cover"
					priority
					sizes="50vw"
					className="object-fill w-auto"
				/>
			)}
			{url && !preview && (
				<div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
					<Button
						onClick={() => {
							coverImage.onReplace(url);
						}}
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
					>
						<ImageIcon className="h-4 w-4 mr-2" />
						Change cover
					</Button>
					<Button
						onClick={onRemove}
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
					>
						<X className="h-4 w-4 mr-2" />
						Remove
					</Button>
				</div>
			)}
		</div>
	);
}

export function CoverSkeleton() {
	return <Skeleton className="w-full h-[12vh]" />;
}
