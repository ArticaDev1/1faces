"use strict";

window.addEventListener('load', function () {
  Helper.init();
});
var Helper = {
  init: function init() {
    var _this = this;

    this.$block = document.querySelector('.helper');
    this.$trigger = this.$block.querySelector('.helper__trigger');
    this.set_active_page();
    this.themes();
    this.$trigger.addEventListener('click', function () {
      if (!_this.state) {
        _this.open();
      } else {
        _this.close();
      }
    });
  },
  themes: function themes() {
    var local = localStorage.getItem('theme-index'),
        value = local ? local : 0,
        themes = document.querySelectorAll('.theme'),
        $triggers = document.querySelectorAll('.helper__section-button-theme');

    function check() {
      themes.forEach(function (theme, index) {
        if (value == index) {
          theme.setAttribute('href', theme.getAttribute('data-href'));
          localStorage.setItem('theme-index', index);
        } else {
          theme.setAttribute('href', '');
        }
      });
      $triggers.forEach(function ($trigger, index) {
        if (value == index) {
          $trigger.classList.add('active');
        } else {
          $trigger.classList.remove('active');
        }
      });
    }

    check();
    $triggers.forEach(function ($trigger, index) {
      $trigger.addEventListener('click', function () {
        value = index;
        check();
      });
    });
  },
  set_active_page: function set_active_page() {
    var values = location.href.split('/'),
        last_value = values[values.length - 1],
        page = last_value == '' ? 'index.html' : last_value;
    var $links = this.$block.querySelectorAll('a');
    $links.forEach(function ($this) {
      if ($this.getAttribute('href') != null) {
        var href_values = $this.getAttribute('href').split('/'),
            href_page = href_values[href_values.length - 1];

        if (page == href_page) {
          $this.classList.add('active');
        }
      }
    });
  },
  open: function open() {
    this.state = true;
    this.$block.classList.add('active');
  },
  close: function close() {
    this.state = false;
    this.$block.classList.remove('active');
  }
};
//# sourceMappingURL=maps/helper.js.map
