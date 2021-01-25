(function ($) {
    var defaults = {}
    $.fn.pos = function (options) {
        //define instance for use in child functions
        var $this = $(this);
        var data = {
            scan: '',
            swipe: ''
        };
        //set default options
        defaults = {
            scan: true,
            submit_on_scan: false,
            swipe: true,
            submit_on_swipe: false,
            events: {
                scan: {
                    barcode: 'scan.pos.barcode'
                },
                swipe: {
                    card: 'swipe.pos.card'
                }
            },
            regexp: {
                scan: {
                    barcode: '\\d+'
                },
                swipe: {
                    card: '\\%B(\\d+)\\^(\\w+)\\/(\\w+)\\^\\d+\\?;\\d+=(\\d\\d)(\\d\\d)\\d+\\?'
                }
            },
            prefix: {
                scan: {
                    barcode: ''
                },
                swipe: {
                    card: ''
                }
            }
        };
        //extend options
        $this.options = $.extend(true, {}, defaults, options);
        $this.keypress(function (event) {
            if ($("#AllProductList").is(":focus") === false && $(".quantity_cart").is(":focus") === false) {
                if ($this.options.scan) {
                    if (event.which === 13) {
                        if (!$this.options.submit_on_scan) {
                            event.preventDefault();
                        }
                        // const scanexp = new RegExp('^null|$');
                        if (data.scan) {
                        $this.trigger({
                            type: $this.options.events.scan.barcode,
                            // code: `'${data.scan}'`,
                            code: String(data.scan),
                            time: new Date()
                        });
                        }

                        data.scan = '';

                    } else {
                        var barcode_char = String.fromCharCode(event.which);
                        data.scan += barcode_char;
                        // charCode = typeof event.which === "number" ? event.which : event.data.scan;
                        // barcode_char = String.fromCharCode(charCode);
                        // array_codes.push(charCode)
                        // var final_barcode = `'${String.fromCharCode.apply(null, array_codes)}'`
                        // // data.scan = final_barcode;
                        // console.log(barcode_char, charCode, final_barcode)
                    }
                }

                if ($this.options.swipe) {
                    if (event.which === 13) {
                        if (!$this.options.submit_on_swipe) {
                            event.preventDefault();
                        }
                        var swipexp = new RegExp('^' + $this.options.prefix.swipe.card + $this.options.regexp.swipe.card + '$');
                        if (data.swipe.match(swipexp)) {
                            var swipe_match = swipexp.exec(data.swipe);
                            var date = new Date();
                            var year = date.getFullYear();
                            year = year.toString().substring(0, 2) + swipe_match[4];
                            $this.trigger({
                                type: $this.options.events.swipe.card,
                                swipe_data: swipe_match[0],
                                card_number: swipe_match[1],
                                card_holder_last_name: swipe_match[2],
                                card_holder_first_name: swipe_match[3],
                                card_exp_date_month: swipe_match[5],
                                card_exp_date_year_2: swipe_match[4],
                                card_exp_date_year_4: year,
                                time: date
                            });
                        }
                        data.swipe = '';
                    } else {
                        var char = String.fromCharCode(event.which);
                        data.swipe += char.replace(/ /g, '');
                    }
                }
            }
            // console.log($("#AllProductList").is(":focus"))

        });
    };
})(jQuery);
