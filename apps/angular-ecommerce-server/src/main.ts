/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as faker from 'faker';

function generateProducts() {
  const locations = ['usa', 'north-america', 'europe', 'asia'];

  return Array.from({ length: 10 }).map(() => {
    return {
      id: faker.random.uuid(),
      title: faker.commerce.productName(),
      image: `https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image`,
      additionalData: {
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        productAdjective: faker.commerce.productAdjective(),
        productMaterial: faker.commerce.productMaterial(),
        color: faker.commerce.color(),
        description: faker.lorem.paragraphs(),
        location: locations[Math.floor(Math.random() * locations.length)]
      }
    };
  });
}

const productsTable = generateProducts();
const minimalProducts = productsTable.map(p => ({
  id: p.id,
  image: p.image,
  title: p.title
}));

function getRandom(arr, n) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.post('/api/v1/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'nope@gmail.com') {
    return res.status(401).json({ success: false, errorMsg: `Email and password don't match` });
  }
  return res.json({ success: true, token: 'JWT', name: faker.name.findName() });
});

app.get('/api/v1/products', (req, res) => {
  setTimeout(() => {
    // return random items to simulate filtering
    return res.json(getRandom(minimalProducts, 5));
  }, 300);
});

app.get('/api/v1/product/:id', (req, res) => {
  const productId = req.params.id;
  const product = productsTable.find(p => p.id === productId);

  return res.json(product);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api/v1`);
});
server.on('error', console.error);
