import Image from "next/image";
import Link from "next/link";

interface LogoProps {
	size: number;
}

export function Logo({ size }: LogoProps) {
	return (
		<Link href="/" className="flex flex-col items-center gap-x-2">
			<Image
				src="/logo.svg"
				width={size}
				height={size}
				alt="Logo"
				className="dark:hidden"
			/>
			<Image
				src="/logo-dark.svg"
				width={size}
				height={size}
				alt="Logo"
				className="hidden dark:block"
			/>
			<p className="font-semibold">Jotion</p>
		</Link>
	);
}
