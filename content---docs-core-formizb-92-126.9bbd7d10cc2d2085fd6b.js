(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{144:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return a})),t.d(n,"rightToc",(function(){return i})),t.d(n,"default",(function(){return c}));t(167),t(170),t(169),t(171),t(172),t(0);var r=t(178);function o(){return(o=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}var a={id:"formiz",title:"<Formiz> component"},i=[{value:"Import",id:"import",children:[]},{value:"Props",id:"props",children:[{value:"onSubmit(values)",id:"onsubmitvalues",children:[]},{value:"onValidSubmit(values)",id:"onvalidsubmitvalues",children:[]},{value:"onInvalidSubmit(values)",id:"oninvalidsubmitvalues",children:[]},{value:"onChange(values)",id:"onchangevalues",children:[]},{value:"onValid()",id:"onvalid",children:[]},{value:"onInvalid()",id:"oninvalid",children:[]},{value:"autoForm",id:"autoform",children:[]},{value:"connect",id:"connect",children:[]}]},{value:"Handle API errors",id:"handle-api-errors",children:[]}],b={rightToc:i},l="wrapper";function c(e){var n=e.components,t=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,["components"]);return Object(r.b)(l,o({},b,t,{components:n,mdxType:"MDXLayout"}),Object(r.b)("h2",{id:"import"},"Import"),Object(r.b)("pre",null,Object(r.b)("code",o({parentName:"pre"},{className:"language-jsx"}),"import { Formiz } from '@formiz/core'\n")),Object(r.b)("hr",null),Object(r.b)("h2",{id:"props"},"Props"),Object(r.b)("h3",{id:"onsubmitvalues"},Object(r.b)("inlineCode",{parentName:"h3"},"onSubmit(values)")),Object(r.b)("p",null,"Triggered when the form is ",Object(r.b)("strong",{parentName:"p"},"submitted"),"."),Object(r.b)("h3",{id:"onvalidsubmitvalues"},Object(r.b)("inlineCode",{parentName:"h3"},"onValidSubmit(values)")),Object(r.b)("p",null,"Triggered when the form is ",Object(r.b)("strong",{parentName:"p"},"valid")," and ",Object(r.b)("strong",{parentName:"p"},"submitted"),"."),Object(r.b)("h3",{id:"oninvalidsubmitvalues"},Object(r.b)("inlineCode",{parentName:"h3"},"onInvalidSubmit(values)")),Object(r.b)("p",null,"Triggered when the form is ",Object(r.b)("strong",{parentName:"p"},"invalid")," and ",Object(r.b)("strong",{parentName:"p"},"submitted"),"."),Object(r.b)("h3",{id:"onchangevalues"},Object(r.b)("inlineCode",{parentName:"h3"},"onChange(values)")),Object(r.b)("p",null,"Triggered every time the form changes.",Object(r.b)("br",null),"\n\u26a0\ufe0f This is triggered when each field is mounted.",Object(r.b)("br",null),"\n\u2139\ufe0f Instead you can get ",Object(r.b)("inlineCode",{parentName:"p"},"values")," of the form with the ",Object(r.b)("a",o({parentName:"p"},{href:"/docs/core/use-form"}),"useForm()")," hook."),Object(r.b)("h3",{id:"onvalid"},Object(r.b)("inlineCode",{parentName:"h3"},"onValid()")),Object(r.b)("p",null,"Triggered when the form is ",Object(r.b)("strong",{parentName:"p"},"valid"),".",Object(r.b)("br",null),"\n\u2139\ufe0f Instead you can get ",Object(r.b)("inlineCode",{parentName:"p"},"isValid")," value with the ",Object(r.b)("a",o({parentName:"p"},{href:"/docs/core/use-form"}),"useForm()")," hook."),Object(r.b)("h3",{id:"oninvalid"},Object(r.b)("inlineCode",{parentName:"h3"},"onInvalid()")),Object(r.b)("p",null,"Triggered when the form is ",Object(r.b)("strong",{parentName:"p"},"invalid"),".",Object(r.b)("br",null),"\n\u2139\ufe0f Instead you can get ",Object(r.b)("inlineCode",{parentName:"p"},"isValid")," value with the ",Object(r.b)("a",o({parentName:"p"},{href:"/docs/core/use-form"}),"useForm()")," hook."),Object(r.b)("h3",{id:"autoform"},Object(r.b)("inlineCode",{parentName:"h3"},"autoForm")),Object(r.b)("p",null,"Set to ",Object(r.b)("inlineCode",{parentName:"p"},"true")," to auto add a ",Object(r.b)("inlineCode",{parentName:"p"},"<form>")," element with auto onSubmit.",Object(r.b)("br",null),"\n\u2139\ufe0f Instead you can get the ",Object(r.b)("inlineCode",{parentName:"p"},"submit()")," method with the ",Object(r.b)("a",o({parentName:"p"},{href:"/docs/core/use-form"}),"useForm()")," hook and use it with your own ",Object(r.b)("inlineCode",{parentName:"p"},"<form>")," element."),Object(r.b)("h3",{id:"connect"},Object(r.b)("inlineCode",{parentName:"h3"},"connect")),Object(r.b)("p",null,"Allow you to connect your form with the ",Object(r.b)("a",o({parentName:"p"},{href:"/docs/core/use-form"}),"useForm()")," hook.",Object(r.b)("br",null),"\nSee ",Object(r.b)("a",o({parentName:"p"},{href:"/docs/core/use-form"}),"useForm() documentation")," for more details"),Object(r.b)("hr",null),Object(r.b)("h2",{id:"handle-api-errors"},"Handle API errors"),Object(r.b)("pre",null,Object(r.b)("code",o({parentName:"pre"},{className:"language-jsx"}),"const myForm = useForm()\n\n<Formiz\n  connect={myForm}\n  onValidSubmit={(values) => {\n    myForm.invalidateFields({\n      fieldName: 'Error message',\n    })\n  }}\n/>\n  {/* Your fields here */}\n</Formiz>\n")))}c.isMDXComponent=!0}}]);