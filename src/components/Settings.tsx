"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Settings() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute right-4 top-2">
      <Button
        size="icon"
        onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      >
        {resolvedTheme === "light" ? <Moon /> : <Sun />}
        <p className="sr-only">Toggle Theme</p>
      </Button>
    </div>
  );
}
