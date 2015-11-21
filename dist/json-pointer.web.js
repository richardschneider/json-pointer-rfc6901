;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.JSON.pointer = factory();
  }
}(this, function () {
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

//# sourceMappingURL=data:application/json;base64,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LFFBQUEsQ0FBUyxPQUFULEVBQWtCLEVBQWxCLEVBRFA7O01BR0wsSUFBRyxDQUFJLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYixDQUFQO0FBQ0UsZUFBTyxNQURUOztNQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQWI7SUFaUjtBQWNBLFdBQU87RUF2QkgiLCJmaWxlIjoianNvbi1wb2ludGVyLndlYi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEpzb25Qb2ludGVyRXJyb3IgZXh0ZW5kcyBFcnJvclxuICBjb25zdHJ1Y3RvcjogKG1lc3NhZ2UpIC0+XG4gICAgYmFzZSA9IHN1cGVyKG1lc3NhZ2UpXG5cbiAgICBAbWVzc2FnZSA9IGJhc2UubWVzc2FnZVxuICAgIEBzdGFjayA9IGJhc2Uuc3RhY2tcbiAgICBAbmFtZSA9IEBjb25zdHJ1Y3Rvci5uYW1lXG5cbmNsYXNzIEpzb25Qb2ludGVyXG4gIEBKc29uUG9pbnRlckVycm9yOiBKc29uUG9pbnRlckVycm9yXG5cbiAgIyMjXG4gICMgQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNob29zaW5nIGJldHdlZW4gYC5zbWFydEJpbmRgLCBgLmdldGAsIGFuZCBgLnNldGAsIGRlcGVuZGluZyBvbiB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cy5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqZWN0XG4gICMgQHBhcmFtIHtzdHJpbmd9IHBvaW50ZXJcbiAgIyBAcGFyYW0geyp9IHZhbHVlXG4gICMgQHJldHVybnMgeyp9IGV2YWx1YXRpb24gb2YgdGhlIHByb3hpZWQgbWV0aG9kXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKG9iamVjdCwgcG9pbnRlciwgdmFsdWUpIC0+XG4gICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICB3aGVuIDMgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSlcbiAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLmdldChvYmplY3QsIHBvaW50ZXIpXG4gICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zbWFydEJpbmQoeyBvYmplY3Q6IG9iamVjdCB9KVxuICAgICAgZWxzZSBudWxsXG5cbiAgIyMjXG4gICMgQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBhcGksIHdpdGggYC4vLmdldC8uaGFzLy5zZXQvLmRlbC8uc21hcnRCaW5kYCBtZXRob2Qgc2lnbmF0dXJlcyBhZGp1c3RlZC5cbiAgIyBUaGUgc21hcnRCaW5kIG1ldGhvZCBpcyBjdW11bGF0aXZlLCBtZWFuaW5nIHRoYXQgYC5zbWFydEJpbmQoeyBvYmplY3Q6IHh9KS5zbWFydEJpbmQoeyBwb2ludGVyOiB5IH0pYCB3aWxsIGJlaGF2ZSBhcyBleHBlY3RlZC5cbiAgI1xuICAjIEBwYXJhbSB7T2JqZWN0fSBiaW5kaW5nc1xuICAjIEBwYXJhbSB7Kn0gYmluZGluZ3Mub2JqZWN0XG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IGJpbmRpbmdzLnBvaW50ZXJcbiAgIyBAcGFyYW0ge09iamVjdH0gYmluZGluZ3Mub3B0aW9uc1xuICAjIEByZXR1cm5zIHtKc29uUG9pbnRlcn1cbiAgIyMjXG4gIEBzbWFydEJpbmQ6ICh7IG9iamVjdDogb2JqLCBwb2ludGVyOiBwdHIsIGZyYWdtZW50OiBmcmFnLCBvcHRpb25zOiBvcHQgfSkgLT5cbiAgICAjIGZyYWdtZW50IG92ZXJyaWRlcyBwb2ludGVyXG4gICAgcHRyID0gZnJhZyA/IHB0clxuXG4gICAgIyBXaGF0IGFyZSBiaW5kaW5nP1xuICAgIGhhc09iaiA9IG9iaiAhPSB1bmRlZmluZWRcbiAgICBoYXNQdHIgPSBwdHI/XG4gICAgaGFzT3B0ID0gb3B0P1xuXG4gICAgIyBMZXRzIG5vdCBwYXJzZSB0aGlzIGV2ZXJ5IHRpbWUhXG4gICAgaWYgdHlwZW9mIHB0ciA9PSAnc3RyaW5nJ1xuICAgICAgcHRyID0gQHBhcnNlKHB0cilcblxuICAgICMgZGVmYXVsdCBvcHRpb25zIGhhdmUgY2hhbmdlZFxuICAgIG1lcmdlT3B0aW9ucyA9IChvdmVycmlkZSA9IHt9KSAtPlxuICAgICAgbyA9IHt9XG5cbiAgICAgIG8uaGFzT3duUHJvcCA9IG92ZXJyaWRlLmhhc093blByb3AgPyBvcHQuaGFzT3duUHJvcFxuICAgICAgby5nZXRQcm9wID0gb3ZlcnJpZGUuZ2V0UHJvcCA/IG9wdC5nZXRQcm9wXG4gICAgICBvLnNldFByb3AgPSBvdmVycmlkZS5zZXRQcm9wID8gb3B0LnNldFByb3BcbiAgICAgIG8uZ2V0Tm90Rm91bmQgPSBvdmVycmlkZS5nZXROb3RGb3VuZCA/IG9wdC5nZXROb3RGb3VuZFxuICAgICAgby5zZXROb3RGb3VuZCA9IG92ZXJyaWRlLnNldE5vdEZvdW5kID8gb3B0LnNldE5vdEZvdW5kXG4gICAgICBvLmRlbE5vdEZvdW5kID0gb3ZlcnJpZGUuZGVsTm90Rm91bmQgPyBvcHQuZGVsTm90Rm91bmRcblxuICAgICAgcmV0dXJuIG9cblxuICAgIGFwaSA9IHVuZGVmaW5lZFxuXG4gICAgIyBFdmVyeSBjb21iaW5hdGlvbiBvZiBiaW5kaW5nc1xuICAgIGlmIGhhc09iaiBhbmQgaGFzUHRyIGFuZCBoYXNPcHRcbiAgICAgIGFwaSA9ICh2YWx1ZSkgLT5cbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxuICAgICAgICAgIHdoZW4gMCB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxuICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICBhcGkuc2V0ID0gKHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5nZXQgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5oYXMgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5kZWwgPSAob3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICBlbHNlIGlmIGhhc09iaiBhbmQgaGFzUHRyXG4gICAgICBhcGkgPSAodmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUpXG4gICAgICAgICAgd2hlbiAwIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxuICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICBhcGkuc2V0ID0gKHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXG4gICAgICBhcGkuZ2V0ID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgICAgYXBpLmhhcyA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICAgIGFwaS5kZWwgPSAob3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgZWxzZSBpZiBoYXNPYmogYW5kIGhhc09wdFxuICAgICAgYXBpID0gKHB0ciwgdmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcbiAgICAgICAgICBlbHNlIG51bGxcblxuICAgICAgYXBpLnNldCA9IChwdHIsIHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5nZXQgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmhhcyA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZGVsID0gKHB0ciwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICBlbHNlIGlmIGhhc1B0ciBhbmQgaGFzT3B0XG4gICAgICBhcGkgPSAob2JqLCB2YWx1ZSkgLT5cbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxuICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICBhcGkuc2V0ID0gKG9iaiwgdmFsdWUsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmdldCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuaGFzID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5kZWwgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgIGVsc2UgaWYgaGFzT3B0XG4gICAgICBhcGkgPSAob2JqLCBwdHIsIHZhbHVlKSAtPlxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDMgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXG4gICAgICAgICAgd2hlbiAxIHRoZW4gYXBpLnNtYXJ0QmluZCh7IG9iamVjdDogb2JqIH0pXG4gICAgICAgICAgZWxzZSBudWxsXG5cbiAgICAgIGFwaS5zZXQgPSAob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuaGFzID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmRlbCA9IChvYmosIHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICBlbHNlIGlmIGhhc09ialxuICAgICAgYXBpID0gKHB0ciwgdmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUpXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxuICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICBhcGkuc2V0ID0gKHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSlcbiAgICAgIGFwaS5nZXQgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICAgIGFwaS5oYXMgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICAgIGFwaS5kZWwgPSAocHRyLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICBlbHNlIGlmIGhhc1B0clxuICAgICAgYXBpID0gKG9iaiwgdmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUpXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxuICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICBhcGkuc2V0ID0gKG9iaiwgdmFsdWUsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSlcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICAgIGFwaS5oYXMgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICAgIGFwaS5kZWwgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQFxuXG4gICAgIyBzbWFydEJpbmQgaGFzIG5ldyBkZWZhdWx0c1xuICAgIGFwaS5zbWFydEJpbmQgPSAob3ZlcnJpZGUpIC0+XG4gICAgICBvID0ge31cblxuICAgICAgaWYge30uaGFzT3duUHJvcGVydHkuY2FsbChvdmVycmlkZSwgJ29iamVjdCcpXG4gICAgICAgIG8ub2JqZWN0ID0gb3ZlcnJpZGUub2JqZWN0XG4gICAgICBlbHNlIGlmIGhhc09ialxuICAgICAgICBvLm9iamVjdCA9IG9ialxuXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAncG9pbnRlcicpXG4gICAgICAgIG8ucG9pbnRlciA9IG92ZXJyaWRlLnBvaW50ZXJcbiAgICAgIGVsc2UgaWYgaGFzUHRyXG4gICAgICAgIG8ucG9pbnRlciA9IHB0clxuXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAnb3B0aW9ucycpXG4gICAgICAgIG8ub3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhvdmVycmlkZS5vcHRpb25zKVxuICAgICAgZWxzZSBpZiBoYXNPYmpcbiAgICAgICAgby5vcHRpb25zID0gb3B0XG5cbiAgICAgIHJldHVybiBKc29uUG9pbnRlci5zbWFydEJpbmQobylcblxuICAgIGlmIGhhc1B0clxuICAgICAgIyMjXG4gICAgICAjIGdldC9zZXQgYm91bmQgcG9pbnRlciB2YWx1ZVxuICAgICAgI1xuICAgICAgIyBPbmx5IGF2YWlsYWJsZSB3aGVuIHBvaW50ZXIgaGFzIGJlZW4gYm91bmRcbiAgICAgICNcbiAgICAgICMgQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAgICAjIEByZXR1cm5zIHN0cmluZ1tdIHNlZ21lbnRzXG4gICAgICAjIyNcbiAgICAgIGFwaS5wb2ludGVyID0gKHZhbHVlKSAtPlxuICAgICAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDBcbiAgICAgICAgICByZXR1cm4gSnNvblBvaW50ZXIuY29tcGlsZVBvaW50ZXIocHRyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHB0ciA9IEpzb25Qb2ludGVyLnBhcnNlUG9pbnRlcih2YWx1ZSlcblxuICAgICAgIyMjXG4gICAgICAjIGdldC9zZXQgYm91bmQgcG9pbnRlciB2YWx1ZSBhcyBmcmFnbWVudFxuICAgICAgI1xuICAgICAgIyBPbmx5IGF2YWlsYWJsZSB3aGVuIHBvaW50ZXIgaGFzIGJlZW4gYm91bmRcbiAgICAgICNcbiAgICAgICMgQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAgICAjIEByZXR1cm5zIHN0cmluZ1tdIHNlZ21lbnRzXG4gICAgICAjIyNcbiAgICAgIGFwaS5mcmFnbWVudCA9ICh2YWx1ZSkgLT5cbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgcmV0dXJuIEpzb25Qb2ludGVyLmNvbXBpbGVGcmFnbWVudChwdHIpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gcHRyID0gSnNvblBvaW50ZXIucGFyc2VGcmFnbWVudCh2YWx1ZSlcblxuICAgIGlmIGhhc09ialxuICAgICAgIyMjXG4gICAgICAjIGdldC9zZXQgYm91bmQgb2JqZWN0XG4gICAgICAjXG4gICAgICAjIE9ubHkgYXZhaWxhYmxlIHdoZW4gb2JqZWN0IGhhcyBiZWVuIGJvdW5kXG4gICAgICAjXG4gICAgICAjIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgICMgQHJldHVybnMgeyp9IGJvdW5kIG9iamVjdFxuICAgICAgIyMjXG4gICAgICBhcGkub2JqZWN0ID0gKHZhbHVlKSAtPlxuICAgICAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDBcbiAgICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXR1cm4gb2JqID0gdmFsdWVcblxuICAgIGlmIGhhc09wdFxuICAgICAgIyMjXG4gICAgICAjIGdldC9zZXQgYm91bmQgb3B0aW9uc1xuICAgICAgI1xuICAgICAgIyBPbmx5IGF2YWlsYWJsZSB3aGVuIG9wdGlvbnMgaGFzIGJlZW4gYm91bmRcbiAgICAgICNcbiAgICAgICMgQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAgIyBAcmV0dXJucyB7Kn0gYm91bmQgb3B0aW9uc1xuICAgICAgIyMjXG4gICAgICBhcGkub3B0aW9ucyA9ICh2YWx1ZSkgLT5cbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgcmV0dXJuIG9wdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIG9wdCA9IHZhbHVlXG5cbiAgICAjIGNvcHkgdGhlIHJlbWFpbmluZyBtZXRob2RzIHdoaWNoIGRvIG5vdCBuZWVkIGJpbmRpbmdcbiAgICBmb3Igb3duIGtleSwgdmFsIG9mIEpzb25Qb2ludGVyXG4gICAgICBpZiBub3Qge30uaGFzT3duUHJvcGVydHkuY2FsbChhcGksIGtleSlcbiAgICAgICAgYXBpW2tleV0gPSB2YWxcblxuICAgICMgZmluYWwgcmVzdWx0XG4gICAgcmV0dXJuIGFwaVxuXG4gICMjI1xuICAjIEVzY2FwZXMgdGhlIGdpdmVuIHBhdGggc2VnbWVudCBhcyBkZXNjcmliZWQgYnkgUkZDNjkwMS5cbiAgI1xuICAjIE5vdGFibHksIGAnfidgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+MCdgIGFuZCBgJy8nYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfjEnYC5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XG4gICMgQHJldHVybnMge3N0cmluZ31cbiAgIyMjXG4gIEBlc2NhcGU6IChzZWdtZW50KSAtPlxuICAgIHNlZ21lbnQucmVwbGFjZSgvfi9nLCAnfjAnKS5yZXBsYWNlKC9cXC8vZywgJ34xJylcblxuICAjIyNcbiAgIyBFc2NhcGVzIHRoZSBnaXZlbiBwYXRoIGZyYWdtZW50IHNlZ21lbnQgYXMgZGVzY3JpYmVkIGJ5IFJGQzY5MDEuXG4gICNcbiAgIyBOb3RhYmx5LCBgJ34nYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfjAnYCBhbmQgYCcvJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34xJ2AgYW5kIGZpbmFsbHkgdGhlIHN0cmluZyBpcyBVUkkgZW5jb2RlZC5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XG4gICMgQHJldHVybnMge3N0cmluZ31cbiAgIyMjXG4gIEBlc2NhcGVGcmFnbWVudDogKHNlZ21lbnQpIC0+XG4gICAgZW5jb2RlVVJJQ29tcG9uZW50KEpzb25Qb2ludGVyLmVzY2FwZShzZWdtZW50KSlcblxuICAjIyNcbiAgIyBVbi1Fc2NhcGVzIHRoZSBnaXZlbiBwYXRoIHNlZ21lbnQsIHJldmVyc2luZyB0aGUgYWN0aW9ucyBvZiBgLmVzY2FwZWAuXG4gICNcbiAgIyBOb3RhYmx5LCBgJ34xJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJy8nYCBhbmQgYCd+MCdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+J2AuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc2VnbWVudFxuICAjIEByZXR1cm5zIHtzdHJpbmd9XG4gICMjI1xuICBAdW5lc2NhcGU6IChzZWdtZW50KSAtPlxuICAgIHNlZ21lbnQucmVwbGFjZSgvfjEvZywgJy8nKS5yZXBsYWNlKC9+MC9nLCAnficpXG5cbiAgIyMjXG4gICMgVW4tRXNjYXBlcyB0aGUgZ2l2ZW4gcGF0aCBmcmFnbWVudCBzZWdtZW50LCByZXZlcnNpbmcgdGhlIGFjdGlvbnMgb2YgYC5lc2NhcGVGcmFnbWVudGAuXG4gICNcbiAgIyBOb3RhYmx5LCB0aGUgc3RyaW5nIGlzIFVSSSBkZWNvZGVkIGFuZCB0aGVuIGAnfjEnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnLydgIGFuZCBgJ34wJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34nYC5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XG4gICMgQHJldHVybnMge3N0cmluZ31cbiAgIyMjXG4gIEB1bmVzY2FwZUZyYWdtZW50OiAoc2VnbWVudCkgLT5cbiAgICBKc29uUG9pbnRlci51bmVzY2FwZShkZWNvZGVVUklDb21wb25lbnQoc2VnbWVudCkpXG5cbiAgIyMjXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgc3RyYCBpcyBhIHZhbGlkIGpzb24gcG9pbnRlciB2YWx1ZVxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxuICAjIEByZXR1cm5zIHtCb29sZWFufVxuICAjIyNcbiAgQGlzUG9pbnRlcjogKHN0cikgLT5cbiAgICBzd2l0Y2ggc3RyLmNoYXJBdCgwKVxuICAgICAgd2hlbiAnJyB0aGVuIHJldHVybiB0cnVlXG4gICAgICB3aGVuICcvJyB0aGVuIHJldHVybiB0cnVlXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICMjI1xuICAjIFJldHVybnMgdHJ1ZSBpZmYgYHN0cmAgaXMgYSB2YWxpZCBqc29uIGZyYWdtZW50IHBvaW50ZXIgdmFsdWVcbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgIyMjXG4gIEBpc0ZyYWdtZW50OiAoc3RyKSAtPlxuICAgIHN3aXRjaCBzdHIuc3Vic3RyaW5nKDAsIDIpXG4gICAgICB3aGVuICcjJyB0aGVuIHJldHVybiB0cnVlXG4gICAgICB3aGVuICcjLycgdGhlbiByZXR1cm4gdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAjIyNcbiAgIyBQYXJzZXMgYSBqc29uLXBvaW50ZXIgb3IganNvbiBmcmFnbWVudCBwb2ludGVyLCBhcyBkZXNjcmliZWQgYnkgUkZDOTAxLCBpbnRvIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXG4gICNcbiAgIyBAdGhyb3dzIHtKc29uUG9pbnRlckVycm9yfSBmb3IgaW52YWxpZCBqc29uLXBvaW50ZXJzLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxuICAjIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgIyMjXG4gIEBwYXJzZTogKHN0cikgLT5cbiAgICBzd2l0Y2ggc3RyLmNoYXJBdCgwKVxuICAgICAgd2hlbiAnJyB0aGVuIHJldHVybiBbXVxuICAgICAgd2hlbiAnLycgdGhlbiByZXR1cm4gc3RyLnN1YnN0cmluZygxKS5zcGxpdCgnLycpLm1hcChKc29uUG9pbnRlci51bmVzY2FwZSlcbiAgICAgIHdoZW4gJyMnXG4gICAgICAgIHN3aXRjaCBzdHIuY2hhckF0KDEpXG4gICAgICAgICAgd2hlbiAnJyB0aGVuIHJldHVybiBbXVxuICAgICAgICAgIHdoZW4gJy8nIHRoZW4gcmV0dXJuIHN0ci5zdWJzdHJpbmcoMikuc3BsaXQoJy8nKS5tYXAoSnNvblBvaW50ZXIudW5lc2NhcGVGcmFnbWVudClcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIkludmFsaWQgSlNPTiBmcmFnbWVudCBwb2ludGVyOiAje3N0cn1cIilcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJJbnZhbGlkIEpTT04gcG9pbnRlcjogI3tzdHJ9XCIpXG5cbiAgIyMjXG4gICMgUGFyc2VzIGEganNvbi1wb2ludGVyLCBhcyBkZXNjcmliZWQgYnkgUkZDOTAxLCBpbnRvIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXG4gICNcbiAgIyBAdGhyb3dzIHtKc29uUG9pbnRlckVycm9yfSBmb3IgaW52YWxpZCBqc29uLXBvaW50ZXJzLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxuICAjIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgIyMjXG4gIEBwYXJzZVBvaW50ZXI6IChzdHIpIC0+XG4gICAgc3dpdGNoIHN0ci5jaGFyQXQoMClcbiAgICAgIHdoZW4gJycgdGhlbiByZXR1cm4gW11cbiAgICAgIHdoZW4gJy8nIHRoZW4gcmV0dXJuIHN0ci5zdWJzdHJpbmcoMSkuc3BsaXQoJy8nKS5tYXAoSnNvblBvaW50ZXIudW5lc2NhcGUpXG4gICAgICBlbHNlIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiSW52YWxpZCBKU09OIHBvaW50ZXI6ICN7c3RyfVwiKVxuXG4gICMjI1xuICAjIFBhcnNlcyBhIGpzb24gZnJhZ21lbnQgcG9pbnRlciwgYXMgZGVzY3JpYmVkIGJ5IFJGQzkwMSwgaW50byBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzLlxuICAjXG4gICMgQHRocm93cyB7SnNvblBvaW50ZXJFcnJvcn0gZm9yIGludmFsaWQganNvbi1wb2ludGVycy5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nW119XG4gICMjI1xuICBAcGFyc2VGcmFnbWVudDogKHN0cikgLT5cbiAgICBzd2l0Y2ggc3RyLnN1YnN0cmluZygwLCAyKVxuICAgICAgd2hlbiAnIycgdGhlbiByZXR1cm4gW11cbiAgICAgIHdoZW4gJyMvJyB0aGVuIHJldHVybiBzdHIuc3Vic3RyaW5nKDIpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlRnJhZ21lbnQpXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiSW52YWxpZCBKU09OIGZyYWdtZW50IHBvaW50ZXI6ICN7c3RyfVwiKVxuXG4gICMjI1xuICAjIENvbnZlcnRzIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMgaW50byBhIGpzb24gcG9pbnRlci5cbiAgIyBUaGlzIG1ldGhvZCBpcyB0aGUgcmV2ZXJzZSBvZiBgLnBhcnNlUG9pbnRlcmAuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xuICAjIEByZXR1cm5zIHtzdHJpbmd9XG4gICMjI1xuICBAY29tcGlsZTogKHNlZ21lbnRzKSAtPlxuICAgIHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgLT4gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlKHNlZ21lbnQpKS5qb2luKCcnKVxuXG4gICMjI1xuICAjIENvbnZlcnRzIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMgaW50byBhIGpzb24gcG9pbnRlci5cbiAgIyBUaGlzIG1ldGhvZCBpcyB0aGUgcmV2ZXJzZSBvZiBgLnBhcnNlUG9pbnRlcmAuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xuICAjIEByZXR1cm5zIHtzdHJpbmd9XG4gICMjI1xuICBAY29tcGlsZVBvaW50ZXI6IChzZWdtZW50cykgLT5cbiAgICBzZWdtZW50cy5tYXAoKHNlZ21lbnQpIC0+ICcvJyArIEpzb25Qb2ludGVyLmVzY2FwZShzZWdtZW50KSkuam9pbignJylcblxuICAjIyNcbiAgIyBDb252ZXJ0cyBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzIGludG8gYSBqc29uIGZyYWdtZW50IHBvaW50ZXIuXG4gICMgVGhpcyBtZXRob2QgaXMgdGhlIHJldmVyc2Ugb2YgYC5wYXJzZUZyYWdtZW50YC5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXG4gICMgQHJldHVybnMge3N0cmluZ31cbiAgIyMjXG4gIEBjb21waWxlRnJhZ21lbnQ6IChzZWdtZW50cykgLT5cbiAgICAnIycgKyBzZWdtZW50cy5tYXAoKHNlZ21lbnQpIC0+ICcvJyArIEpzb25Qb2ludGVyLmVzY2FwZUZyYWdtZW50KHNlZ21lbnQpKS5qb2luKCcnKVxuXG4gICMjI1xuICAjIENhbGxiYWNrIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHByb3BlcnR5LlxuICAjXG4gICMgQGNhbGxiYWNrIGhhc1Byb3BcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEByZXR1cm5zIHtCb29sZWFufVxuICAjIyNcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBvYmpgIGNvbnRhaW5zIGBrZXlgIGFuZCBgb2JqYCBpcyBlaXRoZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0LlxuICAjIElnbm9yZXMgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgI1xuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmhhc1Byb3BgLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgIyMjXG4gIEBoYXNKc29uUHJvcDogKG9iaiwga2V5KSAtPlxuICAgIGlmIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgcmV0dXJuICh0eXBlb2Yga2V5ID09ICdudW1iZXInKSBhbmQgKGtleSA8IG9iai5sZW5ndGgpXG4gICAgZWxzZSBpZiB0eXBlb2Ygb2JqID09ICdvYmplY3QnXG4gICAgICByZXR1cm4ge30uaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBvYmpgIGNvbnRhaW5zIGBrZXlgLCBkaXNyZWdhcmRpbmcgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHJldHVybnMge0Jvb2xlYW59XG4gICMjI1xuICBAaGFzT3duUHJvcDogKG9iaiwga2V5KSAtPlxuICAgIHt9Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXG5cbiAgIyMjXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCwgaW5jbHVkaW5nIHZpYSB0aGUgcHJvdG90eXBlIGNoYWluLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgIyMjXG4gIEBoYXNQcm9wOiAob2JqLCBrZXkpIC0+XG4gICAga2V5IG9mIG9ialxuXG4gICMjI1xuICAjIENhbGxiYWNrIHVzZWQgdG8gcmV0cmlldmUgYSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdFxuICAjXG4gICMgQGNhbGxiYWNrIGdldFByb3BcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcblxuICAjIyNcbiAgIyBGaW5kcyB0aGUgZ2l2ZW4gYGtleWAgaW4gYG9iamAuXG4gICNcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5nZXRQcm9wYC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuICBAZ2V0UHJvcDogKG9iaiwga2V5KSAtPlxuICAgIG9ialtrZXldXG5cbiAgIyMjXG4gICMgQ2FsbGJhY2sgdXNlZCB0byBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3QuXG4gICNcbiAgIyBAY2FsbGJhY2sgc2V0UHJvcFxuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcblxuICAjIyNcbiAgIyBTZXRzIHRoZSBnaXZlbiBga2V5YCBpbiBgb2JqYCB0byBgdmFsdWVgLlxuICAjXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuc2V0UHJvcGAuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEBwYXJhbSB7Kn0gdmFsdWVcbiAgIyBAcmV0dXJucyB7Kn0gYHZhbHVlYFxuICAjIyNcbiAgQHNldFByb3A6IChvYmosIGtleSwgdmFsdWUpIC0+XG4gICAgb2JqW2tleV0gPSB2YWx1ZVxuXG4gICMjI1xuICAjIENhbGxiYWNrIHVzZWQgdG8gbW9kaWZ5IGJlaGF2aW91ciB3aGVuIGEgZ2l2ZW4gcGF0aCBzZWdtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAgI1xuICAjIEBjYWxsYmFjayBub3RGb3VuZFxuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuXG4gICMjI1xuICAjIFJldHVybnMgdGhlIHZhbHVlIHRvIHVzZSB3aGVuIGAuZ2V0YCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXG4gICNcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5nZXROb3RGb3VuZGAuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcbiAgIyBAcGFyYW0geyp9IHJvb3RcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAjIyNcbiAgQGdldE5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XG4gICAgdW5kZWZpbmVkXG5cbiAgIyMjXG4gICMgUmV0dXJucyB0aGUgdmFsdWUgdG8gdXNlIHdoZW4gYC5zZXRgIGZhaWxzIHRvIGxvY2F0ZSBhIHBvaW50ZXIgc2VnbWVudC5cbiAgI1xuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLnNldE5vdEZvdW5kYC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxuICAjIEBwYXJhbSB7Kn0gcm9vdFxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICMjI1xuICBAc2V0Tm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cbiAgICBpZiBzZWdtZW50c1tpU2VnbWVudCArIDFdLm1hdGNoKC9eKD86MHxbMS05XVxcZCp8LSkkLylcbiAgICAgIHJldHVybiBvYmpbc2VnbWVudF0gPSBbXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBvYmpbc2VnbWVudF0gPSB7fVxuXG4gICMjI1xuICAjIFBlcmZvcm1zIGFuIGFjdGlvbiB3aGVuIGAuZGVsYCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXG4gICNcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5kZWxOb3RGb3VuZGAuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcbiAgIyBAcGFyYW0geyp9IHJvb3RcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAjIyNcbiAgQGRlbE5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XG4gICAgdW5kZWZpbmVkXG5cbiAgIyMjXG4gICMgUmFpc2VzIGEgSnNvblBvaW50ZXJFcnJvciB3aGVuIHRoZSBnaXZlbiBwb2ludGVyIHNlZ21lbnQgaXMgbm90IGZvdW5kLlxuICAjXG4gICMgTWF5IGJlIHVzZWQgaW4gcGxhY2Ugb2YgdGhlIGFib3ZlIG1ldGhvZHMgdmlhIHRoZSBgb3B0aW9uc2AgYXJndW1lbnQgb2YgYC4vLmdldC8uc2V0Ly5oYXMvLmRlbC8uc2ltcGxlQmluZGAuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcbiAgIyBAcGFyYW0geyp9IHJvb3RcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAjIyNcbiAgQGVycm9yTm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cbiAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIlVuYWJsZSB0byBmaW5kIGpzb24gcGF0aDogI3tKc29uUG9pbnRlci5jb21waWxlKHNlZ21lbnRzLnNsaWNlKDAsIGlTZWdtZW50KzEpKX1cIilcblxuICAjIyNcbiAgIyBTZXRzIHRoZSBsb2NhdGlvbiBpbiBgb2JqZWN0YCwgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCwgdG8gYHZhbHVlYC5cbiAgIyBJZiBgcG9pbnRlcmAgcmVmZXJzIHRvIHRoZSB3aG9sZSBkb2N1bWVudCwgYHZhbHVlYCBpcyByZXR1cm5lZCB3aXRob3V0IG1vZGlmeWluZyBgb2JqZWN0YCxcbiAgIyBvdGhlcndpc2UsIGBvYmplY3RgIG1vZGlmaWVkIGFuZCByZXR1cm5lZC5cbiAgI1xuICAjIEJ5IGRlZmF1bHQsIGlmIGFueSBsb2NhdGlvbiBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgIGRvZXMgbm90IGV4aXN0LCB0aGUgbG9jYXRpb24gaXMgY3JlYXRlZCB1c2luZyBvYmplY3RzIGFuZCBhcnJheXMuXG4gICMgQXJyYXlzIGFyZSB1c2VkIG9ubHkgd2hlbiB0aGUgaW1tZWRpYXRlbHkgZm9sbG93aW5nIHBhdGggc2VnbWVudCBpcyBhbiBhcnJheSBlbGVtZW50IGFzIGRlZmluZWQgYnkgdGhlIHN0YW5kYXJkLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxuICAjIEBwYXJhbSB7c2V0UHJvcH0gb3B0aW9ucy5zZXRQcm9wXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5nZXROb3RGb3VuZFxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcbiAgQHNldDogKG9iaiwgcG9pbnRlciwgdmFsdWUsIG9wdGlvbnMpIC0+XG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxuXG4gICAgaWYgcG9pbnRlci5sZW5ndGggPT0gMFxuICAgICAgcmV0dXJuIHZhbHVlXG5cbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXG4gICAgc2V0UHJvcCA9IG9wdGlvbnM/LnNldFByb3AgPyBKc29uUG9pbnRlci5zZXRQcm9wXG4gICAgc2V0Tm90Rm91bmQgPSBvcHRpb25zPy5zZXROb3RGb3VuZCA/IEpzb25Qb2ludGVyLnNldE5vdEZvdW5kXG5cbiAgICByb290ID0gb2JqXG4gICAgaVNlZ21lbnQgPSAwXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcblxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXG4gICAgICArK2lTZWdtZW50XG5cbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcblxuICAgICAgaWYgaVNlZ21lbnQgPT0gbGVuXG4gICAgICAgIHNldFByb3Aob2JqLCBzZWdtZW50LCB2YWx1ZSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGVsc2UgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxuICAgICAgICBvYmogPSBzZXROb3RGb3VuZChvYmosIHNlZ21lbnQsIHJvb3QsIHBvaW50ZXIsIGlTZWdtZW50IC0gMSlcbiAgICAgIGVsc2VcbiAgICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXG5cbiAgICByZXR1cm4gcm9vdFxuXG4gICMjI1xuICAjIEZpbmRzIHRoZSB2YWx1ZSBpbiBgb2JqYCBhcyBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgXG4gICNcbiAgIyBCeSBkZWZhdWx0LCByZXR1cm5zIHVuZGVmaW5lZCBmb3IgdmFsdWVzIHdoaWNoIGNhbm5vdCBiZSBmb3VuZFxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxuICAjIEBwYXJhbSB7bm90Rm91bmR9IG9wdGlvbnMuZ2V0Tm90Rm91bmRcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG4gIEBnZXQ6IChvYmosIHBvaW50ZXIsIG9wdGlvbnMpIC0+XG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxuXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxuICAgIGdldE5vdEZvdW5kID0gb3B0aW9ucz8uZ2V0Tm90Rm91bmQgPyBKc29uUG9pbnRlci5nZXROb3RGb3VuZFxuXG4gICAgcm9vdCA9IG9ialxuICAgIGlTZWdtZW50ID0gMFxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cbiAgICAgICsraVNlZ21lbnRcblxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxuXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXG4gICAgICAgIHJldHVybiBnZXROb3RGb3VuZChvYmosIHNlZ21lbnQsIHJvb3QsIHBvaW50ZXIsIGlTZWdtZW50IC0gMSlcbiAgICAgIGVsc2VcbiAgICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXG5cbiAgICByZXR1cm4gb2JqXG5cbiAgIyMjXG4gICMgUmVtb3ZlcyB0aGUgbG9jYXRpb24sIHNwZWNpZmllZCBieSBgcG9pbnRlcmAsIGZyb20gYG9iamVjdGAuXG4gICMgUmV0dXJucyB0aGUgbW9kaWZpZWQgYG9iamVjdGAsIG9yIHVuZGVmaW5lZCBpZiB0aGUgYHBvaW50ZXJgIGlzIGVtcHR5LlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxuICAjIEBwYXJhbSB7bm90Rm91bmR9IG9wdGlvbnMuZGVsTm90Rm91bmRcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG4gIEBkZWw6IChvYmosIHBvaW50ZXIsIG9wdGlvbnMpIC0+XG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxuXG4gICAgaWYgcG9pbnRlci5sZW5ndGggPT0gMFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxuICAgIGRlbE5vdEZvdW5kID0gb3B0aW9ucz8uZGVsTm90Rm91bmQgPyBKc29uUG9pbnRlci5kZWxOb3RGb3VuZFxuXG4gICAgcm9vdCA9IG9ialxuICAgIGlTZWdtZW50ID0gMFxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cbiAgICAgICsraVNlZ21lbnRcblxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxuXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXG4gICAgICAgIGRlbE5vdEZvdW5kKG9iaiwgc2VnbWVudCwgcm9vdCwgcG9pbnRlciwgaVNlZ21lbnQgLSAxKVxuICAgICAgICBicmVha1xuICAgICAgZWxzZSBpZiBpU2VnbWVudCA9PSBsZW5cbiAgICAgICAgZGVsZXRlIG9ialtzZWdtZW50XVxuICAgICAgICBicmVha1xuICAgICAgZWxzZVxuICAgICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcblxuICAgIHJldHVybiByb290XG5cbiAgIyMjXG4gICMgUmV0dXJucyB0cnVlIGlmZiB0aGUgbG9jYXRpb24sIHNwZWNpZmllZCBieSBgcG9pbnRlcmAsIGV4aXN0cyBpbiBgb2JqZWN0YFxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcbiAgQGhhczogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXG5cbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXG5cbiAgICBpU2VnbWVudCA9IDBcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXG4gICAgICArK2lTZWdtZW50XG5cbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcblxuICAgICAgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXG5cbiAgICByZXR1cm4gdHJ1ZVxuIl19
