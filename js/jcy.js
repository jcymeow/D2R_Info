/**
 * @author jcy
 * @mail 20970736@qq.com
 * @date 2025-5-22
 */
Array.prototype.remove = function(value) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (this[i] === value) {
      this.splice(i, 1); // 原地删除
      break; // 只删除一个
    }
  }
  return this; // 链式调用支持
};

Array.prototype.removeAll = function(values) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (values.includes(this[i])) {
      this.splice(i, 1);
    }
  }
  return this;
};

Array.prototype.replace = function(values, newValue){
  let index = -1;
  for (let i = this.length - 1; i >= 0; i--) {
    if (values.includes(this[i])) {
      index = i;
      this.splice(i, 1);
    }
  }
  if(index > -1)this.splice(index, 0, newValue);
  return this;
}

Array.prototype.includesAll = function(array){
  return array.every(item => this.includes(item));
}

function normalizeSkillName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function clone(object){
  return JSON.parse(JSON.stringify(object));
}

function saveData(key, value) {
  localStorage.setItem(key, value);
}

// 读取数据
function loadData(key) {
  return localStorage.getItem(key) || '';
}