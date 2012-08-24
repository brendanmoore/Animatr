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
    startListener = (vendor!=='Moz')? vendor+'AnimationStart' : 'animationstart';
    endListener = (vendor!=='Moz')? vendor+'AnimationEnd' : 'animationend';

  /**
   * The constructor.
   *
   * @param {string} elementId #id of the DOM element for animation.
   * @param {object} args      Erm... the args.
   */
  Animatr = function(elementId, args){

    var self = this,
      prop;

    self.elementId = elementId;
    self.el = doc.getElementById(elementId);
    self.el.__Animatr = self;
    self.options = {
      duration: '1s',
      delay: 0,
      iterationCount: 'infinite',
      timingFunction: 'linear',
      direction: 'normal',
      fillMode: 'forwards',
      name: 'Animatr_' + elementId + (new Date()).getTime(),
      pauseOnHover: false,
      startCss: null,
      css: null,
      startDelay: 0,
      preventImmediateStart: false,
      iterationFunction: function(e){},
      startFunction: function(e){},
      endFunction: function(e){}
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
    var _bind = function(){ return self.el.addEventListener.apply(self.el, Array.prototype.slice.call(arguments)); };
    _bind(iterationListener, self.options.iterationFunction);
    _bind(startListener, self.options.startFunction);
    _bind(endListener, self.options.endFunction);
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
    this.options.animationName = 'Animatr_' + this.elementId + (new Date()).getTime();
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
