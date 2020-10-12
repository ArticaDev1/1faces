//lazylaod
import 'lazysizes';
document.addEventListener('lazybeforeunveil', function(e){
  let el = e.target.tagName,
      bg = e.target.getAttribute('data-src');
  if(el!=='IMG') {
    let bg = e.target.getAttribute('data-src');
    e.target.style.backgroundImage = 'url(' + bg + ')';
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
  preloader();
}

const brakepoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440
}
const $wrapper = document.querySelector('.wrapper');
const $header = document.querySelector('.header');

const speed = 1; //animations
const preloader_delay = 1; //seconds
const youtubeApi = {state: false};


const app = {
  init: function() {
    //home
    Home.init();

    inputs();
    TouchHoverEvents.init();
    Video.init();
    scrollItemsEvents();
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

    gsap.timeline()
      .fromTo($homeitems, {y:50}, {y:0, duration:1.5, ease:'power2.out', stagger:{amount:0.5}})
      .fromTo($homeitems, {autoAlpha:0}, {autoAlpha:1, duration:1.5, ease:'power2.inOut', stagger:{amount:0.5}}, '-=2')
      .fromTo($dots, {x:20}, {x:0, duration:1.5, ease:'power2.out', stagger:{amount:0.5}}, '-=2')
      .fromTo($dots, {autoAlpha:0}, {autoAlpha:1, duration:1.5, ease:'power2.inOut', stagger:{amount:0.5}}, '-=2')
      .fromTo($line, {yPercent:-100}, {yPercent:0, duration:2, ease:'power2.inOut'}, '-=1.5')


    this.dots();
    this.organization();
    this.team();
    this.services();
    if(window.innerWidth>=brakepoints.md) {
      bgVideo.init();
    }

  },
  dots: function() {
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
          $active = false;

      if(!inscroll) {

        $sections.forEach(($section)=>{
          let top = $section.getBoundingClientRect().y + position,
              bottom = top + $section.getBoundingClientRect().height;

          if (position >= top && position <= bottom) {
            
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

  },
  organization: function() {
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

  },
  services: function() {
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
            animations[index].timeScale(1).play();
            oldIndex = index;
          } else {
            animations[index].timeScale(1.5).reverse();
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

  },
  team: function() {
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

window.bgVideo = {
  init: function() {
    this.wrapper = document.querySelector('.home-background-video');
    this.video = document.querySelector('.home-background-video__wrap');
    this.loaded = false;
    this.$loader = document.querySelector('.home-logo__circle path');
    this.loader_width = this.$loader.getTotalLength();

    //Дождаться пока затухнут лишние компоненты ютуб плеера
    this.after_load_delay = 2.7; //seconds 

    //animations
    this.animation_loaderStart = gsap.timeline({paused:true})
      .set(this.$loader, {css:{'stroke-dasharray':this.loader_width}})
      .fromTo(this.$loader, {css:{'stroke-dashoffset':this.loader_width}}, {duration:10, css:{'stroke-dashoffset':this.loader_width/2}, ease:'expo.out'})
    
    this.animation_loaderFinish = gsap.timeline({paused:true, 
      onStart:()=>{
        this.animation_loaderStart.pause();
      },
      onComplete:()=>{
        this.animation_timeline = gsap.timeline({paused:true})
          .fromTo([this.$loader, this.video], {autoAlpha:0}, {autoAlpha:1, duration:1, ease:'power2.inOut'})
          .fromTo(this.$loader, {css:{'stroke-dashoffset':this.loader_width}}, {duration:this.player.getDuration(), css:{'stroke-dashoffset':0}, ease:'linear'}, '-=1')
          .to(this.video, {autoAlpha:0, duration:4, ease:'power2.in'}, '-=4')
          .to(this.$loader, {autoAlpha:0, duration:2, ease:'power2.in'}, '-=2')
        
        this.animation_timeline.duration(this.player.getDuration()-this.player.getCurrentTime()).play();
      }
      })
      .to(this.$loader, {duration:this.after_load_delay, css:{'stroke-dashoffset':0}, ease:'power1.inOut'})
      .to(this.$loader, {duration:1, autoAlpha:0, ease:'power1.inOut'}, '-=1')

      
    this.resize();
    window.addEventListener('resize', ()=>{this.resize()})
    this.animation_loaderStart.play();

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
  resize: function() {
    let h = this.wrapper.getBoundingClientRect().height,
        w = this.wrapper.getBoundingClientRect().width,
        value = h/w,
        ratio = 0.5625;

    if(value<ratio) {
      this.video.style.width = `${w}px`;
      this.video.style.height = `${w*ratio}px`;
    } else {
      this.video.style.height = `${h}px`;
      this.video.style.width = `${h/ratio}px`;
    }
    
  },
  initPlayer: function() {
    this.player = new YT.Player('bg-player', {
      videoId: '0zxNqsKiQxE',
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
    this.player.playVideo();
    this.player.mute();
    event.target.setPlaybackQuality('hd720');

    let checkVisible = ()=>{
      let position = this.video.getBoundingClientRect().y + this.video.getBoundingClientRect().height;
      if(position<=0 && !this.flag) {
        this.flag = true;
        this.player.pauseVideo();
      } else if(position>0 && this.flag) {
        this.flag = false;
        this.player.playVideo();
      }
    }
    checkVisible();
    window.addEventListener('scroll', ()=>{
      checkVisible();
    })

  },
  playerStateChange: function(event) {
    if (event.data === YT.PlayerState.ENDED) {
      if(this.animation_timeline) this.animation_timeline.pause();
      gsap.set(this.$loader, {css:{opacity:'0'}});
      this.player.playVideo();
    } 
    else if(event.data === YT.PlayerState.BUFFERING) {
      if(this.animation_timeline) this.animation_timeline.pause();
      event.target.setPlaybackQuality('hd720');
    } 
    else if(event.data === YT.PlayerState.PAUSED) {
      if(this.animation_timeline) this.animation_timeline.pause();
    }
    else if(event.data === YT.PlayerState.PLAYING) {
      if(!this.visible) {
        this.visible = true;
        this.animation_loaderFinish.play();
      } else {
        this.animation_timeline.duration(this.player.getDuration()).play(this.player.getCurrentTime());
      }
    }
  }
}
function preloader() {
  let $preloader = document.querySelector('.preloader')

  if(preloader_delay==0) {
    app.init();
    $preloader.remove();
    gsap.set($wrapper, {autoAlpha:1});
  } 
  else {
    gsap.timeline({onComplete:()=>{
      app.init();
      $preloader.remove();
      gsap.to($wrapper, {autoAlpha:1, duration:1, ease:'power2.inOut'})
    }})
      .to($preloader, {autoAlpha:0, duration:1, ease:'power2.inOut'}, `+=${preloader_delay}`)
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