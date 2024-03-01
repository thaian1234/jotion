"use client";

import TextareaAutoSize from "react-textarea-autosize";
import { api } from "@/convex/_generated/api";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState, useTransition } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
	initialData: Preloaded<typeof api.documents.getById>;
	preview?: boolean;
}

export function Toolbar({ initialData, preview }: ToolbarProps) {
	const document = usePreloadedQuery(initialData);
	const coverImage = useCoverImage((state) => state);
	const update = useMutation(api.documents.update);
	const removeIcon = useMutation(api.documents.removeIcon);

	const debounced = useDebounceCallback(onEditing, 400);
	const [isPending, startTransition] = useTransition();
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<ElementRef<"textarea">>(null);

	if (!document) return <p className="pt-20">Loading...</p>;

	const enableEditing = () => {
		if (preview) return;

		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
		}, 200);
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	function onEditing(value: string) {
		if (!document?._id) return;

		startTransition(() => {
			update({
				id: document._id,
				title: value || "Untitled",
			}).catch((e: Error) => {
				toast.error(e.message);
			});
		});
	}

	const onIconSelect = (icon: string) => {
		if (!icon || !document._id) return;
		startTransition(() => {
			update({
				id: document._id,
				icon,
			}).catch((e: Error) => {
				toast.error(e.message);
			});
		});
	};

	const onRemoveIcon = () => {
		if (!document._id) return;

		startTransition(() => {
			removeIcon({ id: document._id }).catch((e: Error) => {
				toast.error(e.message);
			});
		});
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" || e.key === "Escape") {
			e.preventDefault();
			disableEditing();
		}
	};

	return (
		<div className="pl-[54px] group relative">
			{!!document.icon && !preview && (
				<div className="flex items-center gap-x-2 group/icon pt-6 w-max relative">
					<IconPicker onChange={onIconSelect}>
						<p className="text-6xl hover:opacity-75 transition">
							{document.icon}
						</p>
					</IconPicker>
					<Button
						onClick={onRemoveIcon}
						className="rounded-full opacity-100 group-hover/icon:opacity-100 transition text-muted-foreground text-xs size-auto p-2 absolute top-0 right-0 translate-x-[50%] -translate-y-[30%]"
						variant="outline"
						size={"icon"}
						disabled={isPending}
					>
						<X className="size-4" />
					</Button>
				</div>
			)}
			{!!document.icon && preview && (
				<p className="text-6xl pt-6">{document.icon}</p>
			)}
			<div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
				{!document.icon && !preview && (
					<IconPicker asChild onChange={onIconSelect}>
						<Button
							className="text-muted-foreground text-xs"
							variant={"outline"}
							size={"sm"}
							disabled={isPending}
						>
							<Smile className="size-4 mr-2" />
							Add icon
						</Button>
					</IconPicker>
				)}
				{!document.coverImage && !preview && (
					<Button
						onClick={coverImage.onOpen}
						className="text-muted-foreground text-xs"
						variant={"outline"}
						size={"sm"}
						disabled={isPending}
					>
						<ImageIcon className="size-4 mr-2" />
						Add cover
					</Button>
				)}
			</div>
			{isEditing && !preview ? (
				<TextareaAutoSize
					ref={inputRef}
					onBlur={disableEditing}
					onKeyDown={onKeyDown}
					defaultValue={document.title}
					onChange={(e) => debounced(e.target.value)}
					className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
				/>
			) : (
				<div
					onClick={enableEditing}
					className="pb-[11.5px] text-5xl font-bold break-words text-[#3f3f3f] dark:text-[#cfcfcf]"
				>
					{document.title}
				</div>
			)}
		</div>
	);
}
