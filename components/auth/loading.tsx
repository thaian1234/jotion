import Image from "next/image";

export function Loading() {
	return (
		<div className="size-full flex flex-col justify-center items-center">
			<Image
				src="/logo.svg"
				alt="Loading logo"
				width={120}
				height={120}
				className="animate-pulse duration-700 dark:hidden"
			/>
			<Image
				src="/logo-dark.svg"
				alt="Loading logo"
				width={120}
				height={120}
				className="animate-pulse duration-700 hidden dark:block"
			/>
		</div>
	);
}
