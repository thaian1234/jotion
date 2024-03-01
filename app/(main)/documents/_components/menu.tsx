"use client";

import { Id } from "@/convex/_generated/dataModel";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { startTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
	documentId: Id<"documents">;
}

export function Menu({ documentId }: MenuProps) {
	const router = useRouter();
	const { user } = useUser();

	const archive = useMutation(api.documents.archive);

	const onArchive = () => {
		startTransition(() => {
			archive({ id: documentId })
				.then(() => {
					toast.success("Note move to trash!");
				})
				.catch(() => {
					toast.error("Failed to archive note");
				});
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size={"sm"} variant={"ghost"}>
					<MoreHorizontal className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60" align="end" alignOffset={8}>
				<Button
					className="w-full justify-start rounded-none text-rose-600 hover:text-rose-600"
					variant={"ghost"}
					size={"sm"}
					onClick={onArchive}
				>
					<Trash className="size-4 mr-2" />
					Delete
				</Button>
				<DropdownMenuSeparator />
				<div className="text-xs text-muted-foreground p-2 truncate">
					Last edited by: {user?.fullName}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function MenuSkeleton() {
	return <Skeleton className="size-9" />;
}
