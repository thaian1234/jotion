"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/use-search";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useIsClient } from "usehooks-ts";

interface SearchCommandProps {}

export function SearchCommand({}: SearchCommandProps) {
	const isClient = useIsClient();
	const { user } = useUser();
	const router = useRouter();
	const documents = useQuery(api.documents.getSearch);
	const { isOpen, onClose, toggle } = useSearch((state) => state);

	const onSelect = (id: string) => {
		router.push(`/documents/${id}`);
		onClose();
	};

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggle();
			}
		};
		document.addEventListener("keydown", down);

		return () => document.removeEventListener("keydown", down);
	}, [toggle]);

	if (!isClient) return null;

	return (
		<CommandDialog open={isOpen} onOpenChange={onClose}>
			<CommandInput
				placeholder={`Search ${user?.fullName}'s Jotion...`}
			/>
			<CommandList>
				<CommandEmpty>No results found</CommandEmpty>
				<CommandGroup heading="Documents">
					{documents?.map((doc) => (
						<CommandItem
							key={doc._id}
							value={`${doc._id}-${doc.title}`}
							title={doc.title}
							onSelect={onSelect}
						>
							{doc.icon ? (
								<p className="mr-2 text-[18px]">{doc?.icon}</p>
							) : (
								<File className="mr-2 size-4" />
							)}
							<span>{doc.title}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
