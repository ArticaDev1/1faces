window.addEventListener('load', ()=>{
  Helper.init();
})

const Helper = {
  init: function() {
    this.$block = document.querySelector('.helper');
    this.$trigger = this.$block.querySelector('.helper__trigger');

    this.set_active_page();
    this.themes();

    this.$trigger.addEventListener('click', ()=>{
      if(!this.state) {
        this.open();
      } else {
        this.close();
      }
    })

  },
  themes: function() {
    let local = localStorage.getItem('theme-index'),
        value = local?local:0,
        themes = document.querySelectorAll('.theme'),
        $triggers = document.querySelectorAll('.helper__section-button-theme');
    
    console.log(local)

    function check() {
      themes.forEach((theme, index)=>{
        if(value==index) {
          theme.setAttribute('href', theme.getAttribute('data-href'));
          localStorage.setItem('theme-index', index)
        } else {
          theme.setAttribute('href', '')
        }
      })
      $triggers.forEach(($trigger, index)=>{
        if(value==index) {
          $trigger.classList.add('active');
        } else {
          $trigger.classList.remove('active');
        }
      })
    }

    check();
    $triggers.forEach(($trigger, index)=>{
      $trigger.addEventListener('click', ()=>{
        value=index;
        check();
      })
    })
  },
  set_active_page: function() {
    let values = location.href.split('/'),
        last_value = values[values.length-1],
        page = last_value=='' ? 'index.html': last_value;

    let $links = this.$block.querySelectorAll('a');

    $links.forEach(($this)=>{
      let href_values = $this.getAttribute('href').split('/'),
          href_page = href_values[href_values.length-1];
          
      if(page==href_page) {
        $this.classList.add('active');
      }
    })
  },
  open: function() {
    this.state = true;
    this.$block.classList.add('active');
  },
  close: function() {
    this.state = false;
    this.$block.classList.remove('active');
  }
}
