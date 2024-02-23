"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Heading() {
	const { isAuthenticated, isLoading } = useConvexAuth();

	return (
		<header className="max-w-3xl space-y-4">
			<h1 className="scroll-m-20 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
				Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
				<span className="underline">Jotion</span>
			</h1>
			<h3 className="scroll-m-20 text-base sm:text-xl md:text-2xl font-semibold tracking-tight">
				Jotion is the connected workspace where <br /> better, faster
				work happens
			</h3>
			{isLoading && (
				<div className="w-full flex items-center justify-center">
					<Spinner size="lg" />
				</div>
			)}
			{isAuthenticated && !isLoading && (
				<Button asChild className="font-semibold">
					<Link href="/documents">
						Enter Jotion
						<ArrowRight className="size-4 ml-2" />
					</Link>
				</Button>
			)}
			{!isAuthenticated && !isLoading && (
				<SignInButton mode="modal">
					<Button>
						Get Jotion Free <ArrowRight className="size-4 ml-2" />
					</Button>
				</SignInButton>
			)}
		</header>
	);
}
