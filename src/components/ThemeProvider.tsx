import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "./ui/sonner";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors expand />
    </NextThemesProvider>
  );
}
