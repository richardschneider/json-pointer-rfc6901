;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.JSON.pointer = factory();
  }
}(this, function() {
var JsonPointer, JsonPointerError,
  extend = function(child, parent) { for (var key in parent) { if (hasProp1.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp1 = {}.hasOwnProperty;

JsonPointerError = (function(superClass) {
  extend(JsonPointerError, superClass);

  function JsonPointerError(message) {
    var base;
    base = JsonPointerError.__super__.constructor.call(this, message);
    this.message = base.message;
    this.stack = base.stack;
    this.name = this.constructor.name;
  }

  return JsonPointerError;

})(Error);

JsonPointer = (function() {
  JsonPointer.JsonPointerError = JsonPointerError;


  /*
   * Convenience function for choosing between `.smartBind`, `.get`, and `.set`, depending on the number of arguments.
   *
   * @param {*} object
   * @param {string} pointer
   * @param {*} value
   * @returns {*} evaluation of the proxied method
   */

  function JsonPointer(object, pointer, value) {
    switch (arguments.length) {
      case 3:
        return JsonPointer.set(object, pointer, value);
      case 2:
        return JsonPointer.get(object, pointer);
      case 1:
        return JsonPointer.smartBind({
          object: object
        });
      default:
        return null;
    }
  }


  /*
   * Creates a clone of the api, with `./.get/.has/.set/.del/.smartBind` method signatures adjusted.
   * The smartBind method is cumulative, meaning that `.smartBind({ object: x}).smartBind({ pointer: y })` will behave as expected.
   *
   * @param {Object} bindings
   * @param {*} bindings.object
   * @param {string|string[]} bindings.pointer
   * @param {Object} bindings.options
   * @returns {JsonPointer}
   */

  JsonPointer.smartBind = function(arg) {
    var api, frag, hasObj, hasOpt, hasPtr, key, mergeOptions, obj, opt, ptr, val;
    obj = arg.object, ptr = arg.pointer, frag = arg.fragment, opt = arg.options;
    ptr = frag != null ? frag : ptr;
    hasObj = obj !== void 0;
    hasPtr = ptr != null;
    hasOpt = opt != null;
    if (typeof ptr === 'string') {
      ptr = this.parse(ptr);
    }
    mergeOptions = function(override) {
      var o, ref, ref1, ref2, ref3, ref4, ref5;
      if (override == null) {
        override = {};
      }
      o = {};
      o.hasOwnProp = (ref = override.hasOwnProp) != null ? ref : opt.hasOwnProp;
      o.getProp = (ref1 = override.getProp) != null ? ref1 : opt.getProp;
      o.setProp = (ref2 = override.setProp) != null ? ref2 : opt.setProp;
      o.getNotFound = (ref3 = override.getNotFound) != null ? ref3 : opt.getNotFound;
      o.setNotFound = (ref4 = override.setNotFound) != null ? ref4 : opt.setNotFound;
      o.delNotFound = (ref5 = override.delNotFound) != null ? ref5 : opt.delNotFound;
      return o;
    };
    api = void 0;
    if (hasObj && hasPtr && hasOpt) {
      api = function(value) {
        switch (arguments.length) {
          case 1:
            return JsonPointer.set(obj, ptr, value, opt);
          case 0:
            return JsonPointer.get(obj, ptr, opt);
          default:
            return null;
        }
      };
      api.set = function(value, override) {
        return obj = JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(override) {
        return obj = JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasObj && hasPtr) {
      api = function(value) {
        switch (arguments.length) {
          case 1:
            return JsonPointer.set(obj, ptr, value);
          case 0:
            return JsonPointer.get(obj, ptr);
          default:
            return null;
        }
      };
      api.set = function(value, override) {
        return obj = JsonPointer.set(obj, ptr, value, override);
      };
      api.get = function(override) {
        return JsonPointer.get(obj, ptr, override);
      };
      api.has = function(override) {
        return JsonPointer.has(obj, ptr, override);
      };
      api.del = function(override) {
        return obj = JsonPointer.del(obj, ptr, override);
      };
    } else if (hasObj && hasOpt) {
      api = function(ptr, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value, opt);
          case 1:
            return JsonPointer.get(obj, ptr, opt);
          default:
            return null;
        }
      };
      api.set = function(ptr, value, override) {
        return obj = JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(ptr, override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(ptr, override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(ptr, override) {
        return obj = JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasPtr && hasOpt) {
      api = function(obj, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value, opt);
          case 1:
            return JsonPointer.get(obj, ptr, opt);
          default:
            return null;
        }
      };
      api.set = function(obj, value, override) {
        return JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(obj, override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(obj, override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(obj, override) {
        return JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasOpt) {
      api = function(obj, ptr, value) {
        switch (arguments.length) {
          case 3:
            return JsonPointer.set(obj, ptr, value, opt);
          case 2:
            return JsonPointer.get(obj, ptr, opt);
          case 1:
            return api.smartBind({
              object: obj
            });
          default:
            return null;
        }
      };
      api.set = function(obj, ptr, value, override) {
        return JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(obj, ptr, override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(obj, ptr, override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(obj, ptr, override) {
        return JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasObj) {
      api = function(ptr, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value);
          case 1:
            return JsonPointer.get(obj, ptr);
          default:
            return null;
        }
      };
      api.set = function(ptr, value, override) {
        return obj = JsonPointer.set(obj, ptr, value, override);
      };
      api.get = function(ptr, override) {
        return JsonPointer.get(obj, ptr, override);
      };
      api.has = function(ptr, override) {
        return JsonPointer.has(obj, ptr, override);
      };
      api.del = function(ptr, override) {
        return obj = JsonPointer.del(obj, ptr, override);
      };
    } else if (hasPtr) {
      api = function(obj, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value);
          case 1:
            return JsonPointer.get(obj, ptr);
          default:
            return null;
        }
      };
      api.set = function(obj, value, override) {
        return JsonPointer.set(obj, ptr, value, override);
      };
      api.get = function(obj, override) {
        return JsonPointer.get(obj, ptr, override);
      };
      api.has = function(obj, override) {
        return JsonPointer.has(obj, ptr, override);
      };
      api.del = function(obj, override) {
        return JsonPointer.del(obj, ptr, override);
      };
    } else {
      return this;
    }
    api.smartBind = function(override) {
      var o;
      o = {};
      if ({}.hasOwnProperty.call(override, 'object')) {
        o.object = override.object;
      } else if (hasObj) {
        o.object = obj;
      }
      if ({}.hasOwnProperty.call(override, 'pointer')) {
        o.pointer = override.pointer;
      } else if (hasPtr) {
        o.pointer = ptr;
      }
      if ({}.hasOwnProperty.call(override, 'options')) {
        o.options = mergeOptions(override.options);
      } else if (hasObj) {
        o.options = opt;
      }
      return JsonPointer.smartBind(o);
    };
    if (hasPtr) {

      /*
       * get/set bound pointer value
       *
       * Only available when pointer has been bound
       *
       * @param {string} value
       * @returns string[] segments
       */
      api.pointer = function(value) {
        if (arguments.length === 0) {
          return JsonPointer.compilePointer(ptr);
        } else {
          return ptr = JsonPointer.parsePointer(value);
        }
      };

      /*
       * get/set bound pointer value as fragment
       *
       * Only available when pointer has been bound
       *
       * @param {string} value
       * @returns string[] segments
       */
      api.fragment = function(value) {
        if (arguments.length === 0) {
          return JsonPointer.compileFragment(ptr);
        } else {
          return ptr = JsonPointer.parseFragment(value);
        }
      };
    }
    if (hasObj) {

      /*
       * get/set bound object
       *
       * Only available when object has been bound
       *
       * @param {*} value
       * @returns {*} bound object
       */
      api.object = function(value) {
        if (arguments.length === 0) {
          return obj;
        } else {
          return obj = value;
        }
      };
    }
    if (hasOpt) {

      /*
       * get/set bound options
       *
       * Only available when options has been bound
       *
       * @param {*} value
       * @returns {*} bound options
       */
      api.options = function(value) {
        if (arguments.length === 0) {
          return opt;
        } else {
          return opt = value;
        }
      };
    }
    for (key in JsonPointer) {
      if (!hasProp1.call(JsonPointer, key)) continue;
      val = JsonPointer[key];
      if (!{}.hasOwnProperty.call(api, key)) {
        api[key] = val;
      }
    }
    return api;
  };


  /*
   * Escapes the given path segment as described by RFC6901.
   *
   * Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'`.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.escape = function(segment) {
    return segment.replace(/~/g, '~0').replace(/\//g, '~1');
  };


  /*
   * Escapes the given path fragment segment as described by RFC6901.
   *
   * Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'` and finally the string is URI encoded.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.escapeFragment = function(segment) {
    return encodeURIComponent(JsonPointer.escape(segment));
  };


  /*
   * Un-Escapes the given path segment, reversing the actions of `.escape`.
   *
   * Notably, `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.unescape = function(segment) {
    return segment.replace(/~1/g, '/').replace(/~0/g, '~');
  };


  /*
   * Un-Escapes the given path fragment segment, reversing the actions of `.escapeFragment`.
   *
   * Notably, the string is URI decoded and then `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.unescapeFragment = function(segment) {
    return JsonPointer.unescape(decodeURIComponent(segment));
  };


  /*
   * Returns true iff `str` is a valid json pointer value
   *
   * @param {string} str
   * @returns {Boolean}
   */

  JsonPointer.isPointer = function(str) {
    switch (str.charAt(0)) {
      case '':
        return true;
      case '/':
        return true;
      default:
        return false;
    }
  };


  /*
   * Returns true iff `str` is a valid json fragment pointer value
   *
   * @param {string} str
   * @returns {Boolean}
   */

  JsonPointer.isFragment = function(str) {
    switch (str.substring(0, 2)) {
      case '#':
        return true;
      case '#/':
        return true;
      default:
        return false;
    }
  };


  /*
   * Parses a json-pointer or json fragment pointer, as described by RFC901, into an array of path segments.
   *
   * @throws {JsonPointerError} for invalid json-pointers.
   *
   * @param {string} str
   * @returns {string[]}
   */

  JsonPointer.parse = function(str) {
    switch (str.charAt(0)) {
      case '':
        return [];
      case '/':
        return str.substring(1).split('/').map(JsonPointer.unescape);
      case '#':
        switch (str.charAt(1)) {
          case '':
            return [];
          case '/':
            return str.substring(2).split('/').map(JsonPointer.unescapeFragment);
          default:
            throw new JsonPointerError("Invalid JSON fragment pointer: " + str);
        }
        break;
      default:
        throw new JsonPointerError("Invalid JSON pointer: " + str);
    }
  };


  /*
   * Parses a json-pointer, as described by RFC901, into an array of path segments.
   *
   * @throws {JsonPointerError} for invalid json-pointers.
   *
   * @param {string} str
   * @returns {string[]}
   */

  JsonPointer.parsePointer = function(str) {
    switch (str.charAt(0)) {
      case '':
        return [];
      case '/':
        return str.substring(1).split('/').map(JsonPointer.unescape);
      default:
        throw new JsonPointerError("Invalid JSON pointer: " + str);
    }
  };


  /*
   * Parses a json fragment pointer, as described by RFC901, into an array of path segments.
   *
   * @throws {JsonPointerError} for invalid json-pointers.
   *
   * @param {string} str
   * @returns {string[]}
   */

  JsonPointer.parseFragment = function(str) {
    switch (str.substring(0, 2)) {
      case '#':
        return [];
      case '#/':
        return str.substring(2).split('/').map(JsonPointer.unescapeFragment);
      default:
        throw new JsonPointerError("Invalid JSON fragment pointer: " + str);
    }
  };


  /*
   * Converts an array of path segments into a json pointer.
   * This method is the reverse of `.parsePointer`.
   *
   * @param {string[]} segments
   * @returns {string}
   */

  JsonPointer.compile = function(segments) {
    return segments.map(function(segment) {
      return '/' + JsonPointer.escape(segment);
    }).join('');
  };


  /*
   * Converts an array of path segments into a json pointer.
   * This method is the reverse of `.parsePointer`.
   *
   * @param {string[]} segments
   * @returns {string}
   */

  JsonPointer.compilePointer = function(segments) {
    return segments.map(function(segment) {
      return '/' + JsonPointer.escape(segment);
    }).join('');
  };


  /*
   * Converts an array of path segments into a json fragment pointer.
   * This method is the reverse of `.parseFragment`.
   *
   * @param {string[]} segments
   * @returns {string}
   */

  JsonPointer.compileFragment = function(segments) {
    return '#' + segments.map(function(segment) {
      return '/' + JsonPointer.escapeFragment(segment);
    }).join('');
  };


  /*
   * Callback used to determine if an object contains a given property.
   *
   * @callback hasProp
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */


  /*
   * Returns true iff `obj` contains `key` and `obj` is either an Array or an Object.
   * Ignores the prototype chain.
   *
   * Default value for `options.hasProp`.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */

  JsonPointer.hasJsonProp = function(obj, key) {
    if (Array.isArray(obj)) {
      return (typeof key === 'number') && (key < obj.length);
    } else if (typeof obj === 'object') {
      return {}.hasOwnProperty.call(obj, key);
    } else {
      return false;
    }
  };


  /*
   * Returns true iff `obj` contains `key`, disregarding the prototype chain.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */

  JsonPointer.hasOwnProp = function(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
  };


  /*
   * Returns true iff `obj` contains `key`, including via the prototype chain.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */

  JsonPointer.hasProp = function(obj, key) {
    return key in obj;
  };


  /*
   * Callback used to retrieve a property from an object
   *
   * @callback getProp
   * @param {*} obj
   * @param {string|integer} key
   * @returns {*}
   */


  /*
   * Finds the given `key` in `obj`.
   *
   * Default value for `options.getProp`.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {*}
   */

  JsonPointer.getProp = function(obj, key) {
    return obj[key];
  };


  /*
   * Callback used to set a property on an object.
   *
   * @callback setProp
   * @param {*} obj
   * @param {string|integer} key
   * @param {*} value
   * @returns {*}
   */


  /*
   * Sets the given `key` in `obj` to `value`.
   *
   * Default value for `options.setProp`.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @param {*} value
   * @returns {*} `value`
   */

  JsonPointer.setProp = function(obj, key, value) {
    return obj[key] = value;
  };


  /*
   * Callback used to modify behaviour when a given path segment cannot be found.
   *
   * @callback notFound
   * @param {*} obj
   * @param {string|integer} key
   * @returns {*}
   */


  /*
   * Returns the value to use when `.get` fails to locate a pointer segment.
   *
   * Default value for `options.getNotFound`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.getNotFound = function(obj, segment, root, segments, iSegment) {
    return void 0;
  };


  /*
   * Returns the value to use when `.set` fails to locate a pointer segment.
   *
   * Default value for `options.setNotFound`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.setNotFound = function(obj, segment, root, segments, iSegment) {
    if (segments[iSegment + 1].match(/^(?:0|[1-9]\d*|-)$/)) {
      return obj[segment] = [];
    } else {
      return obj[segment] = {};
    }
  };


  /*
   * Performs an action when `.del` fails to locate a pointer segment.
   *
   * Default value for `options.delNotFound`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.delNotFound = function(obj, segment, root, segments, iSegment) {
    return void 0;
  };


  /*
   * Raises a JsonPointerError when the given pointer segment is not found.
   *
   * May be used in place of the above methods via the `options` argument of `./.get/.set/.has/.del/.simpleBind`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.errorNotFound = function(obj, segment, root, segments, iSegment) {
    throw new JsonPointerError("Unable to find json path: " + (JsonPointer.compile(segments.slice(0, iSegment + 1))));
  };


  /*
   * Sets the location in `object`, specified by `pointer`, to `value`.
   * If `pointer` refers to the whole document, `value` is returned without modifying `object`,
   * otherwise, `object` modified and returned.
   *
   * By default, if any location specified by `pointer` does not exist, the location is created using objects and arrays.
   * Arrays are used only when the immediately following path segment is an array element as defined by the standard.
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @param {setProp} options.setProp
   * @param {notFound} options.getNotFound
   * @returns {*}
   */

  JsonPointer.set = function(obj, pointer, value, options) {
    var getProp, hasProp, iSegment, len, ref, ref1, ref2, ref3, root, segment, setNotFound, setProp;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    if (pointer.length === 0) {
      return value;
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    setProp = (ref2 = options != null ? options.setProp : void 0) != null ? ref2 : JsonPointer.setProp;
    setNotFound = (ref3 = options != null ? options.setNotFound : void 0) != null ? ref3 : JsonPointer.setNotFound;
    root = obj;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (iSegment === len) {
        setProp(obj, segment, value);
        break;
      } else if (!hasProp(obj, segment)) {
        obj = setNotFound(obj, segment, root, pointer, iSegment - 1);
      } else {
        obj = getProp(obj, segment);
      }
    }
    return root;
  };


  /*
   * Finds the value in `obj` as specified by `pointer`
   *
   * By default, returns undefined for values which cannot be found
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @param {notFound} options.getNotFound
   * @returns {*}
   */

  JsonPointer.get = function(obj, pointer, options) {
    var getNotFound, getProp, hasProp, iSegment, len, ref, ref1, ref2, root, segment;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    getNotFound = (ref2 = options != null ? options.getNotFound : void 0) != null ? ref2 : JsonPointer.getNotFound;
    root = obj;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (!hasProp(obj, segment)) {
        return getNotFound(obj, segment, root, pointer, iSegment - 1);
      } else {
        obj = getProp(obj, segment);
      }
    }
    return obj;
  };


  /*
   * Removes the location, specified by `pointer`, from `object`.
   * Returns the modified `object`, or undefined if the `pointer` is empty.
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @param {notFound} options.delNotFound
   * @returns {*}
   */

  JsonPointer.del = function(obj, pointer, options) {
    var delNotFound, getProp, hasProp, iSegment, len, ref, ref1, ref2, root, segment;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    if (pointer.length === 0) {
      return void 0;
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    delNotFound = (ref2 = options != null ? options.delNotFound : void 0) != null ? ref2 : JsonPointer.delNotFound;
    root = obj;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (!hasProp(obj, segment)) {
        delNotFound(obj, segment, root, pointer, iSegment - 1);
        break;
      } else if (iSegment === len) {
        delete obj[segment];
        break;
      } else {
        obj = getProp(obj, segment);
      }
    }
    return root;
  };


  /*
   * Returns true iff the location, specified by `pointer`, exists in `object`
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @returns {*}
   */

  JsonPointer.has = function(obj, pointer, options) {
    var getProp, hasProp, iSegment, len, ref, ref1, segment;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (!hasProp(obj, segment)) {
        return false;
      }
      obj = getProp(obj, segment);
    }
    return true;
  };

  return JsonPointer;

})();

return JsonPointer;
}));

//# sourceMappingURL=data:application/json;base64,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QVUsUUFBQSxDQUFTLE9BQVQsRUFBa0IsRUFBbEIsRUFEUDs7TUFHTCxJQUFHLENBQUksT0FBQSxDQUFRLEdBQVIsRUFBYSxPQUFiLENBQVA7QUFDRSxlQUFPLE1BRFQ7O01BR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYjtJQVpSO0FBY0EsV0FBTztFQXZCSCIsImZpbGUiOiJqc29uLXBvaW50ZXIudW1kLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSnNvblBvaW50ZXJFcnJvciBleHRlbmRzIEVycm9yXG4gIGNvbnN0cnVjdG9yOiAobWVzc2FnZSkgLT5cbiAgICBiYXNlID0gc3VwZXIobWVzc2FnZSlcblxuICAgIEBtZXNzYWdlID0gYmFzZS5tZXNzYWdlXG4gICAgQHN0YWNrID0gYmFzZS5zdGFja1xuICAgIEBuYW1lID0gQGNvbnN0cnVjdG9yLm5hbWVcblxuY2xhc3MgSnNvblBvaW50ZXJcbiAgQEpzb25Qb2ludGVyRXJyb3I6IEpzb25Qb2ludGVyRXJyb3JcblxuICAjIyNcbiAgIyBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hvb3NpbmcgYmV0d2VlbiBgLnNtYXJ0QmluZGAsIGAuZ2V0YCwgYW5kIGAuc2V0YCwgZGVwZW5kaW5nIG9uIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmplY3RcbiAgIyBAcGFyYW0ge3N0cmluZ30gcG9pbnRlclxuICAjIEBwYXJhbSB7Kn0gdmFsdWVcbiAgIyBAcmV0dXJucyB7Kn0gZXZhbHVhdGlvbiBvZiB0aGUgcHJveGllZCBtZXRob2RcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSkgLT5cbiAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgIHdoZW4gMyB0aGVuIEpzb25Qb2ludGVyLnNldChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKVxuICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iamVjdCwgcG9pbnRlcilcbiAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLnNtYXJ0QmluZCh7IG9iamVjdDogb2JqZWN0IH0pXG4gICAgICBlbHNlIG51bGxcblxuICAjIyNcbiAgIyBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGFwaSwgd2l0aCBgLi8uZ2V0Ly5oYXMvLnNldC8uZGVsLy5zbWFydEJpbmRgIG1ldGhvZCBzaWduYXR1cmVzIGFkanVzdGVkLlxuICAjIFRoZSBzbWFydEJpbmQgbWV0aG9kIGlzIGN1bXVsYXRpdmUsIG1lYW5pbmcgdGhhdCBgLnNtYXJ0QmluZCh7IG9iamVjdDogeH0pLnNtYXJ0QmluZCh7IHBvaW50ZXI6IHkgfSlgIHdpbGwgYmVoYXZlIGFzIGV4cGVjdGVkLlxuICAjXG4gICMgQHBhcmFtIHtPYmplY3R9IGJpbmRpbmdzXG4gICMgQHBhcmFtIHsqfSBiaW5kaW5ncy5vYmplY3RcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gYmluZGluZ3MucG9pbnRlclxuICAjIEBwYXJhbSB7T2JqZWN0fSBiaW5kaW5ncy5vcHRpb25zXG4gICMgQHJldHVybnMge0pzb25Qb2ludGVyfVxuICAjIyNcbiAgQHNtYXJ0QmluZDogKHsgb2JqZWN0OiBvYmosIHBvaW50ZXI6IHB0ciwgZnJhZ21lbnQ6IGZyYWcsIG9wdGlvbnM6IG9wdCB9KSAtPlxuICAgICMgZnJhZ21lbnQgb3ZlcnJpZGVzIHBvaW50ZXJcbiAgICBwdHIgPSBmcmFnID8gcHRyXG5cbiAgICAjIFdoYXQgYXJlIGJpbmRpbmc/XG4gICAgaGFzT2JqID0gb2JqICE9IHVuZGVmaW5lZFxuICAgIGhhc1B0ciA9IHB0cj9cbiAgICBoYXNPcHQgPSBvcHQ/XG5cbiAgICAjIExldHMgbm90IHBhcnNlIHRoaXMgZXZlcnkgdGltZSFcbiAgICBpZiB0eXBlb2YgcHRyID09ICdzdHJpbmcnXG4gICAgICBwdHIgPSBAcGFyc2UocHRyKVxuXG4gICAgIyBkZWZhdWx0IG9wdGlvbnMgaGF2ZSBjaGFuZ2VkXG4gICAgbWVyZ2VPcHRpb25zID0gKG92ZXJyaWRlID0ge30pIC0+XG4gICAgICBvID0ge31cblxuICAgICAgby5oYXNPd25Qcm9wID0gb3ZlcnJpZGUuaGFzT3duUHJvcCA/IG9wdC5oYXNPd25Qcm9wXG4gICAgICBvLmdldFByb3AgPSBvdmVycmlkZS5nZXRQcm9wID8gb3B0LmdldFByb3BcbiAgICAgIG8uc2V0UHJvcCA9IG92ZXJyaWRlLnNldFByb3AgPyBvcHQuc2V0UHJvcFxuICAgICAgby5nZXROb3RGb3VuZCA9IG92ZXJyaWRlLmdldE5vdEZvdW5kID8gb3B0LmdldE5vdEZvdW5kXG4gICAgICBvLnNldE5vdEZvdW5kID0gb3ZlcnJpZGUuc2V0Tm90Rm91bmQgPyBvcHQuc2V0Tm90Rm91bmRcbiAgICAgIG8uZGVsTm90Rm91bmQgPSBvdmVycmlkZS5kZWxOb3RGb3VuZCA/IG9wdC5kZWxOb3RGb3VuZFxuXG4gICAgICByZXR1cm4gb1xuXG4gICAgYXBpID0gdW5kZWZpbmVkXG5cbiAgICAjIEV2ZXJ5IGNvbWJpbmF0aW9uIG9mIGJpbmRpbmdzXG4gICAgaWYgaGFzT2JqIGFuZCBoYXNQdHIgYW5kIGhhc09wdFxuICAgICAgYXBpID0gKHZhbHVlKSAtPlxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXG4gICAgICAgICAgd2hlbiAwIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXG4gICAgICAgICAgZWxzZSBudWxsXG5cbiAgICAgIGFwaS5zZXQgPSAodmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmdldCA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmhhcyA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmRlbCA9IChvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgIGVsc2UgaWYgaGFzT2JqIGFuZCBoYXNQdHJcbiAgICAgIGFwaSA9ICh2YWx1ZSkgLT5cbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSlcbiAgICAgICAgICB3aGVuIDAgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIpXG4gICAgICAgICAgZWxzZSBudWxsXG5cbiAgICAgIGFwaS5zZXQgPSAodmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSlcbiAgICAgIGFwaS5nZXQgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgICBhcGkuaGFzID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgICAgYXBpLmRlbCA9IChvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICBlbHNlIGlmIGhhc09iaiBhbmQgaGFzT3B0XG4gICAgICBhcGkgPSAocHRyLCB2YWx1ZSkgLT5cbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxuICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICBhcGkuc2V0ID0gKHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmdldCA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuaGFzID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5kZWwgPSAocHRyLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgIGVsc2UgaWYgaGFzUHRyIGFuZCBoYXNPcHRcbiAgICAgIGFwaSA9IChvYmosIHZhbHVlKSAtPlxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXG4gICAgICAgICAgZWxzZSBudWxsXG5cbiAgICAgIGFwaS5zZXQgPSAob2JqLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZ2V0ID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5oYXMgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmRlbCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgZWxzZSBpZiBoYXNPcHRcbiAgICAgIGFwaSA9IChvYmosIHB0ciwgdmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMyB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcbiAgICAgICAgICB3aGVuIDEgdGhlbiBhcGkuc21hcnRCaW5kKHsgb2JqZWN0OiBvYmogfSlcbiAgICAgICAgICBlbHNlIG51bGxcblxuICAgICAgYXBpLnNldCA9IChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmdldCA9IChvYmosIHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5oYXMgPSAob2JqLCBwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZGVsID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgIGVsc2UgaWYgaGFzT2JqXG4gICAgICBhcGkgPSAocHRyLCB2YWx1ZSkgLT5cbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSlcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIpXG4gICAgICAgICAgZWxzZSBudWxsXG5cbiAgICAgIGFwaS5zZXQgPSAocHRyLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKVxuICAgICAgYXBpLmdldCA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgICAgYXBpLmhhcyA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgICAgYXBpLmRlbCA9IChwdHIsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgIGVsc2UgaWYgaGFzUHRyXG4gICAgICBhcGkgPSAob2JqLCB2YWx1ZSkgLT5cbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSlcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIpXG4gICAgICAgICAgZWxzZSBudWxsXG5cbiAgICAgIGFwaS5zZXQgPSAob2JqLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKVxuICAgICAgYXBpLmdldCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgICAgYXBpLmhhcyA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgICAgYXBpLmRlbCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAXG5cbiAgICAjIHNtYXJ0QmluZCBoYXMgbmV3IGRlZmF1bHRzXG4gICAgYXBpLnNtYXJ0QmluZCA9IChvdmVycmlkZSkgLT5cbiAgICAgIG8gPSB7fVxuXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAnb2JqZWN0JylcbiAgICAgICAgby5vYmplY3QgPSBvdmVycmlkZS5vYmplY3RcbiAgICAgIGVsc2UgaWYgaGFzT2JqXG4gICAgICAgIG8ub2JqZWN0ID0gb2JqXG5cbiAgICAgIGlmIHt9Lmhhc093blByb3BlcnR5LmNhbGwob3ZlcnJpZGUsICdwb2ludGVyJylcbiAgICAgICAgby5wb2ludGVyID0gb3ZlcnJpZGUucG9pbnRlclxuICAgICAgZWxzZSBpZiBoYXNQdHJcbiAgICAgICAgby5wb2ludGVyID0gcHRyXG5cbiAgICAgIGlmIHt9Lmhhc093blByb3BlcnR5LmNhbGwob3ZlcnJpZGUsICdvcHRpb25zJylcbiAgICAgICAgby5vcHRpb25zID0gbWVyZ2VPcHRpb25zKG92ZXJyaWRlLm9wdGlvbnMpXG4gICAgICBlbHNlIGlmIGhhc09ialxuICAgICAgICBvLm9wdGlvbnMgPSBvcHRcblxuICAgICAgcmV0dXJuIEpzb25Qb2ludGVyLnNtYXJ0QmluZChvKVxuXG4gICAgaWYgaGFzUHRyXG4gICAgICAjIyNcbiAgICAgICMgZ2V0L3NldCBib3VuZCBwb2ludGVyIHZhbHVlXG4gICAgICAjXG4gICAgICAjIE9ubHkgYXZhaWxhYmxlIHdoZW4gcG9pbnRlciBoYXMgYmVlbiBib3VuZFxuICAgICAgI1xuICAgICAgIyBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICAgICMgQHJldHVybnMgc3RyaW5nW10gc2VnbWVudHNcbiAgICAgICMjI1xuICAgICAgYXBpLnBvaW50ZXIgPSAodmFsdWUpIC0+XG4gICAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMFxuICAgICAgICAgIHJldHVybiBKc29uUG9pbnRlci5jb21waWxlUG9pbnRlcihwdHIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gcHRyID0gSnNvblBvaW50ZXIucGFyc2VQb2ludGVyKHZhbHVlKVxuXG4gICAgICAjIyNcbiAgICAgICMgZ2V0L3NldCBib3VuZCBwb2ludGVyIHZhbHVlIGFzIGZyYWdtZW50XG4gICAgICAjXG4gICAgICAjIE9ubHkgYXZhaWxhYmxlIHdoZW4gcG9pbnRlciBoYXMgYmVlbiBib3VuZFxuICAgICAgI1xuICAgICAgIyBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICAgICMgQHJldHVybnMgc3RyaW5nW10gc2VnbWVudHNcbiAgICAgICMjI1xuICAgICAgYXBpLmZyYWdtZW50ID0gKHZhbHVlKSAtPlxuICAgICAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDBcbiAgICAgICAgICByZXR1cm4gSnNvblBvaW50ZXIuY29tcGlsZUZyYWdtZW50KHB0cilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBwdHIgPSBKc29uUG9pbnRlci5wYXJzZUZyYWdtZW50KHZhbHVlKVxuXG4gICAgaWYgaGFzT2JqXG4gICAgICAjIyNcbiAgICAgICMgZ2V0L3NldCBib3VuZCBvYmplY3RcbiAgICAgICNcbiAgICAgICMgT25seSBhdmFpbGFibGUgd2hlbiBvYmplY3QgaGFzIGJlZW4gYm91bmRcbiAgICAgICNcbiAgICAgICMgQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAgIyBAcmV0dXJucyB7Kn0gYm91bmQgb2JqZWN0XG4gICAgICAjIyNcbiAgICAgIGFwaS5vYmplY3QgPSAodmFsdWUpIC0+XG4gICAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMFxuICAgICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBvYmogPSB2YWx1ZVxuXG4gICAgaWYgaGFzT3B0XG4gICAgICAjIyNcbiAgICAgICMgZ2V0L3NldCBib3VuZCBvcHRpb25zXG4gICAgICAjXG4gICAgICAjIE9ubHkgYXZhaWxhYmxlIHdoZW4gb3B0aW9ucyBoYXMgYmVlbiBib3VuZFxuICAgICAgI1xuICAgICAgIyBAcGFyYW0geyp9IHZhbHVlXG4gICAgICAjIEByZXR1cm5zIHsqfSBib3VuZCBvcHRpb25zXG4gICAgICAjIyNcbiAgICAgIGFwaS5vcHRpb25zID0gKHZhbHVlKSAtPlxuICAgICAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDBcbiAgICAgICAgICByZXR1cm4gb3B0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gb3B0ID0gdmFsdWVcblxuICAgICMgY29weSB0aGUgcmVtYWluaW5nIG1ldGhvZHMgd2hpY2ggZG8gbm90IG5lZWQgYmluZGluZ1xuICAgIGZvciBvd24ga2V5LCB2YWwgb2YgSnNvblBvaW50ZXJcbiAgICAgIGlmIG5vdCB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwaSwga2V5KVxuICAgICAgICBhcGlba2V5XSA9IHZhbFxuXG4gICAgIyBmaW5hbCByZXN1bHRcbiAgICByZXR1cm4gYXBpXG5cbiAgIyMjXG4gICMgRXNjYXBlcyB0aGUgZ2l2ZW4gcGF0aCBzZWdtZW50IGFzIGRlc2NyaWJlZCBieSBSRkM2OTAxLlxuICAjXG4gICMgTm90YWJseSwgYCd+J2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34wJ2AgYW5kIGAnLydgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+MSdgLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHNlZ21lbnRcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxuICAjIyNcbiAgQGVzY2FwZTogKHNlZ21lbnQpIC0+XG4gICAgc2VnbWVudC5yZXBsYWNlKC9+L2csICd+MCcpLnJlcGxhY2UoL1xcLy9nLCAnfjEnKVxuXG4gICMjI1xuICAjIEVzY2FwZXMgdGhlIGdpdmVuIHBhdGggZnJhZ21lbnQgc2VnbWVudCBhcyBkZXNjcmliZWQgYnkgUkZDNjkwMS5cbiAgI1xuICAjIE5vdGFibHksIGAnfidgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+MCdgIGFuZCBgJy8nYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfjEnYCBhbmQgZmluYWxseSB0aGUgc3RyaW5nIGlzIFVSSSBlbmNvZGVkLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHNlZ21lbnRcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxuICAjIyNcbiAgQGVzY2FwZUZyYWdtZW50OiAoc2VnbWVudCkgLT5cbiAgICBlbmNvZGVVUklDb21wb25lbnQoSnNvblBvaW50ZXIuZXNjYXBlKHNlZ21lbnQpKVxuXG4gICMjI1xuICAjIFVuLUVzY2FwZXMgdGhlIGdpdmVuIHBhdGggc2VnbWVudCwgcmV2ZXJzaW5nIHRoZSBhY3Rpb25zIG9mIGAuZXNjYXBlYC5cbiAgI1xuICAjIE5vdGFibHksIGAnfjEnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnLydgIGFuZCBgJ34wJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34nYC5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XG4gICMgQHJldHVybnMge3N0cmluZ31cbiAgIyMjXG4gIEB1bmVzY2FwZTogKHNlZ21lbnQpIC0+XG4gICAgc2VnbWVudC5yZXBsYWNlKC9+MS9nLCAnLycpLnJlcGxhY2UoL34wL2csICd+JylcblxuICAjIyNcbiAgIyBVbi1Fc2NhcGVzIHRoZSBnaXZlbiBwYXRoIGZyYWdtZW50IHNlZ21lbnQsIHJldmVyc2luZyB0aGUgYWN0aW9ucyBvZiBgLmVzY2FwZUZyYWdtZW50YC5cbiAgI1xuICAjIE5vdGFibHksIHRoZSBzdHJpbmcgaXMgVVJJIGRlY29kZWQgYW5kIHRoZW4gYCd+MSdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCcvJ2AgYW5kIGAnfjAnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfidgLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHNlZ21lbnRcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxuICAjIyNcbiAgQHVuZXNjYXBlRnJhZ21lbnQ6IChzZWdtZW50KSAtPlxuICAgIEpzb25Qb2ludGVyLnVuZXNjYXBlKGRlY29kZVVSSUNvbXBvbmVudChzZWdtZW50KSlcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBzdHJgIGlzIGEgdmFsaWQganNvbiBwb2ludGVyIHZhbHVlXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XG4gICMjI1xuICBAaXNQb2ludGVyOiAoc3RyKSAtPlxuICAgIHN3aXRjaCBzdHIuY2hhckF0KDApXG4gICAgICB3aGVuICcnIHRoZW4gcmV0dXJuIHRydWVcbiAgICAgIHdoZW4gJy8nIHRoZW4gcmV0dXJuIHRydWVcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgIyMjXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgc3RyYCBpcyBhIHZhbGlkIGpzb24gZnJhZ21lbnQgcG9pbnRlciB2YWx1ZVxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxuICAjIEByZXR1cm5zIHtCb29sZWFufVxuICAjIyNcbiAgQGlzRnJhZ21lbnQ6IChzdHIpIC0+XG4gICAgc3dpdGNoIHN0ci5zdWJzdHJpbmcoMCwgMilcbiAgICAgIHdoZW4gJyMnIHRoZW4gcmV0dXJuIHRydWVcbiAgICAgIHdoZW4gJyMvJyB0aGVuIHJldHVybiB0cnVlXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICMjI1xuICAjIFBhcnNlcyBhIGpzb24tcG9pbnRlciBvciBqc29uIGZyYWdtZW50IHBvaW50ZXIsIGFzIGRlc2NyaWJlZCBieSBSRkM5MDEsIGludG8gYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cbiAgI1xuICAjIEB0aHJvd3Mge0pzb25Qb2ludGVyRXJyb3J9IGZvciBpbnZhbGlkIGpzb24tcG9pbnRlcnMuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICMgQHJldHVybnMge3N0cmluZ1tdfVxuICAjIyNcbiAgQHBhcnNlOiAoc3RyKSAtPlxuICAgIHN3aXRjaCBzdHIuY2hhckF0KDApXG4gICAgICB3aGVuICcnIHRoZW4gcmV0dXJuIFtdXG4gICAgICB3aGVuICcvJyB0aGVuIHJldHVybiBzdHIuc3Vic3RyaW5nKDEpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlKVxuICAgICAgd2hlbiAnIydcbiAgICAgICAgc3dpdGNoIHN0ci5jaGFyQXQoMSlcbiAgICAgICAgICB3aGVuICcnIHRoZW4gcmV0dXJuIFtdXG4gICAgICAgICAgd2hlbiAnLycgdGhlbiByZXR1cm4gc3RyLnN1YnN0cmluZygyKS5zcGxpdCgnLycpLm1hcChKc29uUG9pbnRlci51bmVzY2FwZUZyYWdtZW50KVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiSW52YWxpZCBKU09OIGZyYWdtZW50IHBvaW50ZXI6ICN7c3RyfVwiKVxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIkludmFsaWQgSlNPTiBwb2ludGVyOiAje3N0cn1cIilcblxuICAjIyNcbiAgIyBQYXJzZXMgYSBqc29uLXBvaW50ZXIsIGFzIGRlc2NyaWJlZCBieSBSRkM5MDEsIGludG8gYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cbiAgI1xuICAjIEB0aHJvd3Mge0pzb25Qb2ludGVyRXJyb3J9IGZvciBpbnZhbGlkIGpzb24tcG9pbnRlcnMuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICMgQHJldHVybnMge3N0cmluZ1tdfVxuICAjIyNcbiAgQHBhcnNlUG9pbnRlcjogKHN0cikgLT5cbiAgICBzd2l0Y2ggc3RyLmNoYXJBdCgwKVxuICAgICAgd2hlbiAnJyB0aGVuIHJldHVybiBbXVxuICAgICAgd2hlbiAnLycgdGhlbiByZXR1cm4gc3RyLnN1YnN0cmluZygxKS5zcGxpdCgnLycpLm1hcChKc29uUG9pbnRlci51bmVzY2FwZSlcbiAgICAgIGVsc2UgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJJbnZhbGlkIEpTT04gcG9pbnRlcjogI3tzdHJ9XCIpXG5cbiAgIyMjXG4gICMgUGFyc2VzIGEganNvbiBmcmFnbWVudCBwb2ludGVyLCBhcyBkZXNjcmliZWQgYnkgUkZDOTAxLCBpbnRvIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXG4gICNcbiAgIyBAdGhyb3dzIHtKc29uUG9pbnRlckVycm9yfSBmb3IgaW52YWxpZCBqc29uLXBvaW50ZXJzLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxuICAjIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgIyMjXG4gIEBwYXJzZUZyYWdtZW50OiAoc3RyKSAtPlxuICAgIHN3aXRjaCBzdHIuc3Vic3RyaW5nKDAsIDIpXG4gICAgICB3aGVuICcjJyB0aGVuIHJldHVybiBbXVxuICAgICAgd2hlbiAnIy8nIHRoZW4gcmV0dXJuIHN0ci5zdWJzdHJpbmcoMikuc3BsaXQoJy8nKS5tYXAoSnNvblBvaW50ZXIudW5lc2NhcGVGcmFnbWVudClcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJJbnZhbGlkIEpTT04gZnJhZ21lbnQgcG9pbnRlcjogI3tzdHJ9XCIpXG5cbiAgIyMjXG4gICMgQ29udmVydHMgYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cyBpbnRvIGEganNvbiBwb2ludGVyLlxuICAjIFRoaXMgbWV0aG9kIGlzIHRoZSByZXZlcnNlIG9mIGAucGFyc2VQb2ludGVyYC5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXG4gICMgQHJldHVybnMge3N0cmluZ31cbiAgIyMjXG4gIEBjb21waWxlOiAoc2VnbWVudHMpIC0+XG4gICAgc2VnbWVudHMubWFwKChzZWdtZW50KSAtPiAnLycgKyBKc29uUG9pbnRlci5lc2NhcGUoc2VnbWVudCkpLmpvaW4oJycpXG5cbiAgIyMjXG4gICMgQ29udmVydHMgYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cyBpbnRvIGEganNvbiBwb2ludGVyLlxuICAjIFRoaXMgbWV0aG9kIGlzIHRoZSByZXZlcnNlIG9mIGAucGFyc2VQb2ludGVyYC5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXG4gICMgQHJldHVybnMge3N0cmluZ31cbiAgIyMjXG4gIEBjb21waWxlUG9pbnRlcjogKHNlZ21lbnRzKSAtPlxuICAgIHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgLT4gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlKHNlZ21lbnQpKS5qb2luKCcnKVxuXG4gICMjI1xuICAjIENvbnZlcnRzIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMgaW50byBhIGpzb24gZnJhZ21lbnQgcG9pbnRlci5cbiAgIyBUaGlzIG1ldGhvZCBpcyB0aGUgcmV2ZXJzZSBvZiBgLnBhcnNlRnJhZ21lbnRgLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxuICAjIyNcbiAgQGNvbXBpbGVGcmFnbWVudDogKHNlZ21lbnRzKSAtPlxuICAgICcjJyArIHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgLT4gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlRnJhZ21lbnQoc2VnbWVudCkpLmpvaW4oJycpXG5cbiAgIyMjXG4gICMgQ2FsbGJhY2sgdXNlZCB0byBkZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gICNcbiAgIyBAY2FsbGJhY2sgaGFzUHJvcFxuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHJldHVybnMge0Jvb2xlYW59XG4gICMjI1xuXG4gICMjI1xuICAjIFJldHVybnMgdHJ1ZSBpZmYgYG9iamAgY29udGFpbnMgYGtleWAgYW5kIGBvYmpgIGlzIGVpdGhlciBhbiBBcnJheSBvciBhbiBPYmplY3QuXG4gICMgSWdub3JlcyB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAjXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuaGFzUHJvcGAuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEByZXR1cm5zIHtCb29sZWFufVxuICAjIyNcbiAgQGhhc0pzb25Qcm9wOiAob2JqLCBrZXkpIC0+XG4gICAgaWYgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICByZXR1cm4gKHR5cGVvZiBrZXkgPT0gJ251bWJlcicpIGFuZCAoa2V5IDwgb2JqLmxlbmd0aClcbiAgICBlbHNlIGlmIHR5cGVvZiBvYmogPT0gJ29iamVjdCdcbiAgICAgIHJldHVybiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBmYWxzZVxuXG4gICMjI1xuICAjIFJldHVybnMgdHJ1ZSBpZmYgYG9iamAgY29udGFpbnMgYGtleWAsIGRpc3JlZ2FyZGluZyB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgIyMjXG4gIEBoYXNPd25Qcm9wOiAob2JqLCBrZXkpIC0+XG4gICAge30uaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBvYmpgIGNvbnRhaW5zIGBrZXlgLCBpbmNsdWRpbmcgdmlhIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEByZXR1cm5zIHtCb29sZWFufVxuICAjIyNcbiAgQGhhc1Byb3A6IChvYmosIGtleSkgLT5cbiAgICBrZXkgb2Ygb2JqXG5cbiAgIyMjXG4gICMgQ2FsbGJhY2sgdXNlZCB0byByZXRyaWV2ZSBhIHByb3BlcnR5IGZyb20gYW4gb2JqZWN0XG4gICNcbiAgIyBAY2FsbGJhY2sgZ2V0UHJvcFxuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuXG4gICMjI1xuICAjIEZpbmRzIHRoZSBnaXZlbiBga2V5YCBpbiBgb2JqYC5cbiAgI1xuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmdldFByb3BgLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG4gIEBnZXRQcm9wOiAob2JqLCBrZXkpIC0+XG4gICAgb2JqW2tleV1cblxuICAjIyNcbiAgIyBDYWxsYmFjayB1c2VkIHRvIHNldCBhIHByb3BlcnR5IG9uIGFuIG9iamVjdC5cbiAgI1xuICAjIEBjYWxsYmFjayBzZXRQcm9wXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcGFyYW0geyp9IHZhbHVlXG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuXG4gICMjI1xuICAjIFNldHMgdGhlIGdpdmVuIGBrZXlgIGluIGBvYmpgIHRvIGB2YWx1ZWAuXG4gICNcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5zZXRQcm9wYC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxuICAjIEByZXR1cm5zIHsqfSBgdmFsdWVgXG4gICMjI1xuICBAc2V0UHJvcDogKG9iaiwga2V5LCB2YWx1ZSkgLT5cbiAgICBvYmpba2V5XSA9IHZhbHVlXG5cbiAgIyMjXG4gICMgQ2FsbGJhY2sgdXNlZCB0byBtb2RpZnkgYmVoYXZpb3VyIHdoZW4gYSBnaXZlbiBwYXRoIHNlZ21lbnQgY2Fubm90IGJlIGZvdW5kLlxuICAjXG4gICMgQGNhbGxiYWNrIG5vdEZvdW5kXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG5cbiAgIyMjXG4gICMgUmV0dXJucyB0aGUgdmFsdWUgdG8gdXNlIHdoZW4gYC5nZXRgIGZhaWxzIHRvIGxvY2F0ZSBhIHBvaW50ZXIgc2VnbWVudC5cbiAgI1xuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmdldE5vdEZvdW5kYC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxuICAjIEBwYXJhbSB7Kn0gcm9vdFxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICMjI1xuICBAZ2V0Tm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cbiAgICB1bmRlZmluZWRcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRoZSB2YWx1ZSB0byB1c2Ugd2hlbiBgLnNldGAgZmFpbHMgdG8gbG9jYXRlIGEgcG9pbnRlciBzZWdtZW50LlxuICAjXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuc2V0Tm90Rm91bmRgLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XG4gICMgQHBhcmFtIHsqfSByb290XG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cbiAgIyMjXG4gIEBzZXROb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxuICAgIGlmIHNlZ21lbnRzW2lTZWdtZW50ICsgMV0ubWF0Y2goL14oPzowfFsxLTldXFxkKnwtKSQvKVxuICAgICAgcmV0dXJuIG9ialtzZWdtZW50XSA9IFtdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG9ialtzZWdtZW50XSA9IHt9XG5cbiAgIyMjXG4gICMgUGVyZm9ybXMgYW4gYWN0aW9uIHdoZW4gYC5kZWxgIGZhaWxzIHRvIGxvY2F0ZSBhIHBvaW50ZXIgc2VnbWVudC5cbiAgI1xuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmRlbE5vdEZvdW5kYC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxuICAjIEBwYXJhbSB7Kn0gcm9vdFxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICMjI1xuICBAZGVsTm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cbiAgICB1bmRlZmluZWRcblxuICAjIyNcbiAgIyBSYWlzZXMgYSBKc29uUG9pbnRlckVycm9yIHdoZW4gdGhlIGdpdmVuIHBvaW50ZXIgc2VnbWVudCBpcyBub3QgZm91bmQuXG4gICNcbiAgIyBNYXkgYmUgdXNlZCBpbiBwbGFjZSBvZiB0aGUgYWJvdmUgbWV0aG9kcyB2aWEgdGhlIGBvcHRpb25zYCBhcmd1bWVudCBvZiBgLi8uZ2V0Ly5zZXQvLmhhcy8uZGVsLy5zaW1wbGVCaW5kYC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxuICAjIEBwYXJhbSB7Kn0gcm9vdFxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICMjI1xuICBAZXJyb3JOb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxuICAgIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiVW5hYmxlIHRvIGZpbmQganNvbiBwYXRoOiAje0pzb25Qb2ludGVyLmNvbXBpbGUoc2VnbWVudHMuc2xpY2UoMCwgaVNlZ21lbnQrMSkpfVwiKVxuXG4gICMjI1xuICAjIFNldHMgdGhlIGxvY2F0aW9uIGluIGBvYmplY3RgLCBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgLCB0byBgdmFsdWVgLlxuICAjIElmIGBwb2ludGVyYCByZWZlcnMgdG8gdGhlIHdob2xlIGRvY3VtZW50LCBgdmFsdWVgIGlzIHJldHVybmVkIHdpdGhvdXQgbW9kaWZ5aW5nIGBvYmplY3RgLFxuICAjIG90aGVyd2lzZSwgYG9iamVjdGAgbW9kaWZpZWQgYW5kIHJldHVybmVkLlxuICAjXG4gICMgQnkgZGVmYXVsdCwgaWYgYW55IGxvY2F0aW9uIHNwZWNpZmllZCBieSBgcG9pbnRlcmAgZG9lcyBub3QgZXhpc3QsIHRoZSBsb2NhdGlvbiBpcyBjcmVhdGVkIHVzaW5nIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgIyBBcnJheXMgYXJlIHVzZWQgb25seSB3aGVuIHRoZSBpbW1lZGlhdGVseSBmb2xsb3dpbmcgcGF0aCBzZWdtZW50IGlzIGFuIGFycmF5IGVsZW1lbnQgYXMgZGVmaW5lZCBieSB0aGUgc3RhbmRhcmQuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXG4gICMgQHBhcmFtIHtzZXRQcm9wfSBvcHRpb25zLnNldFByb3BcbiAgIyBAcGFyYW0ge25vdEZvdW5kfSBvcHRpb25zLmdldE5vdEZvdW5kXG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuICBAc2V0OiAob2JqLCBwb2ludGVyLCB2YWx1ZSwgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXG5cbiAgICBpZiBwb2ludGVyLmxlbmd0aCA9PSAwXG4gICAgICByZXR1cm4gdmFsdWVcblxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcbiAgICBzZXRQcm9wID0gb3B0aW9ucz8uc2V0UHJvcCA/IEpzb25Qb2ludGVyLnNldFByb3BcbiAgICBzZXROb3RGb3VuZCA9IG9wdGlvbnM/LnNldE5vdEZvdW5kID8gSnNvblBvaW50ZXIuc2V0Tm90Rm91bmRcblxuICAgIHJvb3QgPSBvYmpcbiAgICBpU2VnbWVudCA9IDBcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxuXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cbiAgICAgICsraVNlZ21lbnRcblxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxuXG4gICAgICBpZiBpU2VnbWVudCA9PSBsZW5cbiAgICAgICAgc2V0UHJvcChvYmosIHNlZ21lbnQsIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgICAgZWxzZSBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXG4gICAgICAgIG9iaiA9IHNldE5vdEZvdW5kKG9iaiwgc2VnbWVudCwgcm9vdCwgcG9pbnRlciwgaVNlZ21lbnQgLSAxKVxuICAgICAgZWxzZVxuICAgICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcblxuICAgIHJldHVybiByb290XG5cbiAgIyMjXG4gICMgRmluZHMgdGhlIHZhbHVlIGluIGBvYmpgIGFzIHNwZWNpZmllZCBieSBgcG9pbnRlcmBcbiAgI1xuICAjIEJ5IGRlZmF1bHQsIHJldHVybnMgdW5kZWZpbmVkIGZvciB2YWx1ZXMgd2hpY2ggY2Fubm90IGJlIGZvdW5kXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5nZXROb3RGb3VuZFxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcbiAgQGdldDogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXG5cbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXG4gICAgZ2V0Tm90Rm91bmQgPSBvcHRpb25zPy5nZXROb3RGb3VuZCA/IEpzb25Qb2ludGVyLmdldE5vdEZvdW5kXG5cbiAgICByb290ID0gb2JqXG4gICAgaVNlZ21lbnQgPSAwXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxuICAgICAgKytpU2VnbWVudFxuXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXG5cbiAgICAgIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcbiAgICAgICAgcmV0dXJuIGdldE5vdEZvdW5kKG9iaiwgc2VnbWVudCwgcm9vdCwgcG9pbnRlciwgaVNlZ21lbnQgLSAxKVxuICAgICAgZWxzZVxuICAgICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcblxuICAgIHJldHVybiBvYmpcblxuICAjIyNcbiAgIyBSZW1vdmVzIHRoZSBsb2NhdGlvbiwgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCwgZnJvbSBgb2JqZWN0YC5cbiAgIyBSZXR1cm5zIHRoZSBtb2RpZmllZCBgb2JqZWN0YCwgb3IgdW5kZWZpbmVkIGlmIHRoZSBgcG9pbnRlcmAgaXMgZW1wdHkuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5kZWxOb3RGb3VuZFxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcbiAgQGRlbDogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXG5cbiAgICBpZiBwb2ludGVyLmxlbmd0aCA9PSAwXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXG4gICAgZGVsTm90Rm91bmQgPSBvcHRpb25zPy5kZWxOb3RGb3VuZCA/IEpzb25Qb2ludGVyLmRlbE5vdEZvdW5kXG5cbiAgICByb290ID0gb2JqXG4gICAgaVNlZ21lbnQgPSAwXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxuICAgICAgKytpU2VnbWVudFxuXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXG5cbiAgICAgIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcbiAgICAgICAgZGVsTm90Rm91bmQob2JqLCBzZWdtZW50LCByb290LCBwb2ludGVyLCBpU2VnbWVudCAtIDEpXG4gICAgICAgIGJyZWFrXG4gICAgICBlbHNlIGlmIGlTZWdtZW50ID09IGxlblxuICAgICAgICBkZWxldGUgb2JqW3NlZ21lbnRdXG4gICAgICAgIGJyZWFrXG4gICAgICBlbHNlXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxuXG4gICAgcmV0dXJuIHJvb3RcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRydWUgaWZmIHRoZSBsb2NhdGlvbiwgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCwgZXhpc3RzIGluIGBvYmplY3RgXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuICBAaGFzOiAob2JqLCBwb2ludGVyLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcblxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcblxuICAgIGlTZWdtZW50ID0gMFxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cbiAgICAgICsraVNlZ21lbnRcblxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxuXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcblxuICAgIHJldHVybiB0cnVlXG4iXX0=
