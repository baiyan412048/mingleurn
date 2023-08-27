//全域變數
let remindlbox
let imgBase64 = []

let _common = {
  //鎖住卷軸
  bodyLock() {
    bodyScroll.lock();
  },
  //解鎖卷軸
  bodyUnlock() {
    bodyScroll.unlock();
  },
  //點擊空白處
  clickBlank(page) {
    $(document).on('click', function () {
      $('.function-bar .function-btn.language, .fixed-left-function .function-btn.language').removeClass('active');
      switch (page) {
        case 'news':
          $('.search-year').removeClass('active')
          $('.search-year .dropdown').slideUp(400)
          break;
        case 'search_result':
          $('.search-year').removeClass('active')
          $('.search-year .dropdown').slideUp(400)
          break;
        case 'product_list':
          $('.filter-option .filter-btn').removeClass('open')
          $('.filter-btn .filter-menu').attr('style', '')
          if ($(window).outerWidth() <= 767) {
            $('.type-dropdown').removeClass('active')
            $('.type-dropdown .dropdown').slideUp(400)
          }
          break;
        case 'product_detail':
          $('.option-bar .share').removeClass('open')
          $('.option-bar .collect').removeClass('open')
          $('.collect-category').attr('style', '')
          break;
        case 'qa':
          if($(window).outerWidth() <= 1024){
            $('.type-dropdown').removeClass('active')
            $('.type-dropdown .dropdown').slideUp(400)
          }
          break;
        case 'contact':
          $('.form-group .select-element').removeClass('active')
          $('.form-group .dropdown').removeClass('shadow')
          $('.form-group .dropdown').slideUp(400)
          break;
        case 'member':
          $('.categories-select').removeClass('active')
          $('.categories-select .dropdown').removeClass('shadow')
          $('.categories-select .dropdown').slideUp(400)
          break;
      }
    })
  },
  // 登入提示視窗
  remindLogin() {
    const intervalTime = $('body').attr('data-login-remind') == '' ? false : Number($('body').attr('data-login-remind'))
    if ($('body').attr('data-ajax-route') === undefined || $('body').attr('data-ajax-route') === '' || intervalTime === false) return
    let gate = 0;
    remindlbox = setInterval(function() {
      gate++
      if (gate == intervalTime) {
        $.ajax4({
          Route: $('body').attr('data-ajax-route'),
          Container: '.remind-login-lbox',
          Block: '',
          Callback: '_ajaxCallback.remindlogin',
          Backready: '',
          Backloaded: '',
        });
        clearInterval(remindlbox);
      }
    }, 1000);
  },
  // loading畫面
  loading(type) {
    if (!type) {
      $('.loading-page').fadeIn(300)
    }
    else {
      $(`.loading-page.${type}`).fadeIn(300)
    }
  },
  //keyframes
  keyframes() {
    $.keyframe.define([
      {
        name: 'motorcycle1',
        '0%': {
          'opacity' : '0',
          'left' : '-100px',
        },
        '20%': {
          'opacity' : '1'
        },
        '80%': {
          'opacity' : '1'
        },
        '100%': {
          'opacity' : '0',
          'left' : 'calc(100vw)'
        }
      },
      {
        name: 'motorcycle2',
        '0%': {
          'transform' : 'scale(1)',
        },
        '50%': {
          'transform' : 'scale(1.1)'
        },
        '100%': {
          'transform' : 'scale(1)',
        }
      },
      {
        name: 'motorcycle3',
        '0%': {
          'opacity' : '0',
          'left': 'calc(100vw)',
        },
        '40%': {
          'opacity': '1',
          'transform' : 'scale(1) translateY(0px)'
        },
        '70%': {
          'opacity': '1',
          'left': '60vw',
          'transform' : 'scale(1.5) translateY(-50px)'
        },
        '100%': {
          'opacity': '1',
          'left': '60vw',
          'transform' : 'scale(1.5) translateY(-50px)'
        },
      },
    ]);
  },
  //Inview跑動畫
  animateInview() {
    $('[data-animate]').each(function () {
      const obj = $(this)
      const inviewObj = obj.attr('data-anchor-obj') || this
      const animateName = obj.attr('data-animate')
      const duration = (obj.attr('data-duration') || '1s')
      const easing = obj.attr('data-easing') || 'linear'
      const delay = (obj.attr('data-delay') || '')
      $(inviewObj).on('inview', function (event, isInView) {
        if (isInView) {
          obj.css('animation', `${animateName} ${duration} ${easing} ${delay} forwards`)
        }
      })
    })
  },
  //footer進入畫面時
  footerInview() {
    const now_page = $('body').attr('class')
    //有裝飾物的頁面
    const hasDecor = ['news', 'search_result', 'product', 'product_list', 'qa', 'about', 'contact', 'login']
    $('footer').on('inview', function (event, isInView) {
      if (isInView) {
        if (hasDecor.indexOf(now_page) != -1) {
          $(`.${now_page} .decor-layer`).fadeOut(400)
        }
      }
      else {
        $('.fixed-left-function:not(.innerMenu)').css('position','fixed')
        if (hasDecor.indexOf(now_page) != -1) {
          $(`.${now_page} .decor-layer`).fadeIn(400)
        }
      }
    });
  },
  //下拉選單
  dropdown(el){
    $(`${el} .dropdown ul`).scrollbar({
      ignoreMobile: true
    })
    $(`${el} .selected`).on('click', function (e) {
      const clickEl = $(this).parents(el)
      const dropdown = $(this).siblings('.dropdown')
      e.stopPropagation()
      e.preventDefault()
      $(el).not(clickEl).removeClass('active')
      $(el).not(clickEl).find('.dropdown').slideUp(400)
      //收起來
      if (clickEl.hasClass('active')) {
        $('nav.sticky').attr('style','').removeClass('show')
        clickEl.removeClass('active')
        dropdown.removeClass('shadow')
        dropdown.stop().slideUp(400).promise().done(function () {
          dropdown.css('visibility', 'hidden')
          dropdown.addClass('hide')
        })
      }
      //展開
      else {
        $('nav.sticky').hide()
        clickEl.addClass('active')
        dropdown.css('visibility', 'visible')
        dropdown.removeClass('hide')
        dropdown.stop().slideDown(400).promise().done(function () {
          dropdown.addClass('shadow')
        })
      }
    })
    $(`${el} .dropdown ul`).on('click', 'li', function () {
      const clickEl = $(this).parents(el)
      const dropdown = $(this).parents('.dropdown')
      const option = $(this).text()
      clickEl.find('.selected .text').text(option)
      clickEl.find('.selected').addClass('isChange')
      clickEl.removeClass('active')
      dropdown.removeClass('shadow')
      dropdown.addClass('shadow').slideUp(400)
    })
  },
  //帳號流程類共用
  accountCommon(data) {
    const container = data.Container
    $('nav.sticky').hide()
    $('.ajax_open').ajax4()
    $(container).find('.modal-scroll-wrap').scrollbar({
      ignoreMobile: true,
    })
    $(container).delay4({ time: '100', add: 'show' })
    $(container).on('click', function () {
      const stepCount = $('.step-content').length
      const Route = $(this).find('.close-btn').attr('data-ajax-route');
      const Container = $(this).find('.close-btn').attr('data-ajax-container');
      const Callback = $(this).find('.close-btn').attr('data-ajax-callback');
      if($('.step-circle').attr('data-step') == stepCount){
        _common.closeAjax(container)
      }
      else{
        $.ajax4({
          Route: Route,
          Container: Container,
          Block: '',
          Callback: Callback,
          Backready: '',
          Backloaded: '',
        });
      }
    })
    $(container).find('.close-btn').on('click', function (e) {
      if ($(window).outerWidth() <= 991) {
        e.stopPropagation()
        const stepCount = $('.step-content').length
        const Route = $(this).attr('data-ajax-route');
        const Container = $(this).attr('data-ajax-container');
        const Callback = $(this).attr('data-ajax-callback');
        if($('.step-circle').attr('data-step') == stepCount){
          _common.closeAjax(container)
        }
        else{
          $.ajax4({
            Route: Route,
            Container: Container,
            Block: '',
            Callback: Callback,
            Backready: '',
            Backloaded: '',
          });
        }
      }
    })
    $(container).find('.modal-dialog').on('click',function(e){
      e.stopPropagation()
      $('.form-group .select-element').removeClass('active')
      $('.form-group .dropdown').removeClass('shadow')
      $('.form-group .dropdown').slideUp(400)
    })
    $('.ajax_close').on('click', function (e) {
      e.stopPropagation()
      _common.closeAjax(container)
    })
    _common.dropdown('.form-group .select-element')
    //關閉按鈕dom移動
    function moveCloseBtnDom() {
      const closeBtn = $(container).find('.close-btn')
      if ($(window).outerWidth() <= 767) {
        $('.modal-dialog').prepend(closeBtn)
      } else {
        $(container).prepend(closeBtn)
      }
    }
    moveCloseBtnDom()
    $(window).on('resize', function () {
      moveCloseBtnDom()
    })
  },
  accountStepChange(stepCount, type) {
    const step = $('.step-circle').attr('data-step');
    const next = type == 'back' ? Number(step) - 1 : Number(step) + 1;
    $('.step-circle').attr('data-step', next);
    $('.step-circle').find('path[step]').attr('stroke-dasharray', (100 / stepCount) * next + ',100');
    $('.step-circle').find('path[step]').css('animation', 'step_'+ next +' 1s');
    $('.step-circle').find('.now-step').html(next);
    $('.step-content').fadeOut(0).removeClass('active');
    $('.step-content[data-step="'+ next +'"]').css('display', 'flex').hide().fadeIn(300, function() {
      $(this).addClass('active')
    });
    $('.modal-scroll-wrap').scrollTop(0)
    if (!$('.modal-scroll-wrap').parents().hasClass('change-password-wrap')) {
      _common.stepFunction(next)
    }
  },
  //步驟function
  stepFunction(step) {
    switch (step) {
      case 2:
        countDown();
        $('.tip-box .resend').on('click', function() {
          countDown();
        });
        break;
    }
  },
  //視窗卷軸控制
  scrollbarController(pagename) {
    const scrollElement = $(window)
    const nav_h = $('nav:not(.sticky)').innerHeight() + 200
    let after = 0
    // $('.main-wrapper[data-fake-body=""]').scrollbar({
    //   ignoreMobile: true,
    // })
    scrollElement.on('scroll', function () {
      const window_w = $(window).outerWidth()
      const scrollTop = $(this).scrollTop()
      const viewHeight = $(window).outerHeight()
      //針對單元個別設定
      switch (pagename) {
        //最新消息
        case 'news':
          if (window_w > 767) {
            const newsTypeWidth = $('.news-type').innerWidth()
            const typeSelectHeight = $('.type-select').outerHeight(true)
            const newsListHeight = $('.news-list').outerHeight(true)
            const newsTypePosLeft = $('.news-type').position().left
            const hrOffset = $('.container > .custom-hr').offset().top
            $('.news-type').css('height',newsListHeight)
            if (hrOffset <= 0) {
              $('.type-select').addClass('fixed')
              $('.decor-layer').addClass('show')
              //視窗往下滾
              if (after < scrollTop) {
                if (hrOffset <= -(newsListHeight - typeSelectHeight - 50)) {
                  $('.type-select').css({
                    'position': 'absolute',
                    'top': 'auto',
                    'bottom': '50px',
                    'left': '0'
                  })
                }
                else {
                  $('.type-select').css({
                    'position': 'fixed',
                    'width': newsTypeWidth,
                    'top': '22px',
                    'bottom': 'auto',
                    'left': newsTypePosLeft,
                  })
                }
                if (hrOffset <= -50) {
                  $('.type-select').css({
                    'transition': 'top 0.2s ease-in',
                  })
                }
                else {
                  $('.type-select').css({
                    'transition': '',
                  })
                }
              }
              //視窗往上滾
              else {
                if (hrOffset <= -(newsListHeight - typeSelectHeight - 130)) {
                  $('.type-select').css({
                    'position': 'absolute',
                    'top': 'auto',
                    'bottom': '50px',
                    'left': '0'
                  })
                }
                else {
                  $('.type-select').css({
                    'position': 'fixed',
                    'width': newsTypeWidth,
                    'top': '102px',
                    'bottom': 'auto',
                    'left': newsTypePosLeft,
                  })
                }
              }
            }
            else {
              $('.type-select').removeClass('fixed')
              $('.decor-layer').removeClass('show')
              if (hrOffset >= 80) {
                $('.type-select').attr('style', '')
              }
            }
          }
          break;
        //購物QA
        case 'qa':
          if (window_w > 1024) {
            const footerOffsetTop = $('footer').position().top
            const qaPaddingBottom = Number($('.qa-block').css('paddingBottom').replace('px', ''))
            const viewHeight = $(window).outerHeight()
            const typeSelectOffsetTop = 470
            const typeSelectHeight = $('.qa-type .type-select').height()
            const typeSelectOffsetBottom = viewHeight - typeSelectOffsetTop - typeSelectHeight
            const stopPoint = footerOffsetTop - qaPaddingBottom - viewHeight
            if(scrollTop >= stopPoint + typeSelectOffsetBottom) {
              $('.qa-type .type-select').css({
                position: 'absolute',
                top: 'auto',
                left: '5px',
                bottom: '0'
              })
            }
            else {
              $('.qa-type .type-select').attr('style','')
            }
          }
          break;
        case 'product_search':
          if ($('.result-wrap').hasClass('search-after')) {
            const headerMarginB = Number($('.result-wrap .header').css('margin-bottom').replace('px', ''))
            const listOffsetTop = $('.product-list').offset().top
            const keywordContainer = $('.search-keyword-container')
            const emptyBox = `<div class="empty-box" style="width: 100%;height: ${keywordContainer.outerHeight(true)}px;margin: 0 auto;"></div>`
            if (scrollTop > listOffsetTop - headerMarginB - 45) {
              if ($('.empty-box').length <= 0) {
                $('.search-after-header').append(emptyBox)
              }
              if (after === scrollTop) {
                return false
              }
              keywordContainer.addClass('fixed')
              keywordContainer.find('.content').slideUp()
              keywordContainer.find('.collapse-btn').removeClass('open')
            }
            else {
              if (after >= scrollTop) {
                $('.empty-box').remove()
                keywordContainer.removeClass('fixed')
                if (after > listOffsetTop - headerMarginB - 45) {
                  keywordContainer.find('.content').attr('style','')
                  keywordContainer.find('.content').show()
                  keywordContainer.find('.collapse-btn').addClass('open')
                }
              }
            }
          }
          break;
      }

      //共用(不論上下)
      //左邊固定功能
      if ($('footer').length > 0) {
        const footer_h = $('footer').innerHeight()
        const footerTop = $('.footer-top').innerHeight()
        const footerBottomOffset = $('.footer-bottom').offset().top
        if (scrollTop >= footerBottomOffset - viewHeight) {
          if (window_w > 1024) {
            $('.fixed-left-function:not(.innerMenu)').css({
              'position': 'absolute',
              'bottom': footer_h - footerTop + 75 + 'px'
            })
          }
          else {
            $('.fixed-left-function:not(.innerMenu)').css({
              'position': 'absolute',
              'bottom': footer_h - footerTop + 30 + 'px'
            })
          }
        }
        else {
          $('.fixed-left-function:not(.innerMenu)').attr('style','')
        }
      }
      //視窗往下滾
      if (after < scrollTop){
        // console.log('視窗往下')
        $('nav.sticky').removeClass('show')
      }
      //視窗往上滾
      else{
        // console.log('視窗往上')
        if(scrollTop > nav_h){
          $('nav.sticky').addClass('show')
        }
        else{
          $('nav.sticky').removeClass('show')
        }
      }
      setTimeout(function(){
        after = scrollTop
      },300)
    })
  },
  //偵測頁籤active
  tabActiveShow() {
    $('.tab-btn.active').each(function () {
      const nav_tabs = $(this).parents('.nav-tabs')
      const tabsID = '#' + nav_tabs.attr('data-id')
      const tabpaneID = '#' + $(this).attr('data-page')
      const panel = $(tabsID).find(tabpaneID)
      panel.show()
    })
  },
  //切換頁籤
  switchTabs(fadeOut) {
    $('.tab-btn').on('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const _click = $(this)
      if (_click.hasClass('active')) {
        return false
      }
      else {
        const nav_tabs = _click.parents('.nav-tabs')
        const tabsDataID = nav_tabs.attr('data-id')
        const tabsID = '#' + tabsDataID
        const tab_content = $(tabsID)
        const page = _click.attr('data-page')
        const tabpaneID = '#' + page
        $('.nav-tabs[data-id="'+ tabsDataID +'"]').find('.tab-btn').removeClass('active');
        _click.addClass('active');
        $('.nav-tabs[data-id="'+ tabsDataID +'"]').find('.tab-btn[data-page="'+ page +'"]').addClass('active');
        tab_content.children(`.tab-pane:not(${tabpaneID})`).fadeOut(fadeOut).promise().done(function () {
          $(tabpaneID).show().promise().done(function () {
            _common.blazyInit();
          })
        })
      }
    })
  },
  //抓swiper
  getMySwiper: function (name) {
    const swiperName = $(`[data-swiper-name="${name}"]`);
    if (swiperName.attr('data-swiper4-active') !== 'on') {
      return swiperName
    }
    const index = swiperName.data('swiperMyswiper');
    const myIndexSwiper = mySwiper[index];
    return myIndexSwiper
  },
  //判斷輪播數量
  getSlidesCount(swiper) {
    const container = swiper.$el
    const slidesCount = function () {
      if (swiper.loopedSlides) {
        return swiper.slides.length - swiper.loopedSlides * 2
      }
      else {
        return swiper.slides.length
      }
    }
    if (slidesCount() <= swiper.params.slidesPerView) {
      container.addClass('swiper-no-swiping')
      $(swiper.params.navigation.nextEl).hide()
      $(swiper.params.navigation.prevEl).hide()
      $(swiper.params.pagination.el).hide()
      swiper.params.autoplay.enabled = false
      swiper.autoplay.stop()
    }
    else {
      container.removeClass('swiper-no-swiping')
      $(swiper.params.navigation.nextEl).show()
      $(swiper.params.navigation.prevEl).show()
      $(swiper.params.pagination.el).show()
      if (swiper.params.autoplay.enabled) {
        swiper.autoplay.start()
      }
    }
  },
  //主圖輪播
  bannerSlider(slider) {
    let activeSlide
    const swiper = slider.$el ? slider.$el : $(slider)
    const bannerSlider = $(swiper).parents('.mainBanner-slider')
    const textarea = bannerSlider.find('.slider-textarea')
    const slideCount = slider.slides ? slider.slides.length - 2 : 1
    if (slideCount <= 1) {
      $(swiper).addClass('swiper-no-swiping')
      bannerSlider.find('.swiper-pagination').hide()
    }
    //如果Swiper沒有啟動
    if (swiper.attr('data-swiper4-active') !== 'on') {
      activeSlide = swiper.find('.swiper-slide')
    }
    else {
      activeSlide = swiper.find('.swiper-slide-active') || swiper.find('.swiper-slide-duplicate-active')
    }
    const day = activeSlide.attr('data-day')
    const monthYear = activeSlide.attr('data-month-year')
    const title = activeSlide.attr('data-title')
    const description = activeSlide.attr('data-description')
    const ajaxHref = activeSlide.attr('data-href')

    function changeText() {
      $(textarea).addClass('changing')
      setTimeout(function () {
        if($(textarea).find('.news-date').length > 0){
          $(textarea).find('.news-date .day').text(day)
          $(textarea).find('.news-date .month_year').text(monthYear)
        }
        $(textarea).attr('data-ajax-route',ajaxHref)
        $(textarea).find('.title').text(title)
        $(textarea).find('.description').text(description)
        $(textarea).removeClass('changing')
      },500)
    }

    return changeText()
  },
  //打開Ajax
  openAjax(route, container, callback, obj) {
    const contain = container ? container : '.remind-login-lbox'
    const func = callback ? callback : '_ajaxCallback.remindlogin'
    $.ajax4({
      Route: route,
      Container: contain,
      Block: '',
      Callback: func,
      Backready: '',
      Backloaded: '',
      clickObj: obj,
    });
  },
  //關閉Ajax
  closeAjax(container){
    $(container).removeClass('show')
    if (container == '.preview-wrap') {
      $('.drawing-paper.paper-initialize').each(function (index,el) {
        const page = $(el).attr('data-page')
        customizedCanvas[page].canvas.viewportTransform = defaultViewport
        customizedCanvas[page].cursorCanvas.viewportTransform = defaultViewport
        customizedCanvas[page].canvas.renderAll()
        customizedCanvas[page].cursorCanvas.renderAll()
      })
    }
    $(container).on('transitionend webkitTransitionEnd oTransitionEnd', function () {
      $(container).remove()
      $('nav.sticky').show()
      if ($('.modal-dialog').length < 1) {
        bodyScroll.unlock();
      }
      $(container).unbind('transitionend webkitTransitionEnd oTransitionEnd')
    })
  },
  ajaxCommon(data) {
    const container = data.Container
    $('nav.sticky').hide()
    $(container).addClass('ajax_close')
    $(container).find('.modal-scroll-wrap').scrollbar({
      ignoreMobile: true,
    })
    switch (container) {
      case '.preview-wrap':
        _common.loading()
        setTimeout(() => {
          $('.loading-page').fadeOut(300).promise().done(function () {
            $(container).addClass('show')
          })
          previewBefore()
        },1200)
        function previewBefore() {
          const form = $('.remark-block .content').clone()
          const paperName = [
            $('.toolbar-top .product-name span:nth-child(2)').attr('data-default'),
            'Attached file-1',
            'Attached file-2'
          ]
          $('.drawing-paper.paper-initialize').each(function (index,el) {
            const page = $(el).attr('data-page')
            customizedCanvas[page].canvas.viewportTransform = [1,0,0,1,0,0]
            customizedCanvas[page].cursorCanvas.viewportTransform = [1,0,0,1,0,0]
            customizedCanvas[page].canvas.renderAll()
            customizedCanvas[page].cursorCanvas.renderAll()
            imgBase64.push(customizedCanvas[page].canvas.toDataURL("image/jpeg", 1))
            const previewBlock = `<div class="preview-block"><div class="custom-name"><span>Name</span><span>${paperName[index]}</span></div><div class="preview-img"><img src="${imgBase64[index]}" /></div></div>`
            $('.preview-section').append(previewBlock)
            $('.form-block').append(form)
            formFormat()
          })
        }
        function formFormat() {
          $('.form-block .form input').prop('disabled', true)
          $('.form-block .form .form-group').each(function (index, el) {
            const cancel = $(el).find('.cancel-option input').prop('checked')
            const option = $(el).find('.option-group label.checkbox input:checked')
            if (cancel == true) {
              $(el).find('.option').remove()
            }
            else if(option.length > 0){
              $(el).find('.cancel-option').remove()
              $(el).find('.option-group').not(option.parents('.option-group')).remove()
            }
            else if (cancel != true && option.length <= 0) {
              $(el).remove()
            }
          })
          if ($('.cancel-option input:checked').length <= 0 && $('.option-group label.checkbox input:checked').length <= 0) {
            $('.form-block').hide()
          }
        }
        break;
      default:
        $(container).delay4({ time: '100', add: 'show' })
        break;
    }
    $(container).find('.modal-dialog').on('click',function(e){
      e.stopPropagation()
      $('.form-group .select-element').removeClass('active')
      $('.form-group .dropdown').removeClass('shadow')
      $('.form-group .dropdown').slideUp(400)
    })
    $('.ajax_close').on('click', function (e) {
      e.stopPropagation()
      _common.closeAjax(container)
    })
  },
  //input 數量改變
  countHandler(ele) {
    //失去焦點時如果數量為空值則改為1
    $(ele).on('blur', '.buy-count .count', function () {
      if (this.value == '') {
        $(this).val(1)
      }
    })
    //手動輸入數量
    $(ele).on('keyup', '.buy-count .count', function () {
      //目前數量
      const count = Number(this.value)
      //庫存數量
      const inventories = Number($(this).parents('.buy-count').attr('data-inventories'))
      //只能輸入非零開頭的正整數
      const filter = this.value = (this.value.replace(/\D/g,'') == '' ? '' : parseInt(this.value,10))
      $(this).val(filter)
      //如果輸入數量大於庫存數量
      if (count >= inventories){
        $(this).val(inventories)
      }
      //如果輸入數量等於0
      else if(count == 0){
        $(this).val('')
      }
    })
    //減少數量
    $(ele).on('click', '.buy-count .minus', function(e){
      e.stopPropagation()
      //目前數量
      let count = Number($(this).parents('.buy-count').find('.count').val())
      if(count > 1){
        count--
        $(this).parents('.buy-count').find('.count').val(count)
      }
      else{
        return false
      }
    })
    //增加數量
    $(ele).on('click', '.buy-count .plus', function(e){
      e.stopPropagation()
      //目前數量
      let count = Number($(this).parents('.buy-count').find('.count').val())
      //庫存數量
      const inventories = Number($(this).parents('.buy-count').attr('data-inventories'))
      if(count < inventories){
        count++
        $(this).parents('.buy-count').find('.count').val(count)
      }
      else{
        return false
      }
    })
  },
  //Blazy基本
  blazyInit(pagename) {
    let bLazy = new Blazy({
      // container: '.main-wrapper[data-fake-body=""]',
      offset: 100,
      success(el) {
        $(el).parents('.brush-img').addClass('show')
        switch (pagename) {
          case 'home':
            _home.ImgWidthConvert(el)
            break;
          } 
      }
    });
  },
}
let _ajaxCallback = {
  //登入提醒視窗
  remindlogin(data) {
    const container = data.Container
    $('nav.sticky').hide()
    $(container).addClass('ajax_close')
    $(container).find('.modal-scroll-wrap').scrollbar({
      ignoreMobile: true,
    })
    $(container).delay4({ time: '100', add: 'show' })
    $(container).find('.modal-dialog').on('click',function(e) {
      e.stopPropagation()
    })
    $('.ajax_close').on('click', function (e) {
      e.stopPropagation()
      _common.closeAjax(container)
      if ($(this).hasClass('remind-login-lbox')) {
        // 第二次之後的顯示時間
        _common.remindLogin()
      }
      bodyScroll.unlock();
    })
    _common.bodyLock('.modal-scroll-wrap')
  },
  //一般訊息燈箱
  normalLightbox(data) {
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    const lbox = data.Container
    switch (lbox) {
      case '.member-statement-lbox':
        $(lbox).find('.scroll-wrap').scrollbar({
          ignoreMobile: true
        })
        break;
      case '.remind-lbox':
        $('.confirm-leave').on('click', function () {
          _common.closeAjax(lbox)
          _common.closeAjax('.register-lbox')
          _common.closeAjax('.forgetps-lbox')
          _common.closeAjax('.edit-profile-wrap')
          _common.closeAjax('.change-phone-wrap')
          _common.closeAjax('.change-password-wrap')
          _common.closeAjax('.change-account-wrap')
          bodyScroll.unlock();
        })
        break;
      case '.leave-check-wrap':
        $('.remind-link').on('click', function () {
          const route = $(this).attr('data-ajax-route')
          const container = $(this).attr('data-ajax-container')
          const callback = $(this).attr('data-ajax-callback')
          _common.openAjax(route,container,callback)
        })
      case '.cancel-order-wrap':
        $('.cancel-order-wrap textarea').scrollbar()
        break;
      case '.customized-submit-wrap':
        $('.customized-submit-wrap').delay4({ time: '100', add: 'show' })
        imgBase64 = []
        break;
    }
  },
  //首頁探索靈感
  homeInspire(data) {
    const container = data.Container
    function moveDecorObject() {
      const window_w = $(window).outerWidth()
      const object = $('.decor-layer')
      if (window_w <= 767) {
        $('.modal-content').before(object)
      } else {
        $(container).children('.modal-scroll-wrap').before(object)
      }
    }
    moveDecorObject()
    $('nav.sticky').hide()
    $(container).addClass('ajax_close')
    $(container).find('.modal-scroll-wrap').scrollbar({
      ignoreMobile: true,
      "onScroll": function (y, x) {
        const contentOffset = $('.modal-content').position().top + 90
        const window_w = $(window).outerWidth()
        if (window_w > 1024) {
          if (y.scroll >= contentOffset) {
            $('.back').css({
              'top': y.scroll - contentOffset
            })
            $('.block.left').css({
              'top': y.scroll - contentOffset
            })
          }
        }
      }
    })
    $(container).delay4({time: '100',add: 'show'})
    $(container).find('.modal-dialog').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
      $('.decor-layer').addClass('show')
      $(container).find('.modal-dialog').unbind('transitionend webkitTransitionEnd oTransitionEnd')
    })
    $(container).find('.modal-dialog').on('click',function(e){
      e.stopPropagation()
    })
    $('.ajax_close').on('click', function (e) {
      e.stopPropagation()
      _common.bodyUnlock('.modal-scroll-wrap')
      _common.closeAjax(container)
    })
    $(window).on('resize', function () {
      moveDecorObject()
    })
    _common.bodyLock('.modal-scroll-wrap')
  },
  //最新消息內頁
  newsDetail(data) {
    _common.ajaxCommon(data)
    $(data.Container).find('.modal-content').addClass('show')
    $(data.Container).find('.next-news').on('click',function(e){
      e.stopPropagation()
    })
    //複製網址
    copylink('.social-share-bar .copy_url','Copied')
    //詳細頁上方輪播
    function swiper() {
      if ($('.mainBanner-slider').length > 0) {
        $('.news-body .mainBanner-slider .swiper-container').swiper4();
        const slider = _common.getMySwiper('detail-banner-slider')
        _common.bannerSlider(slider)
        slider.on('slideChangeTransitionStart', function () {
          _common.bannerSlider(slider)
        })
      }
    }
    swiper()
    //段落編輯器
    $('._articleBlock').article4();
    //影片
    $(data.Container).find('.video-box').video4();
    //回到最上
    $('.news-footer .backTop').anchor4()
    //關閉按鈕dom移動
    function moveCloseBtnDom() {
      const btn = $('.news_detail .close-btn.ajax_close')
      if ($(window).outerWidth() <= 1024) {
        $('.modal-content').prepend(btn)
      } else {
        $('.next-news').prepend(btn)
      }
    }
    moveCloseBtnDom()
    $(window).on('resize', function () {
      moveCloseBtnDom()
    })
    _common.bodyLock('.modal-scroll-wrap')
  },
  //編輯收藏
  editCollect(data) {
    const obj = data.ClickObj
    const optionText = $(obj).parents('.edit').siblings('label').text()
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    $('.naming-area input').val(optionText)
    if ($(window).outerWidth() > 575) {
      $('.step.rename input').focus()
    }
    $('.step.rename .modal-btn.delete').on('click', function () {
      $('.step.rename').fadeOut(300).promise().done(function(){
        $('.step.delete-check').fadeIn(300)
      })
    })
    $('.step.delete-check .modal-btn.no').on('click', function () {
      $('.step.delete-check').fadeOut(300).promise().done(function(){
        $('.step.rename').fadeIn(300)
      })
    })
  },
  //新增編輯
  addCollect(data){
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    if ($(window).outerWidth() > 575) {
      $('.naming-area input').focus()
    }
  },
  //客製化流程指南
  guide(data) {
    _common.ajaxCommon(data)
    function swiper() {
      if ($('.mainBanner-slider').length > 0) {
        $(data.Container).find('.mainBanner-slider .swiper-container').swiper4();
        const slider = _common.getMySwiper('guide-banner-slider')
        _common.bannerSlider(slider)
        slider.on('slideChangeTransitionStart', function () {
          _common.bannerSlider(slider)
        })
      }
    }
    swiper()
    $('._articleBlock').article4();
    $('.modal-dialog .backTop').anchor4()
    $(data.Container).find('.video-box').video4();
    _common.bodyLock('.modal-scroll-wrap')
  },
  //客製化預覽
  preview(data) {
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    $('.modal-dialog .backTop').anchor4()
  },
  //隱私權政策
  privacyPolicy(data) {
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    $('.privacy-lbox .backTop').anchor4()
    $('.modal-dialog .decor-layer').delay4({time: '400',add: 'show'})
    $('.privacy-lbox .backTop').on('inview', function (event, isInView) {
      if (isInView) {
        $('.fixed-left-function').css('opacity', '0')
      }
      else {
        $('.fixed-left-function').css('opacity', '1')
      }
    });
  },
  //聯絡我們
  contactForm(data) {
    _common.ajaxCommon(data)
    $('.confirm').on('click', function () {
      const select = $('.form-wrap .select')
      $('.form input').val('')
      $('.attachment .file-name').removeClass('uploaded').text('File size is mainly below 2MB');
      select.each(function () {
        const defaultText = $(this).attr('data-default')
        $(this).find('.selected .text').text(defaultText)
      })
      $('html,body').animate({ scrollTop: 0 }, { duration: 900, easing: 'easeInOutCirc' });
    })
    _common.bodyLock('.modal-scroll-wrap')
  },
  //帳戶流程類
  accountStep(data) {
    _common.accountCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    //註冊&忘記密碼
    if (data.Container === '.register-lbox' || data.Container === '.forgetps-lbox') {
      $('.bookmark-switch [data-bookmark]').on('click', function () {
        let bookmark = $(this);
        let type = bookmark.attr('data-bookmark');
        bookmark.addClass('active').siblings().removeClass('active');
        bookmark.parents('.bookmark').find('.bookmark-block').each(function (index, el) {
          if ($(el).attr('data-bookmark') == type) $(el).addClass('active').siblings().removeClass('active')
        });
      });
    }
  },
  //更換大頭貼
  changePhoto(data) {
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    const memberPhoto = $('.welcome .member-photo')
    const memberPhotoUrl = memberPhoto.css('background-image')
    $('.member-photo.edit').css('background-image',memberPhotoUrl)

    previewUploadPhoto('.upload-btn input')
    
    $('.member-photo.edit').on('click', function () {
      $('.upload-btn input').click()
    })

    $('.photo-box').on('click', function () {
      const img_url = $(this).css('background-image')
      $('.photo-box').removeClass('no-select').not(this).addClass('no-select')
      $('.member-photo.edit').css('background-image',img_url)
    })

    $('.modal-btn.save').on('click', function () {
      const changeAfterUrl = $('.member-photo.edit').css('background-image')
      const route = $(this).attr('data-ajax-route')
      const container = $(this).attr('data-ajax-container')
      const callback = $(this).attr('data-ajax-callback')
      memberPhoto.css('background-image',changeAfterUrl)
      _common.openAjax(route,container,callback)
    })
  },
  changePhotoSuccess(data) {
    _common.ajaxCommon(data)
    _common.closeAjax('.change-photo-wrap')
    const memberPhoto = $('.welcome .member-photo')
    const memberPhotoUrl = memberPhoto.css('background-image')
    $('.member-photo.success').css('background-image',memberPhotoUrl)
    $('.modal-btn.edit').on('click', function () {
      const route = $(this).attr('data-ajax-route')
      const container = $(this).attr('data-ajax-container')
      const callback = $(this).attr('data-ajax-callback')
      _common.openAjax(route,container,callback)
    })
  },
  //會員條款
  memberRegulation(data) {
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    $('.regulation-wrap .backTop').anchor4()
    $('.modal-dialog .decor-layer').delay4({time: '400',add: 'show'})
    $('.regulation-wrap .backTop').on('inview', function (event, isInView) {
      if (isInView) {
        $('.fixed-left-function').css('opacity', '0')
      }
      else {
        $('.fixed-left-function').css('opacity', '1')
      }
    });
  },
  //GDPR
  gdprLightbox(data) {
    _common.ajaxCommon(data)
    _common.bodyLock('.modal-scroll-wrap')
    $('.modal-btn.confirm').on('click', function () {
      if (!$(`.tab-pane#${data.clickObj}`).is(":visible")) {
        $('.tab-pane').fadeOut(300).promise().done(function () {
          $('.gdpr-menu .tab-btn').removeClass('active')
          $(`.gdpr-menu .tab-btn[data-page="${data.clickObj}"]`).addClass('active')
          $(`.tab-pane#${data.clickObj}`).show()
          $(`.tab-pane#${data.clickObj} .form .form-grid:nth-child(1) input`).focus()
        })
      }
      else {
        $(`.tab-pane#${data.clickObj} .form .form-grid:nth-child(1) input`).focus()
      }
    })
  }
}

//主選單
let _menu = {
  swiper() {
    function changeSlide(slider) {
      let activeSlide
      const swiper = slider.$el ? slider.$el : $(slider)
      const textBox = $('.menu-photo .text-box')
      //如果Swiper沒有啟動
      if (swiper.attr('data-swiper4-active') !== 'on') {
        activeSlide = swiper.find('.swiper-slide')
      }
      else {
        activeSlide = swiper.find('.swiper-slide-active') || swiper.find('.swiper-slide-duplicate-active')
      }
      const line1 = activeSlide.attr('data-line1')
      const line2 = activeSlide.attr('data-line2')

      textBox.addClass('changing')
      setTimeout(function () {
        textBox.find('.text1').text(line1)
        textBox.find('.text2').text(line2)
        textBox.removeClass('changing')
      },500)
    }
    const menuSwiper = _common.getMySwiper('menu-banner')
    changeSlide(menuSwiper)
    menuSwiper.on('slideChangeTransitionStart', function () {
      changeSlide(menuSwiper)
    })
  },
  togglemenu() {
    $('nav .header .menu-switch').on('click', function() {
      $('.menulbox').addClass('open');
      //裝飾動畫
      $('.decor1').delay4({time: '500', add: 'show'})
      $('.decor2').delay4({time: '500', add: 'show'})
      _menu.swiper();
      _common.bodyLock('section.menulbox')
    });
    $('.menulbox .menu-closebtn').on('click', function () {
      //裝飾動畫
      $('.decor1').removeClass('show')
      $('.decor2').removeClass('show')
      $('.menulbox').removeClass('open');
      _common.bodyUnlock(['section.menulbox','.menu-list'])
    });
  },
  listslide() {
    $('.menulbox .menu-list .list > li p').on('click', function() {
      const li = $(this).parent();
      li.siblings().removeClass('active').find('ul:not(.list)').slideUp(300);
      li.addClass('active').find('ul:not(.list)').slideDown(300);
    })
  },
  languageBtn() {
    $('.function-bar .function-btn.language, .fixed-left-function .function-btn.language').on('click', function(e) {
      e.stopPropagation()
      $(this).toggleClass('active');
    });
  },
  all() {
    _menu.togglemenu();
    _menu.listslide();
    _menu.languageBtn();
    $('.menulbox .scroll-wrap').scrollbar({
      ignoreMobile: true
    });
  }
}
//首頁
let _home = {
  swiper() {
    const inspiration_L = _common.getMySwiper('inspiration-left')
    const inspiration_R = _common.getMySwiper('inspiration-right')
    const newsSlider = _common.getMySwiper('home-news-slider')
    inspiration_L.params.autoplay.disableOnInteraction = false
    inspiration_R.params.autoplay.disableOnInteraction = false
    inspiration_L.on('slideNextTransitionStart', function () {
      $(inspiration_L.$el[0]).addClass('swiper-no-swiping').delay4({ time: '400', remove: 'swiper-no-swiping' })
      inspiration_R.slideNext(300, false)
    })
    inspiration_L.on('slidePrevTransitionStart', function () {
      $(inspiration_L.$el[0]).addClass('swiper-no-swiping').delay4({ time: '400', remove: 'swiper-no-swiping' })
      inspiration_R.slidePrev(300, false)
    })
    inspiration_R.on('slideNextTransitionStart', function () {
      $(inspiration_R.$el[0]).addClass('swiper-no-swiping').delay4({time: '400', remove: 'swiper-no-swiping'})
      inspiration_L.slideNext(300, false)
    })
    inspiration_R.on('slidePrevTransitionStart', function () {
      $(inspiration_R.$el[0]).addClass('swiper-no-swiping').delay4({time: '400', remove: 'swiper-no-swiping'})
      inspiration_L.slidePrev(300, false)
    })
    inspiration_L.on('transitionStart', function () {
      this.$el.find('.slide-decor').removeClass('show')
    })
    inspiration_L.on('transitionEnd', function () {
      this.$el.find('.swiper-slide-active .slide-decor').addClass('show')
    })
    
    //首頁最新消息Swiper
    _common.bannerSlider(newsSlider)
    newsSlider.on('slideChangeTransitionStart', function () {
      _common.bannerSlider(newsSlider)
    })
  },
  //探索區塊圖片寬度轉為百分比
  ImgWidthConvert(img) {
    setTimeout(() => {
      //抓到圖片原始尺寸
      const pixel_w = $(img)[0].naturalWidth;
      const percent_w = Math.round(pixel_w / 5.5 * 1000) / 1000 >= 100 ? 100 : Math.round(pixel_w / 5.5 * 1000) / 1000
      $(img).parents('.card').css('width', percent_w + '%')
      $(img).addClass('show')
    },300)
  },
  //關於我們切換
  aboutChange() {
    //全域變數
    let autoplay
    
    //切換
    function changeHandler(index) {
      const li = $('.closeToMing-wrap .about-menu li')
      const large = $('.closeToMing-wrap .large-wrap img')
      const small = $('.closeToMing-wrap .small-wrap .about-info')
      $('.closeToMing-wrap').attr('data-show-index', index)
      li.removeClass('active')
      li.eq(index).addClass('active')
      small.removeClass('show').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        small.hide()
        small.eq(index).show().delay4({time: '300', add: 'show'})
        small.unbind('transitionend webkitTransitionEnd oTransitionEnd')
      });
      setTimeout(function () {
        large.parents('.large-wrap').addClass('leave')
        large.parents('.large-wrap').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        })
        large.fadeOut(800).promise().done(function () {
          large.parents('.large-wrap').removeClass('leave')
        })
        setTimeout(function () {
          large.eq(index).fadeIn(800)
        },400)
      }, 300)
    }
    
    //自動切換
    function autoPlay(time) {
      autoplay = setInterval(() => {
        const nowIndex = Number($('.closeToMing-wrap').attr('data-show-index')) == 2 ? -1 : Number($('.closeToMing-wrap').attr('data-show-index'))
        changeHandler(nowIndex+1)
      }, time);
    }
    // autoPlay(5000)
    
    //點擊切換
    $('.about-menu li').on('click', function () {
      const typeIndex = $(this).index()
      changeHandler(typeIndex)
      clearInterval(autoplay)
      //手動切換間隔2秒後重新開啟自動切換
      setTimeout(() => {
        autoPlay(5000)
      }, 2000);
    })
  },
  inview() {
    $('.left-block .img-box').one('inview', function (event, isInView) {
      if (isInView) {
        if (!$('.left-block .img-box').find('.slide-decor').hasClass('show')) {
          const slideCount = $('.left-block .swiper-slide').length
          if (slideCount > 1) {
            $('.left-block .swiper-slide-active .img-box .slide-decor').delay4({time: '800', add: 'show'})
          }
          else {
            $('.left-block .swiper-slide .img-box .slide-decor').delay4({time: '800', add: 'show'})
          }
        }
      }
    })
    $('.explore-wrap').on('inview', function(event, isInView) {
      if (isInView) {
        $('.explore-decor').addClass('show')
      }
      else {
        $('.explore-decor').removeClass('show')
      }
    });
    $('.title-wrap .section-title').one('inview', function(event, isInView) {
      if (isInView) {
        $(this).addClass('animate')
      }
    });
  },
  all() {
    wordAnimation('.section1 .section-title',0.05,0.05)
    _home.swiper()
    _home.aboutChange()
    _home.inview()
  }
}
//最新消息
let _news = {
  search() {
    $('.news-type .news-search').on('click', function () {
      $('.search_lightbox').fadeIn(300).promise().done(function(){
        $('nav.sticky').hide()
      })
    })
    $('.search_lightbox .close-search').on('click', function () {
      $('.search_lightbox').fadeOut(300).promise().done(function(){
        $('nav.sticky').show()
      })
    })
  },
  swiper(){
    const slider = _common.getMySwiper('top-news-slider')
    _common.bannerSlider(slider)
    slider.on('slideChangeTransitionStart', function () {
      _common.bannerSlider(slider)
    })
  },
  dropdown() {
    _common.dropdown('.search-year')
    $('.type-dropdown .dropdown > ul').scrollbar()
    $('.type-dropdown .selected').on('click', function () {
      $(this).parents('.type-dropdown').toggleClass('active')
      $(this).siblings('.dropdown').stop().slideToggle(400)
    })
    $('.type-dropdown .dropdown ul > li').on('click', function () {
      const option = $(this).text()
      $('.type-dropdown .selected .text').text(option)
      if ($(window).outerWidth() <= 767) {
        $(this).parents('.dropdown').stop().slideUp(400)
      }
    })
  },
  resize() {
    $(window).on('resize', function () {
      if ($('.type-select').hasClass('fixed')) {
        const newsTypePosLeft = $('.news-type').position().left
        $('.type-select').css('left',newsTypePosLeft)
      }
      if ($(window).outerWidth() > 767) {
        $('.type-dropdown .dropdown').attr('style','')
      }
    })
  },
  all(){
    _news.search()
    _news.swiper()
    _news.dropdown()
    _news.resize()
    clickSwitchClass('.type-dropdown ul > li','active')
  }
}
//最新消息搜尋結果頁
let _search_result = {
  all(){
    $('.decor-layer').delay4({time: '400',add: 'show'})
    _common.dropdown('.search-year')
  }
}
//產品總覽
let _product = {
  all() {
    $('.decor-layer').delay4({time: '400',add: 'show'})
  }
}
//產品列表
let _product_list = {
  dropdown() {
    $('.type-dropdown .dropdown > ul').scrollbar()
    $('.type-dropdown .selected').on('click', function (e) {
      e.stopPropagation()
      $(this).parents('.type-dropdown').toggleClass('active')
      $(this).siblings('.dropdown').slideToggle(400)
    })
    $('.type-dropdown .dropdown ul > li').on('click', function () {
      const option = $(this).text()
      $('.type-dropdown .selected .text').text(option)
      if ($(window).outerWidth() <= 767) {
        $(this).parents('.type-dropdown').removeClass('active')
        $(this).parents('.dropdown').slideUp(400)
      }
    })
  },
  filterMenu() {
    const menuHeight = $('.filter-menu ul').innerHeight() + 2
    $('.filter-btn .icon-filter').on('click', function (e) {
      e.stopPropagation()
      if ($(this).parents('.filter-btn').hasClass('open')) {
        $(this).parents('.filter-btn').removeClass('open')
        $(this).siblings('.filter-menu').attr('style','')
      }
      else {
        $(this).parents('.filter-btn').addClass('open')
        $(this).siblings('.filter-menu').css({
          width: '235px',
          height: menuHeight + 'px',
          opacity: '1'
        })
      }
    })
    $('.filter-menu ul li').on('click', function () {
      const option = $(this).text()
      $(this).parents('.filter-btn').removeClass('open')
      $(this).parents('.filter-menu').attr('style','')
      $(this).parents('.filter-btn').siblings('.selected-filter').text(option)
    })
  },
  resize() {
    $(window).on('resize', function () {
      if ($(window).outerWidth() > 767) {
        $('.type-dropdown .dropdown').attr('style','')
      }
    })
  },
  all() {
    _product_list.dropdown()
    _product_list.filterMenu()
    _product_list.resize()
    clickSwitchClass('.type-dropdown ul > li','active')
    $('.decor-layer').delay4({time: '400',add: 'show'})
  }
}
//產品詳細
let _product_detail = {
  share() {
    //分享社群
    $('.option-bar .share').on('click', function (e) {
      e.stopPropagation()
      $(this).toggleClass('open')
      $('.option-bar .collect').removeClass('open')
      $('.collect-category').attr('style', '')
    })
  },
  option() {
    //收藏
    $('.category-wrap ul').scrollbar()
    $('.option-bar .collect').on('click', function (e) {
      const category_h = $('.category-wrap').innerHeight()
      e.stopPropagation()
      if ($(this).hasClass('open')) {
        $(this).removeClass('open')
        $('.collect-category').attr('style', '')
      }
      else {
        $(this).addClass('open')
        $('.collect-category').css({
          'width': '235px',
          'height': category_h,
          'opacity': '1'
        })
      }
    })
    $('.category-wrap li.default-option input').on('click', function (e) {
      if ($('.category-wrap li:not(.default-option)').length > 0) {
        e.preventDefault()
      }
    })
    $('.category-wrap li:not(.default-option) input').on('change',function(){
      if($('.category-wrap li:not(.default-option) input:checked').length >= 1){
        $('.category-wrap li.default-option input').prop('checked',true)
      }
      else if ($('.category-wrap li:not(.default-option) input:checked').length == 0) {
        $('.category-wrap li.default-option input').prop('checked',false)
      }
    })
    $('.category-wrap .bottom-function .confirm').on('click', function () {
      $('.option-bar .collect').removeClass('open')
      $('.collect-category').attr('style', '')
      if($('.category-wrap li input:checked').length >= 1){
        $('.option-bar .collect').addClass('collected')
      }
      else{
        $('.option-bar .collect').removeClass('collected')
      }
    })
    $('.collect-category').on('click', function (e) {
      e.stopPropagation()
    })
    $('.social-share-bar').on('click', function (e) {
      e.stopPropagation()
    })
  },
  imageZoom() {
    const canZoom = $('body').attr('data-zoom') === '1' ? true : false
    const zoomImgW = $('.section1 .block.right').innerWidth() - 30
    const zoomImgH = $('.product-slider .img-box').innerHeight()
    $('.image-detail').css({
      'width': zoomImgW,
      'height': zoomImgH
    })
    if (!fesdDB.is.isMobile4 && canZoom) {
      $('.product-slider .img-box').zoom({
        target: '.image-detail',
        magnify: 1,
      })
    }
  },
  swiper() {
    $('.product-slider .swiper-container').swiper4()
    const productSwiper = _common.getMySwiper('product-swiper')
    $('.product-swiper').on('mouseenter', function () {
      productSwiper.autoplay.stop()
    })
    $('.product-swiper').on('mouseleave', function () {
      productSwiper.autoplay.start()
    })
    if ($('.mainBanner-slider').length > 0) {
      const slider = _common.getMySwiper('detail-banner-slider')
      _common.bannerSlider(slider)
      slider.on('slideChangeTransitionStart', function () {
        _common.bannerSlider(slider)
      })
    }
  },
  //色票收合
  colorCollapse() {
    const colorBox = $('.colorBox')
    let colorWrapWidth = $('.color-wrap').innerWidth()
    let oneLineShow = Math.floor(colorWrapWidth / colorBox.outerWidth(true))
    let totalLine = Math.ceil(colorBox.length / oneLineShow)
    if (totalLine > 1) {
      $('.detail-info .more-btn').addClass('over-oneline')
    }
    else {
      $('.detail-info .more-btn').removeClass('over-oneline')
    }
    $('.detail-info .more-btn').on('click', function () {
      if ($(this).hasClass('open')) {
        $(this).removeClass('open')
        $('.color-wrap').animate({
          'height': 35
        })
      }
      else {
        $(this).addClass('open')
        $('.color-wrap').animate({
          'height': colorBox.outerHeight(true) * totalLine
        })
      }
    })
    $(window).on('resize', function () {
      colorWrapWidth = $('.color-wrap').innerWidth()
      oneLineShow = Math.floor(colorWrapWidth / colorBox.outerWidth(true))
      totalLine = Math.ceil(colorBox.length / oneLineShow)
      if (totalLine > 1) {
        $('.detail-info .more-btn').addClass('over-oneline')
      }
      else {
        $('.detail-info .more-btn').removeClass('over-oneline')
      }
    })
  },
  //選擇單位
  unitSelect() {
    $('.unit-select .arrow-btn').on('click', function () {
      const select = $(this).parents('.unit-select')
      const mask = '<div class="mask" style="position: fixed;top: 0;left: 0;width: 100%;height: 100vh;background-color: rgba(0,0,0,0.6);z-index: 2;"></div>'
      if (select.hasClass('open')) {
        $('body .mask').remove()
        select.removeClass('open')
        _common.bodyUnlock()
      }
      else {
        $('body').prepend(mask)
        select.addClass('open')
        _common.bodyLock()
      }
    })
    $('.unit-radio input').on('change', function () {
      const window_w = $(window).width()
      const item = $(this).parents('.item')
      const smallUnit = $('.unit-select .item[data-index="1"]').attr('data-small-unit')
      const text = $(this).parents('.item').attr('data-text')
      if ($(this).parents('.item').attr('data-index') === '1') {
        $('.notes > li:first-child').hide()
        $('.shop-control .count-wrap .unit').text(smallUnit)
      }
      else {
        $('.notes > li:first-child').show()
        $('.shop-control .count-wrap .unit').text('set')
      }
      if (window_w <= 575) {
        $(this).parents('.item-wrap').append(item)
        $('body .mask').remove()
        $('.unit-select').removeClass('open')
        _common.bodyUnlock()
      }
      $('.notes .tips-box .text span').html(text)
    })
    const window_w = $(window).width()
    if (window_w <= 575) {
      const standard = $('.unit-select .item[data-index="0"]')
      $('.unit-select .item-wrap').append(standard)
    }

    $(window).on('resize', function () {
      const newWidth = $(window).width()
      if (newWidth > 575) {
        const standard = $('.unit-select .item-wrap .item[data-index="0"]')
        $('.unit-select .item-wrap').prepend(standard)
      }
      else {
        if (window_w === newWidth) {
          return false
        }
        const selected = $('.unit-radio input:checked').parents('.item')
        $('.unit-select').removeClass('open')
        $('.unit-select .item-wrap').append(selected)
      }
    })
  },
  addCart() {
    function showTips(el) {
      let text = $('.shop-control .add-order').attr('added-tips')
      let notice = "<div class='notice-wrapper'><div class='text'>" + text + "</div></div>"
      switch (el) {
        case 'nav:not(.sticky)':
          $(`${el} .function-btn.shop`).append(notice)
          $(`${el} .function-btn.shop .notice-wrapper`).fadeIn(300).promise().done(function () {
            setTimeout(() => {
              $(`${el} .function-btn.shop .notice-wrapper`).remove()
            },500)
          })
          break;
        case 'nav.sticky':
          if ($(el).hasClass('show')) {
            $(`${el} .function-btn.shop`).append(notice)
            $(`${el} .function-btn.shop .notice-wrapper`).fadeIn(300).promise().done(function () {
              setTimeout(() => {
                $(`${el} .function-btn.shop .notice-wrapper`).remove()
              },500)
            })
          }
          else {
            $(el).addClass('show')
            setTimeout(() => {
              $(`${el} .function-btn.shop`).append(notice)
              $(`${el} .function-btn.shop .notice-wrapper`).fadeIn(300).promise().done(function () {
                setTimeout(() => {
                  $(`${el} .function-btn.shop .notice-wrapper`).remove()
                },500)
              })
            },400) 
          }
          break;
      }
    }
    $('.shop-control .add-order').on('click', function (e) {
      //1024以上
      if($(window).outerWidth() > 1024){
        //點擊的滑鼠位置
        let mousePosition = {}
        mousePosition.x = e.pageX
        mousePosition.y = e.pageY
        const ball = `<div class="cart-ball" style="top: ${mousePosition.y}px;left: ${mousePosition.x}px"></div>`
        //重新產生新的小球
        $('.cart-ball').remove()
        $('body').append(ball)
        const last = $('.cart-ball')
        // 起始位置元素
        const startPoint = $('.cart-ball')[0]
        // 終點位置元素
        const endPoint = $('.fixed-left-function:not(.innerMenu) .icon-shop')[0]
        const myParabola = funParabola(startPoint, endPoint, {
          speed: 200,// 速度
          curvature: 0.0005,// 拋物線的幅度
          complete: function () {
            last.fadeOut(300)
            $('.function-btn.shop').addClass('has_product')
          }
        });
        myParabola.position().move();
      }
      //768 ~ 1024之間
      else if($(window).outerWidth() > 767 && $(window).outerWidth() <= 1024) {
        $('.function-btn.shop').addClass('has_product')
        showTips('nav.sticky')
      }
      //768以下
      else {
        const scrollTop = $(window).scrollTop()
        const nav_h = $('nav:not(.sticky)').innerHeight() + 200
        $('.function-btn.shop').addClass('has_product')
        if (scrollTop <= nav_h) {
          showTips('nav:not(.sticky)')
        }
        else {
          showTips('nav.sticky')
        }
      }
    })
  },
  recommend() {
    const window_w = $(window).width()
    const slideCounts = $('.recommend-product .swiper-slide').length
    let options = {
      on: {
        init: function () {
          _common.getSlidesCount(this)
        }
      },
      slidesPerView: 1,
      spaceBetween: 0,
      centeredSlides: false,
      autoplay: {
        delay: 5000,
      },
      loop: true,
      lazy: {
        loadPrevNext: true,
      },
      navigation: {
        nextEl: '.slider-arrow-Next.recommend-slider-ID',
        prevEl: '.slider-arrow-Prev.recommend-slider-ID',
      },
      breakpoints: {
        575: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
    }
    const breakpoints = Object.keys(options.breakpoints)
    breakpoints.forEach(function (el) {
      if (window_w >= Number(el) && slideCounts <= options.breakpoints[el].slidesPerView) {
        options.breakpoints[el].slidesPerView = slideCounts;
        options.loop = false;
      }
    })
    const recommend = new Swiper('.recommend-product .swiper-container', options);
  },
  all(){
    _product_detail.share()
    _product_detail.option()
    _product_detail.swiper()
    _product_detail.imageZoom()
    _product_detail.colorCollapse()
    _product_detail.unitSelect()
    _product_detail.addCart()
    _product_detail.recommend()
    _common.countHandler('.shop-control')
    $('._articleBlock').article4();
    $('.video-box').video4();
    //複製網址
    copylink('.social-share-bar .copy_url','Copied')
  }
}
//產品搜尋頁
let _product_search = {
  sidebar() {
    if ($(window).width() <= 991 && !$('main').hasClass('no-sidebar')) {
      _common.bodyLock()
    }
    $(window).on('resize', function () {
      if ($(window).width() <= 991 && !$('main').hasClass('no-sidebar')) {
        _common.bodyLock()
      }
      else {
        bodyScroll.unlock();
      }
    })
    $('.mode-item').on('click', function () {
      const clickIndex = $(this).index()
      const text = $(this).attr('data-text')
      $('.mode-item').removeClass('selected')
      $(this).addClass('selected')
      $('.mode-item').eq(clickIndex).addClass('selected')
      $(this).parents('.function-bar').siblings('.filter-text').text(text)
    })
    $('.search-range').scrollbar()

    $('.sidebar-open').on('click', function () {
      $('main').removeClass('no-sidebar')
      $('.search_sidebar').removeClass('hide')
      $('.product-list').addClass('has-sidebar')
      if ($(window).width() <= 991) {
        _common.bodyLock()
      }
    })

    $('.sidebar-head .close').on('click', function () {
      $('main').addClass('no-sidebar')
      $('.search_sidebar').addClass('hide')
      $('.product-list').removeClass('has-sidebar')
      if ($(window).width() <= 991) {
        _common.bodyUnlock()
      }
    })

    $('.search-catagory').on('click', function () {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active')
        $(this).children('.option-collapse').stop().slideUp(300)
      }
      else {
        $(this).addClass('active')
        $(this).children('.option-collapse').stop().slideDown(300)
      }
    })

    $('.option-list').on('click', function (e) {
      e.stopPropagation()
    })
  },
  search() {
    //如果有輸入關鍵字或是有選擇任何搜尋條件時才執行
    if ($('.keyword-search input').val() != '' || $('.search-catagory input:checked').length >= 1) {
      const selectMode = $('.search_sidebar .mode-item.selected').index()
      $('.function-bar .mode-item').removeClass('selected').eq(selectMode).addClass('selected')
      $('.result-wrap').addClass('search-after')
      $('main').addClass('no-sidebar')
      $('.search_sidebar').addClass('hide')
      $('.product-list').removeClass('has-sidebar')
      if ($(window).width() <= 991) {
        _common.bodyUnlock()
      }
    }
  },
  keywordCollapse() {
    $('.search-keyword-container .scrollbar-inner').scrollbar({
      ignoreMobile: true,
    })
    $('.search-keyword-container .item .remove').on('click', function () {
      $(this).parents('.item').remove()
    })
    $('.collapse-btn').on('click', function () {
      $(this).toggleClass('open')
      $(this).siblings('.content').slideToggle()
    })
  },
  all() {
    clickSwitchClass('.function-bar .mode-item', 'selected')
    _product_search.sidebar()
    _product_search.keywordCollapse()
  }
}
//購物QA
let _qa = {
  slideQA() {
    $('.list-block').off().on('click', function() {
      const block = $(this);
      block.toggleClass('active');
      block.find('.a').slideToggle(300);
    });
  },
  anchorAndSwitchQA() {
    if ($(window).outerWidth() > 1024) {
      $('.type-dropdown .dropdown ul > li').unbind().attr('data-anchor4-active', '').anchor4();
      $('.category-list').attr('style', '')
    }
    else {
      $('.type-dropdown .dropdown > ul').scrollbar()
      $('.type-dropdown .selected').off().on('click', function (e) {
        e.stopPropagation()
        $(this).parents('.type-dropdown').toggleClass('active')
        $(this).siblings('.dropdown').slideToggle(400)
      })
      $('.type-dropdown .dropdown ul > li').off().on('click', function () {
        const option = $(this).text();
        const target = $(this).attr('data-anchor-target');
        $('.type-dropdown .selected .text').text(option)
        if ($(window).outerWidth() <= 1024) {
          $(this).parents('.type-dropdown').removeClass('active')
          $(this).parents('.dropdown').slideUp(400)
          $(target).fadeIn(300).siblings('.category-list').fadeOut(0)
          $('.list-block').removeClass('active')
          $('.list-block').find('.a').slideUp(300)
        }
      })
    }
  },
  resize() {
    $(window).on('resize', function () {
      $('.type-select').attr('style', '')
      if ($(window).innerWidth() > 1024) {
        $('.type-select .dropdown').attr('style', '')
      }
      _qa.slideQA();
      _qa.anchorAndSwitchQA();
    });
  },
  all() {
    _qa.slideQA();
    _qa.anchorAndSwitchQA();
    _qa.resize()
    $('.decor-layer').delay4({time: '400',add: 'show'})
  }
}
//購物車
let _shoppingCart = {
  openCart() {
    if ($('.menulbox').hasClass('open')) {
      $('.menulbox').removeClass('open')
      $('.menulbox').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        _common.bodyLock('.cart-list-wrapper')
        $('.cart-background').fadeIn(300)
        $('.fixed-left-function').addClass('cart-open')
        $('.menulbox').unbind('transitionend webkitTransitionEnd oTransitionEnd')
      })
    }
    else {
      _common.bodyLock('.cart-list-wrapper')
      $('.cart-background').fadeIn(300)
      $('.fixed-left-function').addClass('cart-open')
    }
  },
  switch() {
    $('.close-cart').on('click', function (e) {
      e.stopPropagation()
      bodyScroll.unlock();
      $('.cart-background').fadeOut(300)
      $('.fixed-left-function').removeClass('cart-open')
    })
    $('.cart-wrapper').on('click', function (e) {
      e.stopPropagation()
    })
  },
  scrollbar() {
    $('.cart-list-wrapper').scrollbar({
      ignoreMobile: true,
    })
  },
  productSelect() {
    $('.select-all .all-checkbox input').on('change', function () {
      if ($(this).prop('checked') == true) {
        $('.product-checkbox input').prop('checked',true)
      }
      else {
        $('.product-checkbox input').prop('checked',false)
      }
    })
    $('.product-checkbox input').on('change', function () {
      if ($(this).prop('checked') == false) {
        $('.select-all .all-checkbox input').prop('checked',false)
      }
      else {
        if ($('.product-checkbox input:not(:checked)').length <= 0) {
          $('.select-all .all-checkbox input').prop('checked',true)
        }
      }
    })
  },
  checkout() {
    $('.cart-wrapper').on('click', '.next-step', function () {
      if ($(this).parents('.cart-wrapper').hasClass('empty')) {
        return false
      }
      const href = $(this).attr('data-href')
      const route = $(this).attr('data-ajax-route')
      const container = $(this).attr('data-ajax-container')
      const callback = $(this).attr('data-ajax-callback')
      if ($('.cart-middle .product-checkbox input:checked').length <= 0) {
        _common.openAjax(route,container,callback)
      }
      else {
        window.location.href = href
      }
    })
  },
  all() {
    _shoppingCart.switch()
    _shoppingCart.scrollbar()
    _shoppingCart.productSelect()
    _shoppingCart.checkout()
    _common.countHandler('.cart-wrapper')
  }
}
//結帳流程
let _checkout = {
  stepChange(type) {
    if ($('.step-content.step1').hasClass('empty')) return
    const nowStepIndex = $('.step-wrap li.active').index() + 1
    const stepTotal = $('.content .step-wrap > li').length
    const prevStepName = function () {
      const prevStep = $('.step-wrap li.active').prev('li')
      const leaveCheck = $('.step-change.prev').attr('data-leave-text')
      if (prevStep.find('.text .line1').length > 0) {
        if (prevStep.index() != 2) {
          return prevStep.find('.text .line1').text()
        }
        else {
          if ($('.step-content.step3 .nav-tabs .tab-btn[data-page="form"]').hasClass('active') || $('.non-payable-block').length > 0) {
            const text = $('.footer .step-change.prev').attr('data-form-text')
            return text
          }
          else if ($('.step-content.step3 .nav-tabs .tab-btn[data-page="payment"]').hasClass('active')) {
            const text = $('.footer .step-change.prev').attr('data-pay-text')
            return text
          }
        }
      }
      else {
        return leaveCheck
      }
    }
    const nextStepName = function () {
      const nextStep = $('.step-wrap li.active').next('li')
      if (nextStep.find('.text .line1').length > 0) {
        return nextStep.find('.text .line1').text()
      }
      else {
        if ($('.step-content.step3 .nav-tabs .tab-btn[data-page="form"]').hasClass('active') || $('.non-payable-block').length > 0) {
          const text = $('.footer .step-change.next').attr('data-form-text')
          return text
        }
        else if ($('.step-content.step3 .nav-tabs .tab-btn[data-page="payment"]').hasClass('active')) {
          const text = $('.footer .step-change.next').attr('data-pay-text')
          return text
        }
      }
    }

    //判斷是數字還是字串
    if (typeof(type) == 'number') {
      let stepNum
      if (type <= 1) {
        stepNum = 1
      }
      else if (type >= stepTotal) {
        stepNum = stepTotal
      }
      else {
        stepNum = type
      }
      if (!$(`.step-content.step${stepNum}`).is(":visible")) {
        $('.step-wrap li').removeClass('active')
        $('.step-wrap li:nth-child(' + stepNum + ')').addClass('active')
        $('.step-content').fadeOut(300).promise().done(function () {
          $('html,body').animate({ scrollTop: 0 }, { duration: 900, easing: 'easeInOutCirc' });
          $(`.step-content.step${stepNum}`).fadeIn(300)
          $('main').attr('data-step', stepNum)
          $('.footer .step-change.prev .step-text').text(prevStepName())
          $('.footer .step-change.next .step-text').text(nextStepName())
          if ($('main').attr('data-step') == "3") {
            if (!$('.step-content.step3 .type-select .item').hasClass('active') && $('.non-payable-block').length <= 0) {
              $('.footer .step-change.next .step-btn').addClass('disabled')
            }
          }
          else {
            $('.footer .step-change.next .step-btn').removeClass('disabled')
          }
        })
      }
    }
    else if (typeof(type) == 'string') {
      const prevStepNum = nowStepIndex - 1 < 1 ? nowStepIndex : nowStepIndex - 1
      const nextStepNum = nowStepIndex + 1 > stepTotal ? nowStepIndex : nowStepIndex + 1
      switch (type) {
        case 'prev':
          if (!$(`.step-content.step${prevStepNum}`).is(":visible")) {
            $('.step-wrap li').removeClass('active')
            $('.step-wrap li:nth-child(' + prevStepNum + ')').addClass('active')
            $('.step-content').fadeOut(300).promise().done(function () {
              $('html,body').animate({ scrollTop: 0 }, { duration: 900, easing: 'easeInOutCirc' });
              $(`.step-content.step${prevStepNum}`).fadeIn(300)
              $('main').attr('data-step', prevStepNum)
              $('.footer .step-change.prev .step-text').text(prevStepName())
              $('.footer .step-change.next .step-text').text(nextStepName())
              if ($('main').attr('data-step') == "3") {
                if (!$('.step-content.step3 .type-select .item').hasClass('active') && $('.non-payable-block').length <= 0) {
                  $('.footer .step-change.next .step-btn').addClass('disabled')
                }
              }
              else {
                $('.footer .step-change.next .step-btn').removeClass('disabled')
              }
            })
          }
          break;
        case 'next':
          if (!$(`.step-content.step${nextStepNum}`).is(":visible")) {
            $('.step-wrap li').removeClass('active')
            $('.step-wrap li:nth-child(' + nextStepNum + ')').addClass('active')
            $('.step-content').fadeOut(300).promise().done(function () {
              $('html,body').animate({ scrollTop: 0 }, { duration: 900, easing: 'easeInOutCirc' });
              $(`.step-content.step${nextStepNum}`).fadeIn(300)
              $('main').attr('data-step', nextStepNum)
              $('.footer .step-change.prev .step-text').text(prevStepName())
              $('.footer .step-change.next .step-text').text(nextStepName())
              if ($('main').attr('data-step') == "3") {
                if (!$('.step-content.step3 .type-select .item').hasClass('active') && $('.non-payable-block').length <= 0) {
                  $('.footer .step-change.next .step-btn').addClass('disabled')
                }
              }
              else {
                $('.footer .step-change.next .step-btn').removeClass('disabled')
              }
            })
          }
          break;
      }
    }
  },
  form() {
    //選擇運輸方式
    $('.shipping-select .item').on('click', function () {
      const selected = $(this).attr('data-page')
      $('.step-content.step4 .step-section.step2').attr('data-select',selected)
    })
    //選擇付款或表單
    $('.type-select .item').on('click', function () {
      const selected = $(this).attr('data-page')
      const selectedPayment = $('.payment-select .item.active').attr('data-page')
      $('.footer .step-change.next .step-btn').removeClass('disabled')
      $.anchor4({
        target: '.tab-content#type-tabs',
        // container: '.main-wrapper[data-fake-body=""]',
      });
      if (selected == 'payment') {
        $('.step-content.step4 .step-section.step3').attr('data-select', selectedPayment)
      }
      else {
        $('.step-content.step4 .step-section.step3').attr('data-select', selected)
      }
    })
    //選擇信用卡或paypal
    $('.payment-select .item').on('click', function () {
      const selected = $(this).attr('data-page')
      $('.step-content.step4 .step-section.step3').attr('data-select', selected)
    })
    $('.region-select li').on('click', function () {
      $(this).parents('.tab-pane').find('.form-extra-description').fadeIn(300)
    })
    $('.remark-content textarea').scrollbar()
  },
  confirm() {
    const $number = $('.enter-amount')
    const $max = $('.payment-group .max .btn.btn-gold')
    const max = $number.attr('max')
    const $min = $('.payment-group .min .btn.btn-gold')
    const min = $number.attr('min')

    $max.on('click', function() {
      $number.val(max)
    })
    $min.on('click', function() {
      $number.val(min)
    })
  },
  qrcode() {
    const $qrcode = $('#qrcdoe')
    $('.btn.btn-black.qrcode').on('click', function() {
      if (!$qrcode.find('canvas').length) {
        $qrcode.qrcode(window.location.href)
      }
      $qrcode.addClass('open')
      $qrcode.off().on('click', function() {
        $(this).removeClass('open')
      })
    })
  },
  all() {
    _common.countHandler('.all-wrapper')
    _common.dropdown('.form-group .select-element')
    _checkout.form()
  }
}
//關於總覽
let _about = {
  all() {
    $('.decor-layer').delay4({time: '400',add: 'show'})
  }
}
//歷史沿革
let _about_history = {
  animate() {
    $('.top-motorcycle').playKeyframe(
      [
        'motorcycle1 6s ease-in',
        'motorcycle2 3s linear infinite',
      ],
    );
    $('.footer').one('inview', function (event, isInView) {
      if (isInView) {
        $('.bottom-motorcycle').playKeyframe(
          [
            'motorcycle1 6s ease-in',
            'motorcycle2 3s linear infinite',
          ],
        );
        setTimeout(function () {
          $('.bottom-motorcycle').addClass('reverse').playKeyframe(
            'motorcycle3 4s ease-in forwards',
          );
        },6000)
      }
    })
  },
  all() {
    _about_history.animate()
  }
}
//門市據點
let _about_location = {
  map() {
    $('.marker-wrap .custom-mark').on('mouseenter', function () {
      const place = $(this).attr('data-place')
      if (!$(`.location-info-wrap .location-info#${place}`).is(":visible")) {
        $('.location-info-wrap .location-info').fadeOut(300).promise().done(function () {
          $(`.location-info-wrap .location-info#${place}`).fadeIn(300)
        })
      }
    })
    $('.marker-wrap .custom-mark').on('click', function () {
      const place = $(this).attr('data-place')
      $(`.location-info-wrap .location-info#${place} .address a`).click()
    })
  },
  all() {
    _about_location.map()
  }
}
//關於共用
let _about_common = {
  swiper() {
    if ($('.mainBanner-slider').length > 0) {
      const slider = _common.getMySwiper('detail-banner-slider')
      _common.bannerSlider(slider)
      slider.on('slideChangeTransitionStart', function () {
        _common.bannerSlider(slider)
      })
    }
  },
  all() {
    _about_common.swiper()
    $('._articleBlock').article4();
    $('.video-box').video4();
  }
}
//聯絡我們
let _contact = {
  upload() {
    $('.form-group.attachment input[type="file"]').on('change', function () {
      const file = this.files[0];
      const name = file.name;
      if (!/image\/\w+/.test(file.type)) {
        alert('請上傳圖片');
        return false;
      }
      if (file.size > 2*1024*1024) {
        alert('請選擇小於' + 2 + 'M的圖片');
        return false;
      }
      $('.form-group.attachment .file-name').addClass('uploaded').text(name);
    })
  },
  resetForm() {
    $('.reset').on('click', function () {
      const select = $('.form-group .select-element')
      $('.checkbox input').prop("checked", false)
      $('.form input').val('')
      $('.form textarea').val('')
      $('.form-group.attachment .file-name').removeClass('uploaded').text('File size is mainly below 2MB');
      select.each(function () {
        const defaultText = $(this).attr('data-default')
        $(this).find('.selected .text').text(defaultText)
      })
    })
  },
  all() {
    _contact.upload();
    _contact.resetForm();
    $('textarea.scrollbar-inner').scrollbar({
      ignoreMobile: true
    });
    $('.decor-layer').delay4({time: '400',add: 'show'})
    //表單下拉選單
    _common.dropdown('.form-group .select-element')
  }
}
//會員登入
let _login = {
  all() {
    $('.decor-layer').delay4({time: '400',add: 'show'})
  }
}
//會員中心
let _member = {
  changeWelcomeBG() {
    const el = $('.welcome')
    const desktopSrc = el.attr('data-desktop')
    const mobileSrc = el.attr('data-mobile')
    if ($(window).width() > 575) {
      el.css('background-image',`url("${desktopSrc}")`)
    }
    else {
      el.css('background-image',`url("${mobileSrc}")`)
    }
  },
  getToday() {
    let today = new Date();
    const month = moment(today).format("MMM")
    const day = moment(today).format("Do")
    const year = moment(today).format("YY")
    $('.today .month').text(month)
    $('.today .day').text(day)
    $('.today .year').text(year)
  },
  dropdown() {
    _common.dropdown('.categories-select')
    $('.category-wrap ul > li .edit a').on('click', function (e) {
      e.stopPropagation()
    })
    $('#favorite .filter-type-select .dropdown ul > li').on('click', function () {
      const anotherSelect = $(this).parents('.item').siblings('.item')
      const anotherSelectDefault = anotherSelect.find('.categories-select').attr('data-default')
      $('#favorite .filter-type-select .item').removeClass('active')
      $(this).parents('.item').addClass('active')
      anotherSelect.find('.categories-select .selected .text').text(anotherSelectDefault)
    })
  },
  //收藏篩選類別切換
  filterSwitch() {
    $('.mobile-filter-tabs > li').on('click', function () {
      $('.mobile-filter-tabs > li').removeClass('active')
      $(this).addClass('active')
      $('.filter-type-select .item').removeClass('active')
      if ($(this).hasClass('filter-product')) {
        $('.filter-type-select .item.product').addClass('active')
      }
      else if ($(this).hasClass('filter-collect')) {
        $('.filter-type-select .item.collect').addClass('active')
      }
    })
  },
  //訂單收合
  collapse() {
    $('.table-wrap .td.collapse-btn').on('click', function () {
      const _click = $(this)
      if (_click.parents('.tr').hasClass('open')) {
        _click.parents('.tr').removeClass('open')
      }
      else {
        _click.parents('.tr').addClass('open')
      }
    })
  },
  resize() {
    $(window).on('resize', function () {
      _member.changeWelcomeBG()
    })
  },
  all() {
    _member.changeWelcomeBG()
    _member.getToday()
    _member.dropdown()
    _member.filterSwitch()
    _member.collapse()
    _member.resize()
  }
}
//訂單明細
let _orderlist = {
  all() {
    const activeTab = $('.order-content-tab > li.active').attr('data-page')
    $('.orderlist-header').attr('data-now-tab',activeTab)
    $('.order-content-tab > li').on('click', function () {
      const tab = $(this).attr('data-page')
      $('.orderlist-header').attr('data-now-tab',tab)
    })
    $('.decor-layer').delay4({time: '400',add: 'show'})
  }
}
//GDPR
let _gdpr = {
  switchStatus() {
    $('.gdpr-menu > li .switch-input').on('click', function () {
      const gdprOption = $(this).parents('li').attr('class')
      const route1 = $(this).attr('data-ajax-route')
      const route2 = $(this).attr('data-ajax-route2')
      if ($(`.tab-pane#${gdprOption} .step-wrap`).attr('data-now-step') == 1) {
        _common.openAjax(route1, '.remind-lbox', '_ajaxCallback.gdprLightbox',gdprOption)
      }
      switch (gdprOption) {
        case 'backup':
          if ($('.tab-pane#backup .step-wrap').attr('data-now-step') == 2 && $('.tab-pane#backup .progress-bar').attr('data-day') != 7) {
            _common.openAjax(route2, '.remind-lbox', '_ajaxCallback.gdprLightbox')
          }
          break;
        case 'delete':
          if ($('.tab-pane#delete .step-wrap').attr('data-now-step') == 2 && $('.tab-pane#delete .progress-bar').attr('data-day') <= 14) {
            _common.openAjax(route2, '.remind-lbox', '_ajaxCallback.gdprLightbox')
          }
          break;
        case 'block':
          if ($('.tab-pane#block .step-wrap').attr('data-now-step') == 2) {
            _common.openAjax(route2, '.remind-lbox', '_ajaxCallback.gdprLightbox')
          }
          break;
      }
    })
  },
  showNowStep() {
    $('.step-wrap').each(function () {
      const nowStep = $(this).attr('data-now-step')
      $(this).find(`.step-content.step${nowStep}`).show()
    })
  },
  stepChange(tab,step) {
    $(`.tab-pane#${tab} .step-wrap .step-content`).fadeOut(300).promise().done(function () {
      $(`.tab-pane#${tab} .step-wrap .step-content.step${step}`).show()
      $(`.tab-pane#${tab} .step-wrap`).attr('data-now-step', step)
      if ($(`.tab-pane#${tab} .step-wrap`).attr('data-now-step') == 1) {
        $(`.gdpr-menu > li.${tab} input[type="checkbox"]`).prop("checked", false);
      }
      else if ($(`.tab-pane#${tab} .step-wrap`).attr('data-now-step') == 2) {
        $(`.gdpr-menu > li.${tab} input[type="checkbox"]`).prop("checked", true);
      }
    })
  },
  all() {
    $('.decor-layer').delay4({ time: '400', add: 'show' })
    _gdpr.switchStatus()
    _gdpr.showNowStep()
  }
}

//客製化
let _customized = {
  dropdown() {
    _common.dropdown('.categories-select')
    $('.category-wrap ul > li .edit a').on('click', function (e) {
      e.stopPropagation()
    })
    $('.favorite-block .filter-type-select .dropdown ul > li').on('click', function () {
      const anotherSelect = $(this).parents('.item').siblings('.item')
      const anotherSelectDefault = anotherSelect.find('.categories-select').attr('data-default')
      $('.favorite-block .filter-type-select .item').removeClass('active')
      $(this).parents('.item').addClass('active')
      anotherSelect.find('.categories-select .selected .text').text(anotherSelectDefault)
    })
  },
  //收藏篩選類別切換
  filterSwitch() {
    $('.mobile-filter-tabs > li').on('click', function () {
      $('.mobile-filter-tabs > li').removeClass('active')
      $(this).addClass('active')
      $('.filter-type-select .item').removeClass('active')
      if ($(this).hasClass('filter-product')) {
        $('.filter-type-select .item.product').addClass('active')
      }
      else if ($(this).hasClass('filter-collect')) {
        $('.filter-type-select .item.collect').addClass('active')
      }
    })
  },
  //備註表單開關
  remarkSwitch() {
    $('.function-bar .remark').on('click', function () {
      const window_w = $(window).outerWidth()
      if ($('.all-wrapper').hasClass('extend') || window_w < 1366) {
        $('.other-wrap').addClass('overlay').css('z-index', '5')
        $('.other-wrap .block').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
          $('.close-remark').css('z-index', '6')
          $('.other-wrap .block').unbind('transitionend webkitTransitionEnd oTransitionEnd')
        })
      }
    })
    $('.close-remark').on('click', function () {
      $('.other-wrap').removeClass('overlay')
      $('.other-wrap .block').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        $('.close-remark').css('z-index', '')
        $('.other-wrap').css('z-index','')
        $('.other-wrap .block').unbind('transitionend webkitTransitionEnd oTransitionEnd')
      })
    })
    $('.close-favorite').on('click', function () {
      $('.other-wrap').removeClass('overlay')
      $('.favorite-block').fadeOut(300).promise().done(function () {
        $('.remark-block').show()
        $('.select-background .select-from > div').show()
        $('.select-background .back-btn').show()
        $('.other-wrap').removeClass('overlay select-product')
        $('.other-wrap .block').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
          $('.close-favorite').css('z-index', '')
          $('.other-wrap').css('z-index','')
          $('.other-wrap .block').unbind('transitionend webkitTransitionEnd oTransitionEnd')
        })
      })
    })
  },
  remarkForm() {
    $('label.checkbox input').on('change', function () {
      const checkStatus = $(this).prop('checked')
      if (checkStatus == true) {
        if ($(this).parents().hasClass('cancel-option')) {
          $(this).parents('.cancel-option').siblings('.option').find('input[type="checkbox"]').prop('checked', false)
          $(this).parents('.cancel-option').siblings('.option').find('input[type="text"]').val('')
        }
        else {
          $(this).parents('.option').siblings('.cancel-option').find('input[type="checkbox"]').prop('checked', false)
          $(this).parents('.checkbox').siblings('input[type="text"]').focus()
        }
      }
      else {
        $(this).parents('.checkbox').siblings('input[type="text"]').val('')
      }
    })
    $('.option-group input[type="text"]').on('keyup', function () {
      if ($(this).val().trim() != '') {
        $(this).removeClass('error')
        $(this).siblings('.checkbox').find('input[type="checkbox"]').prop('checked', true)
      }
      else {
        $(this).siblings('.checkbox').find('input[type="checkbox"]').prop('checked', false)
      }
    })
  },
  mobileMenuSwitch() {
    $('.menu-btn').on('click', function () {
      $('.menu-mask').fadeIn(200)
      $('.customized-nav').css('display', 'flex').hide().fadeIn(300)
    })
    $('.close-menu').on('click', function () {
      $('.menu-mask').fadeOut(400)
      $('.customized-nav').fadeOut(300).promise().done(function () {
        $('.customized-nav').attr('style','')
      })
    })
  },
  skipGuide() {
    $('.skip-btn').on('click', function () {
      $('body').removeClass('show-tips')
    })
  },
  canvasToImg() {
    $('.function-bar').on('click','.preview', function () {
      let gate = 0;
      const route = $(this).attr('data-ajax-route')
      const container = $(this).attr('data-ajax-container')
      const callback = $(this).attr('data-ajax-callback')
      $('.option-group .checkbox input:checked').parents('.checkbox').siblings('input[type="text"]').each(function (index, el) {
        if ($(el).val() == '') {
          alert('目前尚有欄位未填寫')
          $(el).addClass('error')
          return false
        }
        else {
          gate += 1;
        }
      })
      if (gate == $('.option-group .checkbox input:checked').length) {
        imgBase64 = []
        _common.openAjax(route,container,callback)
      }
    })
  },
  complete() {
    $('.drawing-paper.paper-initialize').each(function (index,el) {
      const page = $(el).attr('data-page')
      customizedCanvas[page].canvas.viewportTransform = [1,0,0,1,0,0]
      customizedCanvas[page].cursorCanvas.viewportTransform = [1,0,0,1,0,0]
      customizedCanvas[page].canvas.renderAll()
      customizedCanvas[page].cursorCanvas.renderAll()
      imgBase64.push(customizedCanvas[page].canvas.toDataURL("image/jpeg", 1))
    })
  },
  all() {
    _customized.dropdown()
    _customized.filterSwitch()
    _customized.remarkSwitch()
    _customized.remarkForm()
    _customized.mobileMenuSwitch()
    _customized.skipGuide()
    _customized.canvasToImg()
  }
}

//頁面讀取完執行
let readyFunction = {
  checkFunction() {
    //擷取body的data-page
    const functionName = $('body').attr('data-page');
    //呼叫共用function
    readyFunction.common(functionName);
    //呼叫函數( 如果 data-page = home 輸出的結果為 readyFunction.home(); )
    if (functionName !== undefined) {
      eval("readyFunction." + functionName + "();");
    }
  },

  //呼叫共用function
  common(pagename) {
    console.log(`Now page is ${pagename}!`)
    //iOS 回上一頁空白修正
    appleDebug()
    //iOS 100vh 修正
    fixMobile100vh()
    // 第一次顯示時間
    // 30秒後顯示登入提醒視窗
    _common.remindLogin()
    //點擊空白處
    _common.clickBlank(pagename)
    //卷軸控制
    _common.scrollbarController(pagename)
    //初始化Blazy
    _common.blazyInit(pagename)
    //動畫
    _common.keyframes()
    _common.animateInview()
    //頁籤相關
    _common.tabActiveShow()
    _common.switchTabs()
    //footer進入畫面時
    _common.footerInview()
    //主選單
    _menu.all()
    //購物車
    _shoppingCart.all()
    //啟動Swiper
    $('.swiper-container:not(.recommend-swiper)').swiper4()
    $('.backTop').anchor4()
    $('.ajax_open').ajax4()
  },

  //呼叫各頁面function
  
  home() {
    _home.all()
  },
  //最新消息
  news(){
    _news.all()
  },
  search_result(){
    _search_result.all()
  },
  //產品
  product() {
    _product.all()
  },
  product_list() {
    _product_list.all()
  },
  product_detail() {
    _product_detail.all()
  },
  product_search() {
    _product_search.all()
  },
  //關於
  about() {
    _about.all()
  },
  about_fabric() {
    _about_common.all()
  },
  about_feature() {
    _about_common.all()
  },
  about_history() {
    _about_history.all()
  },
  about_location() {
    _about_location.all()
  },
  //聯絡我們
  contact() {
    _contact.all()
  },
  //會員中心
  login() {
    _login.all()
  },
  member() {
    _member.all()
  },
  orderlist() {
    _orderlist.all()
  },
  gdpr() {
    _gdpr.all()
  },
  //購物
  qa() {
    _qa.all();
  },
  checkout() {
    _checkout.all();
  },
  checkout_result() {
    
  },
  checkout_confirm() {
    _checkout.confirm()
    _checkout.qrcode()
  },
  customized() {
    _customized.all()
  },
}

$(document).ready(function(){
  readyFunction.checkFunction();
})