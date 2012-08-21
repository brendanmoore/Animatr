(function(window){

  var doc = document,
    vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
    (/firefox/i).test(navigator.userAgent) ? 'Moz' :
    (/trident/i).test(navigator.userAgent) ? 'ms' :
    'opera' in window ? 'O' : '',

  iterationListener = (vendor!=='Moz')? vendor+'AnimationIteration' : 'animationiteration',
  startListener = (vendor!=='Moz')? vendor+'AnimationStart' : 'animationstart';
  endListener = (vendor!=='Moz')? vendor+'AnimationEnd' : 'animationend';


  Animatr = function(elementId, args){

    var self = this,
      prop;

    self.elementId = elementId;
    self.el = doc.getElementById(elementId),
    self.options = {
      duration: 1,
      delay: 0,
      iteration: 'infinite',
      timingFunction: 'linear',
      direction: 'normal',
      fillMode: 'forwards',
      animationName: 'Animatr_' + elementId + parseInt((new Date()).getTime(), 16),
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

    self.el.addEventListener(iterationListener, self.options.iterationFunction);
    self.el.addEventListener(startListener, self.options.startFunction);
    self.el.addEventListener(endListener, self.options.endFunction);
  },

  AP = Animatr.prototype;

  AP.start = function(){
    this.createAnimation();
  },

  AP.stop = function(){
    var cssAnimation = doc.getElementById(this.options.animationName);
    cssAnimation.parentNode.removeChild(cssAnimation);
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
    var prefix = (!!vendor)?'-'+vendor.toLowerCase()+'-':'',
      opts = this.options,
      steps = this.steps,
      keyframes = this.generateKeyframes(steps),
      animDeclaration = '#'+this.elementId+'{'+
                          //prefix+'transform: translateZ(0);'+
                          prefix+'animation-name:' +opts.animationName+';'+
                          prefix+'animation-iteration-count:'+opts.iteration+';'+
                          prefix+'animation-timing-function:'+opts.timingFunction+';'+
                          prefix+'animation-direction:'+opts.direction+';'+
                          prefix+'animation-duration:'+opts.duration+'s;'+
                          prefix+'animation-delay:'+opts.delay+'s;'+
                          prefix+'animation-fill-mode:'+opts.fillMode+';'+
                        '}',
            animHover = '#'+this.elementId+':hover {'+
                        ( opts.pauseOnHover?
                          prefix+'animation-play-state: paused;' :
                          '') +
                        '}';
            animation = '@'+prefix+'keyframes '+opts.animationName +'{'+
                          keyframes +
                        '}';

      this.addAnimationStyle(animDeclaration+animHover+animation);
  };

  AP.generateKeyframes = function(steps){
    var keyframes = '',
      i, l=steps.length;
    if(l>1){
      for(i=0;i<l;i++){
          keyframes += (i/(l-1))*100 + '% {'+steps[i]+'}';
      }
    }else{
      keyframes = '0%{}100%{'+steps[0]+'}';
    }
    return keyframes;
  };

  AP.addAnimationStyle = function(animation){

    if(doc.getElementById(this.options.animationName)){
      this.stop();
    }

    var cssAnimation = doc.createElement('style'),
      rules = doc.createTextNode(animation);
    cssAnimation.type = 'text/css';
    cssAnimation.id = this.options.animationName;
    cssAnimation.appendChild(rules);
    doc.getElementsByTagName("head")[0].appendChild(cssAnimation);

  };

  window.Animatr = Animatr;

})(this);
