(function(window){

  var doc = document,
    animProps = "name iteration-count timing-function direction duration delay fill-mode".split(' '),
    vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
      (/firefox/i).test(navigator.userAgent) ? 'Moz' :
      (/trident/i).test(navigator.userAgent) ? 'ms' :
      'opera' in window ? 'O' : '',
    prefix = (!!vendor)?'-'+vendor.toLowerCase()+'-':'',
    preProp = prefix+'animation-',
    rdashAlpha = /-([a-z])/ig,
    fcamelCase = function (all, l) { return l.toUpperCase(); },
    camelCase = function(s) { return s.replace(rdashAlpha, fcamelCase); },
    iterationListener = (vendor!=='Moz')? vendor+'AnimationIteration' : 'animationiteration',
    startListener = (vendor!=='Moz')? vendor+'AnimationStart' : 'animationstart',
    endListener = (vendor!=='Moz')? vendor+'AnimationEnd' : 'animationend',

  /**
   * The constructor.
   *
   * @param {string} elementId #id of the DOM element for animation.
   *                           DOMObject of animateble element
   * @param {object} args      Erm... the args.
   */
  Animatr = function(elementId, args){

    var self = this,
      prop;

    if(typeof elementId === 'string'){
      self.elementId = elementId;
      self.el = doc.getElementById(elementId);
    }else if(typeof elementId === 'object'){
      self.elementId = 'a_' + ~~(Math.random()*1000) + (new Date()).getTime();
      self.el = elementId;
      self.el.id = self.elementId;
    }else{
      throw new Error('No DOM Object or Element ID given');
    }

    self.el.__Animatr = self;
    self.options = {

      duration: '1s',

      delay: 0,

      // Configures the number of times the animation
      // should repeat; you can specify infinite to
      // repeat the animation indefinitely.
      iterationCount: 'infinite',

      // Configures the timing of the animation; that is,
      // how the animation transitions through keyframes,
      // by establishing acceleration curves.
      timingFunction: 'linear',

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
      name: 'Animatr_' + self.elementId + (new Date()).getTime(),

      pauseOnHover: false,

      startCss: null,

      css: null,

      startDelay: 0,

      // When set to false allows for chaining
      // of .step();
      preventImmediateStart: false,

      // Callback function fired after every iteration.
      iterationCallback: null,

      // Callback function fired on start of the
      // animation, triggered after the inital delay has
      // elapsed
      startCallback: null,

      // Callback function fired on completion of final
      // interation.
      // Will not fire if interationCount = 'infinite'
      endCallback: null

    };

    for(prop in args) self.options[prop] = args[prop];


    var cssStartString = !!self.options.startCss&&self.stringifyCSS(self.options.startCss),
    cssEndString   = !!self.options.css&&self.stringifyCSS(self.options.css);

    self.steps = [];
    if(!!cssStartString){
      self.steps.push(cssStartString);
    }
    if(!!cssEndString){
     if(!cssStartString){
        self.steps.push('');
      }
      self.steps.push(cssEndString);
    }

    if(!self.options.preventImmediateStart){
      setTimeout(function(){
        self.start();
      }, self.options.startDelay);
    }
    var _bind = function(){
      return self.el.addEventListener.apply(self.el, Array.prototype.slice.call(arguments));
    };
    _bind(iterationListener, self.options.iterationCallback);
    _bind(startListener, self.options.startCallback);
    _bind(endListener, self.options.endCallback);
  },

  AP = Animatr.prototype;

  AP.start = function(){
    this.createAnimation();
  },

  AP.stop = function(){
    var cssAnimation = doc.getElementById(this.options.name);
    cssAnimation.parentNode.removeChild(cssAnimation);
  };

  AP.restart = function(){
    this.options.name = 'Animatr_' + this.elementId + (new Date()).getTime();
    this.createAnimation();
  };

  AP.destroy = function(){
    this.stop();
    this.el.removeEventListener(iterationListener, this.options.iterationFunction);
    this.el.removeEventListener(startListener, this.options.startFunction);
    this.el.removeEventListener(endListener, this.options.endFunction);
  };

  //Chainable
  AP.step = function(cssObj){
    this.steps.push(this.stringifyCSS(cssObj));
    return this;
  };

  AP.stringifyCSS = function(cssObj){
    if(cssObj===null) return '';
    var string = '',
      prop;
    for(prop in cssObj){
      string += prop+':'+cssObj[prop]+';';
    }
    return string;
  };

  AP.createAnimation = function(){

      var opts = this.options,
      steps = this.steps,
      animation = [this.generateProps(opts),
                   this.generateHover(opts),
                   this.generateKeyframes(steps, opts)];
      this.addAnimationStyle(animation.join('\n'));
  };

  AP.generateProps = function(opts){
    var animDeclaration = ['#'+this.elementId+'{'];
      for(var i=0, prop; i<animProps.length;i++){
        prop = animProps[i];
        animDeclaration.push(preProp+prop +':'+ opts[camelCase(prop)]+';');
      }
      animDeclaration.push('}');
    return animDeclaration.join('\n');
  };

  AP.generateHover = function(opts){
    return opts.pauseOnHover?['#',this.elementId,':hover {',prefix,'animation-play-state: paused;}'].join(''): '';
  };

  AP.generateKeyframes = function(steps, opts){
    var keyframes = ['@'+prefix+'keyframes '+opts.name +'{'],
      i, l=steps.length;
    if(l>1){
      for(i=0;i<l;i++){
          keyframes.push((i/(l-1))*100 + '% {'+steps[i]+'}');
      }
    }else{
      keyframes.push('0%{}100%{'+steps[0]+'}');
    }
    keyframes.push('}');
    return keyframes.join('\n');
  };

  AP.addAnimationStyle = function(animation){

    if(doc.getElementById(this.options.animationName)){
      this.stop();
    }

    var cssAnimation = doc.createElement('style'),
      rules = doc.createTextNode(animation);
    cssAnimation.type = 'text/css';
    cssAnimation.id = this.options.name;
    cssAnimation.appendChild(rules);
    doc.getElementsByTagName("head")[0].appendChild(cssAnimation);
    this.cssAnimation = cssAnimation;
  };

  window.Animatr = Animatr;

})(this);
