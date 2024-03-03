import Image from "next/image";
import Link from "next/link";

export function Logo() {
	return (
		<Link href={"/"} className="hidden md:flex items-center gap-x-2">
			<Image
				src="/logo.svg"
				width={40}
				height={40}
				alt="Logo"
				priority
				className="dark:hidden"
			/>
			<Image
				src="/logo-dark.svg"
				width={40}
				height={40}
				priority
				alt="Logo"
				className="hidden dark:block"
			/>
			<p className="font-semibold">Jotion</p>
		</Link>
	);
}
