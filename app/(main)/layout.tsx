import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Navigation } from "./_components/navigation";
import { redirect } from "next/navigation";
import { Loading } from "@/components/auth/loading";

export default function Mainlayout({
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
