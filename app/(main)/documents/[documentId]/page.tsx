import { Cover } from "@/components/cover";
import { PreviewEditor } from "@/components/preview-editor";
import { Toolbar } from "@/components/toolbar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

interface DocumentIdPageProps {
	params: {
		documentId: Id<"documents">;
	};
}

export default async function DocumentIdPage({ params }: DocumentIdPageProps) {
	const document = await preloadQuery(api.documents.getById, {
		documentId: params.documentId,
	}).catch(() => {
		redirect("/documents");
	});

	if (!document) redirect("/documents");

	return (
		<section className="pb-40">
			<Cover initialData={document} />
			<div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
				<Toolbar initialData={document} />
				{/* <Editor editable /> */}
				<PreviewEditor
					documentId={params.documentId}
					initialData={document}
				/>
			</div>
		</section>
	);
}
