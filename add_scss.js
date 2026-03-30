const fs = require('fs');

const filePath = 'c:\\frontend\\bib-pc\\src\\views\\swap\\SwapIndex.vue';
let content = fs.readFileSync(filePath, 'utf-8');

const scss = `
/* New Trade Panel UI */
.new-trade-panel {
  background-color: #0b0e11 !important;
  color: #fff;
  padding: 10px 0;
  border-left: 1px solid #1a1a1a;
}
.trade-panel-inner {
  padding: 0 15px;
}

.trade-tabs {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #1a1a1a;
}
.trade-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 16px;
  color: #888;
  cursor: pointer;
  position: relative;
}
.trade-tab.active {
  color: #fff;
  font-weight: bold;
}
.trade-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 10%;
  width: 80%;
  height: 2px;
  background-color: #fff;
}

.margin-leverage-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 15px;
}
.ml-dropdown {
  flex: 1;
  background-color: #1a1a1a;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.ml-dropdown.green-text { color: #b5d820; }
.ml-dropdown.red-text { color: #f6465d; }
.ml-dropdown .arrow { font-size: 10px; transform: scale(0.8); }

.order-types-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 13px;
}
.order-type-item {
  color: #888;
  margin-right: 15px;
  cursor: pointer;
}
.order-type-item.active {
  color: #fff;
  font-weight: bold;
}
.order-type-icon {
  margin-left: auto;
  cursor: pointer;
}

.available-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-bottom: 15px;
}
.available-row .value { color: #fff; font-weight: bold; }

.input-box-wrapper { margin-bottom: 15px; }
.input-box {
  display: flex;
  background-color: #1a1a1a;
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
}
.input-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}
.input-box input:disabled { color: #888; }
.input-box .suffix {
  padding: 0 12px;
  color: #888;
  font-size: 12px;
}
.input-box .suffix-dropdown {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.slider-wrapper {
  margin-bottom: 20px;
  padding: 0 5px;
}
.slider-track-container {
  padding: 10px 0;
}
.slider-track {
  height: 4px;
  background-color: #2a2a2a;
  border-radius: 2px;
  position: relative;
}
.slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #b5d820;
  border-radius: 2px;
}
.slider-points {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.slider-points .point {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #2a2a2a;
  border: 3px solid #0b0e11;
  cursor: pointer;
  z-index: 2;
  transform: translateY(0);
}
.slider-points .point.active { background-color: #fff; border-color: #b5d820; }
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #888;
  margin-top: 5px;
}

.tpsl-row { margin-bottom: 20px; font-size: 12px; }
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.custom-checkbox input { display: none; }
.checkmark {
  width: 14px;
  height: 14px;
  border: 1px solid #333;
  border-radius: 2px;
  margin-right: 8px;
  display: inline-block;
  position: relative;
}
.custom-checkbox input:checked + .checkmark {
  background-color: #b5d820;
  border-color: #b5d820;
}
.custom-checkbox input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid #000;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.label-text { color: #fff; }

.submit-btn-row { margin-bottom: 20px; }
.submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  color: #000;
}
.submit-btn.green-bg { background-color: #b5d820; }
.submit-btn.red-bg { background-color: #f6465d; color: #fff; }

.assets-section {
  border-top: 1px solid #1a1a1a;
  padding-top: 15px;
  margin-bottom: 15px;
}
.assets-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #fff;
  margin-bottom: 15px;
  cursor: pointer;
}
.assets-header .right { color: #888; font-size: 12px; }
.asset-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 10px;
}
.asset-item .label { color: #888; }
.asset-item .value { color: #fff; }
.assets-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.assets-actions .action-btn {
  flex: 1;
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.contract-info-section {
  border-top: 1px solid #1a1a1a;
  padding-top: 15px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
`;

content = content.replace('</style>', scss + '\n</style>');
fs.writeFileSync(filePath, content);
console.log("SCSS added");
