module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'store',
    },
    {
      type: 'doc',
      id: 'query',
    },
    {
      type: 'doc',
      id: 'config',
    },
    {
      type: 'category',
      label: 'Entities Management',
      items: ['entities/entity-store', 'entities/query-entity', 'entities/active', 'entities/sorting'],
    },
    {
      type: 'doc',
      id: 'ui',
    },
    {
      type: 'doc',
      id: 'transactions',
    },
    {
      type: 'doc',
      id: 'best-practices',
    },
    {
      type: 'doc',
      id: 'immer',
    },
    {
      type: 'category',
      label: 'Additional Functionality',
      items: [
        'additional/cache',
        'additional/middleware',
        'additional/reset',
        'additional/events',
        'additional/operators',
        'additional/array',
        'additional/notifications',
        'additional/js',
        'additional/class',
      ],
    },
    {
      type: 'category',
      label: 'Plugins',
      items: ['plugins/state-history', 'plugins/dirty-check', 'plugins/pagination'],
    },
    {
      type: 'category',
      label: 'Enhancers',
      items: ['enhancers/devtools', 'enhancers/persist-state', 'enhancers/snapshot', 'enhancers/cli'],
    },
    {
      type: 'category',
      label: 'Angular',
      items: [
        'angular/architecture',
        'angular/local-state',
        'angular/entity-service',
        {
          type: 'link',
          label: 'NgEntityService - OData Pattern',
          href: 'https://github.com/rosostolato/akita-ng-odata-service',
        },
        {
          type: 'link',
          label: 'Akita Firbase',
          href: 'https://github.com/dappsnation/akita-ng-fire',
        },
        'angular/router',
        'angular/forms-manager',
        'angular/persist-form',
        'angular/schematics',
        {
          type: 'link',
          label: 'Filters Manager',
          href: 'https://manudss.github.io/akita-filters-plugin/',
        },
        'angular/tests',
        'angular/hmr',
      ],
    },
    {
      type: 'category',
      label: 'React',
      items: [
        {
          type: 'link',
          label: 'RxJS and React',
          href: 'https://engineering.datorama.com/oop-and-rxjs-managing-state-in-react-with-akita-de981e09307',
        },
        {
          type: 'link',
          label: 'Akita with Hooks',
          href: 'https://medium.com/@thomasburlesonIA/https-medium-com-thomasburlesonia-react-hooks-rxjs-facades-4e116330bbe1',
        },
        {
          type: 'link',
          label: 'RxJS Facads in React',
          href: 'https://medium.com/@thomasburlesonIA/react-facade-best-practices-1c8186d8495a',
        },
      ],
    },
    {
      type: 'category',
      label: 'Svelte',
      items: [
        {
          type: 'link',
          label: 'Akita with Svelte',
          href: 'https://netbasal.com/supercharge-your-svelte-state-management-with-akita-f1f9de5ef43d',
        },
      ],
    },
  ],
};
