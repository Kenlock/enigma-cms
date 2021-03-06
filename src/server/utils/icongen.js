import sha1 from 'sha1';
import gm from 'gm';
import { resolve } from 'path';

export default function(username, cb) {
  let hash = sha1(username),
    first36 = hash.substr(0,36).split('')
      .map((digit) => parseInt(digit) % 2 === 0), last5 = hash.substr(-5),
    color1 = `#${last5}0`, color2 = `#${last5.split('').reverse().join('')}0`,
    image = gm(64, 64, 'white');

  for (let letter in first36) {
    let row = Math.floor(letter / 6), column = letter % 6;
    image.stroke(first36[letter] ? color1 : color2, 10, 0).fill(
      first36[letter] ? color1 : color2, 10).drawRectangle(row * 10 + 2,
      column * 10 + 2, (row + 1) * 10 + 2,  (column + 1) * 10 + 2);
  }

  image.resize(256, 256);

  let filename = `/profile-pix/${username}.png`;

  image.write(resolve(__dirname, `./public/${filename}`), function(err) {
    if (!err) cb(filename);
  });
}
