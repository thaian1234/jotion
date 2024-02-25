import { ClerkLoaded, ClerkLoading, auth } from "@clerk/nextjs";
import { Navigation } from "./_components/navigation";
import { Loading } from "@/components/auth/loading";
import { redirect } from "next/navigation";

export default async function Mainlayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<ClerkLoading>
				<Loading />
			</ClerkLoading>
			<ClerkLoaded>
				<div className="h-full flex">
					<Navigation />
					<main className="flex-1 h-full overflow-y-auto">
						{children}
					</main>
				</div>
			</ClerkLoaded>
		</>
	);
}
