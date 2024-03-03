"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Title, TitleSkeleton } from "./title";
import { Banner } from "./banner";
import { Menu, MenuSkeleton } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
	isCollapsed: boolean;
	onResetWidth: () => void;
}

export function Navbar({ isCollapsed, onResetWidth }: NavbarProps) {
	const params = useParams();
	const document = useQuery(api.documents.getById, {
		documentId: params.documentId as Id<"documents">,
	});

	if (document === null) notFound();

	if (document === undefined)
		return (
			<nav className="bg-background px-3 py-2 flex w-full items-center justify-between">
				<TitleSkeleton />
				<div className="flex items-center gap-x-2">
					<MenuSkeleton />
				</div>
			</nav>
		);

	return (
		<>
			<nav className="bg-background px-3 py-2 flex w-full items-center gap-x-4">
				{isCollapsed && (
					<MenuIcon
						aria-label="Menu button"
						role="button"
						onClick={onResetWidth}
						className="size-6 text-muted-foreground"
					/>
				)}
				<div className="flex items-center justify-between w-full">
					<Title initialData={document} />
					<div className="flex items-center gap-x-2">
						<Publish initialData={document} />
						<Menu documentId={document._id} />
					</div>
				</div>
			</nav>
			{document.isArchived && <Banner documentId={document._id} />}
		</>
	);
}
