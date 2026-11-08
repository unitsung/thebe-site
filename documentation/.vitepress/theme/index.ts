import DefaultTheme from "vitepress/theme";
import "./style.css";

function resolveCrossAppLink(href: string, text?: string): string | null {
  if (href === "/app/" || href === "/core/docs/app/") return "/app/";
  if (href === "/en/app/" || href === "/en/core/docs/en/app/" || href === "/en/core/docs/app/") return "/en/app/";
  if (href === "/core/" || href === "/core/docs/core/") return "/core/";
  if (href === "/en/core/" || href === "/en/core/docs/en/core/" || href === "/en/core/docs/core/") return "/en/core/";
  if (href === "/en/" || href === "/en/core/docs/en/" || href === "/core/docs/en/") return "/en/";
  if (href === "/" || (href === "/core/docs/" && text?.trim() === "Thebe")) return "/";
  if (href.includes("/core/docs/en/core/docs/")) return "/en/core/docs/";
  if (href.includes("/en/core/docs/core/docs/")) return "/core/docs/";
  return null;
}

function patchDomLinks() {
  if (typeof document === "undefined") return;
  const anchors = document.querySelectorAll<HTMLAnchorElement>("a");
  anchors.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const text = a.textContent ?? "";
    const target = resolveCrossAppLink(href, text);
    if (target && target !== href) {
      a.setAttribute("href", target);
      a.setAttribute("target", "_self");
    }
  });
}

if (typeof window !== "undefined") {
  window.addEventListener(
    "click",
    (e) => {
      const link = (e.target as HTMLElement)?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;
      const text = link.textContent ?? "";

      const target = resolveCrossAppLink(href, text);
      if (target) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = target;
      }
    },
    { capture: true },
  );

  document.addEventListener("DOMContentLoaded", () => {
    patchDomLinks();
    const observer = new MutationObserver(() => patchDomLinks());
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

export default DefaultTheme;

