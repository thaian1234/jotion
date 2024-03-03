"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import dynamic from "next/dynamic";
import { Spinner } from "./spinner";
import { Id } from "@/convex/_generated/dataModel";
import { startTransition, useMemo } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type PreviewEditorProps = {
	initialData: Preloaded<typeof api.documents.getById>;
	documentId: Id<"documents">;
	editable?: boolean;
};

export function PreviewEditor({
	documentId,
	initialData,
	editable,
}: PreviewEditorProps) {
	const document = usePreloadedQuery(initialData);
	const update = useMutation(api.documents.update);

	const Editor = useMemo(
		() =>
			dynamic(() => import("./editor").then((mod) => mod.Editor), {
				loading: () => (
					<div className="w-full flex items-center justify-center mt-10">
						<Spinner size={"lg"} />
					</div>
				),
				ssr: false,
			}),
		[]
	);

	if (document === null) return null;

	const onChange = (content: string) => {
		startTransition(() => {
			update({
				id: documentId,
				content,
			}).catch(() => {
				toast.error("Failed to update note");
			});
		});
	};

	return (
		<>
			<Editor
				editable={editable}
				onChange={onChange}
				initialContent={document.content}
			/>
		</>
	);
}
