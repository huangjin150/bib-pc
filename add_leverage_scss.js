const fs = require('fs');

const filePath = 'c:\\frontend\\bib-pc\\src\\views\\swap\\SwapIndex.vue';
let content = fs.readFileSync(filePath, 'utf-8');

const scss = `
/* Leverage Modal UI */
.custom-leverage-modal .ivu-modal-content {
  background-color: #1a1a1a !important;
  border-radius: 8px;
  color: #fff;
}
.custom-leverage-modal .ivu-modal-header,
.custom-leverage-modal .ivu-modal-footer {
  display: none !important;
}
.custom-leverage-modal .ivu-modal-body {
  padding: 0;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #2a2a2a;
}
.modal-header .title {
  font-size: 16px;
  font-weight: bold;
}
.modal-header .close-icon {
  cursor: pointer;
}

.leverage-content {
  padding: 24px;
}
.info-tags {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}
.info-tags .symbol {
  font-size: 16px;
  font-weight: bold;
}
.info-tags .tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.info-tags .tag.gray {
  background-color: #2a2a2a;
  color: #ccc;
}
.info-tags .tag.green {
  background-color: rgba(181, 216, 32, 0.1);
  color: #b5d820;
}
.info-tags .tag.red {
  background-color: rgba(246, 70, 93, 0.1);
  color: #f6465d;
}

.leverage-input-box {
  background-color: #2a2a2a;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 30px;
}
.leverage-input-box input {
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  outline: none;
}
.leverage-input-box input::-webkit-outer-spin-button,
.leverage-input-box input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.custom-range-slider {
  position: relative;
  margin-bottom: 30px;
}
.range-input {
  width: 100%;
  position: absolute;
  top: -8px;
  left: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
  height: 20px;
}
.range-track {
  height: 4px;
  background-color: #333;
  border-radius: 2px;
  position: relative;
}
.range-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #b5d820;
  border-radius: 2px;
}
.range-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2px;
  background-color: transparent;
}
.thumb-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #fff;
  border: 3px solid #000;
  box-sizing: border-box;
}
.range-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #888;
}

.leverage-quick-select {
  display: flex;
  align-items: center;
  background-color: #2a2a2a;
  border-radius: 24px;
  padding: 4px;
  margin-bottom: 30px;
}
.quick-items {
  display: flex;
  flex: 1;
  overflow-x: auto;
  gap: 4px;
  scrollbar-width: none;
}
.quick-items::-webkit-scrollbar { display: none; }
.quick-item {
  padding: 8px 16px;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.quick-item.active {
  background-color: #b5d820;
  color: #000;
  font-weight: bold;
}
.scroll-arrow {
  padding: 0 12px;
  color: #fff;
  cursor: pointer;
}

.leverage-info-text {
  font-size: 13px;
  color: #aaa;
  line-height: 2;
  margin-bottom: 30px;
}
.leverage-info-text .link {
  color: #b5d820;
  cursor: pointer;
  margin-top: 8px;
}

.leverage-footer-btns {
  display: flex;
  gap: 15px;
}
.leverage-footer-btns button {
  flex: 1;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}
.btn-cancel {
  background-color: #2a2a2a;
  color: #fff;
}
.btn-confirm {
  background-color: #b5d820;
  color: #000;
}
`;

content = content.replace('</style>', scss + '\n</style>');
fs.writeFileSync(filePath, content);
console.log("Leverage SCSS added");
