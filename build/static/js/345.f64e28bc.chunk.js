"use strict";(self.webpackChunkcrema=self.webpackChunkcrema||[]).push([[345],{68438:(e,t,a)=>{a.d(t,{Z:()=>o});var s=a(74569),r=a.n(s);r().defaults.baseURL="".concat("https://samarqand.leapmotorca.uz/api"),r().interceptors.request.use((e=>{const t=(e=>{try{return localStorage.getItem(e)}catch(t){console.log("Error getting data")}})("lptoken"),a=null!==t?"Bearer ".concat(t):"";return e.headers.authorization=a,e}));const n=r(),o={async getData(e){const{data:t}=await n.get(e);return t},async getDataByID(e,t){const{data:a}=await n.get("".concat(e,"/").concat(t));return a},async postData(e,t){const{data:a}=await n.post(e,t);return a},async editData(e,t,a){const{data:s}=await n.put("".concat(e,"/").concat(a),t);return s},async deleteData(e,t){await n.delete("".concat(e,"/").concat(t))},async deleteImages(e,t){console.log("delete image",t),await n.delete(e,{data:t})}}},95345:(e,t,a)=>{a.r(t),a.d(t,{default:()=>b});var s=a(72791),r=a(2409),n=a(50419),o=a(66106),c=a(30914),l=a(49389),i=a(87309),d=a(91933),u=a(68438),m=a(98986),g=a(57689),f=a(16030),p=a(77221),h=a(80184);const Z={tel:"",facebook:"",twitter:"",instagram:""},b=()=>{const[e]=r.Z.useForm(),t=(0,g.s0)(),{editId:a}=(0,f.v9)((e=>e.editData)),b=(0,f.I0)(),{mutate:x,data:y,isLoading:j,isSuccess:w,error:I,isError:F}=(0,d.useMutation)((e=>{let{url:t,data:a}=e;return u.Z.postData(t,a)}),{onSuccess:()=>{n.ZP.success("Success")},onError:e=>{n.ZP.error(e)}}),{isLoading:E,data:S,refetch:k,isSuccess:D,error:v,isError:V}=(0,d.useQuery)(["edit-contact"],(()=>u.Z.getData("/contact")),{enabled:!1}),{mutate:q,isLoading:L,data:P,isSuccess:C}=(0,d.useMutation)((e=>{let{url:t,data:a,id:s}=e;return u.Z.editData(t,a,s)}));(0,s.useEffect)((()=>{C&&b({type:p.Pb,payload:""}),(w||C)&&t("/contact")}),[y,P]),(0,s.useEffect)((()=>{F&&n.ZP.error(I.message),V&&n.ZP.error(v.message)}),[I,v]),(0,s.useEffect)((()=>{""!==a&&k()}),[a]),(0,s.useEffect)((()=>{""===a&&e.setFieldsValue(Z)}),[]),(0,s.useEffect)((()=>{if(D){const t={tel:S.tel,facebook:S.facebook,twitter:S.twitter,instagram:S.instagram};e.setFieldsValue(t)}}),[S]);return(0,s.useEffect)((()=>{const t=JSON.parse(localStorage.getItem("myFormValues"));t&&(t.images=[],e.setFieldsValue(t));const a=()=>{localStorage.setItem("myFormValues",JSON.stringify(e.getFieldsValue()))};return window.addEventListener("beforeunload",a),()=>{localStorage.removeItem("editDataId"),localStorage.removeItem("myFormValues"),window.removeEventListener("beforeunload",a)}}),[]),(0,h.jsx)("div",{children:j||E||L?(0,h.jsx)(m.QP,{}):(0,h.jsxs)(r.Z,{form:e,name:"basic",labelCol:{span:24},wrapperCol:{span:24},style:{maxWidth:"100%"},initialValues:Z,onFinish:e=>{D?q({url:"/contact",id:a,data:e}):x({url:"/contact",data:e})},onFinishFailed:e=>{console.log("Failed:",e)},autoComplete:"off",children:[(0,h.jsxs)(o.Z,{gutter:20,children:[(0,h.jsx)(c.Z,{span:12,children:(0,h.jsx)(r.Z.Item,{label:"\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430",name:"tel",rules:[{required:!0,message:"\u0412\u0432\u043e\u0434 \u043d\u043e\u043c\u0435\u0440\u0430 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430 \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u0435\u043d"}],children:(0,h.jsx)(l.default,{})})}),(0,h.jsx)(c.Z,{span:12,children:(0,h.jsx)(r.Z.Item,{label:"Facebook",name:"facebook",rules:[{required:!0,message:"\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 Facebook \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u0430"}],children:(0,h.jsx)(l.default,{})})})]}),(0,h.jsxs)(o.Z,{gutter:20,children:[(0,h.jsx)(c.Z,{span:12,children:(0,h.jsx)(r.Z.Item,{label:"Telegram",name:"twitter",rules:[{required:!0,message:"\u041e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e \u0432\u0432\u0435\u0441\u0442\u0438 \u0441\u0441\u044b\u043b\u043a\u0443 \u043d\u0430 Telegram"}],children:(0,h.jsx)(l.default,{})})}),(0,h.jsx)(c.Z,{span:12,children:(0,h.jsx)(r.Z.Item,{label:"Instagram",name:"instagram",rules:[{required:!0,message:"\u0421\u0441\u044b\u043b\u043a\u0430 \u043d\u0430 \u0418\u043d\u0441\u0442\u0430\u0433\u0440\u0430\u043c \u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u0430"}],children:(0,h.jsx)(l.default,{})})})]}),(0,h.jsx)(i.Z,{type:"primary",htmlType:"submit",style:{width:"100%",marginTop:"20px"},children:D?"Edit":"Add"})]})})}},30914:(e,t,a)=>{a.d(t,{Z:()=>s});const s=a(89752).Z}}]);
//# sourceMappingURL=345.f64e28bc.chunk.js.map