//IOS 回上一頁空白修正
function appleDebug() {
  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };
}

// 點擊開關class
// clickToggleClass(點擊目標,加上cls名稱)
function clickToggleClass(target, className) {
  $(target).on('click', function () {
    $(this).toggleClass(className);
  })
}

// 點擊切換active
// clickSwitchClass(點擊目標,加上cls名稱)
function clickSwitchClass(target, className) {
  $(target).on('click', function () {
    $(target).not(this).removeClass(className);
    $(this).addClass(className);
  })
}

// 驗證碼
// 搭配以下結構使用
// .verification-wrap(data-verify-code="")
//   input(type="number" maxlength="1")
//   input(type="number" maxlength="1")
//   input(type="number" maxlength="1")
//   input(type="number" maxlength="1")
//   input(type="number" maxlength="1")
//   input(type="number" maxlength="1")
function verificationInput() {
  let codeArray = [];
  let reducer = (accumulator, currentValue) => `${accumulator}` + `${currentValue}`;
  let clear = 0
  $('.verification-wrap input').val('')
  $('.verification-wrap input:first-child').focus();
  $(".verification-wrap input").each(function () {
    $(this).on('input', function (e) {
      let input = $(this);
      let typeNum = e.target.value.substr(e.target.value.length - 1);
      let onlyNumber = e.target.value.replace(/[^0-9\.-]/g, '') !== '';
      e.preventDefault()
      //如果輸入為數字
      if (onlyNumber) {
        input.val('').val(typeNum);
        codeArray.splice(input.index(), 1, typeNum);
        input.parents('.verification-wrap').attr('data-verify-code', codeArray.reduce(reducer));
        input.next().focus();
        clear = 0;
      } else {
        input.val('');
      }
    })
    $(this).keyup(function (e) {
      let input = $(this);
      let is_clear = e.key === "Backspace" || e.key === "Delete";
      if (is_clear) {
        e.preventDefault();
        if (clear == 0) {
          input.val('');
          clear += 1;
        } else if (clear == 1) {
          input.prev().focus();
          clear = 0;
        }
      }
    })
  });
}
//驗證碼貼上
function verificationPaste() {
  $('form .verification-wrap input').on('paste', function (event) {
    let paste = event.originalEvent.clipboardData.getData('text');
    let vm = $(this);
    let firstInput = $('form .verification-wrap input').eq(0);
    vm.on('change', function () {
      firstInput.val('');
      $('form .verification-wrap input').each(function (index, ele) {
        $(ele).val(paste.split('')[index]);
      });
    });
  });
}

// 倒數計時
// 搭配以下結構使用
// .countdown(data-seconds="600")  data-seconds 填入欲倒數秒數
let interval
function countDown() {
  clearInterval(interval);
  $('.sms input').val('')
  $('.countdown').siblings('.resend').removeClass('active');
  var set_seconds = Number($('.countdown').attr('data-seconds'));
  var set_time = new Date(set_seconds * 1000).toISOString().substring(14, 19);
  $('.countdown').html('(' + set_time + ')');
  interval = setInterval(function () {
  --set_seconds;
  set_time = new Date(set_seconds * 1000).toISOString().substring(14, 19);
  $('.countdown').html('(' + set_time + ')');
  if (set_seconds == 0) {
    clearInterval(interval);
    $('.countdown').siblings('.resend').addClass('active');
  } 
  }, 1000);
}

// 複製網址
// el => 點擊的對象
// text => 想要顯示的文字
// 使用範例 common.copylink('.xxx','Copied 您已成功複製連結')
// css在 sass/base/_common 要改樣式可以進去改
function copylink(el, text) {
  let notice = "<div class='notice-wrapper'><div class='text'>" + text + "</div><input id='clipboard' type='text' disabled readonly></div>"
  $(el).on('click', function () {
    $('body').append(notice)
    if ($(notice).length > 0) {
      let url = window.location.href
      let clipboard = $('#clipboard')
      let offset = $(this).offset()
      let elWidth = $(this).innerWidth() / 2
      $('.notice-wrapper').css({
        'top': offset.top,
        'left': offset.left + elWidth,
      }).show()
      clipboard.val(url);
      clipboard[0].setSelectionRange(0, 9999);
      clipboard.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        $('.notice-wrapper .text').fadeIn(300).promise().done(function () {
          setTimeout(function () {
            $('.notice-wrapper .text').fadeOut(300).promise().done(function () {
              $('.notice-wrapper').remove()
            })
          }, 1500)
        });
      }
    }
  })
}

//去除浮點數
function removeFP(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

//小數點四捨五入
function roundDecimal(val, precision) {
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

//RGB轉Hex
function RGBToHex(rgb) {
  var color_code = rgb.substring(4, rgb.length-1).replace(/ /g, '').split(',');
  var r = Number(color_code[0]).toString(16)
  var g = Number(color_code[1]).toString(16)
  var b = Number(color_code[2]).toString(16)

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

//判斷手機作業系統
function deviceDetect() {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return 'android'
  }
  if (isiOS) {
    return 'iOS'
  }
}

//抓到transform的值
function getTransformValue(el,key){
  const transform = {}
  const matrix = $(el)[0].style.transform
  const transform_val = matrix.match(/-?[\d\.]+/g);
  transform.scale = Number(transform_val[0])
  transform.translateX = Number(transform_val[1])
  transform.translateY = Number(transform_val[2])
  return transform
}

function fixMobile100vh() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px')
  $(window).on('resize', function () {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px')
  })
}

function wordAnimation(target, delayStartTime, delaySpace) {
  let word = $(target).html()
  let removeBr = word.split('<br>')
  $(target).text('')
  $(removeBr).each(function () {
    let html = this.replace(/&amp;|&/gi, '＆').split('');
    $(html).each(function () {
      if (this.trim() == '') $(target).append('<span class="letter">&nbsp;</span>');
      if (this.trim() == '＆') $(target).append('<span class="letter">&amp;</span>');
      else $(target).append('<span class="letter"> '+ this +' </span>');
    })
    $(target).find("span").each(function () {
      let i = $(this).index()
      let delayTime = i * delaySpace + delayStartTime + "s"
      $(this).css("transition-delay", delayTime);
    });
    $(target).append('<br>')
  })
};

//會員照片上傳即時預覽
//傳要上傳的input進去
function previewUploadPhoto(input) {
  $(input).change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('.member-photo.edit').css('background-image','url('+ e.target.result +')')
      }
      reader.readAsDataURL(this.files[0]);
    }
  });
}