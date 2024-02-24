import { Poppins as FontPoppins } from "next/font/google";

export const fontPoppins = FontPoppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
