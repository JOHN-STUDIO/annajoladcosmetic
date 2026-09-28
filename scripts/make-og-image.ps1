# ---------------------------------------------------------------------------
# Builds the link-preview banner: 1200x630 (1.91:1) JPEG for og:image.
#
# WHY 1200x630: WhatsApp / Facebook / X only show the BIG image-on-top card
# for a ~1.91:1 landscape picture. A square or portrait photo (e.g. the
# 1169x941 master) gets demoted to the small thumbnail beside the text — no
# HTML tag can change that, only the image shape can (Meta center-crops
# anything that isn't 1.91:1).
#
# HOW: the master photo is CROPPED to 1.91:1 and scaled to exactly 1200x630 —
# the picture itself fills the whole banner (no blurred backdrop, no bars).
# The master is taller than 1.91:1, so ~327px of its top/bottom has to go;
# -Top chooses which slice to keep.
#
# Usage:  powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1
#         powershell ... -File scripts\make-og-image.ps1 -Top 110   # more product row, crown trimmed
#         powershell ... -File scripts\make-og-image.ps1 -Top 327   # bottom slice (product labels)
# Source: scripts\metatag-source.jpg   (master photo — NOT deployed)
# Output: public\images\metatag.jpg    (1200x630, ~60 KB — deploys with the site)
# ---------------------------------------------------------------------------
param(
  # Source pixel row that becomes the banner's top edge.
  # 25 = her whole head is in frame, product tops run off the bottom (default).
  [int]$Top = 25
)

Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630

$root    = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$srcPath = Join-Path $root 'scripts\metatag-source.jpg'
$outPath = Join-Path $root 'public\images\metatag.jpg'

if (-not (Test-Path $srcPath)) { throw "Missing source image: $srcPath" }

$img  = [System.Drawing.Image]::FromFile($srcPath)
$srcW = $img.Width
$srcH = $img.Height

# --- 1. the crop window: full width, 1.91:1 tall, starting at $Top ----------
$cropH = [int][math]::Round($srcW / ($W / $H))

if ($Top -lt 0) { $Top = 0 }
if ($Top -gt ($srcH - $cropH)) { $Top = $srcH - $cropH }

# --- 2. draw that window straight onto the 1200x630 canvas ------------------
$bmp = New-Object -TypeName System.Drawing.Bitmap -ArgumentList @($W, $H, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g   = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$destRect = New-Object -TypeName System.Drawing.Rectangle -ArgumentList @(0, 0, $W, $H)
$g.DrawImage($img, $destRect, 0, $Top, $img.Width, $cropH, [System.Drawing.GraphicsUnit]::Pixel)

# --- 3. save as JPEG (quality 90) -------------------------------------------
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object -TypeName System.Drawing.Imaging.EncoderParameters -ArgumentList @(1)
$ep.Param[0] = New-Object -TypeName System.Drawing.Imaging.EncoderParameter -ArgumentList @([System.Drawing.Imaging.Encoder]::Quality, ([int64]90))
$bmp.Save($outPath, $jpeg, $ep)

# --- cleanup -----------------------------------------------------------------
$g.Dispose(); $bmp.Dispose(); $img.Dispose()

$info  = Get-Item $outPath
$check = [System.Drawing.Image]::FromFile($outPath)

Write-Output ("SOURCE:  {0} x {1}  ({2:N3}:1)" -f $srcW, $srcH, ($srcW / $srcH))
Write-Output ("CROPPED: rows {0}..{1} of the source ({2}px tall)" -f $Top, ($Top + $cropH - 1), $cropH)
Write-Output ("OUT:     {0}" -f $outPath)
Write-Output ("DIMS:    {0} x {1}  ({2:N3}:1 - target 1.905)" -f $check.Width, $check.Height, ($check.Width / $check.Height))
Write-Output ("SIZE:    {0:N0} bytes ({1:N1} KB)" -f $info.Length, ($info.Length / 1KB))
$check.Dispose()
Write-Output ("UNDER-300KB: {0}" -f ($info.Length -lt 300KB))
Write-Output ("UNDER-600KB: {0}" -f ($info.Length -lt 600KB))
