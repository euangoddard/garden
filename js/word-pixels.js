System.register(["./vector","./canvas-utils"],function(t,n){"use strict";function r(t,n,r){var a=t.split(/\W+/),i=Math.floor(r/a.length),u=e(a,i),v=Math.max.apply(Math,u),c=n-2*l;if(c<v){var h=c/v;i=Math.floor(i*h),u=u.map(function(t){return Math.floor(t*h)})}var d=o(a,u,i),s=f(a,d,u,i,c);return s}function e(t,n){var r=t.map(function(t){return a(t,n)});return r}function a(t,n){var r=document.createElement("canvas"),e=r.getContext("2d");e.font=n+"px sans-serif";var a=Math.ceil(e.measureText(t).width);return a}function o(t,n,r){for(var e=[],a=0,o=void 0,u=void 0;a<t.length;a++)o=t[a],u=n[a],e.push(i(o,u,r));return e}function i(t,n,r){var e=document.createElement("canvas");d.setCanvasSize(e,n,r);var a=e.getContext("2d"),o=r+"px sans-serif";a.font=o,a.fillStyle="#f00",a.font=o,a.fillText(t,0,.75*r);for(var i=a.getImageData(0,0,n,r).data,u=[],f=0;f<i.length;f+=4)u.push(i[f]>0);return u}function u(t,n,r,e,a){if(n<e)throw new Error("Invalid value for x: "+e);if(r<a)throw new Error("Invalid value for y: "+a);var o=e+a*n;return t[o]}function f(t,n,r,e,a){for(var o=[],i=0,u=void 0,f=void 0,c=void 0;i<t.length;i++)u=n[i],f=r[i],c=v(u,f,e,a,i),o=o.concat(c);return o}function v(t,n,r,e,a){for(var o=c(),i=Math.floor((e-n)/2)+l,f=[],v=0,d=void 0;v<n;v+=o)for(var s=0,m=void 0;s<r;s+=o)d=Math.min(Math.round(Math.random()*o)+v,n),m=Math.min(Math.round(Math.random()*o)+s,r),u(t,n,r,d,m)&&f.push(new h.Vector(i+d,l+m+r*a));return f}function c(){return Math.round((window.innerWidth+window.innerHeight)/s)}var h,d,l,s;n&&n.id;return t("generatePixelGrid",r),{setters:[function(t){h=t},function(t){d=t}],execute:function(){l=20,s=160}}});