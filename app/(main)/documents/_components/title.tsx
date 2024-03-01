import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { startTransition, useRef, useState } from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

interface TitleProps {
	initialData: Doc<"documents">;
}

export function Title({ initialData }: TitleProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const update = useMutation(api.documents.update);

	const debounced = useDebounceCallback(onChange, 500);
	const [isEditing, setIsEditing] = useState(false);

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
		}, 200);
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		// setTitle(e.target.value);
		// startTransition(() => {
		// 	update({
		// 		id: initialData._id,
		// 		title: e.target.value || "Untitled",
		// 	});
		// });
		startTransition(() => {
			update({
				id: initialData._id,
				title: e.target.value || "Untitled",
			}).catch((e) => {
				if (e instanceof ConvexError) toast.error(e.data);
			});
		});
	}

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape" || e.key === "Enter") {
			disableEditing();
		}
	};

	return (
		<div className="flex items-center gap-x-1">
			{!!initialData.icon && <p>{initialData.icon}</p>}
			{isEditing ? (
				<Input
					ref={inputRef}
					onClick={enableEditing}
					onBlur={disableEditing}
					onChange={debounced}
					onKeyDown={onKeyDown}
					// value={title}
					defaultValue={initialData?.title || "Untitled"}
					className="h-7 px-2 focus-visible:ring-transparent"
				/>
			) : (
				<p>
					<Button
						onClick={enableEditing}
						variant={"ghost"}
						size={"sm"}
						className="font-normal h-auto p-1"
					>
						<span className="truncate">{initialData?.title}</span>
					</Button>
				</p>
			)}
		</div>
	);
}

export function TitleSkeleton() {
	return <Skeleton className="h-7 w-32 rounded-md" />;
}
