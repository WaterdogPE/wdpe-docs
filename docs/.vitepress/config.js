import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  cleanUrls: true,
  lang: 'en-US',
  title: 'WaterdogPE Docs',
  description:
    'Documentation for WaterdogPE — a fast, customizable proxy for Minecraft: Bedrock Edition.',
  lastUpdated: true,

  // Imported BookStack content may contain links we have not ported yet.
  // Keep this lenient for now; tighten to `false` once the content is finalized.
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/img/WDLogo.png' }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'Waterdog, WaterdogPE, Minecraft, Bedrock, Bedrock Edition, Proxy, Java, Plugins, Documentation, StarGate, BungeeCord',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'WaterdogPE Documentation' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Documentation for WaterdogPE — a fast, customizable proxy for Minecraft: Bedrock Edition.',
      },
    ],
    [
      'meta',
      {
        property: 'og:image',
        content:
          'https://github.com/WaterdogPE/Branding/raw/master/logo/WaterdogV2.png',
      },
    ],
  ],

  // Default to dark mode to match the marketing site (slate-950).
  appearance: 'dark',

  themeConfig: {
    logo: '/img/WDLogo.png',
    siteTitle: 'WaterdogPE',

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'WaterdogPE Guides',
        items: [
          { text: 'Overview', link: '/overview' },
          {
            text: 'WaterdogPE Setup',
            link: '/waterdogpe-setup/starting-waterdog',
          },
          {
            text: 'Entry Level Plugin API Guide',
            link: '/entry-level-plugin-api-guide/prerequisites',
          },
          { text: 'Plugin API', link: '/plugins/introduction' },
          {
            text: 'Integration',
            link: '/integration/integrating-with-slappers-npcs',
          },
        ],
      },
      {
        text: 'Suggested Plugins & Extensions',
        items: [
          { text: 'Introduction', link: '/extensions/introduction' },
          { text: 'StarGate Modules', link: '/stargate-commons/stargate-modules' },
          { text: 'StarGate: Server Setup', link: '/stargate-plugins/server-setup' },
          { text: 'StarGate: Client Setup', link: '/stargate-plugins/client-setup' },
        ],
      },
      { text: 'Main Site', link: 'https://waterdog.dev' },
    ],

    // One site-wide sidebar grouped per book (a "shelf" in BookStack terms).
    sidebar: [
      { text: 'Overview', link: '/overview' },
      {
        text: 'WaterdogPE Setup',
        collapsed: false,
        items: [
          { text: 'Starting Waterdog', link: '/waterdogpe-setup/starting-waterdog' },
          { text: 'Proxy Configuration', link: '/waterdogpe-setup/proxy-configuration' },
          { text: 'NetherNet Configuration', link: '/waterdogpe-setup/nethernet-configuration' },
          { text: 'Software Compatibility', link: '/waterdogpe-setup/software-compatibility' },
          { text: 'Troubleshooting', link: '/waterdogpe-setup/troubleshooting' },
        ],
      },
      {
        text: 'Entry Level Plugin API Guide',
        collapsed: false,
        items: [
          { text: 'Prerequisites', link: '/entry-level-plugin-api-guide/prerequisites' },
          { text: 'Maven Setup', link: '/entry-level-plugin-api-guide/maven-setup' },
          { text: 'Your First Plugin', link: '/entry-level-plugin-api-guide/first-plugin' },
        ],
      },
      {
        text: 'Plugin API',
        collapsed: false,
        items: [
          { text: 'Introduction', link: '/plugins/introduction' },
          { text: 'Working with Players', link: '/plugins/players-guide' },
          { text: 'Commands Guide', link: '/plugins/commands-guide' },
          { text: 'Events Guide', link: '/plugins/events-guide' },
          { text: 'Fallback & Join Handler', link: '/plugins/fallback-join-handler' },
          { text: 'Scheduling Tasks', link: '/plugins/scheduling-task' },
          { text: 'Proxy Communication', link: '/plugins/proxy-communication' },
        ],
      },
      {
        text: 'Integration',
        collapsed: false,
        items: [
          {
            text: 'Integrating with slappers / NPCs',
            link: '/integration/integrating-with-slappers-npcs',
          },
        ],
      },
      {
        text: 'Suggested Plugins & Extensions',
        collapsed: false,
        items: [
          { text: 'Introduction', link: '/extensions/introduction' },
          {
            text: 'StarGate',
            collapsed: true,
            items: [
              { text: 'StarGate Modules', link: '/stargate-commons/stargate-modules' },
              { text: 'Server Setup', link: '/stargate-plugins/server-setup' },
              { text: 'Client Setup', link: '/stargate-plugins/client-setup' },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WaterdogPE' },
      { icon: 'discord', link: 'https://discord.gg/QcRRzXX' },
    ],

    search: { provider: 'local' },

    editLink: {
      pattern:
        'https://github.com/WaterdogPE/docs-website/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the GPL-3.0 License.',
      copyright: 'Copyright © WaterdogPE',
    },
  },
})
