import "@ncdai/react-wheel-picker/style.css";

import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type WheelPickerValue = WheelPickerPrimitive.WheelPickerValue;

type WheelPickerOption<T extends WheelPickerValue = string> =
  WheelPickerPrimitive.WheelPickerOption<T>;

type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

function WheelPickerWrapper({
  className,
  ...props
}: ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        "rounded-lg border border-primary/25 bg-card/80 px-1 shadow-xs backdrop-blur-sm",
        "*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md",
        "*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md",
        className,
      )}
      {...props}
    />
  );
}

function WheelPicker<T extends WheelPickerValue = string>({
  classNames,
  ...props
}: WheelPickerPrimitive.WheelPickerProps<T>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: cn(
          "text-muted-foreground data-disabled:opacity-40",
          classNames?.optionItem,
        ),
        highlightWrapper: cn(
          "bg-secondary text-primary shadow-[inset_0_0_12px_color-mix(in_oklch,var(--glow)_18%,transparent)]",
          "data-rwp-focused:inset-ring-2 data-rwp-focused:inset-ring-primary/40",
          classNames?.highlightWrapper,
        ),
        highlightItem: cn(
          "data-disabled:opacity-40",
          classNames?.highlightItem,
        ),
      }}
      {...props}
    />
  );
}

export type { WheelPickerClassNames, WheelPickerOption };
export { WheelPicker, WheelPickerWrapper };
