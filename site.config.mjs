const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

export const siteConfig = {
  origin: trimTrailingSlash(process.env.SITE_ORIGIN || "https://thebe.cc"),
  environment: process.env.SITE_ENV === "preview" ? "preview" : "production",
  appStoreUrl: process.env.APP_STORE_URL || "",
  coreRepositoryUrl: "https://github.com/unitsung/thebe-core",
  coreDocsTag: process.env.CORE_DOCS_TAG || "v0.1.0",
  coreImage: process.env.CORE_IMAGE || "ghcr.io/unitsung/thebe-core:0.1.0",
  contacts: {
    support: "support@thebe.cc",
    security: "security@thebe.cc",
  },
};

export const localePath = (pathname, locale) => {
  const normalized = `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  const bare = normalized === "/" ? "/" : `${normalized}/`;
  return locale === "en" ? `/en${bare === "/" ? "/" : bare}` : bare;
};

export const deploymentReady =
  Boolean(siteConfig.coreRepositoryUrl) &&
  Boolean(siteConfig.coreDocsTag) &&
  Boolean(siteConfig.coreImage);

