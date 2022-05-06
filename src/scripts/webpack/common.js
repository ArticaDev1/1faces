//lazylaod
import 'lazysizes';
lazySizes.cfg.preloadAfterLoad = true;
document.addEventListener('lazyloaded', function(e){
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
//
import Splide from '@splidejs/splide';
import SwipeListener from 'swipe-listener';
//
import { disablePageScroll, enablePageScroll } from 'scroll-lock';


const Breakpoints = {
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

const speed = 0.5; //animations
const dev = false;
const youtubeApi = {state: false};
const interval = 5; //autoslide duration

window.onload = function(){
  App.init();
}

const App = {
  init: function() {
    //components
    Dots.init();
    BackgroundVideo.init();
    Cases.init();
    OrganizationSlider.init();
    TeamSlider.init();
    Gallery.init();
    ServicesCards.init();
    TouchHoverEvents.init();
    Nav.init();
    Header.init();
    Modal.init();
    Parralax.init();
    Validation.init();
    //functions
    scrollItemsEvents();
    inputs();
    onExitEvents();
    hiddenText();
    //finish
    this.finish();   
  },
  finish: function() {
    let anim = gsap.timeline({paused:true})
      .to($wrapper, {autoAlpha:1, duration:speed, ease:'power2.inOut'});
    if(dev) {
      anim.seek(speed);
      if($preloader) $preloader.remove();
    } else {
      if($preloader) {
        gsap.timeline()
          .set($preloader, {css:{'transition':'none'}}, `+=${speed}`)
          .to($preloader, {autoAlpha:0, duration:speed, ease:'power2.out', onComplete:()=>{
            $preloader.remove();
            anim.play();
            this.animatePage();
          }})
      } else {
        setTimeout(()=>{
          anim.play();
          this.animatePage();
        }, speed*500)
      }
    }
  },
  animatePage: function() {
    if(namespace=='home') {
      let $items = document.querySelectorAll('.home__item'),
          $dots = document.querySelectorAll('.home-dots__link');
      gsap.timeline()
        .fromTo($items, {y:50}, {y:0, duration:speed*1.5, ease:'power2.out', stagger:{amount:speed*0.5}})
        .fromTo($items, {autoAlpha:0}, {autoAlpha:1, duration:speed*1.5, ease:'power2.inOut', stagger:{amount:speed*0.5}}, `-=${speed*2}`)
        .fromTo($dots, {x:20}, {x:0, duration:speed*1.5, ease:'power2.out', stagger:{amount:speed*0.5}}, '-=2')
        .fromTo($dots, {autoAlpha:0}, {autoAlpha:1, duration:speed*1.5, ease:'power2.inOut', stagger:{amount:speed*0.5}}, `-=${speed*2}`)
    } 
    else if(namespace=='category' || namespace=='case') {
      let $items = document.querySelectorAll('.template-screen__item'),
          $image = document.querySelector('.background-video__background');
      gsap.timeline()
        .fromTo($items, {y:50}, {y:0, duration:speed*1.5, ease:'power2.out', stagger:{amount:speed*0.5}})
        .fromTo($items, {autoAlpha:0}, {autoAlpha:1, duration:speed*1.5, ease:'power2.inOut', stagger:{amount:speed*0.5}}, `-=${speed*2}`)
        .fromTo($image, {scale:1.25}, {scale:1, duration:speed*2, ease:'power2.out'}, `-=${speed*2}`)
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

const Gallery = {
  init: function() {
    this.$parent = document.querySelector('.gallery');
    if(this.$parent) {
      this.initEvent();
    }
  },
  initEvent: function() {
    this.$max_images = document.querySelectorAll('.gallery__max img');
    this.$min_images = document.querySelectorAll('.gallery__min img');
    this.$prev = document.querySelector('.gallery__prev');
    this.$next = document.querySelector('.gallery__next');
    this.$line = document.querySelector('.gallery__line span');
    this.$idx = document.querySelectorAll('.gallery__index span');
    this.in_animation = false;

    this.getAnimation = ($image1, $image2)=> {
      let val1 = 1/this.length*this.index,
          val2 = -(100-(100*val1))/2;
      gsap.to(this.$line, {scaleX:val1, xPercent:val2, duration:speed, ease:'power2.inOut'})
      gsap.set([$image1.parentNode, $image2.parentNode], {autoAlpha:1});

      //index
      if(this.indexAnimOld) {
        this.indexAnimOld.reverse();
      }
      this.indexAnim = gsap.timeline()
        .to(this.$idx[this.index], {autoAlpha:1, duration:speed, ease:'power2.inOut'})
      this.indexAnimOld = this.indexAnim;
      let animation;
      if(window.innerWidth>Breakpoints.lg) {
        animation = gsap.timeline({paused:true})
          .fromTo($image1.parentNode, {xPercent:0}, {xPercent:-100, duration:speed, ease:'power2.inOut'})
          .fromTo($image1, {xPercent:0}, {xPercent:50, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
          .fromTo($image2.parentNode, {xPercent:100}, {xPercent:0, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
          .fromTo($image2, {xPercent:-50}, {xPercent:0, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
      } else {
        animation = gsap.timeline({paused:true})
          .fromTo($image1.parentNode, {yPercent:0}, {yPercent:-100, duration:speed, ease:'power2.inOut'})
          .fromTo($image1, {yPercent:0}, {yPercent:50, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
          .fromTo($image2.parentNode, {yPercent:100}, {yPercent:0, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
          .fromTo($image2, {yPercent:-50}, {yPercent:0, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
      }
      return animation;
    }

    this.index = 0;
    this.length = this.$max_images.length-1;

    this.getNext = (index)=> {
      let val = index==this.length?0:index+1;
      return val;
    }
    this.getPrev = (index)=> {
      let val = index==0?this.length:index-1;
      return val;
    }
    this.next = ()=> {
      if(!this.in_animation) {
        this.in_animation = true;
        this.index = this.getNext(this.index);
        this.change('next');
      }
    }
    this.prev = ()=> {
      if(!this.in_animation) {
        this.in_animation = true;
        this.index = this.getPrev(this.index);
        this.change('prev');
      }
    }

    this.$prev.addEventListener('click', ()=>{
      this.prev();
    })
    this.$next.addEventListener('click', ()=>{
      this.next();
    })
    this.swipes = SwipeListener(this.$parent);
    this.$parent.addEventListener('swipe', (event)=> {
      let dir = event.detail.directions;
      if(dir.left) {
        this.next();
      } else if(dir.right) {
        this.prev();
      }
    });

    this.change('next');
  },
  change: function(direction) {
    //timer
    if(this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(()=>{
      this.next();
    }, interval*1000)
    
    if(direction=='next') {
      this.getAnimation(this.$max_images[this.getPrev(this.index)], this.$max_images[this.index]).play()
        .eventCallback('onComplete', ()=>{
          this.in_animation=false;
        });
      this.getAnimation(this.$min_images[this.index], this.$min_images[this.getNext(this.index)]).play();

    } 
    else if(direction=='prev') {
      this.getAnimation(this.$max_images[this.index], this.$max_images[this.getNext(this.index)]).reverse(0)
        .eventCallback('onReverseComplete', ()=>{
          this.in_animation=false;
        });
      this.getAnimation(this.$min_images[this.getNext(this.index)], this.$min_images[this.getNext(this.getNext(this.index))]).reverse(0);
    }
  }
}

const OrganizationSlider = {
  init: function() {
    this.$parent = document.querySelector('.organization-block');
    if(this.$parent) {
      this.initEvent();
    }
  },
  initEvent: function() {
    let $items = document.querySelectorAll('.organization-block__item'),
        $images = document.querySelectorAll('.organization-block__image'),
        $titles = document.querySelectorAll('.organization-block__item-title'),
        $loader = document.querySelector('.organization-block__loader path'),
        loader_width = $loader.getTotalLength(),
        index = 0,
        slides_count = $items.length,
        index_old,
        animations = [];

    let intervalAnimation = gsap.timeline({paused:true, onComplete:()=>{
      index++;
      if(index>slides_count-1) {
        index = 0;
      }
      check();
    }})
      .set($loader, {css:{'stroke-dasharray':loader_width}})
      .fromTo($loader, {autoAlpha:0}, {autoAlpha:1, duration:speed*0.5, ease:'power2.inOut'})
      .fromTo($loader, {css:{'stroke-dashoffset':loader_width}}, {duration:interval, css:{'stroke-dashoffset':0}, ease:'linear'}, `-=${speed*0.5}`)

    let hideAnimation = gsap.timeline({paused:true}).fromTo($loader, {autoAlpha:1}, {autoAlpha:0, duration:speed*0.5, ease:'power2.inOut', onComplete:()=>{
      intervalAnimation.duration(interval-speed*0.5).play(0);
    }});

    $items.forEach(($item, index)=>{
      let $container = $item.querySelector('.organization-block__item-content'),
          $text = $item.querySelector('.organization-block__item-text'),
          $title = $titles[index],
          $image = $images[index],
          h = $text.getBoundingClientRect().height,
          w_var = window.innerWidth<Breakpoints.sm ? -12.5 : 0;

      animations[index] = gsap.timeline({paused:true})
        .fromTo($container, {css:{height:0}}, {css:{height:h}, duration:speed, ease:'power2.inOut'})
        .fromTo($text, {autoAlpha:0}, {autoAlpha:speed, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
        .fromTo($title, {scale:0.75, xPercent:w_var}, {xPercent:0, scale:1, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
        //image
        .fromTo($image, {autoAlpha:0}, {autoAlpha:1, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
        .fromTo($image, {scale:0.5}, {scale:1, duration:speed, ease:'power2.out'}, `-=${speed}`)
    })

    let check = ()=> {
      if(index_old!==undefined) {
        animations[index_old].reverse();
        $items[index_old].classList.remove('active');
        hideAnimation.play(0);
      } else if(this.visibility) {
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

    let checkVisibilityEvent = ()=> {
      let h = this.$parent.getBoundingClientRect().height,
          y = this.$parent.getBoundingClientRect().top,
          v1 = window.innerHeight-y, 
          v2 = h+y;
      if(v1>0 && v2>0 && document.visibilityState=='visible' && !this.visibility) {
        this.visibility = true;
        if(intervalAnimation) {
          intervalAnimation.play();
        }
      } else if((v1<0 || v2<0 || document.visibilityState=='hidden') && this.visibility) {
        this.visibility = false;
        if(intervalAnimation) {
          intervalAnimation.pause();
        }
      }
    }
    checkVisibilityEvent();
    window.addEventListener('scroll', ()=>{checkVisibilityEvent()})
    document.removeEventListener("visibilitychange", ()=>{checkVisibilityEvent()})
  }

}

const TeamSlider = {
  init: function() {
    this.$parent = document.querySelector('.team-slider');
    if(this.$parent) {
      this.initEvent();
    }
  },
  initEvent: function() {
    this.$slides = document.querySelector('.team-slider__slides');
    let $images = document.querySelectorAll('.team-slider__image'),
        $items = document.querySelectorAll('.team-slider__info'),
        $numbers = document.querySelectorAll('.team-slider__button-index'),
        $loader = document.querySelector('.team-slider__loader-item'),
        $next = document.querySelector('.team-slider__button'),
        index = 0,
        slides_count = $images.length,
        index_old,
        animations = [];

    //autoslide
    let intervalAnimation = gsap.timeline({paused:true, onComplete:()=>{
      index++;
      if(index>slides_count-1) {
        index = 0;
      }
      check();
    }})
      .fromTo($loader, {autoAlpha:0}, {autoAlpha:1, duration:speed*0.5, ease:'power2.inOut'})
      .fromTo($loader, {scaleX:0, xPercent:-50}, {duration:interval, scaleX:1, xPercent:0, ease:'linear'}, `-=${speed*0.5}`)

    let hideAnimation = gsap.timeline({paused:true}).fromTo($loader, {autoAlpha:1}, {autoAlpha:0, duration:speed*0.5, ease:'power2.inOut', onComplete:()=>{
      intervalAnimation.duration(interval-speed*0.5).play(0);
    }});

    $images.forEach(($image, index)=>{
      let $item = $items[index],
          $number = $numbers[index];
      animations[index] = gsap.timeline({paused:true})
        .fromTo([$image, $item, $number], {autoAlpha:0}, {autoAlpha:1, duration:speed, ease:'power2.inOut'})
        .fromTo($image, {scale:1.25}, {scale:1, duration:speed, ease:'power2.out'}, `-=${speed}`)
    })

    let getNext = (idx)=> {
      let val = idx==slides_count-1?0:idx+1;
      return val;
    }
    let getPrev = (idx)=> {
      let val = idx==0?slides_count-1:idx-1;
      return val;
    }

    $next.addEventListener('click', ()=>{
      index = getNext(index);
      check();
    })

    this.swipes = SwipeListener(this.$slides);
    this.$slides.addEventListener('swipe', (event)=> {
      let dir = event.detail.directions;
      if(dir.left) {
        index = getNext(index);
        check();
      } else if(dir.right) {
        index = getPrev(index);
        check();
      }
    });

    let check = ()=> {
      if(index_old!==undefined) {
        animations[index_old].reverse();
        hideAnimation.play(0);
      } else if(this.visibility) {
        intervalAnimation.play(0);
      }
      animations[index].play(0);
      index_old = index;
    }
    check();

    let checkVisibilityEvent = ()=> {
      let h = this.$parent.getBoundingClientRect().height,
          y = this.$parent.getBoundingClientRect().top,
          v1 = window.innerHeight-y, 
          v2 = h+y;
      if(v1>0 && v2>0 && document.visibilityState=='visible' && !this.visibility) {
        this.visibility = true;
        if(intervalAnimation) {
          intervalAnimation.play();
        }
      } else if((v1<0 || v2<0 || document.visibilityState=='hidden') && this.visibility) {
        this.visibility = false;
        if(intervalAnimation) {
          intervalAnimation.pause();
        }
      }
    }
    checkVisibilityEvent();
    window.addEventListener('scroll', ()=>{checkVisibilityEvent()})
    document.removeEventListener("visibilitychange", ()=>{checkVisibilityEvent()})
  }
}

const ServicesCards = {
  init: function() {
    this.$parent = document.querySelector('.services');
    if(this.$parent) {
      this.initEvent();
    }
  },
  initEvent: function() {
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

      if(window.innerWidth<Breakpoints.md) {
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
        .to($front, {autoAlpha:0, duration:speed*0.5, ease:'power2.inOut',
          onComplete:()=>{
            $block.classList.add('active');
          }})
        .to($back, {scale:1, yPercent:offset, xPercent:offset, duration:speed*0.7, ease:'power2.inOut'
        })
        .fromTo($content, {autoAlpha:0}, {autoAlpha:1, duration:speed*0.7, ease:'power2.inOut',
          onReverseComplete:()=>{
            $block.classList.remove('active');
          }
        }, `-=${speed*0.7}`)


      $button.addEventListener('mouseenter', (event)=>{check(event)})
      $button.addEventListener('mouseleave', (event)=>{check(event)})
      let check = (event)=> {
        if(!TouchHoverEvents.touched) {
          if(event.type=='mouseenter') {
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

const Cases = {
  init: function() {
    this.$parent = document.querySelector('.cases-slider');
    if(this.$parent) {
      this.initEvent();
    }
  },
  initEvent: function() {
    this.$parent = document.querySelector('.cases-slider__slides');
    let $slides = document.querySelectorAll('.cases-slider__slide'),
        $next = document.querySelector('.cases-slider__next'),
        $prev = document.querySelector('.cases-slider__prev'),
        slide_current = 0,
        slide_old,
        inAnimation = false,
        animations = [];
    
    $slides.forEach(($this, index)=>{
      let $img = $this.querySelector('.image'),
          $title = $this.querySelector('.cases-slider__slide-title'),
          $date = $this.querySelector('.cases-slider__slide-date');

      animations[index] = gsap.timeline({paused:true})
        .fromTo($this, {autoAlpha:0}, {autoAlpha:1, duration:speed, ease:'power2.inOut'})
        .fromTo($img, {scale:1.25}, {scale:1, duration:speed, ease:'power2.out'}, `-=${speed}`)
        .fromTo([$title, $date], {x:50}, {x:0, duration:speed*0.8, ease:'power2.out', stagger:{amount:speed*0.2}}, `-=${speed}`)
    })

    let slider = new Splide('.splide', {
      type: 'loop',
      perPage: 3,
      arrows: false,
      pagination: false,
      easing: 'ease-in-out',
      speed: speed*1000,
      autoplay: true,
      perMove: 1,
      interval: interval*1000,
      breakpoints: {
        1023: {
          perPage: 2
        }
      }
    }).mount();

    slider.on('move', function(newIndex) {
      slide_current=newIndex-1<0?slider.length-1:newIndex-1;
      inAnimation = true;
      if(slide_old!==undefined) {
        animations[slide_old].reverse();
      } 
      animations[slide_current].play();
      slide_old=slide_current;
    });

    slider.on('moved', function() {
      inAnimation = false;
    });

    slider.go('+1', false);

    this.swipes = SwipeListener(this.$parent);
    this.$parent.addEventListener('swipe', (event)=> {
      let dir = event.detail.directions;
      if(dir.left) {
        if(!inAnimation) slider.go('+1', false)
      } else if(dir.right) {
        if(!inAnimation) slider.go('-1', false)
      }
    });

    /* document.addEventListener('click', (event)=>{
      let $target = event.target!==document?event.target.closest('.cases-slider__nav-slide-container'):false,
          slide_index,
          next_index;

      if($target && !inAnimation) {
        document.querySelectorAll('.cases-slider__nav-slide-container').forEach(($this, index)=>{
          if($this.parentNode.classList.contains('is-active')) {
            slide_index = index;
          }
          if($this==$target) {
            next_index = index;
          }
        })
        let value = next_index-slide_index+1;
        slider.go(`+${value}`, false)
      }
    }) */

    $next.addEventListener('click', ()=>{
      if(!inAnimation) slider.go('+1', false)
    })
    $prev.addEventListener('click', ()=>{
      if(!inAnimation) slider.go('-1', false)
    })
  }
}

const Dots = {
  init: function() {
    this.$parent = document.querySelector('.home-dots');
    if(this.$parent) {
      this.initEvent();
    }
  },
  initEvent: function() {
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
          animation = gsap.to(window, {duration:speed, scrollTo:{y:$block}, ease:'power2.inOut', onComplete: function() {
            inscroll = false;
          }});
        }
      })
    })

    let check = ()=> {
      if(window.innerWidth > Breakpoints.lg) {
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
    }

    check();
    window.addEventListener('scroll', ()=>{
      check();
    })
    window.addEventListener('resize', ()=>{
      check();
    })
  }
}

const BackgroundVideo = {
  init: function() {
    this.$parent = document.querySelector('.background-video');
    if(this.$parent && device.desktop() && window.innerWidth>Breakpoints.lg) {
      this.initEvent();
      console.log('init');
    }
  },
  initEvent: function() {
    let array = this.$parent.getAttribute('data-video').split('/');
    this.$video = document.querySelector('.background-video__wrap');
    this.id = array[array.length-1];
    this.path = this.$parent.getAttribute('data-video')
    this.loaded = false;
    this.before_end_delay = 8;

    this.fadeIn = gsap.timeline({paused:true})
      .fromTo(this.$video, {autoAlpha:0}, {autoAlpha:1, duration:speed*2, ease:'power2.inOut'})

    if(namespace=='home') {
      this.$loader = document.querySelector('.home-logo__circle path');
      this.loader_width = this.$loader.getTotalLength();
      this.startLoaderAnimation = gsap.timeline()
        .set(this.$loader, {css:{'stroke-dasharray':this.loader_width}})
        .fromTo(this.$loader, {css:{'stroke-dashoffset':this.loader_width}}, {duration:10, css:{'stroke-dashoffset':this.loader_width/2}, ease:'expo.out'})
    }

    this.initPlayer();
    this.resize();
    window.addEventListener('resize', ()=>{this.resize()})
  },
  resize: function() {
    let h = this.$parent.getBoundingClientRect().height,
        w = this.$parent.getBoundingClientRect().width,
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
  playerReady: function(event) {
    // this.duration = this.player.getDuration() - this.before_end_delay;
    this.duration = Math.floor(event.srcElement.duration) - this.before_end_delay;
    console.log(this.duration)
    this.delay = 0;
    //main
    if(namespace=='home') {
      if($preloader) {
        this.delay=speed*4;
      } else {
        this.delay=speed*2;
      }
      // setTimeout(() => {
        gsap.timeline()
            .to(this.$loader, {duration:this.delay, css:{'stroke-dashoffset':0}, ease:'power1.inOut'})
            .to(this.$loader, {duration:speed, autoAlpha:0, ease:'power1.in'}, `-=${speed}`)

      setTimeout(() => {
        this.startLoaderAnimation.pause();

        this.animationTimeline = gsap.timeline()
            .fromTo(this.$loader, {autoAlpha:0}, {immediateRender:false, autoAlpha:1, duration:speed, ease:'power2.inOut'})
            .fromTo(this.$loader, {css:{'stroke-dashoffset':this.loader_width}}, {immediateRender:false, duration:this.duration, css:{'stroke-dashoffset':0}, ease:'linear'}, `-=${speed}`)

        // this.playerNode.play()
      }, 2000)
              // .to(this.$loader, {autoAlpha:0, duration:speed*2, ease:'power2.in'}, `-=${speed}`)
      // }, 1000)
     } else {
      // this.playerNode.play()
    }

    // setTimeout(()=>{
    //   this.player.playVideo();
    //   this.player.mute();
    //   // event.target.setPlaybackQuality('hd720');
    //   let checkToPause = ()=>{
    //     let position = this.$video.getBoundingClientRect().y + this.$video.getBoundingClientRect().height;
    //     if((position<=0 || document.visibilityState=='hidden') && !this.flag) {
    //       this.flag = true;
    //       this.player.pauseVideo();
    //     } else if(position>0 && document.visibilityState=='visible' && this.flag) {
    //       this.flag = false;
    //       this.player.playVideo();
    //     }
    //   }
    //   checkToPause();
    //   window.addEventListener('scroll', ()=>{
    //     checkToPause();
    //   })
    //   document.addEventListener("visibilitychange", function() {
    //     checkToPause();
    //   });
    //
    //   setInterval(()=>{
    //     if(this.player.getCurrentTime() >= this.duration) {
    //       this.fadeIn.reverse();
    //       //restart video
    //       this.fadeIn.eventCallback('onReverseComplete', ()=>{
    //         this.player.pauseVideo();
    //         this.player.seekTo(0);
    //         this.player.playVideo();
    //       })
    //     }
    //   }, 100)
    // }, this.delay*1000)
  },
  initPlayer: function() {
    this.playerNode = document.createElement('video')
    const bgPlayer = document.querySelector('#bg-player')
    // this.$parent.appendChild(this.playerNode)
    bgPlayer.appendChild(this.playerNode)
    this.playerNode.muted = true
    // playerNode.setAttribute('autoplay', 'true')
    this.playerNode.setAttribute('muted', 'muted')
    this.playerNode.setAttribute('preload', 'auto')
    this.playerNode.setAttribute('loop', 'loop')
    this.playerNode.setAttribute('src', this.path)
    this.playerNode.load()
    this.playerNode.play()
    this.playerNode.style.width = '100%'
    this.playerNode.style.height = '100%'
    this.playerNode.style.position = 'absolute'
    this.playerNode.style.top = '0'
    this.playerNode.style.left = '0'
    this.playerNode.style['object-fit'] = 'cover'
    this.playerNode.pause()
    this.playerNode.addEventListener('loadeddata', (e) => {
      // setTimeout(() => {
      //   this.playerReady(e)
      // }, 2000)
      this.playerReady(e)
      setTimeout(()=>{
        if (this.playerNode.readyState === 4) {
          console.log('da');
          gsap.timeline({paused:false})
          .fromTo(this.$video, {autoAlpha:0}, {autoAlpha:1, duration:speed*2, ease:'power2.inOut'})
          setTimeout(() => {
            this.playerNode.play()
          }, 1000);
        }
      }, this.delay*1000)
    }, false);
    this.playerNode.addEventListener('waiting', (e) => {
      this.animationTimeline.pause()
    }, false);
    this.playerNode.addEventListener('playing', (e) => {
      this.animationTimeline.play()
    }, false);

    this.playerNode.addEventListener('ended', (e) => {
      // this.playerReady(e)
      // this.playerNode.play()
    }, false);

    // this.player = new YT.Player('bg-player', {
    //   videoId: this.id,
    //   playerVars: {
    //     'controls': 0,
    //     'disablekb': 1,
    //     'showinfo': 0,
    //     'rel': 0,
    //     'enablejsapi':1
    //   },
    //   events : {
    //  	 	'onReady':       (event)=>{this.playerReady(event)},
    //     'onStateChange': (event)=>{this.playerStateChange(event)}
    //   }
  	// });
    // this.player = document.querySelector('.bg-player')
  },

  // playerStateChange: function(event) {
  //   if(event.data === YT.PlayerState.BUFFERING) {
  //     if(namespace=='home') {
  //       this.animationTimeline.pause();
  //     }
  //   }
  //   else if(event.data === YT.PlayerState.PAUSED) {
  //     if(namespace=='home') {
  //       this.animationTimeline.pause();
  //     }
  //   }
  //   else if(event.data === YT.PlayerState.PLAYING) {
  //     if(this.fadeIn.progress()==0) {
  //       this.fadeIn.play();
  //     }
  //     if(namespace=='home') {
  //       this.animationTimeline.play(this.player.getCurrentTime());
  //     }
  //   }
  // }
}

const Nav = {
  init: function() {
    this.$nav = document.querySelector('.nav');
    this.$toggle = document.querySelector('.nav-toggle');
    this.$toggle_line = this.$toggle.querySelectorAll('span');
    this.$line = document.querySelector('.nav__line');
    this.$logo = document.querySelector('.nav__logo');
    this.$nav_items = document.querySelectorAll('.nav__item');
    this.$nav_socials = document.querySelectorAll('.nav__socials .socials__item');
    this.$nav_contactitems = document.querySelectorAll('.nav__contacts-list li');
    this.state = false;
    this.opened = false;
    this.animation = gsap.timeline({paused:true, 
      onStart:()=>{
        this.opened = true;
        this.$toggle.classList.add('active');
      }, 
      onReverseComplete:()=>{
        this.opened = false;
        this.$toggle.classList.remove('active');
      }
    })
      .to(this.$nav, {autoAlpha:1, duration:speed, ease:'power2.inOut'})
      .to(this.$toggle_line[1], {autoAlpha:0, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
      .to(this.$toggle_line[0], {rotate:-45, y:9.5, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
      .to(this.$toggle_line[2], {rotate:45, y:-9.5, duration:speed, ease:'power2.inOut'}, `-=${speed}`)
      .fromTo(this.$nav_items, {x:100, autoAlpha:0}, {x:0, autoAlpha:1, duration:speed*0.8, ease:'power2.out', stagger:{amount:speed*0.2}}, `-=${speed}`)
      .fromTo(this.$nav_socials, {x:-100, autoAlpha:0}, {x:0, autoAlpha:1, duration:speed*0.8, ease:'power2.out', stagger:{amount:speed*0.2, from:'end'}}, `-=${speed}`)
      .fromTo(this.$nav_contactitems, {x:-100, autoAlpha:0}, {x:0, autoAlpha:1, duration:speed*0.9, ease:'power2.out', stagger:{amount:speed*0.1}}, `-=${speed}`)
      .fromTo(this.$line, {scaleY:0, yPercent:50}, {scaleY:1, yPercent:0, duration:speed, ease:'power2.out', onReverseComplete:()=>{
        $header.classList.remove('header_nav-opened');
      }}, `-=${speed/2}`)
      .fromTo(this.$logo, {autoAlpha:0, yPercent:50}, {autoAlpha:1, yPercent:0, duration:speed, ease:'power2.out'}, `-=${speed}`)
    this.$toggle.addEventListener('click', ()=>{
      if(!this.state) {
        this.open();
      } else {
        this.close();
      }
    })
  },
  open: function() {
    $header.classList.add('header_nav-opened');
    this.state=true;
    this.animation.timeScale(1).play();
    disablePageScroll();
  },
  close: function() {
    this.state=false;
    this.animation.timeScale(1.5).reverse();
    enablePageScroll();
  }
}

const Header = {
  init: function() {
    this.height = $header.getBoundingClientRect().height;
    this.scrollY = 0;
    this.isVisible = true;
    this.fixed = false;

    this.animation = gsap.timeline({paused:true})
      .to($header, {yPercent:-100, duration:speed, ease:'power2.in'})

    window.addEventListener('resize', ()=>{
      this.height = $header.getBoundingClientRect().height;
    })

    window.addEventListener('scroll', ()=>{
      this.check();
    })
    this.check();
  }, 
  check: function() {
    let y = window.pageYOffset,
        h = window.innerHeight;

    if(y>0 && !this.fixed) {
      this.fixed = true;
      $header.classList.add('header_fixed');
    } else if(y==0 && this.fixed) {
      this.fixed = false;
      $header.classList.remove('header_fixed');
    }

    if(this.scrollY<y && this.scrollY>h && this.isVisible && !Nav.opened) {
      this.isVisible = false;
      this.animation.timeScale(2).play();
    } else if(this.scrollY>y && !this.isVisible) {
      this.isVisible = true;
      this.animation.timeScale(1).reverse();
    }    

    this.scrollY = y;
  }
}

const Parralax = {
  init: function() {
    window.addEventListener('scroll', ()=>{
      this.check();
    })
  },
  check: function() {
    if(window.innerWidth > Breakpoints.lg) {
      let $items = document.querySelectorAll('[data-parralax]');
      $items.forEach(($this)=>{
        let y = $this.getBoundingClientRect().y,
            h1 = window.innerHeight,
            h2 = $this.getBoundingClientRect().height,
            scroll = window.pageYOffset,
            factor = +$this.getAttribute('data-parralax');
    
        let val = (scroll-y)*factor;
        gsap.set($this, {y:val})
      })
    }
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
  window.addEventListener('scroll', ()=>{
    check();
  })
}

function hiddenText() {
  let $parent = document.querySelectorAll('.hidden-text');
  $parent.forEach(($this, index)=>{
    let $wrapper = $this.querySelector('.hidden-text__wrapper'),
        $content = $this.querySelector('.hidden-text__content'),
        $toggle = $this.nextSibling,
        w, h, state, animation;

    let resize = ()=> {
      h = $content.getBoundingClientRect().height;

      animation = gsap.timeline({paused:true})
        .fromTo($wrapper, {css:{height:h}}, {css:{height:0}, duration:speed, ease:'power2.inOut'})
        .fromTo($content, {autoAlpha:1}, {autoAlpha:0, duration:speed, ease:'power2.inOut'}, `-=${speed}`)

      if(!state) {
        animation.seek(0);
      } else {
        animation.seek(speed);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    let check = ()=> {
      if(!state) {
        $toggle.classList.remove('active');
        state = true;
        animation.play();
      } else {
        $toggle.classList.add('active');
        state = false;
        animation.reverse();
      }
    }

    check();

    $toggle.addEventListener('click', ()=>{
      check();
    })
  })
}

function inputs() {
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
      if(split=='.' || split=='') {
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

const Modal = {
  init: function() {
    gsap.registerEffect({
      name: "modal",
      effect: ($modal, $content) => {
        let anim = gsap.timeline({paused:true})
          .fromTo($modal, {autoAlpha:0}, {autoAlpha:1, duration:speed*0.5, ease:'power2.inOut'})
          .fromTo($content, {y:20}, {y:0, duration:speed, ease:'power2.out'}, `-=${speed*0.5}`)
        return anim;
      },
      extendTimeline: true
    });
    
    document.addEventListener('click', (event)=>{
      let $button = event.target!==document?event.target.closest('[data-modal]'):null;
      if($button) {
        event.preventDefault();
        if($button.getAttribute('data-modal')=='open') {
          let $modal = document.querySelector(`${$button.getAttribute('href')}`),
              modalSubject = $button.getAttribute('data-subject');
          this.open($modal, modalSubject);
        } else if($button.getAttribute('data-modal')=='video') {
          let href = $button.getAttribute('data-src');
          this.video(href);
        } else if($button.getAttribute('data-modal')=='close') {
          let $modal = $button.closest('.modal');
          this.close($modal);
        }
      }
    })
  }, 
  open: function($modal, modalSubject) {

    let play = ()=> {
      disablePageScroll();
      let $content = $modal.querySelector('.modal__container');
      this.newAnimation = gsap.effects.modal($modal, $content);
      this.newAnimation.play();
      this.$old = $modal;
      this.oldAnimation = this.newAnimation;
      //succes
      if($modal.classList.contains('modal-succes')) {
        let $icon = $modal.querySelector('path'),
            w = $icon.getTotalLength();
        gsap.timeline()
          .set($icon, {autoAlpha:0})
          .set($icon, {css:{'stroke-dasharray':w}}, `+=${speed*0.5}`)
          .set($icon, {autoAlpha:1})
          .fromTo($icon, {css:{'stroke-dashoffset':w}}, {duration:speed, css:{'stroke-dashoffset':0}, ease:'power2.out'})
      }
    }

    if($modal) {
      if(this.$old) {
        this.close(this.$old, ()=> {
          play();
        });
      } else {
        play();
      }
    }

    //значение формы
    let $input = $modal.querySelector('[data-subject]');
    if(modalSubject && $input) {
      $input.setAttribute('value', modalSubject);
    }
  }, 
  close: function($modal, callback) {
    if(this.$old && $modal) {
      enablePageScroll();
      this.$old = false;
      this.oldAnimation.reverse();
      this.oldAnimation.eventCallback('onReverseComplete', ()=>{
        if($modal.classList.contains('video-modal')) {
          $modal.remove();
          window.removeEventListener('resize', this.resizeEvent);
        }
        //callback
        if(callback) {
          callback();
        }
      })
      //reset form
      let $form = $modal.querySelector('form');
      if($form) {
        Validation.reset($form)
      }
    }
  },
  video: function(href) {
    let play = ()=> {
      $wrapper.insertAdjacentHTML('beforeEnd', '<div class="modal video-modal" data-scroll-lock-fill-gap><div class="modal__close" data-scroll-lock-fill-gap data-modal="close"><span></span><span></span></div><div class="modal__video" data-scroll-lock-scrollable><div class="modal__overlay" data-modal="close"></div><div class="modal__video-content"><div id="video-player"></div></div></div></div>');
      //
      disablePageScroll();

      let $modal = document.querySelector('.video-modal'),
          $wrap = $modal.querySelector('.modal__video'),
          $content = $modal.querySelector('.modal__video-content');
      
      this.newAnimation = gsap.effects.modal($modal, $content);
      this.newAnimation.eventCallback('onStart', ()=>{
        if(!youtubeApi.state) {
          youtubeApi.state = true;
          let tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          document.body.insertAdjacentElement('beforeEnd', tag);
          window.onYouTubeIframeAPIReady=()=>{
            initPlayer();
          };
        } else {
          initPlayer();
        }
      })

      let resize = (callback)=> {
        let style = window.getComputedStyle($wrap),
            pt = parseFloat(style.getPropertyValue("padding-top")),
            pb = parseFloat(style.getPropertyValue("padding-bottom")),
            pl = parseFloat(style.getPropertyValue("padding-left")),
            pr = parseFloat(style.getPropertyValue("padding-right")),
            h = $modal.getBoundingClientRect().height,
            w = $modal.getBoundingClientRect().width;
  
        if((w-pl-pr)/(h-pt-pb) > 16/9) {
          $content.style.height = `${h - pt - pb}px`;
          $content.style.width = `${(h - pt - pb)*1.77}px`;
        } else {
          $content.style.width = `${w - pl - pr}px`;
          $content.style.height = `${(w - pl - pr)*0.5625}px`;
        }
        if(callback) callback();
      }
      this.resizeEvent = ()=> {
        resize();
      }
      window.addEventListener('resize', this.resizeEvent);

      let initPlayer = ()=> {
        let array = href.split('/'),
            id = array[array.length-1];
        const playerNode = document.createElement('video')
        playerNode.setAttribute('src', href)
        playerNode.setAttribute('controls', 'controls')
        playerNode.setAttribute('autoplay', 'autoplay')
        playerNode.setAttribute('width', '100%')
        playerNode.volume = 0.6
        $content.appendChild(playerNode)
        // let player = new YT.Player('video-player', {
        //   videoId: id,
        //   events: {
        //     'onReady': function(event) {
        //       event.target.playVideo();
        //       let $video = $modal.querySelector('iframe');
        //       gsap.to($video, {autoAlpha:1, duration:speed/2, ease:'power2.inOut'})
        //     }
        //   }
        // });
      }
      resize(()=>{
        this.newAnimation.play();
      });
      this.$old = $modal;
      this.oldAnimation = this.newAnimation;
    }

    if(this.$old) {
      this.close(this.$old, ()=> {
        setTimeout(()=>{
          play();
        }, 200)
      });
    } else {
      play();
    }
    
  }
}

const Validation = {
  init: function() {
    //validation
    this.namspaces = {
      name: 'name',
      phone: 'phone',
      email: 'email',
      message: 'message'
    }
    this.constraints = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваше имя'
        },
        format: {
          pattern: /[A-zА-яЁё ]+/,
          message: '^Введите корректное имя'
        },
        length: {
          minimum: 2,
          tooShort: "^Имя слишком короткое (минимум %{count} символа)",
          maximum: 20,
          tooLong: "^Имя слишком длинное (максимум %{count} символов)"
        }
      },
      phone: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш номер телефона'
        },
        format: {
          pattern: /^\+7 \d{3}\ \d{3}\-\d{4}$/,
          message: '^Введите корректный номер телефона'
        }
      },
      email: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш email'
        },
        email: {
          message: '^Неправильный формат email-адреса' 
        }
      },
      message: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваше сообщение'
        },
        length: {
          minimum: 5,
          tooShort: "^Сообщение слишком короткое (минимум %{count} символов)",
          maximum: 100,
          tooLong: "^Сообщение слишком длинное (максимум %{count} символов)"
        }
      }
    };
    this.mask = Inputmask({
      mask: "+7 999 999-9999",
      showMaskOnHover: false,
      clearIncomplete: false
    }).mask("[data-validate='phone']");

    document.addEventListener('submit', (event)=>{
      event.preventDefault();
      let $form = event.target;
      console.log('test')
      if($form.classList.contains('js-validation') && this.checkValid($form)) {
        $form.classList.add('loading');
        //submit
        $($form).request('onSend', {
          success: ()=>{
            let modal = document.querySelector('#modal-succes');
            Modal.open(modal);
            setTimeout(()=>{
              Modal.close(modal);
            }, 3000)
            this.reset($form);
            $form.classList.remove('loading');
          }
        })
      }
    })
    
    document.addEventListener('input', (event)=>{
      let $input = event.target,
          $form = $input.closest('form');
      if($form.classList.contains('js-validation')) {
        this.checkValid($form, $input);
      }
    })

  },
  checkValid: function($form, $input) {
    let $inputs = $form.querySelectorAll('input, textarea'),
        values = {},
        constraints = {},
        resault;

    $inputs.forEach(($input)=>{
      let name = $input.getAttribute('name');
      for(let key in this.namspaces) {
        if($input.getAttribute('data-validate')==this.namspaces[key]) {
          values[name] = $input.value;
          constraints[name] = this.constraints[key];
        }
      }
    })

    resault = validate(values, constraints);

    if(resault!==undefined) {
      if($input!==undefined) {
        let flag = true,
            name = $input.getAttribute('name');
        for(let key in resault) {
          if(name==key) {
            flag=false;
          }
        }
        if(flag && $input.parentNode.classList.contains('error')) {
          $input.parentNode.classList.remove('error');
          let $msg = $input.parentNode.querySelector('.input__message');
          gsap.to($msg, {autoAlpha:0, duration:0.3, ease:'power2.inOut'}).eventCallback('onComplete', ()=>{
            $msg.remove();
          })
        }
      } 
      else {
        $inputs.forEach(($input)=>{
          let name = $input.getAttribute('name');
          for(let key in resault) {
            if(name==key) {
              if(!$input.parentNode.classList.contains('error')) {
                $input.parentNode.classList.add('error');
                $input.parentNode.insertAdjacentHTML('beforeend', `<span class="input__message">${resault[key][0]}</span>`);
                gsap.to($input.parentNode.querySelector('.input__message'), {autoAlpha:1, duration:0.3, ease:'power2.inOut'})
              } else {
                $input.parentNode.querySelector('.input__message').textContent = `${resault[key][0]}`;
              }
            }
          }
        })
      }
      return false;
    } else {
      $inputs.forEach(($input)=>{
        $input.parentNode.classList.remove('error');
        let $msg = $input.parentNode.querySelector('.input__message');
        if($msg) {
          gsap.to($msg, {autoAlpha:0, duration:0.3, ease:'power2.inOut'}).eventCallback('onComplete', ()=>{
            $msg.remove();
          })
        }
      })
      return true;
    }
  },
  reset: function($form) {
    let $inputs = $form.querySelectorAll('input, textarea');
    $inputs.forEach(($input)=>{
      $input.value = '';
      let $parent = $input.parentNode;
      if($parent.classList.contains('focused')) {
        $parent.classList.remove('focused');
      }
      if($parent.classList.contains('error')) {
        $parent.classList.remove('error');
        let $msg = $input.parentNode.querySelector('.input__message');
        if($msg) {
          gsap.to($msg, {autoAlpha:0, duration:0.3, ease:'power2.inOut'}).eventCallback('onComplete', ()=>{
            $msg.remove();
          })
        }
      }
    })
  }
}