"use strict";(self.webpackChunkcrema=self.webpackChunkcrema||[]).push([[902],{68438:(t,e,a)=>{a.d(e,{Z:()=>s});var n=a(74569),r=a.n(n);r().defaults.baseURL="".concat("https://andijon.leapmotorca.uz/api"),r().interceptors.request.use((t=>{const e=(t=>{try{return localStorage.getItem(t)}catch(e){console.log("Error getting data")}})("lptoken"),a=null!==e?"Bearer ".concat(e):"";return t.headers.authorization=a,t}));const c=r(),s={async getData(t){const{data:e}=await c.get(t);return e},async getDataByID(t,e){const{data:a}=await c.get("".concat(t,"/").concat(e));return a},async postData(t,e){const{data:a}=await c.post(t,e);return a},async editData(t,e,a){const{data:n}=await c.put("".concat(t,"/").concat(a),e);return n},async deleteData(t,e){await c.delete("".concat(t,"/").concat(e))},async deleteImages(t,e){console.log("delete image",e),await c.delete(t,{data:e})}}},49902:(t,e,a)=>{a.r(e),a.d(e,{default:()=>Z});var n=a(72791),r=a(83099),c=a(87309),s=a(92883),d=a(31752),o=a(16030),i=a(77221),l=a(57689),u=a(80184);const p=t=>{let{data:e}=t;const a=(0,o.I0)(),p=(0,l.s0)(),[h,g]=(0,n.useState)([]);(0,n.useEffect)((()=>{const t=[];e&&t.push(e),g(t)}),[e]);const x=[{title:"Tel",dataIndex:"tel",id:"tel",render:t=>(0,u.jsx)("p",{children:t})},{title:"Facebook",dataIndex:"facebook",id:"facebook",render:t=>(0,u.jsx)("p",{children:t})},{title:"Telegram",dataIndex:"twitter",id:"twitter",render:t=>(0,u.jsx)("p",{children:t})},{title:"Instagram",dataIndex:"instagram",id:"instagram",render:t=>(0,u.jsx)("p",{children:t})},{title:"Action",id:"action",render:(t,e)=>(0,u.jsx)(r.Z,{size:20,children:(0,u.jsx)(c.Z,{onClick:()=>{return t=null===e||void 0===e?void 0:e._id,localStorage.setItem("editDataId",t),a({type:i.Pb,payload:t}),void p("/contact/add");var t},type:"primary",icon:(0,u.jsx)(d.Z,{}),children:"Edit"})})}];return(0,u.jsx)("div",{children:(0,u.jsx)(s.Z,{columns:x,dataSource:h,rowKey:t=>null===t||void 0===t?void 0:t._id})})};var h=a(50419),g=a(66106),x=a(30914),j=a(49389),m=a(37083),y=a(79286),w=a(68438),v=a(91933);const Z=()=>{const t=(0,l.s0)(),e=(0,o.I0)(),{data:a,isLoading:s}=(0,v.useQuery)("contact-get",(()=>w.Z.getData("/contact")),{onError:t=>{h.ZP.error(t)}}),[d,Z]=(0,n.useState)([]),[I,f]=(0,n.useState)(!1);return(0,u.jsx)("div",{className:"site-space-compact-wrapper",children:(0,u.jsxs)(r.Z,{direction:"vertical",style:{width:"100%"},children:[(0,u.jsxs)(g.Z,{gutter:20,children:[(0,u.jsx)(x.Z,{span:16,children:(0,u.jsx)(j.default,{onChange:t=>(t=>{f(""!==t);const e=null===a||void 0===a?void 0:a.filter((e=>e.nameRu.toLowerCase().includes(t.toLowerCase())||e.nameUz.toLowerCase().includes(t.toLowerCase())));Z(e)})(t.target.value)})}),(0,u.jsx)(x.Z,{span:8,children:(0,u.jsx)(c.Z,{type:"primary",icon:(0,u.jsx)(y.Z,{}),style:{width:"100%"},disabled:!0,onClick:()=>{e({type:i.Pb,payload:""}),t("/contact/add")},children:"Add"})})]}),(0,u.jsx)(m.Z,{size:"medium",spinning:s,children:(0,u.jsx)(p,{data:I?d:a})})]})})}}}]);
//# sourceMappingURL=902.104c8b6d.chunk.js.map