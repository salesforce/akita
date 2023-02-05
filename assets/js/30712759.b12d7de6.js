"use strict";(self.webpackChunkakita_docs=self.webpackChunkakita_docs||[]).push([[7121],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},l=Object.keys(e);for(o=0;o<l.length;o++)n=l[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(o=0;o<l.length;o++)n=l[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=o.createContext({}),c=function(e){var t=o.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return o.createElement(s.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},y=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(n),y=r,m=d["".concat(s,".").concat(y)]||d[y]||p[y]||l;return n?o.createElement(m,i(i({ref:t},u),{},{components:n})):o.createElement(m,i({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=y;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a[d]="string"==typeof e?e:r,i[1]=a;for(var c=2;c<l;c++)i[c]=n[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}y.displayName="MDXCreateElement"},5903:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return y},frontMatter:function(){return a},metadata:function(){return c},toc:function(){return d}});var o=n(3117),r=n(102),l=(n(7294),n(3905)),i=["components"],a={title:"Query Entity"},s=void 0,c={unversionedId:"entities/query-entity",id:"entities/query-entity",title:"Query Entity",description:"The Entity Query is similar to the general Query, with additional functionality tailored for EntityStores.",source:"@site/docs/entities/query-entity.mdx",sourceDirName:"entities",slug:"/entities/query-entity",permalink:"/akita/docs/entities/query-entity",draft:!1,editUrl:"https://github.com/salesforce/akita/edit/master/docs/docs/entities/query-entity.mdx",tags:[],version:"current",frontMatter:{title:"Query Entity"},sidebar:"docs",previous:{title:"Entity Store",permalink:"/akita/docs/entities/entity-store"},next:{title:"Active Entity",permalink:"/akita/docs/entities/active"}},u={},d=[{value:"API",id:"api",level:2},{value:"<code>selectAll</code>",id:"selectall",level:3},{value:"<code>selectMany</code>",id:"selectmany",level:3},{value:"<code>selectEntity</code>",id:"selectentity",level:3},{value:"<code>selectFirst</code>",id:"selectfirst",level:3},{value:"<code>selectLast</code>",id:"selectlast",level:3},{value:"<code>selectCount</code>",id:"selectcount",level:3},{value:"<code>selectLoading</code>",id:"selectloading",level:3},{value:"<code>selectError</code>",id:"selecterror",level:3},{value:"<code>getAll</code>",id:"getall",level:3},{value:"<code>getEntity</code>",id:"getentity",level:3},{value:"<code>hasEntity</code>",id:"hasentity",level:3},{value:"<code>getCount</code>",id:"getcount",level:3},{value:"<code>Entity Actions</code>",id:"entity-actions",level:3}],p={toc:d};function y(e){var t=e.components,n=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,o.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"The Entity Query is similar to the general ",(0,l.kt)("inlineCode",{parentName:"p"},"Query"),", with additional functionality tailored for ",(0,l.kt)("inlineCode",{parentName:"p"},"EntityStores"),"."),(0,l.kt)("p",null,"Let's see how we can use it to create a ",(0,l.kt)("inlineCode",{parentName:"p"},"todos")," query:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="todos.query.ts"',title:'"todos.query.ts"'},"import { QueryEntity } from '@datorama/akita';\nimport { TodosStore, TodosState } from './todos.store';\n\nexport class TodosQuery extends QueryEntity<TodosState> {\n  constructor(protected store: TodosStore) {\n    super(store);\n  }\n}\n")),(0,l.kt)("p",null,"The query has two notations - one for getting the data as an ",(0,l.kt)("inlineCode",{parentName:"p"},"observable"),", which is prefixed with ",(0,l.kt)("inlineCode",{parentName:"p"},"select"),", and one for getting the ",(0,l.kt)("em",{parentName:"p"},"raw")," value, which is prefixed with ",(0,l.kt)("inlineCode",{parentName:"p"},"get"),". For example:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const todos$ = query.selectAll();\nconst todos = query.getAll();\n")),(0,l.kt)("p",null,"By using this model, you will receive a lot of built-in functionality from Akita:"),(0,l.kt)("h2",{id:"api"},"API"),(0,l.kt)("h3",{id:"selectall"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectAll")),(0,l.kt)("p",null,"Select the entire store's entity collection:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const todos$ = query.selectAll();\n\nconst todos$ = query.selectAll({ asObject: true });\n\nconst completedTodos$ = query.selectAll({\n  filterBy: ({ completed }) => !!completed\n});\n\n// This will perform AND logic\nconst completedTodos$ = query.selectAll({  \n   filterBy: [   \n    (entity, index) => index % 2 === 0,   \n    ({ completed }) => !!completed  \n  ]\n});\n\ntodos$ = query.selectAll({ limitTo: 5 });\n")),(0,l.kt)("h3",{id:"selectmany"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectMany")),(0,l.kt)("p",null,"Select multiple entities from the store:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const todos$ = query.selectMany([id, id, id]);\n\n// Select the name property from each\nconst todos$ = query.selectMany([id, id, id], ({ name }) => name);\n")),(0,l.kt)("h3",{id:"selectentity"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectEntity")),(0,l.kt)("p",null,"Select an entity or a slice of an entity:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const todo$ = query.selectEntity(id);\nconst completed$ = query.selectEntity(1, 'completed');\nconst title$ = query.selectEntity(1, ({ title }) => title);\n\n// For performance reasons we expect the entity to be in the store.\n// If you need something dynamic use selectAll with filterBy.\nconst entity$ = query.selectEntity(({ title }) => title === slug);\n")),(0,l.kt)("h3",{id:"selectfirst"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectFirst")),(0,l.kt)("p",null,"Select the first entity from the store:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const firstTodo$ = query.selectFirst();\nconst firstTodoTitle$ = query.selectFirst(({ title }) => title);\n")),(0,l.kt)("h3",{id:"selectlast"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectLast")),(0,l.kt)("p",null,"Select the last entity from the store:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const lastTodo$ = query.selectLast();\nconst lastTodoTitle$ = query.selectLast(({ title }) => title);\n")),(0,l.kt)("h3",{id:"selectcount"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectCount")),(0,l.kt)("p",null,"Select the store's entity collection ",(0,l.kt)("inlineCode",{parentName:"p"},"size"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const count$ = query.selectCount();\nconst completedCount$ = query.selectCount(({ completed }) => completed);\n")),(0,l.kt)("h3",{id:"selectloading"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectLoading")),(0,l.kt)("p",null,"Select the store's ",(0,l.kt)("inlineCode",{parentName:"p"},"loading")," state:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const loading$ = query.selectLoading();\n")),(0,l.kt)("h3",{id:"selecterror"},(0,l.kt)("inlineCode",{parentName:"h3"},"selectError")),(0,l.kt)("p",null,"Select the store's error state:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const error$ = this.query.selectError();\n")),(0,l.kt)("h3",{id:"getall"},(0,l.kt)("inlineCode",{parentName:"h3"},"getAll")),(0,l.kt)("p",null,"Get the entire store's entity collection:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const todos = query.getAll();\nconst todos = query.getAll({ asObject: true });\n")),(0,l.kt)("h3",{id:"getentity"},(0,l.kt)("inlineCode",{parentName:"h3"},"getEntity")),(0,l.kt)("p",null,"Get an entity by id:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const todo = query.getEntity(id);\n")),(0,l.kt)("h3",{id:"hasentity"},(0,l.kt)("inlineCode",{parentName:"h3"},"hasEntity")),(0,l.kt)("p",null,"Returns whether an entity exists:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"// The store is empty when it returns false\nif(query.hasEntity()) { } \n  \nif(query.hasEntity(id)) { }\n \nif(query.hasEntity(({ completed }) => completed)) { }\n \nif(query.hasEntity([id, id, id])) { }\n")),(0,l.kt)("h3",{id:"getcount"},(0,l.kt)("inlineCode",{parentName:"h3"},"getCount")),(0,l.kt)("p",null,"Get the store's entity collection length:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"const count = query.getCount();\nconst completedCount = query.getCount(({ completed }) => completed);\n")),(0,l.kt)("h3",{id:"entity-actions"},(0,l.kt)("inlineCode",{parentName:"h3"},"Entity Actions")),(0,l.kt)("p",null,"Listen for any store action:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"import { EntityActions } from '@datorama/akita';\n\n// Listen for a specific action\nquery.selectEntityAction(EntityActions.Set).subscribe(newIds => {})\nquery.selectEntityAction(EntityActions.Add).subscribe(addedIds => {});\nquery.selectEntityAction(EntityActions.Update).subscribe(updatedIds => {});\nquery.selectEntityAction(EntityActions.Remove).subscribe(removedIds => {});\n\n// listen for a subset of actions\nquery.selectEntityAction([EntityActions.Add, EntityActions.Remove]).subscribe(action => {});\n\n// listen for all actions\nquery.selectEntityAction().subscribe(action => {});\n")))}y.isMDXComponent=!0}}]);