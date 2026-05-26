import { CP437_TO_UNICODE } from '../src/cp437.ts';
import { repairMojibake } from '../src/text.ts';

const encodeCp437Mojibake = (value) => {
  let encoded = '';
  for (const byte of Buffer.from(value, 'utf8')) {
    encoded += String.fromCharCode(CP437_TO_UNICODE[byte]);
  }
  return encoded;
};

const samples = [
  'Cap Dark Gray — Dream Step',
  'Tracksuit заказ + костюм — Dream Step',
  'Round Keychain конструктор + детали + заказ — Dream Step',
  'Carabiner Keychain конструктор + детали + заказ — Dream Step',
];

for (const sample of samples) {
  const broken = encodeCp437Mojibake(sample);
  const fixed = repairMojibake(broken);
  console.log(sample);
  console.log('broken:', broken);
  console.log('fixed :', fixed);
  console.log('ok    :', fixed === sample);
  console.log('---');
}
