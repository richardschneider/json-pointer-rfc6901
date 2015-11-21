(function (){
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

module.exports = JsonPointer;
})();

//# sourceMappingURL=data:application/json;base64,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Q0FBUyxPQUFULEVBQWtCLEVBQWxCLEVBRFA7O01BR0wsSUFBRyxDQUFJLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYixDQUFQO0FBQ0UsZUFBTyxNQURUOztNQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQWI7SUFaUjtBQWNBLFdBQU87RUF2QkgiLCJmaWxlIjoianNvbi1wb2ludGVyLm5vZGUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBKc29uUG9pbnRlckVycm9yIGV4dGVuZHMgRXJyb3JcbiAgY29uc3RydWN0b3I6IChtZXNzYWdlKSAtPlxuICAgIGJhc2UgPSBzdXBlcihtZXNzYWdlKVxuXG4gICAgQG1lc3NhZ2UgPSBiYXNlLm1lc3NhZ2VcbiAgICBAc3RhY2sgPSBiYXNlLnN0YWNrXG4gICAgQG5hbWUgPSBAY29uc3RydWN0b3IubmFtZVxuXG5jbGFzcyBKc29uUG9pbnRlclxuICBASnNvblBvaW50ZXJFcnJvcjogSnNvblBvaW50ZXJFcnJvclxuXG4gICMjI1xuICAjIENvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaG9vc2luZyBiZXR3ZWVuIGAuc21hcnRCaW5kYCwgYC5nZXRgLCBhbmQgYC5zZXRgLCBkZXBlbmRpbmcgb24gdGhlIG51bWJlciBvZiBhcmd1bWVudHMuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9iamVjdFxuICAjIEBwYXJhbSB7c3RyaW5nfSBwb2ludGVyXG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxuICAjIEByZXR1cm5zIHsqfSBldmFsdWF0aW9uIG9mIHRoZSBwcm94aWVkIG1ldGhvZFxuICAjIyNcbiAgY29uc3RydWN0b3I6IChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKSAtPlxuICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgd2hlbiAzIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iamVjdCwgcG9pbnRlciwgdmFsdWUpXG4gICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqZWN0LCBwb2ludGVyKVxuICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuc21hcnRCaW5kKHsgb2JqZWN0OiBvYmplY3QgfSlcbiAgICAgIGVsc2UgbnVsbFxuXG4gICMjI1xuICAjIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYXBpLCB3aXRoIGAuLy5nZXQvLmhhcy8uc2V0Ly5kZWwvLnNtYXJ0QmluZGAgbWV0aG9kIHNpZ25hdHVyZXMgYWRqdXN0ZWQuXG4gICMgVGhlIHNtYXJ0QmluZCBtZXRob2QgaXMgY3VtdWxhdGl2ZSwgbWVhbmluZyB0aGF0IGAuc21hcnRCaW5kKHsgb2JqZWN0OiB4fSkuc21hcnRCaW5kKHsgcG9pbnRlcjogeSB9KWAgd2lsbCBiZWhhdmUgYXMgZXhwZWN0ZWQuXG4gICNcbiAgIyBAcGFyYW0ge09iamVjdH0gYmluZGluZ3NcbiAgIyBAcGFyYW0geyp9IGJpbmRpbmdzLm9iamVjdFxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBiaW5kaW5ncy5wb2ludGVyXG4gICMgQHBhcmFtIHtPYmplY3R9IGJpbmRpbmdzLm9wdGlvbnNcbiAgIyBAcmV0dXJucyB7SnNvblBvaW50ZXJ9XG4gICMjI1xuICBAc21hcnRCaW5kOiAoeyBvYmplY3Q6IG9iaiwgcG9pbnRlcjogcHRyLCBmcmFnbWVudDogZnJhZywgb3B0aW9uczogb3B0IH0pIC0+XG4gICAgIyBmcmFnbWVudCBvdmVycmlkZXMgcG9pbnRlclxuICAgIHB0ciA9IGZyYWcgPyBwdHJcblxuICAgICMgV2hhdCBhcmUgYmluZGluZz9cbiAgICBoYXNPYmogPSBvYmogIT0gdW5kZWZpbmVkXG4gICAgaGFzUHRyID0gcHRyP1xuICAgIGhhc09wdCA9IG9wdD9cblxuICAgICMgTGV0cyBub3QgcGFyc2UgdGhpcyBldmVyeSB0aW1lIVxuICAgIGlmIHR5cGVvZiBwdHIgPT0gJ3N0cmluZydcbiAgICAgIHB0ciA9IEBwYXJzZShwdHIpXG5cbiAgICAjIGRlZmF1bHQgb3B0aW9ucyBoYXZlIGNoYW5nZWRcbiAgICBtZXJnZU9wdGlvbnMgPSAob3ZlcnJpZGUgPSB7fSkgLT5cbiAgICAgIG8gPSB7fVxuXG4gICAgICBvLmhhc093blByb3AgPSBvdmVycmlkZS5oYXNPd25Qcm9wID8gb3B0Lmhhc093blByb3BcbiAgICAgIG8uZ2V0UHJvcCA9IG92ZXJyaWRlLmdldFByb3AgPyBvcHQuZ2V0UHJvcFxuICAgICAgby5zZXRQcm9wID0gb3ZlcnJpZGUuc2V0UHJvcCA/IG9wdC5zZXRQcm9wXG4gICAgICBvLmdldE5vdEZvdW5kID0gb3ZlcnJpZGUuZ2V0Tm90Rm91bmQgPyBvcHQuZ2V0Tm90Rm91bmRcbiAgICAgIG8uc2V0Tm90Rm91bmQgPSBvdmVycmlkZS5zZXROb3RGb3VuZCA/IG9wdC5zZXROb3RGb3VuZFxuICAgICAgby5kZWxOb3RGb3VuZCA9IG92ZXJyaWRlLmRlbE5vdEZvdW5kID8gb3B0LmRlbE5vdEZvdW5kXG5cbiAgICAgIHJldHVybiBvXG5cbiAgICBhcGkgPSB1bmRlZmluZWRcblxuICAgICMgRXZlcnkgY29tYmluYXRpb24gb2YgYmluZGluZ3NcbiAgICBpZiBoYXNPYmogYW5kIGhhc1B0ciBhbmQgaGFzT3B0XG4gICAgICBhcGkgPSAodmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcbiAgICAgICAgICB3aGVuIDAgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcbiAgICAgICAgICBlbHNlIG51bGxcblxuICAgICAgYXBpLnNldCA9ICh2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZ2V0ID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuaGFzID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZGVsID0gKG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgZWxzZSBpZiBoYXNPYmogYW5kIGhhc1B0clxuICAgICAgYXBpID0gKHZhbHVlKSAtPlxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxuICAgICAgICAgIHdoZW4gMCB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0cilcbiAgICAgICAgICBlbHNlIG51bGxcblxuICAgICAgYXBpLnNldCA9ICh2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKVxuICAgICAgYXBpLmdldCA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvdmVycmlkZSlcbiAgICAgIGFwaS5oYXMgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgICBhcGkuZGVsID0gKG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG92ZXJyaWRlKVxuICAgIGVsc2UgaWYgaGFzT2JqIGFuZCBoYXNPcHRcbiAgICAgIGFwaSA9IChwdHIsIHZhbHVlKSAtPlxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXG4gICAgICAgICAgZWxzZSBudWxsXG5cbiAgICAgIGFwaS5zZXQgPSAocHRyLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZ2V0ID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5oYXMgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmRlbCA9IChwdHIsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgZWxzZSBpZiBoYXNQdHIgYW5kIGhhc09wdFxuICAgICAgYXBpID0gKG9iaiwgdmFsdWUpIC0+XG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcbiAgICAgICAgICBlbHNlIG51bGxcblxuICAgICAgYXBpLnNldCA9IChvYmosIHZhbHVlLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmhhcyA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZGVsID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICBlbHNlIGlmIGhhc09wdFxuICAgICAgYXBpID0gKG9iaiwgcHRyLCB2YWx1ZSkgLT5cbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAzIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxuICAgICAgICAgIHdoZW4gMSB0aGVuIGFwaS5zbWFydEJpbmQoeyBvYmplY3Q6IG9iaiB9KVxuICAgICAgICAgIGVsc2UgbnVsbFxuXG4gICAgICBhcGkuc2V0ID0gKG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgICBhcGkuZ2V0ID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxuICAgICAgYXBpLmhhcyA9IChvYmosIHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcbiAgICAgIGFwaS5kZWwgPSAob2JqLCBwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXG4gICAgZWxzZSBpZiBoYXNPYmpcbiAgICAgIGFwaSA9IChwdHIsIHZhbHVlKSAtPlxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0cilcbiAgICAgICAgICBlbHNlIG51bGxcblxuICAgICAgYXBpLnNldCA9IChwdHIsIHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXG4gICAgICBhcGkuZ2V0ID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgICBhcGkuaGFzID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgICBhcGkuZGVsID0gKHB0ciwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgZWxzZSBpZiBoYXNQdHJcbiAgICAgIGFwaSA9IChvYmosIHZhbHVlKSAtPlxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0cilcbiAgICAgICAgICBlbHNlIG51bGxcblxuICAgICAgYXBpLnNldCA9IChvYmosIHZhbHVlLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXG4gICAgICBhcGkuZ2V0ID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgICBhcGkuaGFzID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgICBhcGkuZGVsID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBcblxuICAgICMgc21hcnRCaW5kIGhhcyBuZXcgZGVmYXVsdHNcbiAgICBhcGkuc21hcnRCaW5kID0gKG92ZXJyaWRlKSAtPlxuICAgICAgbyA9IHt9XG5cbiAgICAgIGlmIHt9Lmhhc093blByb3BlcnR5LmNhbGwob3ZlcnJpZGUsICdvYmplY3QnKVxuICAgICAgICBvLm9iamVjdCA9IG92ZXJyaWRlLm9iamVjdFxuICAgICAgZWxzZSBpZiBoYXNPYmpcbiAgICAgICAgby5vYmplY3QgPSBvYmpcblxuICAgICAgaWYge30uaGFzT3duUHJvcGVydHkuY2FsbChvdmVycmlkZSwgJ3BvaW50ZXInKVxuICAgICAgICBvLnBvaW50ZXIgPSBvdmVycmlkZS5wb2ludGVyXG4gICAgICBlbHNlIGlmIGhhc1B0clxuICAgICAgICBvLnBvaW50ZXIgPSBwdHJcblxuICAgICAgaWYge30uaGFzT3duUHJvcGVydHkuY2FsbChvdmVycmlkZSwgJ29wdGlvbnMnKVxuICAgICAgICBvLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMob3ZlcnJpZGUub3B0aW9ucylcbiAgICAgIGVsc2UgaWYgaGFzT2JqXG4gICAgICAgIG8ub3B0aW9ucyA9IG9wdFxuXG4gICAgICByZXR1cm4gSnNvblBvaW50ZXIuc21hcnRCaW5kKG8pXG5cbiAgICBpZiBoYXNQdHJcbiAgICAgICMjI1xuICAgICAgIyBnZXQvc2V0IGJvdW5kIHBvaW50ZXIgdmFsdWVcbiAgICAgICNcbiAgICAgICMgT25seSBhdmFpbGFibGUgd2hlbiBwb2ludGVyIGhhcyBiZWVuIGJvdW5kXG4gICAgICAjXG4gICAgICAjIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgICAgIyBAcmV0dXJucyBzdHJpbmdbXSBzZWdtZW50c1xuICAgICAgIyMjXG4gICAgICBhcGkucG9pbnRlciA9ICh2YWx1ZSkgLT5cbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgcmV0dXJuIEpzb25Qb2ludGVyLmNvbXBpbGVQb2ludGVyKHB0cilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBwdHIgPSBKc29uUG9pbnRlci5wYXJzZVBvaW50ZXIodmFsdWUpXG5cbiAgICAgICMjI1xuICAgICAgIyBnZXQvc2V0IGJvdW5kIHBvaW50ZXIgdmFsdWUgYXMgZnJhZ21lbnRcbiAgICAgICNcbiAgICAgICMgT25seSBhdmFpbGFibGUgd2hlbiBwb2ludGVyIGhhcyBiZWVuIGJvdW5kXG4gICAgICAjXG4gICAgICAjIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgICAgIyBAcmV0dXJucyBzdHJpbmdbXSBzZWdtZW50c1xuICAgICAgIyMjXG4gICAgICBhcGkuZnJhZ21lbnQgPSAodmFsdWUpIC0+XG4gICAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMFxuICAgICAgICAgIHJldHVybiBKc29uUG9pbnRlci5jb21waWxlRnJhZ21lbnQocHRyKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIHB0ciA9IEpzb25Qb2ludGVyLnBhcnNlRnJhZ21lbnQodmFsdWUpXG5cbiAgICBpZiBoYXNPYmpcbiAgICAgICMjI1xuICAgICAgIyBnZXQvc2V0IGJvdW5kIG9iamVjdFxuICAgICAgI1xuICAgICAgIyBPbmx5IGF2YWlsYWJsZSB3aGVuIG9iamVjdCBoYXMgYmVlbiBib3VuZFxuICAgICAgI1xuICAgICAgIyBAcGFyYW0geyp9IHZhbHVlXG4gICAgICAjIEByZXR1cm5zIHsqfSBib3VuZCBvYmplY3RcbiAgICAgICMjI1xuICAgICAgYXBpLm9iamVjdCA9ICh2YWx1ZSkgLT5cbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgcmV0dXJuIG9ialxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmV0dXJuIG9iaiA9IHZhbHVlXG5cbiAgICBpZiBoYXNPcHRcbiAgICAgICMjI1xuICAgICAgIyBnZXQvc2V0IGJvdW5kIG9wdGlvbnNcbiAgICAgICNcbiAgICAgICMgT25seSBhdmFpbGFibGUgd2hlbiBvcHRpb25zIGhhcyBiZWVuIGJvdW5kXG4gICAgICAjXG4gICAgICAjIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICAgICMgQHJldHVybnMgeyp9IGJvdW5kIG9wdGlvbnNcbiAgICAgICMjI1xuICAgICAgYXBpLm9wdGlvbnMgPSAodmFsdWUpIC0+XG4gICAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMFxuICAgICAgICAgIHJldHVybiBvcHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBvcHQgPSB2YWx1ZVxuXG4gICAgIyBjb3B5IHRoZSByZW1haW5pbmcgbWV0aG9kcyB3aGljaCBkbyBub3QgbmVlZCBiaW5kaW5nXG4gICAgZm9yIG93biBrZXksIHZhbCBvZiBKc29uUG9pbnRlclxuICAgICAgaWYgbm90IHt9Lmhhc093blByb3BlcnR5LmNhbGwoYXBpLCBrZXkpXG4gICAgICAgIGFwaVtrZXldID0gdmFsXG5cbiAgICAjIGZpbmFsIHJlc3VsdFxuICAgIHJldHVybiBhcGlcblxuICAjIyNcbiAgIyBFc2NhcGVzIHRoZSBnaXZlbiBwYXRoIHNlZ21lbnQgYXMgZGVzY3JpYmVkIGJ5IFJGQzY5MDEuXG4gICNcbiAgIyBOb3RhYmx5LCBgJ34nYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfjAnYCBhbmQgYCcvJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34xJ2AuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc2VnbWVudFxuICAjIEByZXR1cm5zIHtzdHJpbmd9XG4gICMjI1xuICBAZXNjYXBlOiAoc2VnbWVudCkgLT5cbiAgICBzZWdtZW50LnJlcGxhY2UoL34vZywgJ34wJykucmVwbGFjZSgvXFwvL2csICd+MScpXG5cbiAgIyMjXG4gICMgRXNjYXBlcyB0aGUgZ2l2ZW4gcGF0aCBmcmFnbWVudCBzZWdtZW50IGFzIGRlc2NyaWJlZCBieSBSRkM2OTAxLlxuICAjXG4gICMgTm90YWJseSwgYCd+J2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34wJ2AgYW5kIGAnLydgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+MSdgIGFuZCBmaW5hbGx5IHRoZSBzdHJpbmcgaXMgVVJJIGVuY29kZWQuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc2VnbWVudFxuICAjIEByZXR1cm5zIHtzdHJpbmd9XG4gICMjI1xuICBAZXNjYXBlRnJhZ21lbnQ6IChzZWdtZW50KSAtPlxuICAgIGVuY29kZVVSSUNvbXBvbmVudChKc29uUG9pbnRlci5lc2NhcGUoc2VnbWVudCkpXG5cbiAgIyMjXG4gICMgVW4tRXNjYXBlcyB0aGUgZ2l2ZW4gcGF0aCBzZWdtZW50LCByZXZlcnNpbmcgdGhlIGFjdGlvbnMgb2YgYC5lc2NhcGVgLlxuICAjXG4gICMgTm90YWJseSwgYCd+MSdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCcvJ2AgYW5kIGAnfjAnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfidgLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmd9IHNlZ21lbnRcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxuICAjIyNcbiAgQHVuZXNjYXBlOiAoc2VnbWVudCkgLT5cbiAgICBzZWdtZW50LnJlcGxhY2UoL34xL2csICcvJykucmVwbGFjZSgvfjAvZywgJ34nKVxuXG4gICMjI1xuICAjIFVuLUVzY2FwZXMgdGhlIGdpdmVuIHBhdGggZnJhZ21lbnQgc2VnbWVudCwgcmV2ZXJzaW5nIHRoZSBhY3Rpb25zIG9mIGAuZXNjYXBlRnJhZ21lbnRgLlxuICAjXG4gICMgTm90YWJseSwgdGhlIHN0cmluZyBpcyBVUkkgZGVjb2RlZCBhbmQgdGhlbiBgJ34xJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJy8nYCBhbmQgYCd+MCdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+J2AuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc2VnbWVudFxuICAjIEByZXR1cm5zIHtzdHJpbmd9XG4gICMjI1xuICBAdW5lc2NhcGVGcmFnbWVudDogKHNlZ21lbnQpIC0+XG4gICAgSnNvblBvaW50ZXIudW5lc2NhcGUoZGVjb2RlVVJJQ29tcG9uZW50KHNlZ21lbnQpKVxuXG4gICMjI1xuICAjIFJldHVybnMgdHJ1ZSBpZmYgYHN0cmAgaXMgYSB2YWxpZCBqc29uIHBvaW50ZXIgdmFsdWVcbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgIyMjXG4gIEBpc1BvaW50ZXI6IChzdHIpIC0+XG4gICAgc3dpdGNoIHN0ci5jaGFyQXQoMClcbiAgICAgIHdoZW4gJycgdGhlbiByZXR1cm4gdHJ1ZVxuICAgICAgd2hlbiAnLycgdGhlbiByZXR1cm4gdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBzdHJgIGlzIGEgdmFsaWQganNvbiBmcmFnbWVudCBwb2ludGVyIHZhbHVlXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XG4gICMjI1xuICBAaXNGcmFnbWVudDogKHN0cikgLT5cbiAgICBzd2l0Y2ggc3RyLnN1YnN0cmluZygwLCAyKVxuICAgICAgd2hlbiAnIycgdGhlbiByZXR1cm4gdHJ1ZVxuICAgICAgd2hlbiAnIy8nIHRoZW4gcmV0dXJuIHRydWVcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgIyMjXG4gICMgUGFyc2VzIGEganNvbi1wb2ludGVyIG9yIGpzb24gZnJhZ21lbnQgcG9pbnRlciwgYXMgZGVzY3JpYmVkIGJ5IFJGQzkwMSwgaW50byBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzLlxuICAjXG4gICMgQHRocm93cyB7SnNvblBvaW50ZXJFcnJvcn0gZm9yIGludmFsaWQganNvbi1wb2ludGVycy5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nW119XG4gICMjI1xuICBAcGFyc2U6IChzdHIpIC0+XG4gICAgc3dpdGNoIHN0ci5jaGFyQXQoMClcbiAgICAgIHdoZW4gJycgdGhlbiByZXR1cm4gW11cbiAgICAgIHdoZW4gJy8nIHRoZW4gcmV0dXJuIHN0ci5zdWJzdHJpbmcoMSkuc3BsaXQoJy8nKS5tYXAoSnNvblBvaW50ZXIudW5lc2NhcGUpXG4gICAgICB3aGVuICcjJ1xuICAgICAgICBzd2l0Y2ggc3RyLmNoYXJBdCgxKVxuICAgICAgICAgIHdoZW4gJycgdGhlbiByZXR1cm4gW11cbiAgICAgICAgICB3aGVuICcvJyB0aGVuIHJldHVybiBzdHIuc3Vic3RyaW5nKDIpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlRnJhZ21lbnQpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJJbnZhbGlkIEpTT04gZnJhZ21lbnQgcG9pbnRlcjogI3tzdHJ9XCIpXG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiSW52YWxpZCBKU09OIHBvaW50ZXI6ICN7c3RyfVwiKVxuXG4gICMjI1xuICAjIFBhcnNlcyBhIGpzb24tcG9pbnRlciwgYXMgZGVzY3JpYmVkIGJ5IFJGQzkwMSwgaW50byBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzLlxuICAjXG4gICMgQHRocm93cyB7SnNvblBvaW50ZXJFcnJvcn0gZm9yIGludmFsaWQganNvbi1wb2ludGVycy5cbiAgI1xuICAjIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nW119XG4gICMjI1xuICBAcGFyc2VQb2ludGVyOiAoc3RyKSAtPlxuICAgIHN3aXRjaCBzdHIuY2hhckF0KDApXG4gICAgICB3aGVuICcnIHRoZW4gcmV0dXJuIFtdXG4gICAgICB3aGVuICcvJyB0aGVuIHJldHVybiBzdHIuc3Vic3RyaW5nKDEpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlKVxuICAgICAgZWxzZSB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIkludmFsaWQgSlNPTiBwb2ludGVyOiAje3N0cn1cIilcblxuICAjIyNcbiAgIyBQYXJzZXMgYSBqc29uIGZyYWdtZW50IHBvaW50ZXIsIGFzIGRlc2NyaWJlZCBieSBSRkM5MDEsIGludG8gYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cbiAgI1xuICAjIEB0aHJvd3Mge0pzb25Qb2ludGVyRXJyb3J9IGZvciBpbnZhbGlkIGpzb24tcG9pbnRlcnMuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICMgQHJldHVybnMge3N0cmluZ1tdfVxuICAjIyNcbiAgQHBhcnNlRnJhZ21lbnQ6IChzdHIpIC0+XG4gICAgc3dpdGNoIHN0ci5zdWJzdHJpbmcoMCwgMilcbiAgICAgIHdoZW4gJyMnIHRoZW4gcmV0dXJuIFtdXG4gICAgICB3aGVuICcjLycgdGhlbiByZXR1cm4gc3RyLnN1YnN0cmluZygyKS5zcGxpdCgnLycpLm1hcChKc29uUG9pbnRlci51bmVzY2FwZUZyYWdtZW50KVxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIkludmFsaWQgSlNPTiBmcmFnbWVudCBwb2ludGVyOiAje3N0cn1cIilcblxuICAjIyNcbiAgIyBDb252ZXJ0cyBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzIGludG8gYSBqc29uIHBvaW50ZXIuXG4gICMgVGhpcyBtZXRob2QgaXMgdGhlIHJldmVyc2Ugb2YgYC5wYXJzZVBvaW50ZXJgLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxuICAjIyNcbiAgQGNvbXBpbGU6IChzZWdtZW50cykgLT5cbiAgICBzZWdtZW50cy5tYXAoKHNlZ21lbnQpIC0+ICcvJyArIEpzb25Qb2ludGVyLmVzY2FwZShzZWdtZW50KSkuam9pbignJylcblxuICAjIyNcbiAgIyBDb252ZXJ0cyBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzIGludG8gYSBqc29uIHBvaW50ZXIuXG4gICMgVGhpcyBtZXRob2QgaXMgdGhlIHJldmVyc2Ugb2YgYC5wYXJzZVBvaW50ZXJgLlxuICAjXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxuICAjIyNcbiAgQGNvbXBpbGVQb2ludGVyOiAoc2VnbWVudHMpIC0+XG4gICAgc2VnbWVudHMubWFwKChzZWdtZW50KSAtPiAnLycgKyBKc29uUG9pbnRlci5lc2NhcGUoc2VnbWVudCkpLmpvaW4oJycpXG5cbiAgIyMjXG4gICMgQ29udmVydHMgYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cyBpbnRvIGEganNvbiBmcmFnbWVudCBwb2ludGVyLlxuICAjIFRoaXMgbWV0aG9kIGlzIHRoZSByZXZlcnNlIG9mIGAucGFyc2VGcmFnbWVudGAuXG4gICNcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xuICAjIEByZXR1cm5zIHtzdHJpbmd9XG4gICMjI1xuICBAY29tcGlsZUZyYWdtZW50OiAoc2VnbWVudHMpIC0+XG4gICAgJyMnICsgc2VnbWVudHMubWFwKChzZWdtZW50KSAtPiAnLycgKyBKc29uUG9pbnRlci5lc2NhcGVGcmFnbWVudChzZWdtZW50KSkuam9pbignJylcblxuICAjIyNcbiAgIyBDYWxsYmFjayB1c2VkIHRvIGRldGVybWluZSBpZiBhbiBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgI1xuICAjIEBjYWxsYmFjayBoYXNQcm9wXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgIyMjXG5cbiAgIyMjXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCBhbmQgYG9iamAgaXMgZWl0aGVyIGFuIEFycmF5IG9yIGFuIE9iamVjdC5cbiAgIyBJZ25vcmVzIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICNcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5oYXNQcm9wYC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHJldHVybnMge0Jvb2xlYW59XG4gICMjI1xuICBAaGFzSnNvblByb3A6IChvYmosIGtleSkgLT5cbiAgICBpZiBBcnJheS5pc0FycmF5KG9iailcbiAgICAgIHJldHVybiAodHlwZW9mIGtleSA9PSAnbnVtYmVyJykgYW5kIChrZXkgPCBvYmoubGVuZ3RoKVxuICAgIGVsc2UgaWYgdHlwZW9mIG9iaiA9PSAnb2JqZWN0J1xuICAgICAgcmV0dXJuIHt9Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgIyMjXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCwgZGlzcmVnYXJkaW5nIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEByZXR1cm5zIHtCb29sZWFufVxuICAjIyNcbiAgQGhhc093blByb3A6IChvYmosIGtleSkgLT5cbiAgICB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KVxuXG4gICMjI1xuICAjIFJldHVybnMgdHJ1ZSBpZmYgYG9iamAgY29udGFpbnMgYGtleWAsIGluY2x1ZGluZyB2aWEgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XG4gICMgQHJldHVybnMge0Jvb2xlYW59XG4gICMjI1xuICBAaGFzUHJvcDogKG9iaiwga2V5KSAtPlxuICAgIGtleSBvZiBvYmpcblxuICAjIyNcbiAgIyBDYWxsYmFjayB1c2VkIHRvIHJldHJpZXZlIGEgcHJvcGVydHkgZnJvbSBhbiBvYmplY3RcbiAgI1xuICAjIEBjYWxsYmFjayBnZXRQcm9wXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG5cbiAgIyMjXG4gICMgRmluZHMgdGhlIGdpdmVuIGBrZXlgIGluIGBvYmpgLlxuICAjXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZ2V0UHJvcGAuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcbiAgQGdldFByb3A6IChvYmosIGtleSkgLT5cbiAgICBvYmpba2V5XVxuXG4gICMjI1xuICAjIENhbGxiYWNrIHVzZWQgdG8gc2V0IGEgcHJvcGVydHkgb24gYW4gb2JqZWN0LlxuICAjXG4gICMgQGNhbGxiYWNrIHNldFByb3BcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEBwYXJhbSB7Kn0gdmFsdWVcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG5cbiAgIyMjXG4gICMgU2V0cyB0aGUgZ2l2ZW4gYGtleWAgaW4gYG9iamAgdG8gYHZhbHVlYC5cbiAgI1xuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLnNldFByb3BgLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcbiAgIyBAcGFyYW0geyp9IHZhbHVlXG4gICMgQHJldHVybnMgeyp9IGB2YWx1ZWBcbiAgIyMjXG4gIEBzZXRQcm9wOiAob2JqLCBrZXksIHZhbHVlKSAtPlxuICAgIG9ialtrZXldID0gdmFsdWVcblxuICAjIyNcbiAgIyBDYWxsYmFjayB1c2VkIHRvIG1vZGlmeSBiZWhhdmlvdXIgd2hlbiBhIGdpdmVuIHBhdGggc2VnbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gICNcbiAgIyBAY2FsbGJhY2sgbm90Rm91bmRcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxuICAjIEByZXR1cm5zIHsqfVxuICAjIyNcblxuICAjIyNcbiAgIyBSZXR1cm5zIHRoZSB2YWx1ZSB0byB1c2Ugd2hlbiBgLmdldGAgZmFpbHMgdG8gbG9jYXRlIGEgcG9pbnRlciBzZWdtZW50LlxuICAjXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZ2V0Tm90Rm91bmRgLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XG4gICMgQHBhcmFtIHsqfSByb290XG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cbiAgIyMjXG4gIEBnZXROb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxuICAgIHVuZGVmaW5lZFxuXG4gICMjI1xuICAjIFJldHVybnMgdGhlIHZhbHVlIHRvIHVzZSB3aGVuIGAuc2V0YCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXG4gICNcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5zZXROb3RGb3VuZGAuXG4gICNcbiAgIyBAcGFyYW0geyp9IG9ialxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcbiAgIyBAcGFyYW0geyp9IHJvb3RcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICAjIyNcbiAgQHNldE5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XG4gICAgaWYgc2VnbWVudHNbaVNlZ21lbnQgKyAxXS5tYXRjaCgvXig/OjB8WzEtOV1cXGQqfC0pJC8pXG4gICAgICByZXR1cm4gb2JqW3NlZ21lbnRdID0gW11cbiAgICBlbHNlXG4gICAgICByZXR1cm4gb2JqW3NlZ21lbnRdID0ge31cblxuICAjIyNcbiAgIyBQZXJmb3JtcyBhbiBhY3Rpb24gd2hlbiBgLmRlbGAgZmFpbHMgdG8gbG9jYXRlIGEgcG9pbnRlciBzZWdtZW50LlxuICAjXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZGVsTm90Rm91bmRgLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XG4gICMgQHBhcmFtIHsqfSByb290XG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cbiAgIyMjXG4gIEBkZWxOb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxuICAgIHVuZGVmaW5lZFxuXG4gICMjI1xuICAjIFJhaXNlcyBhIEpzb25Qb2ludGVyRXJyb3Igd2hlbiB0aGUgZ2l2ZW4gcG9pbnRlciBzZWdtZW50IGlzIG5vdCBmb3VuZC5cbiAgI1xuICAjIE1heSBiZSB1c2VkIGluIHBsYWNlIG9mIHRoZSBhYm92ZSBtZXRob2RzIHZpYSB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IG9mIGAuLy5nZXQvLnNldC8uaGFzLy5kZWwvLnNpbXBsZUJpbmRgLlxuICAjXG4gICMgQHBhcmFtIHsqfSBvYmpcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XG4gICMgQHBhcmFtIHsqfSByb290XG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cbiAgIyMjXG4gIEBlcnJvck5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XG4gICAgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJVbmFibGUgdG8gZmluZCBqc29uIHBhdGg6ICN7SnNvblBvaW50ZXIuY29tcGlsZShzZWdtZW50cy5zbGljZSgwLCBpU2VnbWVudCsxKSl9XCIpXG5cbiAgIyMjXG4gICMgU2V0cyB0aGUgbG9jYXRpb24gaW4gYG9iamVjdGAsIHNwZWNpZmllZCBieSBgcG9pbnRlcmAsIHRvIGB2YWx1ZWAuXG4gICMgSWYgYHBvaW50ZXJgIHJlZmVycyB0byB0aGUgd2hvbGUgZG9jdW1lbnQsIGB2YWx1ZWAgaXMgcmV0dXJuZWQgd2l0aG91dCBtb2RpZnlpbmcgYG9iamVjdGAsXG4gICMgb3RoZXJ3aXNlLCBgb2JqZWN0YCBtb2RpZmllZCBhbmQgcmV0dXJuZWQuXG4gICNcbiAgIyBCeSBkZWZhdWx0LCBpZiBhbnkgbG9jYXRpb24gc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCBkb2VzIG5vdCBleGlzdCwgdGhlIGxvY2F0aW9uIGlzIGNyZWF0ZWQgdXNpbmcgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAjIEFycmF5cyBhcmUgdXNlZCBvbmx5IHdoZW4gdGhlIGltbWVkaWF0ZWx5IGZvbGxvd2luZyBwYXRoIHNlZ21lbnQgaXMgYW4gYXJyYXkgZWxlbWVudCBhcyBkZWZpbmVkIGJ5IHRoZSBzdGFuZGFyZC5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcbiAgIyBAcGFyYW0ge3NldFByb3B9IG9wdGlvbnMuc2V0UHJvcFxuICAjIEBwYXJhbSB7bm90Rm91bmR9IG9wdGlvbnMuZ2V0Tm90Rm91bmRcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG4gIEBzZXQ6IChvYmosIHBvaW50ZXIsIHZhbHVlLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcblxuICAgIGlmIHBvaW50ZXIubGVuZ3RoID09IDBcbiAgICAgIHJldHVybiB2YWx1ZVxuXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxuICAgIHNldFByb3AgPSBvcHRpb25zPy5zZXRQcm9wID8gSnNvblBvaW50ZXIuc2V0UHJvcFxuICAgIHNldE5vdEZvdW5kID0gb3B0aW9ucz8uc2V0Tm90Rm91bmQgPyBKc29uUG9pbnRlci5zZXROb3RGb3VuZFxuXG4gICAgcm9vdCA9IG9ialxuICAgIGlTZWdtZW50ID0gMFxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXG5cbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxuICAgICAgKytpU2VnbWVudFxuXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXG5cbiAgICAgIGlmIGlTZWdtZW50ID09IGxlblxuICAgICAgICBzZXRQcm9wKG9iaiwgc2VnbWVudCwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBlbHNlIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcbiAgICAgICAgb2JqID0gc2V0Tm90Rm91bmQob2JqLCBzZWdtZW50LCByb290LCBwb2ludGVyLCBpU2VnbWVudCAtIDEpXG4gICAgICBlbHNlXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxuXG4gICAgcmV0dXJuIHJvb3RcblxuICAjIyNcbiAgIyBGaW5kcyB0aGUgdmFsdWUgaW4gYG9iamAgYXMgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYFxuICAjXG4gICMgQnkgZGVmYXVsdCwgcmV0dXJucyB1bmRlZmluZWQgZm9yIHZhbHVlcyB3aGljaCBjYW5ub3QgYmUgZm91bmRcbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcbiAgIyBAcGFyYW0ge25vdEZvdW5kfSBvcHRpb25zLmdldE5vdEZvdW5kXG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuICBAZ2V0OiAob2JqLCBwb2ludGVyLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcblxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcbiAgICBnZXROb3RGb3VuZCA9IG9wdGlvbnM/LmdldE5vdEZvdW5kID8gSnNvblBvaW50ZXIuZ2V0Tm90Rm91bmRcblxuICAgIHJvb3QgPSBvYmpcbiAgICBpU2VnbWVudCA9IDBcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXG4gICAgICArK2lTZWdtZW50XG5cbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcblxuICAgICAgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxuICAgICAgICByZXR1cm4gZ2V0Tm90Rm91bmQob2JqLCBzZWdtZW50LCByb290LCBwb2ludGVyLCBpU2VnbWVudCAtIDEpXG4gICAgICBlbHNlXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxuXG4gICAgcmV0dXJuIG9ialxuXG4gICMjI1xuICAjIFJlbW92ZXMgdGhlIGxvY2F0aW9uLCBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgLCBmcm9tIGBvYmplY3RgLlxuICAjIFJldHVybnMgdGhlIG1vZGlmaWVkIGBvYmplY3RgLCBvciB1bmRlZmluZWQgaWYgdGhlIGBwb2ludGVyYCBpcyBlbXB0eS5cbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcbiAgIyBAcGFyYW0ge25vdEZvdW5kfSBvcHRpb25zLmRlbE5vdEZvdW5kXG4gICMgQHJldHVybnMgeyp9XG4gICMjI1xuICBAZGVsOiAob2JqLCBwb2ludGVyLCBvcHRpb25zKSAtPlxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcblxuICAgIGlmIHBvaW50ZXIubGVuZ3RoID09IDBcbiAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcbiAgICBkZWxOb3RGb3VuZCA9IG9wdGlvbnM/LmRlbE5vdEZvdW5kID8gSnNvblBvaW50ZXIuZGVsTm90Rm91bmRcblxuICAgIHJvb3QgPSBvYmpcbiAgICBpU2VnbWVudCA9IDBcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXG4gICAgICArK2lTZWdtZW50XG5cbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcblxuICAgICAgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxuICAgICAgICBkZWxOb3RGb3VuZChvYmosIHNlZ21lbnQsIHJvb3QsIHBvaW50ZXIsIGlTZWdtZW50IC0gMSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGVsc2UgaWYgaVNlZ21lbnQgPT0gbGVuXG4gICAgICAgIGRlbGV0ZSBvYmpbc2VnbWVudF1cbiAgICAgICAgYnJlYWtcbiAgICAgIGVsc2VcbiAgICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXG5cbiAgICByZXR1cm4gcm9vdFxuXG4gICMjI1xuICAjIFJldHVybnMgdHJ1ZSBpZmYgdGhlIGxvY2F0aW9uLCBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgLCBleGlzdHMgaW4gYG9iamVjdGBcbiAgI1xuICAjIEBwYXJhbSB7Kn0gb2JqXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcbiAgIyBAcmV0dXJucyB7Kn1cbiAgIyMjXG4gIEBoYXM6IChvYmosIHBvaW50ZXIsIG9wdGlvbnMpIC0+XG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxuXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxuXG4gICAgaVNlZ21lbnQgPSAwXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxuICAgICAgKytpU2VnbWVudFxuXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXG5cbiAgICAgIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxuXG4gICAgcmV0dXJuIHRydWVcbiJdfQ==
