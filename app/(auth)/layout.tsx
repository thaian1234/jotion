import { Logo } from "@/components/ui/logo";
import { Navbar } from "../(marketing)/_components/navbar";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className="flex flex-col gap-y-4 h-screen items-center justify-center">
			<Navbar />
			<Logo size={120} />
			{children}
		</section>
	);
}
