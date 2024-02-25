import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import {
	fetchMutation,
	fetchQuery,
	preloadQuery,
	preloadedQueryResult,
} from "convex/nextjs";
import { redirect } from "next/navigation";
import { DataItem } from "./_components/data-item";

export default async function TestPage() {
	const token = await getAuthToken();
	if (!token) redirect("/");

	const documents = await preloadQuery(
		api.documents.getDocuments,
		{},
		{
			token,
		}
	);
	return <DataItem preloadedData={documents} />;
}
