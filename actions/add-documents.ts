"use server";

import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import { fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";

export async function createDoc({ title }: { title: string }) {
	const token = await getAuthToken();
	if (!token) throw new Error("Unauthentication");

	await fetchMutation(api.documents.createDocument, { title }, { token })
		.then(() => {
			revalidatePath("/test");
		})
		.catch(() => {
			throw new Error("Failed to create");
		});
}
