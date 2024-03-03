"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Preloaded, usePreloadedQuery } from "convex/react";

interface ItemProps {
	data: Preloaded<typeof api.documents.getSidebar>;
	title: Doc<"documents">[];
}

export function Item({ data, title }: ItemProps) {
	const document = usePreloadedQuery(data);

	return (
		<div>
			{document?.map((doc) => (
				<li key={doc._id}>{doc.title}</li>
			))}
			<div className="mt-10">
				{title?.map((doc) => (
					<li key={doc._id}>{doc.title}</li>
				))}
			</div>
		</div>
	);
}
