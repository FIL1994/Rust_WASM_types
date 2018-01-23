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