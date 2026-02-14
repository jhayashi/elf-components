import { create, props } from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { colors, fonts, fontSizes, spacing } from "./Tokens.stylex";

const MOBILE = "@media (max-width: 480px)";

type ToastVariant = "success" | "error";

interface ToastMessage {
  text: string;
  variant: ToastVariant;
}

let showToastGlobal: ((msg: ToastMessage) => void) | null = null;

export function toast(text: string, variant: ToastVariant = "success") {
  showToastGlobal?.({ text, variant });
}

export function Toast() {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  useEffect(() => {
    showToastGlobal = setMessage;
    return () => {
      showToastGlobal = null;
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      {...props(
        styles.toast,
        message.variant === "error" ? styles.error : styles.success,
      )}
    >
      {message.text}
    </div>
  );
}

const styles = create({
  toast: {
    position: "fixed",
    bottom: {
      default: spacing.l,
      [MOBILE]: spacing.m,
    },
    left: {
      default: "50%",
      [MOBILE]: spacing.s,
    },
    right: {
      default: "auto",
      [MOBILE]: spacing.s,
    },
    transform: {
      default: "translateX(-50%)",
      [MOBILE]: "none",
    },
    paddingBlock: spacing.xs,
    paddingInline: spacing.m,
    borderRadius: 8,
    fontSize: fontSizes.step_1,
    fontFamily: fonts.sans,
    color: "#fff",
    zIndex: 1000,
    pointerEvents: "none",
  },
  success: {
    backgroundColor: colors.accent,
  },
  error: {
    backgroundColor: colors.error,
  },
});
