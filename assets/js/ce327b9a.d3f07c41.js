"use strict";(self.webpackChunkakita_docs=self.webpackChunkakita_docs||[]).push([[8042],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),p=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return o.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=r,f=u["".concat(s,".").concat(m)]||u[m]||d[m]||a;return n?o.createElement(f,i(i({ref:t},c),{},{components:n})):o.createElement(f,i({ref:t},c))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:r,i[1]=l;for(var p=2;p<a;p++)i[p]=n[p];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},238:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return d}});var o=n(3117),r=n(102),a=(n(7294),n(3905)),i=n(4996),l=["components"],s={title:"Devtools"},p=void 0,c={unversionedId:"enhancers/devtools",id:"enhancers/devtools",title:"Devtools",description:"Akita provides integration with the Redux dev-tools chrome extension.",source:"@site/docs/enhancers/devtools.mdx",sourceDirName:"enhancers",slug:"/enhancers/devtools",permalink:"/akita/docs/enhancers/devtools",draft:!1,editUrl:"https://github.com/salesforce/akita/edit/master/docs/docs/enhancers/devtools.mdx",tags:[],version:"current",frontMatter:{title:"Devtools"},sidebar:"docs",previous:{title:"Server Side Pagination",permalink:"/akita/docs/plugins/pagination"},next:{title:"Persist State",permalink:"/akita/docs/enhancers/persist-state"}},u={},d=[{value:"Usage",id:"usage",level:2},{value:"Options",id:"options",level:2},{value:"Custom Actions",id:"custom-actions",level:2}],m={toc:d};function f(e){var t=e.components,n=(0,r.Z)(e,l);return(0,a.kt)("wrapper",(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Akita provides integration with the Redux dev-tools chrome extension."),(0,a.kt)("img",{src:(0,i.Z)("static/img/devtools.gif"),class:"gif"}),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,"Install the Redux extension from the supported App stores ( ",(0,a.kt)("a",{parentName:"p",href:"https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en"},"Chrome"),", ",(0,a.kt)("a",{parentName:"p",href:"https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/"},"Firefox")," )."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { ENVIRONMENT_INITIALIZER, inject, NgZone } from '@angular/core';\nimport { akitaDevtools, DevtoolsOptions } from '@datorama/akita';\n\nexport function provideAkitaDevtools(options: Partial<DevtoolsOptions> = {}) {\n  return {\n    provide: ENVIRONMENT_INITIALIZER,\n    multi: true,\n    useFactory() {\n      return () => {\n        akitaDevtools(inject(NgZone), options);\n      };\n    },\n  };\n}\n")),(0,a.kt)("p",null,"If you're not using Angular, you can call the ",(0,a.kt)("inlineCode",{parentName:"p"},"akitaDevtools")," function directly:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { akitaDevtools } from '@datorama/akita';\n\nakitaDevtools(options?);\n")),(0,a.kt)("h2",{id:"options"},"Options"),(0,a.kt)("p",null,"The plugin supports the following options passed as the second function parameter:"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"maxAge"),": Maximum amount of actions to be stored in the history tree."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"actionsBlacklist"),": Disallow the passed actions."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"actionsWhitelist"),": Allow only the passed actions."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"storesWhitelist"),": Display only the passed stores."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"logTrace"),": Whether to output a console.trace() for each action in the console."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"shallow")," - Whether to perform a deep compare before showing an action.\nsortAlphabetically"),(0,a.kt)("h2",{id:"custom-actions"},"Custom Actions"),(0,a.kt)("p",null,"By default, Akita will do its best to describe the actions that occurred, but you can always define your own actions for debugging purposes. For example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { action } from '@datorama/akita';\n\n@action('Update filter')\nupdateFilter(filter: VISIBILITY_FILTER) {\n  todosStore.update({ filter });\n}\n")),(0,a.kt)("p",null,"Or as a function:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { logAction } from '@datorama/akita';\n\nupdateFilter(filter: VISIBILITY_FILTER) {\n  logAction('Update filter');\n  todosStore.update({ filter });\n}\n")),(0,a.kt)("admonition",{type:"warning"},(0,a.kt)("p",{parentName:"admonition"},"Custom actions will only be dispatched upon a store update.")))}f.isMDXComponent=!0}}]);