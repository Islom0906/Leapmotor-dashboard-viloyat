"use strict";(self.webpackChunkcrema=self.webpackChunkcrema||[]).push([[894],{68438:(e,i,a)=>{a.d(i,{Z:()=>d});var t=a(74569),l=a.n(t);l().defaults.baseURL="".concat("https://surxondaryo.leapmotorca.uz/api"),l().interceptors.request.use((e=>{const i=(e=>{try{return localStorage.getItem(e)}catch(i){console.log("Error getting data")}})("lptoken"),a=null!==i?"Bearer ".concat(i):"";return e.headers.authorization=a,e}));const o=l(),d={async getData(e){const{data:i}=await o.get(e);return i},async getDataByID(e,i){const{data:a}=await o.get("".concat(e,"/").concat(i));return a},async postData(e,i){const{data:a}=await o.post(e,i);return a},async editData(e,i,a){const{data:t}=await o.put("".concat(e,"/").concat(a),i);return t},async deleteData(e,i){await o.delete("".concat(e,"/").concat(i))},async deleteImages(e,i){console.log("delete image",i),await o.delete(e,{data:i})}}},54894:(e,i,a)=>{a.r(i),a.d(i,{default:()=>Z});var t=a(72791),l=a(2409),o=a(50419),d=a(66106),n=a(30914),r=a(49389),s=a(93086),u=a(87309),c=a(68117),m=a(91933),v=a(68438),g=a(98986),p=a(57689),f=a(16030),h=a(77221),x=a(80184);const j={textRu:"",textUz:"",model:"",mediaLogoId:"",mediaBannerId:""},Z=()=>{const[e]=l.Z.useForm(),i=(0,p.s0)(),{editId:a}=(0,f.v9)((e=>e.editData)),Z=(0,f.I0)(),[b,F]=(0,t.useState)([]),[I,y]=(0,t.useState)([]),[w,L]=(0,t.useState)({}),[S,E]=(0,t.useState)(!1),[D,P]=(0,t.useState)({}),[O,U]=(0,t.useState)({}),{mutate:R,data:z,isLoading:B,isSuccess:V,error:C,isError:q}=(0,m.useMutation)((e=>{let{url:i,data:a}=e;return v.Z.postData(i,a)}),{onSuccess:()=>o.ZP.success("Success"),onError:e=>o.ZP.error(e.message)}),{mutate:_,data:k,isLoading:M,isSuccess:T}=(0,m.useMutation)((e=>{let{url:i,formData:a}=e;return v.Z.postData(i,a)}),{onError:e=>o.ZP.error(e.message,"Rasmning JPG,JPEG,PNG formatlariga ruxsat etilgan")}),{isLoading:J,data:G,refetch:N,isSuccess:A}=(0,m.useQuery)(["edit-banner",a],(()=>v.Z.getDataByID("/product",a)),{enabled:!1}),{mutate:Q,isLoading:H,data:W,isSuccess:K,error:X,isError:Y}=(0,m.useMutation)((e=>{let{url:i,data:a,id:t}=e;return v.Z.editData(i,a,t)}),{onError:e=>o.ZP.error(e.message)}),{mutate:$}=(0,m.useMutation)((e=>{let{url:i,ids:a}=e;return v.Z.deleteImages(i,a)}),{onSuccess:()=>o.ZP.success("Success"),onError:e=>o.ZP.error(e.message)});(0,t.useEffect)((()=>{let e=[];if(K&&Z({type:h.Pb,payload:""}),A&&null!==D&&void 0!==D&&D.uid&&e.push(null===D||void 0===D?void 0:D.uid),A&&null!==O&&void 0!==O&&O.uid&&e.push(null===O||void 0===O?void 0:O.uid),A&&(null!==D&&void 0!==D&&D.uid||null!==O&&void 0!==O&&O.uid)){$({url:"/medias",ids:{ids:e}})}(V||K)&&i("/product")}),[z,W]),(0,t.useEffect)((()=>{q&&o.ZP.error(C.message),Y&&o.ZP.error(X.message)}),[C,X]),(0,t.useEffect)((()=>{""!==a&&N()}),[a]),(0,t.useEffect)((()=>{""===a&&e.setFieldsValue(j)}),[]),(0,t.useEffect)((()=>{var i,a,t,l,o,d;const n=[{uid:null===G||void 0===G||null===(i=G.imageLogo)||void 0===i?void 0:i._id,name:null===G||void 0===G||null===(a=G.imageLogo)||void 0===a?void 0:a.name,status:"done",url:"".concat("https://surxondaryo.leapmotorca.uz/api","/").concat(null===G||void 0===G||null===(t=G.imageLogo)||void 0===t?void 0:t.path)}],r=[{uid:null===G||void 0===G||null===(l=G.imageBanner)||void 0===l?void 0:l._id,name:null===G||void 0===G||null===(o=G.imageBanner)||void 0===o?void 0:o.name,status:"done",url:"".concat("https://surxondaryo.leapmotorca.uz/api","/").concat(null===G||void 0===G||null===(d=G.imageBanner)||void 0===d?void 0:d.path)}];if(A){const i={textRu:null===G||void 0===G?void 0:G.textRu,textUz:null===G||void 0===G?void 0:G.textUz,model:null===G||void 0===G?void 0:G.model,mediaLogoId:n,mediaBannerId:r};F(n),y(r),e.setFieldsValue(i)}}),[G]),(0,t.useEffect)((()=>{var e,i,t,l;let o="",d="";var n,r,s,u,c;if(A&&T&&null!==(e=b[0])&&void 0!==e&&null!==(i=e.originFileObj)&&void 0!==i&&i.uid)o=null===(n=k[0])||void 0===n?void 0:n._id;else if(A){var m;o=null===(m=b[0])||void 0===m?void 0:m.uid}if(A&&T&&null!==(t=I[0])&&void 0!==t&&null!==(l=t.originFileObj)&&void 0!==l&&l.uid)d=2===k.length?null===(r=k[1])||void 0===r?void 0:r._id:null===(s=k[0])||void 0===s?void 0:s._id;else if(A){var v;d=null===(v=I[0])||void 0===v?void 0:v.uid}!A&&k&&(o=null===(u=k[0])||void 0===u?void 0:u._id,d=null===(c=k[1])||void 0===c?void 0:c._id);const g={textRu:w.textRu,textUz:w.textUz,model:w.model,mediaLogoId:o,mediaBannerId:d};T&&!A?R({url:"/product",data:g}):(S||T)&&Q({url:"/product",data:g,id:a})}),[k,w]);(0,t.useEffect)((()=>{const i=JSON.parse(localStorage.getItem("myFormValues"));i&&(i.images=[],e.setFieldsValue(i));const a=()=>{localStorage.setItem("myFormValues",JSON.stringify(e.getFieldsValue()))};return window.addEventListener("beforeunload",a),()=>{localStorage.removeItem("editDataId"),localStorage.removeItem("myFormValues"),window.removeEventListener("beforeunload",a)}}),[]);const ee=async e=>{let i=e.url;i||(i=await new Promise((i=>{const a=new FileReader;a.readAsDataURL(e.originFileObj),a.onload=()=>i(a.result)})));const a=new Image;a.src=i;const t=window.open(i);null===t||void 0===t||t.document.write(a.outerHTML)};return(0,x.jsx)("div",{children:M||B||J||H?(0,x.jsx)(g.QP,{}):(0,x.jsxs)(l.Z,{form:e,name:"basic",labelCol:{span:24},wrapperCol:{span:24},style:{maxWidth:"100%"},initialValues:j,onFinish:e=>{const i=new FormData;let a=!1;var t,l,o,d,n,r,s,u,c,m,v,g;if(A)if(null!==(t=b[0])&&void 0!==t&&null!==(l=t.originFileObj)&&void 0!==l&&l.uid&&null!==(o=I[0])&&void 0!==o&&null!==(d=o.originFileObj)&&void 0!==d&&d.uid)a=!0,i.append("media",null===(c=b[0])||void 0===c?void 0:c.originFileObj),i.append("media",null===(m=I[0])||void 0===m?void 0:m.originFileObj),E(!1);else if(null!==(n=b[0])&&void 0!==n&&null!==(r=n.originFileObj)&&void 0!==r&&r.uid){var p;a=!0,i.append("media",null===(p=b[0])||void 0===p?void 0:p.originFileObj),E(!1)}else if(null!==(s=I[0])&&void 0!==s&&null!==(u=s.originFileObj)&&void 0!==u&&u.uid){var f;a=!0,i.append("media",null===(f=I[0])||void 0===f?void 0:f.originFileObj),E(!1)}else a=!1,E(!0);else a=!0,i.append("media",null===(v=b[0])||void 0===v?void 0:v.originFileObj),i.append("media",null===(g=I[0])||void 0===g?void 0:g.originFileObj);a&&!T&&_({url:"/medias",formData:i}),L(e)},onFinishFailed:e=>{console.log("Failed:",e)},autoComplete:"off",children:[(0,x.jsxs)(d.Z,{gutter:20,children:[(0,x.jsx)(n.Z,{span:12,children:(0,x.jsx)(l.Z.Item,{label:"\u0422\u0435\u043a\u0441\u0442 Ru",name:"textRu",rules:[{required:!0,message:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u0442\u0435\u043a\u0441\u0442 RU!"}],children:(0,x.jsx)(r.default,{})})}),(0,x.jsx)(n.Z,{span:12,children:(0,x.jsx)(l.Z.Item,{label:"Text Uz",name:"textUz",rules:[{required:!0,message:"Text kiritish talab qilinadi Uz!"}],children:(0,x.jsx)(r.default,{})})})]}),(0,x.jsx)(d.Z,{gutter:20,children:(0,x.jsx)(n.Z,{span:24,children:(0,x.jsx)(l.Z.Item,{label:"Model",name:"model",rules:[{required:!0,message:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u0432\u0432\u043e\u0434 \u043c\u043e\u0434\u0435\u043b\u0438"}],children:(0,x.jsx)(r.default,{})})})}),(0,x.jsxs)(d.Z,{gutter:20,children:[(0,x.jsx)(n.Z,{span:12,children:(0,x.jsx)(l.Z.Item,{label:"\u0418\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u043b\u043e\u0433\u043e\u0442\u0438\u043f\u0430",name:"mediaLogoId",rules:[{required:!0,message:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f \u043b\u043e\u0433\u043e\u0442\u0438\u043f\u0430"}],children:(0,x.jsx)(c.Z,{children:(0,x.jsx)(s.Z,{maxCount:1,fileList:b,listType:"picture-card",onChange:i=>{let{fileList:a}=i;F(a),e.setFieldsValue({mediaLogoId:a})},onPreview:ee,beforeUpload:()=>!1,onRemove:e=>{A&&P(e)},children:b.length>0?"":"Upload"})})})}),(0,x.jsx)(n.Z,{span:12,children:(0,x.jsx)(l.Z.Item,{label:"\u0418\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0431\u0430\u043d\u043d\u0435\u0440\u0430",name:"mediaBannerId",rules:[{required:!0,message:"\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f \u0431\u0430\u043d\u043d\u0435\u0440\u0430"}],children:(0,x.jsx)(c.Z,{rotate:!0,children:(0,x.jsx)(s.Z,{maxCount:1,fileList:I,listType:"picture-card",onChange:i=>{let{fileList:a}=i;y(a),e.setFieldsValue({mediaBannerId:a})},onPreview:ee,beforeUpload:()=>!1,onRemove:e=>{A&&U(e)},children:I.length>0?"":"Upload"})})})})]}),(0,x.jsx)(u.Z,{type:"primary",htmlType:"submit",style:{width:"100%"},children:A?"Edit":"Add"})]})})}}}]);
//# sourceMappingURL=894.14749b80.chunk.js.map