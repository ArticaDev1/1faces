//lazylaod
import 'lazysizes';
lazySizes.cfg.expand = 50;
lazySizes.cfg.preloadAfterLoad = 50;
document.addEventListener('lazybeforeunveil', function(e){
  let el = e.target.tagName,
      bg = e.target.getAttribute('data-src');
  if(el!=='IMG') {
    let bg = e.target.getAttribute('data-src');
    e.target.style.backgroundImage = `url('${bg}')`;
  }
});
//gsap
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);
import device from "current-device";
//form
import Inputmask from "inputmask";
let validate = require("validate.js");

window.onload = function(){
  App.onLoadEvents();
}

const brakepoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1520
}

const $wrapper = document.querySelector('.wrapper');
const $header = document.querySelector('.header');
const $preloader = document.querySelector('.preloader');
const namespace = $wrapper.getAttribute('data-namespace');

const speed = 1; //animations
const after_load_delay = 1; //seconds
const youtubeApi = {state: false};


const App = {
  init: function() {
    if(namespace=='main') {
      Home.init();
    } else if(namespace=='category') {
      Category.init();
    }
    TouchHoverEvents.init();
    Video.init();
    scrollItemsEvents();
    inputs();
    onExitEvents();
  },
  onLoadEvents: function() {
    let fadInAnimation = gsap.timeline({paused:true})
      .to($wrapper, {autoAlpha:1, duration:speed, ease:'power2.inOut'});
      
    if(after_load_delay==0) {
      App.init();
      gsap.set($wrapper, {autoAlpha:1});
      if($preloader) $preloader.remove();
    } else {
      if($preloader) {
        console.log('__')
        let animation = gsap.timeline()
          .set($preloader, {css:{'transition':'none'}}, `+=${after_load_delay}`)
          .to($preloader, {autoAlpha:0, duration:speed, ease:'power2.inOut'})
        animation.eventCallback('onComplete', ()=>{
          App.init();
          $preloader.remove();
          fadInAnimation.play();
        })
      } 
      else {
        App.init();
        fadInAnimation.play();
      }
    }

  }
}

//hover/touch custom events
const TouchHoverEvents = {
  targets: 'a, button, label, tr, .jsTouchHover',
  touched: false,
  touchEndDelay: 100, //ms
  init: function() {
    document.addEventListener('touchstart',  (event)=>{this.events(event)});
    document.addEventListener('touchend',    (event)=>{this.events(event)});
    document.addEventListener('mouseenter',  (event)=>{this.events(event)},true);
    document.addEventListener('mouseleave',  (event)=>{this.events(event)},true);
    document.addEventListener('mousedown',   (event)=>{this.events(event)});
    document.addEventListener('mouseup',     (event)=>{this.events(event)});
    document.addEventListener('contextmenu', (event)=>{this.events(event)});
  },
  events: function(event) {
    let $targets = [];
    $targets[0] = event.target!==document?event.target.closest(this.targets):null;
    let $element = $targets[0], i = 0;

    while($targets[0]) {
      $element = $element.parentNode;
      if($element!==document) {
        if($element.matches(this.targets)) {
          i++;
          $targets[i] = $element;
        }
      } 
      else {
        break;
      }
    }

    //touchstart
    if(event.type=='touchstart') {
      this.touched = true;
      if(this.timeout) clearTimeout(this.timeout);
      if($targets[0]) {
        for(let $target of document.querySelectorAll(this.targets)) $target.classList.remove('touch');
        for(let $target of $targets) $target.classList.add('touch');
      }
    } 
    //touchend
    else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
      this.timeout = setTimeout(() => {this.touched = false}, 500);
      if($targets[0]) {
        setTimeout(()=>{
          for(let $target of $targets) {
            $target.dispatchEvent(new CustomEvent("customTouchend"));
            $target.classList.remove('touch');
          }
        }, this.touchEndDelay)
      }
    } 
    
    //mouseenter
    if(event.type=='mouseenter' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].classList.add('hover');
    }
    //mouseleave
    else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].classList.remove('hover', 'focus');
    }
    //mousedown
    if(event.type=='mousedown' && !this.touched && $targets[0]) {
      $targets[0].classList.add('focus');
    } 
    //mouseup
    else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
      $targets[0].classList.remove('focus');
    }
  }
}

const Home = {
  init: function() {
    let $homeitems = document.querySelectorAll('.home__item'),
        $line = document.querySelectorAll('.home__vertical-line'),
        $dots = document.querySelectorAll('.home-dots__link');

    $header.classList.add('header_type-home');

    gsap.timeline()
      .fromTo($homeitems, {y:50}, {y:0, duration:1.5, ease:'power2.out', stagger:{amount:0.5}})
      .fromTo($homeitems, {autoAlpha:0}, {autoAlpha:1, duration:1.5, ease:'power2.inOut', stagger:{amount:0.5}}, '-=2')
      .fromTo($dots, {x:20}, {x:0, duration:1.5, ease:'power2.out', stagger:{amount:0.5}}, '-=2')
      .fromTo($dots, {autoAlpha:0}, {autoAlpha:1, duration:1.5, ease:'power2.inOut', stagger:{amount:0.5}}, '-=2')

    OrganizationSlider.init();
    TeamSlider.init();
    ServicesCards.init();
    Dots.init();

    if(window.innerWidth>=brakepoints.md) {
      BgVideo.init();
    }

  }
}

const Category = {
  init: function() {
    let $items = document.querySelectorAll('.category-screen__item'),
        $bg = document.querySelector('.background-video');

    gsap.timeline()
      .fromTo($items, {y:50}, {y:0, duration:1.5, ease:'power2.out', stagger:{amount:0.5}})
      .fromTo($items, {autoAlpha:0}, {autoAlpha:1, duration:1.5, ease:'power2.inOut', stagger:{amount:0.5}}, '-=2')

    this.scroll = ()=> {
      let y = window.pageYOffset;
      gsap.set($bg, {y:y/3})
    }
    this.scroll();
    window.addEventListener('scroll', ()=>{
      this.scroll();
    });

    BgVideo.init();
    OrganizationSlider.init();
    TeamSlider.init();
    ServicesCards.init();
  }
}

const Header = {
  init: function() {
    this.isVisible = true;
    this.animation = gsap.timeline({paused:true})
      .to($header, {yPercent:-100, duration:speed/2, ease:'power2.in'})
    this.y = window.pageYOffset;

    window.addEventListener('scroll', ()=>{
      this.check();
    })

  },
  check: function() {
    let y = window.pageYOffset,
        h = $header.getBoundingClientRect().height;
    
    if(y>0 && !this.isBackground) {
      this.isBackground = true;
      $header.classList.add('header_bg');
    } else if(y==0 && this.isBackground) {
      this.isBackground = false;
      $header.classList.remove('header_bg');
    }

    //bottom
    if(y>this.y && y>window.innerHeight) {
      this.hide();
    } 
    //top
    else {
      this.show();
    }
    this.y = y;

  },
  hide: function() {
    if(this.isVisible) {
      this.isVisible=false;
      this.animation.play();
    }
  },
  show: function() {
    if(!this.isVisible) {
      this.isVisible=true;
      this.animation.reverse();
    }
  }
}

const Video = {
  init: function() {
    this.$openBtn = '[data-video]';
    this.$closeBtn = '[data-video-close]';
    this.initialized = false;
    //triggers click
    document.addEventListener('click', function(event){
      let $open = event.target.closest(Video.$openBtn),
          $close = event.target.closest(Video.$closeBtn);
      if($open!==null) {
        event.preventDefault();
        Video.href = $open.getAttribute('href');
        let array = Video.href.split('/');
        Video.id = array[array.length-1];
        Video.openModal();
      } else if($close!==null) {
        Video.closeModal();
      }
    })
  },
  setVideoSize: function(callback) {
    let style = window.getComputedStyle(Video.$modal),
        pt = parseFloat(style.getPropertyValue("padding-top")),
        pb = parseFloat(style.getPropertyValue("padding-bottom")),
        pl = parseFloat(style.getPropertyValue("padding-left")),
        pr = parseFloat(style.getPropertyValue("padding-right")),
        h = Video.$modal.getBoundingClientRect().height - pt - pb,
        w = Video.$modal.getBoundingClientRect().width - pl - pr;

    if(w/h > 16/9) {
      Video.$container.style.height = `${h}px`;
      Video.$container.style.width = `${h*1.77}px`;
    } else {
      Video.$container.style.height = `${w*0.5625}px`;
      Video.$container.style.width = `${w}px`;
    }

    typeof callback === 'function' && callback()
  },
  openModal: function() {
    Video.initialized = true;
    //create modal
    $wrapper.insertAdjacentHTML('beforeEnd', `<div class="modal video-modal"><a href="javascript:void(0);" data-video-close data-cursor="white" class="modal__overlay"></a><div class="modal-close" href="javascript:void(0);"><span></span><span></span></div><div class="modal__video"><div id="video-player"></div></div></div>`);
    Video.$modal = document.querySelector('.video-modal');
    Video.$close = Video.$modal.querySelector('[data-video-close]');
    Video.$container = Video.$modal.querySelector('.modal__video');

    window.addEventListener('resize', Video.setVideoSize);
    Video.setVideoSize(()=>{
      Video.animation = gsap.timeline()
        .fromTo(Video.$modal, {autoAlpha:0}, {duration:0.5, autoAlpha:1, ease:'power2.inOut'})
        .fromTo(Video.$container, {yPercent:20}, {duration:1, yPercent:0, ease:'power2.out'}, '-=0.5')
    })

    if(!youtubeApi.state) {
      youtubeApi.state = true;
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.insertAdjacentElement('beforeEnd', tag);
      window.onYouTubeIframeAPIReady=()=>{
        this.initPlayer();
      };
    } else {
      this.initPlayer();
    }
  },
  closeModal: function() {
    Video.initialized = false;
    window.removeEventListener('resize', Video.setVideoSize);
    Video.animation = gsap.timeline()
      .to(Video.$modal, {duration:0.5, autoAlpha:0, ease:'power2.in'})
      .to(Video.$container, {duration:0.5, yPercent:20, ease:'power2.in'}, '-=0.5')
    Video.animation.eventCallback('onComplete',()=>{
      Video.$modal.remove();
    })
  },
  initPlayer: function() {
    Video.player = new YT.Player('video-player', {
      videoId: Video.id,
      events: {
        'onReady': function(event) {
          event.target.playVideo();
          document.querySelector('#video-player').classList.add('ready');
        }
      }
    });
  }
}

const OrganizationSlider = {
  init: function() {
    let $items = document.querySelectorAll('.organization-block__item'),
        $images = document.querySelectorAll('.organization-block__image'),
        $titles = document.querySelectorAll('.organization-block__item-title'),
        $loader = document.querySelector('.organization-block__loader path'),
        loader_width = $loader.getTotalLength(),
        index = 0,
        slides_count = $items.length,
        index_old,
        interval = 10, //seconds
        animations = [];

    //autoslide

    let intervalAnimation = gsap.timeline({paused:true, onComplete:()=>{
        index++;
        if(index>slides_count-1) {
          index = 0;
        }
        check();
      }})
        .set($loader, {css:{'stroke-dasharray':loader_width}})
        .fromTo($loader, {autoAlpha:0}, {autoAlpha:1, duration:0.5, ease:'power2.inOut'})
        .fromTo($loader, {css:{'stroke-dashoffset':loader_width}}, {duration:interval, css:{'stroke-dashoffset':0}, ease:'linear'}, '-=0.5')

    let hideAnimation = gsap.fromTo($loader, {autoAlpha:1}, {autoAlpha:0, duration:0.5, ease:'power2.inOut', onComplete:()=>{
          intervalAnimation.duration(interval-0.5).play(0);
        }});


    $items.forEach(($item, index)=>{
      let $container = $item.querySelector('.organization-block__item-content'),
          $text = $item.querySelector('.organization-block__item-text'),
          $title = $titles[index],
          $image = $images[index],
          h = $text.getBoundingClientRect().height,
          w_var = window.innerWidth<brakepoints.sm ? -12.5 : 0;

      animations[index] = gsap.timeline({paused:true})
        .fromTo($container, {css:{height:0}}, {css:{height:h}, duration:1, ease:'power2.inOut'})
        .fromTo($text, {autoAlpha:0}, {autoAlpha:1, duration:1, ease:'power2.inOut'}, '-=1')
        .fromTo($title, {scale:0.75, xPercent:w_var}, {xPercent:0, scale:1, duration:1, ease:'power2.inOut'}, '-=1')
        //image
        .fromTo($image, {autoAlpha:0}, {autoAlpha:1, duration:1, ease:'power2.inOut'}, '-=1')
        .fromTo($image, {scale:0.5}, {scale:1, duration:1, ease:'power2.out'}, '-=1')
    })

    let check = ()=> {
      if(index_old!==undefined) {
        animations[index_old].reverse();
        $items[index_old].classList.remove('active');
        hideAnimation.play(0);
      } else {
        intervalAnimation.play(0);
      }

      animations[index].play(0);
      $items[index].classList.add('active');
      index_old = index;
    }
    check();

    $titles.forEach(($title, i)=>{
      $title.addEventListener('click', ()=>{
        index = i;
        check();
      })
    })
  }
}
const TeamSlider = {
  init: function() {
    let $images = document.querySelectorAll('.team-slider__image'),
        $items = document.querySelectorAll('.team-slider__info'),
        $numbers = document.querySelectorAll('.team-slider__button-index'),
        $loader = document.querySelector('.team-slider__loader-item'),
        $next = document.querySelector('.team-slider__button'),
        index = 0,
        slides_count = $images.length,
        index_old,
        interval = 10, //seconds
        animations = [];


    //autoslide
    let intervalAnimation = gsap.timeline({paused:true, onComplete:()=>{
      index++;
      if(index>slides_count-1) {
        index = 0;
      }
      check();
    }})
      .fromTo($loader, {autoAlpha:0}, {autoAlpha:1, duration:0.5, ease:'power2.inOut'})
      .fromTo($loader, {scaleX:0, xPercent:-50}, {duration:interval, scaleX:1, xPercent:0, ease:'linear'}, '-=0.5')

    let hideAnimation = gsap.fromTo($loader, {autoAlpha:1}, {autoAlpha:0, duration:0.5, ease:'power2.inOut', onComplete:()=>{
          intervalAnimation.duration(interval-0.5).play(0);
        }});

    $images.forEach(($image, index)=>{
      let $item = $items[index],
          $number = $numbers[index];
      animations[index] = gsap.timeline({paused:true})
        .fromTo([$image, $item, $number], {autoAlpha:0}, {autoAlpha:1, duration:1, ease:'power2.inOut'})
        .fromTo($image, {scale:1.25}, {scale:1, duration:1, ease:'power2.out'}, '-=1')
    })

    $next.addEventListener('click', ()=>{
      index++;
      if(index>slides_count-1) {
        index = 0;
      }
      check();
    })

    let check = ()=> {
      if(index_old!==undefined) {
        animations[index_old].reverse();
        hideAnimation.play(0);
      } else {
        intervalAnimation.play(0);
      }
      animations[index].play(0);
      index_old = index;
    }
    check();
  }
}
const ServicesCards = {
  init: function() {
    let $blocks = document.querySelectorAll('.services-block'),
        animations = [],
        oldIndex = false;

    $blocks.forEach(($block, index)=>{
      let $button = $block.querySelector('.services-block__container'),
          $front =  $block.querySelector('.services-block__front'),
          $back =   $block.querySelector('.services-block__back'),
          $content = $block.querySelector('.services-block__back-content'),
          $close = $block.querySelector('.services-block__close');

      let w1 = $button.getBoundingClientRect().width,
          w2 = $back.getBoundingClientRect().width,
          scale = w1/w2,
          offsetX = -50,
          offsetY = -50,
          offset = -50;

      if(window.innerWidth<brakepoints.md) {
        offset = 0;
        if(index==0) {
          offsetX = -((1-scale)/2)*100;
          offsetY = -((1-scale)/2)*100;
        } else if(index==1) {
          offsetX = ((1-scale)/2)*100;
          offsetY = -((1-scale)/2)*100;
        } else if(index==2) {
          offsetX = -((1-scale)/2)*100;
          offsetY = ((1-scale)/2)*100;
        } else {
          offsetX = ((1-scale)/2)*100;
          offsetY = ((1-scale)/2)*100;
        }
        
      }
      

      animations[index] = gsap.timeline({paused:true})
        .set($back, {scale:scale, yPercent:offsetY, xPercent:offsetX})
        .to($front, {autoAlpha:0, duration:0.33, ease:'power2.inOut',
          onComplete:()=>{
            $block.classList.add('active');
          }})
        .to($back, {scale:1, yPercent:offset, xPercent:offset, duration:0.66, ease:'power2.inOut'
        })
        .fromTo($content, {autoAlpha:0}, {autoAlpha:1, duration:0.66, ease:'power2.inOut',
          onReverseComplete:()=>{
            $block.classList.remove('active');
          }
        }, '-=0.66')


      $button.addEventListener('mouseenter', (event)=>{check(event)})
      $button.addEventListener('mouseleave', (event)=>{check(event)})
      let check = (event)=> {
        if(!TouchHoverEvents.touched) {
          if(event.type=='mouseenter') {
            console.log('play')
            animations[index].play();
            oldIndex = index;
          } else {
            animations[index].reverse();
            oldIndex = false;
          }
        } 
      }

      $front.addEventListener('click', ()=>{
        if(TouchHoverEvents.touched) {
          if(oldIndex!==false) {
            animations[oldIndex].reverse();
            animations[index].eventCallback('onReverseComplete', ()=>{
              gsap.set($close, {autoAlpha:0})
            })
          }
          gsap.set($close, {autoAlpha:1})
          animations[index].play();
          oldIndex = index;
        }
      })
      $close.addEventListener('click', ()=>{
        animations[index].reverse();
        animations[index].eventCallback('onReverseComplete', ()=>{
          gsap.set($close, {autoAlpha:0})
        })
        oldIndex = false;
      })

    })
  }
}

const Dots = {
  init: function() {
    let $buttons = document.querySelectorAll('.home-dots__link'),
        $sections = document.querySelectorAll('[data-scroll-block]'),
        $dark_sections = document.querySelectorAll('[data-dark]'),
        inscroll = false,
        animation,
        $oldLink = false;

    //click
    $buttons.forEach(($this)=>{
      $this.addEventListener('click', (event)=>{
        event.preventDefault();
        let $block = document.querySelector(`${$this.getAttribute('href')}`);
        if($block) {
          inscroll = true;
          if($oldLink) $oldLink.classList.remove('active');
          $this.classList.add('active');
          $oldLink = $this;
          if(animation!==undefined) {
            animation.pause();
          }
          animation = gsap.to(window, {duration: 1, scrollTo:{y:$block}, ease:'power2.inOut', onComplete: function() {
            inscroll = false;
          }});
        }
      })
    })

    let check = ()=> {
      let position = window.pageYOffset,
          y = position + window.innerHeight/2,
          $active = false;

      if(!inscroll) {

        $sections.forEach(($section, index)=>{
          let top = $section.getBoundingClientRect().y + position,
              bottom = top + $section.getBoundingClientRect().height;
          
          if (y >= top && y <= bottom) {
            
            $buttons.forEach(($button)=>{
              let attr = $button.getAttribute('href'),
                  id = '#'+$section.getAttribute('id');
              if(attr==id) {
                $active = $button;
                console.log('++')
              }
            })
          } 
        })
        
        if($active && $active!==$oldLink) {
          if($oldLink) $oldLink.classList.remove('active');
          $active.classList.add('active');
          $oldLink = $active;
        } else if(!$active) {
          if($oldLink) $oldLink.classList.remove('active');
          $oldLink = false;
        }
      }

      let $dots = document.querySelectorAll('.home-dots__link');
      $dots.forEach(($dot, index)=>{
        let y = $dot.getBoundingClientRect().top, 
            h = $dot.getBoundingClientRect().height/2,
            pos = y+h;

        let flag = false;

        for(let index = 0; index<$dark_sections.length; index++) {
          let h = $dark_sections[index].getBoundingClientRect().height,
              top = $dark_sections[index].getBoundingClientRect().y,
              bottom = $dark_sections[index].getBoundingClientRect().y + h;
          
          if(pos>top && pos<bottom) {
            flag = true;
          }
        }

        if(!$dot.classList.contains('reversed') && flag) {
          $dot.classList.add('reversed');
        } else if(!flag) {
          $dot.classList.remove('reversed');
        }
        
      })

    }

    check();
    window.addEventListener('scroll', ()=>{
      check();
    })
  }
}

function scrollItemsEvents() {
  let check = ()=>{
    let $items = document.querySelectorAll('.js-scroll-animated'),
        position = window.pageYOffset;

    $items.forEach(($item)=>{
      let top = $item.getBoundingClientRect().y + position - window.innerHeight;
      if(position>top && !$item.classList.contains('animated')) {
        $item.classList.add('animated');
      }
    })
    
  }
  check();
  window.addEventListener('scroll', ()=>{
    check();
  })
}

window.BgVideo = {
  init: function() {
    this.$wrapper = document.querySelector('.background-video');
    this.$video = document.querySelector('.background-video__wrap');
    this.id = this.$wrapper.getAttribute('data-video-id');
    this.loaded = false;
    this.before_end_delay = 8;

    this.fadeIn = gsap.timeline({paused:true})
      .fromTo(this.$video, {autoAlpha:0}, {autoAlpha:1, duration:speed*2, ease:'power2.inOut'})

    if(namespace=='main') {
      this.$loader = document.querySelector('.home-logo__circle path');
      this.loader_width = this.$loader.getTotalLength();
      this.startLoaderAnimation = gsap.timeline()
        .set(this.$loader, {css:{'stroke-dasharray':this.loader_width}})
        .fromTo(this.$loader, {css:{'stroke-dashoffset':this.loader_width}}, {duration:10, css:{'stroke-dashoffset':this.loader_width/2}, ease:'expo.out'})
    }

    if(!youtubeApi.state) {
      youtubeApi.state = true;
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.insertAdjacentElement('beforeEnd', tag);
      window.onYouTubeIframeAPIReady=()=>{
        this.initPlayer();
      };
    } else {
      this.initPlayer();
    }

    this.resize();
    window.addEventListener('resize', ()=>{this.resize()})
  },
  resize: function() {
    let h = this.$wrapper.getBoundingClientRect().height,
        w = this.$wrapper.getBoundingClientRect().width,
        value = h/w,
        ratio = 0.5625;

    if(value<ratio) {
      this.$video.style.width = `${w}px`;
      this.$video.style.height = `${w*ratio+200}px`;
    } else {
      this.$video.style.height = `${h+200}px`;
      this.$video.style.width = `${h/ratio}px`;
    }
    
  },
  initPlayer: function() {
    this.player = new YT.Player('bg-player', {
      videoId: this.id,
      playerVars: {
        'controls': 0,
        'disablekb': 1,
        'showinfo': 0,
        'rel': 0, 
        'enablejsapi':1
      },
      events : {
     	 	'onReady':       (event)=>{this.playerReady(event)},
        'onStateChange': (event)=>{this.playerStateChange(event)}
      }
  	});
  },
  playerReady: function(event) {
    this.duration = this.player.getDuration() - this.before_end_delay;
    this.delay = 0;
    //main
    if(namespace=='main') {
      this.delay=speed*1.5;
      this.startLoaderAnimation.pause();
      gsap.timeline()
        .to(this.$loader, {duration:this.delay, css:{'stroke-dashoffset':0}, ease:'power1.inOut'})
        .to(this.$loader, {duration:this.delay/2, autoAlpha:0, ease:'power1.inOut'}, `-=${this.delay/2}`)

      this.animationTimeline = gsap.timeline({paused:true})
        .fromTo(this.$loader, {autoAlpha:0}, {immediateRender:false, autoAlpha:1, duration:speed, ease:'power2.inOut'})
        .fromTo(this.$loader, {css:{'stroke-dashoffset':this.loader_width}}, {immediateRender:false, duration:this.duration, css:{'stroke-dashoffset':0}, ease:'linear'}, `-=${speed}`)
        .to(this.$loader, {autoAlpha:0, duration:speed, ease:'power2.in'}, `-=${speed}`)
    }

    setTimeout(()=>{
      this.player.playVideo();
      this.player.mute();
      event.target.setPlaybackQuality('hd720');

      let checkToPause = ()=>{
        let position = this.$video.getBoundingClientRect().y + this.$video.getBoundingClientRect().height;
        if((position<=0 || document.visibilityState=='hidden') && !this.flag) {
          this.flag = true;
          this.player.pauseVideo();
          console.log('pause')
        } else if(position>0 && document.visibilityState=='visible' && this.flag) {
          this.flag = false;
          this.player.playVideo();
          console.log('play')
        }
      }
      checkToPause();
      window.addEventListener('scroll', ()=>{
        checkToPause();
      })
      document.addEventListener("visibilitychange", function() {
        checkToPause();
      });

      setInterval(()=>{
        if(this.player.getCurrentTime() >= this.duration) {
          this.fadeIn.reverse();
          //restart video
          this.fadeIn.eventCallback('onReverseComplete', ()=>{
            this.player.pauseVideo();
            this.player.seekTo(0);
            this.player.playVideo();
          })
        }
      }, 100)
    }, this.delay*1000)
  },
  playerStateChange: function(event) {
    if(event.data === YT.PlayerState.BUFFERING) {
      if(namespace=='main') {
        this.animationTimeline.pause();
      }
    } 
    else if(event.data === YT.PlayerState.PAUSED) {
      if(namespace=='main') {
        this.animationTimeline.pause();
      }
    }
    else if(event.data === YT.PlayerState.PLAYING) {
      if(this.fadeIn.progress()==0) {
        this.fadeIn.play();
      }
      //main
      if(namespace=='main') {
        this.animationTimeline.play(this.player.getCurrentTime());
      }
    }
  }
}



function inputs() {
  let mask = Inputmask({
      mask: "+7 999 999-9999",
      showMaskOnHover: false,
      clearIncomplete: false
    }).mask('[data-mask]');

  let $inputs = document.querySelectorAll('input, textarea');

  $inputs.forEach(($input)=>{

    $input.addEventListener('focus', ()=>{
      $input.parentNode.classList.add('focused');
    })

    $input.addEventListener('blur', ()=>{
      let value = $input.value;
      if(validate.single(value, {presence: {allowEmpty: false}})!==undefined) {
        $input.value = '';
        $input.parentNode.classList.remove('focused');
      }
    })

  })
  
}

function onExitEvents() {
  document.addEventListener('click',  (event)=>{
    let $link = event.target!==document?event.target.closest('a'):false;
    if($link) {
      let href = $link.getAttribute('href'),
          split = href.split('/')[0];
      if(split=='.' || split=='/') {
        event.preventDefault();
        gsap.timeline({
          onComplete:function(){
            document.location.href = href;
          }
        })
        .set($wrapper, {css:{'pointer-events':'none'}})
        .to($wrapper, {duration:speed/2, autoAlpha:0, ease:'power2.in'})
      }
    }
  });
}