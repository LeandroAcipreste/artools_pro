$bytes = [System.IO.File]::ReadAllBytes('C:\Users\User\.gemini\antigravity\brain\ffe67227-0905-43f4-826b-1294f6915754\media__1774094925059.jpg')
[System.IO.File]::WriteAllBytes('c:\Users\User\Documents\artools_pro\raw_files\new_pen.jpg', $bytes)
