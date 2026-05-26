$enc = [System.Text.Encoding]::GetEncoding(437)
$codes = @()
for ($b = 0; $b -le 255; $b++) {
  $ch = $enc.GetString([byte[]]$b)
  $codes += [int][char]$ch
}
$codes -join ','
