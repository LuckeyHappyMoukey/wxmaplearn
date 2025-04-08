const QQMapWX = require('/libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');
App({
    onLaunch() {
      // 合并原有的两个onLaunch
    //   this.initEventBus();
    //   this.initLanguageSystem();
       // 初始化地图SDK
  this.qqmapsdk = new QQMapWX({ 
    key: 'VMJBZ-IQ36Q-XGK5G-2ECUP-MDIO6-REBEF' 
  });
      // 原有的日志和登录逻辑
      const logs = wx.getStorageSync('logs') || [];
      logs.unshift(Date.now());
      wx.setStorageSync('logs', logs);
      
      wx.login({ success: res => {} });
    },
  
    // 规范的事件总线
    initEventBus() {
      this.eventBus = {
        _events: {},
        on(event, callback) {
          (this._events[event] || (this._events[event] = [])).push(callback);
        },
        emit(event, data) {
          (this._events[event] || []).forEach(cb => cb(data));
        }
      };
    },
  
    // 语言系统增强
    initLanguageSystem() {
      const lang = wx.getStorageSync('appLanguage') || 'zh-CN';
      this.loadLanguagePack(lang).then(pack => {
        this.globalData = {
          currentLanguage: lang,
          i18n: pack // 全局语言包
        };
      });
    },
  
    // 动态加载语言包
    loadLanguagePack(lang) {
      return new Promise(resolve => {
        try {
          const pack = require(`./locales/${lang}.json`);
          resolve(pack);
        } catch {
          console.warn(`语言包${lang}加载失败，使用中文`);
          const pack = require('./locales/zh-CN.json');
          resolve(pack);
        }
      });
    }
  })
  