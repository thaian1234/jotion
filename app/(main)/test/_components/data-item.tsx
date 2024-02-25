"use client";

import { createDoc } from "@/actions/add-documents";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { useTransition } from "react";

type Documents = Doc<"documents">;

interface DataItemProps {
	preloadedData: Preloaded<typeof api.documents.getDocuments>;
}

export function DataItem({ preloadedData }: DataItemProps) {
	const data = usePreloadedQuery(preloadedData);
	const create = useMutation(api.documents.createDocument);
	const [isPending, startTransition] = useTransition();
	return (
		<div>
			{data.map((item) => (
				<p key={item._id}>{item.title}</p>
			))}
			<Button
				disabled={isPending}
				onClick={() => {
					startTransition(() => {
						createDoc({ title: "new doc1" });
						// create({ title: "New " });
					});
				}}
			>
				Add item
			</Button>
		</div>
	);
}
