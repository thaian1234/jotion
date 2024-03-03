import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import { fetchQuery, preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Item } from "./_components/item";

export default async function TestPage() {
	const token = await getAuthToken();
	if (!token) redirect("/");

	// const data = await fetchQuery(api.documents.getSidebar, {}, { token });
	// console.log(data);
	const document = await preloadQuery(
		api.documents.getSidebar,
		{},
		{ token }
	);

	const documentTitle = preloadedQueryResult(document);
	console.log(documentTitle);

	if (!documentTitle) redirect("/");

	return <Item data={document} 
	
	title={documentTitle} />;
}
