/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hellorust__ = __webpack_require__(1);
/**
 * @author Philip Van Raalte
 * @date 2018-01-22
 */


let Module = {};
let Sha1 = {
  digest: function(str) {
    let buf = Object(__WEBPACK_IMPORTED_MODULE_0__hellorust__["b" /* newString */])(Module, str);
    let outptr = Module.digest(buf);
    let result = Object(__WEBPACK_IMPORTED_MODULE_0__hellorust__["a" /* copyCStr */])(Module, outptr);
    Module.dealloc(buf);
    return result;
  }
};

function getStringFromRust(reference, length) {
    if(typeof reference === "string") {
        reference = Number(reference);
    }
    if(typeof length === "string") {
        length = Number(length);
    }
    if(isNaN(reference) || isNaN(length)) {
        throw new Error("must pass numbers to getStringFromRust");
    }

    return String.fromCharCode(
      ...(new Uint8Array(Module.memory.buffer, reference, length))
    );
}

(
  async () => {
    console.log("loading wasm...");
    const startTime = performance.now();

    const projectName = 'project2';
    const res = await fetch(`${projectName}.wasm`);
    const bytes = await res.arrayBuffer();
    const results = await WebAssembly.instantiate(bytes, {});
    console.log(`loaded wasm in: ${performance.now() - startTime} milliseconds`);

    const {
      memory,
      add,
      get_string, get_hello, get_hello_len, divisible_by_ten,
      digest, dealloc, alloc,
      get_random_num, random_num_in_range
    }
      = results.instance.exports;

    console.log(results.instance.exports);

    // returns undefined - can't return a string from wasm
    console.log(get_string());

    console.log(divisible_by_ten(7)); // returns 0
    console.log(divisible_by_ten(10)); // returns 1

    // get a reference to the string's location in memory and the length of the string
    console.log(get_hello(), get_hello_len());

    window.add = add;
    window.divisible_by_ten = divisible_by_ten;
    window.get_random_num = get_random_num;
    window.random_num_in_range = random_num_in_range;

    // SHA1
    Module.alloc = alloc;
    Module.dealloc = dealloc;
    Module.digest = digest;
    Module.memory = new Uint8Array(memory.buffer);

    console.log(
      getStringFromRust(get_hello(), get_hello_len())
    );

    console.log(
      "SHA1",
      Sha1.digest("my string")
    );

    console.log(get_random_num());
  }
)();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return copyCStr; });
/* unused harmony export fetchAndInstantiate */
/* unused harmony export getStr */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return newString; });
/**
 * from:
 * https://www.hellorust.com/demos/bundle.js
 */
function fetchAndInstantiate(url, importObject) {
  return fetch(url).then(response =>
    response.arrayBuffer()
  ).then(bytes =>
    WebAssembly.instantiate(bytes, importObject)
  ).then(results =>
    results.instance
  );
}

// Copy a nul-terminated string from the buffer pointed to.
// Consumes the old data and thus deallocated it.
function copyCStr(module, ptr) {
  let orig_ptr = ptr;
  const collectCString = function* () {
    let memory = new Uint8Array(module.memory.buffer);
    while (memory[ptr] !== 0) {
      if (memory[ptr] === undefined) { throw new Error("Tried to read undef mem") }
      yield memory[ptr];
      ptr += 1
    }
  };

  const buffer_as_u8 = new Uint8Array(collectCString());
  const utf8Decoder = new TextDecoder("UTF-8");
  const buffer_as_utf8 = utf8Decoder.decode(buffer_as_u8);
  module.dealloc(orig_ptr);
  return buffer_as_utf8
}

function getStr(module, ptr, len) {
  const getData = function* (ptr, len) {
    let memory = new Uint8Array(module.memory.buffer);
    for (let index = 0; index < len; index++) {
      if (memory[ptr] === undefined) { throw new Error(`Tried to read undef mem at ${ptr}`) }
      yield memory[ptr + index]
    }
  };

  const buffer_as_u8 = new Uint8Array(getData(ptr/8, len/8));
  const utf8Decoder = new TextDecoder("UTF-8");
  const buffer_as_utf8 = utf8Decoder.decode(buffer_as_u8);
  return buffer_as_utf8;
}

function newString(module, str) {
  const utf8Encoder = new TextEncoder("UTF-8");
  let string_buffer = utf8Encoder.encode(str);
  let len = string_buffer.length;
  let ptr = module.alloc(len+1);

  let memory = new Uint8Array(module.memory.buffer);
  for (let i = 0; i < len; i++) {
    memory[ptr+i] = string_buffer[i]
  }

  memory[ptr+len] = 0;

  return ptr;
}



/***/ })
/******/ ]);