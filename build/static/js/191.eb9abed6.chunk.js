"use strict";(self.webpackChunkcrema=self.webpackChunkcrema||[]).push([[191],{68438:(t,e,a)=>{a.d(e,{Z:()=>r});var n=a(74569),o=a.n(n);o().defaults.baseURL="".concat("https://namangan.leapmotorca.uz/api"),o().interceptors.request.use((t=>{const e=(t=>{try{return localStorage.getItem(t)}catch(e){console.log("Error getting data")}})("lptoken"),a=null!==e?"Bearer ".concat(e):"";return t.headers.authorization=a,t}));const i=o(),r={async getData(t){const{data:e}=await i.get(t);return e},async getDataByID(t,e){const{data:a}=await i.get("".concat(t,"/").concat(e));return a},async postData(t,e){const{data:a}=await i.post(t,e);return a},async editData(t,e,a){const{data:n}=await i.put("".concat(t,"/").concat(a),e);return n},async deleteData(t,e){await i.delete("".concat(t,"/").concat(e))},async deleteImages(t,e){console.log("delete image",e),await i.delete(t,{data:e})}}},13191:(t,e,a)=>{a.r(e),a.d(e,{default:()=>S});var n=a(72791),o=a(50390),i=a(83099),r=a(87309),c=a(92883),s=a(31752),d=a(16030),l=a(77221),u=a(57689),p=a(80184);const g=t=>{let{data:e}=t;const a=(0,d.I0)(),g=(0,u.s0)(),[x,h]=(0,n.useState)([]);(0,n.useEffect)((()=>{const t=null===e||void 0===e?void 0:e.reverse();h(t)}),[e]);const m=[{title:"Text Ru",dataIndex:"mainSection",id:"mainSection",render:t=>(0,p.jsx)("p",{children:t.textRu})},{title:"Text Uz",dataIndex:"mainSection",id:"mainSection",render:t=>(0,p.jsx)("p",{children:t.textUz})},{title:"Image",dataIndex:"mainSection",id:"mainSection",render:t=>{var e;return console.log(t),(0,p.jsx)(o.Z,{width:50,src:"".concat("https://namangan.leapmotorca.uz/api","/").concat(null===t||void 0===t||null===(e=t.imageMain)||void 0===e?void 0:e.path)})}},{title:"Action",id:"action",render:(t,e)=>(0,p.jsx)(i.Z,{size:20,children:(0,p.jsx)(r.Z,{onClick:()=>{return t=e._id,localStorage.setItem("editDataId",t),a({type:l.Pb,payload:t}),void g("/about/add");var t},type:"primary",icon:(0,p.jsx)(s.Z,{}),children:"Edit"})})}];return(0,p.jsx)("div",{children:(0,p.jsx)(c.Z,{columns:m,dataSource:x,rowKey:t=>t._id})})};var x=a(50419),h=a(66106),m=a(30914),v=a(49389),y=a(37083),j=a(79286),w=a(68438),Z=a(91933);const S=()=>{const t=(0,u.s0)(),e=(0,d.I0)(),{data:a,isLoading:o}=(0,Z.useQuery)("about-get",(()=>w.Z.getData("/about")),{onError:t=>{x.ZP.error(t.message)}}),[c,s]=(0,n.useState)([]),[S,I]=(0,n.useState)(!1);return(0,p.jsx)("div",{className:"site-space-compact-wrapper",children:(0,p.jsxs)(i.Z,{direction:"vertical",style:{width:"100%"},children:[(0,p.jsxs)(h.Z,{gutter:20,children:[(0,p.jsx)(m.Z,{span:16,children:(0,p.jsx)(v.default,{onChange:t=>(t=>{I(""!==t);const e=null===a||void 0===a?void 0:a.filter((e=>e.textRu.toLowerCase().includes(t.toLowerCase())||e.textUz.toLowerCase().includes(t.toLowerCase())));s(e)})(t.target.value)})}),(0,p.jsx)(m.Z,{span:8,children:(0,p.jsx)(r.Z,{disabled:(null===a||void 0===a?void 0:a.length)>0,type:"primary",icon:(0,p.jsx)(j.Z,{}),style:{width:"100%"},onClick:()=>{e({type:l.Pb,payload:""}),t("/about/add")},children:"Add"})})]}),(0,p.jsx)(y.Z,{size:"medium",spinning:o,children:(0,p.jsx)(g,{data:S?c:a})})]})})}}}]);
//# sourceMappingURL=191.eb9abed6.chunk.js.map