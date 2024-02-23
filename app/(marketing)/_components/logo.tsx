import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo() {
	return (
		<div className="hidden md:flex items-center gap-x-2">
			<Image
				src="/logo.svg"
				width={40}
				height={40}
				alt="Logo"
				className="dark:hidden"
			/>
			<Image
				src="/logo-dark.svg"
				width={40}
				height={40}
				alt="Logo"
				className="hidden dark:block"
			/>
			<p className="font-semibold">Jotion</p>
		</div>
	);
}
