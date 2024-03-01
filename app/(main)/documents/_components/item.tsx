"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import {
	ChevronDown,
	ChevronRight,
	LucideIcon,
	MoreHorizontal,
	Plus,
	Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface ItemProps {
	id?: Id<"documents">;
	documentIcon?: string;
	active?: boolean;
	expanded?: boolean;
	onExpanded?: () => void;
	isSearch?: boolean;
	level?: number;
	onClick?: () => void;
	label: string;
	icon: LucideIcon;
}

export function Item({
	icon: Icon,
	label,
	onClick,
	active,
	documentIcon,
	expanded,
	id,
	isSearch,
	onExpanded,
	level = 0,
}: ItemProps) {
	const { user } = useUser();
	const router = useRouter();
	const create = useMutation(api.documents.createDocument);
	const archive = useMutation(api.documents.archive);
	const ChevronIcon = expanded ? ChevronDown : ChevronRight;

	const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation();
		onExpanded?.();
	};

	const onArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		// e.stopPropagation();
		if (!id) return;

		const promise = archive({ id });

		toast.promise(promise, {
			loading: "Removing to trash...",
			success: "Note moved to trash",
			error: "Failed to archive note",
		});
	};

	const onCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		if (!id) return;

		const promise = create({ title: "Untitled", parentDocument: id }).then(
			(documentId) => {
				if (!expanded) {
					onExpanded?.();
				}
				router.push(`/documents/${documentId}`);
			}
		);

		toast.promise(promise, {
			loading: "Creating a new note...",
			success: "New note created!",
			error: "Failed to create new note!",
		});
	};

	return (
		<div
			onClick={onClick}
			role="button"
			style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
			className={cn(
				"group min-h-[27px] text-sm py-2 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
				active && "bg-primary/5 text-primary"
			)}
		>
			{!!id && (
				<div
					role="button"
					className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
					onClick={handleExpand}
				>
					<ChevronIcon className="size-4 shrink-0 text-muted-foreground/50" />
				</div>
			)}
			{documentIcon ? (
				<div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
			) : (
				<Icon className="srink-0 h-[18px] mr-2 text-muted-foreground" />
			)}

			<span className="truncate">{label}</span>
			{isSearch && (
				<kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
					<span>Ctrl</span>+ K
				</kbd>
			)}
			{!!id && (
				<div className="ml-auto flex items-center gap-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							onClick={(e) => e.stopPropagation()}
						>
							<Button
								className="opacity-0 group-hover:opacity-100 size-auto ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-1"
								variant={"ghost"}
							>
								<MoreHorizontal className="size-4 text-muted-foreground" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-60"
							align="start"
							side="right"
							forceMount
							onClick={(e) => e.stopPropagation()}
						>
							<DropdownMenuItem
								asChild
								onClick={(e) => e.stopPropagation()}
							>
								<button
									className="w-full justify-start rounded-none cursor-pointer text-rose-500 hover:bg-red-300/60"
									onClick={onArchive}
								>
									<Trash
										className="size-4 mr-2"
										aria-label="Trash"
									/>
									Delete
								</button>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<div className="text-xs text-muted-foreground p-2 truncate">
								Last edited by:{" "}
								<span className="font-semibold truncate">
									{user?.fullName}
								</span>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="ghost"
						className="opacity-0 group-hover:opacity-100 size-auto ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-1"
						size="icon"
						onClick={onCreate}
					>
						<Plus className="size-4 text-muted-foreground" />
					</Button>
				</div>
			)}
		</div>
	);
}

export function ItemSkeleton({ level }: { level?: number }) {
	return (
		<div
			style={{
				paddingLeft: level ? `${level * 12 + 26}px` : "12px",
			}}
			className="flex space-x-2 py-[4px]"
		>
			<Skeleton className="size-6" />
			<Skeleton className="h-6 w-[50%]" />
		</div>
	);
}
