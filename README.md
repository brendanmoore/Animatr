# Animatr
## Overview
**Animatr** is a very simple lean **CSS3** animator and is library free.

Cross browser support for the latest Firefox/Chrome/Safari/Opera/IE(10). Automatically creates the animation based on vendor specific prefixes.

Also allows `start`, `end` and `iteration` callback functions to be defined.

##Usage

```javascript	

	//ELEMENT_ID can be string or the DOM element
	//itself
	var anim = new Animatr(ELEMENT_ID, options);
	//Example options include the default CSS3 animation
	//properties (camelCased)
	options = {
      
      //s or ms
      duration: '1s',
      
      //s or ms
      delay: 0,
      
      // Configures the number of times the animation
      // should repeat; you can specify infinite to
      // repeat the animation indefinitely.
      iterationCount: 'infinite',
      
      // Configures the timing of the animation; that is,
      // how the animation transitions through keyframes,
      // by establishing acceleration curves.
      timingFunction: 'ease',
      
      // Configures whether or not the animation should
      // alternate direction on each run through
      // sequence or reset to the start point and repeat
      // itself. 
      direction: 'normal',
      
      // Configures what values are applied by the
      // animation before and after it is executing.
      fillMode: 'forwards',
      
      // Specifies the name of the @keyframes at-rule
      // describing the animation's keyframes.
      // This will be auto generated if not set.
      name: 'testAnim',
      
      pauseOnHover: false,
      
      startCss: null, //Start styles e.g {opacity:1}
      
      css: null, // End styles e.g. {opacity: 0}
      
      // When set to false allows for chaining
      // of .step();
      preventImmediateStart: false,
      
      // Callback function fired after every iteration.
      iterationCallback: function(e){},
      
      // Callback function fired on start of the
      // animation, triggered after the inital delay has
      // elapsed
      startCallback: function(e){},
      
      // Callback function fired on completion of final
      // interation. 
      // Will not fire if interationCount = 'infinite'
      endCallback: function(e){}
    }
```

##Simple Example

```javascript

var anim = new Animatr(document.querySelector('.test'), {
      //The end style of the animation
      css: {  background: 'red',
              padding: '25px' },
      
      //Number of times to repeat       
      iterationCount: 2,
      
      //Callback on complete
      endCallback: function(){
      	//do stuff...
      }
    });
    
```

Check out the demo for more info. Will add more information when I have time.

###Credits:
[@billybobuk](https://github.com/billybobuk)

## License 

(The MIT License)