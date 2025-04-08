// pages/language/language.js
Page({
    data: {
      activeLanguage: 'zh-CN',
      languages: [
        {
          code: 'zh-CN',
          original: '中文',
          translated: '简体中文'
        },
        {
          code: 'en-US',
          original: 'English',
          translated: '英语'
        },
        {
          code: 'ja-JP',
          original: '日本語',
          translated: '日语'
        },
        {
          code: 'de-DE',
          original: 'Deutsch',
          translated: '德语'
        },
        {
          code: 'sk-SK',
          original: 'Slovenčina',
          translated: '斯洛伐克语'
        },
        {
          code: 'hu-HU',
          original: 'Hungarian',
          translated: '匈牙利语'
        }
      ]
    },
  
    onLoad() {
      // 获取当前语言设置
      const currentLang = wx.getStorageSync('appLanguage') || 'zh-CN';
      this.setData({
        activeLanguage: currentLang
      });
    },
  
    goBack() {
      wx.navigateBack();
    },
  
    selectLanguage(e) {
      const selectedLang = e.currentTarget.dataset.code;
      
      // 震动反馈
      wx.vibrateShort({ type: 'light' });
      
      // 更新UI
      this.setData({ activeLanguage: selectedLang });
      
      // 保存语言设置
      wx.setStorageSync('appLanguage', selectedLang);
      
      // 显示成功提示
      wx.showToast({
        title: '语言切换成功！',
        icon: 'success',
        duration: 1500
      });
      
      // 延迟返回
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  });
  