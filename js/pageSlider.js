(function(){
    var Util = {
        extend: function(defaultOpts, opts) {
            // return $.extend(defaultOpts, opts);
            var result = {};
            for(var item in defaultOpts){
                result[item] = defaultOpts[item];
            }
            for(var item in opts) {
                result[item] = opts[item];
            }
            return result;
        },
        addClass: function(els, className) {
            if(els.length){
                for(var i = 0,_length = els.length; i < _length; i++){
                    els[i].className += ' '+className;
                }
            }else {
                els.className +=' '+ className;
            }
        },
        removeClass: function(els,className) {
            $(els).removeClass(className);
        },
        css: function(els, cssList) {
            return $(els).css(cssList);
        },
        height: function(els) {
            return $(els).height();
        },
        width: function(els) {
            return $(els).width();
        },
        proxy: function(fn, context){
            return $.proxy(fn, context);
        },
        query: function(selector){
            var _resultArray = [];
            var $doms = $(selector);
            var _length = $doms.length;
            if (_length ===1 ){
                return $doms[0];
            }else if(_length > 1 ){
                for(var i= 0; i<_length; i++){
                    _resultArray.push($doms.get(i));
                }
            }
            return _resultArray;

        },
        index: function(el){
            return $(el).index();
        },
        eq: function(el, index){
            return $(el).eq(index).get(0);
        },
        find: function(el,selector){
            var _resultArray = [];
            var $doms = $(el).find(selector);
            var _length = $doms.length;
            if (_length ===1 ){
                return $doms[0];
            }else if(_length > 1 ){
                for(var i= 0; i<_length; i++){
                    _resultArray.push($doms.get(i));
                }
            }
            return _resultArray;
        },
        animate: function(el, cssList, duringTime, callback ){
            $(el).stop().animate(cssList, duringTime, callback);
        },
        wrapAll: function(wrapper, el){
            return $(el).wrapAll(wrapper);
        },
        events: {
            getEvent: function(ev){
                var ev = ev? ev: window.event;
                return ev;
            },
            stopPropagation: function(ev){
                if(ev){
                    ev.stopPropagation();
                }else {
                    window.event.cancelbubble = true;
                }

            }
        }
    }

    var SwitchAniType = function(){
        this.init();
    }
    SwitchAniType.prototype = {
        TYPE: 'all',
        init: function() {
            //the method for children to inherit: initialize the pages' initial style
        },
        initAtributes: function(pageSlider){
            this.pageSlider = pageSlider;
            this.el = this.pageSlider.el;
            this.steps = this.pageSlider.steps;
            this._step1 = this.steps[0];
            this.stepLength = this.steps.length;
            this._height = this.pageSlider._height;
            this._width = this.pageSlider._width;
            this.direction = this.pageSlider.direction;
        },
        switchToAni: function(curIndex, targetIndex, cur, target, time, callback ){
            //the method for children to inherit: switch animation
        }
    }

    var SlideType = function(pageSlider){
        this.init(pageSlider);
    }
    SlideType.prototype = Util.extend(new SwitchAniType(), {
        TYPE: 'slide',
        init: function (pageSlider) {
            this.initAtributes(pageSlider);
            if(this.direction === 'vertical'){
                Util.css(this._step1,
                {
                    'margin-top': '0px'
                });
            }
            else if (this.direction === 'horizontal') {
                var wrapper = document.createElement('div');
                Util.addClass(wrapper, 'hor-wrapper');
                Util.css(wrapper, {
                    'width': this._width * this.stepLength + 'px',
                    'margin-left': '0px',
                    'height': this._height+'px'
                });
                Util.wrapAll(wrapper, this.steps);
                this.wrapper = Util.find(this.el, '.hor-wrapper')
                Util.css(this.steps, {
                    'width': this._width+'px',
                    'float': 'left',
                    'height': this._height+'px'
                });
            }
        },
        switchToAni: function(curIndex, targetIndex, cur, target, time, callback ){
            var that = this;
            if(this.direction === 'vertical'){
                Util.animate(this._step1, {
                    'margin-top': -targetIndex*this._height+ 'px'
                }, time, function(){
                    callback.call(that.pageSlider);
                });
            }else if(this.direction === 'horizontal'){
                Util.animate(this.wrapper, {
                    'margin-left': -targetIndex*this._width +'px'
                }, time, function(){
                    callback.call(that.pageSlider);
                });
            }

        }
    });

    var PageSlider = function(opts) {
        this._defaultOpts = {
            // el: the wrapper dom element
            el: null,
            // animation type
            aniType:'slide',
            // animation direction: vertical ? horizontal
            direction: 'vertical',
            //animation during time
            duringTime: 800,
            //callback if needed after animation.
            callback: null
        };
        this._opts = Util.extend(this._defaultOpts, opts);
        this._init(this._opts);
    }

    PageSlider.prototype = {
        //animation type list
        _aniTypeList: {
            'slide': SlideType
        },
        //initialize
        _init: function (opts) {
            this.el = opts.el;
            this.duringTime = opts.duringTime;
            this.direction = opts.direction;
            //the pages
            this.steps = Util.find(this.el,'> section');
            //the pages' number
            this.stepLength = this.steps.length;
            this._callback = opts.callback;
            //add necessary classname for pages
            this._initClassName();
            //the actived page
            this.activedStep = Util.find(this.el, '.actived');
            this.curIndex = Util.index(this.activedStep);
            //record the el's height after add necessary class for some animation type
            this._height = Util.height(this.el);
            this._width = Util.width(this.el);
            //initialize the animation type
            this._aniType = new (this._aniTypeList[opts.aniType])(this);
            // initialize the touch event
            this._touchEvents = new TouchEvents({
                el: this.el,
                callbacks: {
                    startCB: null,
                    moveCB: null,
                    endCB: Util.proxy(this._moveEndCallback, this)
                }
            });
        },
        _initClassName: function(){
            Util.addClass(this.el, 'J-page-wrapper page-wrapper');
            Util.addClass(this.steps, 'J-setp step');
            Util.addClass(this.steps[0],'actived');
        },
        _moveEndCallback: function(isChgX, isChgY, delta){
            if(this.direction === 'vertical'){
                if(isChgY){
                    if(delta.y < 0){
                        this.switchTo(this.curIndex+1);
                    } else {
                        this.switchTo(this.curIndex-1);
                    }
                }
            }else if(this.direction === 'horizontal'){
                if(isChgX){
                    if(delta.x < 0){
                        this.switchTo(this.curIndex+1);
                    } else {
                        this.switchTo(this.curIndex-1);
                    }
                }
            }
        },
        _aniCallback: function(curIndex,targetIndex,cur,target){
            this.activedStep = target;
            this.curIndex = targetIndex;
            Util.removeClass(cur, 'actived');
            Util.addClass(target,'actived');
            if(this._callback){
                this._callback.call(this, cur, target);
            }
        },
        switchTo: function(targetIndex){
            var target = this.steps[targetIndex];
            if(targetIndex < 0|| targetIndex > this.stepLength-1 ){
                return;
            }
            var cbk = function(){
                this._aniCallback.call(this, this.curIndex, targetIndex, this.activedStep, target);
            }
            this._aniType.switchToAni(this.curIndex, targetIndex, this.activedStep, target, this.duringTime, cbk);
        }
    }

    var TouchEvents = function(opts) {
        this._init(opts);
    }
    TouchEvents.prototype = {
        _defaultOpts: {
            el: null,
            callbacks: {
                startCB: null,
                moveCB: null,
                endCB: null
            },
            threshold: {
                x: 50,
                y: 50
            }

        },
        _init: function(opts) {
            this.opts = Util.extend(this._defaultOpts, opts);
            this.startCB = opts.callbacks.startCB;
            this.moveCB = opts.callbacks.moveCB;
            this.endCB = opts.callbacks.endCB;
            this.el = opts.el;
            this._bindEvents(this.el);
            this.threshold = this.opts.threshold;
        },
        _bindEvents: function(el){
            el.addEventListener('touchstart', Util.proxy(this._start, this), false);
            el.addEventListener('touchmove', Util.proxy(this._move, this), false);
            el.addEventListener('touchend', Util.proxy(this._end, this), false);
        },
        _start: function(ev){
            var touches = event.touches[0];
            this._startP = {
                x: touches.pageX,
                y: touches.pageY
            };
            this.delta = {
                x: 0,
                y: 0
            };
            if(this.startCB){
                this.startCB(event);
            }
        },
        _move: function(ev){
            if (event.touches.length > 1 || event.scale && event.scale !== 1) {
                return;
            }
            event.preventDefault();
            var touches = event.touches[0];
            this.delta = {
                x: touches.pageX - this._startP.x,
                y: touches.pageY - this._startP.y
            }
            if(this.moveCB){
                this.moveCB(event);
            }
        },
        _end: function(ev){
            var win_w = Util.width(window);
            var win_h = Util.height(window);
            var isChgY = (Math.abs(this.delta.y) > Math.abs(this.delta.x))&&(Math.abs(this.delta.y) > this.threshold.y || Math.abs(this.delta.y) > win_h/ 2);
            var isChgX = (Math.abs(this.delta.y) < Math.abs(this.delta.x))&&(Math.abs(this.delta.x) > this.threshold.x || Math.abs(this.delta.x) > win_w/ 2);
            this.endCB(isChgX, isChgY, this.delta);
        }
    }



    var pageWrapper = document.getElementById('J-pageSlider');
    var horPageSlider = document.getElementById('hor-pageSlider');
    var page = new PageSlider({
        el: pageWrapper,
        aniType:'slide',
        direction: 'vertical',
        duringTime: 800,
        callback: function(cur, target){
            //this is the pageSlider instance
            var index = this.curIndex;
            $('#menu li').eq(index).click();
        }
    });
    var page1 = new PageSlider({
        el: horPageSlider,
        aniType:'slide',
        direction: 'horizontal',
        duringTime: 800,
        callback: function(cur, act){
            console.log('callback');
        }
    });

    $('#menu li').click(function(event){
        var $li = $(event.target),
            index = $li.index();
        page.switchTo(index);
        $li.addClass('current').siblings().removeClass('current');
    });

})();