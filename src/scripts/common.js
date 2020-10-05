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

window.onload = function(){
  pageLoaded();
}
function pageLoaded() {
  let loading_time_limit = 1.5;  //seconds

  //отключить прелоадер если 0
  if(loading_time_limit==0) {
    app.init();
    clearInterval(preloader_interval);
    $preloader.remove();
    gsap.set($wrapper, {autoAlpha:1})
  }

  //если загрузились раньше
  else if(loading_duration < loading_time_limit) {
    setTimeout(()=>{
      clearInterval(preloader_interval);
      finish();
    }, (loading_time_limit - loading_duration) * 1000)
  }
  //если загрузились позже 
  else {
    setTimeout(()=>{
      clearInterval(preloader_interval);
      finish();
    })
  }

  let finish = ()=>{
    app.init();
    $preloader_icon.style.transition = 'none';
    $preloader_mask.style.transition = 'none';
    gsap.timeline({onComplete:()=>{$preloader.remove();}})
      .to($wrapper, {autoAlpha:1, duration:1, ease:'power2.inOut'}) //1
      .to($preloader_mask, {attr:{y:0}, duration:1, ease:'power2.inOut'}, '-=1') //1
      .to($preloader_icon, {scale:0.9, duration:1.5, ease:'power2.inOut'}, '-=1') //1.5
      .to($preloader, {autoAlpha:0, duration:1, ease:'power2.inOut'}, '-=1')
  }
}

const brakepoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440
}
const $wrapper = document.querySelector('.wrapper');
const youtubeApi = {
  state: false
}


const app = {
  init: function() {
    //home
    if(device.desktop()) {
      bgVideo.init();
    }
    //

    Home.init();
    TouchHoverEvents.init();
    Video.init();
    //
    helper();
  }
}


//hover/touch custom events
const TouchHoverEvents = {
  targets: 'a, button, label, tr, .jsTouchHover, .js-3d-object',
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

window.bgVideo = {
  init: function() {
    this.wrapper = document.querySelector('.home-background-video');
    this.video = document.querySelector('.home-background-video__wrap');
    this.loaded = false;
    this.flag = true;
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
          .to(this.$loader, {autoAlpha:0, duration:2, ease:'power2.inOut'}, '-=2')
          .to(this.video, {autoAlpha:0, duration:2, ease:'power2.inOut'}, '-=2')
        
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
      console.log(this.video)
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
        'autoplay':1, 
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
    this.player.mute();
    event.target.setPlaybackQuality('hd720');
  },
  playerStateChange: function(event) {
    if (event.data === YT.PlayerState.ENDED) {
      this.animation_timeline.pause();
      gsap.set(this.$loader, {css:{opacity:'0'}});
      this.player.playVideo();
    } 
    else if(event.data === YT.PlayerState.BUFFERING) {
      this.animation_timeline.pause();
      event.target.setPlaybackQuality('hd720');
    } 
    else if(event.data === YT.PlayerState.PAUSED) {
      this.animation_timeline.pause();
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

const Home = {
  init: function() {
    let $homeitems = document.querySelectorAll('.home__item'),  
        $dots = document.querySelectorAll('.home-dots__link');
    this.dots();

    gsap.timeline()
      .fromTo($homeitems, {y:50}, {y:0, duration:1.5, ease:'power2.out', stagger:{amount:0.5}})
      .fromTo($homeitems, {autoAlpha:0}, {autoAlpha:1, duration:1.5, ease:'power2.inOut', stagger:{amount:0.5}}, '-=2')
      .fromTo($dots, {x:20}, {x:0, duration:1.5, ease:'power2.out', stagger:{amount:0.5}}, '-=2')
      .fromTo($dots, {autoAlpha:0}, {autoAlpha:1, duration:1.5, ease:'power2.inOut', stagger:{amount:0.5}}, '-=2')

  },
  dots: function() {
    let $buttons = document.querySelectorAll('.home-dots__link'),
        $sections = document.querySelectorAll('.section'),
        inscroll = false,
        animation,
        $oldLink = false;

    //click
    $buttons.forEach(($this)=>{
      $this.addEventListener('click', (event)=>{
        console.log('click')
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
      if(!inscroll) {
        let position = window.pageYOffset;
        $sections.forEach(($section)=>{
          let top = $section.getBoundingClientRect().y + position,
              bottom = top + $section.getBoundingClientRect().height;
          if($section.getAttribute('id')=='about') {
            console.log(position, top, bottom)
          }
          if (position >= top && position <= bottom) {

            $buttons.forEach(($button)=>{
              let attr = $button.getAttribute('href'),
                  id = '#'+$section.getAttribute('id');
              if(attr==id && $button!==$oldLink) {
                if($oldLink) $oldLink.classList.remove('active');
                $button.classList.add('active');
                $oldLink = $button;
              }
            })
          }
        })
      }
    }

    check();
    window.addEventListener('scroll', ()=>{
      check();
    })

  }
}



function helper() {
  let $toggle = document.querySelector('.helper__trigger'),
      $block = document.querySelector('.helper'),
      state = false;

  console.log($toggle, $block)

  $toggle.addEventListener('click', ()=>{
    if(!state) {
      state = true;
      $block.classList.add('active');
    } else {
      state = false;
      $block.classList.remove('active');
    }
  })

}