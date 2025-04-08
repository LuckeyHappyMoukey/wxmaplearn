Page({
    data: {
    //     // 增加i18n数据字段
    // i18n: {
    //     categories: [], 
    //     buttons: {}
    //   },
      logoAnimation: {},
      showGuide: false,
      sceneCategories: [
        {
          id: 'new-students',
          title: '新生必达',
          icon: '/assets/icons/new-student.png',
          items: [
            { name: '报到点', icon: '/assets/icons/check-in.png' },
            { name: '宿舍区', icon: '/assets/icons/dorm.png' },
            { name: '教务处', icon: '/assets/icons/office.png' }
          ]
        },
        {
          id: 'study',
          title: '学习导航',
          icon: '/assets/icons/study.png',
          items: [
            { name: '教学楼', icon: '/assets/icons/building.png' },
            { name: '实验室', icon: '/assets/icons/lab.png' },
            { name: '自习区', icon: '/assets/icons/study-room.png' }
          ]
        },
        {
          id: 'life',
          title: '生活服务',
          icon: '/assets/icons/life.png',
          items: [
            { name: '食堂', icon: '/assets/icons/canteen.png' },
            { name: '校医院', icon: '/assets/icons/hospital.png' },
            { name: '快递点', icon: '/assets/icons/express.png' }
          ]
        }
      ]
    },
  
    onLoad() {
    //      // 初始化语言
    // this.updateLanguage();
    
    // // 监听语言变化
    // getApp().eventBus.on('languageChanged', this.updateLanguage.bind(this));
    
      this.playLogoAnimation();

      
      // 检查是否首次使用，是则自动显示新生指南
      const isFirstTime = !wx.getStorageSync('hasVisited');
      if (isFirstTime) {
        this.setData({ showGuide: true });
        wx.setStorageSync('hasVisited', true);
      }
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
  
    toggleGuide() {
      this.setData({
        showGuide: !this.data.showGuide
      });
    },
  
    handleSearch(value) {
      wx.navigateTo({
        url: `/pages/search/result?keyword=${value}`
      });
    },
  
    handleVoiceInput() {
      wx.showModal({
        title: '语音输入',
        content: '即将调用语音识别功能',
        confirmText: '确定',
        showCancel: false
      });
    },
  
    handleSceneItemTap(e) {
      const { category, item } = e.detail;
      wx.navigateTo({
        url: `/pages/place/list?category=${category}&filter=${item}`
      });
    },
  
    open3DMap() {
      wx.navigateTo({
        url: '/pages/map/3d'
      });
    },
  
    startARNavigation() {
      wx.showToast({
        title: '准备启动AR导航',
        icon: 'none'
      });
      
      // 实际项目中会调用AR接口
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/map/ar'
        });
      }, 1000);
    },
  
    showEmergencyHelp() {
      wx.navigateTo({
        url: '/pages/emergency/login'
      });
    },
  
    openCollection() {
      wx.navigateTo({
        url: '/pages/user/collection'
      });
    },
  
    // 双击地图彩蛋
    onMapDoubleClick() {
      wx.navigateTo({
        url: '/pages/game/mascot'
      });
    },

    // 跳转“隐私政策”界面
navigateToPrivacy() {
    wx.navigateTo({
      url: '/pages/secret/secret'
    });
  },
  // 添加跳转语言切换界面
navigateToLanguage() {
    wx.navigateTo({
      url: '/pages/language/language'
    });
  },
  
  // 更新语言方法
  updateLanguage() {
    const app = getApp();
    this.setData({
      i18n: {
        categories: this.mapCategories(app.globalData.i18n.categories),
        buttons: app.globalData.i18n.buttons
      }
    });
  },
  // 转换分类数据
  mapCategories(i18nCategories) {
    return this.data.sceneCategories.map(cat => ({
      ...cat,
      title: i18nCategories[cat.id]?.title || cat.title,
      items: cat.items.map(item => ({
        ...item,
        name: i18nCategories[cat.id]?.items?.[item.name] || item.name
      }))
    }));
  }

  });
  