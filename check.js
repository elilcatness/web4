for (let _i = 1, _j = 0; _i <= 17; _i += 2, _j++) {
    i = _i - Math.floor(_j / 4) * (_j % 4 + (Math.floor(_j / 4) - 1) * 2) * 4;
    j = _j - Math.floor(_j / 4) * (_j % 4 + (Math.floor(_j / 4) - 1) * 2) * 2;
    console.log(`_i: ${_i}, i: ${i}, _j: ${_j}, j: ${j}`)
}

// [_i, _j] = [17, 8]
// console.log(4 + Math.floor(_j / 4) - 1);