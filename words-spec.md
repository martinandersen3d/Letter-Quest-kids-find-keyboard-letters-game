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
When a word is shown the first letter is 100% visible, and the remaining letters is fifty percent visible. The Letter that has focus will always be hundred percent.
A sticker is added after each word completed.
- Should the case toggle still be needed for words? Words have mixed case (first letter capitalized)
 - no, we will remove the toggle button funcitonality
 

# Styling change For uppercase and lowercase:
- The styling for the main letters is the same styling as the current CSS have implemented.They are always upper case, For all the letters in the word.
- Below each uppercase letter is there a circle with the lowercase lower case equivalent.The circle is dark background with a bright text.And is half the size as the uppercase.
- the letters that is 50% visible is also 50% desaturated
- When the user presses a key, The audio letter is played immediately.But the CSS transition has to wait six hundred milliseconds before it fades to the next one.
- Immediately when the key is pressed, then the active letter will have a short 500 ms fade-in-fade-out white text outline around the text.
Example.:
```
H O U S E
h o u s e
```
- The word Audio file is played In the beginning when a word is shown, But not When the user have completed the word.