"use client";

import { Doc } from "@/convex/_generated/dataModel";
import {
	PopoverTrigger,
	Popover,
	PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";

interface PublishProps {
	initialData: Doc<"documents">;
}

export function Publish({ initialData }: PublishProps) {
	const [copied, setCopied] = useState(false);
	// const [isSubmitting, setIsSubmitting] = useState(false);
	const [isPending, startTransition] = useTransition();
	const origin = useOrigin();
	const update = useMutation(api.documents.update);

	const url = `${origin}/preview/${initialData._id}`;

	const onPublish = () => {
		startTransition(() => {
			update({ id: initialData._id, isPublished: true })
				.then(() => toast.success("Note published"))
				.catch(() => toast.error("Failed to publish note"));
		});
	};
	const onUnpublish = () => {
		startTransition(() => {
			update({ id: initialData._id, isPublished: false })
				.then(() => toast.success("Note unpublished"))
				.catch(() => toast.error("Failed to unpublish note"));
		});
	};

	const onCopy = () => {
		navigator.clipboard.writeText(url).then(() => {
			setCopied(true);
		});

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size={"sm"} variant={"outline"}>
					Publish{" "}
					{initialData.isPublished && (
						<Globe className="size-4 text-sky-400 ml-2" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-72"
				align="end"
				alignOffset={8}
				forceMount
			>
				{initialData.isPublished ? (
					<div className="space-y-4">
						<div className="flex items-center gap-x-2">
							<Globe className="text-sky-500 animate-pulse size-4" />
							<p className="text-sm font-medium text-sky-500">
								This note is live on web
							</p>
						</div>
						<div className="flex items-center">
							<input
								value={url}
								className="flex-1 px-2 text-xs rounded-l-md h-8 bg-muted truncate"
								disabled
							/>
							<Button
								onClick={onCopy}
								disabled={copied}
								className="h-8 rounded-l-none"
							>
								{copied ? (
									<Check className="size-4" />
								) : (
									<Copy className="size-4" />
								)}
							</Button>
						</div>
						<Button
							size={"sm"}
							className="w-full text-xs"
							disabled={isPending}
							onClick={onUnpublish}
						>
							Unpublish
						</Button>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center">
						<Globe className="size-8 text-muted-foreground mb-2" />
						<p className="text-sm font-medium mb-2">
							Publish this note
						</p>
						<span className="text-xs text-muted-foreground mb-4">
							Share your work with others
						</span>
						<Button
							disabled={isPending}
							onClick={onPublish}
							className="w-full text-xs"
							size={"sm"}
						>
							Publish
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
