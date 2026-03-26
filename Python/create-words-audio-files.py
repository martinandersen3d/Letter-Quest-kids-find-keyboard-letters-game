from gtts import gTTS
import os

# Note: Dont use VLC to play the audio files. Because it will fade in and fade out the audio file. But the audio file is so short, that it will sound wrong. Use another app than VLC.

# List of Danish letters and numbers
words = [
    'Abe', 'Bi', 'Gå', 'Løb', 'Måge', 'Næse', 'Rød', 'Sø', 'Tårn', 'Vand', 'Æble', 'Øl', 'År',
]

# Generate and save .ogg files
for char in words:
    # tts = gTTS(text=f'{char} , tasten', lang='da', slow=True)   # 'da' is the language code for Danish
    tts = gTTS(text=f'{char} , ', lang='da', slow=True)   # 'da' is the language code for Danish
    filename = f"{char.lower()}.ogg"
    tts.save(filename)
    print(f"Saved {filename}")
