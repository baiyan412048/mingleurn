"use strict";!function($){$.fn.delay4=function(o,t){var e=$(this),s=$.extend({add:"",remove:"",time:"500"},o);return this.each(function(){""!==s.add&&setTimeout(function(){e.addClass(s.add),"function"==typeof t&&t()},parseInt(s.time)),""!==s.remove&&setTimeout(function(){e.removeClass(s.remove),"function"==typeof t&&t()},parseInt(s.time)),""==s.remove&&""==s.add&&setTimeout(function(){"function"==typeof t&&t()},parseInt(s.time))})},$.fn.anchor4=function(){return this.each(function(){$(this).off().on("click",function(e){function scrollToAnchor(scrollTarget_Offset,margintop){scrollContainer.animate({scrollTop:scrollTarget_Offset-margintop},{duration:speed,easing:easing,complete:function complete(){if(console.log("scroll complate"),""!==datacallback&&void 0!==datacallback)return eval(datacallback+"(thisData)");console.log("no callback")}})}var $this=$(this),thisData=$this.data(),container=thisData.anchorContainer,target=thisData.anchorTarget,margintop=thisData.anchorMargintop,speed=thisData.anchorSpeed,easing=thisData.anchorEasing,datacallback=thisData.anchorCallback,scrollContainer=container,scrollTarget=target,scrollContainer_Offset,scrollTarget_Offset,scrollContainer_scrollTop;scrollContainer=$(""===container||void 0===container?"html, body":scrollContainer),margintop=""===margintop||void 0===margintop?0:parseInt(margintop),speed=""===speed||void 0===speed?900:parseInt(speed),easing=""===easing||void 0===easing?"easeInOutCirc":easing,console.log("container > "),console.log(container),console.log("scrollContainer > "),console.log(scrollContainer),""===target||void 0===target?(console.log("anchor A"),console.log('container === "" && target === ""'),console.log("scrollTarget_Offset = 0"),scrollTarget_Offset=0):(console.log("anchor B"),""===container||void 0===container?(scrollTarget_Offset=Math.floor($(scrollTarget).offset().top),console.log("container : "+container),console.log("scrollTarget_Offset.top :"+scrollTarget_Offset)):(scrollTarget=document.querySelector(scrollTarget),scrollTarget_Offset=scrollTarget.offsetTop,console.log("container : "+container),console.log("scrollTarget_OffsetTop :"+scrollTarget_Offset)),scrollContainer_Offset=Math.floor(scrollContainer.offset().top),console.log("scrollContainer_Offset:"+scrollContainer_Offset),scrollContainer_scrollTop=Math.floor(scrollContainer.scrollTop()),console.log("scrollContainer_scrollTop :"+scrollContainer_scrollTop),console.log("speed : "+speed),console.log("easing : "+easing),console.log("margintop : -"+margintop)),scrollToAnchor(scrollTarget_Offset,margintop)})})},$.fn.autoScroll4=function(o,l){var c=$.extend({target:"",margintop:0,speed:500,easing:"easeInOutCirc"},o);return this.each(function(){var o,t,e,s=$(this),a=c.target,n=parseInt(c.margintop),r=parseInt(c.speed),i=c.easing;o=s,""!==a?(t=a,e=(t=document.querySelector(t)).offsetTop):0===a&&"0"===a&&"top"===a&&void 0!==a||(e=0),o.animate({scrollTop:e-n},{duration:r,easing:i,complete:function(){"function"==typeof l&&l()}})})},$.fn.scrollCss4=function(o){var i=$(this),l=$.extend({scrollObj:"[data-scrollBody]",scrollObjCover:".contentCover",upClass:"upClass",downClass:"downClass",topClass:"topClass",bottomClass:"bottomClass",marginTop:500,marginBottom:300},o);return this.each(function(){var o=$(l.scrollObj),n=o.find(l.scrollObjCover),r=(parseInt(l.margintop),0);o.on("scroll",function(o){var t=$(this),e=t.scrollTop(),s=t.height(),a=n.height();e-parseInt(l.marginTop)<=0?i.addClass(l.topClass):i.removeClass(l.topClass),a-e-parseInt(l.marginBottom)<=s?i.addClass(l.bottomClass):i.removeClass(l.bottomClass),e<r?i.addClass(l.upClass):i.removeClass(l.upClass),r<e?i.addClass(l.downClass):i.removeClass(l.downClass),setTimeout(function(){r=e},0)})})},$.extend({swiper4:function(h,m,n){""!==h&&void 0!==$(h)?$(h).each(function(o){var t=parseInt(o)+1,e=m.substring(1)+t,s=h+"."+e,a=".swiper-pagination"+t,n=".swiperNext"+t,r=".swiperPrev"+t,i=$(this).data("swiperNum"),l=$(this).data("swiperNumgroup"),c=$(this).data("swiperEffect"),p=$(this).data("swiperAutoplay"),d=$(this).data("swiperLoop"),f=$(this).data("swiperArrow"),g=$(this).data("swiperNav"),u=$(this).data("swiperScrollbar");$(this).data("swiperCallback");console.log(s),""!==i&&void 0!==i||(i=1),""!==l&&void 0!==l||(l=1),c=""===c||void 0===c?"slide":"fade",p="off"!==p,"off"!==d?d=!0:p=!1,"off"!==f?($(this).append('<div class="swiper-button-next '+n.substring(1)+'"></div>'),$(this).append('<div class="swiper-button-prev '+r.substring(1)+'"></div>')):r=n="","off"!==g?$(this).append('<div class="swiper-pagination '+a.substring(1)+'"></div>'):a="",$(this).addClass(e),$(this).find(".swiper-slide").attr("data-swiper",e);new Swiper(s,{slidesPerView:i,slidesPerGroup:l,effect:c,direction:"horizontal",loop:d,mousewheel:!0,autoplay:p,pagination:{el:a,clickable:!0},navigation:{nextEl:n,prevEl:r},lazy:{loadPrevNext:!0},on:{slideChangeTransitionEnd:function(){}}})}):""!==n&&void 0!==n&&$(h).each(function(){var o=m+Num,t=h+"."+o,e=".swiper-pagination"+Num,s=(Num,".swiperNext"+Num),a=".swiperPrev"+Num;$(this).append('<div class="swiper-button-next '+s.substring(1)+'"></div>'),$(this).append('<div class="swiper-button-prev '+a.substring(1)+'"></div>'),$(this).append('<div class="swiper-pagination '+e.substring(1)+'"></div>');new Swiper(t,n);Num++})}})}(jQuery);
//# sourceMappingURL=wdd.1.2.1-dist.js.map