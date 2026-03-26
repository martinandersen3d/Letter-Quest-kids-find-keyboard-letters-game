# Files you need to read:
- words.json
- words-spec.md
- words.css
- words.html
- words.js

# Files you need to edit:
- words.css
- words.html
- words.js

# Location of audio files.
- Alphabetic and numerical:
    - ./audio-alphabet/a.ogg
    - ./audio-alphabet/b.ogg
    - ./audio-alphabet/c.ogg
    - ./audio-alphabet/1.ogg
    - ./audio-alphabet/2.ogg
    - ./audio-alphabet/3.ogg
- Single word Audio files.
    - ./audio-word/hello.ogg (read the json file for the real names)


# General game Initialization of words.html
1. the word.html is Started in the browser.
2. The js is loaded. 
3. It gets all the words from the JSON file.

# Current Behavior:
A letter is shown on the screen. And after that a keyboard key is pressed and the letter will be spoken out loud.

# New behavior in words.html and words.js
This is focusing more on learning words than it is learning a single letter.
We want to show one word on the screen at a time.
But we still want to speak out the letter that is pressed for each letter in the word.
When all the letters in the word have been pressed, a new word will be shown.
Also from the JSON file, you can see that there is an emoji available for each word.
We would like to show the emoji together with the word.
