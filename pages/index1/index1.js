// pages/index/index.js
const QQMapWX = require('../../libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.min.js');

Page({
  data: {
    currentTab: 0,
    // 初始地图中心点坐标（宁波财经学院）
    longitude: 121.544379,
    latitude: 29.874412,
    // 地图缩放级别（建议14-18之间）
    scale: 16,
    // 初始标记点（学校位置）
    markers: [{
      id: 0,
      longitude: 121.544379,
      latitude: 29.874412,
      iconPath: '/assets/icons/marker.png',
      width: 30,
      height: 30,
      title: '宁波财经学院'
    }],
    polyline: [],
    campusBuildings: [],
    // 新增：控制地图显示状态
    showMap: false
  },

  onLoad() {
    // 重要改动1：统一从app.js获取地图实例
    this.qqmapsdk = getApp().qqmapsdk;
    
    // 初始化地图显示
    this.initMap();
    
    // 添加调试信息
    console.log('地图SDK初始化完成', this.qqmapsdk);
  },

  // 新增：地图初始化方法
  initMap() {
    // 先显示加载中
    wx.showLoading({ title: '地图加载中' });
    
    // 确保DOM渲染完成
    setTimeout(() => {
      // 重要改动2：先检查基础数据
      if (!this.checkMapData()) {
        this.setDefaultLocation();
      }
      
      // 重要改动3：显示地图容器
      this.setData({ showMap: true }, () => {
        wx.hideLoading();
        // 获取定位
        this.getUserLocation();
        // 加载校园建筑
        this.loadCampusPOI();
      });
    }, 500);
  },
  
  // 新增：检查地图基础数据
  checkMapData() {
    return this.data.longitude && this.data.latitude;
  },
  
  // 设置默认位置（当定位失败时使用）
  setDefaultLocation() {
    this.setData({
      longitude: 121.544379,
      latitude: 29.874412,
      markers: [{
        id: 0,
        longitude: 121.544379,
        latitude: 29.874412,
        iconPath: '/assets/icons/marker.png',
        title: '默认位置'
      }]
    });
    wx.showToast({ title: '已显示默认位置', icon: 'none' });
  },

  // 修改后的定位方法（带权限检查和失败处理）
  getUserLocation() {
    // 先检查权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          this.requestLocationPermission();
          return;
        }
        
        // 重要改动4：添加超时机制
        const locationTimer = setTimeout(() => {
          wx.hideLoading();
          wx.showToast({ title: '定位超时', icon: 'none' });
        }, 8000);
        
        // 发起定位
        wx.getLocation({
          type: 'gcj02',
          altitude: true,
          success: (res) => {
            clearTimeout(locationTimer);
            this.updateLocation(res);
          },
          fail: (err) => {
            clearTimeout(locationTimer);
            console.error("定位失败", err);
            wx.showToast({ title: '获取位置失败', icon: 'none' });
            this.setDefaultLocation();
          }
        });
      }
    });
  },
  
  // 新增：请求定位权限
  requestLocationPermission() {
    wx.showModal({
      title: '权限申请',
      content: '需要获取您的位置信息展示地图',
      success: (res) => {
        if (res.confirm) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => this.getUserLocation(),
            fail: () => this.setDefaultLocation()
          });
        } else {
          this.setDefaultLocation();
        }
      }
    });
  },
  
  // 新增：更新位置信息
  updateLocation(res) {
    const newMarker = {
      id: 0,
      longitude: res.longitude,
      latitude: res.latitude,
      iconPath: '/assets/icons/current-location.png',
      width: 30,
      height: 30,
      title: '我的位置'
    };
    
    this.setData({
      longitude: res.longitude,
      latitude: res.latitude,
      scale: 18, // 定位成功时放大级别
      markers: [newMarker]
    });
    
    this.reverseGeocoder(res.latitude, res.longitude);
  },

  // 逆地理编码
  reverseGeocoder(latitude, longitude) {
    this.qqmapsdk.reverseGeocoder({
      location: { latitude, longitude },
      success: (res) => {
        console.log('逆地理编码结果:', res.result);
        wx.setStorageSync('lastLocation', res.result);
      },
      fail: (err) => {
        console.error('逆地理编码失败', err);
      }
    });
  },

  // 加载校园POI数据
  loadCampusPOI() {
    this.qqmapsdk.search({
      keyword: '宁波财经学院 教学楼',
      region: '宁波',
      page_size: 10,
      success: (res) => {
        if (res.data && res.data.length) {
          const buildings = res.data.map((item, i) => ({
            id: 100 + i,
            longitude: item.location.lng,
            latitude: item.location.lat,
            iconPath: '/assets/icons/building.png',
            title: item.title,
            width: 25,
            height: 25,
            // 新增callout显示
            callout: {
              content: item.title,
              color: '#333',
              fontSize: 12,
              bgColor: '#fff',
              padding: 5,
              borderRadius: 4,
              display: 'ALWAYS'
            }
          }));
          
          this.setData({ 
            campusBuildings: buildings,
            markers: [...this.data.markers, ...buildings] 
          });
        }
      },
      fail: (err) => {
        console.error('加载POI失败', err);
      }
    });
  },

  // 地图搜索
  handleSearch(e) {
    const keyword = e.detail.value.trim();
    if (!keyword) return;
    
    wx.showLoading({ title: '搜索中' });
    
    this.qqmapsdk.search({
      keyword: keyword,
      location: `${this.data.latitude},${this.data.longitude}`,
      page_size: 5,
      success: (res) => {
        wx.hideLoading();
        if (res.data && res.data.length) {
          const resultMarkers = res.data.map((item, i) => ({
            id: 200 + i,
            longitude: item.location.lng,
            latitude: item.location.lat,
            iconPath: '/assets/icons/search-marker.png',
            title: item.title,
            width: 24,
            height: 24
          }));
          
          this.setData({ 
            markers: resultMarkers,
            // 移动到第一个结果
            longitude: res.data[0].location.lng,
            latitude: res.data[0].location.lat,
            scale: 18
          });
        } else {
          wx.showToast({ title: '无搜索结果', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '搜索失败', icon: 'none' });
      }
    });
  },
  
  // 标记点点击事件
  onMarkerTap(e) {
    const markerId = e.markerId;
    const target = [...this.data.markers, ...this.data.campusBuildings]
                  .find(item => item.id === markerId);
    
    if (target) {
      wx.showModal({
        title: target.title || '位置详情',
        content: `坐标：${target.latitude},${target.longitude}`,
        showCancel: false
      });
      
      // 点击时居中和放大
      this.setData({
        longitude: target.longitude,
        latitude: target.latitude,
        scale: 18
      });
    }
  },
  
  // 地图视野变化事件
  onRegionChange(e) {
    console.log('地图视野变化', e);
  }
});
