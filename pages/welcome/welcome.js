// pages/welcome/welcome.js
Page({
  data: {
    logoAnimation: {},
    welcomeTextAnimation: {}
  },

  onLoad() {
    this.playLogoAnimation();
  },

  playLogoAnimation() {
    const animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease-out'
    });

    animation.opacity(1).rotate(360).step();

    this.setData({
      logoAnimation: animation.export()
    });

    // 文字渐显效果
    setTimeout(() => {
      const textAnimation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease-in'
      });

      textAnimation.opacity(1).step();

      this.setData({
        welcomeTextAnimation: textAnimation.export()
      });
    }, 800);
  },

  openWebsite() {
    wx.navigateTo({
      url: '/pages/webpage/webpage'
    });
  },

  navigateToLanguage() {
    wx.navigateTo({
      url: '/pages/language/language'
    });
  },

  startApp() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  }
});
