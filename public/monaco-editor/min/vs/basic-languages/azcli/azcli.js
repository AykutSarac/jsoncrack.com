/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.33.0(4b1abad427e58dbedc1215d99a0902ffc885fcd4)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/azcli/azcli", ["require","require"],(require)=>{
var moduleExports=(()=>{var s=Object.defineProperty;var i=Object.getOwnPropertyDescriptor;var r=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var c=t=>s(t,"__esModule",{value:!0});var k=(t,e)=>{for(var n in e)s(t,n,{get:e[n],enumerable:!0})},p=(t,e,n,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of r(e))!l.call(t,o)&&(n||o!=="default")&&s(t,o,{get:()=>e[o],enumerable:!(a=i(e,o))||a.enumerable});return t};var f=(t=>(e,n)=>t&&t.get(e)||(n=p(c({}),e,1),t&&t.set(e,n),n))(typeof WeakMap!="undefined"?new WeakMap:0);var m={};k(m,{conf:()=>g,language:()=>d});var g={comments:{lineComment:"#"}},d={defaultToken:"keyword",ignoreCase:!0,tokenPostfix:".azcli",str:/[^#\s]/,tokenizer:{root:[{include:"@comment"},[/\s-+@str*\s*/,{cases:{"@eos":{token:"key.identifier",next:"@popall"},"@default":{token:"key.identifier",next:"@type"}}}],[/^-+@str*\s*/,{cases:{"@eos":{token:"key.identifier",next:"@popall"},"@default":{token:"key.identifier",next:"@type"}}}]],type:[{include:"@comment"},[/-+@str*\s*/,{cases:{"@eos":{token:"key.identifier",next:"@popall"},"@default":"key.identifier"}}],[/@str+\s*/,{cases:{"@eos":{token:"string",next:"@popall"},"@default":"string"}}]],comment:[[/#.*$/,{cases:{"@eos":{token:"comment",next:"@popall"}}}]]}};return f(m);})();
return moduleExports;
});
