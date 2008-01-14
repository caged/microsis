MICROSIS.Anim=Class.create({initialize:function(C,H,G,A){this.patterns={noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i};var B=false;var D=null;var F=0;var C=$(C);this.attributes=H||{};this.duration=!Object.isUndefined(G)?G:1;this.method=A||Microsis.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=Microsis.AnimMgr.fps;this.setEl=function(K){C=$(K)};this.getEl=function(){return C};this.isAnimated=function(){return B};this.getStartTime=function(){return D};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(Microsis.AnimMgr.fps*this.duration):this.duration;if(this.duration===0&&this.useSeconds){this.totalFrames=1}Microsis.AnimMgr.registerElement(this);return true};this.stop=function(K){if(!this.isAnimated()){return false}if(K){this.currentFrame=this.totalFrames;this.getEle().fire("animation:_tween")}Microsis.AnimMgr.stop(this)};var J=function(){this.getEl().fire("animation:start");this.runtimeAttributes={};for(var K in this.attributes){this.setRuntimeAttribute(K)}B=true;F=0;D=new Date()};var I=function(){var M={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};M.toString=function(){return("duration: "+M.duration+", currentFrame: "+M.currentFrame)};C.fire("animation:tween");var L=this.runtimeAttributes;for(var K in L){this.setAttribute(K,this.doMethod(K,L[K].start,L[K].end),L[K].unit)}F+=1};var E=function(){var K=(new Date()-D)/1000;var L={duration:K,frames:F,fps:F/K};L.toString=function(){return("duration: "+L.duration+", frames: "+L.frames+", fps: "+L.fps)};B=false;F=0;C.fire("animation:complete",L)};C.observe("animation:_start",J.bind(this));C.observe("animation:_complete",E.bind(this));C.observe("animation:_tween",I.bind(this))},inspect:function(){var A=this.getEl();var B=A.id||A.tagName||A;return("#<Microsis::Anim:"+B+">")},doMethod:function(A,C,B){return this.method(this.currentFrame,C,B-C,this.totalFrames)},setAttribute:function(A,C,B){if(this.patterns.noNegatives.test(A)){C=(C>0)?C:0}this.getEl().setStyle(A+":"+C+B)},getAttribute:function(A){var C=this.getEl();var E=C.getStyle(A);if(E!=="auto"&&!this.patterns.offsetUnit.test(E)){return parseFloat(E)}var B=this.patterns.offsetAttribute.exec(A)||[];var F=!!(B[3]);var D=!!(B[2]);if(D||(Microsis.Dom.getStyle(C,"position")=="absolute"&&F)){E=C["offset"+B[0].charAt(0).toUpperCase()+B[0].substr(1)]}else{E=0}return E},getDefaultUnit:function(A){if(this.patterns.defaultUnit.test(A)){return"px"}return""},setRuntimeAttribute:function(B){var G;var C;var D=this.attributes;this.runtimeAttributes[B]={};var F=function(H){return(typeof H!=="undefined")};if(!F(D[B]["to"])&&!F(D[B]["by"])){return false}G=(F(D[B]["from"]))?D[B]["from"]:this.getAttribute(B);if(F(D[B]["to"])){C=D[B]["to"]}else{if(F(D[B]["by"])){if(G.constructor==Array){C=[];for(var E=0,A=G.length;E<A;++E){C[E]=G[E]+D[B]["by"][E]*1}}else{C=G+D[B]["by"]*1}}}this.runtimeAttributes[B].start=G;this.runtimeAttributes[B].end=C;this.runtimeAttributes[B].unit=(F(D[B].unit))?D[B]["unit"]:this.getDefaultUnit(B);return true}});MICROSIS.AnimMgr=new function(){var C=null;var B=[];var A=0;this.fps=1000;this.delay=1;this.registerElement=function(F){B[B.length]=F;A+=1;F.getEl().fire("animation:_start");this.start()};this.unRegister=function(G,F){F=F||E(G);if(!G.isAnimated()||F==-1){return false}G.getEl().fire("animation:_complete");B.splice(F,1);A-=1;if(A<=0){this.stop()}return true};this.start=function(){if(C===null){C=setInterval(this.run,this.delay)}};this.stop=function(H){if(!H){clearInterval(C);for(var G=0,F=B.length;G<F;++G){this.unRegister(B[0],0)}B=[];C=null;A=0}else{this.unRegister(H)}};this.run=function(){for(var H=0,F=B.length;H<F;++H){var G=B[H];if(!G||!G.isAnimated()){continue}if(G.currentFrame<G.totalFrames||G.totalFrames===null){G.currentFrame+=1;if(G.useSeconds){D(G)}G.getEl().fire("animation:_tween")}else{Microsis.AnimMgr.stop(G,H)}}};var E=function(H){for(var G=0,F=B.length;G<F;++G){if(B[G]==H){return G}}return -1};var D=function(G){var J=G.totalFrames;var I=G.currentFrame;var H=(G.currentFrame*G.duration*1000/G.totalFrames);var F=(new Date()-G.getStartTime());var K=0;if(F<G.duration*1000){K=Math.round((F/H-1)*G.currentFrame)}else{K=J-(I+1)}if(K>0&&isFinite(K)){if(G.currentFrame+K>=J){K=J-(I+1)}G.currentFrame+=K}}};MICROSIS.Bezier=new function(){this.getPosition=function(E,D){var F=E.length;var C=[];for(var B=0;B<F;++B){C[B]=[E[B][0],E[B][1]]}for(var A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1]}}return[C[0][0],C[0][1]]}};MICROSIS.Easing={easeNone:function(B,A,D,C){return D*B/C+A},easeIn:function(B,A,D,C){return D*(B/=C)*B+A},easeOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A},easeBoth:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A}return -D/2*((--B)*(B-2)-1)+A},easeInStrong:function(B,A,D,C){return D*(B/=C)*B*B*B+A},easeOutStrong:function(B,A,D,C){return -D*((B=B/C-1)*B*B*B-1)+A},easeBothStrong:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B*B+A}return -D/2*((B-=2)*B*B*B-2)+A},elasticIn:function(C,A,G,F,B,E){if(C==0){return A}if((C/=F)==1){return A+G}if(!E){E=F*0.3}if(!B||B<Math.abs(G)){B=G;var D=E/4}else{var D=E/(2*Math.PI)*Math.asin(G/B)}return -(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A},elasticOut:function(C,A,G,F,B,E){if(C==0){return A}if((C/=F)==1){return A+G}if(!E){E=F*0.3}if(!B||B<Math.abs(G)){B=G;var D=E/4}else{var D=E/(2*Math.PI)*Math.asin(G/B)}return B*Math.pow(2,-10*C)*Math.sin((C*F-D)*(2*Math.PI)/E)+G+A},elasticBoth:function(C,A,G,F,B,E){if(C==0){return A}if((C/=F/2)==2){return A+G}if(!E){E=F*(0.3*1.5)}if(!B||B<Math.abs(G)){B=G;var D=E/4}else{var D=E/(2*Math.PI)*Math.asin(G/B)}if(C<1){return -0.5*(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A}return B*Math.pow(2,-10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E)*0.5+G+A},backIn:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158}return E*(B/=D)*B*((C+1)*B-C)+A},backOut:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158}return E*((B=B/D-1)*B*((C+1)*B+C)+1)+A},backBoth:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158}if((B/=D/2)<1){return E/2*(B*B*(((C*=(1.525))+1)*B-C))+A}return E/2*((B-=2)*B*(((C*=(1.525))+1)*B+C)+2)+A},bounceIn:function(B,A,D,C){return D-Microsis.Easing.bounceOut(C-B,0,D,C)+A},bounceOut:function(B,A,D,C){if((B/=C)<(1/2.75)){return D*(7.5625*B*B)+A}else{if(B<(2/2.75)){return D*(7.5625*(B-=(1.5/2.75))*B+0.75)+A}else{if(B<(2.5/2.75)){return D*(7.5625*(B-=(2.25/2.75))*B+0.9375)+A}}}return D*(7.5625*(B-=(2.625/2.75))*B+0.984375)+A},bounceBoth:function(B,A,D,C){if(B<C/2){return Microsis.Easing.bounceIn(B*2,0,D,C)*0.5+A}return Microsis.Easing.bounceOut(B*2-C,0,D,C)*0.5+D*0.5+A}}