(function(window){

  var doc = document,
    vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
    (/firefox/i).test(navigator.userAgent) ? 'Moz' :
    (/trident/i).test(navigator.userAgent) ? 'ms' :
    'opera' in window ? 'O' : '',


  Animatr = function(elementId, args){

    var self = this,
      prop;

    self.elementId = elementId;
    self.el = doc.getElementById(elementId),
    self.options = {
      'duration': 1,
      'iteration': 'infinite',
      'timingFunction': 'linear',
      'animationName': 'Animatr_' + elementId + parseInt((new Date()).getTime(), 16),
      'startCss': {},
      'css': {},
      'startDelay': 0,
      'preventImmediateStart': false
    };

    for(prop in args) self.options[prop] = args[prop];

    self.options.cssStartString = self.stringifyCSS(self.options.startCss);
    self.options.cssEndString   = self.stringifyCSS(self.options.css);

    if(!self.options.preventImmediateStart){
      setTimeout(function(){
        self.start();
      }, self.options.startDelay);
    }

  },

  AP = Animatr.prototype;

  AP.start = function(){
    this.createAnimation();
  },

  AP.stop = function(){
    var cssAnimation = doc.getElementById(this.options.animationName);
    cssAnimation.parentNode.removeChild(cssAnimation);
  };

  AP.stringifyCSS = function(cssObj){
    var string = '',
      prop;
    for(prop in cssObj){
      string += prop+':'+cssObj[prop]+';';
    }
    return string;
  };

  AP.createAnimation = function(){
    var animVendor = '-'+vendor.toLowerCase(),
      opts = this.options,
      animDeclaration = '#'+this.elementId+'{'+
                          animVendor+'-animation-name:' +opts.animationName+';'+
                          animVendor+'-animation-iteration-count:'+opts.iteration+';'+
                          animVendor+'-animation-timing-function:'+opts.timingFunction+';'+
                          animVendor+'-animation-duration:'       +opts.duration+'s;'+
                          'animation-name:' +opts.animationName+';'+
                          'animation-iteration-count:'+opts.iteration+';'+
                          'animation-timing-function:'+opts.timingFunction+';'+
                          'animation-duration:'       +opts.duration+'s;'+
                        '}',
            animation = '@'+animVendor+'-keyframes '+opts.animationName +'{'+
                          '0% {'+opts.cssStartString+'}'+
                          '100% {'+opts.cssEndString+'}'+
                        '}'+
                        '@-keyframes '+opts.animationName +'{'+
                          '0% {'+opts.cssStartString+'}'+
                          '100% {'+opts.cssEndString+'}'+
                        '}';
      this.addAnimationStyle(animDeclaration+animation);
  };

  AP.addAnimationStyle = function(animation){

    var cssAnimation = doc.createElement('style'),
      rules = doc.createTextNode(animation);
    cssAnimation.type = 'text/css';
    cssAnimation.id = this.options.animationName;
    cssAnimation.appendChild(rules);
    doc.getElementsByTagName("head")[0].appendChild(cssAnimation);

  };

  window.Animatr = Animatr;

})(this);
