### CrossWord
#### A simple HTML/JavaScript game  
##### Author: Chris Jackem
---  

![screenshot](screenshot.png?raw=true "CrossWord Screenshot")

### Explanation  
This is a 1 day code challenge I completed. I used one more day for images/polish.

If you have ever seen a crossword puzzle, you get the idea. I wanted to play around with the css grid and the drag and drop api because I think there is alot of potential here as far as browser games go.

### Technical
The level data is stored in the level.json file. If you want to use this for yourself, this is all you really need to change.

Alot of the (inline) styles are changed on the fly for font sizes, animations, and colors. This might require tweaks to CSP.

This app uses the [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) ( for Desktop ) and a custom mobile drag and drop that replaces the dragging events, but uses the drop event by creating a DataTransfer object.