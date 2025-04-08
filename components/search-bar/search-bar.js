// // components/search-bar/search-bar.js
// Component({
//     properties: {
//       placeholder: {
//         type: String,
//         value: '搜索地点...'
//       }
//     },
  
//     data: {
//       inputValue: '',
//       showVoice: true
//     },
  
//     methods: {
//       onInput(e) {
//         this.setData({ inputValue: e.detail.value });
//         this.triggerEvent('input', { value: e.detail.value });
//       },
  
//       onSearch() {
//         if (this.data.inputValue.trim()) {
//           this.triggerEvent('search', { value: this.data.inputValue });
//         }
//       },
  
//       onVoice() {
//         this.triggerEvent('voice');
//       }
//     }
//   });
  