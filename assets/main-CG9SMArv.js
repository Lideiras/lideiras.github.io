import{t as ne,l as Qn,T as kf,g as gl,a as Oi,s as Hf}from"./index-BGHZbQqK.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fc="170",Gf=0,hu=1,Vf=2,_h=1,xh=2,pi=3,Vn=0,dn=1,On=2,Wi=0,$s=1,_l=2,fu=3,pu=4,Wf=5,us=100,Xf=101,$f=102,qf=103,jf=104,Yf=200,Kf=201,Zf=202,Jf=203,xl=204,vl=205,Qf=206,ep=207,tp=208,np=209,ip=210,sp=211,rp=212,op=213,ap=214,Ml=0,yl=1,Sl=2,Ks=3,bl=4,El=5,Tl=6,Al=7,pc=0,lp=1,cp=2,Xi=0,up=1,dp=2,hp=3,vh=4,fp=5,pp=6,mp=7,mu="attached",gp="detached",Mh=300,Zs=301,Js=302,wl=303,Rl=304,da=306,Qs=1e3,Hi=1001,ia=1002,Gt=1003,yh=1004,zr=1005,vn=1006,jo=1007,An=1008,yi=1009,Sh=1010,bh=1011,qr=1012,mc=1013,ps=1014,kn=1015,Zr=1016,gc=1017,_c=1018,er=1020,Eh=35902,Th=1021,Ah=1022,wn=1023,wh=1024,Rh=1025,qs=1026,tr=1027,xc=1028,vc=1029,Ch=1030,Mc=1031,yc=1033,Yo=33776,Ko=33777,Zo=33778,Jo=33779,Cl=35840,Ll=35841,Pl=35842,Il=35843,Dl=36196,Ul=37492,Nl=37496,Fl=37808,Ol=37809,Bl=37810,zl=37811,kl=37812,Hl=37813,Gl=37814,Vl=37815,Wl=37816,Xl=37817,$l=37818,ql=37819,jl=37820,Yl=37821,Qo=36492,Kl=36494,Zl=36495,Lh=36283,Jl=36284,Ql=36285,ec=36286,jr=2300,Yr=2301,Ra=2302,gu=2400,_u=2401,xu=2402,_p=2500,xp=0,Ph=1,tc=2,vp=3200,Mp=3201,Sc=0,yp=1,Bi="",Ut="srgb",rn="srgb-linear",ha="linear",_t="srgb",As=7680,vu=519,Sp=512,bp=513,Ep=514,Ih=515,Tp=516,Ap=517,wp=518,Rp=519,nc=35044,Mu=35048,yu="300 es",_i=2e3,sa=2001;class ur{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Su=1234567;const Wr=Math.PI/180,nr=180/Math.PI;function Hn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qt[i&255]+qt[i>>8&255]+qt[i>>16&255]+qt[i>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[t&63|128]+qt[t>>8&255]+"-"+qt[t>>16&255]+qt[t>>24&255]+qt[n&255]+qt[n>>8&255]+qt[n>>16&255]+qt[n>>24&255]).toLowerCase()}function Yt(i,e,t){return Math.max(e,Math.min(t,i))}function bc(i,e){return(i%e+e)%e}function Cp(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Lp(i,e,t){return i!==e?(t-i)/(e-i):0}function Xr(i,e,t){return(1-t)*i+t*e}function Pp(i,e,t,n){return Xr(i,e,1-Math.exp(-t*n))}function Ip(i,e=1){return e-Math.abs(bc(i,e*2)-e)}function Dp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Up(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Np(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Fp(i,e){return i+Math.random()*(e-i)}function Op(i){return i*(.5-Math.random())}function Bp(i){i!==void 0&&(Su=i);let e=Su+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zp(i){return i*Wr}function kp(i){return i*nr}function Hp(i){return(i&i-1)===0&&i!==0}function Gp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Vp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Wp(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),d=r((e-n)/2),h=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*d,l*h,a*c);break;case"YZY":i.set(l*h,a*u,l*d,a*c);break;case"ZXZ":i.set(l*d,l*h,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Bn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function pt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Xp={DEG2RAD:Wr,RAD2DEG:nr,generateUUID:Hn,clamp:Yt,euclideanModulo:bc,mapLinear:Cp,inverseLerp:Lp,lerp:Xr,damp:Pp,pingpong:Ip,smoothstep:Dp,smootherstep:Up,randInt:Np,randFloat:Fp,randFloatSpread:Op,seededRandom:Bp,degToRad:zp,radToDeg:kp,isPowerOfTwo:Hp,ceilPowerOfTwo:Gp,floorPowerOfTwo:Vp,setQuaternionFromProperEuler:Wp,normalize:pt,denormalize:Bn};class it{constructor(e=0,t=0){it.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Yt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ye{constructor(e,t,n,s,r,o,a,l,c){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],S=s[1],v=s[4],x=s[7],R=s[2],A=s[5],w=s[8];return r[0]=o*_+a*S+l*R,r[3]=o*m+a*v+l*A,r[6]=o*p+a*x+l*w,r[1]=c*_+u*S+d*R,r[4]=c*m+u*v+d*A,r[7]=c*p+u*x+d*w,r[2]=h*_+f*S+g*R,r[5]=h*m+f*v+g*A,r[8]=h*p+f*x+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*r,f=c*r-o*l,g=t*d+n*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(s*c-u*n)*_,e[2]=(a*n-s*o)*_,e[3]=h*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ca.makeScale(e,t)),this}rotate(e){return this.premultiply(Ca.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ca.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ca=new Ye;function Dh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function $p(){const i=Kr("canvas");return i.style.display="block",i}const bu={};function kr(i){i in bu||(bu[i]=!0,console.warn(i))}function qp(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function jp(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Yp(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const nt={enabled:!0,workingColorSpace:rn,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===_t&&(i.r=xi(i.r),i.g=xi(i.g),i.b=xi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===_t&&(i.r=js(i.r),i.g=js(i.g),i.b=js(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Bi?ha:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function xi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function js(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Eu=[.64,.33,.3,.6,.15,.06],Tu=[.2126,.7152,.0722],Au=[.3127,.329],wu=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ru=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);nt.define({[rn]:{primaries:Eu,whitePoint:Au,transfer:ha,toXYZ:wu,fromXYZ:Ru,luminanceCoefficients:Tu,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:Eu,whitePoint:Au,transfer:_t,toXYZ:wu,fromXYZ:Ru,luminanceCoefficients:Tu,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}});let ws;class Kp{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ws===void 0&&(ws=Kr("canvas")),ws.width=e.width,ws.height=e.height;const n=ws.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ws}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Kr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=xi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(xi(t[n]/255)*255):t[n]=xi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zp=0;class Uh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=Hn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(La(s[o].image)):r.push(La(s[o]))}else r=La(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function La(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Kp.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Jp=0;class Ft extends ur{constructor(e=Ft.DEFAULT_IMAGE,t=Ft.DEFAULT_MAPPING,n=Hi,s=Hi,r=vn,o=An,a=wn,l=yi,c=Ft.DEFAULT_ANISOTROPY,u=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jp++}),this.uuid=Hn(),this.name="",this.source=new Uh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new it(0,0),this.repeat=new it(1,1),this.center=new it(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Mh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qs:e.x=e.x-Math.floor(e.x);break;case Hi:e.x=e.x<0?0:1;break;case ia:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qs:e.y=e.y-Math.floor(e.y);break;case Hi:e.y=e.y<0?0:1;break;case ia:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ft.DEFAULT_IMAGE=null;Ft.DEFAULT_MAPPING=Mh;Ft.DEFAULT_ANISOTROPY=1;class ut{constructor(e=0,t=0,n=0,s=1){ut.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,x=(f+1)/2,R=(p+1)/2,A=(u+h)/4,w=(d+_)/4,C=(g+m)/4;return v>x&&v>R?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=w/n):x>R?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=A/s,r=C/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=w/r,s=C/r),this.set(n,s,r,t),this}let S=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-_)/S,this.z=(h-u)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qp extends ur{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ft(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Uh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ms extends Qp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Nh extends Ft{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class em extends Ft{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ei{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3];const h=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=h,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==h||c!==f||u!==g){let m=1-a;const p=l*h+c*f+u*g+d*_,S=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const R=Math.sqrt(v),A=Math.atan2(R,p*S);m=Math.sin(m*A)/R,a=Math.sin(a*A)/R}const x=a*S;if(l=l*m+h*x,c=c*m+f*x,u=u*m+g*x,d=d*m+_*x,m===1-a){const R=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=R,c*=R,u*=R,d*=R}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[o],h=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+u*d+l*f-c*h,e[t+1]=l*g+u*h+c*d-a*f,e[t+2]=c*g+u*f+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),d=a(r/2),h=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Yt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),d=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=o*d+this._w*h,this._x=n*d+this._x*h,this._y=s*d+this._y*h,this._z=r*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Cu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Cu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*u,this.y=n+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Pa.copy(this).projectOnVector(e),this.sub(Pa)}reflect(e){return this.sub(Pa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Yt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pa=new P,Cu=new ei;class Rn{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),po.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),po.copy(n.boundingBox)),po.applyMatrix4(e.matrixWorld),this.union(po)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Cr),mo.subVectors(this.max,Cr),Rs.subVectors(e.a,Cr),Cs.subVectors(e.b,Cr),Ls.subVectors(e.c,Cr),wi.subVectors(Cs,Rs),Ri.subVectors(Ls,Cs),es.subVectors(Rs,Ls);let t=[0,-wi.z,wi.y,0,-Ri.z,Ri.y,0,-es.z,es.y,wi.z,0,-wi.x,Ri.z,0,-Ri.x,es.z,0,-es.x,-wi.y,wi.x,0,-Ri.y,Ri.x,0,-es.y,es.x,0];return!Ia(t,Rs,Cs,Ls,mo)||(t=[1,0,0,0,1,0,0,0,1],!Ia(t,Rs,Cs,Ls,mo))?!1:(go.crossVectors(wi,Ri),t=[go.x,go.y,go.z],Ia(t,Rs,Cs,Ls,mo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(oi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const oi=[new P,new P,new P,new P,new P,new P,new P,new P],Un=new P,po=new Rn,Rs=new P,Cs=new P,Ls=new P,wi=new P,Ri=new P,es=new P,Cr=new P,mo=new P,go=new P,ts=new P;function Ia(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ts.fromArray(i,r);const a=s.x*Math.abs(ts.x)+s.y*Math.abs(ts.y)+s.z*Math.abs(ts.z),l=e.dot(ts),c=t.dot(ts),u=n.dot(ts);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const tm=new Rn,Lr=new P,Da=new P;class ti{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):tm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Lr.subVectors(e,this.center);const t=Lr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Lr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Da.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Lr.copy(e.center).add(Da)),this.expandByPoint(Lr.copy(e.center).sub(Da))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ai=new P,Ua=new P,_o=new P,Ci=new P,Na=new P,xo=new P,Fa=new P;class Jr{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ua.copy(e).add(t).multiplyScalar(.5),_o.copy(t).sub(e).normalize(),Ci.copy(this.origin).sub(Ua);const r=e.distanceTo(t)*.5,o=-this.direction.dot(_o),a=Ci.dot(this.direction),l=-Ci.dot(_o),c=Ci.lengthSq(),u=Math.abs(1-o*o);let d,h,f,g;if(u>0)if(d=o*l-a,h=o*a-l,g=r*u,d>=0)if(h>=-g)if(h<=g){const _=1/u;d*=_,h*=_,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Ua).addScaledVector(_o,h),f}intersectSphere(e,t){ai.subVectors(e.center,this.origin);const n=ai.dot(this.direction),s=ai.dot(ai)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,s,r){Na.subVectors(t,e),xo.subVectors(n,e),Fa.crossVectors(Na,xo);let o=this.direction.dot(Fa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ci.subVectors(this.origin,e);const l=a*this.direction.dot(xo.crossVectors(Ci,xo));if(l<0)return null;const c=a*this.direction.dot(Na.cross(Ci));if(c<0||l+c>o)return null;const u=-a*Ci.dot(Fa);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xe{constructor(e,t,n,s,r,o,a,l,c,u,d,h,f,g,_,m){Xe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,d,h,f,g,_,m)}set(e,t,n,s,r,o,a,l,c,u,d,h,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ps.setFromMatrixColumn(e,0).length(),r=1/Ps.setFromMatrixColumn(e,1).length(),o=1/Ps.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const h=o*u,f=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=h-_*c,t[9]=-a*l,t[2]=_-h*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*u,f=l*d,g=c*u,_=c*d;t[0]=h+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*u,f=l*d,g=c*u,_=c*d;t[0]=h-_*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*u,f=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=g*c-f,t[8]=h*c+_,t[1]=l*d,t[5]=_*c+h,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-h*d,t[8]=g*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*d+g,t[10]=h-_*d}else if(e.order==="XZY"){const h=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+_,t[5]=o*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*u,t[10]=_*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nm,e,im)}lookAt(e,t,n){const s=this.elements;return pn.subVectors(e,t),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Li.crossVectors(n,pn),Li.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Li.crossVectors(n,pn)),Li.normalize(),vo.crossVectors(pn,Li),s[0]=Li.x,s[4]=vo.x,s[8]=pn.x,s[1]=Li.y,s[5]=vo.y,s[9]=pn.y,s[2]=Li.z,s[6]=vo.z,s[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],S=n[3],v=n[7],x=n[11],R=n[15],A=s[0],w=s[4],C=s[8],b=s[12],y=s[1],I=s[5],Y=s[9],V=s[13],q=s[2],z=s[6],U=s[10],$=s[14],G=s[3],te=s[7],re=s[11],he=s[15];return r[0]=o*A+a*y+l*q+c*G,r[4]=o*w+a*I+l*z+c*te,r[8]=o*C+a*Y+l*U+c*re,r[12]=o*b+a*V+l*$+c*he,r[1]=u*A+d*y+h*q+f*G,r[5]=u*w+d*I+h*z+f*te,r[9]=u*C+d*Y+h*U+f*re,r[13]=u*b+d*V+h*$+f*he,r[2]=g*A+_*y+m*q+p*G,r[6]=g*w+_*I+m*z+p*te,r[10]=g*C+_*Y+m*U+p*re,r[14]=g*b+_*V+m*$+p*he,r[3]=S*A+v*y+x*q+R*G,r[7]=S*w+v*I+x*z+R*te,r[11]=S*C+v*Y+x*U+R*re,r[15]=S*b+v*V+x*$+R*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*l*d-s*c*d-r*a*h+n*c*h+s*a*f-n*l*f)+_*(+t*l*f-t*c*h+r*o*h-s*o*f+s*c*u-r*l*u)+m*(+t*c*d-t*a*f-r*o*d+n*o*f+r*a*u-n*c*u)+p*(-s*a*u-t*l*d+t*a*h+s*o*d-n*o*h+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],S=d*m*c-_*h*c+_*l*f-a*m*f-d*l*p+a*h*p,v=g*h*c-u*m*c-g*l*f+o*m*f+u*l*p-o*h*p,x=u*_*c-g*d*c+g*a*f-o*_*f-u*a*p+o*d*p,R=g*d*l-u*_*l-g*a*h+o*_*h+u*a*m-o*d*m,A=t*S+n*v+s*x+r*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/A;return e[0]=S*w,e[1]=(_*h*r-d*m*r-_*s*f+n*m*f+d*s*p-n*h*p)*w,e[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*p+n*l*p)*w,e[3]=(d*l*r-a*h*r-d*s*c+n*h*c+a*s*f-n*l*f)*w,e[4]=v*w,e[5]=(u*m*r-g*h*r+g*s*f-t*m*f-u*s*p+t*h*p)*w,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*p-t*l*p)*w,e[7]=(o*h*r-u*l*r+u*s*c-t*h*c-o*s*f+t*l*f)*w,e[8]=x*w,e[9]=(g*d*r-u*_*r-g*n*f+t*_*f+u*n*p-t*d*p)*w,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*p+t*a*p)*w,e[11]=(u*a*r-o*d*r-u*n*c+t*d*c+o*n*f-t*a*f)*w,e[12]=R*w,e[13]=(u*_*s-g*d*s+g*n*h-t*_*h-u*n*m+t*d*m)*w,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*m-t*a*m)*w,e[15]=(o*d*s-u*a*s+u*n*l-t*d*l-o*n*h+t*a*h)*w,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,d=a+a,h=r*c,f=r*u,g=r*d,_=o*u,m=o*d,p=a*d,S=l*c,v=l*u,x=l*d,R=n.x,A=n.y,w=n.z;return s[0]=(1-(_+p))*R,s[1]=(f+x)*R,s[2]=(g-v)*R,s[3]=0,s[4]=(f-x)*A,s[5]=(1-(h+p))*A,s[6]=(m+S)*A,s[7]=0,s[8]=(g+v)*w,s[9]=(m-S)*w,s[10]=(1-(h+_))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ps.set(s[0],s[1],s[2]).length();const o=Ps.set(s[4],s[5],s[6]).length(),a=Ps.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Nn.copy(this);const c=1/r,u=1/o,d=1/a;return Nn.elements[0]*=c,Nn.elements[1]*=c,Nn.elements[2]*=c,Nn.elements[4]*=u,Nn.elements[5]*=u,Nn.elements[6]*=u,Nn.elements[8]*=d,Nn.elements[9]*=d,Nn.elements[10]*=d,t.setFromRotationMatrix(Nn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=_i){const l=this.elements,c=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),h=(n+s)/(n-s);let f,g;if(a===_i)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===sa)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=_i){const l=this.elements,c=1/(t-e),u=1/(n-s),d=1/(o-r),h=(t+e)*c,f=(n+s)*u;let g,_;if(a===_i)g=(o+r)*d,_=-2*d;else if(a===sa)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ps=new P,Nn=new Xe,nm=new P(0,0,0),im=new P(1,1,1),Li=new P,vo=new P,pn=new P,Lu=new Xe,Pu=new ei;class Cn{constructor(e=0,t=0,n=0,s=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Yt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Yt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Lu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Lu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Pu.setFromEuler(this),this.setFromQuaternion(Pu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class Ec{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sm=0;const Iu=new P,Is=new ei,li=new Xe,Mo=new P,Pr=new P,rm=new P,om=new ei,Du=new P(1,0,0),Uu=new P(0,1,0),Nu=new P(0,0,1),Fu={type:"added"},am={type:"removed"},Ds={type:"childadded",child:null},Oa={type:"childremoved",child:null};class Tt extends ur{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=Hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tt.DEFAULT_UP.clone();const e=new P,t=new Cn,n=new ei,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new Ye}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=Tt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ec,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.multiply(Is),this}rotateOnWorldAxis(e,t){return Is.setFromAxisAngle(e,t),this.quaternion.premultiply(Is),this}rotateX(e){return this.rotateOnAxis(Du,e)}rotateY(e){return this.rotateOnAxis(Uu,e)}rotateZ(e){return this.rotateOnAxis(Nu,e)}translateOnAxis(e,t){return Iu.copy(e).applyQuaternion(this.quaternion),this.position.add(Iu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Du,e)}translateY(e){return this.translateOnAxis(Uu,e)}translateZ(e){return this.translateOnAxis(Nu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Mo.copy(e):Mo.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(Pr,Mo,this.up):li.lookAt(Mo,Pr,this.up),this.quaternion.setFromRotationMatrix(li),s&&(li.extractRotation(s.matrixWorld),Is.setFromRotationMatrix(li),this.quaternion.premultiply(Is.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fu),Ds.child=e,this.dispatchEvent(Ds),Ds.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(am),Oa.child=e,this.dispatchEvent(Oa),Oa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),li.multiply(e.parent.matrixWorld)),e.applyMatrix4(li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fu),Ds.child=e,this.dispatchEvent(Ds),Ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pr,e,rm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pr,om,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Tt.DEFAULT_UP=new P(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Fn=new P,ci=new P,Ba=new P,ui=new P,Us=new P,Ns=new P,Ou=new P,za=new P,ka=new P,Ha=new P,Ga=new ut,Va=new ut,Wa=new ut;class zn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Fn.subVectors(e,t),s.cross(Fn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Fn.subVectors(s,t),ci.subVectors(n,t),Ba.subVectors(e,t);const o=Fn.dot(Fn),a=Fn.dot(ci),l=Fn.dot(Ba),c=ci.dot(ci),u=ci.dot(Ba),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const h=1/d,f=(c*l-a*u)*h,g=(o*u-a*l)*h;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ui)===null?!1:ui.x>=0&&ui.y>=0&&ui.x+ui.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ui.x),l.addScaledVector(o,ui.y),l.addScaledVector(a,ui.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Ga.setScalar(0),Va.setScalar(0),Wa.setScalar(0),Ga.fromBufferAttribute(e,t),Va.fromBufferAttribute(e,n),Wa.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Ga,r.x),o.addScaledVector(Va,r.y),o.addScaledVector(Wa,r.z),o}static isFrontFacing(e,t,n,s){return Fn.subVectors(n,t),ci.subVectors(e,t),Fn.cross(ci).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),Fn.cross(ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return zn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return zn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return zn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return zn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return zn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;Us.subVectors(s,n),Ns.subVectors(r,n),za.subVectors(e,n);const l=Us.dot(za),c=Ns.dot(za);if(l<=0&&c<=0)return t.copy(n);ka.subVectors(e,s);const u=Us.dot(ka),d=Ns.dot(ka);if(u>=0&&d<=u)return t.copy(s);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(Us,o);Ha.subVectors(e,r);const f=Us.dot(Ha),g=Ns.dot(Ha);if(g>=0&&f<=g)return t.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(Ns,a);const m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return Ou.subVectors(r,s),a=(d-u)/(d-u+(f-g)),t.copy(s).addScaledVector(Ou,a);const p=1/(m+_+h);return o=_*p,a=h*p,t.copy(n).addScaledVector(Us,o).addScaledVector(Ns,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Fh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},yo={h:0,s:0,l:0};function Xa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ne{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=nt.workingColorSpace){if(e=bc(e,1),t=Yt(t,0,1),n=Yt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Xa(o,r,e+1/3),this.g=Xa(o,r,e),this.b=Xa(o,r,e-1/3)}return nt.toWorkingColorSpace(this,s),this}setStyle(e,t=Ut){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){const n=Fh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xi(e.r),this.g=xi(e.g),this.b=xi(e.b),this}copyLinearToSRGB(e){return this.r=js(e.r),this.g=js(e.g),this.b=js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return nt.fromWorkingColorSpace(jt.copy(this),e),Math.round(Yt(jt.r*255,0,255))*65536+Math.round(Yt(jt.g*255,0,255))*256+Math.round(Yt(jt.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.fromWorkingColorSpace(jt.copy(this),t);const n=jt.r,s=jt.g,r=jt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=nt.workingColorSpace){return nt.fromWorkingColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Ut){nt.fromWorkingColorSpace(jt.copy(this),e);const t=jt.r,n=jt.g,s=jt.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Pi),this.setHSL(Pi.h+e,Pi.s+t,Pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pi),e.getHSL(yo);const n=Xr(Pi.h,yo.h,t),s=Xr(Pi.s,yo.s,t),r=Xr(Pi.l,yo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const jt=new Ne;Ne.NAMES=Fh;let lm=0;class Gn extends ur{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:lm++}),this.uuid=Hn(),this.name="",this.blending=$s,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=xl,this.blendDst=vl,this.blendEquation=us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=Ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=As,this.stencilZFail=As,this.stencilZPass=As,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==$s&&(n.blending=this.blending),this.side!==Vn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==xl&&(n.blendSrc=this.blendSrc),this.blendDst!==vl&&(n.blendDst=this.blendDst),this.blendEquation!==us&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ks&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==As&&(n.stencilFail=this.stencilFail),this.stencilZFail!==As&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==As&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class un extends Gn{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=pc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Lt=new P,So=new it;class Ct{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=nc,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)So.fromBufferAttribute(this,t),So.applyMatrix3(e),this.setXY(t,So.x,So.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix3(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array),r=pt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==nc&&(e.usage=this.usage),e}}class Oh extends Ct{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Bh extends Ct{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class nn extends Ct{constructor(e,t,n){super(new Float32Array(e),t,n)}}let cm=0;const En=new Xe,$a=new Tt,Fs=new P,mn=new Rn,Ir=new Rn,zt=new P;class hn extends ur{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cm++}),this.uuid=Hn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Dh(e)?Bh:Oh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return En.makeRotationFromQuaternion(e),this.applyMatrix4(En),this}rotateX(e){return En.makeRotationX(e),this.applyMatrix4(En),this}rotateY(e){return En.makeRotationY(e),this.applyMatrix4(En),this}rotateZ(e){return En.makeRotationZ(e),this.applyMatrix4(En),this}translate(e,t,n){return En.makeTranslation(e,t,n),this.applyMatrix4(En),this}scale(e,t,n){return En.makeScale(e,t,n),this.applyMatrix4(En),this}lookAt(e){return $a.lookAt(e),$a.updateMatrix(),this.applyMatrix4($a.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fs).negate(),this.translate(Fs.x,Fs.y,Fs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new nn(n,3))}else{for(let n=0,s=t.count;n<s;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(zt.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(zt),zt.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(zt)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Ir.setFromBufferAttribute(a),this.morphTargetsRelative?(zt.addVectors(mn.min,Ir.min),mn.expandByPoint(zt),zt.addVectors(mn.max,Ir.max),mn.expandByPoint(zt)):(mn.expandByPoint(Ir.min),mn.expandByPoint(Ir.max))}mn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)zt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(zt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)zt.fromBufferAttribute(a,c),l&&(Fs.fromBufferAttribute(e,c),zt.add(Fs)),s=Math.max(s,n.distanceToSquared(zt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ct(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new P,l[C]=new P;const c=new P,u=new P,d=new P,h=new it,f=new it,g=new it,_=new P,m=new P;function p(C,b,y){c.fromBufferAttribute(n,C),u.fromBufferAttribute(n,b),d.fromBufferAttribute(n,y),h.fromBufferAttribute(r,C),f.fromBufferAttribute(r,b),g.fromBufferAttribute(r,y),u.sub(c),d.sub(c),f.sub(h),g.sub(h);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(I),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(I),a[C].add(_),a[b].add(_),a[y].add(_),l[C].add(m),l[b].add(m),l[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let C=0,b=S.length;C<b;++C){const y=S[C],I=y.start,Y=y.count;for(let V=I,q=I+Y;V<q;V+=3)p(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const v=new P,x=new P,R=new P,A=new P;function w(C){R.fromBufferAttribute(s,C),A.copy(R);const b=a[C];v.copy(b),v.sub(R.multiplyScalar(R.dot(b))).normalize(),x.crossVectors(A,b);const I=x.dot(l[C])<0?-1:1;o.setXYZW(C,v.x,v.y,v.z,I)}for(let C=0,b=S.length;C<b;++C){const y=S[C],I=y.start,Y=y.count;for(let V=I,q=I+Y;V<q;V+=3)w(e.getX(V+0)),w(e.getX(V+1)),w(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ct(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,u=new P,d=new P;if(e)for(let h=0,f=e.count;h<f;h+=3){const g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)zt.fromBufferAttribute(e,t),zt.normalize(),e.setXYZ(t,zt.x,zt.y,zt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let p=0;p<u;p++)h[g++]=c[f++]}return new Ct(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new hn,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){const h=c[u],f=e(h,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bu=new Xe,ns=new Jr,bo=new ti,zu=new P,Eo=new P,To=new P,Ao=new P,qa=new P,wo=new P,ku=new P,Ro=new P;class bt extends Tt{constructor(e=new hn,t=new un){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){wo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],d=r[l];u!==0&&(qa.fromBufferAttribute(d,e),o?wo.addScaledVector(qa,u):wo.addScaledVector(qa.sub(t),u))}t.add(wo)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bo.copy(n.boundingSphere),bo.applyMatrix4(r),ns.copy(e.ray).recast(e.near),!(bo.containsPoint(ns.origin)===!1&&(ns.intersectSphere(bo,zu)===null||ns.origin.distanceToSquared(zu)>(e.far-e.near)**2))&&(Bu.copy(r).invert(),ns.copy(e.ray).applyMatrix4(Bu),!(n.boundingBox!==null&&ns.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ns)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),v=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=S,R=v;x<R;x+=3){const A=a.getX(x),w=a.getX(x+1),C=a.getX(x+2);s=Co(this,p,e,n,c,u,d,A,w,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const S=a.getX(m),v=a.getX(m+1),x=a.getX(m+2);s=Co(this,o,e,n,c,u,d,S,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),v=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=S,R=v;x<R;x+=3){const A=x,w=x+1,C=x+2;s=Co(this,p,e,n,c,u,d,A,w,C),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const S=m,v=m+1,x=m+2;s=Co(this,o,e,n,c,u,d,S,v,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function um(i,e,t,n,s,r,o,a){let l;if(e.side===dn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Vn,a),l===null)return null;Ro.copy(a),Ro.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ro);return c<t.near||c>t.far?null:{distance:c,point:Ro.clone(),object:i}}function Co(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Eo),i.getVertexPosition(l,To),i.getVertexPosition(c,Ao);const u=um(i,e,t,n,Eo,To,Ao,ku);if(u){const d=new P;zn.getBarycoord(ku,Eo,To,Ao,d),s&&(u.uv=zn.getInterpolatedAttribute(s,a,l,c,d,new it)),r&&(u.uv1=zn.getInterpolatedAttribute(r,a,l,c,d,new it)),o&&(u.normal=zn.getInterpolatedAttribute(o,a,l,c,d,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new P,materialIndex:0};zn.getNormal(Eo,To,Ao,h.normal),u.face=h,u.barycoord=d}return u}class xn extends hn{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],d=[];let h=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new nn(c,3)),this.setAttribute("normal",new nn(u,3)),this.setAttribute("uv",new nn(d,2));function g(_,m,p,S,v,x,R,A,w,C,b){const y=x/w,I=R/C,Y=x/2,V=R/2,q=A/2,z=w+1,U=C+1;let $=0,G=0;const te=new P;for(let re=0;re<U;re++){const he=re*I-V;for(let ve=0;ve<z;ve++){const Me=ve*y-Y;te[_]=Me*S,te[m]=he*v,te[p]=q,c.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[p]=A>0?1:-1,u.push(te.x,te.y,te.z),d.push(ve/w),d.push(1-re/C),$+=1}}for(let re=0;re<C;re++)for(let he=0;he<w;he++){const ve=h+he+z*re,Me=h+he+z*(re+1),O=h+(he+1)+z*(re+1),Z=h+(he+1)+z*re;l.push(ve,Me,Z),l.push(Me,O,Z),G+=6}a.addGroup(f,G,b),f+=G,h+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ir(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function en(i){const e={};for(let t=0;t<i.length;t++){const n=ir(i[t]);for(const s in n)e[s]=n[s]}return e}function dm(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function zh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const hm={clone:ir,merge:en};var fm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class $i extends Gn{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fm,this.fragmentShader=pm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ir(e.uniforms),this.uniformsGroups=dm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class kh extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=_i}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ii=new P,Hu=new it,Gu=new it;class sn extends kh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=nr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Wr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return nr*2*Math.atan(Math.tan(Wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z),Ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z)}getViewSize(e,t){return this.getViewBounds(e,Hu,Gu),t.subVectors(Gu,Hu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Wr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Os=-90,Bs=1;class mm extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Os,Bs,e,t);s.layers=this.layers,this.add(s);const r=new sn(Os,Bs,e,t);r.layers=this.layers,this.add(r);const o=new sn(Os,Bs,e,t);o.layers=this.layers,this.add(o);const a=new sn(Os,Bs,e,t);a.layers=this.layers,this.add(a);const l=new sn(Os,Bs,e,t);l.layers=this.layers,this.add(l);const c=new sn(Os,Bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===_i)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===sa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Hh extends Ft{constructor(e,t,n,s,r,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Zs,super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class gm extends ms{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Hh(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:vn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new xn(5,5,5),r=new $i({name:"CubemapFromEquirect",uniforms:ir(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:Wi});r.uniforms.tEquirect.value=t;const o=new bt(s,r),a=t.minFilter;return t.minFilter===An&&(t.minFilter=vn),new mm(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}const ja=new P,_m=new P,xm=new Ye;class ls{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=ja.subVectors(n,t).cross(_m.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ja),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||xm.getNormalMatrix(e),s=this.coplanarPoint(ja).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const is=new ti,Lo=new P;class Tc{constructor(e=new ls,t=new ls,n=new ls,s=new ls,r=new ls,o=new ls){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=_i){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],d=s[6],h=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],S=s[13],v=s[14],x=s[15];if(n[0].setComponents(l-r,h-c,m-f,x-p).normalize(),n[1].setComponents(l+r,h+c,m+f,x+p).normalize(),n[2].setComponents(l+o,h+u,m+g,x+S).normalize(),n[3].setComponents(l-o,h-u,m-g,x-S).normalize(),n[4].setComponents(l-a,h-d,m-_,x-v).normalize(),t===_i)n[5].setComponents(l+a,h+d,m+_,x+v).normalize();else if(t===sa)n[5].setComponents(a,d,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),is.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){return is.center.set(0,0,0),is.radius=.7071067811865476,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Lo.x=s.normal.x>0?e.max.x:e.min.x,Lo.y=s.normal.y>0?e.max.y:e.min.y,Lo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Lo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Gh(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function vm(i){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const u=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){const g=d[h],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,d[h]=_)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){const _=d[f];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class Wn extends hn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,d=e/a,h=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const S=p*h-o;for(let v=0;v<c;v++){const x=v*d-r;g.push(x,-S,0),_.push(0,0,1),m.push(v/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<a;S++){const v=S+c*p,x=S+c*(p+1),R=S+1+c*(p+1),A=S+1+c*p;f.push(v,x,A),f.push(x,R,A)}this.setIndex(f),this.setAttribute("position",new nn(g,3)),this.setAttribute("normal",new nn(_,3)),this.setAttribute("uv",new nn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wn(e.width,e.height,e.widthSegments,e.heightSegments)}}var Mm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ym=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Sm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Em=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Am=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,wm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Cm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Im=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Dm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Um=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,km=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Vm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,$m=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ym=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Km="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Qm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,e0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,t0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,n0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,i0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,s0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,r0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,o0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,a0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,l0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,c0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,u0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,d0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,h0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,f0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,p0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,m0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,g0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,x0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,v0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,M0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,y0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,S0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,b0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,E0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,T0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,A0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,w0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,R0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,C0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,L0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,P0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,I0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,D0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,U0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,N0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,F0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,O0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,B0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,z0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,k0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,H0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,G0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,V0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,W0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,X0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,q0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,j0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Y0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,K0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Z0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,J0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Q0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,eg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ng=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ig=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,rg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,og=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ag=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ug=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,fg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ag=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,wg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Rg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ig=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Dg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ug=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ng=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Og=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Bg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,kg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Hg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Wg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$g=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,jg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Kg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Jg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ke={alphahash_fragment:Mm,alphahash_pars_fragment:ym,alphamap_fragment:Sm,alphamap_pars_fragment:bm,alphatest_fragment:Em,alphatest_pars_fragment:Tm,aomap_fragment:Am,aomap_pars_fragment:wm,batching_pars_vertex:Rm,batching_vertex:Cm,begin_vertex:Lm,beginnormal_vertex:Pm,bsdfs:Im,iridescence_fragment:Dm,bumpmap_pars_fragment:Um,clipping_planes_fragment:Nm,clipping_planes_pars_fragment:Fm,clipping_planes_pars_vertex:Om,clipping_planes_vertex:Bm,color_fragment:zm,color_pars_fragment:km,color_pars_vertex:Hm,color_vertex:Gm,common:Vm,cube_uv_reflection_fragment:Wm,defaultnormal_vertex:Xm,displacementmap_pars_vertex:$m,displacementmap_vertex:qm,emissivemap_fragment:jm,emissivemap_pars_fragment:Ym,colorspace_fragment:Km,colorspace_pars_fragment:Zm,envmap_fragment:Jm,envmap_common_pars_fragment:Qm,envmap_pars_fragment:e0,envmap_pars_vertex:t0,envmap_physical_pars_fragment:h0,envmap_vertex:n0,fog_vertex:i0,fog_pars_vertex:s0,fog_fragment:r0,fog_pars_fragment:o0,gradientmap_pars_fragment:a0,lightmap_pars_fragment:l0,lights_lambert_fragment:c0,lights_lambert_pars_fragment:u0,lights_pars_begin:d0,lights_toon_fragment:f0,lights_toon_pars_fragment:p0,lights_phong_fragment:m0,lights_phong_pars_fragment:g0,lights_physical_fragment:_0,lights_physical_pars_fragment:x0,lights_fragment_begin:v0,lights_fragment_maps:M0,lights_fragment_end:y0,logdepthbuf_fragment:S0,logdepthbuf_pars_fragment:b0,logdepthbuf_pars_vertex:E0,logdepthbuf_vertex:T0,map_fragment:A0,map_pars_fragment:w0,map_particle_fragment:R0,map_particle_pars_fragment:C0,metalnessmap_fragment:L0,metalnessmap_pars_fragment:P0,morphinstance_vertex:I0,morphcolor_vertex:D0,morphnormal_vertex:U0,morphtarget_pars_vertex:N0,morphtarget_vertex:F0,normal_fragment_begin:O0,normal_fragment_maps:B0,normal_pars_fragment:z0,normal_pars_vertex:k0,normal_vertex:H0,normalmap_pars_fragment:G0,clearcoat_normal_fragment_begin:V0,clearcoat_normal_fragment_maps:W0,clearcoat_pars_fragment:X0,iridescence_pars_fragment:$0,opaque_fragment:q0,packing:j0,premultiplied_alpha_fragment:Y0,project_vertex:K0,dithering_fragment:Z0,dithering_pars_fragment:J0,roughnessmap_fragment:Q0,roughnessmap_pars_fragment:eg,shadowmap_pars_fragment:tg,shadowmap_pars_vertex:ng,shadowmap_vertex:ig,shadowmask_pars_fragment:sg,skinbase_vertex:rg,skinning_pars_vertex:og,skinning_vertex:ag,skinnormal_vertex:lg,specularmap_fragment:cg,specularmap_pars_fragment:ug,tonemapping_fragment:dg,tonemapping_pars_fragment:hg,transmission_fragment:fg,transmission_pars_fragment:pg,uv_pars_fragment:mg,uv_pars_vertex:gg,uv_vertex:_g,worldpos_vertex:xg,background_vert:vg,background_frag:Mg,backgroundCube_vert:yg,backgroundCube_frag:Sg,cube_vert:bg,cube_frag:Eg,depth_vert:Tg,depth_frag:Ag,distanceRGBA_vert:wg,distanceRGBA_frag:Rg,equirect_vert:Cg,equirect_frag:Lg,linedashed_vert:Pg,linedashed_frag:Ig,meshbasic_vert:Dg,meshbasic_frag:Ug,meshlambert_vert:Ng,meshlambert_frag:Fg,meshmatcap_vert:Og,meshmatcap_frag:Bg,meshnormal_vert:zg,meshnormal_frag:kg,meshphong_vert:Hg,meshphong_frag:Gg,meshphysical_vert:Vg,meshphysical_frag:Wg,meshtoon_vert:Xg,meshtoon_frag:$g,points_vert:qg,points_frag:jg,shadow_vert:Yg,shadow_frag:Kg,sprite_vert:Zg,sprite_frag:Jg},_e={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new it(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new it(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Jn={basic:{uniforms:en([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:en([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:en([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:en([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:en([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:en([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:en([_e.points,_e.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:en([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:en([_e.common,_e.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:en([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:en([_e.sprite,_e.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distanceRGBA:{uniforms:en([_e.common,_e.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distanceRGBA_vert,fragmentShader:Ke.distanceRGBA_frag},shadow:{uniforms:en([_e.lights,_e.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};Jn.physical={uniforms:en([Jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new it(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new it},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new it},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const Po={r:0,b:0,g:0},ss=new Cn,Qg=new Xe;function e_(i,e,t,n,s,r,o){const a=new Ne(0);let l=r===!0?0:1,c,u,d=null,h=0,f=null;function g(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?t:e).get(v)),v}function _(S){let v=!1;const x=g(S);x===null?p(a,l):x&&x.isColor&&(p(x,1),v=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(S,v){const x=g(v);x&&(x.isCubeTexture||x.mapping===da)?(u===void 0&&(u=new bt(new xn(1,1,1),new $i({name:"BackgroundCubeMaterial",uniforms:ir(Jn.backgroundCube.uniforms),vertexShader:Jn.backgroundCube.vertexShader,fragmentShader:Jn.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,A,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),ss.copy(v.backgroundRotation),ss.x*=-1,ss.y*=-1,ss.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ss.y*=-1,ss.z*=-1),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Qg.makeRotationFromEuler(ss)),u.material.toneMapped=nt.getTransfer(x.colorSpace)!==_t,(d!==x||h!==x.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,d=x,h=x.version,f=i.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new bt(new Wn(2,2),new $i({name:"BackgroundMaterial",uniforms:ir(Jn.background.uniforms),vertexShader:Jn.background.vertexShader,fragmentShader:Jn.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=nt.getTransfer(x.colorSpace)!==_t,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||h!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=x,h=x.version,f=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,v){S.getRGB(Po,zh(i)),n.buffers.color.setClear(Po.r,Po.g,Po.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(S,v=1){a.set(S),l=v,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(a,l)},render:_,addToRenderList:m}}function t_(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null);let r=s,o=!1;function a(y,I,Y,V,q){let z=!1;const U=d(V,Y,I);r!==U&&(r=U,c(r.object)),z=f(y,V,Y,q),z&&g(y,V,Y,q),q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,x(y,I,Y,V),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function u(y){return i.deleteVertexArray(y)}function d(y,I,Y){const V=Y.wireframe===!0;let q=n[y.id];q===void 0&&(q={},n[y.id]=q);let z=q[I.id];z===void 0&&(z={},q[I.id]=z);let U=z[V];return U===void 0&&(U=h(l()),z[V]=U),U}function h(y){const I=[],Y=[],V=[];for(let q=0;q<t;q++)I[q]=0,Y[q]=0,V[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:Y,attributeDivisors:V,object:y,attributes:{},index:null}}function f(y,I,Y,V){const q=r.attributes,z=I.attributes;let U=0;const $=Y.getAttributes();for(const G in $)if($[G].location>=0){const re=q[G];let he=z[G];if(he===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(he=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(he=y.instanceColor)),re===void 0||re.attribute!==he||he&&re.data!==he.data)return!0;U++}return r.attributesNum!==U||r.index!==V}function g(y,I,Y,V){const q={},z=I.attributes;let U=0;const $=Y.getAttributes();for(const G in $)if($[G].location>=0){let re=z[G];re===void 0&&(G==="instanceMatrix"&&y.instanceMatrix&&(re=y.instanceMatrix),G==="instanceColor"&&y.instanceColor&&(re=y.instanceColor));const he={};he.attribute=re,re&&re.data&&(he.data=re.data),q[G]=he,U++}r.attributes=q,r.attributesNum=U,r.index=V}function _(){const y=r.newAttributes;for(let I=0,Y=y.length;I<Y;I++)y[I]=0}function m(y){p(y,0)}function p(y,I){const Y=r.newAttributes,V=r.enabledAttributes,q=r.attributeDivisors;Y[y]=1,V[y]===0&&(i.enableVertexAttribArray(y),V[y]=1),q[y]!==I&&(i.vertexAttribDivisor(y,I),q[y]=I)}function S(){const y=r.newAttributes,I=r.enabledAttributes;for(let Y=0,V=I.length;Y<V;Y++)I[Y]!==y[Y]&&(i.disableVertexAttribArray(Y),I[Y]=0)}function v(y,I,Y,V,q,z,U){U===!0?i.vertexAttribIPointer(y,I,Y,q,z):i.vertexAttribPointer(y,I,Y,V,q,z)}function x(y,I,Y,V){_();const q=V.attributes,z=Y.getAttributes(),U=I.defaultAttributeValues;for(const $ in z){const G=z[$];if(G.location>=0){let te=q[$];if(te===void 0&&($==="instanceMatrix"&&y.instanceMatrix&&(te=y.instanceMatrix),$==="instanceColor"&&y.instanceColor&&(te=y.instanceColor)),te!==void 0){const re=te.normalized,he=te.itemSize,ve=e.get(te);if(ve===void 0)continue;const Me=ve.buffer,O=ve.type,Z=ve.bytesPerElement,ae=O===i.INT||O===i.UNSIGNED_INT||te.gpuType===mc;if(te.isInterleavedBufferAttribute){const ue=te.data,ie=ue.stride,Pe=te.offset;if(ue.isInstancedInterleavedBuffer){for(let He=0;He<G.locationSize;He++)p(G.location+He,ue.meshPerAttribute);y.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let He=0;He<G.locationSize;He++)m(G.location+He);i.bindBuffer(i.ARRAY_BUFFER,Me);for(let He=0;He<G.locationSize;He++)v(G.location+He,he/G.locationSize,O,re,ie*Z,(Pe+he/G.locationSize*He)*Z,ae)}else{if(te.isInstancedBufferAttribute){for(let ue=0;ue<G.locationSize;ue++)p(G.location+ue,te.meshPerAttribute);y.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ue=0;ue<G.locationSize;ue++)m(G.location+ue);i.bindBuffer(i.ARRAY_BUFFER,Me);for(let ue=0;ue<G.locationSize;ue++)v(G.location+ue,he/G.locationSize,O,re,he*Z,he/G.locationSize*ue*Z,ae)}}else if(U!==void 0){const re=U[$];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(G.location,re);break;case 3:i.vertexAttrib3fv(G.location,re);break;case 4:i.vertexAttrib4fv(G.location,re);break;default:i.vertexAttrib1fv(G.location,re)}}}}S()}function R(){C();for(const y in n){const I=n[y];for(const Y in I){const V=I[Y];for(const q in V)u(V[q].object),delete V[q];delete I[Y]}delete n[y]}}function A(y){if(n[y.id]===void 0)return;const I=n[y.id];for(const Y in I){const V=I[Y];for(const q in V)u(V[q].object),delete V[q];delete I[Y]}delete n[y.id]}function w(y){for(const I in n){const Y=n[I];if(Y[y.id]===void 0)continue;const V=Y[y.id];for(const q in V)u(V[q].object),delete V[q];delete Y[y.id]}}function C(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function n_(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,d){d!==0&&(i.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function a(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,d);let f=0;for(let g=0;g<d;g++)f+=u[g];t.update(f,n,1)}function l(c,u,d,h){if(d===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],h[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,h,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_]*h[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function i_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==wn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const C=w===Zr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==yi&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==kn&&!C)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:R,maxSamples:A}}function s_(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new ls,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const S=r?0:n,v=S*4;let x=p.clippingState||null;l.value=x,x=u(g,h,v,f);for(let R=0;R!==v;++R)x[R]=t[R];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,x=f;v!==_;++v,x+=4)o.copy(d[v]).applyMatrix4(S,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function r_(i){let e=new WeakMap;function t(o,a){return a===wl?o.mapping=Zs:a===Rl&&(o.mapping=Js),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===wl||a===Rl)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new gm(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Ac extends kh{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Vs=4,Vu=[.125,.215,.35,.446,.526,.582],ds=20,Ya=new Ac,Wu=new Ne;let Ka=null,Za=0,Ja=0,Qa=!1;const cs=(1+Math.sqrt(5))/2,zs=1/cs,Xu=[new P(-cs,zs,0),new P(cs,zs,0),new P(-zs,0,cs),new P(zs,0,cs),new P(0,cs,-zs),new P(0,cs,zs),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class $u{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Ka=this._renderer.getRenderTarget(),Za=this._renderer.getActiveCubeFace(),Ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ju(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ka,Za,Ja),this._renderer.xr.enabled=Qa,e.scissorTest=!1,Io(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Zs||e.mapping===Js?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ka=this._renderer.getRenderTarget(),Za=this._renderer.getActiveCubeFace(),Ja=this._renderer.getActiveMipmapLevel(),Qa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:vn,minFilter:vn,generateMipmaps:!1,type:Zr,format:wn,colorSpace:rn,depthBuffer:!1},s=qu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qu(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=o_(r)),this._blurMaterial=a_(r,e,t)}return s}_compileMaterial(e){const t=new bt(this._lodPlanes[0],e);this._renderer.compile(t,Ya)}_sceneToCubeUV(e,t,n,s){const a=new sn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,h=u.toneMapping;u.getClearColor(Wu),u.toneMapping=Xi,u.autoClear=!1;const f=new un({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1}),g=new bt(new xn,f);let _=!1;const m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,_=!0):(f.color.copy(Wu),_=!0);for(let p=0;p<6;p++){const S=p%3;S===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):S===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const v=this._cubeSize;Io(s,S*v,p>2?v:0,v,v),u.setRenderTarget(s),_&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=d,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Zs||e.mapping===Js;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ju());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new bt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;Io(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Ya)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Xu[(s-r-1)%Xu.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new bt(this._lodPlanes[s],c),h=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ds-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):ds;m>ds&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ds}`);const p=[];let S=0;for(let w=0;w<ds;++w){const C=w/_,b=Math.exp(-C*C/2);p.push(b),w===0?S+=b:w<m&&(S+=2*b)}for(let w=0;w<p.length;w++)p[w]=p[w]/S;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:v}=this;h.dTheta.value=g,h.mipInt.value=v-n;const x=this._sizeLods[s],R=3*x*(s>v-Vs?s-v+Vs:0),A=4*(this._cubeSize-x);Io(t,R,A,3*x,2*x),l.setRenderTarget(t),l.render(d,Ya)}}function o_(i){const e=[],t=[],n=[];let s=i;const r=i-Vs+1+Vu.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Vs?l=Vu[o-i+Vs-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],f=6,g=6,_=3,m=2,p=1,S=new Float32Array(_*g*f),v=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let A=0;A<f;A++){const w=A%3*2/3-1,C=A>2?0:-1,b=[w,C,0,w+2/3,C,0,w+2/3,C+1,0,w,C,0,w+2/3,C+1,0,w,C+1,0];S.set(b,_*g*A),v.set(h,m*g*A);const y=[A,A,A,A,A,A];x.set(y,p*g*A)}const R=new hn;R.setAttribute("position",new Ct(S,_)),R.setAttribute("uv",new Ct(v,m)),R.setAttribute("faceIndex",new Ct(x,p)),e.push(R),s>Vs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function qu(i,e,t){const n=new ms(i,e,t);return n.texture.mapping=da,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Io(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function a_(i,e,t){const n=new Float32Array(ds),s=new P(0,1,0);return new $i({name:"SphericalGaussianBlur",defines:{n:ds,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:wc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function ju(){return new $i({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function Yu(){return new $i({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function wc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function l_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===wl||l===Rl,u=l===Zs||l===Js;if(c||u){let d=e.get(a);const h=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new $u(i)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&s(f)?(t===null&&(t=new $u(i)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function c_(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&kr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function u_(i,e,t,n){const s={},r=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)e.remove(_[m])}h.removeEventListener("dispose",o),delete s[h.id];const f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const g in h)e.update(h[g],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)e.update(_[m],i.ARRAY_BUFFER)}}function c(d){const h=[],f=d.index,g=d.attributes.position;let _=0;if(f!==null){const S=f.array;_=f.version;for(let v=0,x=S.length;v<x;v+=3){const R=S[v+0],A=S[v+1],w=S[v+2];h.push(R,A,A,w,w,R)}}else if(g!==void 0){const S=g.array;_=g.version;for(let v=0,x=S.length/3-1;v<x;v+=3){const R=v+0,A=v+1,w=v+2;h.push(R,A,A,w,w,R)}}else return;const m=new(Dh(h)?Bh:Oh)(h,1);m.version=_;const p=r.get(d);p&&e.remove(p),r.set(d,m)}function u(d){const h=r.get(d);if(h){const f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function d_(i,e,t){let n;function s(h){n=h}let r,o;function a(h){r=h.type,o=h.bytesPerElement}function l(h,f){i.drawElements(n,f,r,h*o),t.update(f,n,1)}function c(h,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,h*o,g),t.update(f,n,g))}function u(h,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,h,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function d(h,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,h,0,_,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S]*_[S];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function h_(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function f_(i,e,t){const n=new WeakMap,s=new ut;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=n.get(a);if(h===void 0||h.count!==d){let b=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",b)};h!==void 0&&h.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let v=0;f===!0&&(v=1),g===!0&&(v=2),_===!0&&(v=3);let x=a.attributes.position.count*v,R=1;x>e.maxTextureSize&&(R=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const A=new Float32Array(x*R*4*d),w=new Nh(A,x,R,d);w.type=kn,w.needsUpdate=!0;const C=v*4;for(let y=0;y<d;y++){const I=m[y],Y=p[y],V=S[y],q=x*R*4*y;for(let z=0;z<I.count;z++){const U=z*C;f===!0&&(s.fromBufferAttribute(I,z),A[q+U+0]=s.x,A[q+U+1]=s.y,A[q+U+2]=s.z,A[q+U+3]=0),g===!0&&(s.fromBufferAttribute(Y,z),A[q+U+4]=s.x,A[q+U+5]=s.y,A[q+U+6]=s.z,A[q+U+7]=0),_===!0&&(s.fromBufferAttribute(V,z),A[q+U+8]=s.x,A[q+U+9]=s.y,A[q+U+10]=s.z,A[q+U+11]=V.itemSize===4?s.w:1)}}h={count:d,texture:w,size:new it(x,R)},n.set(a,h),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];const g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function p_(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,d=e.get(l,u);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class Vh extends Ft{constructor(e,t,n,s,r,o,a,l,c,u=qs){if(u!==qs&&u!==tr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===qs&&(n=ps),n===void 0&&u===tr&&(n=er),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Gt,this.minFilter=l!==void 0?l:Gt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Wh=new Ft,Ku=new Vh(1,1),Xh=new Nh,$h=new em,qh=new Hh,Zu=[],Ju=[],Qu=new Float32Array(16),ed=new Float32Array(9),td=new Float32Array(4);function dr(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Zu[s];if(r===void 0&&(r=new Float32Array(s),Zu[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Ot(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Bt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function fa(i,e){let t=Ju[e];t===void 0&&(t=new Int32Array(e),Ju[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function m_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function g_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;i.uniform2fv(this.addr,e),Bt(t,e)}}function __(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ot(t,e))return;i.uniform3fv(this.addr,e),Bt(t,e)}}function x_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;i.uniform4fv(this.addr,e),Bt(t,e)}}function v_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,n))return;td.set(n),i.uniformMatrix2fv(this.addr,!1,td),Bt(t,n)}}function M_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,n))return;ed.set(n),i.uniformMatrix3fv(this.addr,!1,ed),Bt(t,n)}}function y_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ot(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,n))return;Qu.set(n),i.uniformMatrix4fv(this.addr,!1,Qu),Bt(t,n)}}function S_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function b_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;i.uniform2iv(this.addr,e),Bt(t,e)}}function E_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;i.uniform3iv(this.addr,e),Bt(t,e)}}function T_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;i.uniform4iv(this.addr,e),Bt(t,e)}}function A_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function w_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;i.uniform2uiv(this.addr,e),Bt(t,e)}}function R_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;i.uniform3uiv(this.addr,e),Bt(t,e)}}function C_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;i.uniform4uiv(this.addr,e),Bt(t,e)}}function L_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ku.compareFunction=Ih,r=Ku):r=Wh,t.setTexture2D(e||r,s)}function P_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||$h,s)}function I_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||qh,s)}function D_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Xh,s)}function U_(i){switch(i){case 5126:return m_;case 35664:return g_;case 35665:return __;case 35666:return x_;case 35674:return v_;case 35675:return M_;case 35676:return y_;case 5124:case 35670:return S_;case 35667:case 35671:return b_;case 35668:case 35672:return E_;case 35669:case 35673:return T_;case 5125:return A_;case 36294:return w_;case 36295:return R_;case 36296:return C_;case 35678:case 36198:case 36298:case 36306:case 35682:return L_;case 35679:case 36299:case 36307:return P_;case 35680:case 36300:case 36308:case 36293:return I_;case 36289:case 36303:case 36311:case 36292:return D_}}function N_(i,e){i.uniform1fv(this.addr,e)}function F_(i,e){const t=dr(e,this.size,2);i.uniform2fv(this.addr,t)}function O_(i,e){const t=dr(e,this.size,3);i.uniform3fv(this.addr,t)}function B_(i,e){const t=dr(e,this.size,4);i.uniform4fv(this.addr,t)}function z_(i,e){const t=dr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function k_(i,e){const t=dr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function H_(i,e){const t=dr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function G_(i,e){i.uniform1iv(this.addr,e)}function V_(i,e){i.uniform2iv(this.addr,e)}function W_(i,e){i.uniform3iv(this.addr,e)}function X_(i,e){i.uniform4iv(this.addr,e)}function $_(i,e){i.uniform1uiv(this.addr,e)}function q_(i,e){i.uniform2uiv(this.addr,e)}function j_(i,e){i.uniform3uiv(this.addr,e)}function Y_(i,e){i.uniform4uiv(this.addr,e)}function K_(i,e,t){const n=this.cache,s=e.length,r=fa(t,s);Ot(n,r)||(i.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Wh,r[o])}function Z_(i,e,t){const n=this.cache,s=e.length,r=fa(t,s);Ot(n,r)||(i.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||$h,r[o])}function J_(i,e,t){const n=this.cache,s=e.length,r=fa(t,s);Ot(n,r)||(i.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||qh,r[o])}function Q_(i,e,t){const n=this.cache,s=e.length,r=fa(t,s);Ot(n,r)||(i.uniform1iv(this.addr,r),Bt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Xh,r[o])}function ex(i){switch(i){case 5126:return N_;case 35664:return F_;case 35665:return O_;case 35666:return B_;case 35674:return z_;case 35675:return k_;case 35676:return H_;case 5124:case 35670:return G_;case 35667:case 35671:return V_;case 35668:case 35672:return W_;case 35669:case 35673:return X_;case 5125:return $_;case 36294:return q_;case 36295:return j_;case 36296:return Y_;case 35678:case 36198:case 36298:case 36306:case 35682:return K_;case 35679:case 36299:case 36307:return Z_;case 35680:case 36300:case 36308:case 36293:return J_;case 36289:case 36303:case 36311:case 36292:return Q_}}class tx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=U_(t.type)}}class nx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ex(t.type)}}class ix{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const el=/(\w+)(\])?(\[|\.)?/g;function nd(i,e){i.seq.push(e),i.map[e.id]=e}function sx(i,e,t){const n=i.name,s=n.length;for(el.lastIndex=0;;){const r=el.exec(n),o=el.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){nd(t,c===void 0?new tx(a,i,e):new nx(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new ix(a),nd(t,d)),t=d}}}class ea{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);sx(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function id(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const rx=37297;let ox=0;function ax(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const sd=new Ye;function lx(i){nt._getMatrix(sd,nt.workingColorSpace,i);const e=`mat3( ${sd.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(i)){case ha:return[e,"LinearTransferOETF"];case _t:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function rd(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+ax(i.getShaderSource(e),o)}else return s}function cx(i,e){const t=lx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function ux(i,e){let t;switch(e){case up:t="Linear";break;case dp:t="Reinhard";break;case hp:t="Cineon";break;case vh:t="ACESFilmic";break;case pp:t="AgX";break;case mp:t="Neutral";break;case fp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Do=new P;function dx(){nt.getLuminanceCoefficients(Do);const i=Do.x.toFixed(4),e=Do.y.toFixed(4),t=Do.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hr).join(`
`)}function fx(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function px(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Hr(i){return i!==""}function od(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ad(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const mx=/^[ \t]*#include +<([\w\d./]+)>/gm;function ic(i){return i.replace(mx,_x)}const gx=new Map;function _x(i,e){let t=Ke[e];if(t===void 0){const n=gx.get(e);if(n!==void 0)t=Ke[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ic(t)}const xx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ld(i){return i.replace(xx,vx)}function vx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function cd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Mx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===_h?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===xh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===pi&&(e="SHADOWMAP_TYPE_VSM"),e}function yx(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Zs:case Js:e="ENVMAP_TYPE_CUBE";break;case da:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Sx(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Js:e="ENVMAP_MODE_REFRACTION";break}return e}function bx(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case pc:e="ENVMAP_BLENDING_MULTIPLY";break;case lp:e="ENVMAP_BLENDING_MIX";break;case cp:e="ENVMAP_BLENDING_ADD";break}return e}function Ex(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Tx(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Mx(t),c=yx(t),u=Sx(t),d=bx(t),h=Ex(t),f=hx(t),g=fx(r),_=s.createProgram();let m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Hr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Hr).join(`
`),p.length>0&&(p+=`
`)):(m=[cd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hr).join(`
`),p=[cd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Xi?"#define TONE_MAPPING":"",t.toneMapping!==Xi?Ke.tonemapping_pars_fragment:"",t.toneMapping!==Xi?ux("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,cx("linearToOutputTexel",t.outputColorSpace),dx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Hr).join(`
`)),o=ic(o),o=od(o,t),o=ad(o,t),a=ic(a),a=od(a,t),a=ad(a,t),o=ld(o),a=ld(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===yu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===yu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=S+m+o,x=S+p+a,R=id(s,s.VERTEX_SHADER,v),A=id(s,s.FRAGMENT_SHADER,x);s.attachShader(_,R),s.attachShader(_,A),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function w(I){if(i.debug.checkShaderErrors){const Y=s.getProgramInfoLog(_).trim(),V=s.getShaderInfoLog(R).trim(),q=s.getShaderInfoLog(A).trim();let z=!0,U=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,R,A);else{const $=rd(s,R,"vertex"),G=rd(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+Y+`
`+$+`
`+G)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(V===""||q==="")&&(U=!1);U&&(I.diagnostics={runnable:z,programLog:Y,vertexShader:{log:V,prefix:m},fragmentShader:{log:q,prefix:p}})}s.deleteShader(R),s.deleteShader(A),C=new ea(s,_),b=px(s,_)}let C;this.getUniforms=function(){return C===void 0&&w(this),C};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,rx)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ox++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=A,this}let Ax=0;class wx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Rx(e),t.set(e,n)),n}}class Rx{constructor(e){this.id=Ax++,this.code=e,this.usedTimes=0}}function Cx(i,e,t,n,s,r,o){const a=new Ec,l=new wx,c=new Set,u=[],d=s.logarithmicDepthBuffer,h=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,y,I,Y,V){const q=Y.fog,z=V.geometry,U=b.isMeshStandardMaterial?Y.environment:null,$=(b.isMeshStandardMaterial?t:e).get(b.envMap||U),G=$&&$.mapping===da?$.image.height:null,te=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const re=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,he=re!==void 0?re.length:0;let ve=0;z.morphAttributes.position!==void 0&&(ve=1),z.morphAttributes.normal!==void 0&&(ve=2),z.morphAttributes.color!==void 0&&(ve=3);let Me,O,Z,ae;if(te){const de=Jn[te];Me=de.vertexShader,O=de.fragmentShader}else Me=b.vertexShader,O=b.fragmentShader,l.update(b),Z=l.getVertexShaderID(b),ae=l.getFragmentShaderID(b);const ue=i.getRenderTarget(),ie=i.state.buffers.depth.getReversed(),Pe=V.isInstancedMesh===!0,He=V.isBatchedMesh===!0,at=!!b.map,Ze=!!b.matcap,ht=!!$,B=!!b.aoMap,Vt=!!b.lightMap,Qe=!!b.bumpMap,qe=!!b.normalMap,Be=!!b.displacementMap,vt=!!b.emissiveMap,Fe=!!b.metalnessMap,T=!!b.roughnessMap,M=b.anisotropy>0,H=b.clearcoat>0,Q=b.dispersion>0,J=b.iridescence>0,K=b.sheen>0,se=b.transmission>0,me=M&&!!b.anisotropyMap,Ee=H&&!!b.clearcoatMap,Je=H&&!!b.clearcoatNormalMap,oe=H&&!!b.clearcoatRoughnessMap,Ae=J&&!!b.iridescenceMap,Ie=J&&!!b.iridescenceThicknessMap,Oe=K&&!!b.sheenColorMap,ye=K&&!!b.sheenRoughnessMap,je=!!b.specularMap,$e=!!b.specularColorMap,ct=!!b.specularIntensityMap,D=se&&!!b.transmissionMap,fe=se&&!!b.thicknessMap,j=!!b.gradientMap,ee=!!b.alphaMap,xe=b.alphaTest>0,pe=!!b.alphaHash,Ve=!!b.extensions;let et=Xi;b.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(et=i.toneMapping);const Rt={shaderID:te,shaderType:b.type,shaderName:b.name,vertexShader:Me,fragmentShader:O,defines:b.defines,customVertexShaderID:Z,customFragmentShaderID:ae,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:He,batchingColor:He&&V._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&V.instanceColor!==null,instancingMorph:Pe&&V.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ue===null?i.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:rn,alphaToCoverage:!!b.alphaToCoverage,map:at,matcap:Ze,envMap:ht,envMapMode:ht&&$.mapping,envMapCubeUVHeight:G,aoMap:B,lightMap:Vt,bumpMap:Qe,normalMap:qe,displacementMap:h&&Be,emissiveMap:vt,normalMapObjectSpace:qe&&b.normalMapType===yp,normalMapTangentSpace:qe&&b.normalMapType===Sc,metalnessMap:Fe,roughnessMap:T,anisotropy:M,anisotropyMap:me,clearcoat:H,clearcoatMap:Ee,clearcoatNormalMap:Je,clearcoatRoughnessMap:oe,dispersion:Q,iridescence:J,iridescenceMap:Ae,iridescenceThicknessMap:Ie,sheen:K,sheenColorMap:Oe,sheenRoughnessMap:ye,specularMap:je,specularColorMap:$e,specularIntensityMap:ct,transmission:se,transmissionMap:D,thicknessMap:fe,gradientMap:j,opaque:b.transparent===!1&&b.blending===$s&&b.alphaToCoverage===!1,alphaMap:ee,alphaTest:xe,alphaHash:pe,combine:b.combine,mapUv:at&&_(b.map.channel),aoMapUv:B&&_(b.aoMap.channel),lightMapUv:Vt&&_(b.lightMap.channel),bumpMapUv:Qe&&_(b.bumpMap.channel),normalMapUv:qe&&_(b.normalMap.channel),displacementMapUv:Be&&_(b.displacementMap.channel),emissiveMapUv:vt&&_(b.emissiveMap.channel),metalnessMapUv:Fe&&_(b.metalnessMap.channel),roughnessMapUv:T&&_(b.roughnessMap.channel),anisotropyMapUv:me&&_(b.anisotropyMap.channel),clearcoatMapUv:Ee&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Je&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Oe&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ye&&_(b.sheenRoughnessMap.channel),specularMapUv:je&&_(b.specularMap.channel),specularColorMapUv:$e&&_(b.specularColorMap.channel),specularIntensityMapUv:ct&&_(b.specularIntensityMap.channel),transmissionMapUv:D&&_(b.transmissionMap.channel),thicknessMapUv:fe&&_(b.thicknessMap.channel),alphaMapUv:ee&&_(b.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(qe||M),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!z.attributes.uv&&(at||ee),fog:!!q,useFog:b.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:ie,skinning:V.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:ve,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:et,decodeVideoTexture:at&&b.map.isVideoTexture===!0&&nt.getTransfer(b.map.colorSpace)===_t,decodeVideoTextureEmissive:vt&&b.emissiveMap.isVideoTexture===!0&&nt.getTransfer(b.emissiveMap.colorSpace)===_t,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===On,flipSided:b.side===dn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ve&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ve&&b.extensions.multiDraw===!0||He)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Rt.vertexUv1s=c.has(1),Rt.vertexUv2s=c.has(2),Rt.vertexUv3s=c.has(3),c.clear(),Rt}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const I in b.defines)y.push(I),y.push(b.defines[I]);return b.isRawShaderMaterial===!1&&(S(y,b),v(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function S(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function v(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){const y=g[b.type];let I;if(y){const Y=Jn[y];I=hm.clone(Y.uniforms)}else I=b.uniforms;return I}function R(b,y){let I;for(let Y=0,V=u.length;Y<V;Y++){const q=u[Y];if(q.cacheKey===y){I=q,++I.usedTimes;break}}return I===void 0&&(I=new Tx(i,y,b,r),u.push(I)),I}function A(b){if(--b.usedTimes===0){const y=u.indexOf(b);u[y]=u[u.length-1],u.pop(),b.destroy()}}function w(b){l.remove(b)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:R,releaseProgram:A,releaseShaderCache:w,programs:u,dispose:C}}function Lx(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Px(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function ud(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function dd(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,h,f,g,_,m){let p=i[e];return p===void 0?(p={id:d.id,object:d,geometry:h,material:f,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},i[e]=p):(p.id=d.id,p.object=d,p.geometry=h,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=m),e++,p}function a(d,h,f,g,_,m){const p=o(d,h,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(d,h,f,g,_,m){const p=o(d,h,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(d,h){t.length>1&&t.sort(d||Px),n.length>1&&n.sort(h||ud),s.length>1&&s.sort(h||ud)}function u(){for(let d=e,h=i.length;d<h;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function Ix(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new dd,i.set(n,[o])):s>=r.length?(o=new dd,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Dx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Ne};break;case"SpotLight":t={position:new P,direction:new P,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Ux(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new it,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Nx=0;function Fx(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Ox(i){const e=new Dx,t=Ux(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new Xe,o=new Xe;function a(c){let u=0,d=0,h=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,S=0,v=0,x=0,R=0,A=0,w=0;c.sort(Fx);for(let b=0,y=c.length;b<y;b++){const I=c[b],Y=I.color,V=I.intensity,q=I.distance,z=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=Y.r*V,d+=Y.g*V,h+=Y.b*V;else if(I.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(I.sh.coefficients[U],V);w++}else if(I.isDirectionalLight){const U=e.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const $=I.shadow,G=t.get(I);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=I.shadow.matrix,S++}n.directional[f]=U,f++}else if(I.isSpotLight){const U=e.get(I);U.position.setFromMatrixPosition(I.matrixWorld),U.color.copy(Y).multiplyScalar(V),U.distance=q,U.coneCos=Math.cos(I.angle),U.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),U.decay=I.decay,n.spot[_]=U;const $=I.shadow;if(I.map&&(n.spotLightMap[R]=I.map,R++,$.updateMatrices(I),I.castShadow&&A++),n.spotLightMatrix[_]=$.matrix,I.castShadow){const G=t.get(I);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=z,x++}_++}else if(I.isRectAreaLight){const U=e.get(I);U.color.copy(Y).multiplyScalar(V),U.halfWidth.set(I.width*.5,0,0),U.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=U,m++}else if(I.isPointLight){const U=e.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),U.distance=I.distance,U.decay=I.decay,I.castShadow){const $=I.shadow,G=t.get(I);G.shadowIntensity=$.intensity,G.shadowBias=$.bias,G.shadowNormalBias=$.normalBias,G.shadowRadius=$.radius,G.shadowMapSize=$.mapSize,G.shadowCameraNear=$.camera.near,G.shadowCameraFar=$.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=I.shadow.matrix,v++}n.point[g]=U,g++}else if(I.isHemisphereLight){const U=e.get(I);U.skyColor.copy(I.color).multiplyScalar(V),U.groundColor.copy(I.groundColor).multiplyScalar(V),n.hemi[p]=U,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==S||C.numPointShadows!==v||C.numSpotShadows!==x||C.numSpotMaps!==R||C.numLightProbes!==w)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=x+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=w,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=S,C.numPointShadows=v,C.numSpotShadows=x,C.numSpotMaps=R,C.numLightProbes=w,n.version=Nx++)}function l(c,u){let d=0,h=0,f=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const v=c[p];if(v.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),d++}else if(v.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(v.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const x=n.point[h];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),h++}else if(v.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function hd(i){const e=new Ox(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Bx(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new hd(i),e.set(s,[a])):r>=o.length?(a=new hd(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class zx extends Gn{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=vp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class kx extends Gn{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Hx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gx=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Vx(i,e,t){let n=new Tc;const s=new it,r=new it,o=new ut,a=new zx({depthPacking:Mp}),l=new kx,c={},u=t.maxTextureSize,d={[Vn]:dn,[dn]:Vn,[On]:On},h=new $i({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new it},radius:{value:4}},vertexShader:Hx,fragmentShader:Gx}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new hn;g.setAttribute("position",new Ct(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new bt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_h;let p=this.type;this.render=function(A,w,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const b=i.getRenderTarget(),y=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),Y=i.state;Y.setBlending(Wi),Y.buffers.color.setClear(1,1,1,1),Y.buffers.depth.setTest(!0),Y.setScissorTest(!1);const V=p!==pi&&this.type===pi,q=p===pi&&this.type!==pi;for(let z=0,U=A.length;z<U;z++){const $=A[z],G=$.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const te=G.getFrameExtents();if(s.multiply(te),r.copy(G.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/te.x),s.x=r.x*te.x,G.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/te.y),s.y=r.y*te.y,G.mapSize.y=r.y)),G.map===null||V===!0||q===!0){const he=this.type!==pi?{minFilter:Gt,magFilter:Gt}:{};G.map!==null&&G.map.dispose(),G.map=new ms(s.x,s.y,he),G.map.texture.name=$.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();const re=G.getViewportCount();for(let he=0;he<re;he++){const ve=G.getViewport(he);o.set(r.x*ve.x,r.y*ve.y,r.x*ve.z,r.y*ve.w),Y.viewport(o),G.updateMatrices($,he),n=G.getFrustum(),x(w,C,G.camera,$,this.type)}G.isPointLightShadow!==!0&&this.type===pi&&S(G,C),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,y,I)};function S(A,w){const C=e.update(_);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ms(s.x,s.y)),h.uniforms.shadow_pass.value=A.map.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(w,null,C,h,_,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(w,null,C,f,_,null)}function v(A,w,C,b){let y=null;const I=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(I!==void 0)y=I;else if(y=C.isPointLight===!0?l:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const Y=y.uuid,V=w.uuid;let q=c[Y];q===void 0&&(q={},c[Y]=q);let z=q[V];z===void 0&&(z=y.clone(),q[V]=z,w.addEventListener("dispose",R)),y=z}if(y.visible=w.visible,y.wireframe=w.wireframe,b===pi?y.side=w.shadowSide!==null?w.shadowSide:w.side:y.side=w.shadowSide!==null?w.shadowSide:d[w.side],y.alphaMap=w.alphaMap,y.alphaTest=w.alphaTest,y.map=w.map,y.clipShadows=w.clipShadows,y.clippingPlanes=w.clippingPlanes,y.clipIntersection=w.clipIntersection,y.displacementMap=w.displacementMap,y.displacementScale=w.displacementScale,y.displacementBias=w.displacementBias,y.wireframeLinewidth=w.wireframeLinewidth,y.linewidth=w.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const Y=i.properties.get(y);Y.light=C}return y}function x(A,w,C,b,y){if(A.visible===!1)return;if(A.layers.test(w.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===pi)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);const V=e.update(A),q=A.material;if(Array.isArray(q)){const z=V.groups;for(let U=0,$=z.length;U<$;U++){const G=z[U],te=q[G.materialIndex];if(te&&te.visible){const re=v(A,te,b,y);A.onBeforeShadow(i,A,w,C,V,re,G),i.renderBufferDirect(C,null,V,re,A,G),A.onAfterShadow(i,A,w,C,V,re,G)}}}else if(q.visible){const z=v(A,q,b,y);A.onBeforeShadow(i,A,w,C,V,z,null),i.renderBufferDirect(C,null,V,z,A,null),A.onAfterShadow(i,A,w,C,V,z,null)}}const Y=A.children;for(let V=0,q=Y.length;V<q;V++)x(Y[V],w,C,b,y)}function R(A){A.target.removeEventListener("dispose",R);for(const C in c){const b=c[C],y=A.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const Wx={[Ml]:yl,[Sl]:Tl,[bl]:Al,[Ks]:El,[yl]:Ml,[Tl]:Sl,[Al]:bl,[El]:Ks};function Xx(i,e){function t(){let D=!1;const fe=new ut;let j=null;const ee=new ut(0,0,0,0);return{setMask:function(xe){j!==xe&&!D&&(i.colorMask(xe,xe,xe,xe),j=xe)},setLocked:function(xe){D=xe},setClear:function(xe,pe,Ve,et,Rt){Rt===!0&&(xe*=et,pe*=et,Ve*=et),fe.set(xe,pe,Ve,et),ee.equals(fe)===!1&&(i.clearColor(xe,pe,Ve,et),ee.copy(fe))},reset:function(){D=!1,j=null,ee.set(-1,0,0,0)}}}function n(){let D=!1,fe=!1,j=null,ee=null,xe=null;return{setReversed:function(pe){if(fe!==pe){const Ve=e.get("EXT_clip_control");fe?Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.ZERO_TO_ONE_EXT):Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.NEGATIVE_ONE_TO_ONE_EXT);const et=xe;xe=null,this.setClear(et)}fe=pe},getReversed:function(){return fe},setTest:function(pe){pe?ue(i.DEPTH_TEST):ie(i.DEPTH_TEST)},setMask:function(pe){j!==pe&&!D&&(i.depthMask(pe),j=pe)},setFunc:function(pe){if(fe&&(pe=Wx[pe]),ee!==pe){switch(pe){case Ml:i.depthFunc(i.NEVER);break;case yl:i.depthFunc(i.ALWAYS);break;case Sl:i.depthFunc(i.LESS);break;case Ks:i.depthFunc(i.LEQUAL);break;case bl:i.depthFunc(i.EQUAL);break;case El:i.depthFunc(i.GEQUAL);break;case Tl:i.depthFunc(i.GREATER);break;case Al:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ee=pe}},setLocked:function(pe){D=pe},setClear:function(pe){xe!==pe&&(fe&&(pe=1-pe),i.clearDepth(pe),xe=pe)},reset:function(){D=!1,j=null,ee=null,xe=null,fe=!1}}}function s(){let D=!1,fe=null,j=null,ee=null,xe=null,pe=null,Ve=null,et=null,Rt=null;return{setTest:function(de){D||(de?ue(i.STENCIL_TEST):ie(i.STENCIL_TEST))},setMask:function(de){fe!==de&&!D&&(i.stencilMask(de),fe=de)},setFunc:function(de,Kt,Ln){(j!==de||ee!==Kt||xe!==Ln)&&(i.stencilFunc(de,Kt,Ln),j=de,ee=Kt,xe=Ln)},setOp:function(de,Kt,Ln){(pe!==de||Ve!==Kt||et!==Ln)&&(i.stencilOp(de,Kt,Ln),pe=de,Ve=Kt,et=Ln)},setLocked:function(de){D=de},setClear:function(de){Rt!==de&&(i.clearStencil(de),Rt=de)},reset:function(){D=!1,fe=null,j=null,ee=null,xe=null,pe=null,Ve=null,et=null,Rt=null}}}const r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let u={},d={},h=new WeakMap,f=[],g=null,_=!1,m=null,p=null,S=null,v=null,x=null,R=null,A=null,w=new Ne(0,0,0),C=0,b=!1,y=null,I=null,Y=null,V=null,q=null;const z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,$=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(G)[1]),U=$>=1):G.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),U=$>=2);let te=null,re={};const he=i.getParameter(i.SCISSOR_BOX),ve=i.getParameter(i.VIEWPORT),Me=new ut().fromArray(he),O=new ut().fromArray(ve);function Z(D,fe,j,ee){const xe=new Uint8Array(4),pe=i.createTexture();i.bindTexture(D,pe),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ve=0;Ve<j;Ve++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,ee,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(fe+Ve,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return pe}const ae={};ae[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),ae[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ae[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ae[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ue(i.DEPTH_TEST),o.setFunc(Ks),Qe(!1),qe(hu),ue(i.CULL_FACE),B(Wi);function ue(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function ie(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function Pe(D,fe){return d[D]!==fe?(i.bindFramebuffer(D,fe),d[D]=fe,D===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=fe),D===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function He(D,fe){let j=f,ee=!1;if(D){j=h.get(fe),j===void 0&&(j=[],h.set(fe,j));const xe=D.textures;if(j.length!==xe.length||j[0]!==i.COLOR_ATTACHMENT0){for(let pe=0,Ve=xe.length;pe<Ve;pe++)j[pe]=i.COLOR_ATTACHMENT0+pe;j.length=xe.length,ee=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,ee=!0);ee&&i.drawBuffers(j)}function at(D){return g!==D?(i.useProgram(D),g=D,!0):!1}const Ze={[us]:i.FUNC_ADD,[Xf]:i.FUNC_SUBTRACT,[$f]:i.FUNC_REVERSE_SUBTRACT};Ze[qf]=i.MIN,Ze[jf]=i.MAX;const ht={[Yf]:i.ZERO,[Kf]:i.ONE,[Zf]:i.SRC_COLOR,[xl]:i.SRC_ALPHA,[ip]:i.SRC_ALPHA_SATURATE,[tp]:i.DST_COLOR,[Qf]:i.DST_ALPHA,[Jf]:i.ONE_MINUS_SRC_COLOR,[vl]:i.ONE_MINUS_SRC_ALPHA,[np]:i.ONE_MINUS_DST_COLOR,[ep]:i.ONE_MINUS_DST_ALPHA,[sp]:i.CONSTANT_COLOR,[rp]:i.ONE_MINUS_CONSTANT_COLOR,[op]:i.CONSTANT_ALPHA,[ap]:i.ONE_MINUS_CONSTANT_ALPHA};function B(D,fe,j,ee,xe,pe,Ve,et,Rt,de){if(D===Wi){_===!0&&(ie(i.BLEND),_=!1);return}if(_===!1&&(ue(i.BLEND),_=!0),D!==Wf){if(D!==m||de!==b){if((p!==us||x!==us)&&(i.blendEquation(i.FUNC_ADD),p=us,x=us),de)switch(D){case $s:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _l:i.blendFunc(i.ONE,i.ONE);break;case fu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case $s:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _l:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case fu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}S=null,v=null,R=null,A=null,w.set(0,0,0),C=0,m=D,b=de}return}xe=xe||fe,pe=pe||j,Ve=Ve||ee,(fe!==p||xe!==x)&&(i.blendEquationSeparate(Ze[fe],Ze[xe]),p=fe,x=xe),(j!==S||ee!==v||pe!==R||Ve!==A)&&(i.blendFuncSeparate(ht[j],ht[ee],ht[pe],ht[Ve]),S=j,v=ee,R=pe,A=Ve),(et.equals(w)===!1||Rt!==C)&&(i.blendColor(et.r,et.g,et.b,Rt),w.copy(et),C=Rt),m=D,b=!1}function Vt(D,fe){D.side===On?ie(i.CULL_FACE):ue(i.CULL_FACE);let j=D.side===dn;fe&&(j=!j),Qe(j),D.blending===$s&&D.transparent===!1?B(Wi):B(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);const ee=D.stencilWrite;a.setTest(ee),ee&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),vt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?ue(i.SAMPLE_ALPHA_TO_COVERAGE):ie(i.SAMPLE_ALPHA_TO_COVERAGE)}function Qe(D){y!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),y=D)}function qe(D){D!==Gf?(ue(i.CULL_FACE),D!==I&&(D===hu?i.cullFace(i.BACK):D===Vf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ie(i.CULL_FACE),I=D}function Be(D){D!==Y&&(U&&i.lineWidth(D),Y=D)}function vt(D,fe,j){D?(ue(i.POLYGON_OFFSET_FILL),(V!==fe||q!==j)&&(i.polygonOffset(fe,j),V=fe,q=j)):ie(i.POLYGON_OFFSET_FILL)}function Fe(D){D?ue(i.SCISSOR_TEST):ie(i.SCISSOR_TEST)}function T(D){D===void 0&&(D=i.TEXTURE0+z-1),te!==D&&(i.activeTexture(D),te=D)}function M(D,fe,j){j===void 0&&(te===null?j=i.TEXTURE0+z-1:j=te);let ee=re[j];ee===void 0&&(ee={type:void 0,texture:void 0},re[j]=ee),(ee.type!==D||ee.texture!==fe)&&(te!==j&&(i.activeTexture(j),te=j),i.bindTexture(D,fe||ae[D]),ee.type=D,ee.texture=fe)}function H(){const D=re[te];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function J(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function K(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function me(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Je(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function oe(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ae(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ie(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Oe(D){Me.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Me.copy(D))}function ye(D){O.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),O.copy(D))}function je(D,fe){let j=c.get(fe);j===void 0&&(j=new WeakMap,c.set(fe,j));let ee=j.get(D);ee===void 0&&(ee=i.getUniformBlockIndex(fe,D.name),j.set(D,ee))}function $e(D,fe){const ee=c.get(fe).get(D);l.get(fe)!==ee&&(i.uniformBlockBinding(fe,ee,D.__bindingPointIndex),l.set(fe,ee))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},te=null,re={},d={},h=new WeakMap,f=[],g=null,_=!1,m=null,p=null,S=null,v=null,x=null,R=null,A=null,w=new Ne(0,0,0),C=0,b=!1,y=null,I=null,Y=null,V=null,q=null,Me.set(0,0,i.canvas.width,i.canvas.height),O.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ue,disable:ie,bindFramebuffer:Pe,drawBuffers:He,useProgram:at,setBlending:B,setMaterial:Vt,setFlipSided:Qe,setCullFace:qe,setLineWidth:Be,setPolygonOffset:vt,setScissorTest:Fe,activeTexture:T,bindTexture:M,unbindTexture:H,compressedTexImage2D:Q,compressedTexImage3D:J,texImage2D:Ae,texImage3D:Ie,updateUBOMapping:je,uniformBlockBinding:$e,texStorage2D:Je,texStorage3D:oe,texSubImage2D:K,texSubImage3D:se,compressedTexSubImage2D:me,compressedTexSubImage3D:Ee,scissor:Oe,viewport:ye,reset:ct}}function fd(i,e,t,n){const s=$x(n);switch(t){case Th:return i*e;case wh:return i*e;case Rh:return i*e*2;case xc:return i*e/s.components*s.byteLength;case vc:return i*e/s.components*s.byteLength;case Ch:return i*e*2/s.components*s.byteLength;case Mc:return i*e*2/s.components*s.byteLength;case Ah:return i*e*3/s.components*s.byteLength;case wn:return i*e*4/s.components*s.byteLength;case yc:return i*e*4/s.components*s.byteLength;case Yo:case Ko:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Zo:case Jo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ll:case Il:return Math.max(i,16)*Math.max(e,8)/4;case Cl:case Pl:return Math.max(i,8)*Math.max(e,8)/2;case Dl:case Ul:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Nl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Fl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ol:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Bl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case zl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case kl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Hl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Gl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Vl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Wl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Xl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case $l:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ql:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case jl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Yl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Qo:case Kl:case Zl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Lh:case Jl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ql:case ec:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function $x(i){switch(i){case yi:case Sh:return{byteLength:1,components:1};case qr:case bh:case Zr:return{byteLength:2,components:1};case gc:case _c:return{byteLength:2,components:4};case ps:case mc:case kn:return{byteLength:4,components:1};case Eh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function qx(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new it,u=new WeakMap;let d;const h=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,M){return f?new OffscreenCanvas(T,M):Kr("canvas")}function _(T,M,H){let Q=1;const J=Fe(T);if((J.width>H||J.height>H)&&(Q=H/Math.max(J.width,J.height)),Q<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const K=Math.floor(Q*J.width),se=Math.floor(Q*J.height);d===void 0&&(d=g(K,se));const me=M?g(K,se):d;return me.width=K,me.height=se,me.getContext("2d").drawImage(T,0,0,K,se),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+K+"x"+se+")."),me}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),T;return T}function m(T){return T.generateMipmaps}function p(T){i.generateMipmap(T)}function S(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(T,M,H,Q,J=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let K=M;if(M===i.RED&&(H===i.FLOAT&&(K=i.R32F),H===i.HALF_FLOAT&&(K=i.R16F),H===i.UNSIGNED_BYTE&&(K=i.R8)),M===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.R8UI),H===i.UNSIGNED_SHORT&&(K=i.R16UI),H===i.UNSIGNED_INT&&(K=i.R32UI),H===i.BYTE&&(K=i.R8I),H===i.SHORT&&(K=i.R16I),H===i.INT&&(K=i.R32I)),M===i.RG&&(H===i.FLOAT&&(K=i.RG32F),H===i.HALF_FLOAT&&(K=i.RG16F),H===i.UNSIGNED_BYTE&&(K=i.RG8)),M===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.RG8UI),H===i.UNSIGNED_SHORT&&(K=i.RG16UI),H===i.UNSIGNED_INT&&(K=i.RG32UI),H===i.BYTE&&(K=i.RG8I),H===i.SHORT&&(K=i.RG16I),H===i.INT&&(K=i.RG32I)),M===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.RGB8UI),H===i.UNSIGNED_SHORT&&(K=i.RGB16UI),H===i.UNSIGNED_INT&&(K=i.RGB32UI),H===i.BYTE&&(K=i.RGB8I),H===i.SHORT&&(K=i.RGB16I),H===i.INT&&(K=i.RGB32I)),M===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),H===i.UNSIGNED_INT&&(K=i.RGBA32UI),H===i.BYTE&&(K=i.RGBA8I),H===i.SHORT&&(K=i.RGBA16I),H===i.INT&&(K=i.RGBA32I)),M===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),M===i.RGBA){const se=J?ha:nt.getTransfer(Q);H===i.FLOAT&&(K=i.RGBA32F),H===i.HALF_FLOAT&&(K=i.RGBA16F),H===i.UNSIGNED_BYTE&&(K=se===_t?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function x(T,M){let H;return T?M===null||M===ps||M===er?H=i.DEPTH24_STENCIL8:M===kn?H=i.DEPTH32F_STENCIL8:M===qr&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ps||M===er?H=i.DEPTH_COMPONENT24:M===kn?H=i.DEPTH_COMPONENT32F:M===qr&&(H=i.DEPTH_COMPONENT16),H}function R(T,M){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Gt&&T.minFilter!==vn?Math.log2(Math.max(M.width,M.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?M.mipmaps.length:1}function A(T){const M=T.target;M.removeEventListener("dispose",A),C(M),M.isVideoTexture&&u.delete(M)}function w(T){const M=T.target;M.removeEventListener("dispose",w),y(M)}function C(T){const M=n.get(T);if(M.__webglInit===void 0)return;const H=T.source,Q=h.get(H);if(Q){const J=Q[M.__cacheKey];J.usedTimes--,J.usedTimes===0&&b(T),Object.keys(Q).length===0&&h.delete(H)}n.remove(T)}function b(T){const M=n.get(T);i.deleteTexture(M.__webglTexture);const H=T.source,Q=h.get(H);delete Q[M.__cacheKey],o.memory.textures--}function y(T){const M=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(M.__webglFramebuffer[Q]))for(let J=0;J<M.__webglFramebuffer[Q].length;J++)i.deleteFramebuffer(M.__webglFramebuffer[Q][J]);else i.deleteFramebuffer(M.__webglFramebuffer[Q]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[Q])}else{if(Array.isArray(M.__webglFramebuffer))for(let Q=0;Q<M.__webglFramebuffer.length;Q++)i.deleteFramebuffer(M.__webglFramebuffer[Q]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Q=0;Q<M.__webglColorRenderbuffer.length;Q++)M.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[Q]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const H=T.textures;for(let Q=0,J=H.length;Q<J;Q++){const K=n.get(H[Q]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),o.memory.textures--),n.remove(H[Q])}n.remove(T)}let I=0;function Y(){I=0}function V(){const T=I;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),I+=1,T}function q(T){const M=[];return M.push(T.wrapS),M.push(T.wrapT),M.push(T.wrapR||0),M.push(T.magFilter),M.push(T.minFilter),M.push(T.anisotropy),M.push(T.internalFormat),M.push(T.format),M.push(T.type),M.push(T.generateMipmaps),M.push(T.premultiplyAlpha),M.push(T.flipY),M.push(T.unpackAlignment),M.push(T.colorSpace),M.join()}function z(T,M){const H=n.get(T);if(T.isVideoTexture&&Be(T),T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){const Q=T.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{O(H,T,M);return}}t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+M)}function U(T,M){const H=n.get(T);if(T.version>0&&H.__version!==T.version){O(H,T,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+M)}function $(T,M){const H=n.get(T);if(T.version>0&&H.__version!==T.version){O(H,T,M);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+M)}function G(T,M){const H=n.get(T);if(T.version>0&&H.__version!==T.version){Z(H,T,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+M)}const te={[Qs]:i.REPEAT,[Hi]:i.CLAMP_TO_EDGE,[ia]:i.MIRRORED_REPEAT},re={[Gt]:i.NEAREST,[yh]:i.NEAREST_MIPMAP_NEAREST,[zr]:i.NEAREST_MIPMAP_LINEAR,[vn]:i.LINEAR,[jo]:i.LINEAR_MIPMAP_NEAREST,[An]:i.LINEAR_MIPMAP_LINEAR},he={[Sp]:i.NEVER,[Rp]:i.ALWAYS,[bp]:i.LESS,[Ih]:i.LEQUAL,[Ep]:i.EQUAL,[wp]:i.GEQUAL,[Tp]:i.GREATER,[Ap]:i.NOTEQUAL};function ve(T,M){if(M.type===kn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===vn||M.magFilter===jo||M.magFilter===zr||M.magFilter===An||M.minFilter===vn||M.minFilter===jo||M.minFilter===zr||M.minFilter===An)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,te[M.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,te[M.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,te[M.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,re[M.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,re[M.minFilter]),M.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,he[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Gt||M.minFilter!==zr&&M.minFilter!==An||M.type===kn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Me(T,M){let H=!1;T.__webglInit===void 0&&(T.__webglInit=!0,M.addEventListener("dispose",A));const Q=M.source;let J=h.get(Q);J===void 0&&(J={},h.set(Q,J));const K=q(M);if(K!==T.__cacheKey){J[K]===void 0&&(J[K]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),J[K].usedTimes++;const se=J[T.__cacheKey];se!==void 0&&(J[T.__cacheKey].usedTimes--,se.usedTimes===0&&b(M)),T.__cacheKey=K,T.__webglTexture=J[K].texture}return H}function O(T,M,H){let Q=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Q=i.TEXTURE_3D);const J=Me(T,M),K=M.source;t.bindTexture(Q,T.__webglTexture,i.TEXTURE0+H);const se=n.get(K);if(K.version!==se.__version||J===!0){t.activeTexture(i.TEXTURE0+H);const me=nt.getPrimaries(nt.workingColorSpace),Ee=M.colorSpace===Bi?null:nt.getPrimaries(M.colorSpace),Je=M.colorSpace===Bi||me===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);let oe=_(M.image,!1,s.maxTextureSize);oe=vt(M,oe);const Ae=r.convert(M.format,M.colorSpace),Ie=r.convert(M.type);let Oe=v(M.internalFormat,Ae,Ie,M.colorSpace,M.isVideoTexture);ve(Q,M);let ye;const je=M.mipmaps,$e=M.isVideoTexture!==!0,ct=se.__version===void 0||J===!0,D=K.dataReady,fe=R(M,oe);if(M.isDepthTexture)Oe=x(M.format===tr,M.type),ct&&($e?t.texStorage2D(i.TEXTURE_2D,1,Oe,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Oe,oe.width,oe.height,0,Ae,Ie,null));else if(M.isDataTexture)if(je.length>0){$e&&ct&&t.texStorage2D(i.TEXTURE_2D,fe,Oe,je[0].width,je[0].height);for(let j=0,ee=je.length;j<ee;j++)ye=je[j],$e?D&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,ye.width,ye.height,Ae,Ie,ye.data):t.texImage2D(i.TEXTURE_2D,j,Oe,ye.width,ye.height,0,Ae,Ie,ye.data);M.generateMipmaps=!1}else $e?(ct&&t.texStorage2D(i.TEXTURE_2D,fe,Oe,oe.width,oe.height),D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,oe.width,oe.height,Ae,Ie,oe.data)):t.texImage2D(i.TEXTURE_2D,0,Oe,oe.width,oe.height,0,Ae,Ie,oe.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){$e&&ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Oe,je[0].width,je[0].height,oe.depth);for(let j=0,ee=je.length;j<ee;j++)if(ye=je[j],M.format!==wn)if(Ae!==null)if($e){if(D)if(M.layerUpdates.size>0){const xe=fd(ye.width,ye.height,M.format,M.type);for(const pe of M.layerUpdates){const Ve=ye.data.subarray(pe*xe/ye.data.BYTES_PER_ELEMENT,(pe+1)*xe/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,pe,ye.width,ye.height,1,Ae,Ve)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ye.width,ye.height,oe.depth,Ae,ye.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Oe,ye.width,ye.height,oe.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else $e?D&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,ye.width,ye.height,oe.depth,Ae,Ie,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,j,Oe,ye.width,ye.height,oe.depth,0,Ae,Ie,ye.data)}else{$e&&ct&&t.texStorage2D(i.TEXTURE_2D,fe,Oe,je[0].width,je[0].height);for(let j=0,ee=je.length;j<ee;j++)ye=je[j],M.format!==wn?Ae!==null?$e?D&&t.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,ye.width,ye.height,Ae,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,j,Oe,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$e?D&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,ye.width,ye.height,Ae,Ie,ye.data):t.texImage2D(i.TEXTURE_2D,j,Oe,ye.width,ye.height,0,Ae,Ie,ye.data)}else if(M.isDataArrayTexture)if($e){if(ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,Oe,oe.width,oe.height,oe.depth),D)if(M.layerUpdates.size>0){const j=fd(oe.width,oe.height,M.format,M.type);for(const ee of M.layerUpdates){const xe=oe.data.subarray(ee*j/oe.data.BYTES_PER_ELEMENT,(ee+1)*j/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ee,oe.width,oe.height,1,Ae,Ie,xe)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Ae,Ie,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Oe,oe.width,oe.height,oe.depth,0,Ae,Ie,oe.data);else if(M.isData3DTexture)$e?(ct&&t.texStorage3D(i.TEXTURE_3D,fe,Oe,oe.width,oe.height,oe.depth),D&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Ae,Ie,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Oe,oe.width,oe.height,oe.depth,0,Ae,Ie,oe.data);else if(M.isFramebufferTexture){if(ct)if($e)t.texStorage2D(i.TEXTURE_2D,fe,Oe,oe.width,oe.height);else{let j=oe.width,ee=oe.height;for(let xe=0;xe<fe;xe++)t.texImage2D(i.TEXTURE_2D,xe,Oe,j,ee,0,Ae,Ie,null),j>>=1,ee>>=1}}else if(je.length>0){if($e&&ct){const j=Fe(je[0]);t.texStorage2D(i.TEXTURE_2D,fe,Oe,j.width,j.height)}for(let j=0,ee=je.length;j<ee;j++)ye=je[j],$e?D&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,Ae,Ie,ye):t.texImage2D(i.TEXTURE_2D,j,Oe,Ae,Ie,ye);M.generateMipmaps=!1}else if($e){if(ct){const j=Fe(oe);t.texStorage2D(i.TEXTURE_2D,fe,Oe,j.width,j.height)}D&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ae,Ie,oe)}else t.texImage2D(i.TEXTURE_2D,0,Oe,Ae,Ie,oe);m(M)&&p(Q),se.__version=K.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function Z(T,M,H){if(M.image.length!==6)return;const Q=Me(T,M),J=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+H);const K=n.get(J);if(J.version!==K.__version||Q===!0){t.activeTexture(i.TEXTURE0+H);const se=nt.getPrimaries(nt.workingColorSpace),me=M.colorSpace===Bi?null:nt.getPrimaries(M.colorSpace),Ee=M.colorSpace===Bi||se===me?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);const Je=M.isCompressedTexture||M.image[0].isCompressedTexture,oe=M.image[0]&&M.image[0].isDataTexture,Ae=[];for(let ee=0;ee<6;ee++)!Je&&!oe?Ae[ee]=_(M.image[ee],!0,s.maxCubemapSize):Ae[ee]=oe?M.image[ee].image:M.image[ee],Ae[ee]=vt(M,Ae[ee]);const Ie=Ae[0],Oe=r.convert(M.format,M.colorSpace),ye=r.convert(M.type),je=v(M.internalFormat,Oe,ye,M.colorSpace),$e=M.isVideoTexture!==!0,ct=K.__version===void 0||Q===!0,D=J.dataReady;let fe=R(M,Ie);ve(i.TEXTURE_CUBE_MAP,M);let j;if(Je){$e&&ct&&t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,je,Ie.width,Ie.height);for(let ee=0;ee<6;ee++){j=Ae[ee].mipmaps;for(let xe=0;xe<j.length;xe++){const pe=j[xe];M.format!==wn?Oe!==null?$e?D&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,0,0,pe.width,pe.height,Oe,pe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,je,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):$e?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,0,0,pe.width,pe.height,Oe,ye,pe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe,je,pe.width,pe.height,0,Oe,ye,pe.data)}}}else{if(j=M.mipmaps,$e&&ct){j.length>0&&fe++;const ee=Fe(Ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,fe,je,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(oe){$e?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ae[ee].width,Ae[ee].height,Oe,ye,Ae[ee].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,je,Ae[ee].width,Ae[ee].height,0,Oe,ye,Ae[ee].data);for(let xe=0;xe<j.length;xe++){const Ve=j[xe].image[ee].image;$e?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,0,0,Ve.width,Ve.height,Oe,ye,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,je,Ve.width,Ve.height,0,Oe,ye,Ve.data)}}else{$e?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Oe,ye,Ae[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,je,Oe,ye,Ae[ee]);for(let xe=0;xe<j.length;xe++){const pe=j[xe];$e?D&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,0,0,Oe,ye,pe.image[ee]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe+1,je,Oe,ye,pe.image[ee])}}}m(M)&&p(i.TEXTURE_CUBE_MAP),K.__version=J.version,M.onUpdate&&M.onUpdate(M)}T.__version=M.version}function ae(T,M,H,Q,J,K){const se=r.convert(H.format,H.colorSpace),me=r.convert(H.type),Ee=v(H.internalFormat,se,me,H.colorSpace),Je=n.get(M),oe=n.get(H);if(oe.__renderTarget=M,!Je.__hasExternalTextures){const Ae=Math.max(1,M.width>>K),Ie=Math.max(1,M.height>>K);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?t.texImage3D(J,K,Ee,Ae,Ie,M.depth,0,se,me,null):t.texImage2D(J,K,Ee,Ae,Ie,0,se,me,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),qe(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,J,oe.__webglTexture,0,Qe(M)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,J,oe.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ue(T,M,H){if(i.bindRenderbuffer(i.RENDERBUFFER,T),M.depthBuffer){const Q=M.depthTexture,J=Q&&Q.isDepthTexture?Q.type:null,K=x(M.stencilBuffer,J),se=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=Qe(M);qe(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,me,K,M.width,M.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,me,K,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,K,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,T)}else{const Q=M.textures;for(let J=0;J<Q.length;J++){const K=Q[J],se=r.convert(K.format,K.colorSpace),me=r.convert(K.type),Ee=v(K.internalFormat,se,me,K.colorSpace),Je=Qe(M);H&&qe(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Je,Ee,M.width,M.height):qe(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Je,Ee,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,Ee,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ie(T,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=n.get(M.depthTexture);Q.__renderTarget=M,(!Q.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),z(M.depthTexture,0);const J=Q.__webglTexture,K=Qe(M);if(M.depthTexture.format===qs)qe(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(M.depthTexture.format===tr)qe(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Pe(T){const M=n.get(T),H=T.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==T.depthTexture){const Q=T.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Q){const J=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Q.removeEventListener("dispose",J)};Q.addEventListener("dispose",J),M.__depthDisposeCallback=J}M.__boundDepthTexture=Q}if(T.depthTexture&&!M.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");ie(M.__webglFramebuffer,T)}else if(H){M.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[Q]),M.__webglDepthbuffer[Q]===void 0)M.__webglDepthbuffer[Q]=i.createRenderbuffer(),ue(M.__webglDepthbuffer[Q],T,!1);else{const J=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=M.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,K)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),ue(M.__webglDepthbuffer,T,!1);else{const Q=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,J)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(T,M,H){const Q=n.get(T);M!==void 0&&ae(Q.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Pe(T)}function at(T){const M=T.texture,H=n.get(T),Q=n.get(M);T.addEventListener("dispose",w);const J=T.textures,K=T.isWebGLCubeRenderTarget===!0,se=J.length>1;if(se||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=M.version,o.memory.textures++),K){H.__webglFramebuffer=[];for(let me=0;me<6;me++)if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer[me]=[];for(let Ee=0;Ee<M.mipmaps.length;Ee++)H.__webglFramebuffer[me][Ee]=i.createFramebuffer()}else H.__webglFramebuffer[me]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer=[];for(let me=0;me<M.mipmaps.length;me++)H.__webglFramebuffer[me]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(se)for(let me=0,Ee=J.length;me<Ee;me++){const Je=n.get(J[me]);Je.__webglTexture===void 0&&(Je.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&qe(T)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let me=0;me<J.length;me++){const Ee=J[me];H.__webglColorRenderbuffer[me]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[me]);const Je=r.convert(Ee.format,Ee.colorSpace),oe=r.convert(Ee.type),Ae=v(Ee.internalFormat,Je,oe,Ee.colorSpace,T.isXRRenderTarget===!0),Ie=Qe(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ie,Ae,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.RENDERBUFFER,H.__webglColorRenderbuffer[me])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),ue(H.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),ve(i.TEXTURE_CUBE_MAP,M);for(let me=0;me<6;me++)if(M.mipmaps&&M.mipmaps.length>0)for(let Ee=0;Ee<M.mipmaps.length;Ee++)ae(H.__webglFramebuffer[me][Ee],T,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+me,Ee);else ae(H.__webglFramebuffer[me],T,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);m(M)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let me=0,Ee=J.length;me<Ee;me++){const Je=J[me],oe=n.get(Je);t.bindTexture(i.TEXTURE_2D,oe.__webglTexture),ve(i.TEXTURE_2D,Je),ae(H.__webglFramebuffer,T,Je,i.COLOR_ATTACHMENT0+me,i.TEXTURE_2D,0),m(Je)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let me=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(me=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(me,Q.__webglTexture),ve(me,M),M.mipmaps&&M.mipmaps.length>0)for(let Ee=0;Ee<M.mipmaps.length;Ee++)ae(H.__webglFramebuffer[Ee],T,M,i.COLOR_ATTACHMENT0,me,Ee);else ae(H.__webglFramebuffer,T,M,i.COLOR_ATTACHMENT0,me,0);m(M)&&p(me),t.unbindTexture()}T.depthBuffer&&Pe(T)}function Ze(T){const M=T.textures;for(let H=0,Q=M.length;H<Q;H++){const J=M[H];if(m(J)){const K=S(T),se=n.get(J).__webglTexture;t.bindTexture(K,se),p(K),t.unbindTexture()}}}const ht=[],B=[];function Vt(T){if(T.samples>0){if(qe(T)===!1){const M=T.textures,H=T.width,Q=T.height;let J=i.COLOR_BUFFER_BIT;const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=n.get(T),me=M.length>1;if(me)for(let Ee=0;Ee<M.length;Ee++)t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let Ee=0;Ee<M.length;Ee++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),me){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,se.__webglColorRenderbuffer[Ee]);const Je=n.get(M[Ee]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Je,0)}i.blitFramebuffer(0,0,H,Q,0,0,H,Q,J,i.NEAREST),l===!0&&(ht.length=0,B.length=0,ht.push(i.COLOR_ATTACHMENT0+Ee),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ht.push(K),B.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,B)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),me)for(let Ee=0;Ee<M.length;Ee++){t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.RENDERBUFFER,se.__webglColorRenderbuffer[Ee]);const Je=n.get(M[Ee]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.TEXTURE_2D,Je,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const M=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Qe(T){return Math.min(s.maxSamples,T.samples)}function qe(T){const M=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Be(T){const M=o.render.frame;u.get(T)!==M&&(u.set(T,M),T.update())}function vt(T,M){const H=T.colorSpace,Q=T.format,J=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||H!==rn&&H!==Bi&&(nt.getTransfer(H)===_t?(Q!==wn||J!==yi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),M}function Fe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=Y,this.setTexture2D=z,this.setTexture2DArray=U,this.setTexture3D=$,this.setTextureCube=G,this.rebindTextures=He,this.setupRenderTarget=at,this.updateRenderTargetMipmap=Ze,this.updateMultisampleRenderTarget=Vt,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=ae,this.useMultisampledRTT=qe}function jx(i,e){function t(n,s=Bi){let r;const o=nt.getTransfer(s);if(n===yi)return i.UNSIGNED_BYTE;if(n===gc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===_c)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Eh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Sh)return i.BYTE;if(n===bh)return i.SHORT;if(n===qr)return i.UNSIGNED_SHORT;if(n===mc)return i.INT;if(n===ps)return i.UNSIGNED_INT;if(n===kn)return i.FLOAT;if(n===Zr)return i.HALF_FLOAT;if(n===Th)return i.ALPHA;if(n===Ah)return i.RGB;if(n===wn)return i.RGBA;if(n===wh)return i.LUMINANCE;if(n===Rh)return i.LUMINANCE_ALPHA;if(n===qs)return i.DEPTH_COMPONENT;if(n===tr)return i.DEPTH_STENCIL;if(n===xc)return i.RED;if(n===vc)return i.RED_INTEGER;if(n===Ch)return i.RG;if(n===Mc)return i.RG_INTEGER;if(n===yc)return i.RGBA_INTEGER;if(n===Yo||n===Ko||n===Zo||n===Jo)if(o===_t)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Yo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Yo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ko)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Zo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Jo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Cl||n===Ll||n===Pl||n===Il)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ll)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Pl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Il)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dl||n===Ul||n===Nl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dl||n===Ul)return o===_t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Nl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Fl||n===Ol||n===Bl||n===zl||n===kl||n===Hl||n===Gl||n===Vl||n===Wl||n===Xl||n===$l||n===ql||n===jl||n===Yl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Fl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ol)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Bl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===zl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===kl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Hl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Gl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Vl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Wl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Xl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===$l)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ql)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Yl)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qo||n===Kl||n===Zl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Qo)return o===_t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Kl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Lh||n===Jl||n===Ql||n===ec)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Qo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Jl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ql)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ec)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===er?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Yx extends sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ht extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Kx={type:"move"};class tl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Kx)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ht;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Zx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Jx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Qx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Ft,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new $i({vertexShader:Zx,fragmentShader:Jx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new bt(new Wn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ev extends ur{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null;const _=new Qx,m=t.getContextAttributes();let p=null,S=null;const v=[],x=[],R=new it;let A=null;const w=new sn;w.viewport=new ut;const C=new sn;C.viewport=new ut;const b=[w,C],y=new Yx;let I=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let Z=v[O];return Z===void 0&&(Z=new tl,v[O]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(O){let Z=v[O];return Z===void 0&&(Z=new tl,v[O]=Z),Z.getGripSpace()},this.getHand=function(O){let Z=v[O];return Z===void 0&&(Z=new tl,v[O]=Z),Z.getHandSpace()};function V(O){const Z=x.indexOf(O.inputSource);if(Z===-1)return;const ae=v[Z];ae!==void 0&&(ae.update(O.inputSource,O.frame,c||o),ae.dispatchEvent({type:O.type,data:O.inputSource}))}function q(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",z);for(let O=0;O<v.length;O++){const Z=x[O];Z!==null&&(x[O]=null,v[O].disconnect(Z))}I=null,Y=null,_.reset(),e.setRenderTarget(p),f=null,h=null,d=null,s=null,S=null,Me.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){r=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(O){if(s=O,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",q),s.addEventListener("inputsourceschange",z),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(R),s.renderState.layers===void 0){const Z={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Z),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new ms(f.framebufferWidth,f.framebufferHeight,{format:wn,type:yi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let Z=null,ae=null,ue=null;m.depth&&(ue=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Z=m.stencil?tr:qs,ae=m.stencil?er:ps);const ie={colorFormat:t.RGBA8,depthFormat:ue,scaleFactor:r};d=new XRWebGLBinding(s,t),h=d.createProjectionLayer(ie),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),S=new ms(h.textureWidth,h.textureHeight,{format:wn,type:yi,depthTexture:new Vh(h.textureWidth,h.textureHeight,ae,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Me.setContext(s),Me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function z(O){for(let Z=0;Z<O.removed.length;Z++){const ae=O.removed[Z],ue=x.indexOf(ae);ue>=0&&(x[ue]=null,v[ue].disconnect(ae))}for(let Z=0;Z<O.added.length;Z++){const ae=O.added[Z];let ue=x.indexOf(ae);if(ue===-1){for(let Pe=0;Pe<v.length;Pe++)if(Pe>=x.length){x.push(ae),ue=Pe;break}else if(x[Pe]===null){x[Pe]=ae,ue=Pe;break}if(ue===-1)break}const ie=v[ue];ie&&ie.connect(ae)}}const U=new P,$=new P;function G(O,Z,ae){U.setFromMatrixPosition(Z.matrixWorld),$.setFromMatrixPosition(ae.matrixWorld);const ue=U.distanceTo($),ie=Z.projectionMatrix.elements,Pe=ae.projectionMatrix.elements,He=ie[14]/(ie[10]-1),at=ie[14]/(ie[10]+1),Ze=(ie[9]+1)/ie[5],ht=(ie[9]-1)/ie[5],B=(ie[8]-1)/ie[0],Vt=(Pe[8]+1)/Pe[0],Qe=He*B,qe=He*Vt,Be=ue/(-B+Vt),vt=Be*-B;if(Z.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(vt),O.translateZ(Be),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert(),ie[10]===-1)O.projectionMatrix.copy(Z.projectionMatrix),O.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const Fe=He+Be,T=at+Be,M=Qe-vt,H=qe+(ue-vt),Q=Ze*at/T*Fe,J=ht*at/T*Fe;O.projectionMatrix.makePerspective(M,H,Q,J,Fe,T),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}}function te(O,Z){Z===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices(Z.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(s===null)return;let Z=O.near,ae=O.far;_.texture!==null&&(_.depthNear>0&&(Z=_.depthNear),_.depthFar>0&&(ae=_.depthFar)),y.near=C.near=w.near=Z,y.far=C.far=w.far=ae,(I!==y.near||Y!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),I=y.near,Y=y.far),w.layers.mask=O.layers.mask|2,C.layers.mask=O.layers.mask|4,y.layers.mask=w.layers.mask|C.layers.mask;const ue=O.parent,ie=y.cameras;te(y,ue);for(let Pe=0;Pe<ie.length;Pe++)te(ie[Pe],ue);ie.length===2?G(y,w,C):y.projectionMatrix.copy(w.projectionMatrix),re(O,y,ue)};function re(O,Z,ae){ae===null?O.matrix.copy(Z.matrixWorld):(O.matrix.copy(ae.matrixWorld),O.matrix.invert(),O.matrix.multiply(Z.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy(Z.projectionMatrix),O.projectionMatrixInverse.copy(Z.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=nr*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(O){l=O,h!==null&&(h.fixedFoveation=O),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=O)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let he=null;function ve(O,Z){if(u=Z.getViewerPose(c||o),g=Z,u!==null){const ae=u.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let ue=!1;ae.length!==y.cameras.length&&(y.cameras.length=0,ue=!0);for(let Pe=0;Pe<ae.length;Pe++){const He=ae[Pe];let at=null;if(f!==null)at=f.getViewport(He);else{const ht=d.getViewSubImage(h,He);at=ht.viewport,Pe===0&&(e.setRenderTargetTextures(S,ht.colorTexture,h.ignoreDepthValues?void 0:ht.depthStencilTexture),e.setRenderTarget(S))}let Ze=b[Pe];Ze===void 0&&(Ze=new sn,Ze.layers.enable(Pe),Ze.viewport=new ut,b[Pe]=Ze),Ze.matrix.fromArray(He.transform.matrix),Ze.matrix.decompose(Ze.position,Ze.quaternion,Ze.scale),Ze.projectionMatrix.fromArray(He.projectionMatrix),Ze.projectionMatrixInverse.copy(Ze.projectionMatrix).invert(),Ze.viewport.set(at.x,at.y,at.width,at.height),Pe===0&&(y.matrix.copy(Ze.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ue===!0&&y.cameras.push(Ze)}const ie=s.enabledFeatures;if(ie&&ie.includes("depth-sensing")){const Pe=d.getDepthInformation(ae[0]);Pe&&Pe.isValid&&Pe.texture&&_.init(e,Pe,s.renderState)}}for(let ae=0;ae<v.length;ae++){const ue=x[ae],ie=v[ae];ue!==null&&ie!==void 0&&ie.update(ue,Z,c||o)}he&&he(O,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Me=new Gh;Me.setAnimationLoop(ve),this.setAnimationLoop=function(O){he=O},this.dispose=function(){}}}const rs=new Cn,tv=new Xe;function nv(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,zh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,v,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,S,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===dn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===dn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),v=S.envMap,x=S.envMapRotation;v&&(m.envMap.value=v,rs.copy(x),rs.x*=-1,rs.y*=-1,rs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(rs.y*=-1,rs.z*=-1),m.envMapRotation.value.setFromMatrix4(tv.makeRotationFromEuler(rs)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=v*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===dn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function iv(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,v){const x=v.program;n.uniformBlockBinding(S,x)}function c(S,v){let x=s[S.id];x===void 0&&(g(S),x=u(S),s[S.id]=x,S.addEventListener("dispose",m));const R=v.program;n.updateUBOMapping(S,R);const A=e.render.frame;r[S.id]!==A&&(h(S),r[S.id]=A)}function u(S){const v=d();S.__bindingPointIndex=v;const x=i.createBuffer(),R=S.__size,A=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,R,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,x),x}function d(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(S){const v=s[S.id],x=S.uniforms,R=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,w=x.length;A<w;A++){const C=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,y=C.length;b<y;b++){const I=C[b];if(f(I,A,b,R)===!0){const Y=I.__offset,V=Array.isArray(I.value)?I.value:[I.value];let q=0;for(let z=0;z<V.length;z++){const U=V[z],$=_(U);typeof U=="number"||typeof U=="boolean"?(I.__data[0]=U,i.bufferSubData(i.UNIFORM_BUFFER,Y+q,I.__data)):U.isMatrix3?(I.__data[0]=U.elements[0],I.__data[1]=U.elements[1],I.__data[2]=U.elements[2],I.__data[3]=0,I.__data[4]=U.elements[3],I.__data[5]=U.elements[4],I.__data[6]=U.elements[5],I.__data[7]=0,I.__data[8]=U.elements[6],I.__data[9]=U.elements[7],I.__data[10]=U.elements[8],I.__data[11]=0):(U.toArray(I.__data,q),q+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Y,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,v,x,R){const A=S.value,w=v+"_"+x;if(R[w]===void 0)return typeof A=="number"||typeof A=="boolean"?R[w]=A:R[w]=A.clone(),!0;{const C=R[w];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return R[w]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(S){const v=S.uniforms;let x=0;const R=16;for(let w=0,C=v.length;w<C;w++){const b=Array.isArray(v[w])?v[w]:[v[w]];for(let y=0,I=b.length;y<I;y++){const Y=b[y],V=Array.isArray(Y.value)?Y.value:[Y.value];for(let q=0,z=V.length;q<z;q++){const U=V[q],$=_(U),G=x%R,te=G%$.boundary,re=G+te;x+=te,re!==0&&R-re<$.storage&&(x+=R-re),Y.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=x,x+=$.storage}}}const A=x%R;return A>0&&(x+=R-A),S.__size=x,S.__cache={},this}function _(S){const v={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(v.boundary=4,v.storage=4):S.isVector2?(v.boundary=8,v.storage=8):S.isVector3||S.isColor?(v.boundary=16,v.storage=12):S.isVector4?(v.boundary=16,v.storage=16):S.isMatrix3?(v.boundary=48,v.storage=48):S.isMatrix4?(v.boundary=64,v.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),v}function m(S){const v=S.target;v.removeEventListener("dispose",m);const x=o.indexOf(v.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(const S in s)i.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class sv{constructor(e={}){const{canvas:t=$p(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const S=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ut,this.toneMapping=Xi,this.toneMappingExposure=1;const x=this;let R=!1,A=0,w=0,C=null,b=-1,y=null;const I=new ut,Y=new ut;let V=null;const q=new Ne(0);let z=0,U=t.width,$=t.height,G=1,te=null,re=null;const he=new ut(0,0,U,$),ve=new ut(0,0,U,$);let Me=!1;const O=new Tc;let Z=!1,ae=!1;const ue=new Xe,ie=new Xe,Pe=new P,He=new ut,at={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ze=!1;function ht(){return C===null?G:1}let B=n;function Vt(E,F){return t.getContext(E,F)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${fc}`),t.addEventListener("webglcontextlost",ee,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",pe,!1),B===null){const F="webgl2";if(B=Vt(F,E),B===null)throw Vt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Qe,qe,Be,vt,Fe,T,M,H,Q,J,K,se,me,Ee,Je,oe,Ae,Ie,Oe,ye,je,$e,ct,D;function fe(){Qe=new c_(B),Qe.init(),$e=new jx(B,Qe),qe=new i_(B,Qe,e,$e),Be=new Xx(B,Qe),qe.reverseDepthBuffer&&h&&Be.buffers.depth.setReversed(!0),vt=new h_(B),Fe=new Lx,T=new qx(B,Qe,Be,Fe,qe,$e,vt),M=new r_(x),H=new l_(x),Q=new vm(B),ct=new t_(B,Q),J=new u_(B,Q,vt,ct),K=new p_(B,J,Q,vt),Oe=new f_(B,qe,T),oe=new s_(Fe),se=new Cx(x,M,H,Qe,qe,ct,oe),me=new nv(x,Fe),Ee=new Ix,Je=new Bx(Qe),Ie=new e_(x,M,H,Be,K,f,l),Ae=new Vx(x,K,qe),D=new iv(B,vt,qe,Be),ye=new n_(B,Qe,vt),je=new d_(B,Qe,vt),vt.programs=se.programs,x.capabilities=qe,x.extensions=Qe,x.properties=Fe,x.renderLists=Ee,x.shadowMap=Ae,x.state=Be,x.info=vt}fe();const j=new ev(x,B);this.xr=j,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const E=Qe.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Qe.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(E){E!==void 0&&(G=E,this.setSize(U,$,!1))},this.getSize=function(E){return E.set(U,$)},this.setSize=function(E,F,X=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=E,$=F,t.width=Math.floor(E*G),t.height=Math.floor(F*G),X===!0&&(t.style.width=E+"px",t.style.height=F+"px"),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(U*G,$*G).floor()},this.setDrawingBufferSize=function(E,F,X){U=E,$=F,G=X,t.width=Math.floor(E*X),t.height=Math.floor(F*X),this.setViewport(0,0,E,F)},this.getCurrentViewport=function(E){return E.copy(I)},this.getViewport=function(E){return E.copy(he)},this.setViewport=function(E,F,X,W){E.isVector4?he.set(E.x,E.y,E.z,E.w):he.set(E,F,X,W),Be.viewport(I.copy(he).multiplyScalar(G).round())},this.getScissor=function(E){return E.copy(ve)},this.setScissor=function(E,F,X,W){E.isVector4?ve.set(E.x,E.y,E.z,E.w):ve.set(E,F,X,W),Be.scissor(Y.copy(ve).multiplyScalar(G).round())},this.getScissorTest=function(){return Me},this.setScissorTest=function(E){Be.setScissorTest(Me=E)},this.setOpaqueSort=function(E){te=E},this.setTransparentSort=function(E){re=E},this.getClearColor=function(E){return E.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor.apply(Ie,arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha.apply(Ie,arguments)},this.clear=function(E=!0,F=!0,X=!0){let W=0;if(E){let N=!1;if(C!==null){const ce=C.texture.format;N=ce===yc||ce===Mc||ce===vc}if(N){const ce=C.texture.type,ge=ce===yi||ce===ps||ce===qr||ce===er||ce===gc||ce===_c,we=Ie.getClearColor(),Re=Ie.getClearAlpha(),Ge=we.r,We=we.g,Ce=we.b;ge?(g[0]=Ge,g[1]=We,g[2]=Ce,g[3]=Re,B.clearBufferuiv(B.COLOR,0,g)):(_[0]=Ge,_[1]=We,_[2]=Ce,_[3]=Re,B.clearBufferiv(B.COLOR,0,_))}else W|=B.COLOR_BUFFER_BIT}F&&(W|=B.DEPTH_BUFFER_BIT),X&&(W|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ee,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),Ee.dispose(),Je.dispose(),Fe.dispose(),M.dispose(),H.dispose(),K.dispose(),ct.dispose(),D.dispose(),se.dispose(),j.dispose(),j.removeEventListener("sessionstart",Xn),j.removeEventListener("sessionend",eo),on.stop()};function ee(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const E=vt.autoReset,F=Ae.enabled,X=Ae.autoUpdate,W=Ae.needsUpdate,N=Ae.type;fe(),vt.autoReset=E,Ae.enabled=F,Ae.autoUpdate=X,Ae.needsUpdate=W,Ae.type=N}function pe(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Ve(E){const F=E.target;F.removeEventListener("dispose",Ve),et(F)}function et(E){Rt(E),Fe.remove(E)}function Rt(E){const F=Fe.get(E).programs;F!==void 0&&(F.forEach(function(X){se.releaseProgram(X)}),E.isShaderMaterial&&se.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,X,W,N,ce){F===null&&(F=at);const ge=N.isMesh&&N.matrixWorld.determinant()<0,we=gr(E,F,X,W,N);Be.setMaterial(W,ge);let Re=X.index,Ge=1;if(W.wireframe===!0){if(Re=J.getWireframeAttribute(X),Re===void 0)return;Ge=2}const We=X.drawRange,Ce=X.attributes.position;let st=We.start*Ge,ft=(We.start+We.count)*Ge;ce!==null&&(st=Math.max(st,ce.start*Ge),ft=Math.min(ft,(ce.start+ce.count)*Ge)),Re!==null?(st=Math.max(st,0),ft=Math.min(ft,Re.count)):Ce!=null&&(st=Math.max(st,0),ft=Math.min(ft,Ce.count));const Mt=ft-st;if(Mt<0||Mt===1/0)return;ct.setup(N,W,we,X,Re);let Wt,lt=ye;if(Re!==null&&(Wt=Q.get(Re),lt=je,lt.setIndex(Wt)),N.isMesh)W.wireframe===!0?(Be.setLineWidth(W.wireframeLinewidth*ht()),lt.setMode(B.LINES)):lt.setMode(B.TRIANGLES);else if(N.isLine){let De=W.linewidth;De===void 0&&(De=1),Be.setLineWidth(De*ht()),N.isLineSegments?lt.setMode(B.LINES):N.isLineLoop?lt.setMode(B.LINE_LOOP):lt.setMode(B.LINE_STRIP)}else N.isPoints?lt.setMode(B.POINTS):N.isSprite&&lt.setMode(B.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)lt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Qe.get("WEBGL_multi_draw"))lt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const De=N._multiDrawStarts,Pn=N._multiDrawCounts,ot=N._multiDrawCount,an=Re?Q.get(Re).bytesPerElement:1,si=Fe.get(W).currentProgram.getUniforms();for(let Et=0;Et<ot;Et++)si.setValue(B,"_gl_DrawID",Et),lt.render(De[Et]/an,Pn[Et])}else if(N.isInstancedMesh)lt.renderInstances(st,Mt,N.count);else if(X.isInstancedBufferGeometry){const De=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Pn=Math.min(X.instanceCount,De);lt.renderInstances(st,Mt,Pn)}else lt.render(st,Mt)};function de(E,F,X){E.transparent===!0&&E.side===On&&E.forceSinglePass===!1?(E.side=dn,E.needsUpdate=!0,bi(E,F,X),E.side=Vn,E.needsUpdate=!0,bi(E,F,X),E.side=On):bi(E,F,X)}this.compile=function(E,F,X=null){X===null&&(X=E),p=Je.get(X),p.init(F),v.push(p),X.traverseVisible(function(N){N.isLight&&N.layers.test(F.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),E!==X&&E.traverseVisible(function(N){N.isLight&&N.layers.test(F.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const W=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const ce=N.material;if(ce)if(Array.isArray(ce))for(let ge=0;ge<ce.length;ge++){const we=ce[ge];de(we,X,N),W.add(we)}else de(ce,X,N),W.add(ce)}),v.pop(),p=null,W},this.compileAsync=function(E,F,X=null){const W=this.compile(E,F,X);return new Promise(N=>{function ce(){if(W.forEach(function(ge){Fe.get(ge).currentProgram.isReady()&&W.delete(ge)}),W.size===0){N(E);return}setTimeout(ce,10)}Qe.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Kt=null;function Ln(E){Kt&&Kt(E)}function Xn(){on.stop()}function eo(){on.start()}const on=new Gh;on.setAnimationLoop(Ln),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(E){Kt=E,j.setAnimationLoop(E),E===null?on.stop():on.start()},j.addEventListener("sessionstart",Xn),j.addEventListener("sessionend",eo),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,F,C),p=Je.get(E,v.length),p.init(F),v.push(p),ie.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),O.setFromProjectionMatrix(ie),ae=this.localClippingEnabled,Z=oe.init(this.clippingPlanes,ae),m=Ee.get(E,S.length),m.init(),S.push(m),j.enabled===!0&&j.isPresenting===!0){const ce=x.xr.getDepthSensingMesh();ce!==null&&gs(ce,F,-1/0,x.sortObjects)}gs(E,F,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(te,re),Ze=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Ze&&Ie.addToRenderList(m,E),this.info.render.frame++,Z===!0&&oe.beginShadows();const X=p.state.shadowsArray;Ae.render(X,E,F),Z===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,N=m.transmissive;if(p.setupLights(),F.isArrayCamera){const ce=F.cameras;if(N.length>0)for(let ge=0,we=ce.length;ge<we;ge++){const Re=ce[ge];qi(W,N,E,Re)}Ze&&Ie.render(E);for(let ge=0,we=ce.length;ge<we;ge++){const Re=ce[ge];_s(m,E,Re,Re.viewport)}}else N.length>0&&qi(W,N,E,F),Ze&&Ie.render(E),_s(m,E,F);C!==null&&(T.updateMultisampleRenderTarget(C),T.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(x,E,F),ct.resetDefaultState(),b=-1,y=null,v.pop(),v.length>0?(p=v[v.length-1],Z===!0&&oe.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function gs(E,F,X,W){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||O.intersectsSprite(E)){W&&He.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ie);const ge=K.update(E),we=E.material;we.visible&&m.push(E,ge,we,X,He.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||O.intersectsObject(E))){const ge=K.update(E),we=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),He.copy(E.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),He.copy(ge.boundingSphere.center)),He.applyMatrix4(E.matrixWorld).applyMatrix4(ie)),Array.isArray(we)){const Re=ge.groups;for(let Ge=0,We=Re.length;Ge<We;Ge++){const Ce=Re[Ge],st=we[Ce.materialIndex];st&&st.visible&&m.push(E,ge,st,X,He.z,Ce)}}else we.visible&&m.push(E,ge,we,X,He.z,null)}}const ce=E.children;for(let ge=0,we=ce.length;ge<we;ge++)gs(ce[ge],F,X,W)}function _s(E,F,X,W){const N=E.opaque,ce=E.transmissive,ge=E.transparent;p.setupLightsView(X),Z===!0&&oe.setGlobalState(x.clippingPlanes,X),W&&Be.viewport(I.copy(W)),N.length>0&&ji(N,F,X),ce.length>0&&ji(ce,F,X),ge.length>0&&ji(ge,F,X),Be.buffers.depth.setTest(!0),Be.buffers.depth.setMask(!0),Be.buffers.color.setMask(!0),Be.setPolygonOffset(!1)}function qi(E,F,X,W){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new ms(1,1,{generateMipmaps:!0,type:Qe.has("EXT_color_buffer_half_float")||Qe.has("EXT_color_buffer_float")?Zr:yi,minFilter:An,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));const ce=p.state.transmissionRenderTarget[W.id],ge=W.viewport||I;ce.setSize(ge.z,ge.w);const we=x.getRenderTarget();x.setRenderTarget(ce),x.getClearColor(q),z=x.getClearAlpha(),z<1&&x.setClearColor(16777215,.5),x.clear(),Ze&&Ie.render(X);const Re=x.toneMapping;x.toneMapping=Xi;const Ge=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),Z===!0&&oe.setGlobalState(x.clippingPlanes,W),ji(E,X,W),T.updateMultisampleRenderTarget(ce),T.updateRenderTargetMipmap(ce),Qe.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let Ce=0,st=F.length;Ce<st;Ce++){const ft=F[Ce],Mt=ft.object,Wt=ft.geometry,lt=ft.material,De=ft.group;if(lt.side===On&&Mt.layers.test(W.layers)){const Pn=lt.side;lt.side=dn,lt.needsUpdate=!0,to(Mt,X,W,Wt,lt,De),lt.side=Pn,lt.needsUpdate=!0,We=!0}}We===!0&&(T.updateMultisampleRenderTarget(ce),T.updateRenderTargetMipmap(ce))}x.setRenderTarget(we),x.setClearColor(q,z),Ge!==void 0&&(W.viewport=Ge),x.toneMapping=Re}function ji(E,F,X){const W=F.isScene===!0?F.overrideMaterial:null;for(let N=0,ce=E.length;N<ce;N++){const ge=E[N],we=ge.object,Re=ge.geometry,Ge=W===null?ge.material:W,We=ge.group;we.layers.test(X.layers)&&to(we,F,X,Re,Ge,We)}}function to(E,F,X,W,N,ce){E.onBeforeRender(x,F,X,W,N,ce),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(x,F,X,W,E,ce),N.transparent===!0&&N.side===On&&N.forceSinglePass===!1?(N.side=dn,N.needsUpdate=!0,x.renderBufferDirect(X,F,W,N,E,ce),N.side=Vn,N.needsUpdate=!0,x.renderBufferDirect(X,F,W,N,E,ce),N.side=On):x.renderBufferDirect(X,F,W,N,E,ce),E.onAfterRender(x,F,X,W,N,ce)}function bi(E,F,X){F.isScene!==!0&&(F=at);const W=Fe.get(E),N=p.state.lights,ce=p.state.shadowsArray,ge=N.state.version,we=se.getParameters(E,N.state,ce,F,X),Re=se.getProgramCacheKey(we);let Ge=W.programs;W.environment=E.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(E.isMeshStandardMaterial?H:M).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,Ge===void 0&&(E.addEventListener("dispose",Ve),Ge=new Map,W.programs=Ge);let We=Ge.get(Re);if(We!==void 0){if(W.currentProgram===We&&W.lightsStateVersion===ge)return xs(E,we),We}else we.uniforms=se.getUniforms(E),E.onBeforeCompile(we,x),We=se.acquireProgram(we,Re),Ge.set(Re,We),W.uniforms=we.uniforms;const Ce=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ce.clippingPlanes=oe.uniform),xs(E,we),W.needsLights=io(E),W.lightsStateVersion=ge,W.needsLights&&(Ce.ambientLightColor.value=N.state.ambient,Ce.lightProbe.value=N.state.probe,Ce.directionalLights.value=N.state.directional,Ce.directionalLightShadows.value=N.state.directionalShadow,Ce.spotLights.value=N.state.spot,Ce.spotLightShadows.value=N.state.spotShadow,Ce.rectAreaLights.value=N.state.rectArea,Ce.ltc_1.value=N.state.rectAreaLTC1,Ce.ltc_2.value=N.state.rectAreaLTC2,Ce.pointLights.value=N.state.point,Ce.pointLightShadows.value=N.state.pointShadow,Ce.hemisphereLights.value=N.state.hemi,Ce.directionalShadowMap.value=N.state.directionalShadowMap,Ce.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Ce.spotShadowMap.value=N.state.spotShadowMap,Ce.spotLightMatrix.value=N.state.spotLightMatrix,Ce.spotLightMap.value=N.state.spotLightMap,Ce.pointShadowMap.value=N.state.pointShadowMap,Ce.pointShadowMatrix.value=N.state.pointShadowMatrix),W.currentProgram=We,W.uniformsList=null,We}function no(E){if(E.uniformsList===null){const F=E.currentProgram.getUniforms();E.uniformsList=ea.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function xs(E,F){const X=Fe.get(E);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.batchingColor=F.batchingColor,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.instancingMorph=F.instancingMorph,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function gr(E,F,X,W,N){F.isScene!==!0&&(F=at),T.resetTextureUnits();const ce=F.fog,ge=W.isMeshStandardMaterial?F.environment:null,we=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:rn,Re=(W.isMeshStandardMaterial?H:M).get(W.envMap||ge),Ge=W.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,We=!!X.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ce=!!X.morphAttributes.position,st=!!X.morphAttributes.normal,ft=!!X.morphAttributes.color;let Mt=Xi;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Mt=x.toneMapping);const Wt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,lt=Wt!==void 0?Wt.length:0,De=Fe.get(W),Pn=p.state.lights;if(Z===!0&&(ae===!0||E!==y)){const Zt=E===y&&W.id===b;oe.setState(W,E,Zt)}let ot=!1;W.version===De.__version?(De.needsLights&&De.lightsStateVersion!==Pn.state.version||De.outputColorSpace!==we||N.isBatchedMesh&&De.batching===!1||!N.isBatchedMesh&&De.batching===!0||N.isBatchedMesh&&De.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&De.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&De.instancing===!1||!N.isInstancedMesh&&De.instancing===!0||N.isSkinnedMesh&&De.skinning===!1||!N.isSkinnedMesh&&De.skinning===!0||N.isInstancedMesh&&De.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&De.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&De.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&De.instancingMorph===!1&&N.morphTexture!==null||De.envMap!==Re||W.fog===!0&&De.fog!==ce||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==oe.numPlanes||De.numIntersection!==oe.numIntersection)||De.vertexAlphas!==Ge||De.vertexTangents!==We||De.morphTargets!==Ce||De.morphNormals!==st||De.morphColors!==ft||De.toneMapping!==Mt||De.morphTargetsCount!==lt)&&(ot=!0):(ot=!0,De.__version=W.version);let an=De.currentProgram;ot===!0&&(an=bi(W,F,N));let si=!1,Et=!1,bn=!1;const dt=an.getUniforms(),fn=De.uniforms;if(Be.useProgram(an.program)&&(si=!0,Et=!0,bn=!0),W.id!==b&&(b=W.id,Et=!0),si||y!==E){Be.buffers.depth.getReversed()?(ue.copy(E.projectionMatrix),jp(ue),Yp(ue),dt.setValue(B,"projectionMatrix",ue)):dt.setValue(B,"projectionMatrix",E.projectionMatrix),dt.setValue(B,"viewMatrix",E.matrixWorldInverse);const $n=dt.map.cameraPosition;$n!==void 0&&$n.setValue(B,Pe.setFromMatrixPosition(E.matrixWorld)),qe.logarithmicDepthBuffer&&dt.setValue(B,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&dt.setValue(B,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Et=!0,bn=!0)}if(N.isSkinnedMesh){dt.setOptional(B,N,"bindMatrix"),dt.setOptional(B,N,"bindMatrixInverse");const Zt=N.skeleton;Zt&&(Zt.boneTexture===null&&Zt.computeBoneTexture(),dt.setValue(B,"boneTexture",Zt.boneTexture,T))}N.isBatchedMesh&&(dt.setOptional(B,N,"batchingTexture"),dt.setValue(B,"batchingTexture",N._matricesTexture,T),dt.setOptional(B,N,"batchingIdTexture"),dt.setValue(B,"batchingIdTexture",N._indirectTexture,T),dt.setOptional(B,N,"batchingColorTexture"),N._colorsTexture!==null&&dt.setValue(B,"batchingColorTexture",N._colorsTexture,T));const Ei=X.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&Oe.update(N,X,an),(Et||De.receiveShadow!==N.receiveShadow)&&(De.receiveShadow=N.receiveShadow,dt.setValue(B,"receiveShadow",N.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(fn.envMap.value=Re,fn.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(fn.envMapIntensity.value=F.environmentIntensity),Et&&(dt.setValue(B,"toneMappingExposure",x.toneMappingExposure),De.needsLights&&ga(fn,bn),ce&&W.fog===!0&&me.refreshFogUniforms(fn,ce),me.refreshMaterialUniforms(fn,W,G,$,p.state.transmissionRenderTarget[E.id]),ea.upload(B,no(De),fn,T)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(ea.upload(B,no(De),fn,T),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&dt.setValue(B,"center",N.center),dt.setValue(B,"modelViewMatrix",N.modelViewMatrix),dt.setValue(B,"normalMatrix",N.normalMatrix),dt.setValue(B,"modelMatrix",N.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Zt=W.uniformsGroups;for(let $n=0,qn=Zt.length;$n<qn;$n++){const vs=Zt[$n];D.update(vs,an),D.bind(vs,an)}}return an}function ga(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function io(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,F,X){Fe.get(E.texture).__webglTexture=F,Fe.get(E.depthTexture).__webglTexture=X;const W=Fe.get(E);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=X===void 0,W.__autoAllocateDepthBuffer||Qe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,F){const X=Fe.get(E);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,X=0){C=E,A=F,w=X;let W=!0,N=null,ce=!1,ge=!1;if(E){const Re=Fe.get(E);if(Re.__useDefaultFramebuffer!==void 0)Be.bindFramebuffer(B.FRAMEBUFFER,null),W=!1;else if(Re.__webglFramebuffer===void 0)T.setupRenderTarget(E);else if(Re.__hasExternalTextures)T.rebindTextures(E,Fe.get(E.texture).__webglTexture,Fe.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ce=E.depthTexture;if(Re.__boundDepthTexture!==Ce){if(Ce!==null&&Fe.has(Ce)&&(E.width!==Ce.image.width||E.height!==Ce.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(E)}}const Ge=E.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(ge=!0);const We=Fe.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(We[F])?N=We[F][X]:N=We[F],ce=!0):E.samples>0&&T.useMultisampledRTT(E)===!1?N=Fe.get(E).__webglMultisampledFramebuffer:Array.isArray(We)?N=We[X]:N=We,I.copy(E.viewport),Y.copy(E.scissor),V=E.scissorTest}else I.copy(he).multiplyScalar(G).floor(),Y.copy(ve).multiplyScalar(G).floor(),V=Me;if(Be.bindFramebuffer(B.FRAMEBUFFER,N)&&W&&Be.drawBuffers(E,N),Be.viewport(I),Be.scissor(Y),Be.setScissorTest(V),ce){const Re=Fe.get(E.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+F,Re.__webglTexture,X)}else if(ge){const Re=Fe.get(E.texture),Ge=F||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Re.__webglTexture,X||0,Ge)}b=-1},this.readRenderTargetPixels=function(E,F,X,W,N,ce,ge){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=Fe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ge!==void 0&&(we=we[ge]),we){Be.bindFramebuffer(B.FRAMEBUFFER,we);try{const Re=E.texture,Ge=Re.format,We=Re.type;if(!qe.textureFormatReadable(Ge)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qe.textureTypeReadable(We)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-W&&X>=0&&X<=E.height-N&&B.readPixels(F,X,W,N,$e.convert(Ge),$e.convert(We),ce)}finally{const Re=C!==null?Fe.get(C).__webglFramebuffer:null;Be.bindFramebuffer(B.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(E,F,X,W,N,ce,ge){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=Fe.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ge!==void 0&&(we=we[ge]),we){const Re=E.texture,Ge=Re.format,We=Re.type;if(!qe.textureFormatReadable(Ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qe.textureTypeReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=E.width-W&&X>=0&&X<=E.height-N){Be.bindFramebuffer(B.FRAMEBUFFER,we);const Ce=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Ce),B.bufferData(B.PIXEL_PACK_BUFFER,ce.byteLength,B.STREAM_READ),B.readPixels(F,X,W,N,$e.convert(Ge),$e.convert(We),0);const st=C!==null?Fe.get(C).__webglFramebuffer:null;Be.bindFramebuffer(B.FRAMEBUFFER,st);const ft=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await qp(B,ft,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Ce),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,ce),B.deleteBuffer(Ce),B.deleteSync(ft),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,F=null,X=0){E.isTexture!==!0&&(kr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,E=arguments[1]);const W=Math.pow(2,-X),N=Math.floor(E.image.width*W),ce=Math.floor(E.image.height*W),ge=F!==null?F.x:0,we=F!==null?F.y:0;T.setTexture2D(E,0),B.copyTexSubImage2D(B.TEXTURE_2D,X,0,0,ge,we,N,ce),Be.unbindTexture()},this.copyTextureToTexture=function(E,F,X=null,W=null,N=0){E.isTexture!==!0&&(kr("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1],F=arguments[2],N=arguments[3]||0,X=null);let ce,ge,we,Re,Ge,We,Ce,st,ft;const Mt=E.isCompressedTexture?E.mipmaps[N]:E.image;X!==null?(ce=X.max.x-X.min.x,ge=X.max.y-X.min.y,we=X.isBox3?X.max.z-X.min.z:1,Re=X.min.x,Ge=X.min.y,We=X.isBox3?X.min.z:0):(ce=Mt.width,ge=Mt.height,we=Mt.depth||1,Re=0,Ge=0,We=0),W!==null?(Ce=W.x,st=W.y,ft=W.z):(Ce=0,st=0,ft=0);const Wt=$e.convert(F.format),lt=$e.convert(F.type);let De;F.isData3DTexture?(T.setTexture3D(F,0),De=B.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(T.setTexture2DArray(F,0),De=B.TEXTURE_2D_ARRAY):(T.setTexture2D(F,0),De=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,F.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,F.unpackAlignment);const Pn=B.getParameter(B.UNPACK_ROW_LENGTH),ot=B.getParameter(B.UNPACK_IMAGE_HEIGHT),an=B.getParameter(B.UNPACK_SKIP_PIXELS),si=B.getParameter(B.UNPACK_SKIP_ROWS),Et=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,Mt.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Mt.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,Re),B.pixelStorei(B.UNPACK_SKIP_ROWS,Ge),B.pixelStorei(B.UNPACK_SKIP_IMAGES,We);const bn=E.isDataArrayTexture||E.isData3DTexture,dt=F.isDataArrayTexture||F.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const fn=Fe.get(E),Ei=Fe.get(F),Zt=Fe.get(fn.__renderTarget),$n=Fe.get(Ei.__renderTarget);Be.bindFramebuffer(B.READ_FRAMEBUFFER,Zt.__webglFramebuffer),Be.bindFramebuffer(B.DRAW_FRAMEBUFFER,$n.__webglFramebuffer);for(let qn=0;qn<we;qn++)bn&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Fe.get(E).__webglTexture,N,We+qn),E.isDepthTexture?(dt&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Fe.get(F).__webglTexture,N,ft+qn),B.blitFramebuffer(Re,Ge,ce,ge,Ce,st,ce,ge,B.DEPTH_BUFFER_BIT,B.NEAREST)):dt?B.copyTexSubImage3D(De,N,Ce,st,ft+qn,Re,Ge,ce,ge):B.copyTexSubImage2D(De,N,Ce,st,ft+qn,Re,Ge,ce,ge);Be.bindFramebuffer(B.READ_FRAMEBUFFER,null),Be.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else dt?E.isDataTexture||E.isData3DTexture?B.texSubImage3D(De,N,Ce,st,ft,ce,ge,we,Wt,lt,Mt.data):F.isCompressedArrayTexture?B.compressedTexSubImage3D(De,N,Ce,st,ft,ce,ge,we,Wt,Mt.data):B.texSubImage3D(De,N,Ce,st,ft,ce,ge,we,Wt,lt,Mt):E.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,N,Ce,st,ce,ge,Wt,lt,Mt.data):E.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,N,Ce,st,Mt.width,Mt.height,Wt,Mt.data):B.texSubImage2D(B.TEXTURE_2D,N,Ce,st,ce,ge,Wt,lt,Mt);B.pixelStorei(B.UNPACK_ROW_LENGTH,Pn),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,ot),B.pixelStorei(B.UNPACK_SKIP_PIXELS,an),B.pixelStorei(B.UNPACK_SKIP_ROWS,si),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Et),N===0&&F.generateMipmaps&&B.generateMipmap(De),Be.unbindTexture()},this.copyTextureToTexture3D=function(E,F,X=null,W=null,N=0){return E.isTexture!==!0&&(kr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,W=arguments[1]||null,E=arguments[2],F=arguments[3],N=arguments[4]||0),kr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,F,X,W,N)},this.initRenderTarget=function(E){Fe.get(E).__webglFramebuffer===void 0&&T.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?T.setTextureCube(E,0):E.isData3DTexture?T.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?T.setTexture2DArray(E,0):T.setTexture2D(E,0),Be.unbindTexture()},this.resetState=function(){A=0,w=0,C=null,Be.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}}class Rc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ne(e),this.near=t,this.far=n}clone(){return new Rc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class rv extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ov{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=nc,this.updateRanges=[],this.version=0,this.uuid=Hn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Qt=new P;class Cc{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyMatrix4(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.applyNormalMatrix(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Qt.fromBufferAttribute(this,t),Qt.transformDirection(e),this.setXYZ(t,Qt.x,Qt.y,Qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=pt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=pt(t,this.array),n=pt(n,this.array),s=pt(s,this.array),r=pt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ct(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Cc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const pd=new P,md=new ut,gd=new ut,av=new P,_d=new Xe,Uo=new P,nl=new ti,xd=new Xe,il=new Jr;class lv extends bt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=mu,this.bindMatrix=new Xe,this.bindMatrixInverse=new Xe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Rn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Uo),this.boundingBox.expandByPoint(Uo)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ti),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Uo),this.boundingSphere.expandByPoint(Uo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),nl.copy(this.boundingSphere),nl.applyMatrix4(s),e.ray.intersectsSphere(nl)!==!1&&(xd.copy(s).invert(),il.copy(e.ray).applyMatrix4(xd),!(this.boundingBox!==null&&il.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,il)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ut,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===mu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===gp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;md.fromBufferAttribute(s.attributes.skinIndex,e),gd.fromBufferAttribute(s.attributes.skinWeight,e),pd.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const o=gd.getComponent(r);if(o!==0){const a=md.getComponent(r);_d.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(av.copy(pd).applyMatrix4(_d),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class jh extends Tt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Yh extends Ft{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Gt,u=Gt,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const vd=new Xe,cv=new Xe;class Lc{constructor(e=[],t=[]){this.uuid=Hn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Xe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Xe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:cv;vd.multiplyMatrices(a,t[r]),vd.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Lc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Yh(t,e,e,wn,kn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new jh),this.bones.push(o),this.boneInverses.push(new Xe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const o=t[s];e.bones.push(o.uuid);const a=n[s];e.boneInverses.push(a.toArray())}return e}}class ra extends Ct{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ks=new Xe,Md=new Xe,No=[],yd=new Rn,uv=new Xe,Dr=new bt,Ur=new ti;class hs extends bt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ra(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,uv)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Rn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ks),yd.copy(e.boundingBox).applyMatrix4(ks),this.boundingBox.union(yd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ti),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ks),Ur.copy(e.boundingSphere).applyMatrix4(ks),this.boundingSphere.union(Ur)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Dr.geometry=this.geometry,Dr.material=this.material,Dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ur.copy(this.boundingSphere),Ur.applyMatrix4(n),e.ray.intersectsSphere(Ur)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ks),Md.multiplyMatrices(n,ks),Dr.matrixWorld=Md,Dr.raycast(e,No);for(let o=0,a=No.length;o<a;o++){const l=No[o];l.instanceId=r,l.object=this,t.push(l)}No.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ra(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yh(new Float32Array(s*this.count),s,this.count,xc,kn));const r=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Kh extends Gn{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const oa=new P,aa=new P,Sd=new Xe,Nr=new Jr,Fo=new ti,sl=new P,bd=new P;class Pc extends Tt{constructor(e=new hn,t=new Kh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)oa.fromBufferAttribute(t,s-1),aa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=oa.distanceTo(aa);e.setAttribute("lineDistance",new nn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Fo.copy(n.boundingSphere),Fo.applyMatrix4(s),Fo.radius+=r,e.ray.intersectsSphere(Fo)===!1)return;Sd.copy(s).invert(),Nr.copy(e.ray).applyMatrix4(Sd);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=u.getX(_),S=u.getX(_+1),v=Oo(this,e,Nr,l,p,S);v&&t.push(v)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(f),p=Oo(this,e,Nr,l,_,m);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){const p=Oo(this,e,Nr,l,_,_+1);p&&t.push(p)}if(this.isLineLoop){const _=Oo(this,e,Nr,l,g-1,f);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Oo(i,e,t,n,s,r){const o=i.geometry.attributes.position;if(oa.fromBufferAttribute(o,s),aa.fromBufferAttribute(o,r),t.distanceSqToSegment(oa,aa,sl,bd)>n)return;sl.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(sl);if(!(l<e.near||l>e.far))return{distance:l,point:bd.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Ed=new P,Td=new P;class dv extends Pc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Ed.fromBufferAttribute(t,s),Td.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ed.distanceTo(Td);e.setAttribute("lineDistance",new nn(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hv extends Pc{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Ic extends Gn{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ad=new Xe,sc=new Jr,Bo=new ti,zo=new P;class Zh extends Tt{constructor(e=new hn,t=new Ic){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Bo.copy(n.boundingSphere),Bo.applyMatrix4(s),Bo.radius+=r,e.ray.intersectsSphere(Bo)===!1)return;Ad.copy(s).invert(),sc.copy(e.ray).applyMatrix4(Ad);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=h,_=f;g<_;g++){const m=c.getX(g);zo.fromBufferAttribute(d,m),wd(zo,m,l,s,e,t,this)}}else{const h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=h,_=f;g<_;g++)zo.fromBufferAttribute(d,g),wd(zo,g,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function wd(i,e,t,n,s,r,o){const a=sc.distanceSqToPoint(i);if(a<t){const l=new P;sc.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Jh extends Ft{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Si extends Gn{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sc,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ni extends Si{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new it(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Yt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class fv extends Gn{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sc,this.normalScale=new it(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=pc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}function ko(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function pv(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function mv(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Rd(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=i[a+l]}return s}function Qh(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push.apply(t,o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}class Qr{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class gv extends Qr{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gu,endingEnd:gu}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case _u:r=e,a=2*t-n;break;case xu:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case _u:o=e,l=2*n-t;break;case xu:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),_=g*g,m=_*g,p=-h*m+2*h*_-h*g,S=(1+h)*m+(-1.5-2*h)*_+(-.5+h)*g+1,v=(-1-f)*m+(1.5+f)*_+.5*g,x=f*m-f*_;for(let R=0;R!==a;++R)r[R]=p*o[u+R]+S*o[c+R]+v*o[l+R]+x*o[d+R];return r}}class _v extends Qr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==a;++h)r[h]=o[c+h]*d+o[l+h]*u;return r}}class xv extends Qr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class ii{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ko(t,this.TimeBufferType),this.values=ko(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ko(e.times,Array),values:ko(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new xv(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new _v(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new gv(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case jr:t=this.InterpolantFactoryMethodDiscrete;break;case Yr:t=this.InterpolantFactoryMethodLinear;break;case Ra:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return jr;case this.InterpolantFactoryMethodLinear:return Yr;case this.InterpolantFactoryMethodSmooth:return Ra}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&pv(s))for(let a=0,l=s.length;a!==l;++a){const c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ra,r=e.length-1;let o=1;for(let a=1;a<r;++a){let l=!1;const c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{const d=a*n,h=d-n,f=d+n;for(let g=0;g!==n;++g){const _=t[d+g];if(_!==t[h+g]||_!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const d=a*n,h=o*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}ii.prototype.TimeBufferType=Float32Array;ii.prototype.ValueBufferType=Float32Array;ii.prototype.DefaultInterpolation=Yr;class hr extends ii{constructor(e,t,n){super(e,t,n)}}hr.prototype.ValueTypeName="bool";hr.prototype.ValueBufferType=Array;hr.prototype.DefaultInterpolation=jr;hr.prototype.InterpolantFactoryMethodLinear=void 0;hr.prototype.InterpolantFactoryMethodSmooth=void 0;class ef extends ii{}ef.prototype.ValueTypeName="color";class sr extends ii{}sr.prototype.ValueTypeName="number";class vv extends Qr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t);let c=e*a;for(let u=c+a;c!==u;c+=4)ei.slerpFlat(r,0,o,c-a,o,c,l);return r}}class rr extends ii{InterpolantFactoryMethodLinear(e){return new vv(this.times,this.values,this.getValueSize(),e)}}rr.prototype.ValueTypeName="quaternion";rr.prototype.InterpolantFactoryMethodSmooth=void 0;class fr extends ii{constructor(e,t,n){super(e,t,n)}}fr.prototype.ValueTypeName="string";fr.prototype.ValueBufferType=Array;fr.prototype.DefaultInterpolation=jr;fr.prototype.InterpolantFactoryMethodLinear=void 0;fr.prototype.InterpolantFactoryMethodSmooth=void 0;class or extends ii{}or.prototype.ValueTypeName="vector";class Mv{constructor(e="",t=-1,n=[],s=_p){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Hn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Sv(n[o]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(ii.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);const u=mv(l);l=Rd(l,1,u),c=Rd(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new sr(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],u=c.name.match(r);if(u&&u.length>1){const d=u[1];let h=s[d];h||(s[d]=h=[]),h.push(c)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(d,h,f,g,_){if(f.length!==0){const m=[],p=[];Qh(f,m,p,g),m.length!==0&&_.push(new d(h,m,p))}},s=[],r=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let d=0;d<c.length;d++){const h=c[d].keys;if(!(!h||h.length===0))if(h[0].morphTargets){const f={};let g;for(g=0;g<h.length;g++)if(h[g].morphTargets)for(let _=0;_<h[g].morphTargets.length;_++)f[h[g].morphTargets[_]]=-1;for(const _ in f){const m=[],p=[];for(let S=0;S!==h[g].morphTargets.length;++S){const v=h[g];m.push(v.time),p.push(v.morphTarget===_?1:0)}s.push(new sr(".morphTargetInfluence["+_+"]",m,p))}l=f.length*o}else{const f=".bones["+t[d].name+"]";n(or,f+".position",h,"pos",s),n(rr,f+".quaternion",h,"rot",s),n(or,f+".scale",h,"scl",s)}}return s.length===0?null:new this(r,l,s,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function yv(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return sr;case"vector":case"vector2":case"vector3":case"vector4":return or;case"color":return ef;case"quaternion":return rr;case"bool":case"boolean":return hr;case"string":return fr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Sv(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=yv(i.type);if(i.times===void 0){const t=[],n=[];Qh(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const Gi={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class bv{constructor(e,t,n){const s=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){const d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){const f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null}}}const Ev=new bv;class pr{constructor(e){this.manager=e!==void 0?e:Ev,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}pr.DEFAULT_MATERIAL_NAME="__DEFAULT";const di={};class Tv extends Error{constructor(e,t){super(e),this.response=t}}class tf extends pr{constructor(e){super(e)}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Gi.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(di[e]!==void 0){di[e].push({onLoad:t,onProgress:n,onError:s});return}di[e]=[],di[e].push({onLoad:t,onProgress:n,onError:s});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=di[e],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=h?parseInt(h):0,g=f!==0;let _=0;const m=new ReadableStream({start(p){S();function S(){d.read().then(({done:v,value:x})=>{if(v)p.close();else{_+=x.byteLength;const R=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let A=0,w=u.length;A<w;A++){const C=u[A];C.onProgress&&C.onProgress(R)}p.enqueue(x),S()}},v=>{p.error(v)})}}});return new Response(m)}else throw new Tv(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a===void 0)return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Gi.add(e,c);const u=di[e];delete di[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{const u=di[e];if(u===void 0)throw this.manager.itemError(e),c;delete di[e];for(let d=0,h=u.length;d<h;d++){const f=u[d];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Av extends pr{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Gi.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=Kr("img");function l(){u(),Gi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class wv extends pr{constructor(e){super(e)}load(e,t,n,s){const r=new Ft,o=new Av(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class pa extends Tt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Rv extends pa{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ne(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const rl=new Xe,Cd=new P,Ld=new P;class Dc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new it(512,512),this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tc,this._frameExtents=new it(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Cd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cd),Ld.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ld),t.updateMatrixWorld(),rl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(rl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Cv extends Dc{constructor(){super(new sn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=nr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class nf extends pa{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Cv}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Pd=new Xe,Fr=new P,ol=new P;class Lv extends Dc{constructor(){super(new sn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new it(4,2),this._viewportCount=6,this._viewports=[new ut(2,1,1,1),new ut(0,1,1,1),new ut(3,1,1,1),new ut(1,1,1,1),new ut(3,0,1,1),new ut(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Fr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Fr),ol.copy(n.position),ol.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ol),n.updateMatrixWorld(),s.makeTranslation(-Fr.x,-Fr.y,-Fr.z),Pd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pd)}}class Pv extends pa{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Lv}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Iv extends Dc{constructor(){super(new Ac(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rc extends pa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.shadow=new Iv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class $r{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,s=e.length;n<s;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Dv extends pr{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Gi.get(e);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{t&&t(c),r.manager.itemEnd(e)}).catch(c=>{s&&s(c)});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Gi.add(e,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Gi.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});Gi.add(e,l),r.manager.itemStart(e)}}class Uv{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Id(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Id();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Id(){return performance.now()}const Uc="\\[\\]\\.:\\/",Nv=new RegExp("["+Uc+"]","g"),Nc="[^"+Uc+"]",Fv="[^"+Uc.replace("\\.","")+"]",Ov=/((?:WC+[\/:])*)/.source.replace("WC",Nc),Bv=/(WCOD+)?/.source.replace("WCOD",Fv),zv=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Nc),kv=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Nc),Hv=new RegExp("^"+Ov+Bv+zv+kv+"$"),Gv=["material","materials","bones","map"];class Vv{constructor(e,t,n){const s=n||mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class mt{constructor(e,t,n){this.path=t,this.parsedPath=n||mt.parseTrackName(t),this.node=mt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new mt.Composite(e,t,n):new mt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Nv,"")}static parseTrackName(e){const t=Hv.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);Gv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=mt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[s];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}mt.Composite=Vv;mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};mt.prototype.GetterByBindingType=[mt.prototype._getValue_direct,mt.prototype._getValue_array,mt.prototype._getValue_arrayElement,mt.prototype._getValue_toArray];mt.prototype.SetterByBindingTypeAndVersioning=[[mt.prototype._setValue_direct,mt.prototype._setValue_direct_setNeedsUpdate,mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_array,mt.prototype._setValue_array_setNeedsUpdate,mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_arrayElement,mt.prototype._setValue_arrayElement_setNeedsUpdate,mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_fromArray,mt.prototype._setValue_fromArray_setNeedsUpdate,mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Dd=new Xe;class Wv{constructor(e,t,n=0,s=1/0){this.ray=new Jr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ec,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Dd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Dd),this}intersectObject(e,t=!0,n=[]){return oc(e,this,n,t),n.sort(Ud),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)oc(e[s],this,n,t);return n.sort(Ud),n}}function Ud(i,e){return i.distance-e.distance}function oc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)oc(r[o],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fc);const Nd=[{id:"intro",text:[{es:"¡Hola! Soy Daniel, una mente curiosa que disfruta convirtiendo ideas en experiencias interactivas. Soy desarrollador full stack y desarrollador de videojuegos, y ahora estoy inmerso en la IA y la ciencia de datos para hacer mis proyectos más inteligentes y emocionantes",en:"Hey! I'm Daniel, a curious mind who loves turning ideas into interactive experiences. I'm a full-stack developer and game developer, currently diving deep into AI and Data Science to make my projects smarter and more exciting."}]},{id:"web",text:[{es:"Construyo aplicaciones web y plataformas a medida con Laravel y React. En Global Fun Partners he desarrollado y mantenido webs corporativas con WordPress, he creado un portal privado de empresa que agiliza las operaciones internas y he diseñado soluciones a medida para el área privada del CBU Bàsquet Lloret, mejorando la gestión de equipo y los flujos de comunicación",en:"I build web apps and custom platforms using Laravel and React. At Global Fun Partners, I have developed and maintained corporate websites with WordPress, created a private company portal to streamline internal operations, and designed tailored solutions for the private area of CBU Bàsquet Lloret, improving team management and communication workflows."}]},{id:"games",text:[{es:"Pero donde de verdad me enciendo es trabajando en videojuegos: diseñando mecánicas, creando mundos en Unity o Unreal y dando vida a historias con arte 3D y animaciones. También he trabajado en varios proyectos, tanto personales como durante mis estudios universitarios, que puedes explorar en la sección de obras de esta web",en:"But where I really light up is when I'm working on games—designing mechanics, crafting worlds in Unity or Unreal, and bringing stories to life with 3D art and animations. I've also worked on several projects, both personal and during my university studies, which you can explore in the Works section of this site."}]},{id:"security",text:[{es:"La ciberseguridad es una de mis pasiones, y dentro de ella el pentesting es lo que más me entusiasma. Soy autodidacta en el área y no dejo de buscar formas de probar, proteger y blindar sistemas. Para mí programar es tan cuestión de creatividad como de ponerme a prueba buscando vulnerabilidades y hacer el software más resiliente",en:"Cybersecurity is a personal passion of mine, with a focus on pentesting, which I find especially exciting. I am self-taught in this area and constantly exploring ways to test, secure, and harden systems. For me, programming is as much about creativity as it is about challenging myself to find vulnerabilities and make software more resilient."}]},{id:"offcourt",text:[{es:"Fuera del código, seguramente me encuentres en una pista de baloncesto, experimentando con nuevos conceptos de videojuegos o empapándome de las últimas tendencias en IA, hacking ético y tecnología en general. Me encanta mezclar lo técnico con la creatividad, y siempre busco formas de aprender, crecer y construir proyectos que sean a la vez débutants y con sentido",en:"Outside of coding, you'll probably find me on a basketball court, experimenting with new game concepts, or geeking out about the latest trends in AI, ethical hacking, and tech in general. I love blending technical skills with creativity, and I'm always looking for ways to learn, grow, and build projects that are both fun and meaningful."}]}],yn={person:{name:"Daniel Noya Catoira",initials:"LID",jerseyNumber:"23",role:{es:"Desarrollador Full Stack",en:"Full Stack Developer"},location:"Girona, Catalonia",email:"contactdanielnoya@gmail.com",social:[{label:{es:"LinkedIn",en:"LinkedIn"},url:"https://www.linkedin.com/in/daniel-noya-catoira/"},{label:{es:"X",en:"X"},url:"https://x.com/LideGameDev"},{label:{es:"TryHackMe",en:"TryHackMe"},url:"https://tryhackme.com/p/Lideiras"},{label:{es:"itch.io",en:"itch.io"},url:"https://danoya.itch.io/"}]},about:{topics:Nd,paragraphs:Nd.flatMap(i=>i.text),highlights:[{label:{es:"En la pista",en:"On the court"},value:{es:"Semiprofesional desde 2017",en:"Semi-pro since 2017"}},{label:{es:"Idiomas",en:"Languages"},value:{es:"5",en:"5"}},{label:{es:"TFG Endless Blue",en:"Final project Endless Blue"},value:{es:"8/10",en:"8/10"}},{label:{es:"Debate",en:"Debate"},value:{es:"Parlamento de Galicia",en:"Galician Parliament"}}]},projects:[{id:"sobreviviu-udg",title:"Sobreviu l'UDG",year:2022,summary:{es:"Juego de terror y puzles en primera persona hecho con Unity 3D",en:"Horror puzzle FPS game made with Unity 3D"},details:{es:"Juego de terror y puzles en primera persona ambientado en el campus de la UDG. El jugador debe resolver puzles para escapar del campus y encontrar la salida. El juego tiene una atmósfera de terror y una mecánica de resolución de puzles única",en:"Horror puzzle FPS game based on the UDG campus. The player must solve puzzles to escape the campus and find the exit. The game features a horror atmosphere and a unique puzzle-solving mechanic."},stack:["Unity 3D","Blender","Substance Painter","C#","Puzzles"],links:[{label:{es:"itch.io",en:"itch.io"},url:"https://danoya.itch.io/sobreviu-ludg"}]},{id:"long-live-the-king",title:"Long Live The King",year:2022,summary:{es:"FPS de arquero con mecánicas de parkour hecho con UE4",en:"Archer FPS with parkour mechanics made with UE4"},details:{es:"Proyecto desarrollado para la asignatura de Desarrollo de Videojuegos de la Universidad de Girona. Es un FPS de arquero con mecánicas de parkour: el jugador puede moverse en todas las direcciones y saltar obstáculos. Me encargué de las mecánicas de arco y flecha y del diseño de niveles",en:"Project developed for the Game Development subject at the University of Girona. It is a FPS archer game with parkour mechanics. The player can move in all directions and jump over obstacles."},stack:["UE4","Blueprint","Blender","3D Modeling","Animation","Parkour"],links:[{label:{es:"itch.io",en:"itch.io"},url:"https://danoya.itch.io/long-live-the-king"},{label:{es:"GitHub",en:"GitHub"},url:"https://github.com/kimarsal/LongLiveTheKing"}]},{id:"multiplayer-simple-game",title:"Multiplayer Simple Game",year:2023,summary:{es:"Juego multijugador 2D hecho con el sistema multijugador de Unity",en:"2D Multiplayer game made using Unity Multiplayer System"},details:{es:"Pequeño proyecto desarrollado para la asignatura de Desarrollo de Videojuegos Multijugador de la Universidad de Girona. Es un juego multijugador 2D que usa el sistema multijugador de Unity para facilitar la comunicación entre jugadores y servidor. Para construir una comunicación sólida entre clientes y servidor tuve que aprender a usar ese sistema",en:"Small project developed for the Multiplayer Game Development subject at the University of Girona. It is a 2D multiplayer game. The game uses the Unity Multiplayer System to ease the multiplayer communication between players & server."},stack:["Unity 3D","C#","Unity Multiplayer System","Animation"],links:[]},{id:"vr-game",title:"VR Game",year:2022,summary:{es:"Juego de realidad virtual hecho con Unity",en:"VR game made using Unity"},details:{es:"Juego de realidad virtual desarrollado para la asignatura de Realidad Virtual de la Universidad de Girona. Usa el sistema de VR de Unity para ofrecer una experiencia sencilla al jugador; el objetivo del proyecto era entender cómo funciona Unity con los sistemas de VR y poder añadir esas habilidades a mi caja de herramientas de desarrollo",en:"VR game developed for the Virtual Reality subject at the University of Girona. It is a VR game. The game uses the Unity VR System to deliver a simple VR experience to the player, this project objective was to understand how Unity works with the VR Systems and being able to add those skills to our game developing toolbox."},stack:["Unity 3D","C#","Unity VR System","Animation","Unity XR Interaction Toolkit"],links:[]},{id:"endless-runner-game",title:"Endless Runner Game",year:2023,summary:{es:"Juego de carrera infinita para dispositivos móviles hecho con Unity",en:"Endless Runner Game for mobile devices made using Unity"},details:{es:"Juego de carrera infinita desarrollado para la asignatura de Juegos Móviles de la Universidad de Girona. Usa el sistema móvil de Unity para ofrecer una experiencia móvil sencilla; el objetivo del proyecto era entender los distintos tipos de entrada en Unity para un juego móvil y cómo construir las teselas del mapa infinito para los niveles sin fin",en:"Endless Runner Game developed for the Mobile Games subject at the University of Girona. It is a Endless Runner Game. The game uses the Unity Mobile System to deliver a simple mobile experience to the player, this project objective was to understand how Unity works with the Mobile Systems and being able to add those skills to our game developing toolbox."},stack:["Unity 3D","C#","Unity Mobile System","Animation","Unity Mobile Input"],links:[{label:{es:"Descarga",en:"Download"},url:"https://drive.google.com/file/d/1LSxJ884z316t4CY6CY7Z4A5J6ZVEB5oz/view?usp=sharing"}]},{id:"godot-2d-plataformer",title:"Godot 2D Plataformer",year:2022,summary:{es:"Juego de plataformas 2D hecho con Godot y su starter kit de plataformas 2D",en:"2D Plataformer game made using Godot and the 2D Plataformer starter kit"},details:{es:"Juego de plataformas 2D hecho con el motor Godot para ofrecer una experiencia sencilla al jugador; el objetivo del proyecto era entender cómo funciona Godot y cómo se programa con GDScript",en:"2D Plataformer Game. It is a 2D Plataformer Game. The game uses the Godot Engine to deliver a simple experience to the player, this project objective was to understand how Godot works."},stack:["Godot Engine","GDScript","2D Systems","Animation"],links:[]},{id:"tfg-game",title:"Endless Blue",year:2025,summary:{es:"Juego 3D hecho como proyecto final del Grado en Desarrollo de Videojuegos de la Universidad de Girona",en:"3D Game made as my final project for the Game Development degree at the University of Girona"},details:{es:"Juego 3D en el que el usuario controla un delfín animado proceduralmente que debe explorar un mapa lleno de enemigos patrulla, NPC y cofres que cuentan una historia sobre la pérdida y el duelo. Es el prototipo inicial que presenté al tribunal, con una nota final de 8/10. Cuenta con un entorno 3D, un delfín con animación procedural y enemigos 3D también animados proceduralmente",en:"The game is a 3D game where the user controls a procedurally animated dolphin that has to explore a map filled with patroling enemies, NPCs and chests that tell a story about loss and grieve. This is the initial prototipe I presented to the tribunal and the final mark was a 8/10. The game features a 3D environment, a procedurally 3D animated dolphin and a 3D animated enemies also procedurally animated."},stack:["Unity 3D","C#","Animation","Procedural Animations"],links:[{label:{es:"Descarga",en:"Download"},url:"https://www.dropbox.com/scl/fo/183tykx5fp80v5ckzlqj3/ABlPNYEYd5gpg8wW6rNMoNk?rlkey=3lcq3pfil8c6htlaxgh3q6zfe&st=g58qp7be&dl=0"}]},{id:"pinball-godot-game",title:"Pinball Godot Game",year:2021,summary:{es:"Juego de pinball 2D hecho con Godot para entender la física dentro del motor",en:"2D Pinball game made using Godot to understand physics inside the engine"},details:{es:"Juego de pinball 2D en el que el usuario controla una pelota que tiene que rebotar en las palas y romper los bloques. Cuenta con un entorno 2D, una pelota animada en 2D y unas palas también animadas proceduralmente",en:"The game is a 2D pinball game where the user controls a ball that has to bounce on the paddles and break the blocks. The game features a 2D environment, a 2D animated ball and a 2D animated paddles also procedurally animated."},stack:["Godot","GDScript","Animation","Physics"],links:[]},{id:"las-aventuras-del-seton-magico",title:"The Adventures of the Magic Seton",year:2021,summary:{es:"Juego 2D hecho con Vue.js para entender el framework",en:"2D Game made using Vue.js to understand the framework"},details:{es:"Juego 2D hecho con el framework Vue.js para entender cómo funciona; es un juego de plataformas 2D de 2 niveles, con enemigos y controles limitados. El diseño del personaje principal lo dibujé entero yo, fotograma a fotograma. Cuenta con un entorno 2D, un personaje animado en 2D y enemigos 2D también animados proceduralmente",en:"The game is a 2D game made using the Vue.js framework to allow me to understand how it works, its a 2 level 2D plataformer with limited enemeies and controlls. The main character design is drawn entirelly by me frame by frame. The game features a 2D environment, a 2D animated character and a 2D animated enemies also procedurally animated."},stack:["Vue.js","JavaScript","Animation","Physics"],links:[]},{id:"dungeon-hunter-godot",title:"Dungeon Hunter",year:2021,summary:{es:"Juego 2.5D hecho con Godot para entender el motor",en:"2.5D Game made using Godot to understand the engine"},details:{es:"Juego 2.5D hecho con el motor Godot para entender cómo funciona; es un juego 2.5D al estilo Diablo de 2 niveles. El diseño del personaje principal lo dibujé entero yo, fotograma a fotograma. Cuenta con un entorno 2.5D, un personaje animado en 2.5D y enemigos 2.5D",en:"The game is a 2.5D game made using the Godot engine to allow me to understand how it works, its a 2 level 2.5D Diablo-like game. The main character design is drawn entirelly by me frame by frame. The game features a 2.5D environment, a 2.5D animated character and a 2.5D animated enemies."},stack:["Godot","GDScript","2.5D Videogame"],links:[]}],skills:[{id:"languages",name:{es:"Lenguajes de programación",en:"Programming languages"},items:[{name:{es:"C#",en:"C#"},level:9},{name:{es:"JavaScript",en:"JavaScript"},level:9},{name:{es:"PHP",en:"PHP"},level:8},{name:{es:"HTML/CSS",en:"HTML/CSS"},level:8},{name:{es:"SQL",en:"SQL"},level:7},{name:{es:"Python",en:"Python"},level:6},{name:{es:"C++",en:"C++"},level:5},{name:{es:"Kotlin",en:"Kotlin"},level:3}]},{id:"frameworks",name:{es:"Frameworks y plataformas",en:"Frameworks & platforms"},items:[{name:{es:"Laravel",en:"Laravel"},level:8},{name:{es:"React",en:"React"},level:8},{name:{es:"WordPress",en:"WordPress"},level:8},{name:{es:"ServiceNow",en:"ServiceNow"},level:8}]},{id:"engines",name:{es:"Motores y herramientas",en:"Engines & tools"},items:[{name:{es:"Unity",en:"Unity"},level:9},{name:{es:"Git",en:"Git"},level:9},{name:{es:"Godot",en:"Godot"},level:7},{name:{es:"Unreal Engine",en:"Unreal Engine"},level:7},{name:{es:"Blender",en:"Blender"},level:6},{name:{es:"Substance Painter",en:"Substance Painter"},level:5},{name:{es:"Adobe Suite",en:"Adobe Suite"},level:6}]},{id:"areas",name:{es:"Áreas de desarrollo",en:"Development areas"},items:[{name:{es:"Desarrollo de videojuegos",en:"Game development"},level:9},{name:{es:"Diseño de juegos",en:"Game design"},level:8},{name:{es:"Desarrollo de aplicaciones",en:"Application development"},level:8},{name:{es:"Desarrollo de software",en:"Software development"},level:8},{name:{es:"Gestión de bases de datos",en:"Database management"},level:7},{name:{es:"Modelado 3D",en:"3D modeling"},level:6},{name:{es:"Animación 3D",en:"3D animations"},level:6}]},{id:"security",name:{es:"Ciberseguridad",en:"Cybersecurity"},items:[{name:{es:"Pentesting",en:"Pentesting"},level:7},{name:{es:"Evaluación de vulnerabilidades",en:"Vulnerability assessment"},level:6},{name:{es:"Auditoría de seguridad",en:"Security auditing"},level:6},{name:{es:"Metasploit",en:"Metasploit"},level:6},{name:{es:"Nmap",en:"Nmap"},level:6},{name:{es:"Burp Suite",en:"Burp Suite"},level:6}]},{id:"spoken",name:{es:"Idiomas",en:"Spoken languages"},items:[{name:{es:"Español",en:"Español"},level:10},{name:{es:"Gallego",en:"Gallego"},level:10},{name:{es:"Inglés",en:"Inglés"},level:10},{name:{es:"Catalán",en:"Catalán"},level:9},{name:{es:"Italiano",en:"Italiano"},level:6}]}],timeline:[{id:"global-fun-partners",kind:"work",title:{es:"Desarrollador Full Stack",en:"Full Stack Developer"},org:"Global Fun Partners",start:"2025-02",end:null,description:{es:"Desarrollé y mantuve varias webs corporativas con WordPress, cuidando el rendimiento y el diseño responsive. Construí un portal privado de empresa con Laravel (backend) y React (frontend) para agilizar las operaciones internas de una distribuidora nacional de máquinas recreativas. Diseñé e implementé soluciones a medida para el área privada del CBU Bàsquet Lloret, mejorando la gestión de equipo y los flujos de comunicación",en:"Developed and maintained multiple corporate websites using WordPress, ensuring performance optimization and responsive design. Built a private company portal using Laravel (backend) and React (frontend) to streamline internal operations for a nationwide amusement machine distribution company. Designed and implemented custom solutions for the private area of CBU Bàsquet Lloret, enhancing team management and communication workflows."}},{id:"master-data-science-udg",kind:"education",title:{es:"Máster en Ciencia de Datos e Inteligencia Artificial",en:"Master's in Data Science and Artificial Intelligence"},org:"Girona University",start:"2025",end:null,description:{es:"Máster en curso en la Universidad de Girona, donde me introduzco a fondo en algoritmos de aprendizaje automático, redes neuronales y técnicas de análisis de datos",en:"Currently pursuing a Master in Data Science and Artificial Intelligence at Girona University, diving deep into machine learning algorithms, neural networks and data analysis techniques."}},{id:"game-design-development-udg",kind:"education",title:{es:"Grado en Diseño y Desarrollo de Videojuegos",en:"Game Design and Development"},org:"Girona University",start:"2019",end:"2025-06",description:{es:"Grado en Diseño y Desarrollo de Videojuegos con nota media 7/10. Me dio la base en programación, modelado 3D, animación y mecánicas de juego",en:"Bachelor degree in Game Design and Development with a GPA of 7/10. It gave me a solid foundation in programming, 3D modeling, animation and game mechanics."}},{id:"noddonn-technology-consulting",kind:"work",title:{es:"Desarrollador de Soluciones de TI",en:"IT Solutions Developer"},org:"Noddon Technology Consulting",start:"2024-03",end:"2025-02",description:{es:"Desarrollé soluciones de TI para Banco Sabadell. Implementé soluciones de TI con tecnologías ServiceNow y JavaScript. Conocí el funcionamiento interno del sector: flujos de trabajo, despliegues a producción desde entornos de desarrollo, gestión de bases de datos y desarrollo de aplicaciones a partir de ellos",en:"Developed IT Solutions for Banco Sabadell. Implemented IT Solutions using ServiceNow + JavaScript technologies. Gained an understanding of the inner workings of the industry, including workflows, production deployments from development environments, database management and application development based on them."}},{id:"study-abroad-cassino",kind:"education",title:{es:"Estancia en el extranjero",en:"Study Abroad"},org:"Università degli Studi di Cassino e del Lazio Meridionale",start:"2022-09",end:"2023-02",description:{es:"Asignaturas cursadas como estudiante de intercambio en la Università degli Studi di Cassino e del Lazio Meridionale, en Cassino (Italia)",en:"Study abroad coursework at Università degli Studi di Cassino e del Lazio Meridionale, in Cassino (Italy)."}},{id:"semi-pro-basketball",kind:"sport",title:{es:"Jugador de baloncesto semiprofesional",en:"Semi-pro Basketball Player"},org:"Various locations, Spain / Ireland / Italy",start:"2017-09",end:null,description:{es:"He jugado en ligas semiprofesionales de baloncesto, con disciplina, trabajo en equipo y pensamiento estratégico. He compaginado entrenamientos intensos y partidos competitivos con las responsabilidades académicas",en:"Competed in semi-professional basketball leagues, showcasing discipline, teamwork and strategic thinking. Balanced intensive training schedules and competitive games with academic responsibilities."}},{id:"st-patricks-centre",kind:"work",title:{es:"Profesor voluntario (educación especial)",en:"Teacher (Volunteer)"},org:"St. Patricks Centre",start:"2017-03",end:"2017-04",description:{es:"Fui voluntario como profesor de alumnado con necesidades educativas especiales en Kilkenny: ayudé a planificar clases, preparé actividades educativas adaptadas y apoyé al alumnado en el desarrollo de habilidades esenciales. Trabajé junto al profesorado para crear un entorno de aprendizaje inclusivo y motivador, fomentando la paciencia, la empatía y la adaptabilidad. Galardonado con los Gaisce Awards del gobierno irlandés por el trabajo voluntario del curso",en:"Volunteered as a teacher for special education students in Kilkenny, assisting with lesson planning, delivering tailored educational activities and supporting students in developing essential skills. Worked closely with staff to create an inclusive and engaging learning environment, fostering patience, empathy and adaptability. Awarded Gaisce Awards given by the Irish government for the volunteer work of the school year."}},{id:"irish-defence-forces",kind:"work",title:{es:"Oficial de oficina (voluntario)",en:"Office Worker (Volunteer)"},org:"Irish Defence Forces",start:"2017-02",end:"2017-03",description:{es:"Asistí al personal administrativo del cuartel militar de Kilkenny en tareas de oficina: organizar y archivar documentación, gestionar registros y facilitar la comunicación entre departamentos. Conocí los flujos de trabajo administrativos de las fuerzas armadas y desarrollé habilidades de organización y trabajo en equipo en un entorno estructurado y disciplinado",en:"Assisted administrative personnel in the Kilkenny Army Barracks with various office tasks, including organizing and filing paperwork, managing records and facilitating communication between departments. Gained insight into military administrative workflows and developed organizational and teamwork skills in a structured and disciplined environment."}},{id:"study-abroad-st-kierans",kind:"education",title:{es:"Estancia en el extranjero",en:"Study Abroad"},org:"St Kieran's College",start:"2016-09",end:"2017-06",description:{es:"Asignaturas cursadas como estudiante de intercambio en St Kieran’s College, en Kilkenny (Irlanda)",en:"Study abroad coursework at St Kieran's College, in Kilkenny (Ireland)."}},{id:"ies-frei-martin-sarmiento",kind:"education",title:{es:"Bachillerato (nota media 8,25/10)",en:"Secondary Education (GPA 8.25/10)"},org:"IES Frei Martín Sarmiento",start:"2014-09",end:"2019-06",description:{es:"Bachillerato en el IES Frei Martín Sarmiento (Pontevedra) con una nota media de 8,25/10",en:"Secondary education at IES Frei Martín Sarmiento (Pontevedra) with a GPA of 8.25/10."}},{id:"debate-team",kind:"sport",title:{es:"Integrante del equipo de debate",en:"Debate Team Member"},org:"Pontevedra, Galicia",start:"2014-09",end:"2019-06",description:{es:"Representé al centro en debates regionales y nacionales, incluida una sesión en el Parlamento de Galicia. Desarrollé la oratoria, el pensamiento crítico y la comunicación persuasiva, y trabajé en equipo investigando y preparando argumentos",en:"Represented the school at regional and national-level debates, including a debate held at the Galician Parliament. Developed public speaking, critical thinking and persuasive communication skills, and collaborated with teammates to research and prepare arguments."}}]},Xv={es:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]};function $v(i,e){const t=/^(\d{4})-(\d{2})$/.exec(i);if(!t)return i;const n=Xv[e][Number(t[2])-1];return n?`${n} ${t[1]}`:i}const qv=["work","education","sport"],jv=()=>{const i=[...yn.projects].sort((t,n)=>n.year-t.year||t.title.localeCompare(n.title)),e=[...new Set(i.map(t=>t.year))];return{todos:i,porAnio:e.map(t=>({year:t,items:i.filter(n=>n.year===t)}))}},Yv=()=>{const i=[...yn.timeline].sort((e,t)=>e.start<t.start?1:e.start>t.start?-1:0);return{todos:i,porTipo:qv.map(e=>({kind:e,items:i.filter(t=>t.kind===e)})).filter(e=>e.items.length>0)}},sf=()=>{const i=yn.person;return{name:i.name,initials:i.initials,jerseyNumber:i.jerseyNumber,role:i.role,location:i.location,tagline:i.tagline}},Kv="court.lastSend",Ho=i=>i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function Zv(){return`
  <form data-contact novalidate>
    <label>${Ho(ne("form_name"))}<input name="name" autocomplete="name" required maxlength="80" /></label>
    <label>${Ho(ne("form_email"))}<input name="email" type="email" autocomplete="email" required maxlength="120" /></label>
    <label>${Ho(ne("form_message"))}<textarea name="message" rows="5" required minlength="10" maxlength="2000"></textarea></label>
    <input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" />
    <button type="submit" class="btn">${Ho(ne("form_send"))}</button>
    <p class="form-status" data-status role="status" aria-live="polite"></p>
  </form>`}function Jv(i){const e=i.querySelector("form[data-contact]");if(!e)return;const t=e.querySelector("[data-status]");e.querySelector('button[type="submit"]'),e.addEventListener("submit",async n=>{n.preventDefault();const s=new FormData(e);if(s.get("_gotcha"))return;const r=String(s.get("name")??"").trim(),o=String(s.get("email")??"").trim(),a=String(s.get("message")??"").trim();if(!r||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(o)||a.length<10){t.textContent=ne("form_invalid");return}try{const c=Number(localStorage.getItem(Kv)??0);if(Date.now()-c<6e4){t.textContent=ne("form_wait");return}}catch{}const l=`mailto:${yn.person.email}?subject=${encodeURIComponent(`Portfolio · ${r}`)}&body=${encodeURIComponent(a)}`;{window.location.href=l;return}})}const Go=i=>`<span lang="es">${ze(i.es)}</span><span lang="en">${ze(i.en)}</span>`,ze=i=>i.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Qv=i=>/^(https?:|mailto:)/i.test(i)?i:"#",la=i=>`section_${i}`,eM=i=>`sign_${i}`,Fc={get:()=>null};let tM=0;function ma(i){if(i.length<=1)return i[0]?.html??"";const e=`t${++tM}`,t=i.map((s,r)=>`<button type="button" role="tab" id="${e}-t${r}" aria-controls="${e}-p${r}" aria-selected="${r===0?"true":"false"}" tabindex="${r===0?0:-1}">${ze(s.label)}</button>`).join(""),n=i.map((s,r)=>`<div class="tabpanel" role="tabpanel" id="${e}-p${r}" aria-labelledby="${e}-t${r}" tabindex="0"${r===0?"":" hidden"}>${s.html}</div>`).join("");return`<div class="tabs" data-tabs>
    <div class="tabs__list" role="tablist" aria-label="${ze(ne("tabs_label"))}">${t}</div>
    <div class="tabs__panels">${n}</div>
  </div>`}function nM(i){const e=i.querySelector(".panel__body");for(const t of i.querySelectorAll("[data-tabs]")){const n=t.querySelector('[role="tablist"]');if(!n)continue;const s=[...n.querySelectorAll('[role="tab"]')],r=(o,a)=>{for(const[l,c]of s.entries()){const u=o===l;c.setAttribute("aria-selected",String(u)),c.tabIndex=u?0:-1;const d=c.getAttribute("aria-controls"),h=d?t.querySelector(`#${d}`):null;h&&(h.hidden=!u)}a&&s[o]?.focus(),e&&(e.scrollTop=0)};n.addEventListener("click",o=>{const a=o.target.closest('[role="tab"]');if(!a)return;const l=s.indexOf(a);l>=0&&r(l,!1)}),n.addEventListener("keydown",o=>{const a=s.indexOf(document.activeElement);if(a<0)return;const l=s.length-1;let c=-1;o.key==="ArrowRight"?c=a===l?0:a+1:o.key==="ArrowLeft"?c=a===0?l:a-1:o.key==="Home"?c=0:o.key==="End"&&(c=l),!(c<0)&&(o.preventDefault(),r(c,!0))})}}const rf=i=>`<a class="chip chip--link" href="${ze(Qv(i.url))}" target="_blank" rel="noopener noreferrer">${ze(Qn(i.label))}</a>`,Fd=i=>$v(i,gl()),iM=i=>`<dl class="highlights">${i.map(e=>`<div><dt>${ze(Qn(e.label))}</dt><dd>${ze(Qn(e.value))}</dd></div>`).join("")}</dl>`,sM=i=>`
  <article class="card proj">
    <header><h3>${ze(i.title)}</h3><span class="proj__year">${i.year}</span></header>
    <p class="proj__summary">${ze(Qn(i.summary))}</p>
    ${i.details?`<details class="proj__more"><summary>${ze(ne("proj_details"))}</summary><p>${ze(Qn(i.details))}</p></details>`:""}
    <p class="chips">${i.stack.map(e=>`<span class="chip">${ze(e)}</span>`).join("")}</p>
    ${i.links.length?`<p class="chips">${i.links.map(rf).join("")}</p>`:""}
  </article>`;function rM(){const{todos:i,porAnio:e}=jv(),t=n=>`<div class="grid">${n.map(sM).join("")}</div>`;return ma([{label:`${ne("tabs_all")} · ${i.length}`,html:t(i)},...e.map(n=>({label:`${n.year} · ${n.items.length}`,html:t(n.items)}))])}function oM(){return ma(yn.skills.map(i=>({label:Go(i.name),html:`<h3 class="tabpanel__title">${ze(Go(i.name))}</h3><ul class="skills">${i.items.map(e=>`<li class="stat">
        <span class="stat__name">${ze(Go(e.name))}</span>
        <span class="bar" role="meter" aria-valuemin="1" aria-valuemax="10" aria-valuenow="${e.level}" aria-label="${ze(ne("skills_level"))}: ${ze(Go(e.name))} ${e.level}/10"><i style="width:${e.level*10}%"></i></span>
        <b class="stat__lv">${e.level}<small>/10</small></b>
      </li>`).join("")}</ul>`})))}const aM=i=>`
  <li>
    <header>
      <span class="badge badge--${i.kind}">${ze(ne(`kind_${i.kind}`))}</span>
      <span class="tl__when">${ze(Fd(i.start))} – ${i.end?ze(Fd(i.end)):ze(ne("present"))}</span>
    </header>
    <h3>${ze(Qn(i.title))}</h3>
    <p class="tl__org">${ze(i.org)}</p>
    <p>${ze(Qn(i.description))}</p>
  </li>`;function lM(){const{todos:i,porTipo:e}=Yv(),t=n=>`<ol class="timeline">${n.map(aM).join("")}</ol>`;return ma([{label:`${ne("tabs_all")} · ${i.length}`,html:t(i)},...e.map(n=>({label:`${ne(`kind_${n.kind}`)} · ${n.items.length}`,html:t(n.items)}))])}function cM(){const i=sf(),e=`<div class="playercard">
    <div class="jersey" aria-label="${ze(ne("about_number"))}">${ze(i.jerseyNumber)}</div>
    <div><h3>${ze(i.name)}</h3><p class="muted">${ze(Qn(i.role))} · ${ze(i.location)}</p></div>
  </div>`,t=[];for(const n of kf){const s=yn.about.topics.find(r=>r.id===n.id)?.text.filter(r=>r.es.trim()!==""&&r.en.trim()!=="")??[];s.length&&t.push({label:Qn(n.label),html:s.map(r=>`<p class="prose">${ze(Qn(r))}</p>`).join("")})}return t.push({label:ne("tab_facts"),html:iM(yn.about.highlights)}),e+ma(t)}function uM(){const i=Fc.get();if(!i)return`<p class="lead">${ze(ne("stats_empty"))}</p>`;const e=i.attempted>0?`${Math.round(i.made/i.attempted*100)}%`:ze(ne("stats_left")),t=`<dl class="highlights highlights--big">
      <div><dt>${ze(ne("stats_shots"))}</dt><dd>${i.made}</dd></div>
      <div><dt>${ze(ne("stats_attempts"))}</dt><dd>${i.attempted}</dd></div>
      <div><dt>${ze(ne("stats_accuracy"))}</dt><dd>${e}</dd></div>
      <div><dt>${ze(ne("stats_sections"))}</dt><dd>${i.visited} / ${i.total}</dd></div>
      <div><dt>${ze(ne("stats_contest"))}</dt><dd>${i.contestBest>0?i.contestBest:ze(ne("stats_left"))}</dd></div>
    </dl>`;return i.attempted===0&&i.made===0?`<p class="lead">${ze(ne("stats_empty"))}</p>${t}<p class="muted">${ze(ne("stats_hint"))}</p>`:`${t}<p class="muted">${ze(ne("stats_hint"))}</p>`}function dM(){return`<div class="cv-download">
    <a class="chip chip--link" href="documents/CV_eng.pdf" download="CV_Daniel_Noya.pdf">${ze(ne("cv_download"))}</a>
    <span class="cv-download__note">${ze(ne("cv_note"))}</span>
  </div>
  <h3 class="tabpanel__title">${ze(ne("contact_direct"))}</h3>
  <p class="chips"><a class="chip chip--link" href="mailto:${ze(yn.person.email)}">${ze(yn.person.email)}</a>${yn.person.social.map(rf).join("")}</p>
  ${Zv()}`}const hM={projects:rM,skills:oM,stats:uM,about:cM,experience:lM,contact:dM};class fM{constructor(e,t){this.onClose=t,this.el=document.createElement("div"),this.el.className="panel",this.el.hidden=!0,e.appendChild(this.el),this.el.addEventListener("click",n=>{(n.target===this.el||n.target.closest("[data-close]"))&&this.close()}),document.addEventListener("keydown",this.onKey)}el;current=null;opener=null;get isOpen(){return this.current!==null}open(e){this.opener=document.activeElement,this.current=e;const t=ne(la(e));this.el.innerHTML=`<div class="panel__card panel--${e}" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <header class="panel__head"><h2 id="panel-title">${ze(t)}</h2>
      <button type="button" class="panel__close" data-close aria-label="${ze(ne("close"))}">✕</button></header>
      <div class="panel__body">${hM[e]()}</div></div>`,this.el.hidden=!1,e==="contact"&&Jv(this.el),nM(this.el),this.el.querySelector("[data-close]")?.focus()}close(){this.current&&(this.current=null,this.el.hidden=!0,this.el.innerHTML="",this.opener?.focus?.(),this.onClose())}onKey=e=>{if(this.current){if(e.key==="Escape"){this.close();return}if(e.key==="Tab"){const t=[...this.el.querySelectorAll("a[href],button:not([disabled]),input,textarea,summary")].filter(r=>!r.classList.contains("hp")&&r.offsetParent!==null);if(!t.length)return;const n=t[0],s=t[t.length-1];e.shiftKey&&document.activeElement===n?(e.preventDefault(),s.focus()):!e.shiftKey&&document.activeElement===s&&(e.preventDefault(),n.focus())}}}}const pM=45/1e3,mM=520,gM=380;function _M(i){const e=Fc.get();return i==="tiros"?!e||e.attempted===0?ne("dlg_data_shots_none"):Oi("dlg_data_shots",{made:e.made,attempted:e.attempted,pct:Math.round(e.made/e.attempted*100)}):!e||e.contestBest===0?ne("dlg_data_contest_none"):Oi("dlg_data_contest",{best:e.contestBest})}const xM=[{host:"dlg_open"},{dato:"tiros"},{dato:"concurso"},{host:"dlg_q1",opciones:["dlg_a1a","dlg_a1b"]},{host:"dlg_r1"},{host:"dlg_q2",opciones:["dlg_a2a","dlg_a2b"]},{host:"dlg_r2"},{host:"dlg_q3",opciones:["dlg_a3a","dlg_a3b"]},{host:"dlg_r3"}];class vM{constructor(e,t){this.onTerminar=t,this.el=document.createElement("div"),this.el.className="dlgbox",this.el.hidden=!0,this.el.tabIndex=-1,this.el.dataset.dlgbox="",this.el.innerHTML=`
      <div class="dlgbox__log" data-dlg-log role="log" aria-live="polite" tabindex="-1"></div>
      <div class="dlgbox__now" data-dlg-now aria-hidden="true"></div>
      <div class="dlgbox__choices" data-dlg-choices></div>
      <button type="button" class="btn dlg__skip" data-dlg-skip></button>`,e.appendChild(this.el),this.log=this.el.querySelector("[data-dlg-log]"),this.now=this.el.querySelector("[data-dlg-now]"),this.choices=this.el.querySelector("[data-dlg-choices]"),this.skip=this.el.querySelector("[data-dlg-skip]"),this.etiquetas(),this.el.addEventListener("click",n=>{n.target.closest("button")||this.completar()}),this.skip.addEventListener("click",()=>this.completar()),this.el.addEventListener("keydown",n=>{n.target!==this.el||n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),this.completar())}),document.addEventListener("keydown",this.onKey)}el;log;now;choices;skip;vivo=null;pendientes=null;esperando=!1;turno=0;reloj=0;hasta=0;activo=!1;etiquetas(){this.log.setAttribute("aria-label",ne("dlg_label")),this.skip.textContent=ne("dlg_skip")}close(){this.activo&&(this.activo=!1,this.vivo=null,this.pendientes=null,this.esperando=!1,this.el.hidden=!0,this.now.replaceChildren(),this.choices.replaceChildren(),this.log.replaceChildren())}start(){this.close(),this.turno=0,this.hasta=0,this.etiquetas(),this.activo=!0,this.el.hidden=!1,this.siguiente(),this.el.focus({preventScroll:!0})}tick(e,t){if(this.reloj=e,!this.activo)return;const n=this.vivo;if(!n){!this.esperando&&this.pendientes===null&&e>=this.hasta&&this.siguiente();return}n.arranque<0&&(n.arranque=e);const s=t?n.completo.length:Math.min(n.completo.length,Math.floor((e-n.arranque)*pM));s!==n.escritos&&(n.escritos=s,n.texto.textContent=n.completo.slice(0,s)),!(s<n.completo.length)&&(this.cerrarLinea(),this.pendientes&&this.mostrar(this.pendientes))}hablar(e,t,n){const s=document.createElement("div");s.className=`dlg__line${n?" dlg__line--player":""}`,s.setAttribute("aria-hidden","true");const r=document.createElement("span");r.className="dlg__who",r.textContent=e;const o=document.createElement("p");o.className="dlg__text",s.append(r,o),this.now.replaceChildren(s),this.vivo={el:s,texto:o,completo:t,escritos:-1,arranque:-1,pausa:n?gM:mM}}cerrarLinea(){const e=this.vivo;e&&(this.vivo=null,e.texto.textContent=e.completo,e.el.removeAttribute("aria-hidden"),this.now.replaceChildren(),this.log.appendChild(e.el),this.log.scrollTop=this.log.scrollHeight,this.hasta=this.reloj+e.pausa)}siguiente(){if(!this.activo)return;const e=xM[this.turno++];if(!e){this.finalizar();return}this.hablar(ne("dlg_host"),"dato"in e?_M(e.dato):ne(e.host),!1),this.pendientes=e.opciones??null}mostrar(e){this.pendientes=null,this.esperando=!0;for(const t of e){const n=document.createElement("button");n.type="button",n.className="btn",n.textContent=ne(t),n.addEventListener("click",()=>this.elegir(t)),this.choices.appendChild(n)}this.choices.firstElementChild?.focus()}elegir(e){this.choices.replaceChildren(),this.log.focus(),this.esperando=!1,this.hablar(sf().name,ne(e),!0),this.pendientes=null}completar(){if(!this.activo)return;if(this.vivo&&(this.cerrarLinea(),this.pendientes)){this.mostrar(this.pendientes);return}this.esperando||(this.hasta=this.reloj)}finalizar(){this.close(),this.onTerminar()}onKey=e=>{!this.activo||e.key!=="Escape"||(e.preventDefault(),this.finalizar())}}const ar=9.81,xt={length:28,width:15,halfL:14,halfW:7.5},Nt={y:3.05,radius:.225,fromBaseline:1.575,boardFromBaseline:1.2},tn={radius:.12,visualScale:1.7},MM=.2,of=11,yM=.7,ta=.3,na=5,af=3.4,SM=.7,Od=2.9,bM=7.5,EM=.55,TM=.85,Mn={segundos:60,balones:3,puntos:1,puntosDinero:2,alcance:1.2},AM=6.75,Hs={speed:5.2,bounds:{minX:-16,maxX:16,minZ:-8.8,maxZ:10.6}},cn={fov:32,offset:[0,12.4,10.2],lerp:4,clampX:11,minZ:-4,maxZ:5,advance:3.2,chargeZoom:.9,portraitGrow:.5,tvFov:50},kt=i=>i*(xt.halfL-Nt.fromBaseline),lf=i=>i*(xt.halfL-Nt.boardFromBaseline),ca=1,Zn={x:kt(ca)-.32,z:6.9},gi=(()=>{const i=kt(ca),e=AM*Math.SQRT1_2;return[{x:Zn.x,z:Zn.z},{x:i-e,z:e},{x:i-6.9,z:0},{x:i-e,z:-e},{x:i-2.4,z:-6.6}]})(),fs=["projects","skills","about","experience","contact","stats"],Gs=[{id:"projects",kind:"shoot",x:kt(-1),z:0,radius:4.5,side:-1},{id:"stats",kind:"walk",x:kt(1),z:0,radius:4.5},{id:"skills",kind:"walk",x:0,z:-9,radius:2.4},{id:"about",kind:"walk",x:0,z:8.4,radius:2.4},{id:"experience",kind:"walk",x:-10,z:-8.2,radius:1.8},{id:"contact",kind:"interview",x:9,z:8.3,radius:1.6}],Gr={x:0,z:-9},Ws={playerSpot:[9,8.3],cameraPos:[5.4,2.1,8.9],cameraLook:[9.2,1.3,9],pov:{pos:[11,1.65,10],look:[9,1.3,8.35]}},Vo={projects:{pos:[-6.36,2.3,3.5],look:[-12.43,2.55,0],face:-2*Math.PI/3},stats:{pos:[6.36,2.3,-3.5],look:[12.43,2.55,0],face:Math.PI/3},skills:{pos:[-2.48,1.75,-4.71],look:[0,1.15,-9],face:2.617},about:{pos:[4.25,1.75,1.04],look:[0,1.05,8.4],face:-.524},experience:{pos:[-6.9,2.49,.02],look:[-10,1.94,-8.2],face:-2.781},contact:{pos:Ws.cameraPos,look:Ws.cameraLook,face:0}},Bd=(i,e,t)=>Math.min(t,Math.max(e,i)),zd=540,Wo={sound:'<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges"><rect x="2" y="6" width="3" height="4" fill="currentColor"/><path d="M5 6 L9 3 L9 13 L5 10 Z" fill="currentColor"/><path d="M11 5 L12.5 5 L12.5 11 L11 11 Z" fill="currentColor"/><path d="M14 4 L15 4 L15 12 L14 12 Z" fill="currentColor"/></svg>',muted:'<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges"><rect x="2" y="6" width="3" height="4" fill="currentColor"/><path d="M5 6 L9 3 L9 13 L5 10 Z" fill="currentColor"/><path d="M11 5 L13 7 M13 5 L11 7" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M11 9 L13 11 M13 9 L11 11" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',menu:'<svg viewBox="0 0 16 16" width="19" height="19" aria-hidden="true" shape-rendering="crispEdges"><rect x="2" y="3" width="12" height="2" fill="currentColor"/><rect x="2" y="7" width="12" height="2" fill="currentColor"/><rect x="2" y="11" width="12" height="2" fill="currentColor"/></svg>',ball:'<svg viewBox="0 0 16 16" width="34" height="34" aria-hidden="true" shape-rendering="crispEdges"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.9"/><rect x="7.1" y="1.3" width="1.8" height="13.4" fill="currentColor"/><path d="M2 4.6 Q5.6 8 2 11.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M14 4.6 Q10.4 8 14 11.4" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'};class wM{constructor(e,t,n,s=!1){this.root=e,this.cb=t,this.compacto=s,this.muted=n,this.root.innerHTML=`
      <div class="hud">
        <div class="hud__top">
          <span class="chip" data-progress></span>
          <div class="hud__buttons">
            <button type="button" class="icon" data-mute></button>
            <button type="button" class="icon" data-lang></button>
            <button type="button" class="icon" data-menu-btn aria-haspopup="true" aria-expanded="false"></button>
          </div>
        </div>
        <nav class="menu" data-menu hidden></nav>
        <div class="hud__labels" data-labels></div>
        <div class="hud__record" data-record hidden>
          <span class="hud__record-tag"></span><span class="hud__record-num" data-record-num></span>
        </div>
        <div class="takeover" data-takeover hidden>
          <span class="takeover__tag"></span>
          <span class="takeover__pips" data-pips></span>
        </div>
        <div class="prompt" data-prompt hidden></div>
        <div class="meter" data-meter hidden aria-hidden="true"><i class="charge" data-charge></i><i class="sweet" data-sweet style="left:${((.5-ta/2)*100).toFixed(1)}%;width:${(ta*100).toFixed(1)}%"></i><span class="ticks"></span><b class="needle" data-needle></b></div>
        <div class="toast" data-toast hidden></div>
        <div class="subs" data-subs hidden aria-hidden="true">
          <span class="subs__who"></span><span class="subs__line" data-subs-line></span>
        </div>
        <div class="contest" data-contest hidden aria-hidden="true">
          <p class="contest__tag"></p>
          <p class="contest__row"><span class="contest__time" data-contest-time>1:00</span><span class="contest__pts" data-contest-pts></span></p>
          <p class="contest__row"><span data-contest-rack></span><span data-contest-balls></span></p>
          <p class="contest__hint" data-contest-hint></p>
        </div>
        <div class="broadcast" data-broadcast hidden aria-hidden="true">
          <span class="broadcast__rec"><i></i>${ne("live_rec")}</span>
          <span class="broadcast__channel">${ne("live_channel")}</span>
          <span class="broadcast__time" data-broadcast-time>00:00:00</span>
          <span class="broadcast__now">${ne("live_now")}</span>
        </div>
        <div class="tvfx" aria-hidden="true"></div>
        <div class="sr-only" data-live aria-live="polite"></div>
      </div>`;const r=o=>this.root.querySelector(o);this.prompt=r("[data-prompt]"),this.meter=r("[data-meter]"),this.needle=r("[data-needle]"),this.sweet=r("[data-sweet]"),this.chargeEl=r("[data-charge]"),this.recordEl=r("[data-record]"),r("[data-record] .hud__record-tag").textContent=ne("record_chip"),this.takeoverEl=r("[data-takeover]"),this.pipsEl=r("[data-pips]"),r("[data-takeover] .takeover__tag").textContent=ne("takeover_tag");for(let o=0;o<na;o++)this.pipsEl.appendChild(document.createElement("i"));this.toastEl=r("[data-toast]"),this.subsEl=r("[data-subs]"),this.subsLineEl=r("[data-subs-line]"),r("[data-subs] .subs__who").textContent=ne("cmt_tag"),this.broadcastEl=r("[data-broadcast]"),this.timeEl=r("[data-broadcast-time]"),this.contestEl=r("[data-contest]"),r("[data-contest] .contest__tag").textContent=ne("contest_tag"),this.live=r("[data-live]"),this.progress=r("[data-progress]"),this.menu=r("[data-menu]"),this.muteBtn=r("[data-mute]"),r("[data-lang]").addEventListener("click",()=>Hf(gl()==="es"?"en":"es")),this.muteBtn.addEventListener("click",()=>{this.muted=this.cb.onToggleMute(),this.refreshText()}),this.menuBtn=r("[data-menu-btn]"),this.menuBtn.addEventListener("click",()=>{const o=this.menu.hidden;this.menu.hidden=!o,this.menuBtn.setAttribute("aria-expanded",String(o))}),this.menu.addEventListener("click",o=>{const a=o.target.closest("[data-section]");a&&(this.closeMenu(),this.cb.onMenuSelect(a.dataset.section))}),document.addEventListener("keydown",o=>{o.key==="Escape"&&!this.menu.hidden&&this.closeMenu()}),document.addEventListener("pointerdown",o=>{if(this.menu.hidden)return;const a=o.target;this.menu.contains(a)||this.menuBtn.contains(a)||this.closeMenu()}),window.addEventListener("langchange",()=>this.refreshText()),this.refreshText()}labels=new Map;prompt;meter;needle;sweet;chargeEl;recordEl;takeoverEl;pipsEl;toastEl;subsEl;subsLineEl;live;broadcastEl;timeEl;lastSecond=-1;contestEl;contestTxt="";progress;menu;menuBtn;muteBtn;toastTimer=0;subsTimer=0;progressValue=0;muted;visited=new Set;locked=new Set;touchEl=null;actBtn=null;shootBtn=null;refreshText(){const e=t=>this.root.querySelector(t);e("[data-lang]").textContent=gl()==="es"?"EN":"ES",e("[data-lang]").setAttribute("aria-label",ne("lang_toggle")),this.muteBtn.innerHTML=this.muted?Wo.muted:Wo.sound,this.muteBtn.setAttribute("aria-label",this.muted?ne("unmute"):ne("mute")),this.menuBtn.innerHTML=Wo.menu,this.menuBtn.setAttribute("aria-label",ne("menu")),this.refreshMenu(),this.progress.textContent=`${ne("progress")} ${this.progressValue}/${fs.length}`;for(const{text:t,key:n}of this.labels.values())t.textContent=ne(n);this.recordEl.querySelector(".hud__record-tag").textContent=ne("record_chip"),this.takeoverEl.querySelector(".takeover__tag").textContent=ne("takeover_tag"),this.broadcastEl.querySelector(".broadcast__rec").innerHTML=`<i></i>${ze(ne("live_rec"))}`,this.broadcastEl.querySelector(".broadcast__channel").textContent=ne("live_channel"),this.broadcastEl.querySelector(".broadcast__now").textContent=ne("live_now"),this.contestEl.querySelector(".contest__tag").textContent=ne("contest_tag"),this.subsEl.querySelector(".subs__who").textContent=ne("cmt_tag"),this.actBtn&&(this.actBtn.textContent=ne("touch_action")),this.shootBtn?.setAttribute("aria-label",ne("touch_shoot")),this.contestTxt=""}closeMenu(){this.menu.hidden=!0,this.menuBtn.setAttribute("aria-expanded","false")}refreshMenu(){const e=fs.map(t=>{const n=this.visited.has(t),s=!n&&this.locked.has(t),r=n?"done":s?"locked":"open",o=n?"✓":s?"✕":"○",a=ne(n?"state_done":s?"state_locked":"state_open");return`<button type="button" data-section="${t}" class="menu__item menu__item--${r}">
        <span class="menu__mark" aria-hidden="true">${o}</span>${ze(ne(la(t)))}
        <span class="sr-only"> — ${ze(a)}</span></button>`}).join("");this.menu.innerHTML=`<p class="menu__title">${ze(ne("menu_title"))}</p>${e}<a href="/classic/">${ze(ne("classic"))}</a>`}setMenuState(e,t){this.visited=new Set(e),this.locked=new Set(t),this.refreshMenu()}addLabel(e,t){const n=document.createElement("div");n.className="label",n.innerHTML='<i class="label__arrow"></i><span class="label__text"></span><span class="label__dist"></span>',n.querySelector(".label__text").textContent=ne(t),this.root.querySelector("[data-labels]").appendChild(n),this.labels.set(e,{el:n,key:t,text:n.querySelector(".label__text"),dist:n.querySelector(".label__dist"),arrow:n.querySelector(".label__arrow"),x:0,y:0,bottom:!1,d:0})}placeLabel(e,t,n,s,r,o){const a=this.labels.get(e);if(!a)return;a.el.style.display="",a.el.classList.toggle("label--edge",!s),a.x=t,a.y=n,a.bottom=s,a.d=o,a.arrow.style.transform=`rotate(${r.toFixed(3)}rad)`;const l=`${Math.round(o)} m`;a.dist.textContent!==l&&(a.dist.textContent=l)}layoutLabels(e,t){const o=this.compacto?this.touchEl?.offsetHeight??0:0,a=this.compacto?o+(t>zd?94:48):104;this.compacto&&this.recortarRotulos(t>zd?2:1);const l=[];for(const c of this.labels.values()){if(c.el.style.display==="none")continue;const u=c.el.offsetWidth,d=c.el.offsetHeight,h=c.bottom?d:d/2,f=c.bottom?0:d/2;l.push({l:c,w:u,h:d,x:Bd(c.x,10+u/2,e-10-u/2),y:Bd(c.y,58+h,t-a-f)})}for(let c=0;c<3;c++){let u=!1;for(let d=0;d<l.length;d++)for(let h=d+1;h<l.length;h++){const f=l[d],g=l[h];if(Math.abs(f.x-g.x)>=(f.w+g.w)/2+6)continue;const _=f.y-(f.l.bottom?f.h:f.h/2),m=f.y+(f.l.bottom?0:f.h/2),p=g.y-(g.l.bottom?g.h:g.h/2),S=g.y+(g.l.bottom?0:g.h/2);if(p>=m+6||_>=S+6)continue;const v=m+6-p,x=t-a-(g.l.bottom?0:g.h/2),R=g.y+v;if(R<=x)g.y=R;else{g.y=x;const A=R-x,w=58+(f.l.bottom?f.h:f.h/2);f.y=Math.max(w,f.y-A)}u=!0}if(!u)break}for(const c of l){const u=c.l.bottom?"translate(-50%, -100%)":"translate(-50%, -50%)";c.l.el.style.transform=`${u} translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px)`}}recortarRotulos(e){const t=[...this.labels.values()].filter(n=>n.el.style.display!=="none");if(!(t.length<=e)){t.sort((n,s)=>n.d-s.d);for(const n of t.slice(e))n.el.style.display="none"}}setLabelLocked(e,t){this.labels.get(e)?.el.classList.toggle("label--locked",t)}hideLabel(e,t){const n=this.labels.get(e);n&&(n.el.style.display=t?"none":"")}setRecord(e,t){this.recordEl.hidden=!1;const n=t>0?Math.round(e/t*100):0,s=`${e}/${t}${t>0?` · ${n}%`:""}`,r=this.recordEl.querySelector("[data-record-num]");r.textContent!==s&&(r.textContent=s)}setProgress(e){this.progressValue=e,this.progress.textContent=`${ne("progress")} ${e}/${fs.length}`}setTakeover(e,t){const n=t||e>0;if(this.takeoverEl.hidden=!n,!n){this.takeoverEl.classList.remove("takeover--on");for(let s=0;s<na;s++)this.pipsEl.children[s].classList.remove("is-lit");return}this.takeoverEl.classList.toggle("takeover--on",t);for(let s=0;s<na;s++)this.pipsEl.children[s].classList.toggle("is-lit",t||s<e)}setBroadcast(e,t=0){if(this.broadcastEl.hidden=!e,!e){this.lastSecond=-1;return}const n=Math.floor(t*25);if(n===this.lastSecond)return;this.lastSecond=n;const s=Math.floor(n/25),r=String(Math.floor(s/60)).padStart(2,"0"),o=String(s%60).padStart(2,"0"),a=String(n%25).padStart(2,"0");this.timeEl.textContent=`${r}:${o}:${a}`}setContest(e){if(this.contestEl.hidden=e===null,!e){this.contestTxt="";return}const t=Math.max(0,Math.ceil(e.t)),n=`${t}|${e.puntos}|${e.carro}|${e.balones}|${e.aviso??""}`;if(n===this.contestTxt)return;this.contestTxt=n;const s=r=>this.contestEl.querySelector(r);s("[data-contest-time]").textContent=`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`,s("[data-contest-pts]").textContent=`${ne("contest_score")} ${e.puntos}`,s("[data-contest-rack]").textContent=`${ne("contest_rack")} ${e.carro+1}/${e.total}`,s("[data-contest-balls]").textContent="●".repeat(e.balones)+"○".repeat(Math.max(0,3-e.balones)),s("[data-contest-hint]").textContent=e.aviso??""}setPrompt(e){this.prompt.hidden=e===null,e!==null&&this.prompt.textContent!==e&&(this.prompt.textContent=e)}showMeter(e,t=ta,n=0,s=.5){if(this.meter.hidden=e===null,e===null){this.meter.classList.remove("meter--full");return}const r=Math.max(0,Math.min(1,n));this.chargeEl.style.width=`${(r*100).toFixed(1)}%`,this.meter.classList.toggle("meter--full",r>=.999),this.needle.style.left=`${(e*100).toFixed(1)}%`;const o=Math.max(2,t*100);this.sweet.style.left=`${(s*100-o/2).toFixed(1)}%`,this.sweet.style.width=`${o.toFixed(1)}%`}toast(e,t=2400){this.toastEl.textContent=e,this.toastEl.hidden=!1,this.live.textContent=e,window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.hidden=!0,t)}subtitle(e,t=2400){this.subsLineEl.textContent!==e&&(this.subsLineEl.textContent=e),this.subsEl.hidden=!1,this.live.textContent=e,window.clearTimeout(this.subsTimer),this.subsTimer=window.setTimeout(()=>this.subsEl.hidden=!0,t)}hideSubtitle(){window.clearTimeout(this.subsTimer),this.subsEl.hidden=!0}mountTouch(e){const t=document.createElement("div");t.className="touch",t.innerHTML=`
      <div class="joy" data-joy><div class="stick" data-stick></div></div>
      <div class="touch__btns">
        <button type="button" class="btn-round btn-round--act" data-act></button>
        <button type="button" class="btn-round btn-round--big" data-shoot>${Wo.ball}</button>
      </div>`,this.root.appendChild(t),this.touchEl=t,this.actBtn=t.querySelector("[data-act]"),this.actBtn.textContent=ne("touch_action"),this.shootBtn=t.querySelector("[data-shoot]"),this.shootBtn.setAttribute("aria-label",ne("touch_shoot"));const n=t.querySelector("[data-joy]"),s=t.querySelector("[data-stick]"),r=48;let o=null;const a=h=>{const f=n.getBoundingClientRect();let g=h.clientX-(f.left+f.width/2),_=h.clientY-(f.top+f.height/2);const m=Math.hypot(g,_);m>r&&(g=g/m*r,_=_/m*r),s.style.transform=`translate(${g}px, ${_}px)`,e.joy={x:g/r,y:_/r}},l=()=>{o=null,s.style.transform="",e.joy={x:0,y:0}};n.addEventListener("pointerdown",h=>{o=h.pointerId,n.setPointerCapture(o),a(h)}),n.addEventListener("pointermove",h=>o===h.pointerId&&a(h)),n.addEventListener("pointerup",l),n.addEventListener("pointercancel",l),t.addEventListener("contextmenu",h=>h.preventDefault());const c=this.shootBtn;let u=null;const d=h=>{u===null||h.pointerId!==u||(u=null,e.shootHeld=!1)};c.addEventListener("pointerdown",h=>{h.preventDefault(),u===null&&(u=h.pointerId,c.setPointerCapture(u),e.shootHeld=!0)}),c.addEventListener("pointerup",d),c.addEventListener("pointercancel",d),c.addEventListener("lostpointercapture",d),this.actBtn.addEventListener("pointerdown",h=>{h.preventDefault(),e.pressInteract()})}}const kd="court.muted";class RM{ctx=null;noiseBuf=null;muted=!1;constructor(){try{this.muted=localStorage.getItem(kd)==="1"}catch{}}unlock(){this.ensure()}toggleMute(){this.muted=!this.muted;try{localStorage.setItem(kd,this.muted?"1":"0")}catch{}return this.muted}ensure(){if(this.muted)return null;if(!this.ctx){const e=window.AudioContext??window.webkitAudioContext;if(!e)return null;this.ctx=new e}return this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}tone(e,t,n,s,r){const o=this.ensure();if(!o)return;const a=o.currentTime,l=o.createOscillator(),c=o.createGain();l.type=n,l.frequency.setValueAtTime(e,a),r&&l.frequency.exponentialRampToValueAtTime(r,a+t),c.gain.setValueAtTime(s,a),c.gain.exponentialRampToValueAtTime(1e-4,a+t),l.connect(c).connect(o.destination),l.start(a),l.stop(a+t+.02)}noise(e,t,n){const s=this.ensure();if(!s)return;if(!this.noiseBuf){this.noiseBuf=s.createBuffer(1,s.sampleRate,s.sampleRate);const c=this.noiseBuf.getChannelData(0);for(let u=0;u<c.length;u++)c[u]=Math.random()*2-1}const r=s.currentTime,o=s.createBufferSource();o.buffer=this.noiseBuf,o.loop=!0;const a=s.createBiquadFilter();a.type="bandpass",a.frequency.value=n;const l=s.createGain();l.gain.setValueAtTime(t,r),l.gain.exponentialRampToValueAtTime(1e-4,r+e),o.connect(a).connect(l).connect(s.destination),o.start(r),o.stop(r+e+.02)}bounce(e){this.tone(120+e*6,.12,"sine",Math.min(.5,e*.06),60)}swish(){this.noise(.45,.28,2600)}rim(){this.tone(520,.28,"triangle",.25,360)}board(){this.tone(190,.12,"square",.1,120)}release(){this.noise(.12,.08,1200)}click(){this.tone(880,.06,"square",.05)}cheer(){this.noise(1.3,.16,900)}}const CM=.15,LM=.35,PM=1.8,hi=(i,e,t,n,s,r)=>({kind:"box",x0:i,z0:e,x1:t,z1:n,y0:s,y1:r}),Xo=(i,e,t,n,s)=>({kind:"cyl",x:i,z:e,r:t,y0:n,y1:s});function IM(){const i=[],e=xt.halfW+1.15,t=xt.halfL+.9;for(const r of[-1,1]){let o=-t;for(let a=-t;a<t;a+=.8){const l=r<0&&a>-12.4&&a<-7.6,c=r<0&&a>-1.6&&a<1.6,u=r>0&&a>-3&&a<3,d=r>0&&a>6.2&&a<12.8;l||c||u||d?(a-o>.2&&i.push(hi(o,r*e-.12,a,r*e+.12,0,.92)),o=1/0):o===1/0&&(o=a)}o!==1/0&&t-o>.2&&i.push(hi(o,r*e-.12,t,r*e+.12,0,.92))}for(const r of[-1,1]){const o=r*(xt.halfL+.6);i.push(hi(o-.55,-.55,o+.55,.55,0,.25)),i.push(Xo(o,0,.34,0,3.9))}i.push(hi(Gr.x-1.24,Gr.z-.46,Gr.x+1.24,Gr.z+.46,0,1.1));const n=7.75;i.push(hi(-2.5,n,2.5,n+.57,0,1.1)),i.push(hi(2.9,n-.2,3.9,n+.75,0,.7)),i.push(hi(-3.43,n+.33,-3.27,n+.57,0,1.62)),i.push(Xo(9,9.7,.42,0,1.9)),i.push(Xo(11,8.7,.75,0,1.8)),i.push(Xo(11.9,8.7,.42,0,1.9));const s=xt.halfW+2.2;return i.push(hi(-20,-s-3.5,20,-s,0,.6)),i.push(hi(-20,s,20,s+3.5,0,.6)),i}function DM(i,e,t){return i.y1-i.y0>CM&&i.y0<t&&i.y1>e}function UM(i,e,t,n=0,s=PM){let r=!1;for(let o=0;o<3;o++){let a=!1;for(const l of t)if(!(l.y0>=s||l.y1<=n)&&!(l.kind==="box"&&!DM(l,n,s)))if(l.kind==="box"){const c=Math.min(Math.max(i.x,l.x0),l.x1),u=Math.min(Math.max(i.z,l.z0),l.z1);let d=i.x-c,h=i.z-u,f=Math.hypot(d,h);if(f>=e)continue;if(f<1e-6){const m=[{d:i.x-l.x0,x:-1,z:0},{d:l.x1-i.x,x:1,z:0},{d:i.z-l.z0,x:0,z:-1},{d:l.z1-i.z,x:0,z:1}].sort((p,S)=>p.d-S.d)[0];i.x+=m.x*(m.d+e),i.z+=m.z*(m.d+e),d=0,h=0,f=0,a=r=!0;continue}const g=(e-f)/f;i.x+=d*g,i.z+=h*g,a=r=!0}else{let c=i.x-l.x,u=i.z-l.z,d=Math.hypot(c,u);if(d>=e+l.r)continue;d<1e-6&&(c=1,u=0,d=1);const h=e+l.r-d;i.x+=c/d*h,i.z+=u/d*h,a=r=!0}if(!a)break}return r}function NM(i,e,t,n){let s=!1;for(let r=0;r<2;r++)FM(i,e,t,n)&&(s=!0);return s}function FM(i,e,t,n){let s=!1;for(const r of n){if(r.y0>i.y+t||r.y1<i.y-t)continue;let o=0,a=0,l=0,c=0;if(r.kind==="box"){const d=Math.min(Math.max(i.x,r.x0),r.x1),h=Math.min(Math.max(i.y,r.y0),r.y1),f=Math.min(Math.max(i.z,r.z0),r.z1);let g=i.x-d,_=i.y-h,m=i.z-f;const p=Math.hypot(g,_,m);if(p>=t)continue;if(p<1e-6){const v=[{p:i.x-r.x0,n:[-1,0,0]},{p:r.x1-i.x,n:[1,0,0]},{p:i.y-r.y0,n:[0,-1,0]},{p:r.y1-i.y,n:[0,1,0]},{p:i.z-r.z0,n:[0,0,-1]},{p:r.z1-i.z,n:[0,0,1]}].sort((x,R)=>x.p-R.p)[0];o=v.n[0],a=v.n[1],l=v.n[2],c=v.p+t}else o=g/p,a=_/p,l=m/p,c=t-p}else{const d=i.x-r.x,h=i.z-r.z,f=Math.hypot(d,h);if(f>=t+r.r)continue;const g=f<1e-6?1:f;o=f<1e-6?1:d/g,l=f<1e-6?0:h/g,a=0,c=t+r.r-f}i.x+=o*c,i.y+=a*c,i.z+=l*c;const u=e.x*o+e.y*a+e.z*l;u<0&&(e.x-=(1+.55)*u*o,e.y-=(1+.55)*u*a,e.z-=(1+.55)*u*l,e.x*=.94,e.y*=.94,e.z*=.94,s=!0)}return s}const OM=[-1,1];class BM{constructor(e,t={},n=[]){this.object=e,this.ev=t,this.solids=n}pos=new P;vel=new P;state="held";scored=!1;resting=0;age=0;prev=new P;launch(e,t){this.pos.copy(e),this.vel.copy(t),this.state="flying",this.scored=!1,this.resting=0,this.age=0,this.object.position.copy(this.pos)}get settled(){return this.state==="flying"&&(this.age>8||this.resting>.8)}step(e){if(this.state!=="flying")return;const t=Math.max(1,Math.ceil(e/(1/120))),n=e/t;for(let s=0;s<t;s++)this.integrate(n);this.age+=e,this.object.position.copy(this.pos)}integrate(e){const{pos:t,vel:n,prev:s}=this;if(s.copy(t),t.addScaledVector(n,e),t.y-=.5*ar*e*e,n.y-=ar*e,t.y<tn.radius&&n.y<0){const r=-n.y;t.y=tn.radius,n.y=r*.62,n.x*=.92,n.z*=.92,r>1.2&&this.ev.bounce?.(r),n.y<.8&&(n.y=0)}if(this.solids.length){const r=Math.hypot(n.x,n.y,n.z);NM(t,n,tn.radius*tn.visualScale,this.solids)&&r>1.4&&this.ev.bounce?.(r)}if(t.y<=tn.radius+.001&&n.y===0){const r=Math.max(0,1-2.2*e);n.x*=r,n.z*=r,this.resting=Math.hypot(n.x,n.z)<.4?this.resting+e:0}else this.resting=0;for(const r of OM){const o=lf(r);if((s.x-o)*(t.x-o)<0&&Math.abs(t.z)<.9&&t.y>2.9&&t.y<3.95){const a=Math.sign(s.x-o);t.x=o+a*(tn.radius+.026),n.x=-n.x*.55,this.ev.board?.()}if(s.y>Nt.y&&t.y<=Nt.y&&n.y<0){const a=(s.y-Nt.y)/(s.y-t.y),l=s.x+(t.x-s.x)*a,c=s.z+(t.z-s.z)*a,u=l-kt(r),d=c,h=Math.hypot(u,d);if(h<=MM)this.scored||(this.scored=!0,this.ev.score?.(r)),n.x*=.35,n.z*=.35,n.y*=.7;else if(h<=Nt.radius+tn.radius+.06){const f=u/(h||1),g=d/(h||1);n.set(f*1.8+n.x*.2,2.8,g*1.8+n.z*.2),t.y=Nt.y+.02,this.ev.rim?.()}}}}}const ua=new fv({vertexColors:!0,flatShading:!1,side:Vn});function vi(i){return i.traverse(e=>{const t=e;t.isMesh&&(t.castShadow=!1)}),i}function lr(i,e,t,n){const s=document.createElement("canvas");s.width=i,s.height=e;const r=s.getContext("2d");if(!r)throw new Error("2D canvas no disponible");t(r);const o=new Jh(s);return o.colorSpace=Ut,o.magFilter=Gt,n?.mipmaps?(o.minFilter=An,o.generateMipmaps=!0,n.anisotropy&&(o.anisotropy=n.anisotropy)):(o.minFilter=Gt,o.generateMipmaps=!1),o}function Oc(i){let e=i;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const Sn=.03125,zM=[.52,.7,.86,1],kM=new Ne(7039696);function HM(i,e,t){const n=zM[t];i.copy(e).multiplyScalar(.46+.54*n),i.lerp(kM,(1-n)*.3)}const Di=(i,e,t)=>`${i}|${e}|${t}`,GM=[{n:[1,0,0],corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},{n:[-1,0,0],corners:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]},{n:[0,1,0],corners:[[0,1,0],[0,1,1],[1,1,1],[1,1,0]]},{n:[0,-1,0],corners:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]},{n:[0,0,1],corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]},{n:[0,0,-1],corners:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]}];class mr{constructor(e=Sn){this.size=e}cells=new Map;solid=new Set;best=new Map;get count(){return this.solid.size}get colorCount(){return new Set(this.cells.values()).size}fillCells(e,t,n,s,r,o,a){const[l,c]=e<=s?[e,s]:[s,e],[u,d]=t<=r?[t,r]:[r,t],[h,f]=n<=o?[n,o]:[o,n];for(let g=l;g<=c;g++)for(let _=u;_<=d;_++)for(let m=h;m<=f;m++)this.cells.set(Di(g,_,m),a),this.solid.add(Di(g,_,m));return this}box(e,t,n,s,r,o,a){const l=this.size,c=Math.round((e-s/2)/l),u=Math.ceil((e+s/2)/l)-1,d=Math.round((t-r/2)/l),h=Math.ceil((t+r/2)/l)-1,f=Math.round((n-o/2)/l),g=Math.ceil((n+o/2)/l)-1;return this.fillCells(c,d,f,u,h,g,a)}span(e,t,n,s,r,o,a){const l=this.size;return this.fillCells(Math.round(e/l),Math.round(t/l),Math.round(n/l),Math.ceil(s/l)-1,Math.ceil(r/l)-1,Math.ceil(o/l)-1,a)}sphere(e,t,n,s,r){const o=this.size,a=Math.floor((e-s)/o),l=Math.ceil((e+s)/o),c=Math.floor((t-s)/o),u=Math.ceil((t+s)/o),d=Math.floor((n-s)/o),h=Math.ceil((n+s)/o),f=s*s;for(let g=a;g<=l;g++)for(let _=c;_<=u;_++)for(let m=d;m<=h;m++){const p=(g+.5)*o-e,S=(_+.5)*o-t,v=(m+.5)*o-n;p*p+S*S+v*v>f||(this.cells.set(Di(g,_,m),r),this.solid.add(Di(g,_,m)))}return this}putCell(e,t,n,s,r=-1/0){const o=`${e}|${t}|${n}`,a=this.best.get(o);a!==void 0&&a<r||(this.best.set(o,r),this.cells.set(o,s),this.solid.add(o))}occupied(e,t,n){return this.solid.has(Di(e,t,n))}resetPriority(){this.best.clear()}eraseCells(e,t,n,s,r,o){const[a,l]=e<=s?[e,s]:[s,e],[c,u]=t<=r?[t,r]:[r,t],[d,h]=n<=o?[n,o]:[o,n];for(let f=a;f<=l;f++)for(let g=c;g<=u;g++)for(let _=d;_<=h;_++)this.cells.delete(Di(f,g,_)),this.solid.delete(Di(f,g,_)),this.best.delete(Di(f,g,_));return this}build(e={}){const t=this.size,n=new Ht;n.name=e.name??"voxels";const s=e.flatTop??!1,r=e.flatY??0,o=e.mergeColors??!1,a=new Map;for(const[c,u]of this.cells){let d=a.get(u);d||a.set(u,d=[]),d.push(...c.split("|").map(Number))}const l=o?{pos:[],nor:[],col:[],tri:[]}:null;for(const[c,u]of a){const d=[],h=[],f=[],g=[];let _=0;const m=new Ne(c),p=new Ne;for(let x=0;x<u.length;x+=3){const R=u[x],A=u[x+1],w=u[x+2];for(const C of GM){const[b,y,I]=C.n;if(s&&y!==1||this.occupied(R+b,A+y,w+I))continue;const Y=b!==0?0:y!==0?1:2,V=(Y+1)%3,q=(Y+2)%3;for(let z=0;z<4;z++){const[U,$,G]=C.corners[z];if(d.push((R+U)*t,s?r:(A+$)*t,(w+G)*t),h.push(b,y,I),s){f.push(m.r,m.g,m.b);continue}const te=U*2-1,re=$*2-1,he=G*2-1,ve=[te,re,he],Me=[b,y,I],O=[...Me];O[V]=O[V]+ve[V];const Z=[...Me];Z[q]=Z[q]+ve[q];const ae=[Me[0]+ve[0],Me[1]+ve[1],Me[2]+ve[2]],ue=this.occupied(R+O[0],A+O[1],w+O[2])?1:0,ie=this.occupied(R+Z[0],A+Z[1],w+Z[2])?1:0,Pe=this.occupied(R+ae[0],A+ae[1],w+ae[2])?1:0,He=ue&&ie?0:3-(ue+ie+Pe);HM(p,m,He),f.push(p.r,p.g,p.b)}g.push(_,_+1,_+2,_,_+2,_+3),_+=4}}if(!d.length)continue;if(l){const x=l.pos.length/3;l.pos.push(...d),l.nor.push(...h),l.col.push(...f);for(const R of g)l.tri.push(R+x);continue}const S=new hn;S.setAttribute("position",new nn(d,3)),S.setAttribute("normal",new nn(h,3)),S.setAttribute("color",new nn(f,3)),S.setIndex(g);const v=new bt(S,ua);v.castShadow=e.castShadow??e.shadows??!0,v.receiveShadow=e.shadows??!0,n.add(v)}if(l&&l.pos.length){const c=new hn;c.setAttribute("position",new nn(l.pos,3)),c.setAttribute("normal",new nn(l.nor,3)),c.setAttribute("color",new nn(l.col,3)),c.setIndex(l.tri),c.computeBoundingSphere();const u=new bt(c,ua);u.castShadow=e.castShadow??e.shadows??!0,u.receiveShadow=e.shadows??!0,u.name=(e.name??"voxels")+":merged",n.add(u)}return n}}function $t(i,e,t=Sn){const n=new mr(t);return e(n),n.build({name:i})}const Hd={0:"01110,10001,10011,10101,11001,10001,01110",1:"00100,01100,00100,00100,00100,00100,01110",2:"01110,10001,00001,00010,00100,01000,11111",3:"11111,00010,00100,00010,00001,10001,01110",4:"00010,00110,01010,10010,11111,00010,00010",5:"11111,10000,11110,00001,00001,10001,01110",6:"00110,01000,10000,11110,10001,10001,01110",7:"11111,00001,00010,00100,01000,01000,01000",8:"01110,10001,10001,01110,10001,10001,01110",9:"01110,10001,10001,01111,00001,00010,01100",A:"01110,10001,10001,11111,10001,10001,10001",B:"11110,10001,10001,11110,10001,10001,11110",C:"01110,10001,10000,10000,10000,10001,01110",D:"11110,10001,10001,10001,10001,10001,11110",E:"11111,10000,10000,11110,10000,10000,11111",F:"11111,10000,10000,11110,10000,10000,10000",G:"01110,10001,10000,10111,10001,10001,01111",H:"10001,10001,10001,11111,10001,10001,10001",I:"01110,00100,00100,00100,00100,00100,01110",J:"00111,00010,00010,00010,00010,10010,01100",K:"10001,10010,10100,11000,10100,10010,10001",L:"10000,10000,10000,10000,10000,10000,11111",M:"10001,11011,10101,10101,10001,10001,10001",N:"10001,11001,10101,10011,10001,10001,10001",O:"01110,10001,10001,10001,10001,10001,01110",P:"11110,10001,10001,11110,10000,10000,10000",Q:"01110,10001,10001,10001,10101,10010,01101",R:"11110,10001,10001,11110,10100,10010,10001",S:"01111,10000,10000,01110,00001,00001,11110",T:"11111,00100,00100,00100,00100,00100,00100",U:"10001,10001,10001,10001,10001,10001,01110",V:"10001,10001,10001,10001,10001,01010,00100",W:"10001,10001,10001,10101,10101,11011,10001",X:"10001,10001,01010,00100,01010,10001,10001",Y:"10001,10001,01010,00100,00100,00100,00100",Z:"11111,00001,00010,00100,01000,10000,11111","-":"00000,00000,00000,11111,00000,00000,00000","/":"00001,00010,00010,00100,01000,01000,10000",".":"00000,00000,00000,00000,00000,01100,01100"," ":"00000,00000,00000,00000,00000,00000,00000"};function Bc(i,e){const t=[...i.toUpperCase()];return Math.max(0,t.length*6-1)*e}function ac(i,e,t,n,s,r){const o=[...e.toUpperCase()];return i.fillStyle=r,o.forEach((a,l)=>{(Hd[a]??Hd[" "]).split(",").forEach((u,d)=>{[...u].forEach((h,f)=>{h==="1"&&i.fillRect(t+(l*6+f)*s,n+d*s,s,s)})})}),Bc(e,s)}const Te={frame:16645622,rim:16742959,net:16775920,pole:12174548,metal:9346228,wood:11104572,woodDark:8146470,tunnel:4016747,tunnelInner:2766160,table:12832221,tableTop:9675192,shirt:16747578,shirtAlt:4164320,tallyOn:16726832,tallyOff:9062981,ball:16742938},VM=[16747578,5220592,16766282,8315018,13143280,16645622],Pt=80,zc=[-9.6,-3.2,3.2,9.6],kc=[-8.5,-2.5,2.5],Vr=11.92,WM=1,XM=.68,$M=[{x:-3.2,y:Vr,z:-8.5},{x:3.2,y:Vr,z:-8.5},{x:-3.2,y:Vr,z:2.5},{x:3.2,y:Vr,z:2.5}],qM=new un({color:16774084,toneMapped:!1});function cf(i,e,t,n,s=!1){if(!s){i.fillStyle="#d9a05b",i.fillRect(0,0,e,t);const r=Pt*.5;for(let o=0,a=0;o<e;o+=r,a++)i.fillStyle=a%2?"rgba(150,90,35,0.16)":"rgba(255,232,170,0.20)",i.fillRect(o,0,r,t),i.fillStyle="rgba(120,70,25,0.16)",i.fillRect(o,0,1,t);jM(i)}YM(i,e,t),KM(i)}function jM(i){const e=4.6*Pt;for(const t of zc)for(const n of kc){const s=(t+xt.length/2)*Pt,r=(n+xt.width/2)*Pt;i.save(),i.translate(s,r),i.scale(1,1.25);const o=i.createRadialGradient(0,0,0,0,0,e);o.addColorStop(0,"rgba(255,238,202,0.28)"),o.addColorStop(.3,"rgba(255,236,196,0)"),o.addColorStop(.6,"rgba(58,74,108,0.1)"),o.addColorStop(.72,"rgba(46,58,86,0.34)"),o.addColorStop(.86,"rgba(58,74,108,0.11)"),o.addColorStop(1,"rgba(70,88,124,0)"),i.fillStyle=o,i.beginPath(),i.arc(0,0,e,0,Math.PI*2),i.fill(),i.restore()}}function YM(i,e,t){const n=5.8*Pt,s=4.9*Pt;for(const r of[0,e-n])i.fillStyle="#e0341f",i.fillRect(r,t/2-s/2,n,s),i.strokeStyle="#8f1a0c",i.lineWidth=Math.max(2,.06*Pt),i.strokeRect(r,t/2-s/2,n,s)}function KM(i){const e=Math.max(3,Math.round(.05*Pt)),t=f=>(f+xt.length/2)*Pt,n=f=>(f+xt.width/2)*Pt;i.fillStyle="#fdf6e8";const s=(f,g)=>i.fillRect(Math.round(t(f)-e/2),Math.round(n(g)-e/2),e,e),r=(f,g,_,m)=>{const p=e/Pt*1.15;for(let S=f;S<=g;S+=p)s(S,_),s(S,m);for(let S=_;S<=m;S+=p)s(f,S),s(g,S);s(g,_),s(g,m)},o=(f,g,_,m,p)=>{const S=Math.max(32,Math.ceil(Math.abs(p-m)*_*Pt/1.5));for(let v=0;v<=S;v++){const x=m+(p-m)*v/S;s(f+Math.cos(x)*_,g+Math.sin(x)*_)}},a=xt.halfL,l=xt.halfW,c=6.75,u=.9,d=Math.acos(-.6749999999999999/c),h=c*Math.sin(d);r(-a,a,-l,l);for(let f=-l;f<=l;f+=e/Pt*1.15)s(0,f);o(0,0,1.8,0,Math.PI*2);for(const f of[-1,1]){const g=f*a,_=g-f*1.575,m=g-f*5.8;r(g,m,-2.45,2.45),o(m,0,1.8,0,Math.PI*2);const p=e/Pt*1.15,S=f*(a-u);for(const v of[-h,h])for(let x=Math.min(g,S);x<=Math.max(g,S);x+=p)s(x,v);for(const v of[1.75,2.6,3.45,4.3,5.15]){const x=g-f*v;for(const R of[-2.45,2.45]){const A=R,w=R-Math.sign(R)*.4;for(let C=A;R>0?C>=w:C<=w;C+=R>0?-p:p)s(x,C)}}f===-1?o(_,0,c,-d,d):o(_,0,c,Math.PI-d,Math.PI+d),f===-1?o(_,0,1.25,-Math.PI/2,Math.PI/2):o(_,0,1.25,Math.PI/2,3*Math.PI/2)}}function ZM(){const i=[7315416,8376714,15778123,15238236,11827926,9422832,10473640],e=7,t=.55,n=1.15,s=xt.halfL+2.2,r=xt.halfW+2.2,o=$t("stands",h=>{for(let f=0;f<e;f++){const g=t*(f+1),_=g-t,m=s+f*n,p=r+f*n,S=m+n,v=i[f%i.length];h.span(-S,_,-p-n,S,g,-p,v),h.span(-S,_,p,S,g,p+n,v),h.span(-m-n,_,-p,-m,g,p,v),h.span(m,_,-p,m+n,g,p,v),h.span(-S,g-.12,-p-.25,S,g,-p,14674423),h.span(-S,g-.12,p,S,g,p+.25,14674423);for(const x of[-7.4,7.4])h.span(x-1.1,g-.02,-p-n,x+1.1,g,-p,15238236),h.span(x-1.1,g-.02,p,x+1.1,g,p+n,15238236)}},.25),a=cy(s,r);o.add(a);const l=.95,c=[],u=h=>Math.abs(Math.abs(h)-7.4)<1.25;for(let h=0;h<e;h++){const f=t*(h+1)+.12,g=s+h*n+n/2,_=r+h*n+n/2;for(let m=-g;m<=g;m+=l)u(m)||c.push([m,f,-_],[m,f,_]);for(let m=-_+l;m<=_-l;m+=l)c.push([-g,f,m],[g,f,m])}const d=ty(c);return o.userData.crowdTime=d.userData.crowdTime,o.userData.crowdFx=d.userData.crowdFx,o.add(d),o}const JM=[15774330,14062679,11102780,9064743,16239008],QM=[3088408,5519135,9067051,14200906,2038308,8010538];function ey(){return 8}function ty(i){const e=new Ht;e.name="crowd";const t=Oc(7),n=new Xe,s=new ei,r=new Cn,o=new P,a=new P,l={value:0},c={value:0},u={value:0},d=(z=!1)=>{const U=new Si({color:16777215,roughness:.92,flatShading:!0});return U.onBeforeCompile=$=>{$.uniforms.uCrowdTime=l,$.uniforms.uCrowdWave=c,$.uniforms.uCrowdJump=u,$.vertexShader=`uniform float uCrowdTime;
uniform float uCrowdWave;
uniform float uCrowdJump;
${z?`attribute float aAlto;
`:""}${$.vertexShader}`.replace("#include <begin_vertex>",`#include <begin_vertex>
        {
          // Longitud de onda larga (~25 m): la grada se mece en olas que la
          // recorren, no en un temblor por asiento. 4,5 cm de amplitud es lo que
          // hace falta para que se note a 30 m; con 1,8 cm el movimiento se
          // quedaba por debajo del píxel.
          float fase = instanceMatrix[3].x * 0.22 + instanceMatrix[3].z * 0.31;
          transformed.y += sin(uCrowdTime * 0.9 + fase) * 0.045;
          // Deriva lateral (punto D): 2 cm a un ritmo más lento y con la fase
          // deformada, para que no vaya en fase con el vaivén vertical. Con sólo
          // subir y bajar, una grada de bloques parece un dibujo plano; el
          // balanceo de lado es lo que la hace masa y no estampa. Las cinco
          // piezas de una persona comparten traslación casi exacta, así que se
          // mueven juntas y nadie se desmonta.
          transformed.x += sin(uCrowdTime * 0.55 + fase * 1.7) * 0.02;
          // Celebración: un frente de onda que sale del centro de la pista.
          float radio = length(instanceMatrix[3].xz);
          float ola = max(0.0, 1.0 - abs(uCrowdWave - radio * 0.14));
          transformed.y += ola * uCrowdJump * 0.3;
          ${z?`
          // SOLO los brazos, y los que ya estaban arriba: los que suben con la
          // ola son los que la están celebrando, y suben 38 cm más que el
          // cuerpo. Sin esto la ola levantaba a todo el mundo por igual y no
          // se distinguía el que celebra del que se levanta a mirar.
          transformed.y += ola * uCrowdJump * 0.38 * aAlto;
          // y además se barren de lado, como un saludo: 3,5 cm.
          transformed.x += sin(uCrowdTime * 1.4 + fase) * 0.035 * aAlto * ola;`:""}
        }`)},U},h=i.length,f=ey(),g=(z,U)=>{const $=(Math.atan2(U,z)+Math.PI)/(2*Math.PI);return Math.min(f-1,Math.floor($*f))},_=new Int32Array(h),m=new Int32Array(h),p=[];for(let z=0;z<f;z++)p.push([]);for(let z=0;z<h;z++){const U=g(i[z][0],i[z][2]);_[z]=U,m[z]=p[U].length,p[U].push(z)}const S=[],v=[],x=[],R=[],A=[],w=new Array(f).fill(null),C=new xn(.42,.4,.36),b=new xn(.46,.14,.4),y=new xn(.4,.44,.3),I=new xn(.14,.18,.34);for(let z=0;z<f;z++){const U=p[z].length;if(U===0)continue;S.push(new hs(C,d(),U)),v.push(new hs(b,d(),U)),x.push(new hs(y,d(),U)),A.push(new hs(I,d(),U*2));const $=new xn(.11,.34,.11),G=new Float32Array(U*2);w[z]=G,$.setAttribute("aAlto",new ra(G,1)),R.push(new hs($,d(!0),U*2))}const Y=JM.map(z=>new Ne(z)),V=QM.map(z=>new Ne(z)),q=VM.map(z=>new Ne(z));i.forEach(([z,U,$],G)=>{const te=_[G],re=m[G],he=t()<.16,ve=he?.001:.92+t()*.16,Me=(t()-.5)*.6,O=he?0:(t()-.5)*.04,Z=z+(t()-.5)*.14,ae=$+(t()-.5)*.12,ue=q[Math.floor(t()*q.length)];a.set(ve,ve,ve),r.set(0,Me,0),s.setFromEuler(r);for(let Pe=0;Pe<2;Pe++){const He=Pe===0?-1:1;o.set(Z+Math.cos(Me)*He*.12*ve,U+.09+O,ae+.12*ve-Math.sin(Me)*He*.12*ve),n.compose(o,s,a);const at=re*2+Pe;A[te].setMatrixAt(at,n),A[te].setColorAt(at,new Ne(ue).multiplyScalar(.55))}o.set(Z,U+.4+O,ae),n.compose(o,s,a),x[te].setMatrixAt(re,n),x[te].setColorAt(re,ue),r.set(0,Me+(t()-.5)*.5,0),s.setFromEuler(r),o.set(Z,U+.86+O,ae),n.compose(o,s,a),S[te].setMatrixAt(re,n),S[te].setColorAt(re,Y[Math.floor(t()*Y.length)]),a.set(ve,ve*(.7+t()*.8),ve),o.set(Z,U+1.09+O,ae),n.compose(o,s,a),v[te].setMatrixAt(re,n),v[te].setColorAt(re,V[Math.floor(t()*V.length)]),a.set(ve,ve,ve);const ie=t()<.2;for(let Pe=0;Pe<2;Pe++){const He=Pe===0?-1:1,at=Z+Math.cos(Me)*He*.26*ve,Ze=ae-Math.sin(Me)*He*.26*ve;ie?(r.set(-.35,Me,He*.5),o.set(at,U+.78+O,Ze)):(r.set(.2,Me,He*.18),o.set(at,U+.32+O,Ze)),s.setFromEuler(r),n.compose(o,s,a);const ht=re*2+Pe;R[te].setMatrixAt(ht,n),R[te].setColorAt(ht,ue),w[te][ht]=ie?1:0}});for(const z of[...A,...x,...R,...S,...v])z.instanceMatrix.needsUpdate=!0,z.instanceColor&&(z.instanceColor.needsUpdate=!0),z.castShadow=!0,e.add(z);for(const z of R)z.geometry.getAttribute("aAlto").needsUpdate=!0;return e.userData.crowdTime=l,e.userData.crowdFx={wave:c,jump:u},e}const zi=336,ki=88,ny=9,iy=8,sy=8;function ry(i){const e=Math.max(1,[...i].length*6-1),t=Math.floor((zi-2*iy)/e),n=Math.floor((ki-2*sy)/7);return Math.max(1,Math.min(ny,t,n))}function al(i,e){const t=n=>Math.max(0,Math.min(999999,Math.round(Number.isFinite(n)?n:0)));return`${t(i)}/${t(e)}`}function Gd(i,e){i.fillStyle="#080d18",i.fillRect(0,0,zi,ki),i.fillStyle="#1f2937",i.fillRect(0,0,zi,6),i.fillRect(0,ki-6,zi,6),i.fillRect(0,0,6,ki),i.fillRect(zi-6,0,6,ki);const t=ry(e),n=Bc(e,t),s=Math.round((zi-n)/2),r=Math.round((ki-7*t)/2)+1;ac(i,e,s,r+1,t,"#5b1d12"),ac(i,e,s,r,t,"#ff7a1a")}function oy(i=1){const e=new Ht;e.name="scoreboard";const t=5.7,n=zi/Pt/2,s=ki/Pt/2,r=.44,o=Math.tan(r),a=Math.cos(r),l=s*a,c=.4,u=Sn*4,d=u,h=C=>Math.max(d,Math.floor((c+(C-t)*o)/u)*u);e.add($t("scoreboardBody",C=>{const I=Math.floor((t-l)/u)-2,Y=Math.ceil((t+l)/u)+1;for(let q=I;q<=Y;q++){const z=q*u,U=z+u,$=U<=t-l||z>=t+l,G=$?n+.3:n+.14;C.span(-G,z,-d,G,U,d,$?9346228:2831696),$||(C.span(-G,z,-d,-2.12,U,d,9346228),C.span(n+.02,z,-d,G,U,d,9346228));const te=Math.max(0,Math.round(h(z)/u)-1);for(const re of[-1,1])for(let he=1;he<=te;he++){const ve=re>0?he*u:-(he+1)*u,Me=re>0?(he+1)*u:-he*u;C.span(-G,z,ve,G,U,Me,$?9346228:2831696),$||(C.span(-G,z,ve,-2.12,U,Me,9346228),C.span(n+.02,z,ve,G,U,Me,9346228))}}const V=(Y+1)*u;for(const q of[-1,1])for(const z of[-1,1])C.span(q*(n-.2)-.03,V-u,z*.24-.03,q*(n-.2)+.03,14.2,z*.24+.03,2042167)},u));const f=document.createElement("canvas");f.width=zi,f.height=ki;const g=f.getContext("2d");g&&Gd(g,al(0,0));const _=new Jh(f);_.colorSpace=Ut,_.magFilter=Gt,_.minFilter=An,_.generateMipmaps=!0,_.anisotropy=i;const m=new un({map:_,toneMapped:!1});for(const C of[-1,1]){const b=new bt(new Wn(n*2,s*2),m);b.position.set(0,t,C*c),b.rotation.set(r,C<0?Math.PI:0,0,"YXZ"),b.name=`scoreboardFace${C>0?"F":"B"}`,e.add(b)}let p=al(0,0),S="",v;const x=C=>{g&&(Gd(g,C),_.needsUpdate=!0)},R=(C,b)=>{p=al(C,b),x(S||p)},A=(C,b)=>{S=C,x(C),v!==void 0&&window.clearTimeout(v),v=window.setTimeout(()=>{v=void 0,S="",x(p)},Math.max(0,b))},w=e;return w.setScore=R,w.flash=A,w}function ay(){return vi($t("ceiling",i=>{const e=xt.halfL+8,t=4,n=-14.5,s=14.2;for(const r of[n+.6,-4,0,t-.2]){i.span(-e,s,r-.18,e,s+.36,r+.18,4872832),i.span(-e,s+1.5,r-.18,e,s+1.86,r+.18,4872832);for(let o=-e;o<=e;o+=1.6)i.span(o-.1,s+.36,r-.1,o+.1,s+1.5,r+.1,6123414)}for(let r=-e;r<=e;r+=3.2)i.span(r-.12,s+1.86,n+.6,r+.12,s+2.1,t-.2,4872832);for(const r of zc)for(const o of kc)i.span(r-.05,s-1.6,o-.05,r+.05,s,o+.05,2831696),i.span(r-.62,s-2.1,o-.44,r+.62,s-1.6,o+.44,6123414);for(const r of[-1,1]){const o=r<0?-9.5:2.5;i.span(-6.5,s-2.4,o-.5,-5.1,s-1.4,o+.5,2042167),i.span(-6.4,s-2.3,o-.4,-5.2,s-1.5,o+.4,3819102)}},.25))}function ly(){const i=[];for(const n of zc)for(const s of kc)i.push(new P(n,Vr,s));const e=new hs(new xn(WM,.08,XM),qM,i.length),t=new Xe;for(let n=0;n<i.length;n++)t.makeTranslation(i[n].x,i[n].y,i[n].z),e.setMatrixAt(n,t);return e.instanceMatrix.needsUpdate=!0,e.name="lampFaces",e.castShadow=!1,e.receiveShadow=!1,e.frustumCulled=!1,e}function cy(i,e){return $t("standsRail",t=>{const s=[16747578,16176458,5220592,8315018,16645622];let r=0;const o=(l,c,u)=>{t.span(l-.05,1.1-.5,c-.05,l+.05,1.1,c+.05,2831696);const d=s[r++%s.length];for(let h=0;h<3;h++)t.span(l-.05,1.1-.18-h*.12,c-.05,l+.05,1.1-.06-h*.12,c+.05+u*(.34-h*.1),d)},a=(l,c,u,d)=>{const h=u-l,f=d-c,g=Math.hypot(h,f),_=Math.max(2,Math.round(g/2.5));for(let v=0;v<=_;v++){const x=v/_,R=l+h*x,A=c+f*x;t.span(R-.07,.6,A-.07,R+.07,1.1,A+.07,9346228)}const m=.35;for(let v=0;v*m<=g;v++){const x=l+h/g*v*m,R=c+f/g*v*m;t.span(x-.06,1.1-.12,R-.06,x+.06,1.1,R+.06,14674423),t.span(x-.05,1.1-.42,R-.05,x+.05,1.1-.32,R+.05,9346228)}const p=2.4,S=Math.abs(f)>.1?-Math.sign(f):0;for(let v=0;v*p<=g;v++){const x=l+h/g*v*p,R=c+f/g*v*p;o(x,R,S)}};a(-i,-e,i,-e),a(-i,e,i,e),a(-i,-e,-i,e),a(i,-e,i,e)},.125)}function uy(){const i=[16645622,16747578,4164320,16766282,12076092],e=xt.halfW+1.15,t=xt.halfL+.9;return $t("boards",n=>{for(const s of[-1,1])for(let r=-t;r<t;r+=.8){const o=s<0&&r>-12.4&&r<-7.6,a=s<0&&r>-1.6&&r<1.6,l=s>0&&r>-3&&r<3,c=s>0&&r>6.2&&r<12.8;if(o||a||l||c)continue;const u=i[Math.round((r+t)/.8)%i.length];n.span(r,0,s*e-.09,r+.72,.85,s*e+.09,u),n.span(r,.85,s*e-.09,r+.72,.92,s*e+.09,2831696)}},.125)}function dy(){const i=xt.halfL+7,e=xt.halfW+7;return vi($t("lightTowers",t=>{for(const n of[-1,1])for(const s of[-1,1]){const r=n*i,o=s*e;t.span(r-.9,0,o-.9,r+.9,.25,o+.9,10134445),t.span(r-.6,.25,o-.6,r+.6,.42,o+.6,9346228);for(let a=0;a<5;a++){const l=.42+a*1.42;t.span(r-.3,l,o-.3,r+.3,l+1.3,o+.3,9346228),t.span(r-.36,l+1.3,o-.36,r+.36,l+1.42,o+.36,7042694)}for(let a=0;a<6;a++){const l=a/5;t.span(r-.26+l*.5,.5+l*1.2,o-.06,r-.2+l*.5,.62+l*1.2,o+.06,7042694)}t.span(r-1,7.6,o-1,r+1,8.5,o+1,6123414),t.span(r-1.05,8.5,o-1.05,r+1.05,8.62,o+1.05,7042694)}},.25))}function hy(){const i=Oc(1234),e=8146470,t=6175260,n=[5217641,6533187,4164183],s=[10134445,9346228,11055291],r=$t("scatter",o=>{for(let a=0;a<32;a++){const l=i()*Math.PI*2,c=24+i()*42,u=Math.cos(l)*c,d=Math.sin(l)*c*.75;if(Math.abs(u)<23&&Math.abs(d)<17)continue;const h=i();if(h<.24){const f=.45+i()*.5;o.sphere(u,f*.7,d,f,s[0]),o.sphere(u+f*.8,f*.45,d-f*.5,f*.62,s[1]),i()<.5&&o.sphere(u-f*.7,f*.35,d+f*.6,f*.45,s[2])}else if(h<.36)o.sphere(u,.35,d,.5+i()*.3,n[1]),o.sphere(u+.5,.28,d+.3,.38,n[0]);else{const f=1.8+i()*1.8,g=.16+i()*.08;o.span(u-g*1.6,0,d-g*1.6,u+g*1.6,.35,d+g*1.6,t),o.span(u-g,.3,d-g,u+g,f,d+g,e),o.span(u-g*3.4,f*.62,d-g*.6,u+g*3.4,f*.62+g*1.2,d+g*.6,e),o.span(u-g*.6,f*.78,d-g*3.4,u+g*.6,f*.78+g*1.2,d+g*3.4,e);const _=1+i()*.4;o.sphere(u,f+_*.45,d,_,n[2]),o.sphere(u,f+_*1.05,d,_*.78,n[0]),o.sphere(u,f+_*1.5,d,_*.5,n[1])}}},.25);return vi(r)}function fy(i,e,t){const r=Oc(20261012),o=["#6fbf4a","#65b445","#7bcb56","#59a53c"],a=["#f6d54a","#f07aa6","#fdfdf6"];for(let l=0;l<t;l+=16)for(let c=0;c<e;c+=16){const u=Math.floor(r()*o.length);i.fillStyle=o[u],i.fillRect(c,l,16,16);for(let d=l;d<l+16;d+=4)for(let h=c;h<c+16;h+=4){const f=r();if(f<.16)i.fillStyle=o[(u+1)%o.length];else if(f>.985)i.fillStyle=a[Math.floor(r()*a.length)];else continue;i.fillRect(h,d,4,4)}}}function py(i,e){const t=new Ht,n=xt.length*Pt,s=xt.width*Pt,r=lr(n,s,A=>cf(A,n,s));r.anisotropy=e;const o=new bt(new Wn(xt.length,xt.width),new Si({map:r,roughness:.7}));o.rotation.x=-Math.PI/2,o.receiveShadow=!0,o.name="floor";const a=720,l=lr(a,a,A=>fy(A,a,a));l.anisotropy=e,l.generateMipmaps=!0,l.minFilter=An;const c=new bt(new Wn(180,180),new Si({map:l,roughness:.95}));c.rotation.x=-Math.PI/2,c.position.y=-.01,c.receiveShadow=!0,c.name="around";const u=performance.now(),d=ZM(),h=performance.now(),f=uy(),g=performance.now(),_=dy(),m=performance.now(),p=hy(),S=performance.now(),v=ay(),x=performance.now(),R=ly();return console.info(`[court] tiempos ms -> stands ${h-u|0}, boards ${g-h|0}, torres ${m-g|0}, vegetacion ${S-m|0}, techo ${x-S|0}`),t.add(c,o,d,f,_,p,v,R),t.userData.crowdTime=d.userData.crowdTime,t.userData.crowdFx=d.userData.crowdFx,t}function my(i,e){const t=xt.length*Pt,n=xt.width*Pt,s=lr(t,n,o=>cf(o,t,n,i,!0));s.anisotropy=e;const r=new bt(new Wn(xt.length,xt.width),new Si({map:s,transparent:!0,roughness:.7,depthWrite:!1}));return r.rotation.x=-Math.PI/2,r.position.y=.004,r.receiveShadow=!0,r.name="courtLines",r}function gy(i,e){const n=Math.max(1,Bc(i,6)),s=42;return lr(n,s,r=>{r.clearRect(0,0,n,s),ac(r,i,0,0,6,"#ffffff")},{mipmaps:!0,anisotropy:e})}const uf=.0185,gn=2,Ui=i=>i*gn*uf;function _y(i,e,t){const n=i.armR;return n.updateWorldMatrix(!0,!1),t.set(0,-.27749999999999997,0).applyMatrix4(n.matrixWorld)}function xy(i){return{fillCells:(e,t,n,s,r,o,a)=>i.fillCells(e*gn,t*gn,n*gn,(s+1)*gn-1,(r+1)*gn-1,(o+1)*gn-1,a),eraseCells:(e,t,n,s,r,o)=>i.eraseCells(e*gn,t*gn,n*gn,(s+1)*gn-1,(r+1)*gn-1,(o+1)*gn-1)}}const _n={shoeTop:3,hip:9,shortsTop:14,shoulder:18,torsoTop:20},Vd=_n.shortsTop+1,St=10,At=8,Dt=6,vy=.14,My=.35,wt=4,yy=Dt+3;function Or(i,e,t,n,s,r,o,a,l=1){if(i.fillCells(e,t,n,s,r,o,a),!(l<=0))for(const c of[e,s-l+1])for(const u of[n,o-l+1])i.eraseCells(c,t,u,c+l-1,r,u+l-1)}function lc(i){const e=new Ht,t=new Ht;e.add(t);const n=(v,x)=>{const R=new mr(uf);return x(xy(R)),R.build({name:v,mergeColors:i.mergeColors??!0})},s=Ui(_n.hip),r=Ui(_n.shoulder),o=i.accent??i.shoes,a=i.jerseyAlt??i.shorts,l=i.hairAlt??i.hair,c=v=>{const x=new Ht;x.position.set(v*Ui(3),s,0);const R=n("leg",A=>{const C=-9+_n.shoeTop;A.fillCells(-2,C,-2,1,0,1,i.skin),A.fillCells(-2,C,-2,1,C+2,1,o),A.fillCells(-2,-8,2,1,-5,2,o),Or(A,-3,-9,-4,2,C-1,2,i.shoes,1),A.fillCells(-3,-9,3,2,C-2,4,i.shoes),A.fillCells(-3,-9,-4,2,-9,4,3095125),A.fillCells(-1,-8,-2,0,C-2,1,o),A.fillCells(v>0?1:-2,-8,-4,v>0?2:-1,-7,-2,a)});return x.add(R),x},u=v=>{const x=new Ht;x.position.set(v*Ui(yy),r,0);const R=n("arm",A=>{A.fillCells(-3,-2,-2,1,0,1,i.jersey),A.fillCells(-2,-3,-2,1,-2,1,o),A.fillCells(-2,-5,-2,1,-3,1,i.skin),A.fillCells(-2,-6,-2,1,-5,1,o),Or(A,-3,-9,-3,2,-6,2,i.skin,1),A.fillCells(v>0?2:-3,-8,0,v>0?2:-3,-7,2,i.skin)});return x.add(R),x},d=c(-1),h=c(1),f=u(-1),g=u(1),_=n("shorts",v=>{const x=_n.shortsTop-6;Or(v,-Dt,x,-wt,Dt-1,_n.shortsTop-1,wt-1,i.shorts,1),v.fillCells(-Dt,_n.shortsTop-1,-wt,Dt-1,_n.shortsTop,wt-1,o),v.fillCells(-Dt,x+1,-wt,-Dt,_n.shortsTop-2,wt-1,o),v.fillCells(Dt-1,x+1,-wt,Dt-1,_n.shortsTop-2,wt-1,o),v.eraseCells(-1,x,-wt+1,0,x+3,wt-2)}),m=n("torso",v=>{const x=Vd,R=_n.torsoTop-1;Or(v,-Dt,x,-wt,Dt-1,R,wt-1,i.jersey,1),v.fillCells(-Dt,x+2,-wt,-Dt,R-4,wt-1,a),v.fillCells(Dt-1,x+2,-wt,Dt-1,R-4,wt-1,a),v.fillCells(-Dt,x+3,wt-1,Dt-1,x+4,wt-1,o),v.fillCells(-3,R,wt-2,2,R,wt-1,i.shoes),v.fillCells(-Dt+1,x,-wt+1,Dt-2,x,wt-2,a)}),p=n("head",v=>{const x=_n.torsoTop,R=x+17,A=x+17,w=x+26;Or(v,-St,x,-At,St-1,R,At-1,i.skin,1),v.eraseCells(-St,x,-At,-St+1,x+1,-At+1),v.eraseCells(St-2,x,-At,St-1,x+1,-At+1),v.fillCells(-St,x+1,-At-2,St-1,w-1,-At-1,l),v.fillCells(-St+3,x+10,-At-3,St-4,w-1,-At-2,l),v.fillCells(-St,A,-At-1,St-1,w-1,At-1,i.hair),v.fillCells(-St-1,x+11,-At-1,-St-1,w-1,4,l),v.fillCells(-St-2,x+16,-At,-St-2,w-1,2,l),v.fillCells(St,x+13,-At-1,St,w-1,3,l),v.fillCells(St+1,x+17,-At,St+1,w-1,1,l);const C=x+12;v.fillCells(-St,C+2,At,-4,A-1,At+1,i.hair),v.fillCells(-3,C+3,At,2,A-1,At+1,i.hair),v.fillCells(3,C+1,At,St-1,A-1,At+1,i.hair),v.fillCells(-4,w,-4,3,w+1,3,i.hair),v.fillCells(-2,w+2,-2,1,w+2,1,i.hair),v.fillCells(-St-1,x+3,-2,-St-1,x+6,2,i.skinAlt??i.skin),v.fillCells(St,x+3,-2,St,x+6,2,i.skinAlt??i.skin);const b=x+6,y=At-1;v.fillCells(-7,b,y,-4,b+2,y,16645631),v.fillCells(3,b,y,6,b+2,y,16645631),v.fillCells(-6,b,y,-5,b+2,y,2827320),v.fillCells(4,b,y,5,b+2,y,2827320),v.fillCells(-7,x+11,y,-3,x+11,y,i.hair),v.fillCells(3,x+10,y,7,x+10,y,i.hair),v.fillCells(-1,b-2,y+1,0,b-1,y+1,i.skinAlt??i.skin),v.fillCells(-3,x+1,y,2,x+1,y,13202522)}),S=new Ht;S.position.y=s,t.add(S);for(const v of[_,m,p,f,g])v.position.y-=s,S.add(v);if(t.add(d,h),i.number){const v=gy(i.number,i.anisotropy),x=v.image,R=x.width/x.height,A=Ui(6.5);let w=Ui(5.2),C=w*R;C>A&&(C=A,w=C/R);const b=new bt(new Wn(C,w),new un({map:v,transparent:!0})),y=Ui((Vd+_n.torsoTop)/2)-s;b.position.set(0,y,Ui(-wt)-.003),b.rotation.y=Math.PI,S.add(b)}return{root:e,body:t,lean:S,torso:m,armL:f,armR:g,legL:d,legR:h}}const Sy=11;function df(i,e=1){return Math.abs(Math.sin(i*Sy))}const gt=(i,e,t)=>i+(e-i)*t,cr=i=>i<0?0:i>1?1:i,by=12;function $o(i,e,t,n=by){return t<=0?i:i+(e-i)*(1-Math.exp(-n*t))}const Vi=.3;function Ey(i){if(i<=0||i>=Vi)return 0;const e=Math.PI*i/Vi;return Math.sin(e)*Math.sin(e)}function Wd(i){if(i<=0)return 0;if(i>=Vi)return 1;const e=i/Vi;return e*e*(3-2*e)}function Hc(i,e,t,n,s=!0,r=0,o={}){const a=Math.min(1,t*3),l=Math.sin(e*11)*.9*a,c=o.regate??0,u=o.frustracion??0,d=o.recoge??0,h=cr(o.hold??(n?1:0));i.legL.rotation.x=l,i.legR.rotation.x=-l;const f=Math.sin(e*1.7)*.05;{const _=(1-df(e,o.handSide??1))*c,m=o.handSide===-1?_:0,p=o.handSide===-1?0:_;i.armL.rotation.x=gt(-l*.8+f*(1-a),-.9-l*.1+.55*m-.18*p,h),i.armR.rotation.x=gt(l*.8-f*(1-a),-.9+l*.1+.55*p-.18*m,h),i.armL.rotation.z=gt(.06*(1-a),.12+.1*m-.05*p,h),i.armR.rotation.z=gt(-.06*(1-a),-.12-.1*p+.05*m,h)}i.lean.rotation.x=vy*a*(s?1:.35);const g=cr(o.corte??0);i.lean.rotation.z=g*My*(o.corteDir??1)*(s?1:.35),i.body.position.y=Math.abs(Math.sin(e*11))*.06*a+Math.sin(e*1.7)*.006*(1-a)-r*.12-d*.05-g*.04,i.body.position.x=Math.sin(e*.55)*.015*(1-a),r>0&&(i.legL.rotation.x-=r*.34,i.legR.rotation.x-=r*.28,i.lean.rotation.x+=r*.22,i.armL.rotation.x+=r*.55,i.armR.rotation.x+=r*.55),i.torso.scale.y=1+Math.sin(e*2.2)*.012-r*.05,i.torso.rotation.y=Math.sin(e*.6)*.08*(1-a)+.32*(o.giro??0),i.torso.rotation.x=0,(u>0||d>0)&&(i.armL.rotation.x+=u*.22+d*.55,i.armR.rotation.x+=u*.22+d*.55,i.armL.rotation.z+=u*.16,i.armR.rotation.z-=u*.16,i.torso.rotation.x=u*.2+d*.32,i.body.position.y-=u*.02),s||(i.legL.rotation.x=-.55,i.legR.rotation.x=.35,i.armL.rotation.x=-1.5,i.armR.rotation.x=-1.5)}function Ty(i,e){const t=cr(e);if(t<=0)return;const n=-1.2-t*.75;i.armL.rotation.x=gt(i.armL.rotation.x,n,t),i.armR.rotation.x=gt(i.armR.rotation.x,n,t),i.armL.rotation.z=gt(i.armL.rotation.z,.1,t),i.armR.rotation.z=gt(i.armR.rotation.z,-.1,t),i.torso.rotation.x=gt(i.torso.rotation.x,-.12*t,t)}function Xd(i,e){const t=cr(e);t<=0||(i.armL.rotation.x=gt(i.armL.rotation.x,-2.35,t),i.armR.rotation.x=gt(i.armR.rotation.x,-2.5,t),i.armL.rotation.z=gt(i.armL.rotation.z,.14,t),i.armR.rotation.z=gt(i.armR.rotation.z,-.14,t),i.legL.rotation.x=gt(i.legL.rotation.x,-.7,t),i.legR.rotation.x=gt(i.legR.rotation.x,-.42,t),i.lean.rotation.x=gt(i.lean.rotation.x,-.1,t),i.torso.rotation.x=gt(i.torso.rotation.x,.16,t))}function Ay(i,e){const t=cr(e);t<=0||(i.armL.rotation.x=gt(i.armL.rotation.x,-1.72,t),i.armR.rotation.x=gt(i.armR.rotation.x,-.5,t),i.armL.rotation.z=gt(i.armL.rotation.z,.16,t),i.armR.rotation.z=gt(i.armR.rotation.z,-.26,t),i.legL.rotation.x=gt(i.legL.rotation.x,.22,t),i.legR.rotation.x=gt(i.legR.rotation.x,-.18,t),i.torso.rotation.x=gt(i.torso.rotation.x,-.07,t))}function wy(i,e,t){const n=cr(t);n<=0||(i.armL.rotation.x=gt(i.armL.rotation.x,-2.6,n),i.armR.rotation.x=gt(i.armR.rotation.x,-2.6,n),i.armL.rotation.z=gt(i.armL.rotation.z,.5,n),i.armR.rotation.z=gt(i.armR.rotation.z,-.5,n),i.body.position.y+=Math.abs(Math.sin(e*6))*.12*n,i.torso.rotation.x=gt(i.torso.rotation.x,.1*n,n))}function Ry(i,e,t){const n=t.cell??0,s=new Set;for(const h of t.exclude??[])h.traverse(f=>s.add(f));const r=new Map;let o=0;for(const h of e)h.updateWorldMatrix(!0,!0),h.traverse(f=>{const g=f;if(!g.isMesh||g.isInstancedMesh||g.material!==t.material||s.has(g))return;const _=g.geometry;if(!_?.getAttribute("position")||!_.getAttribute("normal")||!_.getAttribute("color")){o++;return}g.updateWorldMatrix(!0,!1);const m=Py(g),p=`${g.castShadow?"c":"-"}${g.receiveShadow?"r":"-"}${g.renderOrder}`+(n>0?`:${Math.floor(m.x/n)}_${Math.floor(m.z/n)}`:":0");let S=r.get(p);S||(S={cast:g.castShadow,receive:g.receiveShadow,order:g.renderOrder,meshes:[],triangles:0},r.set(p,S));const v=_.index;S.triangles+=v?v.count/3:_.getAttribute("position").count/3,S.meshes.push(g)});const a=new Set;for(const h of r.values())for(const f of h.meshes)a.add(f.geometry);let l=0,c=0,u=0,d=0;for(const h of r.values()){let f=0,g=0;for(const b of h.meshes){const y=b.geometry;f+=y.getAttribute("position").count,g+=y.index?y.index.count:y.getAttribute("position").count}const _=new Float32Array(f*3),m=new Float32Array(f*3),p=new Float32Array(f*3),S=new Uint32Array(g),v=new Ye,x=new P;let R=0,A=0;for(const b of h.meshes){const y=b.geometry,I=y.getAttribute("position"),Y=y.getAttribute("normal"),V=y.getAttribute("color"),q=Ly(b.matrixWorld);v.getNormalMatrix(b.matrixWorld);const z=b.matrixWorld.elements;for(let U=0;U<I.count;U++){const $=(R+U)*3,G=I.getX(U),te=I.getY(U),re=I.getZ(U),he=Y.getX(U),ve=Y.getY(U),Me=Y.getZ(U);q?(_[$]=G,_[$+1]=te,_[$+2]=re,m[$]=he,m[$+1]=ve,m[$+2]=Me):(_[$]=z[0]*G+z[4]*te+z[8]*re+z[12],_[$+1]=z[1]*G+z[5]*te+z[9]*re+z[13],_[$+2]=z[2]*G+z[6]*te+z[10]*re+z[14],x.set(v.elements[0]*he+v.elements[3]*ve+v.elements[6]*Me,v.elements[1]*he+v.elements[4]*ve+v.elements[7]*Me,v.elements[2]*he+v.elements[5]*ve+v.elements[8]*Me),x.normalize(),m[$]=x.x,m[$+1]=x.y,m[$+2]=x.z),p[$]=V.getX(U),p[$+1]=V.getY(U),p[$+2]=V.getZ(U)}if(y.index){const U=y.index.array;for(let $=0;$<U.length;$++)S[A+$]=U[$]+R;A+=U.length}else{for(let U=0;U<I.count;U++)S[A+U]=U+R;A+=I.count}R+=I.count}const w=new hn;w.setAttribute("position",new Ct(_,3)),w.setAttribute("normal",new Ct(m,3)),w.setAttribute("color",new Ct(p,3)),w.setIndex(new Ct(S,1)),w.computeBoundingBox(),w.computeBoundingSphere();const C=new bt(w,t.material);C.name=`batch${n>0?":"+n+"m":""}${h.cast?":cast":""}`,C.castShadow=h.cast,C.receiveShadow=h.receive,C.renderOrder=h.order,C.matrixAutoUpdate=!1,i.add(C),l++,c+=h.triangles,u+=h.triangles,d+=_.byteLength+m.byteLength+p.byteLength+S.byteLength;for(const b of h.meshes)b.parent?.remove(b)}return Cy(i,a),{merged:[...r.values()].reduce((h,f)=>h+f.meshes.length,0),batches:l,triangles:c,before:u,bytes:d,skipped:o}}function Cy(i,e){if(e.size===0)return;const t=new Set;i.traverse(n=>{const s=n;s.isMesh&&s.geometry&&t.add(s.geometry)});for(const n of e)t.has(n)||n.dispose()}function Ly(i){const e=i.elements,t=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];for(let n=0;n<16;n++)if(Math.abs(e[n]-t[n])>1e-9)return!1;return!0}function Py(i){const e=i.geometry;return e.boundingSphere||e.computeBoundingSphere(),e.boundingSphere.center.clone().applyMatrix4(i.matrixWorld)}const Iy=25e4;function Dy(i){const e=i.image,t=e?.width??0,n=e?.height??0;if(!t||!n)return null;const s=document.createElement("canvas");s.width=t,s.height=n;const r=s.getContext("2d",{willReadFrequently:!0});if(!r)return null;try{r.drawImage(e,0,0)}catch{return null}const o=r.getImageData(0,0,t,n).data;return(a,l)=>{const c=a-Math.floor(a),u=l-Math.floor(l),d=Math.min(t-1,Math.max(0,Math.floor(c*t))),f=(Math.min(n-1,Math.max(0,Math.floor((1-u)*n)))*t+d)*4;return(o[f]??0)<<16|(o[f+1]??0)<<8|(o[f+2]??0)}}function Uy(i,e){const t=i;if(!t?.color)return e;const n=t.color.getHex();return n===16777215?e:n}function Ny(i,e,t){const n=e.geometry,s=n.getAttribute("position");if(!s)return 0;const r=n.getAttribute("uv"),o=n.getIndex(),a=Math.floor(o?o.count/3:s.count/3),l=Array.isArray(e.material)?e.material[0]:e.material,c=l?l.map:null,u=c?Dy(c):null;c&&!u&&console.warn("[voxelize] la textura-paleta no se pudo leer; el modelo saldrá de color plano");const d=t.forceColor??Uy(l,t.fallback??16777215);e.updateWorldMatrix(!0,!1);const h=e.matrixWorld,f=t.grid,g=t.tolerance??f*.52,_=t.clip,m=new P,p=new P,S=new P,v=new P,x=new P,R=new P,A=new P;let w=0,C=0;for(let b=0;b<a;b++){const y=o?o.getX(b*3):b*3,I=o?o.getX(b*3+1):b*3+1,Y=o?o.getX(b*3+2):b*3+2;if(m.fromBufferAttribute(s,y).applyMatrix4(h),p.fromBufferAttribute(s,I).applyMatrix4(h),S.fromBufferAttribute(s,Y).applyMatrix4(h),!Number.isFinite(m.x+m.y+m.z+p.x+p.y+p.z+S.x+S.y+S.z)){C++;continue}v.subVectors(p,m),x.subVectors(S,m),R.crossVectors(v,x);const V=R.length();if(V<1e-12||(R.divideScalar(V),t.minNormalY!==void 0&&Math.abs(R.y)<t.minNormalY))continue;let q=d;u&&r&&(q=u((r.getX(y)+r.getX(I)+r.getX(Y))/3,(r.getY(y)+r.getY(I)+r.getY(Y))/3));const z=1;let U=Math.ceil(Math.min(m.x,p.x,S.x)/f-.5)-z,$=Math.floor(Math.max(m.x,p.x,S.x)/f-.5)+z,G=Math.ceil(Math.min(m.y,p.y,S.y)/f-.5)-z,te=Math.floor(Math.max(m.y,p.y,S.y)/f-.5)+z,re=Math.ceil(Math.min(m.z,p.z,S.z)/f-.5)-z,he=Math.floor(Math.max(m.z,p.z,S.z)/f-.5)+z;if(_&&(U=Math.max(U,Math.ceil(_.minX/f-.5)),$=Math.min($,Math.floor(_.maxX/f-.5)),G=Math.max(G,Math.ceil(_.minY/f-.5)),te=Math.min(te,Math.floor(_.maxY/f-.5)),re=Math.max(re,Math.ceil(_.minZ/f-.5)),he=Math.min(he,Math.floor(_.maxZ/f-.5))),U>$||G>te||re>he)continue;const ve=($-U+1)*(te-G+1)*(he-re+1);if(!Number.isFinite(ve)||ve>Iy){C++;continue}for(let Me=U;Me<=$;Me++)for(let O=G;O<=te;O++)for(let Z=re;Z<=he;Z++){A.set((Me+.5)*f,(O+.5)*f,(Z+.5)*f);const ae=(A.x-m.x)*R.x+(A.y-m.y)*R.y+(A.z-m.z)*R.z;ae>g||ae<-g||(A.set(A.x-R.x*ae,A.y-R.y*ae,A.z-R.z*ae),Fy(A,m,p,S)&&(i.putCell(Me,O,Z,q,Math.abs(ae)),w++))}}return C&&console.warn(`[voxelize] ${C} triángulos descartados por coste o coordenadas inválidas`),w}function Fy(i,e,t,n){const s=n.x-e.x,r=n.y-e.y,o=n.z-e.z,a=t.x-e.x,l=t.y-e.y,c=t.z-e.z,u=i.x-e.x,d=i.y-e.y,h=i.z-e.z,f=s*s+r*r+o*o,g=s*a+r*l+o*c,_=a*a+l*l+c*c,m=u*s+d*r+h*o,p=u*a+d*l+h*c,S=f*_-g*g;if(Math.abs(S)<1e-14)return!1;const v=(_*m-g*p)/S,x=(f*p-g*m)/S,R=-1e-6;return v>=R&&x>=R&&v+x<=1-R}function Oy(i,e,t){const n=[];if(e.updateMatrixWorld(!0),e.traverse(r=>{const o=r;o.isMesh&&n.push(o)}),!n.length)return 0;n.sort((r,o)=>$d(o)-$d(r));let s=0;for(const r of n){i.resetPriority();const o=t.colorOf?.(r);s+=Ny(i,r,{grid:t.grid,tolerance:t.tolerance,clip:t.clip,minNormalY:t.minNormalY,forceColor:o,fallback:o??t.fallback})}return s}new Wv;function $d(i){const t=new Rn().setFromObject(i).getSize(new P);return t.x*t.y*t.z}const qd=10243864;function By(i){const e=(i>>16&255)/255,t=(i>>8&255)/255,n=(i&255)/255;return .2126*e+.7152*t+.0722*n}function cc(i,e,t,n,s,r,o){const a=i.size,l=f=>Math.round(f/a),c=l(t-a/2),u=c+1,d=r/2,h=a/2/Math.max(s,.001);for(let f=0;f<Math.PI*2;f+=h){const g=e+Math.cos(f)*s,_=n+Math.sin(f)*s;for(let m=l(g-d-a);m<=l(g+d+a);m++)for(let p=l(_-d-a);p<=l(_+d+a);p++){const S=(m+.5)*a-g,v=(p+.5)*a-_;S*S+v*v>d*d||i.fillCells(m,c,p,m,u,p,o)}}}function jd(i){const e=lf(i),t=i*(xt.halfL+.6),n=Sn,s=i>0?"R":"L",r=new Ht;return r.name=`hoop${s}`,r.add($t(`hoopStruct${s}`,o=>{const a=e+i*n*4,[l,c]=t<a?[t,a]:[a,t];o.span(t-.55,0,-.55,t+.55,.12,.55,7042694),o.span(t-.42,.12,-.42,t+.42,.3,.42,Te.metal);for(const u of[-.34,.34])for(const d of[-.34,.34])o.span(t+u-.05,.12,d-.05,t+u+.05,.34,d+.05,9346228);for(let u=0;u<4;u++){const d=.3+u*.86;o.span(t-.22,d,-.22,t+.22,d+.78,.22,Te.pole),o.span(t-.27,d+.78,-.27,t+.27,d+.86,.27,Te.metal)}o.span(l,3.2,-.18,c,3.5,.18,Te.pole),o.span(l+.06,3.06,-.22,l+.3,3.2,.22,Te.metal),o.span(l+.25,2.62,-.15,l+1.15,3.2,.15,Te.metal),o.span(l+.65,2.1,-.15,l+1.55,2.62,.15,Te.metal),o.span(l+1.05,1.6,-.15,l+1.85,2.1,.15,Te.metal)},Sn*2)),r.add($t(`hoopFine${s}`,o=>{const a=n,l=2.9,c=3.95;o.span(e-a,l,-.9,e+a,c,.9,Te.frame);for(const f of[-.9,.9])o.span(e-a*1.1,l,f-a,e+a*1.1,c,f+a,Te.metal);for(const f of[l,c])o.span(e-a*1.1,f-a,-.9,e+a*1.1,f+a,.9,Te.metal);o.span(e-a*1.4,l-.06,-.9,e+a*1.4,l,.9,2831696);const u=-i*(a+n*.6);o.span(e+u-.03,3.05,-.3,e+u+.03,3.5,-.2,Te.rim),o.span(e+u-.03,3.05,.2,e+u+.03,3.5,.3,Te.rim),o.span(e+u-.03,3.05,-.3,e+u+.03,3.15,.3,Te.rim),o.span(e+u-.03,3.4,-.3,e+u+.03,3.5,.3,Te.rim);const d=e+u-.05;o.span(d-.26,c+.02,-.3,d+.26,c+.52,.3,2042167),o.span(d-.22,c+.08,-.24,d+.22,c+.46,.24,725536),o.span(d-i*.06,c+.14,-.18,d-i*.02,c+.4,-.02,Te.rim),o.span(d-i*.06,c+.14,.02,d-i*.02,c+.4,.18,Te.rim);const h=kt(i);o.span(Math.min(e+u,h),Nt.y-.05,-.06,Math.max(e+u,h),Nt.y+.05,.06,Te.rim),cc(o,h,Nt.y,0,Nt.radius,n*1.8,Te.rim)})),r.add($t(`hoopPad${s}`,o=>{o.span(t-.3,.9,-.3,t+.3,2.15,.3,2568524);for(const a of[1.1,1.5,1.9])o.span(t-.34,a,-.34,t+.34,a+.09,.34,Te.shirt)},Sn*2)),r.add(ky(i)),r}const Xs={time:{value:0},amp:{value:0}};let ll=null;function zy(){if(ll)return ll;const i=new Si({vertexColors:!0,roughness:.92,metalness:0,side:Vn});return i.onBeforeCompile=e=>{e.uniforms.uNetTime=Xs.time,e.uniforms.uNetAmp=Xs.amp,e.vertexShader=`uniform float uNetTime;
uniform float uNetAmp;
${e.vertexShader}`.replace("#include <begin_vertex>",`#include <begin_vertex>
      {
        // 0 en el aro, 1 en el fondo de la red: abajo se mueve todo, arriba nada.
        float k = clamp((3.02 - position.y) / 0.45, 0.0, 1.0);
        k *= k;
        float f = uNetAmp * 0.075 * k;
        transformed.x += sin(uNetTime * 26.0 + position.y * 12.0 + position.x) * f;
        transformed.z += cos(uNetTime * 23.0 + position.y * 10.0 + position.z) * f;
        transformed.y -= abs(sin(uNetTime * 21.0 + position.y * 8.0)) * f * 0.4;
      }`)},ll=i,i}function ky(i){const e=Sn,t=kt(i),n=new mr(e),s=12,r=8;for(let l=0;l<s;l++){const c=l/s*Math.PI*2;for(let u=0;u<r;u++){const d=u/(r-1),h=Nt.radius*(1-d*.42),f=Nt.y-.04-d*.44,g=Math.round((f-e/2)/e),_=Math.round((t+Math.cos(c)*h)/e),m=Math.round(Math.sin(c)*h/e);n.fillCells(_,g,m,_,g+1,m,Te.net)}}cc(n,t,Nt.y-.2,0,Nt.radius*.88,e*1.2,Te.net),cc(n,t,Nt.y-.48,0,Nt.radius*.58,e*1.2,Te.net);const a=n.build({name:`net${i>0?"R":"L"}`,mergeColors:!0}).children[0];return a.material=zy(),a.castShadow=!1,a.receiveShadow=!1,a}function Yd(){const i=$t("ballCart",t=>{t.span(-.55,.6,-.22,.55,.66,.22,Te.wood),t.span(-.55,.66,-.22,.55,.72,-.16,Te.woodDark),t.span(-.55,.66,.16,.55,.72,.22,Te.woodDark);for(const r of[-.49000000000000005,.49000000000000005]){for(const o of[-.16,.16])t.span(r-.035,0,o-.035,r+.035,.6,o+.035,Te.metal);t.span(r-.03,.12,-.16,r+.03,.18,.16,Te.metal)}t.span(-.55,.66,.19,-.49000000000000005,1.05,.25,Te.metal),t.span(.49000000000000005,.66,.19,.55,1.05,.25,Te.metal),t.span(-.55,1,.19,.55,1.06,.25,Te.wood)},Sn*2),e=[];for(let t=0;t<3;t++){const n=Hy(`cartBall${t}`,-.36+t*.36,.66+Kd,0,Kd);e.push(n),i.add(n)}return{group:i,balls:e}}const Kd=.13;function Hy(i,e,t,n,s){const r=Sn,o=Math.ceil(s/r)+1;return $t(i,a=>{for(let l=-o;l<=o;l++)for(let c=-o;c<=o;c++)for(let u=-o;u<=o;u++){const d=e+l*r,h=t+c*r,f=n+u*r;if((d-e)**2+(h-t)**2+(f-n)**2>s*s)continue;const g=Math.abs(h-t)<r*.6||Math.abs(d-e)<r*.6;a.span(d-r/2,h-r/2,f-r/2,d+r/2,h+r/2,f+r/2,g?10243864:Te.ball)}},r)}function Gy(){return $t("scorerTable",i=>{const n=Gr.z;i.span(-1.2,.92,n-.42,1.2,1,n+.42,Te.tableTop),i.span(-1.2-.04,1,n-.46,1.2+.04,1.06,n+.46,Te.table),i.span(-1.2,.72,n+.36,1.2,.92,n+.42,Te.table);for(const s of[-1,1])i.span(s-.06,.1,n-.34,s+.06,.92,n+.34,Te.metal),i.span(s-.14,0,n-.42,s+.14,.1,n+.42,7042694);i.span(-1.2+.1,.45,n-.05,1.2-.1,.53,n+.05,Te.metal),i.span(-.42,1,n-.16,-.05,1.06,n+.02,2042167),i.span(-.4,1.06,n-.12,-.07,1.46,n-.04,725536),i.span(-.37,1.11,n-.05,-.1,1.41,n-.03,4164320),i.span(-.9,1,n-.14,-.62,1.05,n+.04,2042167),i.span(-.88,1.05,n-.11,-.64,1.34,n-.05,725536),i.span(-.85,1.09,n-.05,-.67,1.3,n-.04,8315018),i.span(.05,1,n-.2,.55,1.05,n+.02,2832978),i.span(.72,1,n-.16,.92,1.05,n+.04,2042167),i.span(.7,1.05,n-.12,.94,1.5,n-.02,725536),i.span(.73,1.14,n-.03,.91,1.42,n-.01,16726832),i.span(.78,1.2,n-.03,.8,1.36,n-.01,2042167),i.span(.65,1,n-.12,.95,1.06,n+.14,15262416),i.span(-1,1,n-.1,-.84,1.16,n+.06,15262416),i.span(-.74,1,n-.08,-.6,1.14,n+.08,15262416),i.span(.3,1,n+.18,.42,1.24,n+.3,5220592),i.span(.3,1.24,n+.2,.42,1.28,n+.28,2042167);for(const s of[-.75,.75])i.span(s-.22,.42,n-.86,s+.22,.5,n-.5,Te.wood),i.span(s-.22,.5,n-.9,s+.22,.92,n-.84,Te.wood),i.span(s-.06,0,n-.82,s+.06,.42,n-.54,Te.metal);i.span(-.05,1.06,n+.4,.05,2.1,n+.46,Te.metal),i.span(-.9,1.6,n+.36,.9,2.14,n+.44,2042167),i.span(-.82,1.67,n+.44,.82,2.07,n+.48,Te.shirt);for(const s of[-1.15,1.12])i.span(s,.5,n+.3,s+.05,.92,n+.35,2042167),i.span(s+.05,.12,n+.3,s+.28,.5,n+.35,2042167)},Sn*2)}function Vy(){return $t("bench",i=>{i.span(-2.5,.44,7.75,2.5,.54,7.75+.27,Te.wood),i.span(-2.5,.44,7.75+.31,2.5,.54,7.75+.55,Te.wood),i.span(-2.5,.54,7.75+.44,2.5,.72,7.75+.55,Te.wood),i.span(-2.5,.86,7.75+.44,2.5,1.04,7.75+.55,Te.wood),i.span(-2.5,1.04,7.75+.42,2.5,1.1,7.75+.57,Te.woodDark);for(const o of[-2.25,0,2.25])i.span(o-.06,.1,7.75+.02,o+.06,.44,7.75+.53,Te.metal),i.span(o-.12,0,7.75,o+.12,.1,7.75+.55,7042694);i.span(1.05,.54,7.75+.08,1.75,.89,7.75+.48,Te.shirt),i.span(1.2,.89,7.75+.14,1.6,1.01,7.75+.42,Te.shirtAlt),i.span(1,.72,7.75+.44,1.8,.78,7.75+.5,2042167),i.span(-1.45,.54,7.75+.1,-.95,.63,7.75+.46,16317180),i.span(-1.4,.63,7.75+.14,-1,.69,7.75+.42,14674423),i.span(-2.4,.54,7.75+.12,-1.75,.86,7.75+.44,4164320),i.span(-2.36,.86,7.75+.16,-1.79,.92,7.75+.4,14674423),i.span(-.3,0,7.75+.62,-.16,.24,7.75+.76,5220592),i.span(.2,0,7.75+.6,.34,.24,7.75+.74,8315018);const t=3.4,n=7.75+.3;i.span(t-.5,.03,n-.5,t+.5,.09,n+.5,7042694);for(const[o,a]of[[-.46,-.46],[.46,-.46],[-.46,.46],[.46,.46]])i.span(t+o-.03,.09,n+a-.03,t+o+.03,.62,n+a+.03,Te.metal);i.span(t-.5,.6,n-.5,t+.5,.66,n+.5,Te.metal),i.span(t-.52,.14,n-.52,t-.44,.56,n+.52,Te.shirt),i.sphere(t-.2,.28,n-.18,.14,Te.ball),i.sphere(t+.2,.28,n+.12,.14,Te.ball),i.sphere(t-.02,.5,n+.02,.14,Te.ball);const s=-3.35,r=7.75+.45;i.span(s-.08,0,r-.08,s+.08,1.1,r+.08,Te.metal),i.span(s-.42,1.1,r-.12,s+.42,1.62,r+.12,2042167);for(let o=0;o<4;o++)for(const a of[-.24,.12]){const l=o<2;i.span(s+a,1.18+o*.1,r+.12,s+a+.12,1.26+o*.1,r+.16,l?Te.tallyOn:Te.tallyOff)}},Sn*2)}function Wy(){return $t("tunnel",i=>{i.span(-11.7-.25,0,-9.9-.45,-8.3+.25,3.25,-9.9+.45,Te.tunnel),i.span(-11.7,0,-9.9-.36,-11.7+.35,2.65,-9.9+.36,4872832),i.span(-8.3-.35,0,-9.9-.36,-8.3,2.65,-9.9+.36,4872832),i.span(-11.7,2.65,-9.9-.36,-8.3,3,-9.9+.36,4872832),i.span(-11.7+.35,0,-9.9-.3,-8.3-.35,2.65,-9.9+.3,Te.tunnelInner),i.span(-11.7+.7,0,-9.9-.18,-8.3-.7,2.4,-9.9+.18,1383728),i.span(-11.7+.5,3.25,-9.9+.34,-8.3-.5,3.85,-9.9+.46,2042167);for(let s=0;s<5;s++){const r=-10.95+s*.26;i.span(r,3.42,-9.9+.46,r+.26,3.68,-9.9+.5,1483594),s<4&&i.span(r+.26,3.5,-9.9+.46,r+.38,3.6,-9.9+.5,1483594)}for(const s of[-11.7-.25,-8.3+.25])i.span(s-.1,1.5,-9.9+.42,s+.1,1.7,-9.9+.5,1483594);i.span(-11.7+.5,0,-9.9+.45,-11.7+.72,.02,-9.9+1.6,14674423),i.span(-8.3-.72,0,-9.9+.45,-8.3-.5,.02,-9.9+1.6,14674423);for(const s of[-11.7+.7,-8.3-.7])i.span(s-.12,3,-9.9+.3,s+.12,3.16,-9.9+.42,9346228),i.span(s-.08,3,-9.9+.42,s+.08,3.12,-9.9+.48,16774084)},Sn*4)}function Zd(i,e,t){const n=new mr,s=n.size,r=d=>Math.round(d/s),o=s*4,a=.01;for(let d=0;d<Math.PI*2;d+=a){const h=i+Math.cos(d)*t,f=e+Math.sin(d)*t;for(let g=r(h-o);g<=r(h+o);g++)for(let _=r(f-o);_<=r(f+o);_++){const m=(g+.5)*s-h,p=(_+.5)*s-f;m*m+p*p>o*o||n.fillCells(g,0,_,g,0,_,16738842)}}const c=n.build({name:`zoneRing(${i},${e})`,flatTop:!0,flatY:.012,shadows:!1}).children[0];if(!c)return new bt(new Wn(.2,.2),new un({color:16738842}));const u=new un({color:16738842,side:On});return c.material=u,c.geometry.translate(-i,0,-e),c.position.set(i,0,e),c.castShadow=!1,c.receiveShadow=!1,c}function Xy(i){const e=tn.radius*tn.visualScale,t=e*2/12,n=new mr(t);let s=0;i&&(s=Oy(n,i,{grid:t,colorOf:u=>{const h=(Array.isArray(u.material)?u.material[0]:u.material)?.color?.getHex()??Te.ball;return By(h)<.22?qd:Te.ball}})),s===0&&n.sphere(0,0,0,e,Te.ball);const r=t,o=Math.ceil(e/r)+1,a=r*.5,l=r*.5,c=(e-r*1.9)**2;for(let u=-o;u<=o;u++)for(let d=-o;d<=o;d++)for(let h=-o;h<=o;h++){const f=(u+.5)*r,g=(d+.5)*r,_=(h+.5)*r,m=f*f+g*g+_*_;m>e*e||m<c||(Math.abs(g-a)<l||Math.abs(f-a)<l||Math.abs(_-a)<l)&&n.putCell(u,d,h,qd)}return n.build({name:"ball"})}function Jd(i,e){if(e===xp)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===tc||e===Ph){let t=i.getIndex();if(t===null){const o=[],a=i.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===tc)for(let o=1;o<=n;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}class $y extends pr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Zy(t)}),this.register(function(t){return new Jy(t)}),this.register(function(t){return new a1(t)}),this.register(function(t){return new l1(t)}),this.register(function(t){return new c1(t)}),this.register(function(t){return new e1(t)}),this.register(function(t){return new t1(t)}),this.register(function(t){return new n1(t)}),this.register(function(t){return new i1(t)}),this.register(function(t){return new Ky(t)}),this.register(function(t){return new s1(t)}),this.register(function(t){return new Qy(t)}),this.register(function(t){return new o1(t)}),this.register(function(t){return new r1(t)}),this.register(function(t){return new jy(t)}),this.register(function(t){return new u1(t)}),this.register(function(t){return new d1(t)})}load(e,t,n,s){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const c=$r.extractUrlBase(e);o=$r.resolveURL(c,this.path)}else o=$r.extractUrlBase(e);this.manager.itemStart(e);const a=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new tf(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===hf){try{o[tt.KHR_BINARY_GLTF]=new h1(e)}catch(d){s&&s(d);return}r=JSON.parse(o[tt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new T1(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){const d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case tt.KHR_MATERIALS_UNLIT:o[d]=new Yy;break;case tt.KHR_DRACO_MESH_COMPRESSION:o[d]=new f1(r,this.dracoLoader);break;case tt.KHR_TEXTURE_TRANSFORM:o[d]=new p1;break;case tt.KHR_MESH_QUANTIZATION:o[d]=new m1;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function qy(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}const tt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class jy{constructor(e){this.parser=e,this.name=tt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const u=new Ne(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],rn);const d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new rc(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Pv(u),c.distance=d;break;case"spot":c=new nf(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),c.decay=2,mi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}}class Yy{constructor(){this.name=tt.KHR_MATERIALS_UNLIT}getMaterialType(){return un}extendParams(e,t,n){const s=[];e.color=new Ne(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],rn),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Ut))}return Promise.all(s)}}class Ky{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class Zy{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new it(a,a)}return Promise.all(r)}}class Jy{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}}class Qy{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}}class e1{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new Ne(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=s.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],rn)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,Ut)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}}class t1{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}}class n1{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new Ne().setRGB(a[0],a[1],a[2],rn),Promise.all(r)}}class i1{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=s.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class s1{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new Ne().setRGB(a[0],a[1],a[2],rn),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,Ut)),Promise.all(r)}}class r1{constructor(e){this.parser=e,this.name=tt.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}}class o1{constructor(e){this.parser=e,this.name=tt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:ni}extendMaterialParams(e,t){const n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const r=[],o=s.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}}class a1{constructor(e){this.parser=e,this.name=tt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}}class l1{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class c1{constructor(e){this.parser=e,this.name=tt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class u1{constructor(e){this.name=tt.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const l=s.byteOffset||0,c=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){const f=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}}class d1{constructor(e){this.name=tt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const c of s.primitives)if(c.mode!==Tn.TRIANGLES&&c.mode!==Tn.TRIANGLE_STRIP&&c.mode!==Tn.TRIANGLE_FAN&&c.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],l={};for(const c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{const u=c.pop(),d=u.isGroup?u.children:[u],h=c[0].count,f=[];for(const g of d){const _=new Xe,m=new P,p=new ei,S=new P(1,1,1),v=new hs(g.geometry,g.material,h);for(let x=0;x<h;x++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,x),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,x),l.SCALE&&S.fromBufferAttribute(l.SCALE,x),v.setMatrixAt(x,_.compose(m,p,S));for(const x in l)if(x==="_COLOR_0"){const R=l[x];v.instanceColor=new ra(R.array,R.itemSize,R.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&g.geometry.setAttribute(x,l[x]);Tt.prototype.copy.call(v,g),this.parser.assignFinalMaterial(v),f.push(v)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const hf="glTF",Br=12,Qd={JSON:1313821514,BIN:5130562};class h1{constructor(e){this.name=tt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Br),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==hf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-Br,r=new DataView(e,Br);let o=0;for(;o<s;){const a=r.getUint32(o,!0);o+=4;const l=r.getUint32(o,!0);if(o+=4,l===Qd.JSON){const c=new Uint8Array(e,Br+o,a);this.content=n.decode(c)}else if(l===Qd.BIN){const c=Br+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class f1{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=tt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(const u in o){const d=uc[u]||u.toLowerCase();a[d]=o[u]}for(const u in e.attributes){const d=uc[u]||u.toLowerCase();if(o[u]!==void 0){const h=n.accessors[e.attributes[u]],f=Ys[h.componentType];c[d]=f.name,l[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(const g in f.attributes){const _=f.attributes[g],m=l[g];m!==void 0&&(_.normalized=m)}d(f)},a,c,rn,h)})})}}class p1{constructor(){this.name=tt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class m1{constructor(){this.name=tt.KHR_MESH_QUANTIZATION}}class ff extends Qr{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=s-t,d=(n-t)/u,h=d*d,f=h*d,g=e*c,_=g-c,m=-2*f+3*h,p=f-h,S=1-m,v=p-h+d;for(let x=0;x!==a;x++){const R=o[_+x+a],A=o[_+x+l]*u,w=o[g+x+a],C=o[g+x]*u;r[x]=S*R+v*A+m*w+p*C}return r}}const g1=new ei;class _1 extends ff{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return g1.fromArray(r).normalize().toArray(r),r}}const Tn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ys={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},eh={9728:Gt,9729:vn,9984:yh,9985:jo,9986:zr,9987:An},th={33071:Hi,33648:ia,10497:Qs},cl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},uc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ni={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},x1={CUBICSPLINE:void 0,LINEAR:Yr,STEP:jr},ul={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function v1(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Si({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Vn})),i.DefaultMaterial}function os(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function mi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function M1(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){const d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){const d=e[c];if(n){const h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(s){const h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(r){const h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){const u=c[0],d=c[1],h=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function y1(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function S1(i){let e;const t=i.extensions&&i.extensions[tt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+dl(t.attributes):e=i.indices+":"+dl(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+dl(i.targets[n]);return e}function dl(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function dc(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function b1(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const E1=new Xe;class T1{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new qy,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const l=a.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new wv(this.options.manager):this.textureLoader=new Dv(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new tf(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return os(r,a,s),mi(a,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(const l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const o=t[s].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(o,a)=>{const l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(const[c,u]of o.children.entries())r(u,a.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[tt.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,o){n.load($r.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const o=cl[s.type],a=Ys[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new Ct(c,o,l))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],l=cl[s.type],c=Ys[s.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,h=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let _,m;if(f&&f!==d){const p=Math.floor(h/f),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count;let v=t.cache.get(S);v||(_=new c(a,p*f,s.count*f/u),v=new ov(_,f/u),t.cache.add(S,v)),m=new Cc(v,l,h%f/u,g)}else a===null?_=new c(s.count*l):_=new c(a,h,s.count*l),m=new Ct(_,l,g);if(s.sparse!==void 0){const p=cl.SCALAR,S=Ys[s.sparse.indices.componentType],v=s.sparse.indices.byteOffset||0,x=s.sparse.values.byteOffset||0,R=new S(o[1],v,s.sparse.count*p),A=new c(o[2],x,s.sparse.count*l);a!==null&&(m=new Ct(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let w=0,C=R.length;w<C;w++){const b=R[w];if(m.setX(b,A[w*l]),l>=2&&m.setY(b,A[w*l+1]),l>=3&&m.setZ(b,A[w*l+2]),l>=4&&m.setW(b,A[w*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r];let a=this.textureLoader;if(o.uri){const l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){const s=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const h=(r.samplers||{})[o.sampler]||{};return u.magFilter=eh[h.magFilter]||vn,u.minFilter=eh[h.minFilter]||An,u.wrapS=th[h.wrapS]||Qs,u.wrapT=th[h.wrapT]||Qs,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Gt&&u.minFilter!==vn,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const o=s.images[e],a=self.URL||self.webkitURL;let l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(d){c=!0;const h=new Blob([d],{type:o.mimeType});return l=a.createObjectURL(h),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(d){return new Promise(function(h,f){let g=h;t.isImageBitmapLoader===!0&&(g=function(_){const m=new Ft(_);m.needsUpdate=!0,h(m)}),t.load($r.resolveURL(d,r.path),g,void 0,f)})}).then(function(d){return c===!0&&a.revokeObjectURL(l),mi(d,o),d.userData.mimeType=o.mimeType||b1(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[tt.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[tt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const l=r.associations.get(o);o=r.extensions[tt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new Ic,Gn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new Kh,Gn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Si}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let o;const a={},l=r.extensions||{},c=[];if(l[tt.KHR_MATERIALS_UNLIT]){const d=s[tt.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),c.push(d.extendParams(a,r,t))}else{const d=r.pbrMetallicRoughness||{};if(a.color=new Ne(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){const h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],rn),a.opacity=h[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",d.baseColorTexture,Ut)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=On);const u=r.alphaMode||ul.OPAQUE;if(u===ul.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===ul.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==un&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new it(1,1),r.normalTexture.scale!==void 0)){const d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==un&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==un){const d=r.emissiveFactor;a.emissive=new Ne().setRGB(d[0],d[1],d[2],rn)}return r.emissiveTexture!==void 0&&o!==un&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Ut)),Promise.all(c).then(function(){const d=new o(a);return r.name&&(d.name=r.name),mi(d,r),t.associations.set(d,{materials:e}),r.extensions&&os(s,d,r),d})}createUniqueName(e){const t=mt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[tt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return nh(l,a,t)})}const o=[];for(let a=0,l=e.length;a<l;a++){const c=e[a],u=S1(c),d=s[u];if(d)o.push(d.promise);else{let h;c.extensions&&c.extensions[tt.KHR_DRACO_MESH_COMPRESSION]?h=r(c):h=nh(new hn,c,t),s[u]={primitive:c,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){const u=o[l].material===void 0?v1(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let f=0,g=u.length;f<g;f++){const _=u[f],m=o[f];let p;const S=c[f];if(m.mode===Tn.TRIANGLES||m.mode===Tn.TRIANGLE_STRIP||m.mode===Tn.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new lv(_,S):new bt(_,S),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===Tn.TRIANGLE_STRIP?p.geometry=Jd(p.geometry,Ph):m.mode===Tn.TRIANGLE_FAN&&(p.geometry=Jd(p.geometry,tc));else if(m.mode===Tn.LINES)p=new dv(_,S);else if(m.mode===Tn.LINE_STRIP)p=new Pc(_,S);else if(m.mode===Tn.LINE_LOOP)p=new hv(_,S);else if(m.mode===Tn.POINTS)p=new Zh(_,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&y1(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),mi(p,r),m.extensions&&os(s,p,m),t.assignFinalMaterial(p),d.push(p)}for(let f=0,g=d.length;f<g;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&os(s,d[0],r),d[0];const h=new Ht;r.extensions&&os(s,h,r),t.associations.set(h,{meshes:e});for(let f=0,g=d.length;f<g;f++)h.add(d[f]);return h})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new sn(Xp.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Ac(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),mi(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),o=s,a=[],l=[];for(let c=0,u=o.length;c<u;c++){const d=o[c];if(d){a.push(d);const h=new Xe;r!==null&&h.fromArray(r.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Lc(a,l)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){const f=s.channels[d],g=s.samplers[f.sampler],_=f.target,m=_.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,S=s.parameters!==void 0?s.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",S)),c.push(g),u.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){const h=d[0],f=d[1],g=d[2],_=d[3],m=d[4],p=[];for(let S=0,v=h.length;S<v;S++){const x=h[S],R=f[S],A=g[S],w=_[S],C=m[S];if(x===void 0)continue;x.updateMatrix&&x.updateMatrix();const b=n._createAnimationTracks(x,R,A,w,C);if(b)for(let y=0;y<b.length;y++)p.push(b[y])}return new Mv(r,void 0,p)})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));const l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){const u=c[0],d=c[1],h=c[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,E1)});for(let f=0,g=d.length;f<g;f++)u.add(d[f]);return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(r.isBone===!0?u=new jh:c.length>1?u=new Ht:c.length===1?u=c[0]:u=new Tt,u!==c[0])for(let d=0,h=c.length;d<h;d++)u.add(c[d]);if(r.name&&(u.userData.name=r.name,u.name=o),mi(u,r),r.extensions&&os(n,u,r),r.matrix!==void 0){const d=new Xe;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);return s.associations.has(u)||s.associations.set(u,{}),s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new Ht;n.name&&(r.name=s.createUniqueName(n.name)),mi(r,n),n.extensions&&os(t,r,n);const o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,d=l.length;u<d;u++)r.add(l[u]);const c=u=>{const d=new Map;for(const[h,f]of s.associations)(h instanceof Gn||h instanceof Ft)&&d.set(h,f);return u.traverse(h=>{const f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){const o=[],a=e.name?e.name:e.uuid,l=[];Ni[r.path]===Ni.weights?e.traverse(function(h){h.morphTargetInfluences&&l.push(h.name?h.name:h.uuid)}):l.push(a);let c;switch(Ni[r.path]){case Ni.weights:c=sr;break;case Ni.rotation:c=rr;break;case Ni.position:case Ni.scale:c=or;break;default:switch(n.itemSize){case 1:c=sr;break;case 2:case 3:default:c=or;break}break}const u=s.interpolation!==void 0?x1[s.interpolation]:Yr,d=this._getArrayFromAccessor(n);for(let h=0,f=l.length;h<f;h++){const g=new c(l[h]+"."+Ni[r.path],t.array,d,u);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=dc(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof rr?_1:ff;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function A1(i,e,t){const n=e.attributes,s=new Rn;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),a.normalized){const u=dc(Ys[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const a=new P,l=new P;for(let c=0,u=r.length;c<u;c++){const d=r[c];if(d.POSITION!==void 0){const h=t.json.accessors[d.POSITION],f=h.min,g=h.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),h.normalized){const _=dc(Ys[h.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;const o=new ti;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function nh(i,e,t){const n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(const o in n){const a=uc[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){const o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return nt.workingColorSpace!==rn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${nt.workingColorSpace}" not supported.`),mi(i,e),A1(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?M1(i,e.targets,t):i})}async function w1(i,e){try{const t=await new $y(e).loadAsync(i);return t.scene.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0)}),{scene:t.scene,animations:t.animations}}catch(t){return console.warn(`[assets] no se pudo cargar ${i}; se usa el modelo procedural`,t),null}}function R1(i,e={}){i.updateMatrixWorld(!0);const t=new Rn().setFromObject(i);if(t.isEmpty())return;const n=t.getSize(new P),s=t.getCenter(new P);if(i.position.sub(s),e.zUp&&(i.rotation.x=-Math.PI/2,i.updateMatrixWorld(!0)),e.targetSize&&n.lengthSq()>0&&(i.scale.setScalar(e.targetSize/Math.max(n.x,n.y,n.z)),i.updateMatrixWorld(!0)),e.liftTo!==void 0){const r=new Rn().setFromObject(i);i.position.y+=e.liftTo-r.max.y}}function C1(){const i=$t("tvCamera",t=>{t.span(-.23,1.31,-.4,.23,1.69,.4,2042167),t.span(.23,1.49,-.2,.33,1.69,.1,1120295),t.span(-.09,1.19,-.09,.09,1.31,.09,3621201);for(let n=0;n<3;n++){const s=.4+n*.12,r=.17-n*.02;t.span(-r,1.5-r,s,r,1.5+r,s+.12,n===0?724761:1120295)}t.span(-.21,1.29,.72,.21,1.71,.84,1120295);for(const[n,s]of[[.65,0],[-.325,.56],[-.325,-.56]])for(let o=0;o<13;o++){const a=o/12,l=1.19-a*1.19,c=n*a,u=s*a;t.span(c-.055,l-.09,u-.055,c+.055,l,u+.055,3621201)}}),e=new bt(new xn(.1,.1,.1),new un({color:Te.tallyOn}));return e.position.set(0,1.78,.3),i.add(e),{group:i,tally:e}}function L1(i){return lr(128,48,e=>{e.fillStyle="#2a1010",e.fillRect(0,0,128,48),e.fillStyle="#7f5151",e.font='bold 28px "Silkscreen", "Bebas Neue", monospace',e.textAlign="center",e.textBaseline="middle",e.fillText("ON AIR",64,26)})}function P1(){const i=new Ht,e=vi($t("setDressing",c=>{c.span(6.8,0,11.2,12.2,2.6,11.32,1120295),c.span(6.8,2,11.16,12.2,2.16,11.22,Te.shirt),c.span(6.6,0,10.9,12.4,.08,11.5,725536)},Sn*4));i.add(e);const t=L1(),n=new bt(new xn(1.1,.41,.1),new Si({map:t,emissive:16723245,emissiveMap:t,emissiveIntensity:.15}));n.position.set(9.5,2.95,11.2),i.add(n);const s=lc({skin:15246703,skinAlt:13601362,hair:3484194,hairAlt:2366486,jersey:5220592,jerseyAlt:3110589,shorts:3489899,shoes:16645622,accent:16747578});s.root.position.set(9,0,9.7),s.root.rotation.y=Math.PI;const r=new mr;r.span(-.03,-.2,-.03,.03,.06,.03,1118481),r.span(-.07,.06,-.07,.07,.18,.07,Te.shirt),r.span(-.05,.18,-.05,.05,.22,.05,1118481);const o=r.build({name:"mic"});o.rotation.x=Math.PI/2,o.position.set(0,-.6,.06),s.armR.add(o);const a=C1();a.group.position.set(11,0,8.7),a.group.rotation.y=-Math.PI/2;const l=lc({skin:14062679,skinAlt:12418114,hair:5519135,hairAlt:3876117,jersey:8280264,jerseyAlt:6242211,shorts:3489899,shoes:16645622,accent:5220592});return l.root.position.set(11.9,0,8.7),l.root.rotation.y=-Math.PI/2,i.add(s.root,a.group,l.root),vi(s.root),vi(l.root),{group:i,reporter:s,operator:l,tally:a.tally,onAir:n}}function I1(i,e,t=0){Hc(i,e,0,!1);const n=Math.sin(e*1.7);i.body.position.x=n*.025,i.legL.rotation.x+=n*.05,i.legR.rotation.x-=n*.03,i.torso.scale.y=1+Math.sin(e*2)*.014,i.armL.rotation.x+=Math.sin(e*.9+1.1)*.05,i.armR.rotation.x+=Math.sin(e*.9+1.1)*.05,i.armL.rotation.x+=t*(-.38+Math.sin(e*2.6)*.13),i.armL.rotation.z+=t*(.2+Math.sin(e*1.9)*.07),i.torso.rotation.x+=t*Math.sin(e*2.3)*.07,i.torso.rotation.z=Math.sin(e*1.3)*.04+t*Math.sin(e*1.7)*.03}function D1(i,e){Hc(i,e,0,!1);const t=Math.sin(e*1.4+.8);i.body.position.x=t*.022,i.legL.rotation.x+=t*.04,i.legR.rotation.x-=t*.025,i.torso.scale.y=1+Math.sin(e*1.8+.5)*.012,i.armR.rotation.x=-.45+Math.sin(e*.8)*.05,i.armR.rotation.z=-.5,i.armL.rotation.x=-1.1+Math.sin(e*1.1+2)*.07,i.armL.rotation.z=.22,i.torso.rotation.y=.12+Math.sin(e*.5)*.05,i.torso.rotation.z=Math.sin(e*1.6)*.03}const ih=1,qo=2,hl=3,U1=900;function N1(i){switch(i.tipo){case"arranque":return{texto:ne("cmt_start"),ms:3e3,peso:hl};case"carro":return{texto:Oi("cmt_rack",{n:i.carro,total:i.total}),ms:2200,peso:qo};case"dinero":return{texto:ne("cmt_money"),ms:2200,peso:qo};case"canasta":return i.dinero?{texto:Oi("cmt_make_money",{puntos:i.puntos}),ms:1900,peso:qo}:i.racha>=3?{texto:Oi("cmt_make_streak",{racha:i.racha}),ms:1700,peso:qo}:{texto:Oi("cmt_make",{suma:i.suma,puntos:i.puntos}),ms:1400,peso:ih};case"fallo":return{texto:ne("cmt_miss"),ms:1300,peso:ih};case"bocina":return{texto:ne("cmt_buzzer"),ms:3e3,peso:hl};case"final":return{texto:i.record?Oi("cmt_end_record",{puntos:i.puntos,aciertos:i.aciertos,tiros:i.tiros}):Oi("cmt_end",{puntos:i.puntos,aciertos:i.aciertos,tiros:i.tiros}),ms:5e3,peso:hl}}}const F1=()=>({hasta:-1,desde:-1,peso:0});function O1(i,e,t){const n=N1(e);return t<i.hasta&&n.peso<i.peso&&t-i.desde<U1?null:(i.hasta=t+n.ms,i.desde=t,i.peso=n.peso,n)}const B1=()=>({activo:!1,t:Mn.segundos,puntos:0,carro:0,balones:Mn.balones,tiros:0,aciertos:0,racha:0,esperando:!1,reloj:!1,dinero:!1,fin:null});function z1(i){i.activo=!0,i.t=Mn.segundos,i.puntos=0,i.carro=0,i.balones=Mn.balones,i.tiros=0,i.aciertos=0,i.racha=0,i.esperando=!1,i.reloj=!1,i.dinero=!1,i.fin=null}function hc(i){i.activo=!1,i.esperando=!1,i.reloj=!1}function k1(i,e){return!i.activo||!i.reloj||i.t<=0||(i.t=Math.max(0,i.t-e),i.t>0)?!1:(i.fin="tiempo",!0)}const H1=i=>gi[i.carro]??gi[0];function G1(i,e,t){const n=H1(i);return Math.hypot(e-n.x,t-n.z)}function sh(i,e,t){return i.activo&&i.fin!=="tiempo"&&i.balones>0&&!i.esperando&&G1(i,e,t)<=Mn.alcance}const fl=i=>i.activo&&i.fin==="tiempo";function V1(i){return i.activo?i.esperando&&i.fin!=="tiempo":!0}function rh(i){return i.esperando=!0,i.dinero=i.balones===1,i.dinero}function W1(i){i.activo&&(i.reloj=!0)}function oh(i,e){if(i.esperando=!1,i.tiros++,i.balones=Math.max(0,i.balones-1),i.racha=e?i.racha+1:0,!e)return 0;const t=i.dinero?Mn.puntosDinero:Mn.puntos;return i.puntos+=t,i.aciertos++,t}const X1=i=>i.balones===0,ah=i=>i.carro<gi.length-1;function $1(i,e,t){if(i.fin==="tiempo")return!1;const n=gi[i.carro+1];return!n||Math.hypot(e-n.x,t-n.z)>Mn.alcance?!1:(i.carro++,i.balones=Mn.balones,!0)}function q1(i){i.fin="carros",hc(i)}const Mi=.34,Gc=.34,lh=Mi+Gc,ch=.72,j1=()=>({activo:!1,t:0,x0:0,z0:0,x1:0,z1:0,side:1,golpeado:!1}),Y1=(i,e,t,n)=>e>=n&&i<=t;function K1(i,e,t,n){const r=kt(n)-e,o=-t,a=Math.hypot(r,o)||1,l=Math.max(0,a-TM);i.activo=!0,i.t=0,i.golpeado=!1,i.side=n,i.x0=e,i.z0=t,i.x1=e+r/a*l,i.z1=t+o/a*l}function Z1(i,e){if(!i.activo)return{golpe:!1,fin:!1};i.t=Math.min(lh,i.t+e);const t=!i.golpeado&&i.t>=Mi;t&&(i.golpeado=!0);const n=i.t>=lh;return n&&(i.activo=!1),{golpe:t,fin:n}}const pf=i=>{const e=Math.min(1,Math.max(0,i/Mi));return 1-(1-e)*(1-e)},J1=i=>i.x0+(i.x1-i.x0)*pf(i.t),Q1=i=>i.z0+(i.z1-i.z0)*pf(i.t);function eS(i){if(i.t<=Mi){const t=i.t/Mi;return ch*(1-(1-t)*(1-t))}const e=Math.min(1,(i.t-Mi)/Gc);return ch*(1-e)*(1-e)}function tS(i){if(i.t<=Mi)return Math.min(1,i.t/Mi*1.6);const e=Math.min(1,(i.t-Mi)/Gc);return 1-e*e}const Fi=28,pl=.45;class nS{object;pos=new Float32Array(Fi*3);col=new Float32Array(Fi*3);age=new Float32Array(Fi);posAttr;colAttr;head=0;escritos=0;intensidad=0;constructor(){const e=new hn;this.posAttr=new Ct(this.pos,3),this.colAttr=new Ct(this.col,3),this.posAttr.setUsage(Mu),this.colAttr.setUsage(Mu),e.setAttribute("position",this.posAttr),e.setAttribute("color",this.colAttr),e.setDrawRange(0,Fi);const t=new Ic({size:.34,sizeAttenuation:!0,vertexColors:!0,transparent:!0,blending:_l,depthWrite:!1,fog:!1});this.object=new Zh(e,t),this.object.visible=!1,this.object.castShadow=!1,this.object.receiveShadow=!1,this.object.frustumCulled=!1}setIntensity(e){this.intensidad=Math.max(0,Math.min(1,e)),this.intensidad>0&&(this.object.visible=!0)}get on(){return this.intensidad>0}update(e,t,n){const s=this.intensidad;if(s<=0){let l=0;for(let c=0;c<Fi;c++)this.age[c]<pl&&(this.age[c]+=e,this.col[c*3]=0,this.col[c*3+1]=0,this.col[c*3+2]=0,l++);this.colAttr.needsUpdate=!0,l===0&&(this.object.visible=!1);return}const r=1.2,o=Math.max(e,1/120),a=n>r?Math.max(1,Math.min(4,Math.ceil(o*60))):0;for(let l=0;l<a;l++){const c=a>1?l/a:0;this.head=(this.head+1)%Fi,this.escritos=Math.min(Fi,this.escritos+1);const u=this.head*3;this.pos[u]=t.x,this.pos[u+1]=t.y,this.pos[u+2]=t.z,this.age[this.head]=-c*.02,this.col[u]=s,this.col[u+1]=s*.82,this.col[u+2]=s*.34}for(let l=0;l<Fi;l++){if(this.age[l]>=pl){this.col[l*3]=0,this.col[l*3+1]=0,this.col[l*3+2]=0;continue}this.age[l]+=e;const c=1-this.age[l]/pl,u=c*c*s;this.col[l*3]=u,this.col[l*3+1]=u*.62,this.col[l*3+2]=u*.16}this.posAttr.needsUpdate=!0,this.colAttr.needsUpdate=!0}dispose(){this.object.geometry.dispose(),this.object.material.dispose()}}const uh={KeyW:[0,-1],ArrowUp:[0,-1],KeyS:[0,1],ArrowDown:[0,1],KeyA:[-1,0],ArrowLeft:[-1,0],KeyD:[1,0],ArrowRight:[1,0]};class iS{keys=new Set;interactFlag=!1;enabled=!0;joy={x:0,y:0};shootHeld=!1;constructor(){window.addEventListener("keydown",this.onDown),window.addEventListener("keyup",this.onUp),window.addEventListener("blur",this.reset)}dispose(){window.removeEventListener("keydown",this.onDown),window.removeEventListener("keyup",this.onUp),window.removeEventListener("blur",this.reset)}setEnabled(e){this.enabled=e,e||this.reset()}move(){if(!this.enabled)return{x:0,z:0};let e=this.joy.x,t=this.joy.y;for(const s of this.keys){const r=uh[s];r&&(e+=r[0],t+=r[1])}const n=Math.hypot(e,t);return n>1?{x:e/n,z:t/n}:{x:e,z:t}}pressInteract(){this.enabled&&(this.interactFlag=!0)}consumeInteract(){const e=this.interactFlag;return this.interactFlag=!1,e}reset=()=>{this.keys.clear(),this.joy={x:0,y:0},this.shootHeld=!1,this.interactFlag=!1};isTyping(e){const t=e.target;return!!t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)}onDown=e=>{if(!(!this.enabled||this.isTyping(e))){if(e.code==="Space"){e.preventDefault(),e.repeat||(this.shootHeld=!0);return}e.code==="KeyE"&&!e.repeat&&(this.interactFlag=!0),e.code in uh&&(e.preventDefault(),this.keys.add(e.code))}};onUp=e=>{e.code==="Space"&&(this.shootHeld=!1),this.keys.delete(e.code)}}const sS=()=>({y:0,vel:0});function rS(i,e=af){i.vel=e}function oS(i,e){return i.vel===0&&i.y===0?!0:(i.y+=i.vel*e-.5*ar*e*e,i.vel-=ar*e,i.y<=0?(i.y=0,i.vel=0,!0):!1)}function aS(i,e,t=[55,62,70,78]){const n=e.x-i.x,s=e.z-i.z,r=Math.hypot(n,s),o=e.y-i.y;if(r<.01)return null;for(const a of t){const l=a*Math.PI/180,c=2*Math.cos(l)**2*(r*Math.tan(l)-o);if(c<=0)continue;const u=Math.sqrt(ar*r*r/c),d=u*Math.cos(l),h=u*Math.sin(l),f=r/d;if(!(h-ar*f>=0))return{vx:d*n/r,vy:h,vz:d*s/r,t:f,angleDeg:a}}return null}function dh(i){const e=i*yM%2;return e<1?e:2-e}function hh(i){return Math.min(1,Math.max(0,(i-1.5)/(of-1.5)))}function Vc(i){return ta*(1-i*.5)}const lS=.3,cS=.38;function fh(i){return .5+Math.sin(i*2*Math.PI*cS)*lS}function uS(i,e=0,t=.5){const n=(i-t)*2,s=Vc(e);return{e:n,perfect:Math.abs(n)<=s,sweet:s}}function dS(i,e,t,n,s=0){const r=Vc(s),o=Math.max(0,Math.abs(e)-r)/(1-r),a=Math.sign(e)*o,l=1+s*1.1,c=1+a*.06*t*l,u=(n()-.5)*.03*o*t*l,d=Math.cos(u),h=Math.sin(u),f=i.vx*c,g=i.vz*c;return{x:f*d-g*h,y:i.vy*c,z:f*h+g*d}}const fi=(i,e,t)=>Math.min(t,Math.max(e,i)),mf=i=>Math.atan2(Math.sin(i),Math.cos(i)),ml=(i,e,t)=>i+mf(e-i)*t,as=()=>document.hidden?new Promise(i=>setTimeout(i,0)):new Promise(i=>requestAnimationFrame(()=>i()));function ph(i){try{const e=JSON.parse(localStorage.getItem(i)??"[]");return new Set((Array.isArray(e)?e:[]).filter(t=>fs.includes(t)))}catch{return new Set}}function mh(i,e){try{localStorage.setItem(i,JSON.stringify([...e]))}catch{}}function hS(){try{const i=JSON.parse(localStorage.getItem("court.stats")??"{}");return{made:typeof i.made=="number"&&i.made>=0?i.made:0,attempted:typeof i.attempted=="number"&&i.attempted>=0?i.attempted:0}}catch{return{made:0,attempted:0}}}function gh(i){try{localStorage.setItem("court.stats",JSON.stringify(i))}catch{}}function fS(){try{const i=Number(localStorage.getItem("court.contest")??0);return Number.isFinite(i)&&i>0?Math.floor(i):0}catch{return 0}}function pS(i){try{localStorage.setItem("court.contest",String(i))}catch{}}async function gS(i){const{canvas:e,onProgress:t}=i,n=matchMedia("(prefers-reduced-motion: reduce)").matches,s=matchMedia("(pointer: coarse)").matches,r=new URLSearchParams(location.search),o=r.has("perf"),a=.7;function l(){const L=u.getContext(),k=L.getExtension("WEBGL_debug_renderer_info"),le=Ue=>{if(Ue===void 0)return"";try{const ke=L.getParameter(Ue);return ke==null?"":String(ke)}catch{return""}},Se=Ue=>Ue.length>0&&!/^\d+$/.test(Ue)&&!/^0x[0-9a-f]+$/i.test(Ue)&&Ue!=="null"&&Ue!=="undefined",be=[le(k?.UNMASKED_RENDERER_WEBGL),le(L.RENDERER)],Le=[le(k?.UNMASKED_VENDOR_WEBGL),le(L.VENDOR)];return{renderer:be.find(Se)??"",vendor:Le.find(Se)??"",rendererCrudos:be,vendorCrudos:Le}}const c={sky:1055276,horizon:1976900};t(.05),await Promise.all([document.fonts.load('48px "Bebas Neue"'),document.fonts.load('700 16px "Silkscreen"'),document.fonts.load('400 16px "Silkscreen"')]).catch(()=>{});const u=new sv({canvas:e,antialias:!0,powerPreference:"high-performance"}),d=l();let f=Math.min(window.devicePixelRatio,s?1.5:2),g=`devicePixelRatio con tope ${s?1.5:2}`;const _=r.has("escala");if(_){const L=Number(r.get("escala"));Number.isFinite(L)&&L>0?(f=fi(L,.5,3),g=`forzada por ?escala=${r.get("escala")}`):console.warn(`[gpu] ?escala=${r.get("escala")} no es un número mayor que 0; se ignora`)}console.info(`[gpu] ${d.renderer||"(el navegador no ha dado el nombre de la GPU)"} · escala de partida ${f} (${g}) · la definitiva la mide la precarga (elegirEscalaInicial)`),u.setPixelRatio(f),u.shadowMap.enabled=!0,u.shadowMap.type=xh,u.shadowMap.autoUpdate=!1,u.toneMapping=vh,u.toneMappingExposure=1.05;const m=new rv;m.background=new Ne(c.sky),m.fog=new Rc(c.horizon,38,96);const p=new sn(cn.fov,1,.1,120),S=new rc(16773852,.8);S.position.set(10,34,12),S.castShadow=!0,S.shadow.mapSize.set(s?1024:2048,s?1024:2048),Object.assign(S.shadow.camera,{left:-30,right:30,top:26,bottom:-26,near:5,far:110}),S.shadow.camera.updateProjectionMatrix(),S.shadow.bias=-2e-4,S.shadow.normalBias=.05,m.add(S);const v=new rc(12571903,.4);v.position.set(10,5,18),m.add(v);const x=new Rv(16774358,3819112,.22);m.add(x);const R=[];for(const L of $M.filter(k=>k.z>0)){const k=new nf(16769976,12,30,.85,.7,1.2);k.position.set(L.x,L.y,L.z),k.target.position.set(L.x,0,L.z),k.castShadow=!1,m.add(k,k.target),R.push(k)}const A=R.length+3;console.info(`[lights] PABELLON-v3 -> ${A} luces: techo=${S.intensity} (sombras ${S.castShadow}) focos=${R.length}x${R[0]?.intensity} ang=${R[0]?.angle} (fila z>0) relleno=${v.intensity} hemisferica=${x.intensity} · suelo≈1,53 (antes 2,09): techo 0,723 + focos 0,500 + relleno 0,088 + hemi 0,220 · ACES+1,05: parquet ~230/255, centro-charco ~233, anillo-oscuro ~202 (31 niveles) · rebote-direccional=ELIMINADO (charcos pintados + hemisférica) torres-direccionales=ELIMINADAS sol=ELIMINADO`),t(.2),await as(),t(.3);const w=await w1("models/ball.glb");console.info(`[court] glTF cargado: balon=${!!w}`),w&&R1(w.scene,{targetSize:tn.radius*tn.visualScale*2}),t(.45),await as();const C=py(yn.person.initials,u.capabilities.getMaxAnisotropy());m.add(C);const b=C.userData.crowdTime;m.add(my(yn.person.initials,u.capabilities.getMaxAnisotropy()));const y=jd(-1),I=jd(1),Y=Vy(),V=Wy(),q=Gy(),z=oy(u.capabilities.getMaxAnisotropy()),U=Yd();U.group.position.set(Zn.x,0,Zn.z),U.group.rotation.y=Math.atan2(Zn.x-kt(ca),Zn.z);const $=gi.slice(1).map(L=>{const k=Yd();k.group.position.set(L.x,0,L.z),k.group.rotation.y=Math.atan2(L.x-kt(ca),L.z),k.group.visible=!1;for(const le of k.balls)le.visible=!1;return vi(k.group),k}),G=[U,...$];m.add(y,I,Y,V,q,z,U.group,...$.map(L=>L.group));const te=P1();m.add(te.group);const re=IM(),he=[];for(const L of[...Gs,{x:Zn.x,z:Zn.z,radius:Mn.alcance}]){const k=Zd(L.x,L.z,L.radius);he.push(k),m.add(k)}const ve=[];for(const L of gi.slice(1)){const k=Zd(L.x,L.z,Mn.alcance);k.visible=!1,ve.push(k),he.push(k),m.add(k)}t(.55),await as();const Me=lc({skin:15774330,skinAlt:14062679,hair:5519135,hairAlt:3876117,jersey:16747578,jerseyAlt:14248484,shorts:3489899,shoes:16645622,accent:16766282,number:yn.person.jerseyNumber,anisotropy:u.capabilities.getMaxAnisotropy()});vi(Me.root),m.add(Me.root);const O=Me.root.position;let Z=0;const ae=new RM,ue=Xy(w?.scene??null);{let L=0,k=0;ue.traverse(le=>{const Se=le;if(!Se.isMesh)return;L++;const be=Se.geometry;k+=be.index?be.index.count/3:be.getAttribute("position").count/3}),console.info(`[ball] ${L} mallas, ${k|0} triángulos, glTF=${w?"sí":"NO"}`)}vi(ue),m.add(ue);const ie=new BM(ue,{score:L=>{vt(),ga(L)},rim:()=>{Fe(.45),ae.rim()},board:()=>{Fe(.3),ae.board()},bounce:L=>ae.bounce(L)},re),Pe=new nS;m.add(Pe.object);const He=new P;let at=0;const Ze=lr(64,64,L=>{const k=L.createRadialGradient(32,32,1,32,32,31);k.addColorStop(0,"rgba(0,0,0,0.75)"),k.addColorStop(.55,"rgba(0,0,0,0.3)"),k.addColorStop(1,"rgba(0,0,0,0)"),L.fillStyle=k,L.fillRect(0,0,64,64)}),ht=L=>{const k=new bt(new Wn(L,L),new un({map:Ze,transparent:!0,depthWrite:!1}));return k.rotation.x=-Math.PI/2,k.position.y=.022,k.renderOrder=1,k},B=ht(1.2),Vt=ht(.34),Qe=gi.slice(1).map(L=>{const k=ht(1.3);return k.position.set(L.x,.022,L.z),k.visible=!1,k});m.add(B,Vt,...Qe);let qe=0,Be=2.2;const vt=()=>{qe=1,Be=2.2,Xs.amp.value=1},Fe=L=>{L<=qe||(qe=L,Be=5.5,Xs.amp.value=L)},T=document.getElementById("ui");let M="play";const H=ph("court.visited"),Q=ph("court.unlocked"),J=hS();Fc.get=()=>({...J,visited:H.size,total:fs.length,contestBest:Kt});const K=new iS,se=new wM(T,{onMenuSelect:L=>gr(L,!1),onToggleMute:()=>ae.toggleMute()},ae.muted,s),me=new fM(T,()=>{xs++,Je=null,oe("play")}),Ee=new vM(T,()=>{oe("panel"),me.open("contact")});s&&se.mountTouch(K),e.setAttribute("aria-label",ne("aria_game")),window.addEventListener("langchange",()=>e.setAttribute("aria-label",ne("aria_game"))),se.setProgress(H.size),se.setRecord(J.made,J.attempted),z.setScore(J.made,J.attempted),bi();for(const L of Gs)se.addLabel(L.id,eM(L.id));let Je=null;function oe(L){M=L,document.body.dataset.mode=L,K.setEnabled(L==="play"),L==="play"&&e.focus({preventScroll:!0}),L!=="interview"&&Ee.close()}const Ae=.45;let Ie=!1,Oe=0;const ye=sS();let je=1,$e=0,ct="tiro",D=1,fe=0,j=0,ee=0,xe=0,pe=!1,Ve=!1;const et=j1();let Rt=0;const de=B1();let Kt=fS();const Ln=F1();function Xn(L){const k=O1(Ln,L,performance.now());k&&se.subtitle(k.texto,k.ms)}const eo=.28;let on=1,gs=0;function _s(){de.activo&&(oh(de,!1),Xn({tipo:"fallo"}),se.setContest(ge())),vr=1,ee++,pe&&(pe=!1,se.toast(ne("takeover_miss"),2e3)),xe=0,se.setTakeover(0,!1)}function qi(){return Math.abs(O.x-kt(-1))<=Math.abs(O.x-kt(1))?-1:1}const ji=L=>Gs.find(k=>k.side===L);function to(L){H.add(L),mh("court.visited",H),se.setProgress(H.size),bi()}function bi(){se.setMenuState(H,Gs.filter(L=>L.kind==="shoot"&&!Q.has(L.id)).map(L=>L.id))}function no(){return n?0:-Math.log(.03)/cn.lerp}let xs=0;function gr(L,k){to(L),ae.click();const le=++xs;Je=k?L:null,oe(L==="contact"&&k?"interview":"panel"),M==="interview"?(O.set(Ws.playerSpot[0],0,Ws.playerSpot[1]),Z=0,Me.root.rotation.y=Z,Ee.start()):k?(Z=Vo[L].face,Me.root.rotation.y=Z,window.setTimeout(()=>{le!==xs||M==="play"||me.open(L)},no()*1e3)):me.open(L),!Ve&&H.size===fs.length&&(Ve=!0,window.setTimeout(()=>se.toast(ne("mvp"),4500),600))}function ga(L){ae.swish(),$c(Ei,Zt);const k=fl(de);if(de.activo){const Le=oh(de,!0);Xn({tipo:"canasta",suma:Le,puntos:de.puntos,dinero:de.dinero,racha:de.racha}),se.setContest(ge())}const le=C.userData.crowdFx;le&&(le.jump.value=1,le.wave.value=0),ee=0;let Se=!1;xe+=1,!pe&&xe>=na&&(pe=!0,ae.cheer(),Se=!0,z.flash(ne("takeover_tag"),1600)),se.setTakeover(xe,pe),J.made++,gh(J),se.setRecord(J.made,J.attempted),z.setScore(J.made,J.attempted);const be=ji(L);!be||be.kind!=="shoot"||Q.has(be.id)?se.toast(ne("shot_basket")):(Q.add(be.id),mh("court.unlocked",Q),bi(),ae.cheer(),se.toast(`${ne("unlocked")}: ${ne(la(be.id))}`,3e3),window.setTimeout(()=>M==="play"&&gr(be.id,!1),1300)),Se&&se.toast(ne("takeover_on"),3e3),k&&se.toast(ne("contest_buzzer_beater"),3200)}function io(){J.attempted++,gh(J),se.setRecord(J.made,J.attempted),z.setScore(J.made,J.attempted)}function E(L){io(),W1(de);const k=qi(),le=new P(kt(k),Nt.y,0),Se=new P(O.x+Math.sin(Z)*.2,2.15,O.z+Math.cos(Z)*.2),be=aS(Se,le)??{vx:0,vy:6,vz:0},Le=Math.hypot(O.x-le.x,O.z-le.z),Ue=hh(Le),{e:ke,perfect:yt,sweet:ln}=uS(L,Ue,fh(Oe)),Yn=ee>=3?.4:.85,Dn=dS(be,ke,Yn,Math.random,Ue);console.info(`[shot] distancia=${Le.toFixed(2)} m  dificultad=${Ue.toFixed(2)}  zonaVerde=${(ln*100).toFixed(0)} %  e=${ke.toFixed(2)}  asistencia=${Yn}  ${yt?"PERFECTO":"fuera de zona"}`),ie.launch(Se,new P(Dn.x,Dn.y,Dn.z)),ae.release(),j=jc,rS(ye),yt&&(se.toast(ne("shot_perfect"),1200),z.flash(ne("shot_perfect"),1200))}function F(){ie.launch(new P(kt(et.side),Nt.y+.16,0),new P(0,-3.6,0)),$c($n,qn),Fe(1),ae.release()}const X=new P,W=new P,N=new P;function ce(L,k){const le=X.set(Math.sin(Z),0,Math.cos(Z)),Se={x:Math.cos(Z),z:-Math.sin(Z)};let be=O.x,Le,Ue=O.z;if(Ie)be+=le.x*.5,Le=.86,Ue+=le.z*.5;else if(k>.02){const yt=.16+k*.6;Le=.14+df(L,je)*yt,be+=le.x*.45+Se.x*.3*je,Ue+=le.z*.45+Se.z*.3*je}else Le=.78,be+=le.x*.52,Ue+=le.z*.52;W.set(be,Le,Ue);const ke=Wd(jn);ke<1?ie.pos.lerpVectors(N,W,ke):ie.pos.copy(W),ie.object.position.copy(ie.pos)}function ge(){if(!de.activo)return null;const L=fl(de)?ne("contest_hint_buzzer"):de.esperando?de.dinero?ne("contest_hint_money"):null:de.balones>0?null:ah(de)?ne("contest_hint_next"):null;return{t:de.t,puntos:de.puntos,carro:de.carro,total:gi.length,balones:de.balones,aviso:L}}function we(L){ie.state==="held"&&!L||(ie.state="held",L&&ie.pos.copy(L),N.copy(ie.pos),jn=0)}const Re=new P;function Ge(L){const k=G[L];if(!k)return Re.set(O.x,.86,O.z);for(let le=k.balls.length-1;le>=0;le--){const Se=k.balls[le];if(Se.visible)return Se.getWorldPosition(Re)}return k.group.getWorldPosition(Re).setY(.78)}function We(){const L=ie.state==="held";rh(de)&&Xn({tipo:"dinero"}),we(L?Ge(de.carro):void 0)}function Ce(L){on=L?0:1;for(const k of $)k.group.visible=L,k.group.scale.y=1;for(const k of ve)k.visible=L;for(const k of Qe)k.visible=L;ft()}function st(L){return de.activo?L<de.carro?0:L>de.carro?Mn.balones:Math.max(0,de.balones-(de.esperando?1:0)):L===0?Mn.balones:0}function ft(){G.forEach((L,k)=>{const le=st(k);for(let Se=0;Se<L.balls.length;Se++){const be=Se<le;L.balls[Se].visible!==be&&(L.balls[Se].visible=be)}})}function Mt(){z1(de),Ce(!0),sh(de,O.x,O.z)&&We(),ae.click(),se.toast(ne("contest_on"),3e3),Xn({tipo:"arranque"}),se.setContest(ge())}function Wt(L){const{puntos:k,aciertos:le,tiros:Se}=de;L==="carros"?q1(de):hc(de),Ce(!1);const be=k>Kt;be&&(Kt=k,pS(k)),ae.cheer(),se.setContest(null),se.toast(`${L==="tiempo"?ne("contest_end_time"):ne("contest_end")} · ${k} · ${le}/${Se}`+(be?` · ${ne("contest_best")}`:""),4200),Xn({tipo:"final",puntos:k,aciertos:le,tiros:Se,record:be}),we()}function lt(){hc(de),se.setContest(null),se.hideSubtitle(),Ce(!1),we()}const De=new P;function Pn(){ie.pos.copy(_y(Me,1,De)),ie.object.position.copy(ie.pos)}const ot=new P,an=new ei;function si(L){const k=ie.vel.x,le=ie.vel.z,Se=Math.hypot(k,le);if(Se<.05)return;ot.set(le,0,-k).normalize();const be=ie.pos.y<=tn.radius+.02,Le=Se/(tn.radius*tn.visualScale)*(be?1:.55);an.setFromAxisAngle(ot,Le*L),ue.quaternion.premultiply(an)}const Et=new P,bn=new P,dt=new P;let fn=1;const Ei=.15,Zt=.022,$n=.3,qn=.055;let vs=0,_a=0,xa=0,va=0,ri=1,_r=0,Wc=Ei,Xc=Zt;function $c(L,k){_r=L,Wc=L,Xc=k}let Ms=0,xr=0,qc=!0,ys=0,vr=0,jn=Vi,Ma=1,Ss=0,so=0;const jc=.35,ya=1.6,gf=8,Yc=.02,_f=.2,xf=L=>fi((L-Yc)/(_f-Yc),0,1);function Mr(L,k=!1){if(M==="attract"){const Le=n?-.6:Ms*.115+-.6,Ue=21;Et.set(Math.sin(Le)*Ue,9.5,Math.cos(Le)*Ue),bn.set(0,1.6,0),ri+=(1-ri)*(1-Math.exp(-6*Math.max(L,0)));const ke=k?1:1-Math.exp(-4*L);p.position.lerp(Et,ke),dt.lerp(bn,ke),p.lookAt(dt);return}let le=cn.fov;const Se=M==="interview"?null:Je?Vo[Je]:null;if(M==="interview")Et.set(...Ws.pov.pos),bn.set(...Ws.pov.look),le=cn.tvFov,ri+=(1-ri)*(1-Math.exp(-6*Math.max(L,0)));else if(Se)Et.set(...Se.pos),bn.set(...Se.look),ri+=(1-ri)*(1-Math.exp(-6*Math.max(L,0)));else{const Le=fi(O.x,-11,cn.clampX),Ue=fi(O.z,cn.minZ,cn.maxZ),ke=vs*cn.advance,yt=_a*cn.advance;bn.set(Le+ke*.8,.8,Ue+yt*.8);const ln=fn*ri;if(Et.set(Le+cn.offset[0]*ln+ke,cn.offset[1]*ln,Ue+cn.offset[2]*ln+yt),M==="panel"&&!n){const Yn=Math.sin(Ms*.18)*.16,Dn=Et.x-Le,Ar=Et.z-Ue;Et.x=Le+Dn*Math.cos(Yn)-Ar*Math.sin(Yn),Et.z=Ue+Dn*Math.sin(Yn)+Ar*Math.cos(Yn)}ri+=((Ie?cn.chargeZoom:1)-ri)*(1-Math.exp(-6*Math.max(L,0)))}const be=k||n?1:1-Math.exp(-4*L);if(p.position.lerp(Et,be),dt.lerp(bn,be),p.fov!==le&&(p.fov=le,p.updateProjectionMatrix()),_r>0&&!n){_r=Math.max(0,_r-L);const Le=Xc*(_r/Wc);p.position.x+=Math.sin(Ms*61)*Le,p.position.y+=Math.sin(Ms*47+1.7)*Le,p.position.z+=Math.sin(Ms*53+3.1)*Le}p.lookAt(dt)}function bs(){const L=window.innerWidth,k=window.innerHeight;u.setPixelRatio(f),u.setSize(L,k,!1),p.aspect=L/k,fn=fi(1+(1.5/p.aspect-1)*cn.portraitGrow,1,2.4),p.updateProjectionMatrix()}window.addEventListener("resize",bs),bs(),t(.85);const Sa=new P,ro=new P,Ti=new P,Kc=new P,Es=new P,Yi=new Uv,Jt=u.getContext();let oo=0,ao=!1;function ba(){ao||(ao=!0,oo=requestAnimationFrame(nu))}const Ki=f,Ea=3,Zc=20,Jc=2,vf=15;let Zi=Ki,lo=0,Ts=0,yr=0,Qc=!1,co=!1,In=[],Sr=0,Ta=-1,Aa=0,br=0;const Er=new Uint8Array(4),Mf=2e3,eu=20;let tu=0;function yf(L){const k=[...L].sort((le,Se)=>le-Se);return k[k.length>>1]}function Sf(L,k){if(L.length===0)return 0;const le=[...L].sort((Se,be)=>Se-be);return le[Math.min(le.length-1,Math.max(0,Math.round((le.length-1)*k)))]}let bf=0;function Ef(L,k){if(++bf<45||(In.push(L),In.length<30))return!1;const le=yf(In);Sr=le;const Se=In.slice(-20);if(In=Se,le>19){if(br=0,yr=0,Ts++,k>15&&f>a+.001){if(Ts===1&&console.info(`[calidad] fotograma ${le.toFixed(1)} ms con coste ${k.toFixed(1)} ms a escala ${f}: decisión 1/${Ea} por encima del umbral`),Ts<Ea)return!1;const Le=Ts;Ts=0;const Ue=f;return Zi=Ue,lo=0,f=Math.max(a,+(Ue-.1).toFixed(2)),In=[],co=!0,console.info(`[calidad] BAJA · ${Le}/${Ea} decisiones seguidas · fotograma ${le.toFixed(1)} ms con coste ${k.toFixed(1)} ms a escala ${Ue} -> escala ${f}`),!0}return k>15&&f<=a+.001&&!Qc&&(Qc=!0,console.warn(`[calidad] escalado mínimo: la GPU no da 60 fps ni a ${a} (fotograma ${le.toFixed(1)} ms, coste ${k.toFixed(1)} ms). El juego sigue ahí; bajar más sólo emborronaría la escena a cambio de nada.`)),!1}if(Ts=0,le>17.5)return br=0,yr=0,!1;yr+=Se.reduce((Le,Ue)=>Le+Ue,0)/1e3;const be=Math.min(Ki,Zi);if(f<be-.001){if(++br<vf)return!1;br=0;const Le=f;return f=Math.min(be,Ki,+(f+.1).toFixed(2)),In=[],co=!0,console.info(`[calidad] SUBIDA · fotograma ${le.toFixed(1)} ms con coste ${k.toFixed(1)} ms a escala ${Le} -> escala ${f}`),!0}return br=0,Zi<Ki-.001&&yr>=Zc&&lo<Jc&&(lo++,yr=0,Zi=Math.min(Ki,+(Zi+.1).toFixed(2)),console.info(`[calidad] techo reintentado: ${Zc} s estables a escala ${f} -> se permite hasta ${Math.min(Ki,Zi)} (reintento ${lo}/${Jc})`)),!1}let Tr=0;function Tf(L,k,le=k){Ms=k;const Se=M==="play";let be=0;if(xa=0,va=0,et.activo){const rt=Z1(et,L);O.x=J1(et),O.z=Q1(et),Z=ml(Z,Math.atan2(kt(et.side)-O.x,-O.z),1-Math.exp(-18*L)),be=rt.golpe?.25:1,rt.golpe&&F()}if(Se&&!et.activo)if(K.shootHeld&&ie.state==="held"&&V1(de)&&!Ie&&(Ie=!0,Oe=0),Ie){Oe+=L;const It=qi();Z=ml(Z,Math.atan2(kt(It)-O.x,-O.z),1-Math.exp(-14*L));const Xt=Math.hypot(O.x-kt(It),O.z),Kn=fh(Oe);se.showMeter(dh(Oe),Vc(hh(Xt)),Math.min(Oe/Ae,1),Kn),K.shootHeld||(ct=Xt<=Od?"dunk":Xt>=bM?"lejano":"tiro",ct==="dunk"&&Y1(Xt,gs,Od,EM)?(io(),K1(et,O.x,O.z,qi()),ae.release()):E(dh(Oe)),Ie=!1,se.showMeter(null))}else{const It=K.move(),Xt=Math.hypot(It.x,It.z);if(gs=Xt>.05?Math.min(1,Xt):0,Xt>.05){const Kn=Math.min(1,Xt),Ji=It.x/Xt,Qi=It.z/Xt;O.x=fi(O.x+Ji*Hs.speed*Kn*L,Hs.bounds.minX,Hs.bounds.maxX),O.z=fi(O.z+Qi*Hs.speed*Kn*L,Hs.bounds.minZ,Hs.bounds.maxZ),UM(O,LM,re),Z=ml(Z,Math.atan2(Ji,Qi),1-Math.exp(-14*L)),be=Kn,xa=Ji*Kn,va=Qi*Kn;const fo=Math.atan2(Ji,Qi),Ai=mf(fo-$e);Math.abs(Ai)>SM&&(je=je===1?-1:1,$e=fo,Ai!==0&&(D=Ai>0?1:-1),ys=je)}}else Ie&&(Ie=!1,se.showMeter(null));Me.root.rotation.y=Z,Tr+=(be-Tr)*(1-Math.exp(-12*L));const Le=1-Math.exp(-5*L);vs+=(xa-vs)*Le,_a+=(va-_a)*Le;const Ue=ye.vel;let ke;et.activo?(ye.y=eS(et),ye.vel=0,ke=ye.y<=.001):ke=oS(ye,L),O.y=ye.y,ke&&!qc&&(xr=fi(-Ue/af,.25,1.3)),qc=ke,ys!==0&&(ys-=ys*Math.min(1,L*3.4)),vr>0&&(vr=Math.max(0,vr-L*1.1)),j>0&&(j=Math.max(0,j-L)),fe>0&&(fe=Math.max(0,fe-L)),jn<Vi&&(jn=Math.min(Vi,jn+L));const yt=Ie?Math.min(Oe/Ae,1):j/jc;if(Ss=$o(Ss,yt,L),Rt=$o(Rt,et.activo?tS(et):0,L),so=$o(so,fe>0?fe/ya:0,L),Ma=jn<Vi?Wd(jn):$o(Ma,ie.state==="held"?1:0,L,gf),Hc(Me,le,Tr,ie.state==="held",ke,xr,{handSide:je,regate:xf(Tr),giro:ys,frustracion:vr,hold:Ma,recoge:Ey(jn),corte:Math.abs(ys),corteDir:D}),Ss>.002&&(ct==="dunk"?Xd(Me,Ss):ct==="lejano"?Ay(Me,Ss):Ty(Me,Ss)),Rt>.002&&Xd(Me,Rt),so>.002&&wy(Me,le,so),xr>0&&(xr=Math.max(0,xr-L*4.5)),ie.state==="held")et.activo?Pn():ce(le,Tr);else if(de.activo){ie.step(L),si(L);const rt=ie.pos.y<=tn.radius+.04&&ie.vel.y<=.01;(ie.scored?ie.pos.y<1.2:rt||ie.settled)&&(ie.scored?fe=ya:_s(),we(),de.activo&&de.balones>0&&rh(de),se.setPrompt(null))}else ie.step(L),si(L),Math.hypot(O.x-ie.pos.x,O.z-ie.pos.z)<.62&&ie.pos.y<1.5?(ie.state="held",ie.scored||_s(),ie.state="held",N.copy(ie.pos),jn=0,se.setPrompt(null)):ie.settled&&(ie.scored?fe=ya:_s(),ie.state="held",N.copy(ie.pos),jn=0);if(at=He.distanceTo(ie.pos)/Math.max(L,1e-4),He.copy(ie.pos),Pe.setIntensity(pe&&!n?1:0),Pe.update(L,ie.pos,at),de.activo&&(fl(de)&&ie.state!=="flying"&&Wt("tiempo"),Se&&de.activo&&(sh(de,O.x,O.z)&&We(),X1(de)&&!de.esperando&&(ah(de)?$1(de,O.x,O.z)&&Xn({tipo:"carro",carro:de.carro+1,total:gi.length}):Wt("carros")),de.activo&&k1(de,L)&&Xn({tipo:"bocina"})),se.setContest(ge()),de.activo&&ft()),de.activo&&on<1){on=Math.min(1,on+(n?1:L/eo));const rt=1-(1-on)*(1-on);for(const It of $)It.group.scale.y=Math.max(.02,rt)}const ln=Math.min(1,Math.max(0,O.y)/.6);B.position.set(O.x,.022,O.z),B.scale.setScalar(1-ln*.28),B.material.opacity=.9-ln*.4;const Yn=Math.min(1,Math.max(0,ie.pos.y-.12)/3.4);Vt.position.set(ie.pos.x,.022,ie.pos.z),Vt.scale.setScalar(1+Yn*1.5),Vt.material.opacity=.85*(1-Yn*.8),b&&(b.value=k);const Dn=Se&&!et.activo,Ar=Dn&&Math.hypot(O.x-Zn.x,O.z-Zn.z)<=1.8;Ar&&K.consumeInteract()&&(de.activo?lt():Mt());let ho=null,lu=1/0;for(const rt of Gs){const It=Math.hypot(O.x-rt.x,O.z-rt.z),Xt=rt.kind!=="shoot"||Q.has(rt.id);Dn&&Xt&&It<=rt.radius&&It<lu&&(lu=It,ho=rt)}if(Dn&&ho)se.setPrompt(`${s?ne("hint_interact_touch"):ne("hint_interact")} · ${ne(la(ho.id))}`),K.consumeInteract()&&gr(ho.id,!0);else{K.consumeInteract();const rt=qi(),It=ji(rt),Xt=Math.abs(O.x-kt(rt))<=of&&!!It&&!Q.has(It.id);se.setPrompt(Dn&&Xt&&ie.state==="held"&&!Ie?s?ne("hint_shoot_touch"):ne("hint_shoot"):null)}Ar&&se.setPrompt(de.activo?ne("contest_quit"):ne("contest_start")),Xs.time.value=k,qe>0&&(qe=Math.max(0,qe-L*Be),Xs.amp.value=qe);const wr=C.userData.crowdFx;wr&&wr.jump.value>0&&(wr.jump.value=Math.max(0,wr.jump.value-L*.75),wr.wave.value+=L*22);for(const rt of he)rt.scale.setScalar(1+Math.sin(k*3)*.04);I1(te.reporter,k,M==="interview"?1:0),D1(te.operator,k),te.reporter.armR.rotation.x=M==="interview"?-1.45:-1.15,te.tally.visible=M==="interview"||Math.floor(k*1.5)%2===0,se.setBroadcast(M==="interview",le),M==="interview"&&Ee.tick(le*1e3,n),te.onAir.material.emissiveIntensity=M==="interview"?1.6:.2,Mr(L);const cu=window.innerWidth,uu=window.innerHeight;p.getWorldDirection(ro),Ti.set(ro.x,0,ro.z),Ti.lengthSq()<1e-8&&Ti.set(0,0,-1),Ti.normalize();for(const rt of Gs){const It=rt.kind==="shoot"?4.6:2.5;Es.set(rt.x-O.x,0,rt.z-O.z);const Xt=Es.length(),Kn=Math.hypot(Es.x,Es.z)||1,Ji=Es.x/Kn,Qi=Es.z/Kn,fo=Math.atan2(Ti.x*Qi-Ti.z*Ji,Ti.x*Ji+Ti.z*Qi);Sa.set(rt.x,It,rt.z).project(p);let Ai=Sa.x,Rr=Sa.y;Kc.set(rt.x-p.position.x,It-p.position.y,rt.z-p.position.z);const du=Kc.dot(ro)>0;du||(Ai=-Ai,Rr=-Rr);const zf=du&&Math.abs(Ai)<=1&&Math.abs(Rr)<=1;se.placeLabel(rt.id,(Ai*.5+.5)*cu,(-Rr*.5+.5)*uu,zf,fo,Xt),se.setLabelLocked(rt.id,rt.kind==="shoot"&&!Q.has(rt.id)),M==="interview"&&se.hideLabel(rt.id,!0)}se.layoutLabels(cu,uu)}function Af(){u.shadowMap.needsUpdate=!0,u.render(m,p)}function nu(){oo=requestAnimationFrame(nu);const L=Math.min(Yi.getDelta(),1/20);Tf(L,n?0:Yi.elapsedTime,Yi.elapsedTime),Aa++;const k=co||Sr>19&&(Aa>=120||Ta<0);k&&Jt.readPixels(0,0,1,1,Jt.RGBA,Jt.UNSIGNED_BYTE,Er);const le=k?performance.now():0;if(u.render(m,p),k){Jt.readPixels(0,0,1,1,Jt.RGBA,Jt.UNSIGNED_BYTE,Er);const Se=performance.now()-le,be=f;Ta=Se,Aa=0,co=!1,console.info(`[coste] ${Se.toFixed(1)} ms con la cola drenada antes del reloj, a escala ${be} · `+(Se>15?"supera el presupuesto de fotograma: la culpa es de la GPU":"cabe en el presupuesto de fotograma; si el fotograma no llega, el que falla es el sistema"))}if(Ef(L*1e3,Ta)&&bs(),o){const Se=performance.now();if(Se-tu>=Mf){tu=Se;const be=u.info.render,Le=u.info.programs?.length??0;Sr>0&&In.length>=eu?console.info(`[perf] mediana ${Sr.toFixed(2)} ms · p95 ${Sf(In,.95).toFixed(2)} ms · n=${In.length} fotogramas · escala ${f} · programas ${Le} · draws ${be.calls} (sin pase de sombras) · triángulos ${be.triangles}`):console.info(`[perf] midiendo… aún sin mediana ni p95: ${In.length}/${eu} intervalos (mediana en ${Sr.toFixed(1)} ms: sin calcular) · escala ${f} · programas ${Le} · draws ${be.calls} (sin pase de sombras) · triángulos ${be.triangles}`)}}}const iu=()=>{document.hidden?(cancelAnimationFrame(oo),ao=!1):(Yi.getDelta(),ba())};document.addEventListener("visibilitychange",iu),Number(r.get("cell"));const wf=12;function Rf(L=wf){const k=Ry(m,[C,y,I,Y,V,q,te.group,z,U.group],{material:ua,cell:L,exclude:[Me.root,ue,te.reporter.root,te.operator.root,...U.balls,...$.map(le=>le.group)]});k.merged!==0&&console.info(`[batch] fundidas ${k.merged} mallas -> ${k.batches} lotes (${L} m) · ${k.triangles|0} triángulos (antes ${k.before|0}, descartadas ${k.skipped}) · ${(k.bytes/1048576).toFixed(1)} MB`)}Rf();let Cf=ua;{const L=l(),k=L.renderer,le=L.vendor,Se=Cf.type==="MeshLambertMaterial"?"Lambert":"Standard",be=(Le,Ue)=>{const ke=Ue.filter(Boolean);return`${Le} ENMASCARADO por el navegador (devuelve ${ke.length?ke.join(" / "):"nada"})`};if(console.info(`[gpu] ${k||be("renderer",L.rendererCrudos)} · ${le?`vendor=${le}`:be("vendor",L.vendorCrudos)} · dpr=${window.devicePixelRatio} (escala ${f}, arranque: ${g}) · lienzo ${e.width}x${e.height} · anisotropía ${u.capabilities.getMaxAnisotropy()} · voxel=${Se} · siguiente paso: chrome://gpu`),!k||!le){console.warn('[gpu] el navegador no ha revelado el nombre de la GPU. Los valores de arriba son enums o literales, no una tarjeta: no los leas como nombre. Siguiente paso: chrome://gpu (pestaña "Graphics Feature Status" y "Driver Information"), donde sale el renderer real y por qué está enmascarado.');const Le=navigator.gpu;if(!Le)console.warn("[gpu] este navegador no tiene navigator.gpu (sin WebGPU): la vía alternativa no existe");else{const Ue=Le;(async()=>{try{const ke=await Ue.requestAdapter();if(!ke){console.warn("[gpu] navigator.gpu no ha devuelto adaptador (puede estar bloqueado)");return}const yt=ke.info??(ke.requestAdapterInfo?await ke.requestAdapterInfo():null),ln=yt?[yt.vendor,yt.architecture,yt.description].filter(Boolean):[];console.info(`[gpu] navigator.gpu → ${ln.join(" ")||"adaptador sin datos"}`)}catch(ke){console.warn("[gpu] navigator.gpu no ha podido consultarse",ke)}})()}}}const su=.86,wa=.95,ru=1200,Lf=900,uo=[{nombre:"juego",pos:null,look:null},...fs.map(L=>({nombre:L,pos:Vo[L].pos,look:Vo[L].look}))],Pf=!1,If=!r.has("noprewarm"),ou=typeof u.compileAsync=="function";async function Df(){if(!ou)return u.compile(m,p),"ok";let L=0;const k=new Promise(le=>{L=window.setTimeout(()=>le("techo"),ru)});try{const le=u.compileAsync(m,p);return await Promise.race([le.then(()=>"ok",be=>(console.warn("[preload] compileAsync falló en esta vista; se sigue",be),"ok")),k])}finally{window.clearTimeout(L)}}async function Uf(){const L=performance.now(),k=u.info.programs?.length??0,le=p.position.clone(),Se=p.quaternion.clone(),be=new P;let Le=0;try{for(let ke=0;ke<uo.length;ke++){const yt=uo[ke];yt.pos?(p.position.set(yt.pos[0],yt.pos[1],yt.pos[2]),p.lookAt(be.set(yt.look[0],yt.look[1],yt.look[2])),p.updateMatrixWorld(!0)):Mr(0,!0),t(su+(wa-su)*(ke/uo.length)),await as();try{await Df()==="techo"&&(Le++,console.warn(`[preload] vista "${yt.nombre}": más de ${ru} ms de enlace, se abandona`))}catch(ln){Le++,console.warn(`[preload] vista "${yt.nombre}": fallo al compilar, se sigue`,ln)}if(If){const ln=performance.now();u.render(m,p),Jt.readPixels(0,0,1,1,Jt.RGBA,Jt.UNSIGNED_BYTE,Er),console.info(`[preload] dibujado de calentamiento ${yt.nombre}: ${(performance.now()-ln).toFixed(1)} ms`)}}}finally{p.position.copy(le),p.quaternion.copy(Se),p.updateMatrixWorld(!0)}const Ue=u.info.programs?.length??0;console.info(`[preload] ${uo.length} vistas · ${ou?"compileAsync":"compile (sin compileAsync)"} · programas ${k} -> ${Ue}`+(Le?` · ${Le} OMITIDAS por techo`:"")+` · ${(performance.now()-L).toFixed(0)} ms`)}const au=L=>typeof L=="object"&&L!==null&&L.isTexture===!0;function Nf(L){const k=L.image;return typeof k?.width=="number"&&typeof k?.height=="number"?k.width*k.height:0}function Ff(L){const k=new Set;return L.traverse(le=>{if(!le.isMesh&&!le.isPoints&&!le.isLine&&!le.isSprite)return;const Se=le.material;if(Se)for(const be of Array.isArray(Se)?Se:[Se]){if(!be)continue;for(const Ue of Object.values(be))au(Ue)&&k.add(Ue);const Le=be.uniforms;if(Le)for(const Ue of Object.keys(Le)){const ke=Le[Ue]?.value;au(ke)&&k.add(ke)}}}),[...k]}async function Of(){const L=Ff(m),k=performance.now();let le=0,Se=0;const be=[];for(let Le=0;Le<L.length;Le++){const Ue=L[Le];if(performance.now()-k>Lf){be.push(...L.slice(Le).map(ke=>`${ke.name||ke.type} ${ke.image?.width}x${ke.image?.height}`));break}try{u.initTexture(Ue),le++,Se+=Nf(Ue)}catch(ke){be.push(`${Ue.name||Ue.type} (${ke?.message??"error"})`),console.warn(`[preload] no se pudo subir la textura ${Ue.name||Ue.type}; el juego sigue`,ke)}Le%2===1&&(t(wa+(1-wa)*((Le+1)/L.length)),await as())}console.info(`[preload] texturas: ${le}/${L.length} subidas · ${(Se/1e6).toFixed(2)} Mpx · ${(performance.now()-k).toFixed(0)} ms`+(be.length?` · OMITIDAS: ${be.join(", ")}`:""))}async function Bf(){if(_){console.info(`[gpu] escala ${f} fijada a mano con ?escala; no se mide`);return}const L=f;try{Mr(0,!0),bs(),await as();let k=1/0;for(let ke=0;ke<2;ke++){ke>0&&await as(),Jt.readPixels(0,0,1,1,Jt.RGBA,Jt.UNSIGNED_BYTE,Er);const yt=performance.now();u.render(m,p),Jt.readPixels(0,0,1,1,Jt.RGBA,Jt.UNSIGNED_BYTE,Er),k=Math.min(k,performance.now()-yt)}const le=1e3/60,Se=.3,be=le-Se*k,Le=be>0?L*Math.sqrt(be/((1-Se)*k)):0,Ue=fi(+Math.floor(Le*20)/20,a,Ki);Ue<L-.001?(f=Ue,Zi=Ue,bs(),console.info(`[gpu] fotograma medido ${k.toFixed(1)} ms a escala ${L} · escala de partida ${Ue} (medido, no adivinado: 30 % fijo + 70 % por resolución)`)):console.info(`[gpu] fotograma medido ${k.toFixed(1)} ms a escala ${L} · entra en ${L}: cabe en el presupuesto`)}catch(k){console.warn(`[gpu] no se pudo medir la escala de partida; se entra en ${L}`,k)}}Af();try{Pf||(await Uf(),await Of(),await Bf())}catch(L){console.error("[preload] la precarga ha fallado; el juego entra SIN precalentar",L)}return t(1),{beginAttract(){oe("attract"),Mr(0,!0),Yi.start(),ba()},start(){ae.unlock(),oe("play"),Mr(0,!0),se.toast(s?ne("welcome_touch"):ne("welcome"),6e3),Yi.running||Yi.start(),ba()},dispose(){cancelAnimationFrame(oo),ao=!1,Pe.dispose(),window.removeEventListener("resize",bs),document.removeEventListener("visibilitychange",iu),K.dispose(),m.traverse(L=>{const k=L;if(!k.isMesh)return;k.geometry.dispose();const le=Array.isArray(k.material)?k.material:[k.material];for(const Se of le)if(Se){for(const be of Object.values(Se))be&&be.isTexture&&be.dispose();Se.dispose()}}),u.dispose()}}}export{gS as createGame};
