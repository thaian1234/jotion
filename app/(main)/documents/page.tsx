"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { useDarkMode } from "usehooks-ts";

export default function DocumentsPage() {
	const { user, isLoaded } = useUser();
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
		<section className="h-full flex flex-col items-center justify-center space-y-4">
			<Image
				src="/empty.png"
				height="300"
				width="300"
				alt="Empty"
				className="dark:hidden"
				priority
			/>
			<Image
				src="/empty-dark.png"
				height="300"
				width="300"
				alt="Empty"
				className="hidden dark:block"
				priority
			/>
			{!isLoaded ? (
				<Skeleton className="w-52 h-10" />
			) : (
				<h2 className="text-lg font-medium">
					Welcome to {user?.firstName}&apos;s Jotion
				</h2>
			)}

			<Button onClick={handleCreateDocument} disabled={isPending}>
				{isPending ? (
					<Spinner className="size-4 mr-2" />
				) : (
					<PlusCircle className="size-4 mr-2" />
				)}
				Create a note
			</Button>
		</section>
	);
}
