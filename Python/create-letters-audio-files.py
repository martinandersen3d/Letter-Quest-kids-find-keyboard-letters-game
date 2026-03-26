from gtts import gTTS
import os

# Note: Dont use VLC to play the audio files. Because it will fade in and fade out the audio file. But the audio file is so short, that it will sound wrong. Use another app than VLC.

# List of Danish letters and numbers
danish_characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Æ', 'Ø', 'Å',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

# Generate and save .ogg files
for char in danish_characters:
    # tts = gTTS(text=f'{char} , tasten', lang='da', slow=True)   # 'da' is the language code for Danish
    tts = gTTS(text=f'{char} , ', lang='da', slow=True)   # 'da' is the language code for Danish
    filename = f"{char.lower()}.ogg"
    tts.save(filename)
    print(f"Saved {filename}")
