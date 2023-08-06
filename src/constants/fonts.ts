import { Fira_Mono } from "next/font/google";
import localFont from "next/font/local";

const monaSans = localFont({
  src: "../assets/fonts/Mona-Sans.woff2",
  variable: "--mona-sans",
  display: "swap",
  fallback: ["Arial, Helvetica, sans-serif", "Tahoma, Verdana, sans-serif"],
});

const firaMono = Fira_Mono({
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
});

export { monaSans, firaMono };
