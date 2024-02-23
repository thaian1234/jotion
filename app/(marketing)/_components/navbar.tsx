"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export function Navbar() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const { scrolled } = useScrollTop();

	return (
		<nav
			className={cn(
				"z-50 bg-background fixed top-0 flex items-center w-full p-6",
				scrolled &&
					"border-b shadow-sm dark:border-white/20 transition-colors"
			)}
		>
			<Logo />
			<div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-3">
				{isLoading && <Spinner size="lg" />}
				{!isAuthenticated && !isLoading && (
					<>
						<SignInButton mode="modal">
							<Button
								variant={"outline"}
								size="sm"
								className="font-semibold"
							>
								Sign in
							</Button>
						</SignInButton>
						<SignUpButton mode="modal">
							<Button size="sm" className="font-semibold">
								Get Jotion Free
							</Button>
						</SignUpButton>
					</>
				)}
				{isAuthenticated && !isLoading && (
					<>
						<Button variant={"ghost"} size={"sm"} asChild>
							<Link href="/documents">Enter Jotion</Link>
						</Button>
						<UserButton afterSignOutUrl="/" />
					</>
				)}
				<ModeToggle />
			</div>
		</nav>
	);
}
