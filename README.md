chiasmBin
======
### Drag.js
Drag.js doesn't work in IE11! So right now folks who use IE11 can't drag the popup. I wrote my own drag function, and put it inside chiasm.js. As the new code resides in chiasm.js, you no longer need drag.js. But as it is included in old pages, it should still be available on the server. You can serve an empty file, though. And make sure that it's not included in newly generated pages!

### Popup Border
- No need for liquidcorners.css. Situation is the same as with drag.js. So I suggest you serve an empty file for old pages, and don't include it in html of new ones.
- No more need to put **#showDiv** at the beginning of the body. You can delete this whole #showDiv from html code now.

Popup border customization:
```css
#popup {
  border-color: grey;
}
```