//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: null, // 用户信息
    imgUrl: ['../img/02.png', '../img/test2.png', '../img/01.png', '../img/04.png',
      '../img/06.png', '../img/03.png', '../img/13.png', '../img/12.png', '../img/11.png'],
    backgroundImgSrc: '',     //从本地获取的背景图片的路径
    tplImgSrc: '',            //校徽模板对应的图片路径
    tempImgUrl: '',
    isShowChooseImg: true,
    isShowContainer: false,
    isShowCanvas: true,
    isShowSuccess: false,
    isShowCheerTime: true,
    cheerTime: '',
  },
    onShow: function () {
      var now = new Date();
      var year = new Date('2020/09/01');
      if (Math.ceil((year.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)) == 0 ) {
        this.setData({
          isShowCheerTime: false,
        })
      }else {this.setData({
        cheerTime: Math.ceil((year.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
        });
      }
  },
  //获取微信头像的事件处理函数
   // 用户点击登录
   bindgetuserinfo:function(e){
    var avatarUrl = e.detail.userInfo.avatarUrl;
    avatarUrl = avatarUrl.split('/');
    if (avatarUrl[avatarUrl.length-1] == 132) {
      avatarUrl[avatarUrl.length - 1] =0;
    }
    avatarUrl=avatarUrl.join("/");
    e.detail.userInfo.avatarUrl = avatarUrl;
     wx.downloadFile({
       url:e.detail.userInfo.avatarUrl,
       success:(res)=>{
          this.setData({
            tempImgUrl : res.tempFilePath
          })
          this.getUserImg(res.tempFilePath)
       }
     })
   },
   getUserImg(res){
     var tempavatraUrl = new Array();
     tempavatraUrl[0] = res;
     this.setData({
       backgroundImgSrc : tempavatraUrl,
     })
     console.log(this.data.backgroundImgSrc)
   },
  //从本地图库选择图片的事件处理函数
  getLocalImg: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success:  (res) => {   //防止this改变
        var tempFilePaths = res.tempFilePaths
        this.setData({
          isShowContainer: true,
          backgroundImgSrc : tempFilePaths,
        })
      }
    })
  },
  //点击校徽模板时调用的函数
  showChooseImg: function (e) {
    if (this.data.isShowChooseImg == false) {
      this.setData({
        isShowChooseImg: true,
      })
    }
    var temp = e.target.dataset;
    this.setData({
      tplImgSrc: temp.img,
    })
  },
  drawAfter:  ()=>  {
    wx.canvasToTempFilePath({
      width: 170,
      heght: 170,
      destWidth: 170 * wx.getSystemInfoSync().pixelRatio,
      destHeight: 170 * wx.getSystemInfoSync().pixelRatio,
      canvasId: 'myCanvas',
      fileType: 'jpg',
      quality: 1,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            wx.showToast({
              title: '保存成功！',
            })
          }
        });
      },
      fail: function (res) {
        console.log(res);
      },
    })
  },
  //点击生成图片时用Canvas将两个图片绘制成Canvas然后保存
  saveImg: function () {
    this.setData({
      isShowCanvas: true,
    });
    setTimeout(() => {
      var context = wx.createCanvasContext('myCanvas');
      context.save();
      context.arc(85, 85, 65, 0, 2 * Math.PI)
      context.clip();
      context.drawImage(this.data.backgroundImgSrc[0], 21, 0, 128, 170);
      context.restore();
      context.drawImage(this.data.tplImgSrc,0,0,170,170 ); 
      context.draw();
      setTimeout(() => {
        this.drawAfter();
      }, 200);
    }, 50)
  },
  
   //转发
 onShareAppMessage: function() {
  let users = wx.getStorageSync('user');
  if (res.from === 'button') {}
  return {
    title: '燕理十五周年校庆',
    path: '/pages/index/index'+users.id,
    success: function() {
      wx.showToast({
        title: '分享成功，感谢您的支持！',
      })
    }
  }
}
})