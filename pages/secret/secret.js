// pages/secret/secret.js
Page({
    // 返回欢迎页
    goBack() {
      wx.navigateBack();
    },
    
    agreePolicy() {
        // 用户点击“同意并继续”，设置存储标记，放置重复弹窗
      wx.setStorageSync('hasAgreedPrivacy', true);
    //   返回上一页
      wx.navigateBack();
    }
  });
  