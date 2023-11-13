"use client";
import { useCallback, useRef, MouseEventHandler, useEffect } from "react";
import { useRouter } from "next/navigation";

export function SimpleModal({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef(null);
  const router = useRouter();
  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current)
        if (onDismiss) onDismiss();
    },
    [onDismiss, overlay, wrapper],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => (e.key === "Escape" ? onDismiss() : null),
    [onDismiss],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="absolute h-[100vh] w-[100vw] top-0 z-20 mx-auto bg-black/60 overflow-auto"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="w-fit mt-40 sm:mt-20 lg:mt-10 mx-auto bg-white rounded-xl py-8 lg:px-10 md:px-2"
      >
        {children}
      </div>
    </div>
  );
}
