# Animatr
## Overview
**Animatr** is a very simple lean **CSS3** animator and is library free.

Cross browser support for the latest Firefox/Chrome/Safari/Opera/IE(10). Automatically creates the animation based on vendor specific prefixes.

Also allows `start`, `end` and `iteration` callback functions to be defined.

##Usage

```javascript	
	var anim = new Animatr(ELEMENT_ID, options);
	//Example options include the default CSS3 animation
	//properties (camelCased)
	options = {
      duration: '1s',
      delay: 0,
      iterationCount: 'infinite',
      timingFunction: 'linear',
      direction: 'normal',
      fillMode: 'forwards',
      name: 'testAnim',
      pauseOnHover: false,
      startCss: null, //Start styles e.g {opacity:1}
      css: null, // End styles e.g. {opacity: 0}
      startDelay: 0,
      preventImmediateStart: false,
      iterationFunction: function(e){},
      startFunction: function(e){},
      endFunction: function(e){}
    }
```

Check out the demo for more info. Will add more information when I have time.

###Credits:
@billybobuk