module.exports = {
  title: 'Akita',
  tagline: '🔮 A Reactive State Management Tailored-Made for JS Applications',
  baseUrl: '/akita/',
  url: 'https://github.com/datorama',
  favicon: 'img/favicon.ico',
  organizationName: 'datorama',
  projectName: 'akita',
  themeConfig: {
    algolia: {
      appId: 'BH4D9OD16A',
      apiKey: 'f79cabde48ffb620e6351ab4b158559f',
      indexName: 'akita',
    },
    navbar: {
      title: 'Home',
      logo: {
        alt: 'Transloco',
        src: 'img/akita.svg',
      },
      links: [
        {
          to: 'docs/store',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'sample-app',
          activeBasePath: 'sample-app',
          label: 'Sample App',
          position: 'left',
        },
        {
          href: 'https://stackblitz.com/edit/akita-todos-app',
          label: 'Playground',
          position: 'right',
        },
        {
          href: 'https://github.com/datorama/akita/',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'The Store',
              to: 'docs/store',
            },
            {
              label: 'The Query',
              to: 'docs/query',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/angular-akita',
            },
            {
              label: 'Best Practices',
              href: 'docs/best-practices',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Gitter',
              href: 'https://gitter.im/akita-state-management/Lobby',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/datorama/akita/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/NetanelBasal',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Datorama, Inc.`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/nightOwlLight'),
    },
    sidebarCollapsible: true,
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/datorama/akita/edit/master/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
