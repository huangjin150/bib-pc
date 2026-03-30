const fs = require('fs');

const filePath = 'c:\\frontend\\bib-pc\\src\\views\\swap\\SwapIndex.vue';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace old SCSS block with the new one
const oldScssRegex = /\/\* Leverage Modal UI \*\/[\s\S]*?\.btn-confirm \{\n  background-color: #b5d820;\n  color: #000;\n\}/;
const newScss = `/* Leverage Modal UI */
.custom-leverage-modal .ivu-modal-content {
  background-color: #1a1a1a !important;
  border-radius: 8px;
  color: #fff;
}
.custom-leverage-modal .ivu-modal-header {
  border-bottom: 1px solid #2a2a2a;
}
.custom-leverage-modal .ivu-modal-header-inner {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}
.custom-leverage-modal .ivu-modal-close .ivu-icon-ios-close {
  color: #888;
}

.leverage-custom-content {
  padding: 10px 0;
}

.leverage-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.symbol-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
.mode-tag {
  background-color: #2a2a2a;
  color: #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.direction-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.direction-tag.green {
  background-color: rgba(181, 216, 32, 0.1);
  color: #b5d820;
}
.direction-tag.red {
  background-color: rgba(246, 70, 93, 0.1);
  color: #f6465d;
}
.leverage-tag {
  background-color: rgba(181, 216, 32, 0.1);
  color: #b5d820;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.leverage-input-wrapper {
  margin-bottom: 24px;
}
.leverage-input-wrapper .ivu-input-number {
  background-color: #2a2a2a;
  border: none;
  border-radius: 6px;
}
.leverage-input-wrapper .ivu-input-number-input {
  background-color: transparent;
  color: #fff;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  height: 48px;
  line-height: 48px;
}
.leverage-input-wrapper .ivu-input-number-handler-wrap {
  display: none; /* Hide up/down arrows for cleaner look */
}
.discrete-leverage-display {
  background-color: #2a2a2a;
  color: #fff;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  height: 48px;
  line-height: 48px;
  border-radius: 6px;
}

.leverage-slider-wrapper {
  margin-bottom: 30px;
}
.custom-range-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;
  margin-bottom: 10px;
}
.custom-range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #000;
  cursor: pointer;
  box-shadow: 0 0 0 2px #b5d820;
}
.range-labels {
  display: flex;
  justify-content: space-between;
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

.leverage-details {
  font-size: 13px;
  color: #aaa;
  line-height: 2;
}
.detail-row {
  display: flex;
  gap: 10px;
}
.detail-row .val {
  color: #fff;
  font-weight: bold;
}
.detail-link {
  color: #b5d820;
  cursor: pointer;
  margin-top: 8px;
}

.custom-modal-footer {
  display: flex;
  gap: 15px;
  padding-top: 10px;
}
.custom-modal-footer .btn-cancel,
.custom-modal-footer .btn-confirm {
  flex: 1;
  height: 44px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  border: none;
}
.custom-modal-footer .btn-cancel {
  background-color: #2a2a2a !important;
  color: #fff !important;
}
.custom-modal-footer .btn-confirm {
  background-color: #b5d820 !important;
  color: #000 !important;
}`;

if (oldScssRegex.test(content)) {
    content = content.replace(oldScssRegex, newScss);
    console.log("Updated SCSS.");
} else {
    content = content.replace('</style>', newScss + '\n</style>');
    console.log("Appended new SCSS.");
}

fs.writeFileSync(filePath, content);
