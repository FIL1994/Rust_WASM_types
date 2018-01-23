use std::sync::Mutex;
use wasm_rand::ComplementaryMultiplyWithCarryGen;

struct Random {
    pub rand: ComplementaryMultiplyWithCarryGen
}

impl Random {
    pub fn new() -> Random {
        Random {
            rand: ComplementaryMultiplyWithCarryGen::new(1)
        }
    }

    pub fn get_num(&mut self) -> u32 {
        self.rand.random()
    }
}

lazy_static! {
    static ref RANDOM: Mutex<Random> = {
        let mut a = Random::new();
        Mutex::new(a)
    };
}


#[no_mangle]
pub fn get_random_num() -> u32 {
    RANDOM.lock().unwrap().get_num()
}

#[no_mangle]
pub fn random_num_in_range(min: i32, max: i32) -> i32 {
    let mut num = get_random_num() as i32;
    if min > max {
        panic!("min is more than max");
    }

    if num < 0 {
        num *= -1;
    }

    (num % (max - min + 1)) + min
}