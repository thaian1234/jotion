import { ButtonCreateNote } from "@/components/button-create-note";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/clerk-react";
import { auth, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
	// const { user, isLoaded } = useUser();
	const user = await currentUser();
	if (!user) redirect("/");

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

			<h2 className="text-lg font-medium">
				Welcome to {user?.firstName}&apos;s Jotion
			</h2>

			<ButtonCreateNote />
		</section>
	);
}
