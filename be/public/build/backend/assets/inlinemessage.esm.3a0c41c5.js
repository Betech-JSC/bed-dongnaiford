import{o,c,b as l,J as r,j as p,k as d}from"./app.a835f05d.js";var m={name:"InlineMessage",props:{severity:{type:String,default:"error"}},timeout:null,data(){return{visible:!0}},mounted(){this.sticky||setTimeout(()=>{this.visible=!1},this.life)},computed:{containerClass(){return["p-inline-message p-component p-inline-message-"+this.severity,{"p-inline-message-icon-only":!this.$slots.default}]},iconClass(){return["p-inline-message-icon pi",{"pi-info-circle":this.severity==="info","pi-check":this.severity==="success","pi-exclamation-triangle":this.severity==="warn","pi-times-circle":this.severity==="error"}]}}};const u={class:"p-inline-message-text"};function h(t,s,n,i,e,a){return o(),c("div",{"aria-live":"polite",class:r(a.containerClass)},[l("span",{class:r(a.iconClass)},null,2),l("span",u,[p(t.$slots,"default",{},()=>[d("\xA0")])])],2)}function f(t,s){s===void 0&&(s={});var n=s.insertAt;if(!(!t||typeof document>"u")){var i=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.type="text/css",n==="top"&&i.firstChild?i.insertBefore(e,i.firstChild):i.appendChild(e),e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}}var y=`
.p-inline-message {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: top;
}
.p-inline-message-icon-only .p-inline-message-text {
    visibility: hidden;
    width: 0;
}
.p-fluid .p-inline-message {
    display: flex;
}
`;f(y);m.render=h;export{m as s};
