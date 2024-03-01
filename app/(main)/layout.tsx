import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Navigation } from "./documents/_components/navigation";
import { Loading } from "@/components/auth/loading";
import { SearchCommand } from "@/components/search-command";

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
						<SearchCommand />
						{children}
					</main>
				</div>
			</ClerkLoaded>
		</>
	);
}
