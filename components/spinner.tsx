import { Loader } from "lucide-react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("text-muted-foreground animate-spin", {
	variants: {
		size: {
			default: "size-4",
			sm: "size-2",
			lg: "size-6",
			icon: "size-10",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

interface SpinnerProps
	extends VariantProps<typeof spinnerVariants>,
		React.HTMLAttributes<HTMLDivElement> {}

function Spinner({ size, className }: SpinnerProps) {
	return <Loader className={cn(spinnerVariants({ size, className }))} />;
}

export { Spinner };
