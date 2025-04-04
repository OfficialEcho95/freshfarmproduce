/*!
 * Bootstrap-select v1.12.13 (https://github.com/heimrichhannot/bootstrap-select)
 *
 * Copyright 2013-2017 bootstrap-select
 * Licensed under MIT (https://github.com/heimrichhannot/bootstrap-select/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(['jquery'], (a0) => (factory(a0)));
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }
}(this, (jQuery) => {
  (function ($) {
    // <editor-fold desc="Shims">
    if (!String.prototype.includes) {
      (function () {
        // needed to support `apply`/`call` with `undefined`/`null`
        const { toString } = {};
        const defineProperty = (function () {
          // IE 8 only supports `Object.defineProperty` on DOM elements
          try {
            const object = {};
            const $defineProperty = Object.defineProperty;
            var result = $defineProperty(object, object, object) && $defineProperty;
          } catch (error) {
          }
          return result;
        }());
        const { indexOf } = '';
        const includes = function (search) {
          if (this == null) {
            throw new TypeError();
          }
          const string = String(this);
          if (search && toString.call(search) == '[object RegExp]') {
            throw new TypeError();
          }
          const stringLength = string.length;
          const searchString = String(search);
          const searchLength = searchString.length;
          const position = arguments.length > 1 ? arguments[1] : undefined;
          // `ToInteger`
          let pos = position ? Number(position) : 0;
          if (pos != pos) { // better `isNaN`
            pos = 0;
          }
          const start = Math.min(Math.max(pos, 0), stringLength);
          // Avoid the `indexOf` call if no match is possible
          if (searchLength + start > stringLength) {
            return false;
          }
          return indexOf.call(string, searchString, pos) != -1;
        };
        if (defineProperty) {
          defineProperty(String.prototype, 'includes', {
            value: includes,
            configurable: true,
            writable: true,
          });
        } else {
          String.prototype.includes = includes;
        }
      }());
    }

    if (!String.prototype.startsWith) {
      (function () {
        // needed to support `apply`/`call` with `undefined`/`null`
        const defineProperty = (function () {
          // IE 8 only supports `Object.defineProperty` on DOM elements
          try {
            const object = {};
            const $defineProperty = Object.defineProperty;
            var result = $defineProperty(object, object, object) && $defineProperty;
          } catch (error) {
          }
          return result;
        }());
        const { toString } = {};
        const startsWith = function (search) {
          if (this == null) {
            throw new TypeError();
          }
          const string = String(this);
          if (search && toString.call(search) == '[object RegExp]') {
            throw new TypeError();
          }
          const stringLength = string.length;
          const searchString = String(search);
          const searchLength = searchString.length;
          const position = arguments.length > 1 ? arguments[1] : undefined;
          // `ToInteger`
          let pos = position ? Number(position) : 0;
          if (pos != pos) { // better `isNaN`
            pos = 0;
          }
          const start = Math.min(Math.max(pos, 0), stringLength);
          // Avoid the `indexOf` call if no match is possible
          if (searchLength + start > stringLength) {
            return false;
          }
          let index = -1;
          while (++index < searchLength) {
            if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
              return false;
            }
          }
          return true;
        };
        if (defineProperty) {
          defineProperty(String.prototype, 'startsWith', {
            value: startsWith,
            configurable: true,
            writable: true,
          });
        } else {
          String.prototype.startsWith = startsWith;
        }
      }());
    }

    if (!Object.keys) {
      Object.keys = function (
        o, // object
        k, // key
        r, // result array
      ) {
        // initialize object and result
        r = [];
        // iterate over object keys
        for (k in o)
        // fill result array with non-prototypical keys
        { r.hasOwnProperty.call(o, k) && r.push(k); }
        // return result
        return r;
      };
    }

    // set data-selected on select element if the value has been programmatically selected
    // prior to initialization of bootstrap-select
    // * consider removing or replacing an alternative method *
    const valHooks = {
      useDefault: false,
      _set: $.valHooks.select.set,
    };

    $.valHooks.select.set = function (elem, value) {
      if (value && !valHooks.useDefault) $(elem).data('selected', true);

      return valHooks._set.apply(this, arguments);
    };

    let changed_arguments = null;
    $.fn.triggerNative = function (eventName) {
      const el = this[0];
      let event;

      if (el.dispatchEvent) { // for modern browsers & IE9+
        if (typeof Event === 'function') {
          // For modern browsers
          event = new Event(eventName, {
            bubbles: true,
          });
        } else {
          // For IE since it doesn't support Event constructor
          event = document.createEvent('Event');
          event.initEvent(eventName, true, false);
        }

        el.dispatchEvent(event);
      } else if (el.fireEvent) { // for IE8
        event = document.createEventObject();
        event.eventType = eventName;
        el.fireEvent(`on${eventName}`, event);
      } else {
        // fall back to jQuery.trigger
        this.trigger(eventName);
      }
    };
    // </editor-fold>

    // Case insensitive contains search
    $.expr.pseudos.icontains = function (obj, index, meta) {
      const $obj = $(obj).find('span.dropdown-item-inner');
      const haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
      return haystack.includes(meta[3].toUpperCase());
    };

    // Case insensitive begins search
    $.expr.pseudos.ibegins = function (obj, index, meta) {
      const $obj = $(obj).find('span.dropdown-item-inner');
      const haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
      return haystack.startsWith(meta[3].toUpperCase());
    };

    // Case and accent insensitive contains search
    $.expr.pseudos.aicontains = function (obj, index, meta) {
      const $obj = $(obj).find('span.dropdown-item-inner');
      const haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
      return haystack.includes(meta[3].toUpperCase());
    };

    // Case and accent insensitive begins search
    $.expr.pseudos.aibegins = function (obj, index, meta) {
      const $obj = $(obj).find('span.dropdown-item-inner');
      const haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
      return haystack.startsWith(meta[3].toUpperCase());
    };

    /**
         * Remove all diatrics from the given text.
         * @access private
         * @param {String} text
         * @returns {String}
         */
    function normalizeToBase(text) {
      const rExps = [
        { re: /[\xC0-\xC6]/g, ch: 'A' },
        { re: /[\xE0-\xE6]/g, ch: 'a' },
        { re: /[\xC8-\xCB]/g, ch: 'E' },
        { re: /[\xE8-\xEB]/g, ch: 'e' },
        { re: /[\xCC-\xCF]/g, ch: 'I' },
        { re: /[\xEC-\xEF]/g, ch: 'i' },
        { re: /[\xD2-\xD6]/g, ch: 'O' },
        { re: /[\xF2-\xF6]/g, ch: 'o' },
        { re: /[\xD9-\xDC]/g, ch: 'U' },
        { re: /[\xF9-\xFC]/g, ch: 'u' },
        { re: /[\xC7-\xE7]/g, ch: 'c' },
        { re: /[\xD1]/g, ch: 'N' },
        { re: /[\xF1]/g, ch: 'n' },
      ];
      $.each(rExps, function () {
        text = text ? text.replace(this.re, this.ch) : '';
      });
      return text;
    }

    // List of HTML entities for escaping.
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '`': '&#x60;',
    };

    const unescapeMap = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': '\'',
      '&#x60;': '`',
    };

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    const createEscaper = function (map) {
      const escaper = function (match) {
        return map[match];
      };
      // Regexes for identifying a key that needs to be escaped.
      const source = `(?:${Object.keys(map).join('|')})`;
      const testRegexp = RegExp(source);
      const replaceRegexp = RegExp(source, 'g');
      return function (string) {
        string = string == null ? '' : `${string}`;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    };

    const htmlEscape = createEscaper(escapeMap);
    const htmlUnescape = createEscaper(unescapeMap);

    const Selectpicker = function (element, options) {
      // bootstrap-select has been initialized - revert valHooks.select.set back to its original function
      if (!valHooks.useDefault) {
        $.valHooks.select.set = valHooks._set;
        valHooks.useDefault = true;
      }

      this.$element = $(element);
      this.$newElement = null;
      this.$button = null;
      this.$menu = null;
      this.$lis = null;
      this.options = options;

      // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
      // data-attribute)
      if (this.options.title === null) {
        this.options.title = this.$element.attr('title');
      }

      // Format window padding
      const winPad = this.options.windowPadding;
      if (typeof winPad === 'number') {
        this.options.windowPadding = [winPad, winPad, winPad, winPad];
      }

      // Expose public methods
      this.val = Selectpicker.prototype.val;
      this.render = Selectpicker.prototype.render;
      this.refresh = Selectpicker.prototype.refresh;
      this.setStyle = Selectpicker.prototype.setStyle;
      this.selectAll = Selectpicker.prototype.selectAll;
      this.deselectAll = Selectpicker.prototype.deselectAll;
      this.destroy = Selectpicker.prototype.destroy;
      this.remove = Selectpicker.prototype.remove;
      this.show = Selectpicker.prototype.show;
      this.hide = Selectpicker.prototype.hide;

      this.init();
    };

    Selectpicker.VERSION = '1.12.2';

    // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
    Selectpicker.DEFAULTS = {
      noneSelectedText: 'Nothing selected',
      noneResultsText: 'No results matched {0}',
      countSelectedText(numSelected, numTotal) {
        return (numSelected == 1) ? '{0} item selected' : '{0} items selected';
      },
      maxOptionsText(numAll, numGroup) {
        return [
          (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
          (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)',
        ];
      },
      selectAllText: 'Select All',
      deselectAllText: 'Deselect All',
      doneButton: false,
      doneButtonText: 'Close',
      multipleSeparator: ', ',
      styleBase: 'btn',
      style: 'btn-default btn-light', // bootstrap4: btn-default replaced by btn-light
      size: 'auto',
      title: null,
      selectedTextFormat: 'values',
      width: false,
      container: false,
      hideDisabled: false,
      showSubtext: false,
      showIcon: true,
      showContent: true,
      dropupAuto: true,
      header: false,
      liveSearch: false,
      liveSearchPlaceholder: null,
      liveSearchNormalize: false,
      liveSearchStyle: 'contains',
      actionsBox: false,
      iconBase: 'fa',
      tickIcon: 'fa-check',
      showTick: false,
      template: {
        caret: '<span class="caret"></span>',
      },
      maxOptions: false,
      mobile: false,
      selectOnTab: false,
      dropdownAlignRight: false,
      windowPadding: 0,
    };

    Selectpicker.prototype = {

      constructor: Selectpicker,

      init() {
        const that = this;
        const id = this.$element.attr('id');

        this.$element.addClass('bs-select-hidden');

        // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
        // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
        this.liObj = {};
        this.multiple = this.$element.prop('multiple');
        this.autofocus = this.$element.prop('autofocus');
        this.$newElement = this.createView();
        this.$element.after(this.$newElement).appendTo(this.$newElement);
        this.$button = this.$newElement.children('button');
        this.$menu = this.$newElement.children('.dropdown-menu');
        this.$menuInner = this.$menu.children('.inner');
        this.$searchbox = this.$menu.find('input');

        this.$element.removeClass('bs-select-hidden');

        if (this.options.dropdownAlignRight === true) this.$menu.addClass('dropdown-menu-right');

        if (typeof id !== 'undefined') {
          this.$button.attr('data-id', id);
          $(`label[for="${id}"]`).click((e) => {
            e.preventDefault();
            that.$button.focus();
          });
        }

        this.checkDisabled();
        this.clickListener();
        if (this.options.liveSearch) this.liveSearchListener();
        this.render();
        this.setStyle();
        this.setWidth();
        if (this.options.container) this.selectPosition();
        this.$menu.data('this', this);
        this.$newElement.data('this', this);
        if (this.options.mobile) this.mobile();

        this.$newElement.on({
          'hide.bs.dropdown': function (e) {
            that.$menuInner.attr('aria-expanded', false);
            that.$element.trigger('hide.bs.select', e);
          },
          'hidden.bs.dropdown': function (e) {
            that.$element.trigger('hidden.bs.select', e);
          },
          'show.bs.dropdown': function (e) {
            that.$menuInner.attr('aria-expanded', true);
            that.$element.trigger('show.bs.select', e);
          },
          'shown.bs.dropdown': function (e) {
            that.$element.trigger('shown.bs.select', e);
          },
        });

        if (that.$element[0].hasAttribute('required')) {
          this.$element.on('invalid', () => {
            that.$button.addClass('bs-invalid').focus();

            that.$element.on({
              'focus.bs.select': function () {
                that.$button.focus();
                that.$element.off('focus.bs.select');
              },
              'shown.bs.select': function () {
                that.$element.val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                  .off('shown.bs.select');
              },
              'rendered.bs.select': function () {
                // if select is no longer invalid, remove the bs-invalid class
                if (this.validity.valid) that.$button.removeClass('bs-invalid');
                that.$element.off('rendered.bs.select');
              },
            });
          });
        }

        setTimeout(() => {
          that.$element.trigger('loaded.bs.select');
        });
      },

      createDropdown() {
        // Options
        // If we are multiple or showTick option is set, then add the show-tick class
        const showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '';
        const inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '';
        const autofocus = this.autofocus ? ' autofocus' : '';
        // Elements
        const header = this.options.header ? `<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>${this.options.header}</div>` : '';
        const searchbox = this.options.liveSearch
          ? '<div class="bs-searchbox">'
                    + `<input type="text" class="form-control" autocomplete="off"${
                      this.options.liveSearchPlaceholder === null ? '' : ` placeholder="${htmlEscape(this.options.liveSearchPlaceholder)}"`} role="textbox" aria-label="Search">`
                    + '</div>'
          : '';
        const actionsbox = this.multiple && this.options.actionsBox
          ? '<div class="bs-actionsbox">'
                    + '<div class="btn-group btn-group-sm btn-block">'
                    + `<button type="button" class="actions-btn bs-select-all btn btn-default btn-light">${
                      this.options.selectAllText
                    }</button>`
                    + `<button type="button" class="actions-btn bs-deselect-all btn btn-default btn-light">${
                      this.options.deselectAllText
                    }</button>`
                    + '</div>'
                    + '</div>'
          : '';
        const donebutton = this.multiple && this.options.doneButton
          ? '<div class="bs-donebutton">'
                    + '<div class="btn-group btn-block">'
                    + `<button type="button" class="btn btn-sm btn-default btn-light">${
                      this.options.doneButtonText
                    }</button>`
                    + '</div>'
                    + '</div>'
          : '';
        const drop = `<div class="btn-group bootstrap-select${showTick}${inputGroup}">`
                    + `<button type="button" class="${this.options.styleBase} dropdown-toggle" data-toggle="dropdown"${autofocus} role="button">`
                    + '<span class="filter-option pull-left"></span>&nbsp;'
                    + `<span class="bs-caret">${
                      this.options.template.caret
                    }</span>`
                    + '</button>'
                    + `<div class="dropdown-menu open" role="combobox">${
                      header
                    }${searchbox
                    }${actionsbox
                    }<div class="dropdown-menu inner" role="listbox" aria-expanded="false">`
                    + `</div>${
                      donebutton
                    }</div>`
                    + '</div>';

        return $(drop);
      },

      createView() {
        const $drop = this.createDropdown();
        const li = this.createLi();

        $drop.find('div.inner')[0].innerHTML = li;
        return $drop;
      },

      reloadLi() {
        // rebuild
        const li = this.createLi();
        this.$menuInner[0].innerHTML = li;
      },

      createLi() {
        const that = this;
        const _li = [];
        let optID = 0;
        const titleOption = document.createElement('option');
        let liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

        // Helper functions
        /**
                 * @param content
                 * @param [index]
                 * @param [classes]
                 * @param [optgroup]
                 * @returns {string}
                 */
        const generateA = function (content, index, classes, optgroup) {
          classes = `dropdown-item ${classes || ''}`;
          return `<a tabindex="0"${
            (typeof classes !== 'undefined' && classes !== '') ? ` class="${classes}"` : ''
          }${(typeof index !== 'undefined' && index !== null) ? ` data-original-index="${index}"` : ''
          }${(typeof optgroup !== 'undefined' && optgroup !== null) ? `data-optgroup="${optgroup}"` : ''
          }>${content}</a>`;
        };

        const generateDiv = function (content, classes, optgroup) {
          return `<div${
            (typeof classes !== 'undefined' && classes !== '') ? ` class="${classes}"` : ''
          }${(typeof optgroup !== 'undefined' && optgroup !== null) ? ` data-optgroup="${optgroup}"` : ''
          }>${content}</div>`;
        };

        /**
                 * @param text
                 * @param [classes]
                 * @param [inline]
                 * @param [tokens]
                 * @returns {string}
                 */
        const generateSpan = function (text, classes, inline, tokens) {
          // support bootstrap v4: http://v4-alpha.getbootstrap.com/components/dropdowns/#single-button-dropdowns
          classes = `dropdown-item-inner ${classes || ''}`;
          return `<span${
            typeof classes !== 'undefined' ? ` class="${classes}"` : ''
          }${inline ? ` style="${inline}"` : ''
          }${that.options.liveSearchNormalize ? ` data-normalized-text="${normalizeToBase(htmlEscape($(text).html()))}"` : ''
          }${typeof tokens !== 'undefined' || tokens !== null ? ` data-tokens="${tokens}"` : ''
          } role="option">${text
          }<span class="${that.options.iconBase} ${that.options.tickIcon} check-mark"></span>`
                        + '</span>';
        };

        if (this.options.title && !this.multiple) {
          // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
          // since liObj is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
          liIndex--;

          if (!this.$element.find('.bs-title-option').length) {
            // Use native JS to prepend option (faster)
            const element = this.$element[0];
            titleOption.className = 'bs-title-option';
            titleOption.innerHTML = this.options.title;
            titleOption.value = '';
            element.insertBefore(titleOption, element.firstChild);
            // Check if selected or data-selected attribute is already set on an option. If not, select the titleOption option.
            // the selected item may have been changed by user or programmatically before the bootstrap select plugin runs,
            // if so, the select will have the data-selected attribute
            const $opt = $(element.options[element.selectedIndex]);
            if ($opt.attr('selected') === undefined && this.$element.data('selected') === undefined) {
              titleOption.selected = true;
            }
          }
        }

        const $selectOptions = this.$element.find('option');

        $selectOptions.each(function (index) {
          const $this = $(this);

          liIndex++;

          if ($this.hasClass('bs-title-option')) return;

          // Get the class and text for the option
          const optionClass = this.className || '';
          const inline = htmlEscape(this.style.cssText);
          let text = $this.data('content') ? $this.data('content') : $this.html();
          const tokens = $this.data('tokens') ? $this.data('tokens') : null;
          const subtext = typeof $this.data('subtext') !== 'undefined' ? `<small class="text-muted">${$this.data('subtext')}</small>` : '';
          let icon = typeof $this.data('icon') !== 'undefined' ? `<span class="${that.options.iconBase} ${$this.data('icon')}"></span> ` : '';
          const $parent = $this.parent();
          const isOptgroup = $parent[0].tagName === 'OPTGROUP';
          const isOptgroupDisabled = isOptgroup && $parent[0].disabled;
          const isDisabled = this.disabled || isOptgroupDisabled;
          let prevHiddenIndex;

          if (icon !== '' && isDisabled) {
            icon = `<span>${icon}</span>`;
          }

          if (that.options.hideDisabled && (isDisabled && !isOptgroup || isOptgroupDisabled)) {
            // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
            // used to determine whether or not a divider should be placed after an optgroup if there are
            // hidden options between the optgroup and the first visible option
            prevHiddenIndex = $this.data('prevHiddenIndex');
            $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

            liIndex--;
            return;
          }

          if (!$this.data('content')) {
            // Prepend any icon and append any subtext to the main text.
            text = `${icon}<span class="text">${text}${subtext}</span>`;
          }

          if (isOptgroup && $this.data('divider') !== true) {
            if (that.options.hideDisabled && isDisabled) {
              if ($parent.data('allOptionsDisabled') === undefined) {
                const $options = $parent.children();
                $parent.data('allOptionsDisabled', $options.filter(':disabled').length === $options.length);
              }

              if ($parent.data('allOptionsDisabled')) {
                liIndex--;
                return;
              }
            }

            const optGroupClass = ` ${$parent[0].className}` || '';

            if ($this.index() === 0) { // Is it the first option of the optgroup?
              optID += 1;

              // Get the opt group label
              let { label } = $parent[0];
              const labelSubtext = typeof $parent.data('subtext') !== 'undefined' ? `<small class="text-muted">${$parent.data('subtext')}</small>` : '';
              const labelIcon = $parent.data('icon') ? `<span class="${that.options.iconBase} ${$parent.data('icon')}"></span> ` : '';

              label = `${labelIcon}<span class="text">${htmlEscape(label)}${labelSubtext}</span>`;

              if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
                liIndex++;
                _li.push(generateDiv('', 'dropdown-divider', `${optID}div`));
              }
              liIndex++;
              _li.push(generateDiv(label, `dropdown-header${optGroupClass}`, optID));
            }

            if (that.options.hideDisabled && isDisabled) {
              liIndex--;
              return;
            }

            _li.push(generateA(generateSpan(text, `opt ${optionClass}${optGroupClass}`, inline, tokens), index, '', optID));
          } else if ($this.data('divider') === true) {
            _li.push(generateDiv('', 'dropdown-divider', `${optID}div`));
          } else if ($this.data('hidden') === true) {
            // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
            // used to determine whether or not a divider should be placed after an optgroup if there are
            // hidden options between the optgroup and the first visible option
            prevHiddenIndex = $this.data('prevHiddenIndex');
            $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

            _li.push(generateA(generateSpan(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
          } else {
            let showDivider = this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP';

            // if previous element is not an optgroup and hideDisabled is true
            if (!showDivider && that.options.hideDisabled) {
              prevHiddenIndex = $this.data('prevHiddenIndex');

              if (prevHiddenIndex !== undefined) {
                // select the element **before** the first hidden element in the group
                const prevHidden = $selectOptions.eq(prevHiddenIndex)[0].previousElementSibling;

                if (prevHidden && prevHidden.tagName === 'OPTGROUP' && !prevHidden.disabled) {
                  showDivider = true;
                }
              }
            }

            if (showDivider) {
              liIndex++;
              _li.push(generateDiv('', 'dropdown-divider', `${optID}div`));
            }
            _li.push(generateA(generateSpan(text, optionClass, inline, tokens), index));
          }

          that.liObj[index] = liIndex;
        });

        // If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
        if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
          this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
        }

        return _li.join('');
      },

      findLis() {
        if (this.$lis == null) this.$lis = this.$menu.find('a, .dropdown-header, .dropdown-divider');
        return this.$lis;
      },

      /**
             * @param [updateLi] defaults to true
             */
      render(updateLi) {
        const that = this;
        let notDisabled;
        const $selectOptions = this.$element.find('option');

        // Update the LI to match the SELECT
        if (updateLi !== false) {
          $selectOptions.each(function (index) {
            const $lis = that.findLis().eq(that.liObj[index]);

            that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
            that.setSelected(index, this.selected, $lis);
          });
        }

        this.togglePlaceholder();

        this.tabIndex();

        const selectedItems = $selectOptions.map(function () {
          if (this.selected) {
            if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

            const $this = $(this);
            const icon = $this.data('icon') && that.options.showIcon ? `<i class="${that.options.iconBase} ${$this.data('icon')}"></i> ` : '';
            let subtext;

            if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
              subtext = ` <small class="text-muted">${$this.data('subtext')}</small>`;
            } else {
              subtext = '';
            }
            if (typeof $this.attr('title') !== 'undefined') {
              return $this.attr('title');
            } if ($this.data('content') && that.options.showContent) {
              return $this.data('content').toString();
            }
            return icon + $this.html() + subtext;
          }
        }).toArray();

        // Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
        // Convert all the values into a comma delimited string
        let title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

        // If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
        if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
          const max = this.options.selectedTextFormat.split('>');
          if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
            notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
            const totalCount = $selectOptions.not(`[data-divider="true"], [data-hidden="true"]${notDisabled}`).length;
            const tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
            title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
          }
        }

        if (this.options.title == undefined) {
          this.options.title = this.$element.attr('title');
        }

        if (this.options.selectedTextFormat == 'static') {
          title = this.options.title;
        }

        // If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
        if (!title) {
          title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
        }

        // strip all HTML tags and trim the result, then unescape any escaped tags
        this.$button.attr('title', htmlUnescape($.trim(title.replace(/<[^>]*>?/g, ''))));
        this.$button.children('.filter-option').html(title);

        this.$element.trigger('rendered.bs.select');
      },

      /**
             * @param [style]
             * @param [status]
             */
      setStyle(style, status) {
        if (this.$element.attr('class')) {
          this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
        }

        const buttonClass = style || this.options.style;

        if (status == 'add') {
          this.$button.addClass(buttonClass);
        } else if (status == 'remove') {
          this.$button.removeClass(buttonClass);
        } else {
          this.$button.removeClass(this.options.style);
          this.$button.addClass(buttonClass);
        }
      },
      updatePosition() {
        // this fixes https://github.com/heimrichhannot/bootstrap-select/issues/4
        const event = this.$menu.get(0).ownerDocument.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        this.$menu.get(0).ownerDocument.dispatchEvent(event);
      },
      liHeight(refresh) {
        if (!refresh && (this.options.size === false || this.sizeInfo)) return;

        const newElement = document.createElement('div');
        const menu = document.createElement('div');
        const menuInner = document.createElement('ul');
        const divider = document.createElement('a');
        const li = document.createElement('a');
        const a = document.createElement('span');
        const text = document.createElement('span');
        const header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null;
        const search = this.options.liveSearch ? document.createElement('div') : null;
        const actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null;
        const doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

        text.className = 'text';
        newElement.className = `${this.$menu[0].parentNode.className} show open`; // bootstrap 4 requires show instead of open
        menu.className = 'dropdown-menu open show';
        menuInner.className = 'dropdown-menu inner';
        divider.className = 'dropdown-divider';
        a.className = 'dropdown-item-inner';

        text.appendChild(document.createTextNode('Inner text'));

        a.appendChild(text);
        li.appendChild(a);
        menuInner.appendChild(li);
        menuInner.appendChild(divider);
        if (header) menu.appendChild(header);
        if (search) {
          const input = document.createElement('input');
          search.className = 'bs-searchbox';
          input.className = 'form-control';
          search.appendChild(input);
          menu.appendChild(search);
        }
        if (actions) menu.appendChild(actions);
        menu.appendChild(menuInner);
        if (doneButton) menu.appendChild(doneButton);
        newElement.appendChild(menu);

        document.body.appendChild(newElement);

        const liHeight = a.offsetHeight;
        const headerHeight = header ? header.offsetHeight : 0;
        const searchHeight = search ? search.offsetHeight : 0;
        const actionsHeight = actions ? actions.offsetHeight : 0;
        const doneButtonHeight = doneButton ? doneButton.offsetHeight : 0;
        const dividerHeight = $(divider).outerHeight(true);
        // fall back to jQuery if getComputedStyle is not supported
        const menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false;
        const $menu = menuStyle ? null : $(menu);
        const menuPadding = {
          vert: parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop'))
                        + parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom'))
                        + parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth'))
                        + parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
          horiz: parseInt(menuStyle ? menuStyle.paddingLeft : $menu.css('paddingLeft'))
                        + parseInt(menuStyle ? menuStyle.paddingRight : $menu.css('paddingRight'))
                        + parseInt(menuStyle ? menuStyle.borderLeftWidth : $menu.css('borderLeftWidth'))
                        + parseInt(menuStyle ? menuStyle.borderRightWidth : $menu.css('borderRightWidth')),
        };
        const menuExtras = {
          vert: menuPadding.vert
                        + parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop'))
                        + parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2,
          horiz: menuPadding.horiz
                        + parseInt(menuStyle ? menuStyle.marginLeft : $menu.css('marginLeft'))
                        + parseInt(menuStyle ? menuStyle.marginRight : $menu.css('marginRight')) + 2,
        };

        document.body.removeChild(newElement);

        this.sizeInfo = {
          liHeight,
          headerHeight,
          searchHeight,
          actionsHeight,
          doneButtonHeight,
          dividerHeight,
          menuPadding,
          menuExtras,
        };
      },

      setSize() {
        this.findLis();
        this.liHeight();

        if (this.options.header) this.$menu.css('padding-top', 0);
        if (this.options.size === false) return;

        const that = this;
        const { $menu } = this;
        const { $menuInner } = this;
        const $window = $(window);
        const selectHeight = this.$newElement[0].offsetHeight;
        const selectWidth = this.$newElement[0].offsetWidth;
        const { liHeight } = this.sizeInfo;
        const { headerHeight } = this.sizeInfo;
        const { searchHeight } = this.sizeInfo;
        const { actionsHeight } = this.sizeInfo;
        const { doneButtonHeight } = this.sizeInfo;
        const divHeight = this.sizeInfo.dividerHeight;
        const { menuPadding } = this.sizeInfo;
        const { menuExtras } = this.sizeInfo;
        const notDisabled = this.options.hideDisabled ? '.disabled' : '';
        let menuHeight;
        let menuWidth;
        let getHeight;
        let getWidth;
        let selectOffsetTop;
        let selectOffsetBot;
        let selectOffsetLeft;
        let selectOffsetRight;
        const getPos = function () {
          const pos = that.$newElement.offset();
          const $container = $(that.options.container);
          let containerPos;

          if (that.options.container && !$container.is('body')) {
            containerPos = $container.offset();
            containerPos.top += parseInt($container.css('borderTopWidth'));
            containerPos.left += parseInt($container.css('borderLeftWidth'));
          } else {
            containerPos = { top: 0, left: 0 };
          }

          const winPad = that.options.windowPadding;
          selectOffsetTop = pos.top - containerPos.top - $window.scrollTop();
          selectOffsetBot = $window.height() - selectOffsetTop - selectHeight - containerPos.top - winPad[2];
          selectOffsetLeft = pos.left - containerPos.left - $window.scrollLeft();
          selectOffsetRight = $window.width() - selectOffsetLeft - selectWidth - containerPos.left - winPad[1];
          selectOffsetTop -= winPad[0];
          selectOffsetLeft -= winPad[3];
        };

        getPos();

        if (this.options.size === 'auto') {
          const getSize = function () {
            let minHeight;
            const hasClass = function (className, include) {
              return function (element) {
                if (include) {
                  return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                }
                return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
              };
            };
            const lis = that.$menuInner[0].getElementsByTagName('a');
            const lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('d-none', false)) : that.$lis.not('.d-none');
            const optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

            getPos();
            menuHeight = selectOffsetBot - menuExtras.vert;
            menuWidth = selectOffsetRight - menuExtras.horiz;

            if (that.options.container) {
              if (!$menu.data('height')) $menu.data('height', $menu.height());
              getHeight = $menu.data('height');

              if (!$menu.data('width')) $menu.data('width', $menu.width());
              getWidth = $menu.data('width');
            } else {
              getHeight = $menu.height();
              getWidth = $menu.width();
            }

            if (that.options.dropupAuto) {
              that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
            }

            if (that.$newElement.hasClass('dropup')) {
              menuHeight = selectOffsetTop - menuExtras.vert;
            }

            if (that.options.dropdownAlignRight === 'auto') {
              $menu.toggleClass('dropdown-menu-right', selectOffsetLeft > selectOffsetRight && (menuWidth - menuExtras.horiz) < (getWidth - selectWidth));
            }

            if ((lisVisible.length + optGroup.length) > 3) {
              minHeight = liHeight * 3 + menuExtras.vert - 2;
            } else {
              minHeight = 0;
            }

            $menu.css({
              'max-height': `${menuHeight}px`,
              overflow: 'hidden',
              'min-height': `${minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight}px`,
            });
            $menuInner.css({
              'max-height': `${menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding.vert}px`,
              'overflow-y': 'auto',
              'min-height': `${Math.max(minHeight - menuPadding.vert, 0)}px`,
            });
          };
          getSize();
          this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
          $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
        } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
          const optIndex = this.$lis.not('.dropdown-divider').not(notDisabled).children().slice(0, this.options.size)
            .last()
            .parent()
            .index();
          const divLength = this.$lis.slice(0, optIndex + 1).filter('.dropdown-divider').length;
          menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding.vert;

          if (that.options.container) {
            if (!$menu.data('height')) $menu.data('height', $menu.height());
            getHeight = $menu.data('height');
          } else {
            getHeight = $menu.height();
          }

          if (that.options.dropupAuto) {
            // noinspection JSUnusedAssignment
            this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
          }
          $menu.css({
            'max-height': `${menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight}px`,
            overflow: 'hidden',
            'min-height': '',
          });
          $menuInner.css({
            'max-height': `${menuHeight - menuPadding.vert}px`,
            'overflow-y': 'auto',
            'min-height': '',
          });
        }
      },

      setWidth() {
        if (this.options.width === 'auto') {
          this.$menu.css('min-width', '0');

          // Get correct width if element is hidden
          const $selectClone = this.$menu.parent().clone().appendTo('body');
          const $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone;
          const ulWidth = $selectClone.children('.dropdown-menu').outerWidth();
          const btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

          $selectClone.remove();
          $selectClone2.remove();

          // Set width to whatever's larger, button title or longest option
          this.$newElement.css('width', `${Math.max(ulWidth, btnWidth)}px`);
        } else if (this.options.width === 'fit') {
          // Remove inline min-width so width can be changed from 'auto'
          this.$menu.css('min-width', '');
          this.$newElement.css('width', '').addClass('fit-width');
        } else if (this.options.width) {
          // Remove inline min-width so width can be changed from 'auto'
          this.$menu.css('min-width', '');
          this.$newElement.css('width', this.options.width);
        } else {
          // Remove inline min-width/width so width can be changed
          this.$menu.css('min-width', '');
          this.$newElement.css('width', '');
        }
        // Remove fit-width class if width is changed programmatically
        if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
          this.$newElement.removeClass('fit-width');
        }
      },

      selectPosition() {
        this.$bsContainer = $('<div class="bs-container" />');

        const that = this;
        const $container = $(this.options.container);
        let pos;
        let containerPos;
        let actualHeight;
        const getPlacement = function ($element) {
          that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
          pos = $element.offset();

          if (!$container.is('body')) {
            containerPos = $container.offset();
            containerPos.top += parseInt($container.css('borderTopWidth')) - $container.scrollTop();
            containerPos.left += parseInt($container.css('borderLeftWidth')) - $container.scrollLeft();
          } else {
            containerPos = { top: 0, left: 0 };
          }

          actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;

          that.$bsContainer.css({
            top: pos.top - containerPos.top + actualHeight,
            left: pos.left - containerPos.left,
            width: $element[0].offsetWidth,
          });
        };

        this.$button.on('click', function () {
          const $this = $(this);

          if (that.isDisabled()) {
            return;
          }

          getPlacement(that.$newElement);

          that.$bsContainer.appendTo(that.options.container).toggleClass('open', !$this.hasClass('open')).append(that.$menu);
        });

        $(window).on('resize scroll', () => {
          getPlacement(that.$newElement);
        });

        this.$element.on('hide.bs.select', () => {
          that.$menu.data('height', that.$menu.height());
          that.$bsContainer.detach();
        });
      },

      /**
             * @param {number} index - the index of the option that is being changed
             * @param {boolean} selected - true if the option is being selected, false if being deselected
             * @param {JQuery} $lis - the 'li' element that is being modified
             */
      setSelected(index, selected, $lis) {
        if (!$lis) {
          this.togglePlaceholder(); // check if setSelected is being called by changing the value of the select
          $lis = this.findLis().eq(this.liObj[index]);
        }

        $lis.toggleClass('selected', selected).find('span.dropdown-item-inner').attr('aria-selected', selected);
      },

      /**
             * @param {number} index - the index of the option that is being disabled
             * @param {boolean} disabled - true if the option is being disabled, false if being enabled
             * @param {JQuery} $lis - the 'li' element that is being modified
             */
      setDisabled(index, disabled, $lis) {
        if (!$lis) {
          $lis = this.findLis().eq(this.liObj[index]);
        }

        if (disabled) {
          $lis.addClass('disabled').children('span.dropdown-item-inner').attr('href', '#').attr('tabindex', -1)
            .attr('aria-disabled', true);
        } else {
          $lis.removeClass('disabled').children('span.dropdown-item-inner').removeAttr('href').attr('tabindex', 0)
            .attr('aria-disabled', false);
        }
      },

      isDisabled() {
        return this.$element[0].disabled;
      },

      checkDisabled() {
        const that = this;

        if (this.isDisabled()) {
          this.$newElement.addClass('disabled');
          this.$button.addClass('disabled').attr('tabindex', -1).attr('aria-disabled', true);
        } else {
          if (this.$button.hasClass('disabled')) {
            this.$newElement.removeClass('disabled');
            this.$button.removeClass('disabled').attr('aria-disabled', false);
          }

          if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
            this.$button.removeAttr('tabindex');
          }
        }

        this.$button.click(() => !that.isDisabled());
      },

      togglePlaceholder() {
        const value = this.$element.val();
        this.$button.toggleClass('bs-placeholder', value === null || value === '' || (value.constructor === Array && value.length === 0));
      },

      tabIndex() {
        if (this.$element.data('tabindex') !== this.$element.attr('tabindex')
                    && (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
          this.$element.data('tabindex', this.$element.attr('tabindex'));
          this.$button.attr('tabindex', this.$element.data('tabindex'));
        }

        this.$element.attr('tabindex', -98);
      },

      clickListener() {
        const that = this;
        const $document = $(document);

        $document.data('spaceSelect', false);

        this.$button.on('keyup', (e) => {
          if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
            e.preventDefault();
            $document.data('spaceSelect', false);
          }
        });

        this.$button.on('click', () => {
          that.setSize();
        });

        this.$element.on('shown.bs.select', () => {
          if (!that.options.liveSearch && !that.multiple) {
            that.$menuInner.find('a.selected').focus();
          } else if (!that.multiple) {
            const selectedIndex = that.liObj[that.$element[0].selectedIndex];

            if (typeof selectedIndex !== 'number' || that.options.size === false) return;

            // scroll to selected option
            let offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
            offset = offset - that.$menuInner[0].offsetHeight / 2 + that.sizeInfo.liHeight / 2;
            that.$menuInner[0].scrollTop = offset;
          }
        });

        this.$menuInner.on('click', 'a', function (e) {
          const $this = $(this).find('span.dropdown-item-inner');
          const clickedIndex = $this.parent().data('originalIndex');
          const prevValue = that.$element.val();
          const prevIndex = that.$element.prop('selectedIndex');
          let triggerChange = true;

          // Don't close on multi choice menu
          if (that.multiple && that.options.maxOptions !== 1) {
            e.stopPropagation();
          }

          e.preventDefault();

          // Don't run if we have been disabled
          if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
            const $options = that.$element.find('option');
            const $option = $options.eq(clickedIndex);
            const state = $option.prop('selected');
            const $optgroup = $option.parent('optgroup');
            const { maxOptions } = that.options;
            const maxOptionsGrp = $optgroup.data('maxOptions') || false;

            if (!that.multiple) { // Deselect all others if not multi select box
              $options.prop('selected', false);
              $option.prop('selected', true);
              that.$menuInner.find('.selected').removeClass('selected').find('span.dropdown-item-inner').attr('aria-selected', false);
              that.setSelected(clickedIndex, true);
            } else { // Toggle the one we have chosen if we are multi select.
              $option.prop('selected', !state);
              that.setSelected(clickedIndex, !state);
              $this.blur();

              if (maxOptions !== false || maxOptionsGrp !== false) {
                const maxReached = maxOptions < $options.filter(':selected').length;
                const maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

                if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                  if (maxOptions && maxOptions == 1) {
                    $options.prop('selected', false);
                    $option.prop('selected', true);
                    that.$menuInner.find('.selected').removeClass('selected');
                    that.setSelected(clickedIndex, true);
                  } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                    $optgroup.find('option:selected').prop('selected', false);
                    $option.prop('selected', true);
                    const optgroupID = $this.parent().data('optgroup');
                    that.$menuInner.find(`[data-optgroup="${optgroupID}"]`).removeClass('selected');
                    that.setSelected(clickedIndex, true);
                  } else {
                    const maxOptionsText = typeof that.options.maxOptionsText === 'string' ? [that.options.maxOptionsText, that.options.maxOptionsText] : that.options.maxOptionsText;
                    const maxOptionsArr = typeof maxOptionsText === 'function' ? maxOptionsText(maxOptions, maxOptionsGrp) : maxOptionsText;
                    let maxTxt = maxOptionsArr[0].replace('{n}', maxOptions);
                    let maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp);
                    const $notify = $('<div class="notify"></div>');
                    // If {var} is set in array, replace it
                    /** @deprecated */
                    if (maxOptionsArr[2]) {
                      maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                      maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                    }

                    $option.prop('selected', false);

                    that.$menu.append($notify);

                    if (maxOptions && maxReached) {
                      $notify.append($(`<div>${maxTxt}</div>`));
                      triggerChange = false;
                      that.$element.trigger('maxReached.bs.select');
                    }

                    if (maxOptionsGrp && maxReachedGrp) {
                      $notify.append($(`<div>${maxTxtGrp}</div>`));
                      triggerChange = false;
                      that.$element.trigger('maxReachedGrp.bs.select');
                    }

                    setTimeout(() => {
                      that.setSelected(clickedIndex, false);
                    }, 10);

                    $notify.delay(750).fadeOut(300, function () {
                      $(this).remove();
                    });
                  }
                }
              }
            }

            if (!that.multiple || (that.multiple && that.options.maxOptions === 1)) {
              that.$button.focus();
            } else if (that.options.liveSearch) {
              that.$searchbox.focus();
            }

            // Trigger select 'change'
            if (triggerChange) {
              if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
                // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
                changed_arguments = [clickedIndex, $option.prop('selected'), state];
                that.$element.triggerNative('change');
              }
            }
          }
        });

        this.$menu.on('click', 'a.disabled span.dropdown-item-inner , .popover-title, .popover-title :not(.close)', function (e) {
          if (e.currentTarget == this) {
            e.preventDefault();
            e.stopPropagation();
            if (that.options.liveSearch && !$(e.target).hasClass('close')) {
              that.$searchbox.focus();
            } else {
              that.$button.focus();
            }
          }
        });

        this.$menuInner.on('click', '.dropdown-divider, .dropdown-header', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (that.options.liveSearch) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }
        });

        this.$menu.on('click', '.popover-title .close', () => {
          that.$button.click();
        });

        this.$searchbox.on('click', (e) => {
          e.stopPropagation();
        });

        this.$menu.on('click', '.actions-btn', function (e) {
          if (that.options.liveSearch) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }

          e.preventDefault();
          e.stopPropagation();

          if ($(this).hasClass('bs-select-all')) {
            that.selectAll();
          } else {
            that.deselectAll();
          }
        });

        this.$element.change(() => {
          that.render(false);
          that.$element.trigger('changed.bs.select', changed_arguments);
          changed_arguments = null;
        });
      },

      liveSearchListener() {
        const that = this;
        const $no_results = $('<li class="no-results"></li>');

        this.$button.on('click.dropdown.data-api', () => {
          that.$menuInner.find('.active').removeClass('active');
          if (that.$searchbox.val()) {
            that.$searchbox.val('');
            that.$lis.not('.is-hidden').removeClass('d-none');
            if ($no_results.parent().length) $no_results.remove();
          }
          if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
          setTimeout(() => {
            that.$searchbox.focus();
          }, 10);
        });

        this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', (e) => {
          e.stopPropagation();
        });

        this.$searchbox.on('input propertychange', () => {
          that.$lis.not('.is-hidden').removeClass('d-none');
          that.$lis.filter('.active').removeClass('active');
          $no_results.remove();

          if (that.$searchbox.val()) {
            const $searchBase = that.$lis.not('.is-hidden, .dropdown-divider, .dropdown-header');
            let $hideItems;

            if (that.options.liveSearchNormalize) {
              $hideItems = $searchBase.not(`:a${that._searchStyle()}("${normalizeToBase(that.$searchbox.val())}")`);
            } else {
              $hideItems = $searchBase.not(`:${that._searchStyle()}("${that.$searchbox.val()}")`);
            }

            if ($hideItems.length === $searchBase.length) {
              $no_results.html(that.options.noneResultsText.replace('{0}', `"${htmlEscape(that.$searchbox.val())}"`));
              that.$menuInner.append($no_results);
              that.$lis.addClass('d-none');
            } else {
              $hideItems.addClass('d-none');

              const $lisVisible = that.$lis.not('.d-none');
              let $foundDiv;

              // hide divider if first or last visible, or if followed by another divider
              $lisVisible.each(function (index) {
                const $this = $(this);

                if ($this.hasClass('dropdown-divider')) {
                  if ($foundDiv === undefined) {
                    $this.addClass('d-none');
                  } else {
                    if ($foundDiv) $foundDiv.addClass('d-none');
                    $foundDiv = $this;
                  }
                } else if ($this.hasClass('dropdown-header') && $lisVisible.eq(index + 1).data('optgroup') !== $this.data('optgroup')) {
                  $this.addClass('d-none');
                } else {
                  $foundDiv = null;
                }
              });
              if ($foundDiv) $foundDiv.addClass('d-none');

              $searchBase.not('.d-none').first().addClass('active');
              that.$menuInner.scrollTop(0);
            }

            that.updatePosition();
          }
        });
      },

      _searchStyle() {
        const styles = {
          begins: 'ibegins',
          startsWith: 'ibegins',
        };

        return styles[this.options.liveSearchStyle] || 'icontains';
      },

      val(value) {
        if (typeof value !== 'undefined') {
          this.$element.val(value);
          this.render();

          return this.$element;
        }
        return this.$element.val();
      },

      changeAll(status) {
        if (!this.multiple) return;
        if (typeof status === 'undefined') status = true;

        this.findLis();

        const $options = this.$element.find('option');
        const $lisVisible = this.$lis.not('.dropdown-divider, .dropdown-header, .disabled, .d-none');
        const lisVisLen = $lisVisible.length;
        const selectedOptions = [];

        if (status) {
          if ($lisVisible.filter('.selected').length === $lisVisible.length) return;
        } else if ($lisVisible.filter('.selected').length === 0) return;

        $lisVisible.toggleClass('selected', status);

        for (let i = 0; i < lisVisLen; i++) {
          const origIndex = $lisVisible[i].getAttribute('data-original-index');
          selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
        }

        $(selectedOptions).prop('selected', status);

        this.render(false);

        this.togglePlaceholder();

        this.$element.triggerNative('change');
      },

      selectAll() {
        return this.changeAll(true);
      },

      deselectAll() {
        return this.changeAll(false);
      },

      toggle(e) {
        e = e || window.event;

        if (e) e.stopPropagation();

        this.$button.trigger('click');
      },

      keydown(e) {
        const $this = $(this);
        const $parent = $this.is('input') ? $this.parent().parent() : $this.parent();
        let $items;
        const that = $parent.data('this');
        let index;
        let prevIndex;
        let isActive;
        const selector = ':not(.disabled, .d-none, .dropdown-header, .dropdown-divider)';
        const keyCodeMap = {
          32: ' ',
          48: '0',
          49: '1',
          50: '2',
          51: '3',
          52: '4',
          53: '5',
          54: '6',
          55: '7',
          56: '8',
          57: '9',
          59: ';',
          65: 'a',
          66: 'b',
          67: 'c',
          68: 'd',
          69: 'e',
          70: 'f',
          71: 'g',
          72: 'h',
          73: 'i',
          74: 'j',
          75: 'k',
          76: 'l',
          77: 'm',
          78: 'n',
          79: 'o',
          80: 'p',
          81: 'q',
          82: 'r',
          83: 's',
          84: 't',
          85: 'u',
          86: 'v',
          87: 'w',
          88: 'x',
          89: 'y',
          90: 'z',
          96: '0',
          97: '1',
          98: '2',
          99: '3',
          100: '4',
          101: '5',
          102: '6',
          103: '7',
          104: '8',
          105: '9',
        };

        isActive = that.$newElement.hasClass('open') || that.$newElement.hasClass('show');

        if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
          if (!that.options.container) {
            that.setSize();
            that.$menu.parent().addClass('open show');
            isActive = true;
          } else {
            that.$button.trigger('click');
          }
          that.$searchbox.focus();
          return;
        }

        if (that.options.liveSearch) {
          if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive) {
            e.preventDefault();
            e.stopPropagation();
            that.$menuInner.click();
            that.$button.focus();
          }
        }

        if (/(38|40)/.test(e.keyCode.toString(10))) {
          $items = that.$lis.filter(selector);
          if (!$items.length) return;

          if (!that.options.liveSearch) {
            index = $items.index($items.filter(':focus'));
          } else {
            index = $items.index($items.filter('.active'));
          }

          prevIndex = that.$menuInner.data('prevIndex');

          if (e.keyCode == 38) {
            if ((that.options.liveSearch || index == prevIndex) && index != -1) index--;
            if (index < 0) index += $items.length;
          } else if (e.keyCode == 40) {
            if (that.options.liveSearch || index == prevIndex) index++;
            index %= $items.length;
          }

          that.$menuInner.data('prevIndex', index);

          if (!that.options.liveSearch) {
            $items.eq(index).focus();
          } else {
            e.preventDefault();
            if (!$this.hasClass('dropdown-toggle')) {
              $items.removeClass('active').eq(index).addClass('active').children('span.dropdown-item-inner')
                .focus();
              $this.focus();
            }
          }
        } else if (!$this.is('input')) {
          const keyIndex = [];
          let count;
          let prevKey;

          $items = that.$lis.filter(selector);
          $items.each(function (i) {
            if ($.trim($(this).children('span.dropdown-item-inner').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
              keyIndex.push(i);
            }
          });

          count = $(document).data('keycount');
          count++;
          $(document).data('keycount', count);

          prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

          if (prevKey != keyCodeMap[e.keyCode]) {
            count = 1;
            $(document).data('keycount', count);
          } else if (count >= keyIndex.length) {
            $(document).data('keycount', 0);
            if (count > keyIndex.length) count = 1;
          }

          $items.eq(keyIndex[count - 1]).children('span.dropdown-item-inner').focus();
        }

        // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
        if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
          if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
          if (!that.options.liveSearch) {
            const elem = $(':focus');
            elem.click();
            // Bring back focus for multiselects
            elem.focus();
            // Prevent screen from scrolling if the user hit the spacebar
            e.preventDefault();
            // Fixes spacebar selection of dropdown items in FF & IE
            $(document).data('spaceSelect', true);
          } else if (!/(32)/.test(e.keyCode.toString(10))) {
            that.$menuInner.find('a.active').click();
            $this.focus();
          }
          $(document).data('keycount', 0);
        }

        if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
          that.$menu.parent().removeClass('open');
          if (that.options.container) that.$newElement.removeClass('open');
          that.$button.focus();
        }
      },

      mobile() {
        this.$element.addClass('mobile-device');
      },

      refresh() {
        this.$lis = null;
        this.liObj = {};
        this.reloadLi();
        this.render();
        this.checkDisabled();
        this.liHeight(true);
        this.setStyle();
        this.setWidth();
        if (this.$lis) this.$searchbox.trigger('propertychange');

        this.$element.trigger('refreshed.bs.select');
      },

      hide() {
        this.$newElement.hide();
      },

      show() {
        this.$newElement.show();
      },

      remove() {
        this.$newElement.remove();
        this.$element.remove();
      },

      destroy() {
        this.$newElement.before(this.$element).remove();

        if (this.$bsContainer) {
          this.$bsContainer.remove();
        } else {
          this.$menu.remove();
        }

        this.$element.off('.bs.select').removeData('selectpicker').removeClass('bs-select-hidden selectpicker');
      },
    };

    // SELECTPICKER PLUGIN DEFINITION
    // ==============================
    function Plugin(option) {
      // get the args of the outer function..
      const args = arguments;
      // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
      // to get lost/corrupted in android 2.3 and IE9 #715 #775
      const _option = option;

      [].shift.apply(args);

      let value;
      const chain = this.each(function () {
        const $this = $(this);
        if ($this.is('select')) {
          let data = $this.data('selectpicker');
          const options = typeof _option === 'object' && _option;

          if (!data) {
            const config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
            config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
            $this.data('selectpicker', (data = new Selectpicker(this, config)));
          } else if (options) {
            for (const i in options) {
              if (options.hasOwnProperty(i)) {
                data.options[i] = options[i];
              }
            }
          }

          if (typeof _option === 'string') {
            if (data[_option] instanceof Function) {
              value = data[_option].apply(data, args);
            } else {
              value = data.options[_option];
            }
          }
        }
      });

      if (typeof value !== 'undefined') {
        // noinspection JSUnusedAssignment
        return value;
      }
      return chain;
    }

    const old = $.fn.selectpicker;
    $.fn.selectpicker = Plugin;
    $.fn.selectpicker.Constructor = Selectpicker;

    // SELECTPICKER NO CONFLICT
    // ========================
    $.fn.selectpicker.noConflict = function () {
      $.fn.selectpicker = old;
      return this;
    };

    $(document).data('keycount', 0).on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', Selectpicker.prototype.keydown).on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', (e) => {
      e.stopPropagation();
    });

    // SELECTPICKER DATA-API
    // =====================
    $(window).on('load.bs.select.data-api', () => {
      $('.selectpicker').each(function () {
        const $selectpicker = $(this);
        Plugin.call($selectpicker, $selectpicker.data());
      });
    });
  }(jQuery));
}));
