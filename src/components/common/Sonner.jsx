import { Toaster as SonnerPrimitive } from "sonner";

export function Toaster({ ...props }) {
  return (
    <SonnerPrimitive
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[hsl(0,0%,4%)] group-[.toaster]:text-[hsl(0,0%,98%)] group-[.toaster]:border-[hsl(0,0%,20%)] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[hsl(0,0%,70%)]",
          actionButton:
            "group-[.toast]:bg-[hsl(0,0%,98%)] group-[.toast]:text-[hsl(0,0%,9%)]",
          cancelButton:
            "group-[.toast]:bg-[hsl(0,0%,15%)] group-[.toast]:text-[hsl(0,0%,70%)]",
        },
      }}
      {...props}
    />
  );
}
