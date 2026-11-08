import { siteConfig, type Locale } from "../lib/site";

export type ContentSlug = "privacy" | "support" | "security" | "responsible-use";

export interface ContentSection {
  heading: string;
  paragraphs: string[];
  items?: string[];
}

export interface ContentPageCopy {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  meta?: string;
  sections: ContentSection[];
}

const supportEmail = `<a href="mailto:${siteConfig.contacts.support}">${siteConfig.contacts.support}</a>`;
const securityEmail = `<a href="mailto:${siteConfig.contacts.security}">${siteConfig.contacts.security}</a>`;

export const contentPages: Record<ContentSlug, Record<Locale, ContentPageCopy>> = {
  privacy: {
    zh: {
      title: "隐私政策 · Thebe",
      description: "Thebe 网站、Thebe App 与 Thebe Core 如何保存和发送数据。",
      eyebrow: "隐私",
      heading: "隐私政策",
      lead:
        "Thebe 网站不运行统计、广告、跟踪像素或账号系统。App 和 Core 只连接你配置的服务与你选择的模型提供方。",
      meta: "最后更新：2026-11-01",
      sections: [
        {
          heading: "网站本身",
          paragraphs: [
            "这个门户是静态站点，没有 Cookie 横幅、客户端分析、广告脚本、跟踪像素或用户账号。服务器可能保留常规聚合访问日志，用于运行、安全和容量诊断。",
          ],
        },
        {
          heading: "Thebe App",
          paragraphs: [
            "Thebe 是一个连接你自己运行的服务（媒体服务器、下载工具、Thebe Core 等）和你自选的 AI 模型服务商的 App。开发者不运营接收你数据的服务器。",
            "开发者不收集任何数据。Thebe 没有自己的统计、广告、跟踪或崩溃上报服务，开发者看不到你的数据。",
          ],
        },
        {
          heading: "留在设备上的内容",
          paragraphs: [
            "服务地址、账号、令牌和 App 设置保存在你的设备上。密码和 API 令牌等机密保存在 iOS 钥匙串。你可以在“设置 > 数据与存储”中备份、导出或删除这些数据；删除 App 会移除设备上的数据。",
          ],
        },
        {
          heading: "数据会去哪里",
          paragraphs: ["数据只会发到你主动配置的位置："],
          items: [
            "你自己的服务，例如 NAS、媒体服务器或 Thebe Core。它们如何处理数据由你决定。",
            "你选择的 AI 模型服务商。使用 AI 对话时，消息以及你让助手读取的内容会发送给它，并受它的隐私政策约束。",
            "你主动开启的可选集成，例如音乐、搜索、推送或云服务。它们会收到完成功能所需的请求。",
            "你自己的 iCloud 账户，前提是你开启可选的加密同步。同步文件在设备上加密，口令只保存在本机钥匙串。",
          ],
        },
        {
          heading: "购买",
          paragraphs: [
            "Thebe Pro 的购买由 Apple 处理。开发者不会收到支付信息或个人资料。",
          ],
        },
        {
          heading: "儿童",
          paragraphs: ["Thebe 不面向儿童。"],
        },
        {
          heading: "变更与联系",
          paragraphs: [
            "本政策变更时，新版本会发布在同一地址并更新日期。",
            `隐私问题请联系 ${supportEmail}。发送日志、截图或配置前，请先移除密码、令牌和 API 密钥。`,
          ],
        },
      ],
    },
    en: {
      title: "Privacy · Thebe",
      description: "How the Thebe website, Thebe App, and Thebe Core store and send data.",
      eyebrow: "Privacy",
      heading: "Privacy",
      lead:
        "The Thebe website has no analytics, advertising, tracking pixels, or account system. The App and Core connect only to services you configure and model providers you choose.",
      meta: "Last updated: 2026-11-01",
      sections: [
        {
          heading: "This website",
          paragraphs: [
            "This portal is a static site with no cookie banner, client analytics, advertising script, tracking pixel, or user account. The server may keep ordinary aggregate access logs for operations, security, and capacity diagnosis.",
          ],
        },
        {
          heading: "The Thebe App",
          paragraphs: [
            "Thebe connects to services you run yourself, such as media servers, download tools, and Thebe Core, and to AI model providers you choose. The developer operates no server that receives your data.",
            "The developer collects nothing. Thebe has no analytics, advertising, tracking, or crash-reporting service of its own, so the developer cannot see your data.",
          ],
        },
        {
          heading: "What stays on your device",
          paragraphs: [
            "Service addresses, accounts, tokens, and app settings stay on your device. Passwords and API tokens are kept in the iOS Keychain. You can back up, export, or delete this data in Settings > Data & storage. Deleting the App removes its on-device data.",
          ],
        },
        {
          heading: "Where data goes",
          paragraphs: ["Data goes only to places you configure:"],
          items: [
            "Your own services, such as a NAS, media server, or Thebe Core. How they handle data is up to you.",
            "The AI model provider you choose. When you use AI chat, your messages and any content you ask the assistant to read are sent there under that provider's privacy policy.",
            "Optional integrations you enable, such as music, search, push, or cloud services. They receive the requests needed to do their job.",
            "Your own iCloud account when optional encrypted sync is enabled. The sync file is encrypted on your device and its passphrase stays in the local Keychain.",
          ],
        },
        {
          heading: "Purchases",
          paragraphs: [
            "The Thebe Pro purchase is handled by Apple. The developer receives no payment information and no personal details.",
          ],
        },
        {
          heading: "Children",
          paragraphs: ["Thebe is not directed at children."],
        },
        {
          heading: "Changes and contact",
          paragraphs: [
            "If this policy changes, the new version will be published at the same address with a new date.",
            `For privacy questions, email ${supportEmail}. Remove passwords, tokens, and API keys from logs, screenshots, or configuration before sending them.`,
          ],
        },
      ],
    },
  },
  support: {
    zh: {
      title: "支持 · Thebe",
      description: "Thebe App 与 Thebe Core 的支持、故障反馈与常见问题。",
      eyebrow: "支持",
      heading: "问题、故障反馈与建议",
      lead: `发邮件到 ${supportEmail}，通常几天内回复。App、Core 与文档问题都可以使用这个地址。`,
      sections: [
        {
          heading: "反馈问题时请附上",
          paragraphs: ["这些信息能让问题更快定位："],
          items: [
            "设备型号与系统版本，以及 Thebe App 或 Core 的版本。",
            "问题涉及哪个服务，以及你做了哪些操作。",
            "你预期的结果、实际发生的情况，以及能说明问题的截图或日志。",
            "请先移除主机地址、密码、令牌、API 密钥和任何不想公开的文件内容。",
          ],
        },
        {
          heading: "常见问题",
          paragraphs: [
            "<strong>Thebe 没有自己的媒体内容。</strong>它连接你自己运行的服务，使用前需要配置自己的媒体库、文件或管理服务。",
            "<strong>连不上服务。</strong>先确认设备能访问该地址和端口，并检查是否在同一网络或已配置远程访问。服务使用自签名证书时，只在你信任该地址的情况下允许它。",
            "<strong>AI 没有回复。</strong>检查模型服务商地址、密钥和模型名称。任何会修改内容的操作都应先出现审批。",
            "<strong>在哪里下载 App？</strong>App Store 链接尚未公开。在此之前，这个页面是权威的产品与支持入口。",
          ],
        },
        {
          heading: "数据与安全",
          paragraphs: [
            "设置、账号和令牌保存在你的设备上。不要把完整配置文件或审计日志直接贴进公开 issue。",
            "<a href=\"/privacy/\">阅读隐私政策</a>或<a href=\"/security/\">查看安全说明</a>。",
          ],
        },
      ],
    },
    en: {
      title: "Support · Thebe",
      description: "Support, bug reports, and common questions for the Thebe App and Thebe Core.",
      eyebrow: "Support",
      heading: "Questions, bug reports, and feedback",
      lead: `Email ${supportEmail} for help with the App, Core, or the documentation. Replies usually arrive within a few days.`,
      sections: [
        {
          heading: "Include this in a report",
          paragraphs: ["These details make a problem much easier to locate:"],
          items: [
            "Your device and system version, plus the Thebe App or Core version.",
            "The service involved and the steps you took.",
            "What you expected, what happened instead, and any screenshot or log that shows it.",
            "Remove host addresses, passwords, tokens, API keys, and any file content you do not want to share.",
          ],
        },
        {
          heading: "Common questions",
          paragraphs: [
            "<strong>Thebe has no media content of its own.</strong> It connects to services you run, so you need to configure your own media library, files, or management service first.",
            "<strong>It cannot reach my service.</strong> Check that the device can access the address and port and that you are on the same network or using remote access. Allow a self-signed certificate only when you trust that address.",
            "<strong>The AI does not answer.</strong> Check the model provider address, key, and model name. Anything that changes content should wait for an approval first.",
            "<strong>Where can I download the App?</strong> The App Store link is not public yet. Until then, this page is the authoritative product and support entry point.",
          ],
        },
        {
          heading: "Data and security",
          paragraphs: [
            "Settings, accounts, and tokens stay on your device. Do not paste a complete configuration file or audit log into a public issue.",
            "<a href=\"/en/privacy/\">Read the privacy policy</a> or <a href=\"/en/security/\">review the security notes</a>.",
          ],
        },
      ],
    },
  },
  security: {
    zh: {
      title: "安全 · Thebe",
      description: "报告 Thebe 与 Thebe Core 的安全问题，以及 Core 的审批、审计和隔离边界。",
      eyebrow: "安全",
      heading: "安全说明与漏洞报告",
      lead:
        "请不要在公开 issue 中披露漏洞、令牌、日志或能直接利用的配置。安全报告使用私有渠道，并尽量提供可复现信息。",
      sections: [
        {
          heading: "私下报告漏洞",
          paragraphs: [
            `发送邮件到 ${securityEmail}，主题以 “Thebe security” 开头。说明受影响组件与版本、影响、复现步骤和建议修复方式。`,
            "如果问题已经在公开渠道出现，请立即旋转相关令牌、撤销设备权限并停止暴露受影响服务。邮件中不要附带真实密码或仍在使用的凭据。",
          ],
        },
        {
          heading: "支持的版本",
          paragraphs: [
            "Thebe Core v0.1.0 是当前公开的 Preview 版本。安全修复会进入最新发布；旧构建不承诺长期维护。",
            "Thebe App 尚未发布。发布后，App Store 的最新版本是唯一支持版本。",
          ],
        },
        {
          heading: "Core 的安全边界",
          paragraphs: [
            "Core 的 token 拥有全部 API 权限，没有内建作用域。默认容器配置只发布回环地址；远程访问应通过 Tailscale、SSH 隧道或终止 TLS 的反向代理。",
            "写操作、风险命令和跨工作区访问有独立边界。容器内运行与宿主机运行不是同一种隔离模型；部署前请阅读完整安全与部署文档。",
            "通过 /mcp 接入的 Agent 不会自动弹出 Core 内的审批。是否询问由调用方 Agent 负责；设置 THEBE_MCP_WRITES=off 可以让该路径只读，每次写调用仍会进入审计日志。",
          ],
        },
        {
          heading: "我们不会要求你提供",
          paragraphs: ["除非在受控环境中有明确必要，否则不要发送仍在使用的 API 密钥、密码、私钥、完整会话记录或个人信息。"],
        },
      ],
    },
    en: {
      title: "Security · Thebe",
      description: "Report Thebe and Thebe Core security issues and review Core approval, audit, and isolation boundaries.",
      eyebrow: "Security",
      heading: "Security notes and vulnerability reports",
      lead:
        "Do not disclose vulnerabilities, tokens, logs, or directly exploitable configuration in a public issue. Use the private channel and include enough detail to reproduce the problem.",
      sections: [
        {
          heading: "Report privately",
          paragraphs: [
            `Email ${securityEmail} with the subject prefix “Thebe security.” Include the affected component and version, impact, reproduction steps, and any suggested fix.`,
            "If a problem is already public, rotate affected tokens, revoke device access, and stop exposing the affected service immediately. Do not attach real passwords or credentials that are still active.",
          ],
        },
        {
          heading: "Supported versions",
          paragraphs: [
            "Thebe Core v0.1.0 is the current public Preview release. Security fixes target the newest release; older builds have no long-term maintenance commitment.",
            "The Thebe App is not released yet. After release, only the latest App Store version is supported.",
          ],
        },
        {
          heading: "Core security boundaries",
          paragraphs: [
            "A Core token has full API access and no built-in scope. The default container publishes only a loopback address; use Tailscale, an SSH tunnel, or a TLS-terminating reverse proxy for remote access.",
            "Writes, risky commands, and out-of-workspace access have separate boundaries. Running inside a container is not the same isolation model as running on the host; read the full security and deployment guidance before deploying.",
            "An agent connected over /mcp does not automatically receive an approval prompt inside Core. The calling agent is responsible for asking its user; THEBE_MCP_WRITES=off makes that path read-only, and every write is still audited.",
          ],
        },
        {
          heading: "What we will not ask for",
          paragraphs: ["Unless there is a clearly necessary controlled test, do not send active API keys, passwords, private keys, complete transcripts, or personal information."],
        },
      ],
    },
  },
  "responsible-use": {
    zh: {
      title: "使用边界 · Thebe",
      description: "Thebe 的账户、内容、版权和安全使用边界。",
      eyebrow: "使用边界",
      heading: "操作你自己的服务与账号",
      lead:
        "Thebe 提供的是连接和管理工具，不提供内容、托管服务或绕过授权的途径。使用连接器前，请确认你对相应账户、数据和操作拥有权限。",
      sections: [
        {
          heading: "不提供媒体或第三方内容",
          paragraphs: [
            "网站和软件不包含电影、剧集、音乐、照片或第三方媒体目录。App 与 Core 展示的内容来自你连接的服务，或由你在这些服务中提供。",
            "第三方名称只用于说明兼容性，不表示合作、认证或官方背书。",
          ],
        },
        {
          heading: "版权与下载",
          paragraphs: [
            "你需要对自己让 Thebe 执行的操作负责，包括确认你有权复制、保存、下载或移动相关内容，并遵守所在地法律和所连接服务的条款。",
            "Thebe 不提供规避付费、访问控制或版权保护的能力。维护者不认可、也不为侵权使用承担责任。",
          ],
        },
        {
          heading: "Agent 不会替代你的判断",
          paragraphs: [
            "自由文本不是执行授权。有风险的写操作应该对应一个具体、可理解的提议，并在执行前获得你的批准。",
            "Core 每次写操作都会记录审计信息。请定期检查 Activity、审批和审计记录，及时撤销不再使用的 token。",
          ],
        },
        {
          heading: "可用性与安全",
          paragraphs: [
            "Thebe 按现状提供，不附带担保。Preview 版本的部分服务集成只经过录制响应或 mock 验证，未经每个真实产品版本逐一确认。",
            "不要直接暴露 Core 的明文端口，不要把容器 socket、完整配置目录或不必要的凭据交给不受信任的 Agent。",
          ],
        },
      ],
    },
    en: {
      title: "Responsible use · Thebe",
      description: "Account, content, copyright, and security boundaries for using Thebe.",
      eyebrow: "Responsible use",
      heading: "Operate your own services and accounts",
      lead:
        "Thebe is a connection and management tool. It does not provide content, hosting, or a way around authorization. Before connecting a service, make sure you may use that account, data, and operation.",
      sections: [
        {
          heading: "No media or third-party catalogue",
          paragraphs: [
            "The website and software contain no movies, series, music, photos, or third-party media catalogue. What the App and Core show comes from services you connect or content you provide there.",
            "Third-party names describe compatibility only. They do not imply partnership, certification, or endorsement.",
          ],
        },
        {
          heading: "Copyright and downloads",
          paragraphs: [
            "You are responsible for what you ask Thebe to do, including confirming that you may copy, save, download, or move the relevant material and complying with local law and the terms of connected services.",
            "Thebe does not provide a way around payment, access controls, or copyright protection. The maintainer does not endorse or accept responsibility for infringing use.",
          ],
        },
        {
          heading: "An agent does not replace your judgment",
          paragraphs: [
            "Free-form model text is not authorization to execute. A risky write should correspond to a concrete, understandable proposal and receive your approval before it runs.",
            "Core records audit information for every write. Review Activity, approvals, and audit records regularly, and revoke tokens you no longer use.",
          ],
        },
        {
          heading: "Availability and security",
          paragraphs: [
            "Thebe is provided as-is with no warranty. Some Preview integrations have only been verified with recorded responses or mocks, not against every real product version.",
            "Do not expose Core's plaintext port directly, and do not give an untrusted agent a container socket, a complete configuration directory, or credentials it does not need.",
          ],
        },
      ],
    },
  },
};

