/**
 * @author Philip Van Raalte
 * @date 2018-01-22
 */
import {newString, getStr, fetchAndInstantiate, copyCStr} from './hellorust';

let Module = {};
let Sha1 = {
  digest: function(str) {
    let buf = newString(Module, str);
    let outptr = Module.digest(buf);
    let result = copyCStr(Module, outptr);
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