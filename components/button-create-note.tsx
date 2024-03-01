"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Spinner } from "./spinner";
import { PlusCircle } from "lucide-react";

export function ButtonCreateNote() {
	const create = useMutation(api.documents.createDocument);
	const [isPending, startTransition] = useTransition();

	const handleCreateDocument = () => {
		startTransition(() => {
			create({ title: "Untitled" })
				.then(() => {
					toast.success("New note created");
				})
				.catch((e: Error) => {
					toast.error(e.message);
				});
		});
	};

	return (
		<Button onClick={handleCreateDocument} disabled={isPending}>
			{isPending ? (
				<Spinner className="size-4 mr-2" />
			) : (
				<PlusCircle className="size-4 mr-2" />
			)}
			Create a note
		</Button>
	);
}
