const parse = d => d.trim();

exports.first = d => {
  const wide = 25;
  const tall = 6;
  const layers = decode(parse(d), wide, tall);

  console.log ( verify(layers) );
};

exports.second = d => {
  const wide = 25;
  const tall = 6;
  const layers = decode(parse(d), wide, tall);
  const image = unite(layers);

  console.log ( draw(image) );
};

// Part One
const verify = layers => {
  const index = layers.map(zeros).reduce(fewest, 0);
  const layer = layers[index].flat();
  return layer.reduce(count(1), 0) * layer.reduce(count(2), 0);
};

//Part Two
const unite = layers => 
  layers.reduce((image, layer) =>
    image.map((line, line_index) =>
      line.map((pixel, pixel_index) => 
        pixel === 2 ? layer[line_index][pixel_index] : pixel
      )
    )
  );
exports.unite = unite;

// Helpers

const zeros = layer => layer.flat().reduce(count(0), 0);
const count = symbol => (acc, value) => value === symbol ? acc + 1 : acc;
const fewest = (acc, value, index, array) => value < array[acc] ? index : acc;
const range = r => Array.from(Array(r));

const decode = (image, wide, tall) => {
  const im = Array.from(image).reverse();
  const layers = im.length / (wide * tall);
  return range(layers).map(_ =>
    range(tall).map(_ =>
      range(wide).map(_ => im.pop()).map(Number)
    )
  );
};
exports.decode = decode;

const black = "[40m [49m";
const white = "[47m [49m";
const draw = image =>
  image.map(line =>
    line.map(pixel =>
      pixel === 0 ? black : white
    ).join("")
  ).join("\n");
