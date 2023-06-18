import localFont from "next/font/local";

const monaSans = localFont({
  src: "../pages/Mona-Sans.woff2",
  variable: "--mona-sans",
  display: "swap",
  fallback: ["Arial, Helvetica, sans-serif", "Tahoma, Verdana, sans-serif"],
});

export { monaSans };
