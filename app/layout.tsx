import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { fontPoppins } from "@/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";

export const metadata: Metadata = {
	title: "Jotion",
	description: "The connected workspace where better, faster work happens.",
	icons: {
		icon: [
			{
				media: "(prefers-color-scheme: ligt)",
				url: "/logo.svg",
				href: "/logo.svg",
			},
			{
				media: "(prefers-color-scheme: dark)",
				url: "/logo-dark.svg",
				href: "/logo-dark.svg",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"bg-background font-sans antialiased",
					fontPoppins.variable
				)}
			>
				<ConvexClientProvider>
					<EdgeStoreProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							storageKey="jotion-theme-2"
						>
							<Toaster position="bottom-center" />
							<ModalProvider />
							{children}
						</ThemeProvider>
					</EdgeStoreProvider>
				</ConvexClientProvider>
			</body>
		</html>
	);
}
