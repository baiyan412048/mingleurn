///////////////////////////////////////
//            轉場href判斷           //
///////////////////////////////////////

$('a:not(.nocg)').click(function(e) {
    e.preventDefault();
    var thisTarget = $(this).attr("target");
    var aHref = $(this).attr("href");
    // 本地
    var x = window.location.pathname.replace("http://","")
    var xArr = x.split("/");
        xArr = lastArr(xArr)
    // 連結
    var href = $(this).attr("href");
    var y = this.href.replace("http://","")
    var yArr = y.split("/");
        yArr = lastArr(yArr);
    function lastArr(arr) {
        var last = arr.pop()
        if (last.indexOf("#") > -1) {
            arr.push(last)
        } else if (last.indexOf("html") > 0) {
            arr.push(last)
        } else if (last == "") {
            arr.push('index.html')
        } else {
            arr.push(last)
            arr.push('index.html')
        }
        return arr
    }
    if (thisTarget == "_blank" || e.ctrlKey||e.metaKey) {
        window.open(aHref);
    } else if (y.indexOf('jpg') > -1 || y.indexOf('javascript') > -1) {
        //啥事都不幹
    } else if (y.indexOf("#") > -1) {
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({ scrollTop: target.offset().top }, { duration: 900, easing: 'easeInOutCirc' });
        }
    } else if (xArr.length == yArr.length && xArr[xArr.length - 1] == yArr[yArr.length - 1] && xArr[xArr.length - 2] == yArr[yArr.length - 2] && xArr[xArr.length - 3] == yArr[yArr.length - 3]) {
        //自己那頁 啥事都不幹
    } else {
        randonAnimte(href);
    }
})


function randonAnimte(href){
    var i = Math.floor(Math.random() * Math.floor(4)) + 1;
    switch (1) {
        case 1:
            pagechange.CG_A(href)
            break;
        case 2:
            pagechange.CG_B(href)
            break;
        case 3:
            pagechange.CG_C(href)
            break;
        case 4:
            pagechange.CG_D(href)
            break;
        default:
            break;
    }
}


var pagechange = {
    CG_A: function(href) {
        $("html,body").delay(100).animate({ opacity: "0" }, {
            queue: true,
            duration: 800,
            easing: "easeOutQuad",
            complete: function() {
                window.location.assign(href);
            }
        });
    },
    CG_B: function(href) {
        $("main").append("<div id='CG_Abg'><div class='CG_Abg1'></div><div class='CG_Abg2'></div></div>");

        $("body").delay(1200).animate({ opacity: "0" }, {
            queue: true,
            duration: 200,
            easing: "easeOutQuad",
            complete: function() {
                setTimeout(function() {
                    window.location.assign(href);
                }, 100);
            } 
        }); 
    }, 
    CG_C: function(href) {
        $("main").append("<div id='CG_Bbg'></div>");
        $("body").delay(1200).animate({ opacity: "0" }, {
            queue: true,
            duration: 200,
            easing: "easeOutQuad",
            complete: function() {
                setTimeout(function() {
                    window.location.assign(href);
                }, 100);
            } 
        }); 
    }, 
    CG_D: function(href) {
        $("main").append("<div id='CG_Cbg'><div class='CG_Cbg1'></div><div class='CG_Cbg2'></div></div>");
        $("body").delay(1200).animate({ opacity: "0" }, {
            queue: true,
            duration: 200,
            easing: "easeOutQuad",
            complete: function() {
                setTimeout(function() {
                    window.location.assign(href);
                }, 100);
            } 
        });
    } 
}

//動態曲線
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',

    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
});