$(function () {
      $('#dark-mode').on('click', function (e) {

        // e.preventDefault();
        $('button').not('.check').toggleClass('dark-grey-text text-white');
        $('.list-panel a').toggleClass('dark-grey-text');
        // $('li').toggleClass('white-skin navy-blue-skin');
        $('footer, .card, .list-group-item').toggleClass('dark-card-admin');
        $('body, .navbar').toggleClass('white-skin navy-blue-skin');
        // $(this).toggleClass('white text-dark btn-outline-black');
        $('body').toggleClass('dark-bg-admin');
        $('h6, .card, p, td, th, i, li a, input, label').not(
          '#slide-out i, #slide-out a, .dropdown-item i, .dropdown-item').toggleClass('text-white');
        $('.btn-dash').toggleClass('grey blue').toggleClass('lighten-3 darken-3');
        $('.gradient-card-header').toggleClass('white black lighten-4');
        $('.card-header').toggleClass('white elegant-color-dark');
        // $('.h4').toggleClass('text-white');
        $('.list-panel a').toggleClass('navy-blue-bg-a text-white').toggleClass('list-group-border');
      });
    });