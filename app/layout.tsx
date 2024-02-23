import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { fontPoppins } from "@/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import { ConvexClientProvider } from "@/providers/convex-provider";

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
		<ConvexClientProvider>
			<html lang="en">
				<body
					className={cn(
						"bg-background font-sans antialiased",
						fontPoppins.variable
					)}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						storageKey="jotion-theme-2"
					>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ConvexClientProvider>
	);
}
