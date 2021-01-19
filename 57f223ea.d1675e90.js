(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{109:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=a.a.createContext({}),u=function(e){var t=a.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=u(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),p=u(n),m=r,d=p["".concat(s,".").concat(m)]||p[m]||b[m]||o;return n?a.a.createElement(d,i(i({ref:t},l),{},{components:n})):a.a.createElement(d,i({ref:t},l))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var l=2;l<o;l++)s[l]=n[l];return a.a.createElement.apply(null,s)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},77:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return u}));var r=n(2),a=n(6),o=(n(0),n(109)),s={title:"The Query"},i={unversionedId:"query",id:"query",isDocsHomePage:!1,title:"The Query",description:"A Query is a class offering functionality responsible for querying the store. You can think of the query as being similar to database queries. Its constructor function receives as parameters its own store and possibly other query classes.",source:"@site/docs/query.mdx",slug:"/query",permalink:"/akita/docs/query",editUrl:"https://github.com/datorama/akita/edit/master/docs/docs/query.mdx",version:"current",sidebar:"docs",previous:{title:"The Store",permalink:"/akita/docs/store"},next:{title:"Store Config",permalink:"/akita/docs/config"}},c=[{value:"API",id:"api",children:[{value:"<code>select()</code>",id:"select",children:[]},{value:"<code>getValue()</code>",id:"getvalue",children:[]},{value:"<code>selectLoading()</code>",id:"selectloading",children:[]},{value:"<code>selectError()</code>",id:"selecterror",children:[]}]}],l={rightToc:c};function u(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"A ",Object(o.b)("inlineCode",{parentName:"p"},"Query")," is a class offering functionality responsible for querying the store. You can think of the query as being similar to database queries. Its ",Object(o.b)("inlineCode",{parentName:"p"},"constructor")," function receives as parameters its own ",Object(o.b)("inlineCode",{parentName:"p"},"store")," and possibly other query classes. "),Object(o.b)("p",null,"Queries can talk to other queries, join entities from different stores, etc. To create a ",Object(o.b)("inlineCode",{parentName:"p"},"Query"),", you need to extend the ",Object(o.b)("inlineCode",{parentName:"p"},"Query")," class from Akita:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="session.query.ts"',title:'"session.query.ts"'}),"import { Query } from '@datorama/akita';\nimport { SessionState } from './session.store';\n\nexport class SessionQuery extends Query<SessionState> {  \n  constructor(protected store: SessionStore) {\n    super(store);\n  }\n}\n")),Object(o.b)("p",null,"With this setup you get a ",Object(o.b)("inlineCode",{parentName:"p"},"Query")," with the following methods:"),Object(o.b)("h2",{id:"api"},"API"),Object(o.b)("h3",{id:"select"},Object(o.b)("inlineCode",{parentName:"h3"},"select()")),Object(o.b)("p",null,"Select a slice from the store:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="session.query.ts"',title:'"session.query.ts"'}),"\nimport { Query } from '@datorama/akita';\nimport { SessionState } from './session.store';\n\nexport class SessionQuery extends Query<SessionState> {\n  allState$ = this.select();\n  isLoggedIn$ = this.select(state => !!state.token);\n  selectName$ = this.select('name');\n\n  // Returns { name, age }\n  multiProps$ = this.select(['name', 'age']);\n\n  // Returns [name, age]\n  multiPropsCallback$ = this.select(\n    [state => state.name, state => state.age]\n  )\n  \n  constructor(protected store: SessionStore) {\n    super(store);\n  }\n}\n")),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"select()")," method returns an ",Object(o.b)("inlineCode",{parentName:"p"},"observable")," that calls ",Object(o.b)("inlineCode",{parentName:"p"},"distinctUntilChanged()")," internally, meaning it will ",Object(o.b)("strong",{parentName:"p"},"only")," fire when the state changes, i.e., when there is a new reference."),Object(o.b)("div",{className:"admonition admonition-info alert alert--info"},Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(r.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(r.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(o.b)("path",Object(r.a)({parentName:"svg"},{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})))),"info")),Object(o.b)("div",Object(r.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"The Query ",Object(o.b)("inlineCode",{parentName:"p"},"select")," methods always returns an ",Object(o.b)("inlineCode",{parentName:"p"},"observable")," which pushes the initial value first."))),Object(o.b)("h3",{id:"getvalue"},Object(o.b)("inlineCode",{parentName:"h3"},"getValue()")),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"getValue()")," method returns the ",Object(o.b)("em",{parentName:"p"},"raw")," value of the store."),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="session.query.ts"',title:'"session.query.ts"'}),"\nimport { Query } from '@datorama/akita';\nimport { SessionState } from './session.store';\n\nexport class SessionQuery extends Query<SessionState> {\n\n  constructor(protected store: SessionStore) {\n    super(store);\n  }\n\n  get isLoggedIn() {\n    return !!this.getValue().token;\n  }\n}\n")),Object(o.b)("h3",{id:"selectloading"},Object(o.b)("inlineCode",{parentName:"h3"},"selectLoading()")),Object(o.b)("p",null,"Subscribes to the store's ",Object(o.b)("inlineCode",{parentName:"p"},"loading")," state:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="login.components.ts"',title:'"login.components.ts"'}),"\n@Component({})\nexport class LoginComponent {\n  isLoading$ = this.sessionQuery.selectLoading();\n\n  constructor(private sessionQuery: SessionQuery) {}\n}\n")),Object(o.b)("h3",{id:"selecterror"},Object(o.b)("inlineCode",{parentName:"h3"},"selectError()")),Object(o.b)("p",null,"Subscribes to the store's ",Object(o.b)("inlineCode",{parentName:"p"},"error")," state:"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="login.components.ts"',title:'"login.components.ts"'}),"\n@Component({})\nexport class LoginComponent {\n  error$ = this.sessionQuery.selectError();\n\n  constructor(private sessionQuery: SessionQuery) {}\n}\n")))}u.isMDXComponent=!0}}]);