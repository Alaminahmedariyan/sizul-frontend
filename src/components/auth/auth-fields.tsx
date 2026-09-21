"use client";

import { AlertCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IconInputProps = ComponentPropsWithoutRef<"input"> & {
  icon: ReactNode;
  trailing?: ReactNode;
};

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon, trailing, className, ...props }, ref) => (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground [&_svg]:size-4"
      >
        {icon}
      </span>
      <Input
        ref={ref}
        className={cn(
          "h-11 rounded-lg pl-10 text-[15px] shadow-xs",
          trailing ? "pr-11" : "",
          className,
        )}
        {...props}
      />
      {trailing ? (
        <div className="absolute inset-y-0 right-1.5 flex items-center">
          {trailing}
        </div>
      ) : null}
    </div>
  ),
);
IconInput.displayName = "IconInput";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<ComponentPropsWithoutRef<"input">, "type">
>(({ onKeyUp, onBlur, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  return (
    <div className="space-y-1.5">
      <IconInput
        ref={ref}
        type={visible ? "text" : "password"}
        icon={<Lock />}
        trailing={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {visible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        }
        onKeyUp={(event) => {
          setCapsOn(event.getModifierState("CapsLock"));
          onKeyUp?.(event);
        }}
        onBlur={(event) => {
          setCapsOn(false);
          onBlur?.(event);
        }}
        {...props}
      />
      {capsOn && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Caps Lock is on
        </p>
      )}
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export function AuthSubmitButton({
  busy,
  children,
}: {
  busy: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="submit"
      disabled={busy}
      className="h-11 w-full rounded-lg text-[15px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(17,18,59,0.3)] transition-all hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_-6px_color-mix(in_oklab,var(--primary)_60%,transparent)] active:translate-y-px"
    >
      {busy && <Loader2 className="size-4 animate-spin" />}
      {children}
    </Button>
  );
}

export function FormAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}