// ------------------------------------------------------------------------------ //
//
// Template name : Bootsnav - Multi Purpose Header
// Categorie : Bootstrap Menu in CSS
// Author : adamnurdin01
// Version : v.1.2
// Created : 2016-06-02
// Last update : 2016-10-19
//
// ------------------------------------------------------------------------------ //

(function ($) {
  const bootsnav = {
    initialize() {
      this.event();
      this.hoverDropdown();
      this.navbarSticky();
      this.navbarScrollspy();
    },
    event() {
      // ------------------------------------------------------------------------------ //
      // Variable
      // ------------------------------------------------------------------------------ //
      const getNav = $('nav.navbar.bootsnav');

      // ------------------------------------------------------------------------------ //
      // Navbar Sticky
      // ------------------------------------------------------------------------------ //
      const navSticky = getNav.hasClass('navbar-sticky');
      if (navSticky) {
        // Wraped navigation
        getNav.wrap("<div class='wrap-sticky'></div>");
      }

      // ------------------------------------------------------------------------------ //
      // Navbar Center
      // ------------------------------------------------------------------------------ //
      if (getNav.hasClass('brand-center')) {
        const postsArr = new Array();
        const index = $('nav.brand-center');
        const $postsList = index.find('ul.navbar-nav');

        index.prepend("<span class='storage-name' style='display:none;'></span>");

        // Create array of all posts in lists
        index.find('ul.navbar-nav > li').each(function () {
          if ($(this).hasClass('active')) {
            const getElement = $('a', this).eq(0).text();
            $('.storage-name').html(getElement);
          }
          postsArr.push($(this).html());
        });

        // Split the array at this point. The original array is altered.
        const firstList = postsArr.splice(0, Math.round(postsArr.length / 2));
        const secondList = postsArr;
        let ListHTML = '';

        const createHTML = function (list) {
          ListHTML = '';
          for (let i = 0; i < list.length; i++) {
            ListHTML += `<li>${list[i]}</li>`;
          }
        };

        // Generate HTML for first list
        createHTML(firstList);
        $postsList.html(ListHTML);
        index.find('ul.nav').first().addClass('navbar-left');

        // Generate HTML for second list
        createHTML(secondList);
        // Create new list after original one
        $postsList.after('<ul class="nav navbar-nav"></ul>').next().html(ListHTML);
        index.find('ul.nav').last().addClass('navbar-right');

        // Wrap navigation menu
        index.find('ul.nav.navbar-left').wrap("<div class='col-half left'></div>");
        index.find('ul.nav.navbar-right').wrap("<div class='col-half right'></div>");

        // Selection Class
        index.find('ul.navbar-nav > li').each(function () {
          const dropDown = $('ul.dropdown-menu', this);
          const megaMenu = $('ul.megamenu-content', this);
          dropDown.closest('li').addClass('dropdown');
          megaMenu.closest('li').addClass('megamenu-fw');
        });

        const getName = $('.storage-name').html();
        if (!getName == '') {
          $(`ul.navbar-nav > li:contains('${getName}')`).addClass('active');
        }
      }

      // ------------------------------------------------------------------------------ //
      // Navbar Sidebar
      // ------------------------------------------------------------------------------ //
      if (getNav.hasClass('navbar-sidebar')) {
        // Add Class to body
        $('body').addClass('wrap-nav-sidebar');
        getNav.wrapInner("<div class='scroller'></div>");
      } else {
        $('.bootsnav').addClass('on');
      }

      // ------------------------------------------------------------------------------ //
      // Menu Center
      // ------------------------------------------------------------------------------ //
      if (getNav.find('ul.nav').hasClass('navbar-center')) {
        getNav.addClass('menu-center');
      }

      // ------------------------------------------------------------------------------ //
      // Navbar Full
      // ------------------------------------------------------------------------------ //
      if (getNav.hasClass('navbar-full')) {
        // Add Class to body
        $('nav.navbar.bootsnav').find('ul.nav').wrap("<div class='wrap-full-menu'></div>");
        $('.wrap-full-menu').wrap("<div class='nav-full'></div>");
        $('ul.nav.navbar-nav').prepend("<li class='close-full-menu'><a href='#'><i class='fa fa-times'></i></a></li>");
      } else if (getNav.hasClass('navbar-mobile')) {
        getNav.removeClass('no-full');
      } else {
        getNav.addClass('no-full');
      }

      // ------------------------------------------------------------------------------ //
      // Navbar Mobile
      // ------------------------------------------------------------------------------ //
      if (getNav.hasClass('navbar-mobile')) {
        // Add Class to body
        $('.navbar-collapse').on('shown.bs.collapse', () => {
          $('body').addClass('side-right');
        });
        $('.navbar-collapse').on('hide.bs.collapse', () => {
          $('body').removeClass('side-right');
        });

        $(window).on('resize', () => {
          $('body').removeClass('side-right');
        });
      }

      // ------------------------------------------------------------------------------ //
      // Navbar Fixed
      // ------------------------------------------------------------------------------ //
      if (getNav.hasClass('no-background')) {
        $(window).on('scroll', () => {
          const scrollTop = $(window).scrollTop();
          if (scrollTop > 34) {
            $('.navbar-fixed').removeClass('no-background');
          } else {
            $('.navbar-fixed').addClass('no-background');
          }
        });
      }

      // ------------------------------------------------------------------------------ //
      // Navbar Fixed
      // ------------------------------------------------------------------------------ //
      if (getNav.hasClass('navbar-transparent')) {
        $(window).on('scroll', () => {
          const scrollTop = $(window).scrollTop();
          if (scrollTop > 34) {
            $('.navbar-fixed').removeClass('navbar-transparent');
          } else {
            $('.navbar-fixed').addClass('navbar-transparent');
          }
        });
      }

      // ------------------------------------------------------------------------------ //
      // Button Cart
      // ------------------------------------------------------------------------------ //
      $('.btn-cart').on('click', (e) => {
        e.stopPropagation();
      });

      // ------------------------------------------------------------------------------ //
      // Toggle Search
      // ------------------------------------------------------------------------------ //
      $('nav.navbar.bootsnav .attr-nav').each(function () {
        $('li.search > a', this).on('click', (e) => {
          e.preventDefault();
          $('.top-search').slideToggle();
        });
      });
      $('.input-group-addon.close-search').on('click', () => {
        $('.top-search').slideUp();
      });

      // ------------------------------------------------------------------------------ //
      // Toggle Side Menu
      // ------------------------------------------------------------------------------ //
      $('nav.navbar.bootsnav .attr-nav').each(function () {
        $('li.side-menu > a', this).on('click', (e) => {
          e.preventDefault();
          $('nav.navbar.bootsnav > .side').toggleClass('on');
          $('body').toggleClass('on-side');
        });
      });
      $('.side .close-side').on('click', (e) => {
        e.preventDefault();
        $('nav.navbar.bootsnav > .side').removeClass('on');
        $('body').removeClass('on-side');
      });

      // ------------------------------------------------------------------------------ //
      // Wrapper
      // ------------------------------------------------------------------------------ //
      $('body').wrapInner("<div class='wrapper'></div>");
    },

    // ------------------------------------------------------------------------------ //
    // Change dropdown to hover on dekstop
    // ------------------------------------------------------------------------------ //
    hoverDropdown() {
      const getNav = $('nav.navbar.bootsnav');
      const getWindow = $(window).width();
      const getHeight = $(window).height();
      const getIn = getNav.find('ul.nav').data('in');
      const getOut = getNav.find('ul.nav').data('out');

      if (getWindow < 991) {
        // Height of scroll navigation sidebar
        $('.scroller').css('height', 'auto');

        // Disable mouseenter event
        $('nav.navbar.bootsnav ul.nav').find('li.dropdown').off('mouseenter');
        $('nav.navbar.bootsnav ul.nav').find('li.dropdown').off('mouseleave');
        $('nav.navbar.bootsnav ul.nav').find('.title').off('mouseenter');
        $('nav.navbar.bootsnav ul.nav').off('mouseleave');
        $('.navbar-collapse').removeClass('animated');

        // Enable click event
        $('nav.navbar.bootsnav ul.nav').each(function () {
          $('.dropdown-menu', this).addClass('animated');
          $('.dropdown-menu', this).removeClass(getOut);

          // Dropdown Fade Toggle
          $('a.dropdown-toggle', this).off('click');
          $('a.dropdown-toggle', this).on('click', function (e) {
            e.stopPropagation();
            $(this).closest('li.dropdown').find('.dropdown-menu').first()
              .stop()
              .fadeToggle()
              .toggleClass(getIn);
            $(this).closest('li.dropdown').first().toggleClass('on');
            return false;
          });

          // Hidden dropdown action
          $('li.dropdown', this).each(function () {
            $(this).find('.dropdown-menu').stop().fadeOut();
            $(this).on('hidden.bs.dropdown', function () {
              $(this).find('.dropdown-menu').stop().fadeOut();
            });
            return false;
          });

          // Megamenu style
          $('.megamenu-fw', this).each(function () {
            $('.col-menu', this).each(function () {
              $('.content', this).addClass('animated');
              $('.content', this).stop().fadeOut();
              $('.title', this).off('click');
              $('.title', this).on('click', function () {
                $(this).closest('.col-menu').find('.content').stop()
                  .fadeToggle()
                  .addClass(getIn);
                $(this).closest('.col-menu').toggleClass('on');
                return false;
              });

              $('.content', this).on('click', (e) => {
                e.stopPropagation();
              });
            });
          });
        });

        // Hidden dropdown
        const cleanOpen = function () {
          $('li.dropdown', this).removeClass('on');
          $('.dropdown-menu', this).stop().fadeOut();
          $('.dropdown-menu', this).removeClass(getIn);
          $('.col-menu', this).removeClass('on');
          $('.col-menu .content', this).stop().fadeOut();
          $('.col-menu .content', this).removeClass(getIn);
        };

        // Hidden om mouse leave
        $('nav.navbar.bootsnav').on('mouseleave', () => {
          cleanOpen();
        });

        // Enable click atribute navigation
        $('nav.navbar.bootsnav .attr-nav').each(function () {
          $('.dropdown-menu', this).removeClass('animated');
          $('li.dropdown', this).off('mouseenter');
          $('li.dropdown', this).off('mouseleave');
          $('a.dropdown-toggle', this).off('click');
          $('a.dropdown-toggle', this).on('click', function (e) {
            e.stopPropagation();
            $(this).closest('li.dropdown').find('.dropdown-menu').first()
              .stop()
              .fadeToggle();
            $('.navbar-toggle').each(function () {
              $('.fa', this).removeClass('fa-times');
              $('.fa', this).addClass('fa-bars');
              $('.navbar-collapse').removeClass('in');
              $('.navbar-collapse').removeClass('on');
            });
          });

          $(this).on('mouseleave', function () {
            $('.dropdown-menu', this).stop().fadeOut();
            $('li.dropdown', this).removeClass('on');
            return false;
          });
        });

        // Toggle Bars
        $('.navbar-toggle').each(function () {
          $(this).off('click');
          $(this).on('click', function () {
            $('.fa', this).toggleClass('fa-bars');
            $('.fa', this).toggleClass('fa-times');
            cleanOpen();
          });
        });
      } else if (getWindow > 991) {
        // Height of scroll navigation sidebar
        $('.scroller').css('height', `${getHeight}px`);

        // Navbar Sidebar
        if (getNav.hasClass('navbar-sidebar')) {
          // Hover effect Sidebar Menu
          $('nav.navbar.bootsnav ul.nav').each(function () {
            $('a.dropdown-toggle', this).off('click');
            $('a.dropdown-toggle', this).on('click', (e) => {
              e.stopPropagation();
            });

            $('.dropdown-menu', this).addClass('animated');
            $('li.dropdown', this).on('mouseenter', function () {
              $('.dropdown-menu', this).eq(0).removeClass(getOut);
              $('.dropdown-menu', this).eq(0).stop().fadeIn()
                .addClass(getIn);
              $(this).addClass('on');
              return false;
            });

            $('.col-menu').each(function () {
              $('.content', this).addClass('animated');
              $('.title', this).on('mouseenter', function () {
                $(this).closest('.col-menu').find('.content').stop()
                  .fadeIn()
                  .addClass(getIn);
                $(this).closest('.col-menu').addClass('on');
                return false;
              });
            });

            $(this).on('mouseleave', function () {
              $('.dropdown-menu', this).stop().removeClass(getIn);
              $('.dropdown-menu', this).stop().addClass(getOut).fadeOut();
              $('.col-menu', this).find('.content').stop().fadeOut()
                .removeClass(getIn);
              $('.col-menu', this).removeClass('on');
              $('li.dropdown', this).removeClass('on');
              return false;
            });
          });
        } else {
          // Hover effect Default Menu
          $('nav.navbar.bootsnav ul.nav').each(function () {
            $('a.dropdown-toggle', this).off('click');
            $('a.dropdown-toggle', this).on('click', (e) => {
              e.stopPropagation();
            });

            $('.megamenu-fw', this).each(function () {
              $('.title', this).off('click');
              $('a.dropdown-toggle', this).off('click');
              $('.content').removeClass('animated');
            });

            $('.dropdown-menu', this).addClass('animated');
            $('li.dropdown', this).on('mouseenter', function () {
              $('.dropdown-menu', this).eq(0).removeClass(getOut);
              $('.dropdown-menu', this).eq(0).stop().fadeIn()
                .addClass(getIn);
              $(this).addClass('on');
              return false;
            });

            $('li.dropdown', this).on('mouseleave', function () {
              $('.dropdown-menu', this).eq(0).removeClass(getIn);
              $('.dropdown-menu', this).eq(0).stop().fadeOut()
                .addClass(getOut);
              $(this).removeClass('on');
            });

            $(this).on('mouseleave', function () {
              $('.dropdown-menu', this).removeClass(getIn);
              $('.dropdown-menu', this).eq(0).stop().fadeOut()
                .addClass(getOut);
              $('li.dropdown', this).removeClass('on');
              return false;
            });
          });
        }

        // ------------------------------------------------------------------------------ //
        // Hover effect Atribute Navigation
        // ------------------------------------------------------------------------------ //
        $('nav.navbar.bootsnav .attr-nav').each(function () {
          $('a.dropdown-toggle', this).off('click');
          $('a.dropdown-toggle', this).on('click', (e) => {
            e.stopPropagation();
          });

          $('.dropdown-menu', this).addClass('animated');
          $('li.dropdown', this).on('mouseenter', function () {
            $('.dropdown-menu', this).eq(0).removeClass(getOut);
            $('.dropdown-menu', this).eq(0).stop().fadeIn()
              .addClass(getIn);
            $(this).addClass('on');
            return false;
          });

          $('li.dropdown', this).on('mouseleave', function () {
            $('.dropdown-menu', this).eq(0).removeClass(getIn);
            $('.dropdown-menu', this).eq(0).stop().fadeOut()
              .addClass(getOut);
            $(this).removeClass('on');
          });

          $(this).on('mouseleave', function () {
            $('.dropdown-menu', this).removeClass(getIn);
            $('.dropdown-menu', this).eq(0).stop().fadeOut()
              .addClass(getOut);
            $('li.dropdown', this).removeClass('on');
            return false;
          });
        });
      }

      // ------------------------------------------------------------------------------ //
      // Menu Fullscreen
      // ------------------------------------------------------------------------------ //
      if (getNav.hasClass('navbar-full')) {
        const windowHeight = $(window).height();
        const windowWidth = $(window).width();

        $('.nav-full').css('height', `${windowHeight}px`);
        $('.wrap-full-menu').css('height', `${windowHeight}px`);
        $('.wrap-full-menu').css('width', `${windowWidth}px`);

        $('.navbar-collapse').addClass('animated');
        $('.navbar-toggle').each(function () {
          const getId = $(this).data('target');
          $(this).off('click');
          $(this).on('click', (e) => {
            e.preventDefault();
            $(getId).removeClass(getOut);
            $(getId).addClass('in');
            $(getId).addClass(getIn);
            return false;
          });

          $('li.close-full-menu').on('click', (e) => {
            e.preventDefault();
            $(getId).addClass(getOut);
            setTimeout(() => {
              $(getId).removeClass('in');
              $(getId).removeClass(getIn);
            }, 500);
            return false;
          });
        });
      }
    },

    // ------------------------------------------------------------------------------ //
    // Navbar Sticky
    // ------------------------------------------------------------------------------ //
    navbarSticky() {
      const getNav = $('nav.navbar.bootsnav');
      const navSticky = getNav.hasClass('navbar-sticky');

      if (navSticky) {
        // Set Height Navigation
        const getHeight = getNav.height();
        $('.wrap-sticky').height(getHeight);

        // Windown on scroll
        const getOffset = $('.wrap-sticky').offset().top;
        $(window).on('scroll', () => {
          const scrollTop = $(window).scrollTop();
          if (scrollTop > getOffset) {
            getNav.addClass('sticked');
          } else {
            getNav.removeClass('sticked');
          }
        });
      }
    },

    // ------------------------------------------------------------------------------ //
    // Navbar Scrollspy
    // ------------------------------------------------------------------------------ //
    navbarScrollspy() {
      const navScrollSpy = $('.navbar-scrollspy');
      const $body = $('body');
      const getNav = $('nav.navbar.bootsnav');
      let offset = getNav.outerHeight();

      if (navScrollSpy.length) {
        $body.scrollspy({ target: '.navbar', offset });

        // Animation Scrollspy
        $('.scroll').on('click', function (event) {
          event.preventDefault();

          // Active link
          $('.scroll').removeClass('active');
          $(this).addClass('active');

          // Remove navbar collapse
          $('.navbar-collapse').removeClass('in');

          // Toggle Bars
          $('.navbar-toggle').each(function () {
            $('.fa', this).removeClass('fa-times');
            $('.fa', this).addClass('fa-bars');
          });

          // Scroll
          const scrollTop = $(window).scrollTop();
          const $anchor = $(this).find('a');
          const $section = $($anchor.attr('href')).offset().top;
          const $window = $(window).width();
          const $minusDesktop = getNav.data('minus-value-desktop');
          const $minusMobile = getNav.data('minus-value-mobile');
          const $speed = getNav.data('speed');

          if ($window > 992) {
            var $position = $section - $minusDesktop;
          } else {
            var $position = $section - $minusMobile;
          }

          $('html, body').stop().animate({
            scrollTop: $position,
          }, $speed);
        });

        // Activate Navigation
        const fixSpy = function () {
          const data = $body.data('bs.scrollspy');
          if (data) {
            offset = getNav.outerHeight();
            data.options.offset = offset;
            $body.data('bs.scrollspy', data);
            $body.scrollspy('refresh');
          }
        };

        // Activate Navigation on resize
        let resizeTimer;
        $(window).on('resize', () => {
          clearTimeout(resizeTimer);
          var resizeTimer = setTimeout(fixSpy, 200);
        });
      }
    },
  };

  // Initialize
  $(document).ready(() => {
    bootsnav.initialize();
  });

  // Reset on resize
  $(window).on('resize', () => {
    bootsnav.hoverDropdown();
    setTimeout(() => {
      bootsnav.navbarSticky();
    }, 500);

    // Toggle Bars
    $('.navbar-toggle').each(function () {
      $('.fa', this).removeClass('fa-times');
      $('.fa', this).addClass('fa-bars');
      $(this).removeClass('fixed');
    });
    $('.navbar-collapse').removeClass('in');
    $('.navbar-collapse').removeClass('on');
    $('.navbar-collapse').removeClass('bounceIn');
  });
}(jQuery));
