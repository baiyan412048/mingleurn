// (function () {

let paper = $('.drawing-paper.show');
const visualRange = $('.visual-range');
const defaultSrc = $('.drawing-paper[data-page="default"]').attr('data-src')
let nowScale = 1
const canvasName = ['default', 'attached1', 'attached2'];
let commonSetting = {
  fillColor: '#ffffff',
  strokeColor: 'transparent',
  brushWidth: 5,
}
let customizedCanvas = {};
let isMouseDown, textBox, rect, ellipse, straightLine, triangle, origX, origY, deltaX, deltaY, activeObj, defaultViewport, minScale
let selectable = true
let isDeleted = false
let moveMode = false
let activeTool = 'select'
let isEdit = false

setTimeout(function () {
  clickBlank()
  fabricInit(canvasName)
  paperMinimize(canvasName)
  paperScaleHandler()
  toolSwitch()
  toolSetting()
  colorSelect()
  maximize()
  selectPaperHandler()
  selectBGHandler()
  deletePaper()
  undoAndRedo()
  mobileTextBox()
  addPaperBackground('default', defaultSrc, 'product')
},300)


//視窗大小 resize
$(window).resize4('resizeBG', 300)

//Function宣告
//Declared Function

//點擊空白處
function clickBlank() {
  $(document).on('click', function () {
    $('.tool-btn').removeClass('open')
    $('.tool-btn .tool-setting').fadeOut(300)
    $('.color-select').fadeOut(300)
  })
}

function setCanvasSize(name) {
  const canvas_w = $('.drawing-paper').innerWidth()
  const canvas_h = $('.drawing-paper').innerHeight()
  customizedCanvas[name].canvas.setWidth(canvas_w)
  customizedCanvas[name].canvas.setHeight(canvas_h)
  customizedCanvas[name].cursorCanvas.setWidth(canvas_w)
  customizedCanvas[name].cursorCanvas.setHeight(canvas_h)
}

//加入底圖
function addPaperBackground(paper, src, from) {
  let x, y
  const width = $('.artboard-background').innerWidth()
  const height = $('.artboard-background').innerHeight()
  x = $('.artboard-background').position().left
  y = $('.artboard-background').position().top
  if (from !== 'upload') {
    fabric.Image.fromURL(src, function(img) {
      customizedCanvas[paper].canvas.add(img.set({
        left: x,
        top: y,
        selectable: false,
        objType: 'paperBG',
        objFrom: from
      }).scale(width / img.width));
    });
  }
  else {
    fabric.Image.fromURL(src, function (img) {
      let ratio,offset
      //橫式圖 或 1:1圖
      if (img.width >= img.height) {
        ratio = width / img.width
        offset = (height - (img.height * ratio)) / 2
        y = y + offset
      }
      //直式圖
      else if(img.width < img.height) {
        ratio = height / img.height
        offset = (width - (img.width * ratio)) / 2
        x = x + offset
      }
      customizedCanvas[paper].canvas.add(img.set({
        left: x,
        top: y,
        selectable: false,
        objType: 'paperBG',
        objFrom: from
      }).scale(ratio));
    });
  }
  $(`.drawing-paper[data-page="${paper}"]`).addClass('paper-initialize')
  setTimeout(() => {
    customizedCanvas[paper].data.state = customizedCanvas[paper].canvas.toJSON()
  },500)
}

//重製底圖
function resizeBG() {
  const page = $('.drawing-paper.show').attr('data-page');
  const width = $('.artboard-background').innerWidth()
  const x = $('.artboard-background').position().left
  const y = $('.artboard-background').position().top
  setCanvasSize(page)
  customizedCanvas[page].canvas.getObjects()[0].set({
    left: x,
    top: y,
    selectable: false,
  }).scale(width / customizedCanvas[page].canvas.getObjects()[0].width);
  defaultViewport = customizedCanvas['default'].canvas.viewportTransform 
}

//畫布初始化
function fabricInit(name) {
  const deleteIcon = "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23191919;%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Edelete%3C/title%3E%3Cg id='圖層_2' data-name='圖層 2'%3E%3Cg id='圖層_1-2' data-name='圖層 1'%3E%3Ccircle class='cls-1' cx='15' cy='15' r='15'/%3E%3Cpath class='cls-2' d='M15.94,15l3.87-3.87a.66.66,0,1,0-.94-.94L15,14.06l-3.87-3.87a.66.66,0,0,0-.94.94L14.06,15l-3.87,3.87a.68.68,0,0,0,0,.94.68.68,0,0,0,.94,0L15,15.94l3.87,3.87a.68.68,0,0,0,.94,0,.68.68,0,0,0,0-.94Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  const deleteImg = document.createElement('img');
  deleteImg.src = deleteIcon;

  const editIcon = "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 29.99 29.99'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23191919;%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Cg id='圖層_2' data-name='圖層 2'%3E%3Cg id='圖層_1-2' data-name='圖層 1'%3E%3Ccircle class='cls-1' cx='15' cy='15' r='15'/%3E%3Cpath class='cls-2' d='M21.24,10,20,8.74a1.37,1.37,0,0,0-1.88,0L16.85,10,9.74,17.11a0,0,0,0,1,0,0l-.07.11,0,0v0L8.38,21a.45.45,0,0,0,.42.59.32.32,0,0,0,.14,0l3.76-1.25h.05l.11-.08h0L20,13.13l1.25-1.26A1.33,1.33,0,0,0,21.24,10ZM9.5,20.48l.75-2.24,1.49,1.5Zm3.06-1.18-1.64-1.64-.24-.24,6.49-6.49,1.31,1.32.57.57Zm8.06-8-.94.94-1.32-1.32-.56-.56.94-.94a.44.44,0,0,1,.62,0l1.26,1.25A.45.45,0,0,1,20.62,11.25Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
  const editImg = document.createElement('img');
  editImg.src = editIcon;

  const rotateIcon = "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Ctitle%3Erotate%3C/title%3E%3Cg id='af6903dc-9d92-47db-8945-07df3dda9f89' data-name='圖層 2'%3E%3Cg id='7fcac64a-eca7-464b-8ade-f941a38eb16d' data-name='圖層 1'%3E%3Crect width='30' height='30' rx='15' ry='15' fill='%23fff'/%3E%3Cpath d='M17.5,10,15,7.5V9.17a6.67,6.67,0,1,0,6.67,6.66H20a5,5,0,1,1-5-5V12.5Z' fill='%23050a0f'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
  const rotateImg = document.createElement('img');
  rotateImg.src = rotateIcon;

  const controlsUtils = fabric.controlsUtils,
        scaleSkewStyleHandler = controlsUtils.scaleSkewCursorStyleHandler,
        // scaleStyleHandler = controlsUtils.scaleCursorStyleHandler,
        // scalingEqually = controlsUtils.scalingEqually,
        // scalingYOrSkewingX = controlsUtils.scalingYOrSkewingX,
        // scalingXOrSkewingY = controlsUtils.scalingXOrSkewingY,
        // scaleOrSkewActionName = controlsUtils.scaleOrSkewActionName,
        objectControls = fabric.Object.prototype.controls;

  fabric.Object.prototype.set({
    cornerStyle: 'circle',
    cornerSize: 10,
    borderColor: '#7e7e7e',
    cornerColor: '#9a9a9a',
    transparentCorners: false,
    padding: 10,
    borderOpacityWhenMoving: 1,
  })

  objectControls.mtr = new fabric.Control({
    x: 0,
    y: -0.5,
    cursorStyle: 'url("https://mingleurn1987.com/dist/assets/img/customized/control-rotate.png"), auto',
    // cursorStyle: 'url("../../../assets/img/customized/control-rotate.png"), auto',
    actionHandler: controlsUtils.rotationWithSnapping,
    cursorStyleHandler: controlsUtils.rotationStyleHandler,
    offsetY: -64,
    withConnection: true,
    actionName: 'rotate',
    render: renderIcon(rotateImg),
    cornerSize: 30
  });


  objectControls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetX: 24,
    offsetY: -30,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 30,
  });

  objectControls.editControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetX: 24,
    offsetY: 12,
    cursorStyle: 'pointer',
    mouseUpHandler: editTextBox,
    render: renderIcon(editImg),
    cornerSize: 30,
  });

  if (fabric.Textbox) {
    const textBoxControls = fabric.Textbox.prototype.controls = {};

    textBoxControls.mtr = objectControls.mtr;
    textBoxControls.tr = objectControls.tr;
    textBoxControls.br = objectControls.br;
    textBoxControls.tl = objectControls.tl;
    textBoxControls.bl = objectControls.bl;
    textBoxControls.mt = objectControls.mt;
    textBoxControls.mb = objectControls.mb;

    textBoxControls.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      actionHandler: controlsUtils.changeWidth,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionName: 'resizing',
    });

    textBoxControls.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      actionHandler: controlsUtils.changeWidth,
      cursorStyleHandler: scaleSkewStyleHandler,
      actionName: 'resizing',
    });

    textBoxControls.deleteControl = objectControls.deleteControl
    textBoxControls.editControl = objectControls.editControl
  }
  
  

  function deleteObject(eventData, target) {
    isDeleted = true
    isEdit = false
    var c = target.canvas
    c.remove(target)
    c.discardActiveObject()
    c.renderAll()
  }

  function editTextBox(eventData, target) {
    const text = target.text
    $('.mobile-text-input .text-input').val(text).focus()
    $('.mobile-text-input').addClass('open')
  }

  function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size/2, -size/2, size, size);
      ctx.restore();
    }
  }

  $(name).each(function () {
    const ele = this
    const cursor = ele + '-cursor'
    customizedCanvas[ele] = {
      data: {
        state: '',
        undo: [],
        redo: [],
      },
      canvas: new fabric.Canvas(ele, {
        isDrawingMode: false,
        freeDrawingCursor: 'none',
      }),
      cursorCanvas: new fabric.StaticCanvas(cursor),
    }
    const brushCursor = new fabric.Circle({
      left: -100,
      top: -100,
      radius: commonSetting.brushWidth * 0.5 + 3,
      fill: "rgba(255,255,255)",
      opacity: 0.6,
      stroke: "transparent",
      originX: 'center',
      originY: 'center'
    })

    //設定畫布大小
    setCanvasSize(ele)
    customizedCanvas[ele].canvas.setBackgroundColor('#383838', customizedCanvas[ele].canvas.renderAll.bind(customizedCanvas[ele].canvas));
    customizedCanvas[ele].cursorCanvas.add(brushCursor)

    //---------------------------------------------------------------------------------//
    //監聽事件
    //Event Listener

    //產生物件時
    customizedCanvas[ele].canvas.on('selection:created', function (o) {
      const c = this
      if (!$.isMobile4()) {
        o.target.setControlVisible('editControl', false)
      }
      else {
        if (o.target.type != 'textbox') {
          o.target.setControlVisible('editControl', false)
        }
        else {
          o.target.setControlVisible('editControl', true)
        }
      }
      c.renderAll()
      if (o.e !== undefined) {
        getColor(o)
      }
    });

    //物件選取切換
    customizedCanvas[ele].canvas.on('selection:updated', function (o) {
      const c = this
      if (!$.isMobile4()) {
        o.target.setControlVisible('editControl', false)
      }
      else {
        if (o.target.type != 'textbox') {
          o.target.setControlVisible('editControl', false)
        }
        else {
          o.target.setControlVisible('editControl', true)
        }
      }
      c.renderAll()
      getColor(o)
    });

    //物件取消選取
    customizedCanvas[ele].canvas.on('selection:cleared', function() {
      $('.object-control').remove()
      if (activeTool === 'move' || activeTool === 'brush') {
        $('.tool-btn[data-tool="select"]').removeClass('active')
      } else {
        $('.tool-btn[data-tool="select"]').addClass('active')
      }
      if (activeTool === 'shape' || activeTool === 'line') {
        customizedCanvas[ele].canvas.hoverCursor = 'crosshair'
      }
    });

    //滑鼠按下
    customizedCanvas[ele].canvas.on('mouse:down', function (o) {
      paper = $('.drawing-paper.show')
      let clientX,clientY
      const c = this
      const c2 = customizedCanvas[ele].cursorCanvas
      const isSelect = customizedCanvas[ele].canvas.getActiveObject()
      const pointer = customizedCanvas[ele].canvas.getPointer(o.e)
      isMouseDown = true
      $('.tool-btn').removeClass('open')
      $('.tool-btn .tool-setting').fadeOut(300)
      $('.color-select').fadeOut(300)
      if (activeTool === 'brush') {
        brushCursor
          .set({
            top: pointer.y,
            left: pointer.x
          })
          .setCoords()
          .canvas.renderAll();
      }
      if (!isSelect && !selectable) {
        isMouseDown = true
        origX = pointer.x;
        origY = pointer.y;
        const page = $('.drawing-paper.show').attr('data-page')
        const fill = commonSetting.fillColor
        const stroke = commonSetting.strokeColor
        const left = pointer.x
        const top = pointer.y
        switch (activeTool) {
          case 'text':
            $('.type-box[data-option="stroke"]').addClass('disabled')
            $('.color-box[data-option="stroke"]').addClass('disabled')
            //電腦版
            if (!$.isMobile4()) {
              if (!isEdit) {
                addTextBox(page, '', left, top, fill)
                $('.tool-btn[data-tool="select"]').removeClass('active')
              } else {
                isEdit = false
              }
            }
            //行動裝置
            else {
              if (!isEdit) {
                $('.mobile-text-input').addClass('open')
                $('.mobile-text-input .text-input').focus()
              }
              else {
                isEdit = false
              }
            }
            break;
          case 'shape':
            const shape = $('.setting-wrap .shape-btn.active').attr('data-option')
            addShape(page, shape, left, top, fill, stroke)
            break;
          case 'line':
            const points = [pointer.x, pointer.y, pointer.x, pointer.y]
            const type = $('.setting-wrap .line-btn.active').attr('data-option')
            $('.type-box[data-option="stroke"]').addClass('disabled')
            $('.color-box[data-option="stroke"]').addClass('disabled')
            addLine(page, type, points, fill)
            break;
        }
      }
      else {
        switch (activeTool) {
          case 'brush':
            $('.type-box[data-option="stroke"]').addClass('disabled')
            $('.color-box[data-option="stroke"]').addClass('disabled')
            break;
          case 'text':
            isEdit = true
            break;
        }
      }
      if (moveMode) {
        if(o.e.type === 'touchstart'){
          clientX = o.e.targetTouches[0].clientX
          clientY = o.e.targetTouches[0].clientY
        }
        else{
          clientX = o.e.clientX
          clientY = o.e.clientY
        }
        paper.removeClass('move').addClass('moving')
        c.lastPosX = clientX
        c2.lastPosX = clientX
        c.lastPosY = clientY
        c2.lastPosY = clientY
      }
    });

    //滑鼠移動
    customizedCanvas[ele].canvas.on('mouse:move', function (o) {
      let clientX,clientY
      const c = this
      const c2 = customizedCanvas[ele].cursorCanvas
      const pointer = customizedCanvas[ele].canvas.getPointer(o.e)
      if (activeTool === 'brush') {
        brushCursor
          .set({
            top: pointer.y,
            left: pointer.x
          })
          .setCoords()
          .canvas.renderAll();
      }
      if (isMouseDown && !c.getActiveObject()) {
        isDeleted = false
        switch (activeTool) {
          //形狀
          case 'shape':
            const shape = $('.setting-wrap .shape-btn.active').attr('data-option')
            //矩形
            if (shape == 'rect') {
              if (origX > pointer.x) {
                rect.set({
                  left: Math.abs(pointer.x)
                });
              }
              if (origY > pointer.y) {
                rect.set({
                  top: Math.abs(pointer.y)
                });
              }
              //如果不要正方形 height 改成 origY - pointer.y
              rect.set({
                width: Math.abs(origX - pointer.x),
                height: Math.abs(origX - pointer.x),
              });
              customizedCanvas[ele].canvas.renderAll();
            }
            //圓形
            else if (shape == 'circle') {
              //如果不要正圓 height 改成 origY - pointer.y
              let rx = Math.abs(origX - pointer.x) / 2;
              let ry = Math.abs(origX - pointer.x) / 2;
              if (rx > ellipse.strokeWidth) {
                rx -= ellipse.strokeWidth / 2;
              }
              if (ry > ellipse.strokeWidth) {
                ry -= ellipse.strokeWidth / 2;
              }
              ellipse.set({
                rx: rx,
                ry: ry
              });

              if (origX > pointer.x) {
                ellipse.set({
                  originX: 'right'
                });
              }
              else {
                ellipse.set({
                  originX: 'left'
                });
              }
              if (origY > pointer.y) {
                ellipse.set({
                  originY: 'bottom'
                });
              } else {
                ellipse.set({
                  originY: 'top'
                });
              }
              customizedCanvas[ele].canvas.renderAll();
            }
            break;
          case 'line':
            const line = $('.setting-wrap .line-btn.active').attr('data-option')
            //直線
            if (line == 'straight-line') {
              straightLine.set({
                x2: pointer.x,
                y2: pointer.y
              });
              customizedCanvas[ele].canvas.renderAll();
            }
            //有箭頭的直線
            else if (line == 'arrow') {
              straightLine.set({
                x2: pointer.x,
                y2: pointer.y
              });
              triangle.set({
                'left': pointer.x + deltaX,
                'top': pointer.y + deltaY,
                'angle': fabricCalcArrowAngle(straightLine.x1, straightLine.y1, straightLine.x2, straightLine.y2)
              });
              customizedCanvas[ele].canvas.renderAll();
            }
            break;
        }
        //拖拉畫布
        if (moveMode) {
          const zoom = customizedCanvas[ele].canvas.getZoom()
          const zoomRange = zoom - 1
          const vpt = c.viewportTransform
          const vpt2 = c2.viewportTransform
          //可視寬度
          const visualWidth = visualRange.width()
          //可視高度
          const visualHeight = visualRange.height()
          const dragXMin = -(c.width - visualWidth) / 2 - zoomRange * c.width
          const dragXMax = (c.width - visualWidth) / 2
          const dragYMin = -(c.height - visualHeight) / 2 - zoomRange * c.height
          const dragYMax = (c.height - visualHeight) / 2
          let straight, horizontal
          //可視高度小於可視寬度
          if (visualHeight / visualWidth <= 1) {
            minScale = visualWidth / c.width
            horizontal = true
          }
          //可視高度大於可視寬度
          else if (visualHeight / visualWidth > 1) {
            minScale = visualHeight / c.height
            straight = true
          }
          if(o.e.type === 'touchmove'){
            clientX = o.e.targetTouches[0].clientX
            clientY = o.e.targetTouches[0].clientY
          }
          else{
            clientX = o.e.clientX
            clientY = o.e.clientY
          }
          vpt[4] += clientX - c.lastPosX;
          vpt2[4] += clientX - c2.lastPosX;
          vpt[5] += clientY - c.lastPosY;
          vpt2[5] += clientY - c2.lastPosY;
          if (zoom <= minScale) {
            if (straight) {
              if (vpt[4] >= dragXMax) {
                vpt[4] = dragXMax;
                vpt2[4] = dragXMax;
              }
              else if (vpt[4] <= dragXMin) {
                vpt[4] = dragXMin
                vpt2[4] = dragXMin
              }
              vpt[5] = (1 - zoom) * c.height / 2
              vpt2[5] = (1 - zoom) * c.height / 2
            }
            else if (horizontal) {
              vpt[4] = (1 - zoom) * c.width / 2
              vpt2[4] = (1 - zoom) * c.width / 2
              if (vpt[5] >= dragYMax) {
                vpt[5] = dragYMax;
                vpt2[5] = dragYMax;
              }
              else if (vpt[5] <= dragYMin) {
                vpt[5] = dragYMin
                vpt2[5] = dragYMin
              }
            }
          }
          else {
            if (vpt[4] >= dragXMax) {
              vpt[4] = dragXMax;
              vpt2[4] = dragXMax;
            }
            else if (vpt[4] <= dragXMin) {
              vpt[4] = dragXMin;
              vpt2[4] = dragXMin;
            }
            if (vpt[5] >= dragYMax) {
              vpt[5] = dragYMax;
              vpt2[5] = dragYMax;
            }
            else if (vpt[5] <= dragYMin) {
              vpt[5] = dragYMin
              vpt2[5] = dragYMin
            }
          }
          c.renderAll();
          c2.renderAll();
          c.lastPosX = clientX;
          c2.lastPosX = clientX;
          c.lastPosY = clientY;
          c2.lastPosY = clientY;
        }
      }
    });

    //滑鼠放開
    customizedCanvas[ele].canvas.on('mouse:up', function (o) {
      const c = this
      const c2 = customizedCanvas[ele].cursorCanvas
      const pointer = customizedCanvas[ele].canvas.getPointer(o.e)
      const isSelect = customizedCanvas[ele].canvas.getActiveObject()
      isMouseDown = false
      if (!selectable && !isSelect) {
        if (activeTool !== 'select' && activeTool !== 'move' && activeTool !== 'text' && pointer.x == origX && pointer.y == origY) {
          customizedCanvas[ele].canvas.remove(activeObj)
          if (triangle) {
            customizedCanvas[ele].canvas.remove(triangle)
          }
          customizedCanvas[ele].canvas.renderAll();
        }
        else {
          if (activeTool === 'shape' || activeTool === 'line') {
            if (!isDeleted) {
              if (activeTool === 'line' && $('.line-btn.active').attr('data-option') == 'arrow') {
                const objs = [straightLine, triangle]
                const group = new fabric.Group(objs, {
                  originX: 'center',
                  originY: 'center',
                  type: 'arrowLine'
                });
                customizedCanvas[ele].canvas.remove(straightLine, triangle);
                activeObj = group
                customizedCanvas[ele].canvas.add(group)
                customizedCanvas[ele].canvas.setActiveObject(activeObj)
                customizedCanvas[ele].canvas.renderAll();
              }
              else {
                customizedCanvas[ele].canvas.setActiveObject(activeObj)
                activeObj.setCoords();
                customizedCanvas[ele].canvas.renderAll();
              }
            }
          }
          if (activeTool !== 'text') {
            saveCanvas()
          }
        }
      }
      else {
        if (activeTool === 'text') {
          setTimeout(() => {
            if (o.target.isEditing) {
              $('.tool-btn[data-tool="select"]').removeClass('active')
            }
          })
        }
        else if (activeTool === 'brush') {
          saveCanvas()
        }
      }
      if (moveMode) {
        paper.removeClass('moving').addClass('move')
        c.setViewportTransform(c.viewportTransform);
        c2.setViewportTransform(c2.viewportTransform);
      }
    });

    //滑鼠移入
    customizedCanvas[ele].canvas.on('mouse:over', function (o) {
      if (o.target) {
        if (o.target.objType === 'paperBG') {
          customizedCanvas[ele].canvas.hoverCursor = 'default'
        }
        else {
          customizedCanvas[ele].canvas.hoverCursor = 'move'
        }
      }
    });

    //滑鼠移出
    customizedCanvas[ele].canvas.on('mouse:out', function() {
      if (activeTool === 'brush') {
        brushCursor
          .set({
            top: -100,
            left: -100
          })
          .setCoords()
          .canvas.renderAll();
      }
      if (activeTool === 'shape' || activeTool === 'line') {
        $('.drawing-paper.show canvas.upper-canvas').css('cursor', 'crosshair')
      }
    });

    customizedCanvas[ele].canvas.on('object:modified', function (o) {
      saveCanvas()
    });

    if (customizedCanvas[ele].canvas.freeDrawingBrush) {
      customizedCanvas[ele].canvas.freeDrawingBrush.color = commonSetting.fillColor
      customizedCanvas[ele].canvas.freeDrawingBrush.width = parseInt(commonSetting.brushWidth)
    }
  });
}

//將畫布縮小至最小
function paperMinimize(name) {
  $(name).each(function (index,ele) {
    const centerX = $('.artboard-background').position().left + $('.artboard-background').innerWidth() / 2
    const centerY = $('.artboard-background').position().top + $('.artboard-background').innerHeight() / 2
    const nowPaper = ele
    //可視寬度
    const visualWidth = visualRange.width()
    //可視高度
    const visualHeight = visualRange.height()
    //可視範圍比例
    const visualRatio = roundDecimal(visualHeight / visualWidth * 100, 2)
    const paperWidth = customizedCanvas[nowPaper].canvas.width
    const paperHeight = customizedCanvas[nowPaper].canvas.height
    const paperRatio = roundDecimal(paperHeight / paperWidth * 100, 2)
    if(visualRatio < paperRatio){
      nowScale = visualWidth / paperWidth
    }
    else{
      nowScale = visualHeight / paperHeight
    }
    customizedCanvas[nowPaper].canvas.zoomToPoint({ x: centerX, y: centerY }, nowScale);
    customizedCanvas[nowPaper].cursorCanvas.zoomToPoint({ x: centerX, y: centerY }, nowScale);
  })
  defaultViewport = customizedCanvas['default'].canvas.viewportTransform
}

//畫布重置
function drawPaperReset() {
  commonSetting.fillColor = '#ffffff'
  commonSetting.strokeColor = 'transparent'
  commonSetting.brushWidth = 5
  selectable = true
  moveMode = false
  activeTool = 'select'
  isEdit = false
  $('.tool-btn').removeClass('active')
  $('.tool-btn[data-tool="select"]').addClass('active')
  $('.setting-btn').removeClass('active')
  $('.setting-btn.default').addClass('active')
  $('.type-select .type-box').removeClass('disabled')
  $('.type-select .type-box[data-option="stroke"]').addClass('disabled')
  $('.tool-btn .color-box').removeClass('disabled')
  $('.tool-btn .color-box[data-option="stroke"]').addClass('disabled')
  $('.fill-color').css('background-color', '#ffffff')
  $('.display.stroke-color').css('border-color', 'transparent')
}

//抓物件顏色
function getColor(event) {
  const obj = event.target.type
  const fill = event.target.fill == null ? 'transparent' : event.target.fill
  const stroke = event.target.stroke
  $('.color-box[data-option="fill"]').removeClass('disabled')
  $('.color-box[data-option="stroke"]').removeClass('disabled')
  $('.type-box[data-option="fill"]').removeClass('disabled')
  $('.type-box[data-option="stroke"]').removeClass('disabled')
  switch (obj) {
    case 'path':
      commonSetting.fillColor = stroke
      commonSetting.strokeColor = 'transparent'
      $('.fill-color').css('background-color',stroke)
      $('.stroke-color').css('border-color', 'transparent')
      $('.color-box[data-option="stroke"]').addClass('disabled')
      $('.type-box[data-option="stroke"]').addClass('disabled')
      break;
    case 'textbox':
      commonSetting.fillColor = fill
      commonSetting.strokeColor = 'transparent'
      $('.fill-color').css('background-color',fill)
      $('.stroke-color').css('border-color', 'transparent')
      $('.color-box[data-option="stroke"]').addClass('disabled')
      $('.type-box[data-option="stroke"]').addClass('disabled')
      break;
    case 'line':
      commonSetting.fillColor = stroke
      commonSetting.strokeColor = 'transparent'
      $('.fill-color').css('background-color',stroke)
      $('.stroke-color').css('border-color', 'transparent')
      $('.color-box[data-option="stroke"]').addClass('disabled')
      $('.type-box[data-option="stroke"]').addClass('disabled')
      break;
    case 'arrowLine':
      const color = event.target._objects[0].fill
      commonSetting.fillColor = color
      commonSetting.strokeColor = 'transparent'
      $('.fill-color').css('background-color',color)
      $('.stroke-color').css('border-color', 'transparent')
      $('.color-box[data-option="stroke"]').addClass('disabled')
      $('.type-box[data-option="stroke"]').addClass('disabled')
      break;
    default:
      commonSetting.fillColor = fill
      commonSetting.strokeColor = stroke
      $('.fill-color').css('background-color',fill)
      $('.stroke-color').css('border-color', stroke)
      if (fill == 'transparent') {
        $('.type-box[data-option="fill"]').addClass('disabled')
        $('.color-box[data-option="fill"]').addClass('disabled')
      }
      if (stroke == 'transparent') {
        $('.type-box[data-option="stroke"]').addClass('disabled')
        $('.color-box[data-option="stroke"]').addClass('disabled')
      }
      
      break;
  }
}

//工具切換
function toolSwitch() {
  $('.tool-btn').on('click', function (e) {
    e.stopPropagation()
    paper = $('.drawing-paper.show')
    const tool = $(this).attr('data-tool')
    const toolSetting = $(this).find('.tool-setting')
    const page = $('.drawing-paper.show').attr('data-page')
    const canvas = customizedCanvas[page].canvas
    const leftBtn = ['select', 'move']
    const bottomBtn = ['brush', 'text', 'shape', 'line']
    const objects = canvas.getObjects()
    if (objects.length >= 1) {
      objects.forEach(function (el) {
        if (el.objType === 'paperBG') {
          el.selectable = false;
        }
        else {
          el.selectable = true;
        }
      })
      canvas.renderAll();
    }
    $('.tool-btn .tool-setting').fadeOut(300)
    if (tool == 'color') {
      if ($(this).hasClass('open')) {
        $(this).removeClass('open')
        $('.color-select').fadeOut(300)
      } else {
        $('.tool-btn .tool-setting').fadeOut(300)
        $('.tool-btn').removeClass('open')
        $(this).addClass('open')
        $('.color-select').fadeIn(300)
        $('.type-select .type-box').removeClass('active')
        $('.type-select .type-box[data-option="fill"]').addClass('active')
      }
    } else {
      $('.tool-btn:not([data-tool="color"])').removeClass('active')
      $(this).addClass('active')
      paper.removeClass('move')
      canvas.isDrawingMode = false
      moveMode = false
      activeTool = tool
      isEdit = false
      //左邊工具(選取/移動)
      if (leftBtn.indexOf(tool) != -1) {
        switch (tool) {
          case 'select':
            canvas.selection = true
            canvas.defaultCursor = 'default';
            customizedCanvas[page].canvas.getObjects()[0].hoverCursor = "default"
            $('.tool-btn').removeClass('open')
            canvas.isDrawingMode = false
            customizedCanvas[page].cursorCanvas._objects[0].set({
              opacity: 0,
            })
            .setCoords().canvas.renderAll();
            break;
          case 'move':
            moveMode = true
            canvas.selection = false
            paper.addClass('move')
            $('.tool-btn').removeClass('open')
            $('.tool-btn[data-tool="select"]').removeClass('active')
            canvas.isDrawingMode = false
            customizedCanvas[page].canvas.getObjects()[0].hoverCursor = null
            customizedCanvas[page].cursorCanvas._objects[0].set({
              opacity: 0,
            })
            .setCoords().canvas.renderAll();
            canvas.discardActiveObject();
            canvas.renderAll();
            if (objects.length >= 1) {
              objects.forEach(function (el) {
                el.selectable = false;
              })
              canvas.renderAll();
            }
            break;
        }
      }
      //下方工具(筆刷/文字/形狀/線條)
      else if (bottomBtn.indexOf(tool) != -1) {
        $('.tool-btn[data-tool="select"]').addClass('active')
        $('.draw-tool').attr('data-select-tool', tool)
        $('.color-select').fadeOut(300)
        if (activeTool != 'brush') {
          canvas.isDrawingMode = false
          customizedCanvas[page].cursorCanvas._objects[0].set({
            opacity: 0,
          })
          .setCoords().canvas.renderAll();
        }
        if ($(this).hasClass('open')) {
          if (toolSetting.length >= 1) {
            $(this).removeClass('open')
            toolSetting.fadeOut(300)
          }
        }
        else {
          $('.tool-btn').removeClass('open')
          canvas.discardActiveObject();
          canvas.renderAll();
          if (toolSetting.length >= 1) {
            $(this).addClass('open')
            toolSetting.fadeIn(300)
          }
        }
        if (tool != 'shape') {
          if (commonSetting.strokeColor !== 'transparent') {
            $('.type-select .type-box[data-option="stroke"]').addClass('disabled')
            $('.tool-btn .color-box[data-option="stroke"]').addClass('disabled')
            $('.display.stroke-color').css('border-color', 'transparent')
            commonSetting.strokeColor = 'transparent'
            if (commonSetting.fillColor === 'transparent') {
              $('.type-select .type-box[data-option="fill"]').removeClass('disabled')
              $('.tool-btn .color-box[data-option="fill"]').removeClass('disabled')
              $('.fill-color').css('background-color', '#ffffff')
              commonSetting.fillColor = '#ffffff'
            }
          }
        }
        switch (tool) {
          case 'brush':
            canvas.isDrawingMode = true
            selectable = true
            canvas.freeDrawingBrush.color = commonSetting.fillColor
            canvas.getObjects()[0].hoverCursor = null
            customizedCanvas[page].cursorCanvas._objects[0].set({
              opacity: 0.6,
              fill: commonSetting.fillColor
            })
            .setCoords().canvas.renderAll();
            $('.tool-btn[data-tool="select"]').removeClass('active')
            break;
          case 'text':
            selectable = false
            canvas.getObjects()[0].hoverCursor = 'text';
            canvas.defaultCursor = 'text';
            break;
          case 'shape':
            canvas.selection = false
            selectable = false
            canvas.getObjects()[0].hoverCursor = 'crosshair';
            canvas.defaultCursor = 'crosshair';
            break;
          case 'line':
            canvas.selection = false
            selectable = false
            canvas.getObjects()[0].hoverCursor = 'crosshair';
            canvas.defaultCursor = 'crosshair';
            break;
        }
      }
    }
  })
}

//工具設定
function toolSetting() {
  $('.setting-wrap').on('click', function (e) {
    e.stopPropagation()
  })
  $('.setting-wrap .setting-btn').on('click', function () {
    const page = $('.drawing-paper.show').attr('data-page')
    const canvas = customizedCanvas[page].canvas
    $(this).siblings().removeClass('active')
    $(this).addClass('active')
    //選擇筆刷大小
    if ($(this).hasClass('brush-size')) {
      const brushSize = $(this).attr('data-size')
      commonSetting.brushWidth = parseInt(brushSize)
      canvas.freeDrawingBrush.width = parseInt(brushSize)
      customizedCanvas[page].cursorCanvas._objects[0].set({
        radius: commonSetting.brushWidth * 0.5 + 3
      })
      .setCoords().canvas.renderAll();
    }
  })
}

//選擇顏色
function colorSelect() {
  $('.color-wrap').on('click', function (e) {
    e.stopPropagation()
  })
  $('.color-palettes .colorBox').on('click', function () {
    const page = $('.drawing-paper.show').attr('data-page')
    const canvas = customizedCanvas[page]
    const activeColorType = $('.type-select .type-box.active').attr('data-option')
    const color = $(this).css('background-color')
    const disabled = $(this).hasClass('disabled')
    const hasDisabled = $('.type-select .type-box').hasClass('disabled')
    const nowSelectObj = canvas.canvas.getActiveObject()
    switch (activeColorType) {
      case 'fill':
        if (disabled) {
          if (!hasDisabled) {
            commonSetting.fillColor = 'transparent'
            $('.type-select .type-box[data-option="fill"]').addClass('disabled')
            $('.tool-btn .color-box[data-option="fill"]').addClass('disabled')
            $('.display.fill-color').css('background-color', 'transparent')
            if (nowSelectObj) {
              if (nowSelectObj.type == 'rect' || nowSelectObj.type == 'ellipse') {
                nowSelectObj.set({
                  fill: 'transparent'
                })
                canvas.canvas.renderAll()
              }
            }
          }
        } else {
          commonSetting.fillColor = RGBToHex(color)
          canvas.canvas.freeDrawingBrush.color = RGBToHex(color)
          $('.type-select .type-box[data-option="fill"]').removeClass('disabled')
          $('.tool-btn .color-box[data-option="fill"]').removeClass('disabled')
          $('.fill-color').css('background-color', color)
          canvas.cursorCanvas._objects[0].set({
            fill: color
          })
          if (nowSelectObj) {
            if (nowSelectObj.type == 'path' || nowSelectObj.type == 'line') {
              nowSelectObj.set({
                stroke: RGBToHex(color)
              })
            } else if (nowSelectObj.type == 'arrowLine') {
              nowSelectObj._objects.forEach((el) => {
                el.set({
                  fill: RGBToHex(color),
                  stroke: RGBToHex(color)
                })
              })
            } else {
              nowSelectObj.set({
                fill: RGBToHex(color)
              })
            }
            canvas.canvas.renderAll()
          }
        }
        break;
      case 'stroke':
        if (disabled) {
          if (!hasDisabled) {
            commonSetting.strokeColor = 'transparent'
            $('.type-select .type-box[data-option="stroke"]').addClass('disabled')
            $('.tool-btn .color-box[data-option="stroke"]').addClass('disabled')
            $('.display.stroke-color').css('border-color', 'transparent')
            if (nowSelectObj) {
              if (nowSelectObj.type == 'rect' || nowSelectObj.type == 'ellipse') {
                nowSelectObj.set({
                  stroke: 'transparent'
                })
                canvas.canvas.renderAll()
              }
            }
          }
        } else {
          commonSetting.strokeColor = RGBToHex(color)
          $('.type-select .type-box[data-option="stroke"]').removeClass('disabled')
          $('.tool-btn .color-box[data-option="stroke"]').removeClass('disabled')
          $('.stroke-color').css('border-color', color)
          if (nowSelectObj) {
            if (nowSelectObj.type == 'rect' || nowSelectObj.type == 'ellipse') {
              nowSelectObj.set({
                stroke: RGBToHex(color)
              })
              canvas.canvas.renderAll()
            }
          }
        }
        break;
    }
    saveCanvas()
  })

  clickSwitchClass('.type-select .type-box', 'active')
  clickSwitchClass('.shape-select .shape-btn', 'active')
}

//加入文字方塊
function addTextBox(name, text, x, y, color) {
  textBox = new fabric.Textbox(text, {
    objectCaching: false,
    fontFamily: '"LibreBaskerville-Regular", "微軟正黑體修正", "Microsoft JhengHei", "微軟正黑體", sans-serif',
    left: x,
    top: y,
    fontSize: 60,
    lineHeight: 1.5,
    fill: color,
    editable: $.isMobile4() ? false : true,
  });
  customizedCanvas[name].canvas.add(textBox).setActiveObject(textBox)
  activeObj = textBox
  isEdit = true
  textBox.enterEditing()
}

//行動裝置文字方塊
function mobileTextBox() {
  $('.mobile-text-input .cancel-input').on('click', function () {
    $('.mobile-text-input').removeClass('open')
  })
  $('.mobile-text-input .confirm-input').on('click', function () {
    const page = $('.drawing-paper.show').attr('data-page')
    const canvas = customizedCanvas[page].canvas
    const fill = commonSetting.fillColor
    let inputText = $('.mobile-text-input .text-input').val();
    $('.mobile-text-input').removeClass('open')
    if (inputText.trim() !== '') {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().text = $('.mobile-text-input .text-input').val()
        canvas.getActiveObject().width = ''
        canvas.renderAll()
      }
      else {
        addTextBox(page, inputText, origX, origY, fill)
        $('.mobile-text-input .text-input').val('')
        saveCanvas()
      }
    }
  })
}

//加入形狀
function addShape(name, type, x, y, fill, stroke) {
  switch (type) {
    case 'rect':
      rect = new fabric.Rect({
        left: x,
        top: y,
        width: 0,
        height: 0,
        strokeWidth: 6,
        fill: fill,
        stroke: stroke,
        transparentCorners: false,
        strokeUniform: true
      });
      customizedCanvas[name].canvas.add(rect)
      activeObj = rect
      isEdit = true
      break;
    case 'circle':
      ellipse = new fabric.Ellipse({
        left: x,
        top: y,
        originX: 'left',
        originY: 'top',
        rx: 0,
        ry: 0,
        angle: 0,
        fill: fill,
        stroke: stroke,
        transparentCorners: false,
        strokeWidth: 6,
        type: 'ellipse',
        strokeUniform: true
      });
      customizedCanvas[name].canvas.add(ellipse)
      activeObj = ellipse;
      isEdit = true
      break;
  }
}

//加入線條
function addLine(name, type, points, color) {
  switch (type) {
    case 'straight-line':
      straightLine = new fabric.Line(points, {
        strokeWidth: 6,
        fill: color,
        stroke: color,
        originX: 'center',
        originY: 'center',
      });
      customizedCanvas[name].canvas.add(straightLine)
      activeObj = straightLine;
      isEdit = true
      break;
    case 'arrow':
      straightLine = new fabric.Line(points, {
        strokeWidth: 6,
        fill: color,
        stroke: color,
        originX: 'center',
        originY: 'center',
      });
      const centerX = (straightLine.x1 + straightLine.x2) / 2;
      const centerY = (straightLine.y1 + straightLine.y2) / 2;
      deltaX = straightLine.left - centerX;
      deltaY = straightLine.top - centerY;

      triangle = new fabric.Triangle({
        left: straightLine.get('x1') + deltaX,
        top: straightLine.get('y1') + deltaY,
        originX: 'center',
        originY: 'center',
        pointType: 'arrow_start',
        angle: -45,
        width: 30,
        height: 30,
        fill: color,
      });
      customizedCanvas[name].canvas.add(straightLine, triangle)
      activeObj = straightLine;
      isEdit = true
      break;
  }
}

//計算箭頭角度
function fabricCalcArrowAngle(x1, y1, x2, y2) {
  let angle = 0,
    x, y
  x = (x2 - x1)
  y = (y2 - y1)
  if (x === 0) {
    angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2
  } else if (y === 0) {
    angle = (x > 0) ? 0 : Math.PI
  } else {
    angle = (x < 0) ? Math.atan(y / x) + Math.PI :
      (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x)
  }
  return (angle * 180 / Math.PI + 90)
}

//儲存畫布
function saveCanvas() {
  paper = $('.drawing-paper.show')
  const page = paper.attr('data-page');
  customizedCanvas[page].data.undo.push(customizedCanvas[page].data.state)
  customizedCanvas[page].data.state = JSON.stringify(customizedCanvas[page].canvas)
  customizedCanvas[page].data.redo.length = 0
}

//還原&重做
function undoAndRedo() {
  $('.draw-step .step-btn').on('click', function () {
    let x, y
    paper = $('.drawing-paper.show')
    const paperName = paper.attr('data-page')
    const drawPaper = customizedCanvas[paperName]
    const option = $(this).attr('data-option')
    const limitAlert = $(this).attr('data-alert')
    const width = $('.artboard-background').innerWidth()
    const height = $('.artboard-background').innerHeight()
    const img = drawPaper.canvas.getObjects()[0]
    switch (option) {
      case 'undo':
        if (!drawPaper.data.undo.length) {
          alert(limitAlert)
          return
        }
        let undoLastJSON = drawPaper.data.undo.pop()
        drawPaper.canvas.loadFromJSON(undoLastJSON, function () {
          x = $('.artboard-background').position().left
          y = $('.artboard-background').position().top
          if (img.objFrom !== 'upload') {
            drawPaper.canvas.getObjects()[0].set({
              left: x,
              top: y,
              selectable: false,
              objType: 'paperBG',
              objFrom: 'product',
            }).scale(width / drawPaper.canvas.getObjects()[0].width);
          }
          else {
            let ratio,offset
            //橫式圖 或 1:1圖
            if (img.width >= img.height) {
              ratio = width / img.width
              offset = (height - (img.height * ratio)) / 2
              y = y + offset
            }
            //直式圖
            else if(img.width < img.height) {
              ratio = height / img.height
              offset = (width - (img.width * ratio)) / 2
              x = x + offset
            }
            drawPaper.canvas.getObjects()[0].set({
              left: x,
              top: y,
              selectable: false,
              objType: 'paperBG',
              objFrom: 'upload'
            }).scale(ratio);
          }
          drawPaper.canvas.renderAll()
        })
        // // 在做上一步時把目前狀態 push 到 redo 陣列
        drawPaper.data.redo.push(drawPaper.data.state)
        drawPaper.data.state = undoLastJSON
        break;
      case 'redo':
        if (!drawPaper.data.redo.length) {
          alert(limitAlert)
          return
        }
        let redoLastJSON = drawPaper.data.redo.pop()
        drawPaper.canvas.loadFromJSON(redoLastJSON, function () {
          x = $('.artboard-background').position().left
          y = $('.artboard-background').position().top
          if (img.objFrom !== 'upload') {
            drawPaper.canvas.getObjects()[0].set({
              left: x,
              top: y,
              selectable: false,
              objType: 'paperBG',
              objFrom: 'product',
            }).scale(width / drawPaper.canvas.getObjects()[0].width);
          }
          else {
            let ratio,offset
            //橫式圖 或 1:1圖
            if (img.width >= img.height) {
              ratio = width / img.width
              offset = (height - (img.height * ratio)) / 2
              y = y + offset
            }
            //直式圖
            else if(img.width < img.height) {
              ratio = height / img.height
              offset = (width - (img.width * ratio)) / 2
              x = x + offset
            }
            drawPaper.canvas.getObjects()[0].set({
              left: x,
              top: y,
              selectable: false,
              objType: 'paperBG',
              objFrom: 'upload'
            }).scale(ratio);
          }
          drawPaper.canvas.renderAll()
        })
        // 在做下一步時把目前狀態 push 到 undo 陣列
        drawPaper.data.undo.push(drawPaper.data.state)
        drawPaper.data.state = redoLastJSON
        break;
    }
  })
}

//畫布最大化
function maximize() {
  $('.toolbar-top .maximize').on('click', function () {
    $('.all-wrapper').toggleClass('extend')
    paperMinimize(canvasName)
  })
}

//畫布切換
function drawPaperSwitch(page) {
  const canvas = customizedCanvas[page].canvas
  canvas.discardActiveObject()
  canvas.renderAll()
  $('.drawing-paper.show').animate({
    opacity: '0',
  }, 300, function () {
      //淡出結束後
      $('.bg-select .item').removeClass('active')
      $(`.bg-select .item[data-page="${page}"]`).addClass('active selected')
      $(`.drawing-paper`).removeClass('show')
      $(`.drawing-paper`).css('z-index', '-1')
      $('.drawing-paper').css('opacity','1')
      $(`.drawing-paper[data-page="${page}"]`).css({
        'z-index': '1'
      }).addClass('show')
      switch (page) {
        case 'default':
          const defaultName = $('.product-name span:nth-child(2)').attr('data-default')
          $('.product-name span:nth-child(2)').text(defaultName)
          break;
        case 'attached1':
          $('.product-name span:nth-child(2)').text('Attached file-1')
          break;
        case 'attached2':
          $('.product-name span:nth-child(2)').text('Attached file-2')
          break;
      }
      const paper = $('.drawing-paper.show')
      const objects = canvas.getObjects()
      paper.removeClass('move')
      canvas.isDrawingMode = false
      canvas.selection = false
      canvas.freeDrawingBrush.color = commonSetting.fillColor
      canvas.freeDrawingBrush.width = commonSetting.brushWidth
      customizedCanvas[page].cursorCanvas._objects[0].set({
        fill: commonSetting.fillColor
      })
      if (objects.length >= 1) {
        objects.forEach(function (el) {
          if (el.objType === 'paperBG') {
            el.selectable = false;
          }
          else {
            el.selectable = true;
          }
        })
        canvas.renderAll();
      }
      switch (activeTool) {
        case 'select':
          canvas.selection = true
          canvas.defaultCursor = 'default';
          break;
        case 'move':
          moveMode = true
          paper.addClass('move')
          if (objects.length >= 1) {
            objects.forEach(function (el) {
              if (el.objType === 'paperBG') {
                el.selectable = false;
              }
              else {
                el.selectable = true;
              }
            })
            canvas.renderAll();
          }
          break;
        case 'brush':
          canvas.isDrawingMode = true
          selectable = true
          break;
        case 'text':
          selectable = false
          canvas.getObjects()[0].hoverCursor = 'text';
          canvas.defaultCursor = 'text';
          break;
        case 'shape':
          selectable = false
          canvas.getObjects()[0].hoverCursor = 'crosshair';
          canvas.defaultCursor = 'crosshair';
          break;
        case 'line':
          selectable = false
          canvas.getObjects()[0].hoverCursor = 'crosshair';
          canvas.defaultCursor = 'crosshair';
          break;
      }
  })
}

//選擇畫布背景
function selectPaperHandler() {
  $('.bg-select .item').on('click', function () {
    const _click = $(this)
    const paperName = _click.attr('data-page')
    //如果已經有背景則切換畫布，沒有則打開選擇背景畫面
    if (_click.hasClass('selected')) {
      if (!$(`.drawing-paper[data-page="${paperName}"]`).css('opacity') == '0') {
        drawPaperSwitch(paperName)
      }
    }
    else {
      $('.visual-range .select-background').attr('data-id', paperName)
      if (!$('.visual-range .select-background').is(":visible")) {
        $('.visual-range .select-background').css('display', 'flex').hide().fadeIn(300)
      }
      if ($('.favorite-block').is(":visible")) {
        $('.favorite-block').fadeOut(300).promise().done(function () {
          $('.remark-block').show()
          $('.select-from > div:not(.favorite)').show()
          $('.select-background .back-btn').show()
        })
      }
    }
  })
}

//上傳畫布背景
function selectBGHandler() {
  $('.visual-range .select-background .back-btn').on('click', function () {
    if (!$('.select-from .item.upload').is(':visible')) {
      $('.favorite-block').fadeOut(300).promise().done(function () {
        $('.remark-block').show()
        $('.select-from > div:not(.favorite)').show()
      })
    }
    else {
      $('.visual-range .select-background').fadeOut(300)
    }
  })

  $('#uploadBG').change(function () {
    const paperName = $('.visual-range .select-background').attr('data-id')
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      const img = new Image()
      const _URL = window.URL || window.webkitURL;
      const objectUrl = _URL.createObjectURL(this.files[0])
      reader.onload = function (e) {
        img.onload = function () {
          addPaperBackground(paperName,e.target.result,'upload')
          $(`.bg-select .item[data-page="${paperName}"]`).css('background-image', 'url(' + e.target.result + ')')
          $('.visual-range .select-background').fadeOut(300)
          drawPaperSwitch(paperName)
          _URL.revokeObjectURL(objectUrl);
        }
        img.src = objectUrl
      }
      reader.readAsDataURL(this.files[0]);
    }
  });

  $('.select-background .select-from .item.favorite').on('click', function () {
    const window_w = $(window).outerWidth()
    $('.select-background .select-from > div').not(this).hide()
    $('.remark-block').fadeOut(300).promise().done(function () {
      $('.favorite-block').show()
      if ($('.all-wrapper').hasClass('extend') || window_w < 1366) {
        $('.select-background').hide()
        $('.other-wrap').addClass('overlay select-product')
        $('.other-wrap').css('z-index', '5')
        $('.other-wrap .block').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
          $('.close-favorite').css('z-index', '6')
          $('.other-wrap .block').unbind('transitionend webkitTransitionEnd oTransitionEnd')
        })
      }
    })
  })

  $('.favorite-block').on('click','.product-list .item', function () {
    const window_w = $(window).outerWidth()
    const paperName = $('.visual-range .select-background').attr('data-id')
    const bg = $(this).find('.img-box').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
    addPaperBackground(paperName,bg,'product')
    $(`.bg-select .item[data-page="${paperName}"]`).css('background-image', 'url(' + bg + ')')
    $('.visual-range .select-background').fadeOut(300)
    $('.favorite-block').fadeOut(300).promise().done(function () {
      $('.remark-block').show()
      $('.select-background .select-from > div').show()
      $('.select-background .back-btn').show()
      if ($('.all-wrapper').hasClass('extend') || window_w < 1366) {
        $('.other-wrap').removeClass('overlay select-product')
        $('.other-wrap .block').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
          $('.close-favorite').css('z-index', '')
          $('.other-wrap').css('z-index','')
          $('.other-wrap .block').unbind('transitionend webkitTransitionEnd oTransitionEnd')
        })
      }
      else {
        $('.select-background .select-from > div:not(.favorite)').show()
        $('.select-background .back-btn').show()
      }
    })
    drawPaperSwitch(paperName)
  })
}

//刪除畫布
function deletePaper() {
  $('.delete-paper').on('click', function (e) {
    e.stopPropagation()
    const page = $(this).parents('.item').attr('data-page')
    switch (page) {
      case 'attached1':
        $('.paper-delete-check .title .paper-name').attr('data-name', 'Attached file-1')
        break;
      case 'attached2':
        $('.paper-delete-check .title .paper-name').attr('data-name', 'Attached file-2')
        break;
    }
    $('.paper-delete-check').attr('data-page', page).fadeIn(300)
  })
  $('.paper-delete-check .btn-group .btn.no').on('click', function () {
    $('.paper-delete-check').fadeOut(300)
  })
  $('.paper-delete-check .btn-group .btn.yes').on('click', function () {
    const page = $(this).parents('.paper-delete-check').attr('data-page')
    $('.paper-delete-check').fadeOut(300)
    customizedCanvas[page].canvas.clear()
    $(`.drawing-paper[data-page="${page}"]`).removeClass('paper-initialize')
    $(`.bg-select .item[data-page="${page}"]`).css('background-image', '').removeClass('selected active')
    $('#uploadBG').val('')
    switch (page) {
      case 'attached1':
        drawPaperSwitch('default')
        break;
      case 'attached2':
        if ($('.bg-select .item[data-page="attached1"]').hasClass('selected')) {
          drawPaperSwitch('attached1')
        } else {
          drawPaperSwitch('default')
        }
        break;
    }
  })
}

//畫布放大縮小
function paperScaleHandler() {
  const centerX = $('.artboard-background').position().left + $('.artboard-background').innerWidth() / 2
  const centerY = $('.artboard-background').position().top + $('.artboard-background').innerHeight() / 2
  let isMax = 0
  let isMin = 1
  $('.toolbar-left .zoom').on('click', function () {
    const option = $(this).attr('data-option')
    const limitAlert = $(this).attr('data-alert')
    paper =  $('.drawing-paper.show');
    const nowPaper = paper.attr('data-page')
    switch (option) {
      //放大
      case 'zoom-in':
        if (nowScale + 0.2 < 1.8) {
          nowScale += 0.2
        }
        else if(nowScale + 0.2 > 1.8){
          nowScale = 1.8
          isMax += 1
          if (isMax > 1) {
            alert(limitAlert)
          }
        }
        isMin = 0
        customizedCanvas[nowPaper].canvas.zoomToPoint({ x: centerX, y: centerY }, nowScale);
        customizedCanvas[nowPaper].cursorCanvas.zoomToPoint({ x: centerX, y: centerY }, nowScale);
        break;
      //縮小
      case 'zoom-out':
        //可視寬度
        const visualWidth = visualRange.width()
        //可視高度
        const visualHeight = visualRange.height()
        //可視範圍比例
        const visualRatio = roundDecimal(visualHeight / visualWidth * 100, 2)
        const paperWidth = customizedCanvas[nowPaper].canvas.width
        const paperHeight = customizedCanvas[nowPaper].canvas.height
        const paperRatio = roundDecimal(paperHeight / paperWidth * 100, 2)
        if(paperWidth * (nowScale - 0.2) > visualWidth && paperHeight * (nowScale - 0.2) > visualHeight){
          nowScale -= 0.2
        }
        else {
          if(visualRatio < paperRatio){
            nowScale = visualWidth / paperWidth
          }
          else{
            nowScale = visualHeight / paperHeight
          }
          isMin += 1
          if (isMin > 1) {
            alert(limitAlert)
          }
        }
        isMax = 0
        customizedCanvas[nowPaper].canvas.zoomToPoint({ x: centerX, y: centerY }, nowScale);
        customizedCanvas[nowPaper].cursorCanvas.zoomToPoint({ x: centerX, y: centerY }, nowScale);
        break;
    }
  })
}
// })()