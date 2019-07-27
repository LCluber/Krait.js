/** MIT License
* 
* Copyright (c) 2015 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://kraitjs.lcluber.com
*/

var Krait = (function (exports) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /** MIT License
  * 
  * Copyright (c) 2018 Ludovic CLUBER 
  * 
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  * http://weejs.lcluber.com
  */

  var Check = function () {
      function Check() {
          _classCallCheck(this, Check);
      }

      _createClass(Check, null, [{
          key: 'isJSON',
          value: function isJSON(str) {
              var json = str.replace(/(\r\n|\n|\r|\t)/gm, '');
              try {
                  json = JSON.parse(str);
              } catch (e) {
                  console.log(e);
                  return false;
              }
              return json;
          }
      }, {
          key: 'isFunction',
          value: function isFunction(func) {
              var getType = {};
              return func && getType.toString.call(func) === '[object Function]';
          }
      }, {
          key: 'isObject',
          value: function isObject(object) {
              return object !== null && (this.isFunction(object) || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object');
          }
      }, {
          key: 'isASCII',
          value: function isASCII(code, extended) {
              return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(code);
          }
      }, {
          key: 'isInteger',
          value: function isInteger(value) {
              return value === parseInt(value, 10);
          }
      }]);

      return Check;
  }();

  var Dom = function () {
      function Dom() {
          _classCallCheck(this, Dom);
      }

      _createClass(Dom, null, [{
          key: 'scrollToBottom',
          value: function scrollToBottom(HtmlElement) {
              HtmlElement.scrollTop = HtmlElement.scrollHeight;
          }
      }, {
          key: 'findById',
          value: function findById(id) {
              return document.getElementById(id);
          }
      }, {
          key: 'showById',
          value: function showById(a) {
              this.findById(a).style.display = 'block';
          }
      }, {
          key: 'hideById',
          value: function hideById(a) {
              this.findById(a).style.display = 'none';
          }
      }, {
          key: 'showOverflow',
          value: function showOverflow() {
              document.body.style.overflow = 'visible';
          }
      }, {
          key: 'hideOverflow',
          value: function hideOverflow() {
              document.body.style.overflow = 'hidden';
          }
      }, {
          key: 'getInputValue',
          value: function getInputValue(a) {
              return this.findById(a).value;
          }
      }, {
          key: 'clearInputValue',
          value: function clearInputValue(a) {
              this.findById(a).value = '';
          }
      }, {
          key: 'focusOn',
          value: function focusOn(a) {
              this.findById(a).focus();
          }
      }, {
          key: 'addHTMLElement',
          value: function addHTMLElement(parentElement, childElementType, childElementOptions) {
              var newElement = document.createElement(childElementType);
              if (childElementOptions !== undefined) {
                  Object.keys(childElementOptions).forEach(function (key) {
                      if (key === 'textContent') {
                          newElement.textContent = childElementOptions[key];
                      } else {
                          newElement.setAttribute(key, childElementOptions[key]);
                      }
                  });
              }
              parentElement.appendChild(newElement);
              return newElement;
          }
      }]);

      return Dom;
  }();

  var Bind = function () {
      function Bind(element, data) {
          _classCallCheck(this, Bind);

          this.data = data;
          this.element = element;
          this.element.value = data;
          this.element.addEventListener('change', this, false);
      }

      _createClass(Bind, [{
          key: 'handleEvent',
          value: function handleEvent(event) {
              switch (event.type) {
                  case 'change':
                      this.change(this.element.value);
              }
          }
      }, {
          key: 'change',
          value: function change(value) {
              this.data = value;
              this.element.value = value;
          }
      }]);

      return Bind;
  }();

  var String = function () {
      function String() {
          _classCallCheck(this, String);
      }

      _createClass(String, null, [{
          key: 'ucfirst',
          value: function ucfirst(string) {
              return string.charAt(0).toUpperCase() + string.slice(1);
          }
      }, {
          key: 'toASCII',
          value: function toASCII(code) {
              return code.charCodeAt(0);
          }
      }]);

      return String;
  }();

  var Ajax = function () {
      function Ajax() {
          _classCallCheck(this, Ajax);
      }

      _createClass(Ajax, null, [{
          key: 'call',
          value: function call(url) {
              var _this = this;

              return new Promise(function (resolve, reject) {
                  var http = new XMLHttpRequest();
                  if (_this.noCache) {
                      url += '?cache=' + new Date().getTime();
                  }
                  http.open(_this.method, url, _this.async);
                  http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                  http.onreadystatechange = function () {
                      if (http.readyState == 4) {
                          if (http.status == 200) {
                              console.log('xhr done successfully (' + url + ')');
                              resolve(http.responseText);
                          } else {
                              console.log('error', 'xhr failed (' + url + ')');
                              reject(http.status);
                          }
                      }
                  };
                  console.log('xhr processing starting (' + url + ')');
                  http.send();
              });
          }
      }]);

      return Ajax;
  }();

  Ajax.method = 'GET';
  Ajax.async = true;
  Ajax.noCache = false;

  var File = function () {
      function File() {
          _classCallCheck(this, File);
      }

      _createClass(File, null, [{
          key: 'load',
          value: function load(path) {
              return Ajax.call(path);
          }
      }, {
          key: 'removeTrailingSlash',
          value: function removeTrailingSlash(path) {
              return path.replace(/\/+$/, '');
          }
      }, {
          key: 'getName',
          value: function getName(path) {
              return path.replace(/^.*[\\\/]/, '');
          }
      }, {
          key: 'getExtension',
          value: function getExtension(path) {
              return path.split('.').pop();
          }
      }, {
          key: 'getDirectory',
          value: function getDirectory(path) {
              return path.replace(/[^\\\/]*$/, '');
          }
      }, {
          key: 'checkExtension',
          value: function checkExtension(extension, validExtensions) {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = validExtensions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var validExtension = _step.value;

                      if (extension === validExtension) {
                          return true;
                      }
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              return false;
          }
      }]);

      return File;
  }();

  var Img = function () {
      function Img() {
          _classCallCheck(this, Img);
      }

      _createClass(Img, null, [{
          key: 'load',
          value: function load(path) {
              return new Promise(function (resolve, reject) {
                  var img = new Image();
                  img.src = path;
                  img.name = File.getName(path);
                  console.log('xhr processing starting (' + path + ')');
                  img.addEventListener('load', function () {
                      console.log('xhr done successfully (' + path + ')');
                      resolve(img);
                  });
                  img.addEventListener('error', function () {
                      console.log('error', 'xhr failed (' + path + ')');
                      reject(new Error('xhr failed (' + path + ')'));
                  });
              });
          }
      }]);

      return Img;
  }();

  var Sound = function () {
      function Sound() {
          _classCallCheck(this, Sound);
      }

      _createClass(Sound, null, [{
          key: 'load',
          value: function load(path) {
              return new Promise(function (resolve, reject) {
                  var snd = new Audio();
                  snd.src = path;
                  console.log('xhr processing starting (' + path + ')');
                  snd.addEventListener('canplaythrough', function () {
                      console.log('xhr done successfully (' + path + ')');
                      resolve(snd);
                  }, false);
                  snd.addEventListener('canplay', function () {
                      console.log('xhr done successfully (' + path + ')');
                      resolve(snd);
                  }, false);
                  snd.addEventListener('error', function () {
                      console.log('error', 'xhr failed (' + path + ')');
                      reject(new Error('xhr failed (' + path + ')'));
                  }, false);
              });
          }
      }]);

      return Sound;
  }();

  function isAscii(code, extended) {
      if (isInteger(code)) {
          return extended && code >= 0 && code <= 255 || code >= 0 && code <= 127;
      }
      return false;
  }
  function isInteger(number) {
      return number === parseInt(number, 10);
  }

  var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /** MIT License
   *
   * Copyright (c) 2015 Ludovic CLUBER
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   * http://mouettejs.lcluber.com
   */

  var LEVELS = {
    info: { id: 1, name: "info", color: "#28a745" },
    trace: { id: 2, name: "trace", color: "#17a2b8" },
    warn: { id: 3, name: "warn", color: "#ffc107" },
    error: { id: 4, name: "error", color: "#dc3545" },
    off: { id: 99, name: "off", color: null }
  };

  function addZero(value) {
    return value < 10 ? "0" + value : value;
  }
  function formatDate() {
    var now = new Date();
    var date = [addZero(now.getMonth() + 1), addZero(now.getDate()), now.getFullYear().toString().substr(-2)];
    var time = [addZero(now.getHours()), addZero(now.getMinutes()), addZero(now.getSeconds())];
    return date.join("/") + " " + time.join(":");
  }

  var Message = function () {
    function Message(level, content) {
      _classCallCheck$1(this, Message);

      this.id = level.id;
      this.name = level.name;
      this.color = level.color;
      this.content = content;
      this.date = formatDate();
    }

    _createClass$1(Message, [{
      key: "display",
      value: function display(groupName) {
        console[this.name]("%c[" + groupName + "] " + this.date + " : ", "color:" + this.color + ";", this.content);
      }
    }]);

    return Message;
  }();

  var Group = function () {
    function Group(name, level) {
      _classCallCheck$1(this, Group);

      this.messages = [];
      this.name = name;
      this.messages = [];
      this._level = level;
    }

    _createClass$1(Group, [{
      key: "info",
      value: function info(message) {
        this.log(LEVELS.info, message);
      }
    }, {
      key: "trace",
      value: function trace(message) {
        this.log(LEVELS.trace, message);
      }
    }, {
      key: "warn",
      value: function warn(message) {
        this.log(LEVELS.warn, message);
      }
    }, {
      key: "error",
      value: function error(message) {
        this.log(LEVELS.error, message);
      }
    }, {
      key: "log",
      value: function log(level, messageContent) {
        var message = new Message(level, messageContent);
        this.messages.push(message);
        if (this._level.id <= message.id) {
          message.display(this.name);
        }
      }
    }, {
      key: "level",
      set: function set(name) {
        this._level = LEVELS.hasOwnProperty(name) ? LEVELS[name] : this._level;
      },
      get: function get() {
        return this._level.name;
      }
    }]);

    return Group;
  }();

  var Logger = function () {
    function Logger() {
      _classCallCheck$1(this, Logger);
    }

    _createClass$1(Logger, null, [{
      key: "setLevel",
      value: function setLevel(name) {
        Logger.level = LEVELS.hasOwnProperty(name) ? LEVELS[name] : Logger.level;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Logger.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var group = _step.value;

            group.level = Logger.level.name;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return Logger.getLevel();
      }
    }, {
      key: "getLevel",
      value: function getLevel() {
        return Logger.level.name;
      }
    }, {
      key: "getGroup",
      value: function getGroup(name) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Logger.groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var group = _step2.value;

            if (group.name === name) {
              return group;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return null;
      }
    }, {
      key: "addGroup",
      value: function addGroup(name) {
        return this.getGroup(name) || this.pushGroup(name);
      }
    }, {
      key: "pushGroup",
      value: function pushGroup(name) {
        var group = new Group(name, Logger.level);
        Logger.groups.push(group);
        return group;
      }
    }]);

    return Logger;
  }();

  Logger.level = LEVELS.error;
  Logger.groups = [];

  var Input = function () {
      function Input(ascii) {
          this.defaultASCII = ascii;
          this.pressed = false;
      }
      Input.prototype.down = function (a) {
          a.preventDefault();
          this.pressed = true;
      };
      Input.prototype.up = function () {
          this.pressed = false;
      };
      return Input;
  }();

  var Command = function () {
      function Command(name, ctrlKeys, asciiCodes, callback, scope) {
          this.name = name;
          this.started = false;
          this.defaultControlKeys = {
              ctrl: ctrlKeys && ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl ? true : false,
              alt: ctrlKeys && ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt ? true : false,
              shift: ctrlKeys && ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift ? true : false
          };
          this.ctrlKeys = {};
          this.setInputs(ctrlKeys, asciiCodes);
          this.callback = callback;
          if (scope) {
              this.callback = this.callback.bind(scope);
          }
          this.log = Logger.addGroup("Krait");
          this.log.info("Added new command " + this.name);
      }
      Command.prototype.start = function (a) {
          if (this.inputs.hasOwnProperty(a.which)) {
              this.inputs[a.which].down(a);
              if (this.inputsLength > 1) {
                  for (var property in this.inputs) {
                      if (this.inputs.hasOwnProperty(property)) {
                          if (!this.inputs[property].pressed) {
                              return false;
                          }
                      }
                  }
              }
              if (this.ctrlKeys.ctrl === a.ctrlKey && this.ctrlKeys.alt === a.altKey && this.ctrlKeys.shift === a.shiftKey) {
                  this.started = true;
                  this.callback(this.started);
                  return this.started;
              }
          }
          return false;
      };
      Command.prototype.stop = function (key) {
          if (this.inputs.hasOwnProperty(key)) {
              this.inputs[key].up();
              if (this.started) {
                  this.started = false;
                  this.callback(this.started);
                  return true;
              }
          }
          return false;
      };
      Command.prototype.setInputs = function (ctrlKeys, asciiCodes) {
          this.inputs = {};
          this.ctrlKeys.ctrl = ctrlKeys && ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl ? true : false;
          this.ctrlKeys.alt = ctrlKeys && ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt ? true : false;
          this.ctrlKeys.shift = ctrlKeys && ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift ? true : false;
          for (var _i = 0, asciiCodes_1 = asciiCodes; _i < asciiCodes_1.length; _i++) {
              var asciiCode = asciiCodes_1[_i];
              if (!this.inputs.hasOwnProperty("asciiCode")) {
                  this.inputs[asciiCode] = new Input(asciiCode);
              }
          }
          this.inputsLength = asciiCodes.length;
      };
      Command.prototype.default = function () {
          this.inputsLength = 0;
          for (var property in this.inputs) {
              if (this.inputs.hasOwnProperty(property)) {
                  var oldInput = this.inputs[property];
                  if (+property !== oldInput.defaultASCII) {
                      this.inputs[oldInput.defaultASCII] = new Input(oldInput.defaultASCII);
                      delete this.inputs[property];
                      this.inputsLength++;
                      this.copyDefaultToCtrls();
                  }
              }
          }
          this.log.info(this.name + " is now set to default");
      };
      Command.prototype.copyDefaultToCtrls = function () {
          this.ctrlKeys = JSON.parse(JSON.stringify(this.defaultControlKeys));
      };
      return Command;
  }();

  var Keyboard = function () {
      function Keyboard() {
          this.initListeners();
          this.commands = [];
          this.log = Logger.addGroup("Krait");
      }
      Keyboard.prototype.initListeners = function () {
          var _this = this;
          document.onkeydown = function (a) {
              _this.down(a);
          };
          document.onkeyup = function (a) {
              _this.up(a);
          };
      };
      Keyboard.prototype.down = function (a) {
          for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
              var command = _a[_i];
              command.start(a);
          }
      };
      Keyboard.prototype.up = function (a) {
          for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
              var command = _a[_i];
              command.stop(a.which);
          }
      };
      Keyboard.prototype.addCommand = function (name, controls, keys, callback, scope) {
          var asciiCodes = this.getAsciiCodes(keys);
          if (asciiCodes) {
              this.commands.push(new Command(name, controls, asciiCodes, callback, scope));
              this.commands = this.sortCommands(this.commands);
              return true;
          }
          return false;
      };
      Keyboard.prototype.setInputs = function (name, ctrlKeys, newKeys) {
          var asciiCodes = this.getAsciiCodes(newKeys);
          if (asciiCodes) {
              var command = this.getCommand(name);
              if (command) {
                  command.setInputs(ctrlKeys, asciiCodes);
                  this.log.info(command.name + " is now set to " + JSON.stringify(newKeys));
                  this.commands = this.sortCommands(this.commands);
                  return true;
              }
          }
          return false;
      };
      Keyboard.prototype.default = function (name) {
          var command = this.getCommand(name);
          if (command) {
              command.default();
              this.commands = this.sortCommands(this.commands);
              return true;
          }
          return false;
      };
      Keyboard.prototype.sortCommands = function (commands) {
          commands.sort(function (a, b) {
              return b.inputsLength - a.inputsLength;
          });
          return commands;
      };
      Keyboard.prototype.getCommand = function (name) {
          for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
              var command = _a[_i];
              if (command.name == name) {
                  return command;
              }
          }
          return null;
      };
      Keyboard.prototype.getCommandInputsAscii = function (name) {
          var command = this.getCommand(name);
          if (command) {
              return Object.keys(command.inputs);
          }
          return false;
      };
      Keyboard.prototype.getAsciiCodes = function (keys) {
          var asciiCodes = [];
          for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
              var key = keys_1[_i];
              var ascii = this.inputValidation(key);
              if (!ascii) {
                  return false;
              }
              asciiCodes.push(ascii);
          }
          return asciiCodes;
      };
      Keyboard.prototype.inputValidation = function (ascii) {
          if (!isInteger(ascii)) {
              ascii = String.toASCII(ascii);
          }
          if (isAscii(ascii, true)) {
              return ascii;
          }
          this.log.error(ascii + " is not assignable to a valid ASCII code");
          return false;
      };
      return Keyboard;
  }();

  exports.Keyboard = Keyboard;

  return exports;

}({}));
