System.register([],function(t,i){"use strict";var n;i&&i.id;return{setters:[],execute:function(){n=function(){function t(t,i){this.x=t,this.y=i}return t.prototype.rotate=function(t){var i=this.x,n=this.y;return this.x=Math.cos(t)*i-Math.sin(t)*n,this.y=Math.sin(t)*i+Math.cos(t)*n,this},t.prototype.multiply=function(t){return this.x*=t,this.y*=t,this},t.prototype.clone=function(){return new t(this.x,this.y)},t}(),t("Vector",n)}}});