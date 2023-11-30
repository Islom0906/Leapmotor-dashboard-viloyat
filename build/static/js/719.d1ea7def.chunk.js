"use strict";(self.webpackChunkcrema=self.webpackChunkcrema||[]).push([[719],{68438:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(74569),o=n.n(a);o().defaults.baseURL="".concat("https://namangan.leapmotorca.uz/api"),o().interceptors.request.use((e=>{const t=(e=>{try{return localStorage.getItem(e)}catch(t){console.log("Error getting data")}})("lptoken"),n=null!==t?"Bearer ".concat(t):"";return e.headers.authorization=n,e}));const r=o(),l={async getData(e){const{data:t}=await r.get(e);return t},async getDataByID(e,t){const{data:n}=await r.get("".concat(e,"/").concat(t));return n},async postData(e,t){const{data:n}=await r.post(e,t);return n},async editData(e,t,n){const{data:a}=await r.put("".concat(e,"/").concat(n),t);return a},async deleteData(e,t){await r.delete("".concat(e,"/").concat(t))},async deleteImages(e,t){console.log("delete image",t),await r.delete(e,{data:t})}}},64719:(e,t,n)=>{n.r(t),n.d(t,{default:()=>E});var a=n(72791),o=n(83099),r=n(87309),l=n(34571),i=n(92883),c=n(31752),s=n(82622),u=n(16030),d=n(77221),p=n(57689),v=n(80184);const f=e=>{let{data:t,deleteHandle:n}=e;const f=(0,u.I0)(),m=(0,p.s0)(),[h,g]=(0,a.useState)([]);(0,a.useEffect)((()=>{const e=null===t||void 0===t?void 0:t.reverse();g(e)}),[t]);const y=[{title:"Title Ru",dataIndex:"titleRu",id:"titleRu",render:e=>(0,v.jsx)("p",{children:e})},{title:"Title Uz",dataIndex:"titleUz",id:"titleUz",render:e=>(0,v.jsx)("p",{children:e})},{title:"Action",id:"action",render:(e,t)=>(0,v.jsxs)(o.Z,{size:20,children:[(0,v.jsx)(r.Z,{onClick:()=>{return e=null===t||void 0===t?void 0:t.slug,localStorage.setItem("editDataId",e),f({type:d.Pb,payload:e}),void m("/news/add");var e},type:"primary",icon:(0,v.jsx)(c.Z,{}),children:"Edit"}),(0,v.jsx)(l.Z,{title:"Are you sure to delete this task?",description:"Delete the task ",onConfirm:()=>(async e=>{n("/news",e)})(t._id),children:(0,v.jsx)(r.Z,{type:"danger",icon:(0,v.jsx)(s.Z,{}),children:"Delete"})})]})}];return(0,v.jsx)("div",{children:(0,v.jsx)(i.Z,{columns:y,dataSource:h,rowKey:e=>e._id})})};var m=n(50419),h=n(66106),g=n(30914),y=n(49389),Z=n(37083),x=n(79286),C=n(68438),w=n(91933);const E=()=>{const e=(0,p.s0)(),t=(0,u.I0)(),{mutate:n,isSuccess:l,isLoading:i}=(0,w.useMutation)((e=>{let{url:t,id:n}=e;return C.Z.deleteData(t,n)})),{data:c,isLoading:s,refetch:E}=(0,w.useQuery)("news-get",(()=>C.Z.getData("/news")),{onError:e=>{m.ZP.error(e)}});console.log(c);const[j,b]=(0,a.useState)([]),[k,O]=(0,a.useState)(!1);(0,a.useEffect)((()=>{l&&E()}),[l]);return(0,v.jsx)("div",{className:"site-space-compact-wrapper",children:(0,v.jsxs)(o.Z,{direction:"vertical",style:{width:"100%"},children:[(0,v.jsxs)(h.Z,{gutter:20,children:[(0,v.jsx)(g.Z,{span:16,children:(0,v.jsx)(y.default,{onChange:e=>(e=>{O(""!==e);const t=null===c||void 0===c?void 0:c.filter((t=>t.titleRu.toLowerCase().includes(e.toLowerCase())||t.titleUz.toLowerCase().includes(e.toLowerCase())));b(t)})(e.target.value)})}),(0,v.jsx)(g.Z,{span:8,children:(0,v.jsx)(r.Z,{type:"primary",icon:(0,v.jsx)(x.Z,{}),style:{width:"100%"},onClick:()=>{t({type:d.Pb,payload:""}),e("/news/add")},children:"Add"})})]}),(0,v.jsx)(Z.Z,{size:"medium",spinning:s||i,children:(0,v.jsx)(f,{data:k?j:c,deleteHandle:(e,t)=>{n({url:e,id:t})}})})]})})}},82622:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(1413),o=n(72791);const r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"};var l=n(54291),i=function(e,t){return o.createElement(l.Z,(0,a.Z)((0,a.Z)({},e),{},{ref:t,icon:r}))};i.displayName="DeleteOutlined";const c=o.forwardRef(i)},41783:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(87462),o=n(29439),r=n(98368),l=n(72791),i=n(87309),c=n(2571);function s(e){return!(!e||!e.then)}const u=function(e){var t=l.useRef(!1),n=l.useRef(null),u=(0,r.Z)(!1),d=(0,o.Z)(u,2),p=d[0],v=d[1],f=e.close,m=function(){null===f||void 0===f||f.apply(void 0,arguments)};l.useEffect((function(){var t=null;return e.autoFocus&&(t=setTimeout((function(){var e;null===(e=n.current)||void 0===e||e.focus()}))),function(){t&&clearTimeout(t)}}),[]);var h=e.type,g=e.children,y=e.prefixCls,Z=e.buttonProps;return l.createElement(i.Z,(0,a.Z)({},(0,c.n)(h),{onClick:function(n){var a=e.actionFn;if(!t.current)if(t.current=!0,a){var o;if(e.emitEvent){if(o=a(n),e.quitOnNullishReturnValue&&!s(o))return t.current=!1,void m(n)}else if(a.length)o=a(f),t.current=!1;else if(!(o=a()))return void m();!function(e){s(e)&&(v(!0),e.then((function(){v(!1,!0),m.apply(void 0,arguments),t.current=!1}),(function(e){return v(!1,!0),t.current=!1,Promise.reject(e)})))}(o)}else m()},loading:p,prefixCls:y},Z,{ref:n}),g)}},34571:(e,t,n)=>{n.d(t,{Z:()=>E});var a=n(87462),o=n(29439),r=n(10187),l=n(81694),i=n.n(l),c=n(75179),s=n(11354),u=n(72791),d=n(71929),p=n(69228),v=n(61113),f=n(87309),m=n(2571),h=n(41783),g=n(93486),y=n(70454),Z=n(57924),x=function(e){var t=e.prefixCls,n=e.okButtonProps,o=e.cancelButtonProps,r=e.title,l=e.cancelText,i=e.okText,c=e.okType,s=e.icon,p=e.showCancel,v=void 0===p||p,x=e.close,C=e.onConfirm,w=e.onCancel,E=u.useContext(d.E_).getPrefixCls;return u.createElement(g.Z,{componentName:"Popconfirm",defaultLocale:y.Z.Popconfirm},(function(e){return u.createElement("div",{className:"".concat(t,"-inner-content")},u.createElement("div",{className:"".concat(t,"-message")},s&&u.createElement("span",{className:"".concat(t,"-message-icon")},s),u.createElement("div",{className:"".concat(t,"-message-title")},(0,Z.Z)(r))),u.createElement("div",{className:"".concat(t,"-buttons")},v&&u.createElement(f.Z,(0,a.Z)({onClick:w,size:"small"},o),null!==l&&void 0!==l?l:e.cancelText),u.createElement(h.Z,{buttonProps:(0,a.Z)((0,a.Z)({size:"small"},(0,m.n)(c)),n),actionFn:C,close:x,prefixCls:E("btn"),quitOnNullishReturnValue:!0,emitEvent:!0},null!==i&&void 0!==i?i:e.okText)))}))},C=void 0,w=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(a=Object.getOwnPropertySymbols(e);o<a.length;o++)t.indexOf(a[o])<0&&Object.prototype.propertyIsEnumerable.call(e,a[o])&&(n[a[o]]=e[a[o]])}return n};const E=u.forwardRef((function(e,t){var n=e.prefixCls,l=e.placement,f=void 0===l?"top":l,m=e.trigger,h=void 0===m?"click":m,g=e.okType,y=void 0===g?"primary":g,Z=e.icon,E=void 0===Z?u.createElement(r.Z,null):Z,j=e.children,b=e.overlayClassName,k=e.onOpenChange,O=e.onVisibleChange,P=w(e,["prefixCls","placement","trigger","okType","icon","children","overlayClassName","onOpenChange","onVisibleChange"]),D=u.useContext(d.E_).getPrefixCls,z=(0,c.Z)(!1,{value:void 0!==e.open?e.open:e.visible,defaultValue:void 0!==e.defaultOpen?e.defaultOpen:e.defaultVisible}),N=(0,o.Z)(z,2),T=N[0],R=N[1],I=function(e,t){R(e,!0),null===O||void 0===O||O(e,t),null===k||void 0===k||k(e,t)},S=D("popover",n),L=D("popconfirm",n),V=i()(L,b);return u.createElement(p.Z,(0,a.Z)({},P,{trigger:h,prefixCls:S,placement:f,onOpenChange:function(t){var n=e.disabled;void 0!==n&&n||I(t)},open:T,ref:t,overlayClassName:V,_overlay:u.createElement(x,(0,a.Z)({okType:y,icon:E},e,{prefixCls:S,close:function(e){I(!1,e)},onConfirm:function(t){var n;return null===(n=e.onConfirm)||void 0===n?void 0:n.call(C,t)},onCancel:function(t){var n;I(!1,t),null===(n=e.onCancel)||void 0===n||n.call(C,t)}}))}),(0,v.Tm)(j,{onKeyDown:function(e){var t,n;u.isValidElement(j)&&(null===(n=null===j||void 0===j?void 0:(t=j.props).onKeyDown)||void 0===n||n.call(t,e)),function(e){e.keyCode===s.Z.ESC&&T&&I(!1,e)}(e)}}))}))}}]);
//# sourceMappingURL=719.d1ea7def.chunk.js.map