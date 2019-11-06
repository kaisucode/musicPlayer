from __future__ import unicode_literals
import youtube_dl


music_links = []

#  music_links.append("")
music_links.append("https://www.youtube.com/watch?v=NT09dw4dKSA")
music_links.append("https://www.youtube.com/watch?v=qmJb2tRdu-A")
music_links.append("https://www.youtube.com/watch?v=D91liF_Ml-M")
music_links.append("https://www.youtube.com/watch?v=VJodDGGJWkQ")
music_links.append("https://www.youtube.com/watch?v=Jok2KpYC4h4")
music_links.append("https://www.youtube.com/watch?v=nDgil_1dioc")
music_links.append("https://www.youtube.com/watch?v=M-P4QBt-FWw")
music_links.append("https://www.youtube.com/watch?v=IFTZtuXKzFs")
music_links.append("https://www.youtube.com/watch?v=iD0ffxoTLX0")
music_links.append("https://www.youtube.com/watch?v=AKjKtl8gVwE")
music_links.append("https://www.youtube.com/watch?v=-ybSTQO4sUg")
music_links.append("https://www.youtube.com/watch?v=xZRsZLtPOXo")
music_links.append("https://www.youtube.com/watch?v=sCEBdV2dZHI")
music_links.append("https://www.youtube.com/watch?v=CaLlsFC5RBM")
music_links.append("https://www.youtube.com/watch?v=9wWL5CsVUSA")


ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',
    }],
}
for link in music_links: 
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([link])
