/*! For license information please see c4f5d8e4.a7aa5c69.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{704:function(e,t,a){var n;!function(){"use strict";var a={}.hasOwnProperty;function l(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var r=typeof n;if("string"===r||"number"===r)e.push(n);else if(Array.isArray(n)&&n.length){var o=l.apply(null,n);o&&e.push(o)}else if("object"===r)for(var i in n)a.call(n,i)&&n[i]&&e.push(i)}}return e.join(" ")}e.exports?(l.default=l,e.exports=l):void 0===(n=function(){return l}.apply(t,[]))||(e.exports=n)}()},72:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(704),o=a.n(r),i=a(104),s=a(87),c=a(82),m=a(88),u=a(73),d=a.n(u);const p=[{title:l.a.createElement(l.a.Fragment,null,"\ud83e\uddd9\u200d Built-in multi steps"),description:l.a.createElement(l.a.Fragment,null,"Multi steps form logic available out of the box! No more pain to build perfect UX for complex forms.")},{title:l.a.createElement(l.a.Fragment,null,"\u2705 Composable validations"),description:l.a.createElement(l.a.Fragment,null,"Don't duplicate your logic between display and validation. Validation is enabled only if the field is displayed.")},{title:l.a.createElement(l.a.Fragment,null,"\ud83d\udc85 Headless, build your own UX!"),description:l.a.createElement(l.a.Fragment,null,"Choose how to render validations, form buttons, and navigation between steps (wizard, tabs, other). It's your choice!")},{title:l.a.createElement(l.a.Fragment,null,"\ud83d\udccb Turn everything into fields"),description:l.a.createElement(l.a.Fragment,null,"Turn everything into a custom field with full validation! Create forms in React with full validations without the pain.")},{title:l.a.createElement(l.a.Fragment,null,"\u269b\ufe0f Built with Typescript & hooks"),description:l.a.createElement(l.a.Fragment,null,"Typescript give you nice types out of the box. Hooks cut the complexity to create custom fields. Use complex logic without even thinking of it.")},{title:l.a.createElement(l.a.Fragment,null,"\ud83d\udcf1 React Native compatible"),description:l.a.createElement(l.a.Fragment,null,"You can use it with"," ",l.a.createElement("a",{href:"https://facebook.github.io/react-native/"},"React Native"),". Just use the ",l.a.createElement("code",null,"as={View}")," property on"," ",l.a.createElement("code",null,"<FormizStep>")," component to replace the"," ",l.a.createElement("code",null,"div"),".")}],h=()=>l.a.createElement("div",{className:"my-16 sm:my-24"},l.a.createElement("a",{href:"https://www.bearstudio.fr/en",target:"_blank",className:"group relative block rounded-2xl rounded-lg overflow-hidden shadow-xl px-12 py-10",style:{background:"#00404c",textDecoration:"none"}},l.a.createElement("div",{"aria-hidden":"true",className:"absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"},l.a.createElement("svg",{className:"absolute inset-0 h-full w-full",preserveAspectRatio:"xMidYMid slice",fill:"none",viewBox:"0 0 1463 360"},l.a.createElement("path",{style:{color:"#14677e",opacity:.2},fill:"currentColor",d:"M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"}),l.a.createElement("path",{style:{color:"#00141d",opacity:.2},fill:"currentColor",d:"M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"}))),l.a.createElement("div",{className:"relative"},l.a.createElement("div",{className:"sm:text-center"},l.a.createElement("h2",{className:"text-2xl font-extrabold text-white tracking-tight sm:text-3xl"},l.a.createElement("span",{className:"group-hover:underline group-focus:underline",style:{color:"#ffc10e"}},"BearStudio")," ","supports the development of Formiz"),l.a.createElement("p",{className:"mt-4 mb-0 mx-auto max-w-2xl text-lg text-white"},l.a.createElement("span",{className:"group-hover:underline group-focus:underline"},"BearStudio")," ","is a french agency that supports project holders in their digital development process, with a team and/or CTO for rent."),l.a.createElement("span",{className:"inline-flex items-center justify-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md",style:{background:"#ffc10e",color:"#00404c"}},"Visit BearStudio Website",l.a.createElement("svg",{className:"-mr-1 ml-3 h-5 w-",style:{color:"#00404c"},viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},l.a.createElement("path",{d:"M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"}),l.a.createElement("path",{d:"M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"})))))));t.default=function(){const e=Object(c.a)(),{siteConfig:t={}}=e;return l.a.createElement(i.a,{title:t.title+" | React multi steps forms",description:"Create custom multi steps forms with full validation without the pain."},l.a.createElement("header",{className:o()("hero hero--primary",d.a.heroBanner)},l.a.createElement("div",{className:"container"},l.a.createElement("h1",{className:"hero__title"},t.title),l.a.createElement("p",{className:"hero__subtitle"},t.tagline),l.a.createElement("div",{className:d.a.buttons},l.a.createElement(s.a,{className:o()("button button--secondary button--lg",d.a.getStarted),to:Object(m.a)("docs/getting-started")},"Get Started"),l.a.createElement(s.a,{className:o()("button button--secondary button--lg",d.a.getStarted),to:Object(m.a)("docs/demos/wizard")},"Demos")),l.a.createElement("a",{className:o()("button button--link button--md text-white underline transition duration-700 ease-in-out hover:no-underline hover:text-green-100 whitespace-normal",d.a.getStarted),href:"https://github.com/ivan-dalmet/formiz/issues/116",target:"_blank",rel:"noopener noreferrer"},"Formiz v2 is under heavy developments!"))),l.a.createElement("main",null,p&&p.length&&l.a.createElement("section",{className:d.a.features},l.a.createElement("div",{className:"container",style:{maxWidth:"60rem"}},l.a.createElement("h2",{style:{margin:"1em 0 2em 0",textAlign:"center"}},"Why Formiz?"),l.a.createElement("div",{className:"row",style:{justifyContent:"center"}},p.map(({title:e,description:t},a)=>l.a.createElement("div",{key:a,className:o()("col col--4",d.a.feature)},l.a.createElement("h3",null,e),l.a.createElement("p",null,t)))),l.a.createElement(h,null)))))}}}]);