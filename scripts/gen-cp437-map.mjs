import { execSync } from 'node:child_process';
import fs from 'node:fs';

const psScript = `
$enc = [System.Text.Encoding]::GetEncoding(437)
$map = @{}
for ($b = 0; $b -le 255; $b++) {
  $ch = $enc.GetString([byte[]]$b)
  $code = [int][char]$ch
  $map[[string]$code] = $b
}
$map | ConvertTo-Json -Compress
`;

const json = execSync('powershell -NoProfile -Command ' + JSON.stringify(psScript), {
  encoding: 'utf8',
}).trim();

const reverse = JSON.parse(json);
const correct =
  'Round Keychain \u043a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0442\u043e\u0440 + \u0434\u0435\u0442\u0430\u043b\u0438 + \u0437\u0430\u043a\u0430\u0437 \u2014 Dream Step';

const utf8 = Buffer.from(correct, 'utf8');
let mojibake = '';
for (const byte of utf8) {
  const cp = Object.keys(reverse).find((code) => reverse[code] === byte);
  mojibake += String.fromCharCode(Number(cp));
}

const fixed = Buffer.from([...mojibake].map((char) => reverse[String(char.charCodeAt(0))] ?? char.charCodeAt(0))).toString(
  'utf8',
);

console.log('mojibake sample:', mojibake.slice(13, 35));
console.log('fixed:', fixed);
console.log('ok:', fixed === correct);
