import { defineConfig, type DefaultTheme } from "vitepress";
import { siteConfig } from "../../site.config.mjs";

const locale = process.env.DOCS_LOCALE === "en" ? "en" : "zh";
const isEnglish = locale === "en";
const base = isEnglish ? "/en/core/docs/" : "/core/docs/";
const languageName = isEnglish ? "English" : "简体中文";
const siteLabel = isEnglish ? "Thebe" : "Thebe";

const navigation: DefaultTheme.NavItem[] = [
  { text: siteLabel, link: isEnglish ? "/en/" : "/", target: "_self" },
  { text: "App", link: isEnglish ? "/en/app/" : "/app/", target: "_self" },
  { text: "Core", link: isEnglish ? "/en/core/" : "/core/", target: "_self" },
  {
    text: languageName,
    items: [
      {
        text: isEnglish ? "简体中文" : "English",
        link: isEnglish ? "/core/docs/" : "/en/core/docs/",
        target: "_self",
      },
    ],
  },
];

const sidebar: DefaultTheme.SidebarItem[] = isEnglish
  ? [
      {
        text: "Start",
        items: [
          { text: "Core overview", link: "/" },
          { text: "Quick start", link: "/quick-start" },
          { text: "Troubleshooting", link: "/troubleshooting" },
        ],
      },
      {
        text: "Operate",
        items: [
          { text: "Configuration", link: "/configuration" },
          { text: "Deployment and recovery", link: "/deployment" },
          { text: "Security", link: "/security" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Deploy on a NAS", link: "/guides/nas-deployment" },
          { text: "Connect a service", link: "/guides/service-connection" },
          { text: "Configure permissions", link: "/guides/permissions" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Product HTTP", link: "/reference/http" },
          { text: "Provider MCP", link: "/reference/provider-mcp" },
          { text: "Changelog", link: "/changelog" },
        ],
      },
    ]
  : [
      {
        text: "开始使用",
        items: [
          { text: "Core 概览", link: "/" },
          { text: "快速开始", link: "/quick-start" },
          { text: "故障排查", link: "/troubleshooting" },
        ],
      },
      {
        text: "运行与维护",
        items: [
          { text: "配置", link: "/configuration" },
          { text: "部署与恢复", link: "/deployment" },
          { text: "安全", link: "/security" },
        ],
      },
      {
        text: "指南",
        items: [
          { text: "部署到 NAS", link: "/guides/nas-deployment" },
          { text: "连接服务", link: "/guides/service-connection" },
          { text: "配置权限", link: "/guides/permissions" },
        ],
      },
      {
        text: "参考",
        items: [
          { text: "产品 HTTP", link: "/reference/http" },
          { text: "服务商 MCP", link: "/reference/provider-mcp" },
          { text: "变更记录", link: "/changelog" },
        ],
      },
    ];

const conciseBase = base.replace(/\/$/, "");

export default defineConfig({
  lang: isEnglish ? "en-US" : "zh-CN",
  title: "Thebe Core",
  titleTemplate: isEnglish ? ":title · Thebe Core" : ":title · Thebe Core",
  description: isEnglish
    ? "Deployment, configuration, security, and integration documentation for Thebe Core."
    : "Thebe Core 的部署、配置、安全与集成文档。",
  base,
  srcDir: `content/${locale}`,
  outDir: `dist/${locale}`,
  srcExclude: ["authored/**"],
  ignoreDeadLinks: true,
  cleanUrls: true,
  lastUpdated: false,
  markdown: {
    theme: {
      light: "one-dark-pro",
      dark: "one-dark-pro",
    },
  },
  head: [
    ["meta", { name: "theme-color", content: "#0b1220" }],
    ["link", { rel: "icon", href: "/assets/thebe-app-icon.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Thebe" }],
    ["meta", { property: "og:image", content: `${siteConfig.origin}/assets/social-card.png` }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
  ],
  themeConfig: {
    logo: {
      src: "/assets/thebe-app-icon.png",
      alt: "Thebe",
    },
    logoLink: isEnglish ? "/en/" : "/",
    nav: navigation,
    sidebar,
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: isEnglish ? "Search" : "搜索",
            buttonAriaLabel: isEnglish ? "Search documentation" : "搜索文档",
          },
          modal: {
            displayDetails: isEnglish ? "Display detailed list" : "显示详细列表",
            resetButtonTitle: isEnglish ? "Reset search" : "重置搜索",
            backButtonTitle: isEnglish ? "Close search" : "关闭搜索",
            noResultsText: isEnglish ? "No results for" : "没有找到",
            footer: {
              selectText: isEnglish ? "to select" : "选择",
              navigateText: isEnglish ? "to navigate" : "导航",
              closeText: isEnglish ? "to close" : "关闭",
            },
          },
        },
      },
    },
    outline: {
      level: [2, 3],
      label: isEnglish ? "On this page" : "本页内容",
    },
    docFooter: {
      prev: isEnglish ? "Previous" : "上一页",
      next: isEnglish ? "Next" : "下一页",
    },
    lastUpdated: {
      text: isEnglish ? "Updated" : "更新于",
    },
    returnToTopLabel: isEnglish ? "Return to top" : "回到顶部",
    sidebarMenuLabel: isEnglish ? "Menu" : "菜单",
    darkModeSwitchLabel: isEnglish ? "Appearance" : "外观",
    lightModeSwitchTitle: isEnglish ? "Switch to light theme" : "切换到浅色模式",
    darkModeSwitchTitle: isEnglish ? "Switch to dark theme" : "切换到深色模式",
    socialLinks: [
      {
        icon: "github",
        link: siteConfig.coreRepositoryUrl,
        ariaLabel: "Thebe Core on GitHub",
      },
    ],
    footer: {
      message: isEnglish
        ? "Thebe Core v0.1.0 · Preview"
        : "Thebe Core v0.1.0 · Preview",
      copyright: "© 2026 Thebe",
    },
  },
  sitemap: {
    hostname: siteConfig.origin,
  },
  transformPageData(pageData) {
    const relativePath = pageData.relativePath.replace(/index\.md$/, "").replace(/\.md$/, "");
    const suffix = relativePath ? `${relativePath}/` : "";
    const canonical = `${siteConfig.origin}${conciseBase}/${suffix}`;
    const counterpartBase = isEnglish ? "/core/docs" : "/en/core/docs";
    const counterpart = `${siteConfig.origin}${counterpartBase}/${suffix}`;
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["link", { rel: "canonical", href: canonical }],
      ["link", { rel: "alternate", hreflang: isEnglish ? "en" : "zh-Hans", href: canonical }],
      [
        "link",
        {
          rel: "alternate",
          hreflang: isEnglish ? "zh-Hans" : "en",
          href: counterpart,
        },
      ],
      ["link", { rel: "alternate", hreflang: "x-default", href: `${siteConfig.origin}/core/docs/${suffix}` }],
      ["meta", { property: "og:url", content: canonical }],
      ["meta", { property: "og:title", content: `${pageData.title} · Thebe Core` }],
      ["meta", { property: "og:description", content: pageData.description }],
      [
        "meta",
        {
          property: "og:locale",
          content: isEnglish ? "en_US" : "zh_CN",
        },
      ],
    );

    if (siteConfig.environment === "preview") {
      pageData.frontmatter.head.push(["meta", { name: "robots", content: "noindex,nofollow" }]);
    }
  },
});

