import {
  deploymentReady,
  localePath,
  siteConfig,
} from "../../../site.config.mjs";

export type Locale = "zh" | "en";

export const copyFor = (locale: Locale) => ({
  localeName: locale === "zh" ? "中文" : "English",
  htmlLang: locale === "zh" ? "zh-Hans" : "en",
  alternateLocale: locale === "zh" ? "en" : "zh",
  nav: {
    app: "App",
    core: "Core",
    docs: locale === "zh" ? "文档" : "Docs",
    support: locale === "zh" ? "支持" : "Support",
  },
  skip: locale === "zh" ? "跳到主要内容" : "Skip to main content",
  footer: {
    product: locale === "zh" ? "产品" : "Product",
    trust: locale === "zh" ? "信任与支持" : "Trust & support",
    privacy: locale === "zh" ? "隐私政策" : "Privacy",
    security: locale === "zh" ? "安全" : "Security",
    responsibleUse: locale === "zh" ? "使用边界" : "Responsible use",
  },
});

export const absoluteUrl = (route: string, locale: Locale) =>
  new URL(localePath(route, locale), siteConfig.origin).href;

export const routeFor = (route: string, locale: Locale) => localePath(route, locale);

export const docsUrl = (locale: Locale) =>
  locale === "zh" ? "/core/docs/" : "/en/core/docs/";

export { deploymentReady, siteConfig };

