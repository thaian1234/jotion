import Image from "next/image";

export function Heroes() {
	return (
		<section className="flex flex-col items-center justify-center max-w-5xl">
			<div className="flex items-center">
				<div className="relative size-[300px] sm:size-[350px] md:size-[400px]">
					<Image
						src="/documents.png"
						fill
						sizes="50vw"
						alt="Documents"
						className="object-contain dark:hidden"
						priority
					/>
					<Image
						src="/documents-dark.png"
						fill
						sizes="50vw"
						alt="Documents"
						className="object-contain hidden dark:block"
						priority
					/>
				</div>
				<div className="relative size-[400px] hidden md:block">
					<Image
						src="/reading.png"
						fill
						sizes="50vw"
						className="object-contain dark:hidden"
						alt="Reading"
						priority
					/>
					<Image
						src="/reading-dark.png"
						fill
						sizes="50vw"
						className="object-contain hidden dark:block"
						alt="Reading"
						priority
					/>
				</div>
			</div>
		</section>
	);
}
