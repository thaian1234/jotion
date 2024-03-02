"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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

export async function removeCoverImage_Server(documentId: string) {
	try {
		const token = await getAuthToken();
		if (!token) throw new Error("Unauthentication");

		const deletedImage = await fetchMutation(
			api.documents.removeCoverImage,
			{ id: documentId as Id<"documents"> }
		);

		// revalidatePath(`/documents/${documentId}`);

		return deletedImage;
	} catch (error) {
		throw new Error("Failed to delete cover image");
	}
}
