import { Cover } from "@/components/cover";
import { PreviewEditor } from "@/components/preview-editor";
import { Toolbar } from "@/components/toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { redirect } from "next/navigation";

interface DocumentIdPageProps {
	params: {
		documentId: Id<"documents">;
	};
}

export default async function DocumentIdPage({ params }: DocumentIdPageProps) {
	const token = await getAuthToken();
	const document = await preloadQuery(
		api.documents.getById,
		{
			documentId: params.documentId,
		},
		{ token }
	).catch(() => {
		redirect("/");
	});

	const documentData = preloadedQueryResult(document);

	if (!documentData || !documentData?.isPublished) redirect("/");

	return (
		<section className="pb-40">
			<Cover preview initialData={document} />
			<div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
				<Toolbar preview initialData={document} />
				{/* <Editor editable /> */}
				<PreviewEditor
					editable={false}
					documentId={params.documentId}
					initialData={document}
				/>
			</div>
		</section>
	);
}
