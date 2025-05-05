var canvas = document.getElementById("drawingCanvas");
var c = canvas.getContext("2d");
[w, h] = [canvas.width, canvas.height];
c.clearRect(0, 0, w, h);

[rectW, rectH] = [20, 17];
x = w / 2 - rectW / 2 - rectW * 8;
y = h / 2 - rectH / 2;
for (let _i = 1, _j = 0; _i <= 17; _i += 2, _j++) {
  p = Math.floor(_j / 4);
  i = _i - p * (_j % 4 + (p - 1) * 2) * 4;
  j = _j - p * (_j % 4 + (p - 1) * 2) * 2;
  let col = i - j - 1;
  if (j % 2 == 0)
    for (let k = (col ? -col : 0); k <= col; k++) {
      c.fillStyle = '#0070c0';
      c.fillRect(x + rectW * _i, y + rectH * k * 2, rectW, rectH);
    }
  else {
    c.fillStyle = '#92d050';
    c.fillRect(x + rectW * _i, y - rectH * col * 2, rectW, rectH * (i * 2 - 1));
  }
}