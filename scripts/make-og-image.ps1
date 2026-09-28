# ---------------------------------------------------------------------------
# Builds the link-preview banner: 1200x630 (1.91:1) JPEG for og:image.
#
# WHY 1200x630: WhatsApp / Facebook / X only show the BIG image-on-top card
# for a ~1.91:1 landscape picture. A square or portrait photo (e.g. 1169x941)
# gets demoted to the small thumbnail beside the text — no HTML tag can change
# that, only the image shape can.
#
# This script keeps the WHOLE original photo (no cropping) and fills the
# leftover side space with a soft blurred copy of the same photo.
#
# Usage:  powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1
# Source: scripts\metatag-source.jpg   (master photo — NOT deployed)
# Output: public\images\metatag.jpg    (1200x630, ~60 KB — deploys with the site)
# ---------------------------------------------------------------------------
Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630

$root    = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$srcPath = Join-Path $root 'scripts\metatag-source.jpg'
$outPath = Join-Path $root 'public\images\metatag.jpg'

if (-not (Test-Path $srcPath)) { throw "Missing source image: $srcPath" }

$img = [System.Drawing.Image]::FromFile($srcPath)

# --- 1. blurred backdrop (whole photo, stretched, heavily softened) --------
$bg = New-Object -TypeName System.Drawing.Bitmap -ArgumentList @($W, $H, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g  = [System.Drawing.Graphics]::FromImage($bg)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$tw = 24
$th = [int][math]::Round($tw * $img.Height / $img.Width)
$tiny = New-Object -TypeName System.Drawing.Bitmap -ArgumentList @($img, $tw, $th)

$ia = New-Object System.Drawing.Imaging.ImageAttributes
$ia.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
$destRect = New-Object -TypeName System.Drawing.Rectangle -ArgumentList @(0, 0, $W, $H)
$g.DrawImage($tiny, $destRect, 0, 0, $tw, $th, [System.Drawing.GraphicsUnit]::Pixel, $ia)

# darken the backdrop so the sharp photo reads clearly on top of it
$shade = New-Object -TypeName System.Drawing.SolidBrush -ArgumentList ([System.Drawing.Color]::FromArgb(72, 0, 0, 0))
$g.FillRectangle($shade, $destRect)

# --- 2. the real photo, full height, centred ---------------------------------
$ph = $H
$pw = [int][math]::Round($img.Width * $ph / $img.Height)
$px = [int](($W - $pw) / 2)
$photoRect = New-Object -TypeName System.Drawing.Rectangle -ArgumentList @($px, 0, $pw, $ph)
$g.DrawImage($img, $photoRect)

# --- 3. feather the photo's left/right edges into the backdrop ---------------
$fade  = 120
$midY  = [int]($H / 2)
$leftC = $bg.GetPixel([math]::Max($px - 10, 0), $midY)
$rightC = $bg.GetPixel([math]::Min($px + $pw + 10, $W - 1), $midY)

$rectL = New-Object -TypeName System.Drawing.Rectangle -ArgumentList @($px, 0, $fade, $H)
$bL = New-Object -TypeName System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList @($rectL, $leftC, [System.Drawing.Color]::FromArgb(0, $leftC.R, $leftC.G, $leftC.B), [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
$g.FillRectangle($bL, $rectL)

$rectR = New-Object -TypeName System.Drawing.Rectangle -ArgumentList @(($px + $pw - $fade), 0, $fade, $H)
$bR = New-Object -TypeName System.Drawing.Drawing2D.LinearGradientBrush -ArgumentList @($rectR, [System.Drawing.Color]::FromArgb(0, $rightC.R, $rightC.G, $rightC.B), $rightC, [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
$g.FillRectangle($bR, $rectR)

# --- 4. save as JPEG (quality 90) -------------------------------------------
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object -TypeName System.Drawing.Imaging.EncoderParameters -ArgumentList @(1)
$ep.Param[0] = New-Object -TypeName System.Drawing.Imaging.EncoderParameter -ArgumentList @([System.Drawing.Imaging.Encoder]::Quality, ([int64]90))
$bg.Save($outPath, $jpeg, $ep)

# --- cleanup -----------------------------------------------------------------
$bL.Dispose(); $bR.Dispose(); $shade.Dispose(); $ia.Dispose()
$tiny.Dispose(); $g.Dispose(); $bg.Dispose(); $img.Dispose()

$info = Get-Item $outPath
$check = [System.Drawing.Image]::FromFile($outPath)
Write-Output ("OUT : {0}" -f $outPath)
Write-Output ("DIMS: {0}x{1}" -f $check.Width, $check.Height)
Write-Output ("RATIO: {0:N3} (target 1.905)" -f ($check.Width / $check.Height))
Write-Output ("SIZE: {0:N0} bytes ({1:N1} KB)" -f $info.Length, ($info.Length / 1KB))
$check.Dispose()
Write-Output ("UNDER-300KB: {0}" -f ($info.Length -lt 300KB))
Write-Output ("UNDER-600KB: {0}" -f ($info.Length -lt 600KB))
