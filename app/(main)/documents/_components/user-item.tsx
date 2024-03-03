import { ChevronsLeftRight } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
export function UserItem() {
	const { user } = useUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="hover:bg-primary/5 w-full justify-start rounded-none"
					variant="ghost"
				>
					<div className="gap-x-2 flex items-center max-w-[150px]">
						<Avatar className="size-5">
							<AvatarImage src={user?.imageUrl} alt="Avatar" />
						</Avatar>
						<span className="text-start font-medium truncate">
							{user?.fullName} &apos;s Jotion
						</span>
					</div>
					<ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-80"
				align="start"
				alignOffset={11}
			>
				<div className="flex flex-col space-y-4 p-2">
					<p className="text-xs font-medium leading-none text-muted-foreground">
						{user?.emailAddresses[0].emailAddress}
					</p>
					<div className="flex items-center gap-x-2">
						<div className="rounded-md bg-secondary p-1">
							<Avatar className="size-8">
								<AvatarImage src={user?.imageUrl} />
							</Avatar>
						</div>
						<div className="space-y-1">
							<p className="text-sm line-clamp-1">
								{user?.fullName} &apos;s Jotion
							</p>
						</div>
					</div>
				</div>

				<DropdownMenuSeparator />
				<DropdownMenuItem className="w-full text-muted-foreground">
					<Button
						asChild
						className="size-full justify-start"
						variant={"ghost"}
						size="icon"
					>
						<SignOutButton >Log out</SignOutButton>
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
