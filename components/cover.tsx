"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { startTransition } from "react";
import { removeCoverImage_Server } from "@/actions/add-documents";
import { toast } from "sonner";

interface CoverProps {
	initialData: Preloaded<typeof api.documents.getById>;
	preview?: boolean;
}

export function Cover({ initialData, preview }: CoverProps) {
	const params = useParams();
	const document = usePreloadedQuery(initialData);
	const removeCoverImage = useMutation(api.documents.removeCoverImage);
	const url = document?.coverImage;
	const coverImage = useCoverImage((state) => state);

	const onRemove = () => {
		removeCoverImage({
			id: params.documentId as Id<"documents">,
		});
	};

	return (
		<div
			className={cn(
				"relative w-full h-[45vh] group",
				!url && "h-[12vh]",
				url && "bg-muted"
			)}
		>
			{!!url && (
				<Image
					src={url}
					fill
					alt="Cover"
					className="object-cover aspect-video"
				/>
			)}
			{url && !preview && (
				<div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
					<Button
						onClick={coverImage.onOpen}
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