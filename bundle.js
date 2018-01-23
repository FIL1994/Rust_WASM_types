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
/***/ (function(module, exports) {

/**
 * @author Philip Van Raalte
 * @date 2018-01-22
 */
let memory;

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
      ...(new Uint8Array(memory.buffer, reference, length))
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

    const {add, get_string, get_hello, get_hello_len, divisible_by_ten} = results.instance.exports;
    memory = results.instance.exports.memory;

    // returns undefined - can't return a string from wasm
    console.log(get_string());

    console.log(divisible_by_ten(7)); // returns 0
    console.log(divisible_by_ten(10)); // returns 1

    // get a reference to the string's location in memory and the length of the string
    console.log(get_hello(), get_hello_len());

    console.log(
      getStringFromRust(get_hello(), get_hello_len())
    );

    window.add = add;
    window.divisible_by_ten = divisible_by_ten;
  }
)();

/***/ })
/******/ ]);