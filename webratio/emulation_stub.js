function createStubs() {
    
    var actionSheet = null;

    var $ = window.top.jQuery;

    var buttonTemplate = "<button type=\"button\" style=\"display:block;background: #eee; text-align: center;width: 100%;border: 0;line-height: 2em;border-top: 1px solid #ccc;\" ></button>";

    function init() {                            

        var actionSheetTemplate = [
            "<section id=\"wr-actionsheet-emulator\" style=\"display:none; background: rgba(0, 0, 0, 0.5); position: absolute; width: 100%; height: 100%; z-index: 10000;\">",
            "<div style=\"position:absolute; bottom: 0; left: 10px; right: 10px;\" >",
            "<div id=\"wr-actionsheet-title\" style=\"background: #eee; text-align: center; font-weight: bold;line-height: 2em;\"></div>",
            "<div id=\"wr-actionsheet-btnlist\" ></div>",

            "</div>",
            "</section>"
        ].join("\n");

        var actionSheet = $(actionSheetTemplate);

        $('#overlay-views').append(actionSheet);

        return actionSheet
    }

    function log() {
        var args = [].slice.call(arguments, 0);
        args.unshift("[notification]");
        console.log.apply(console, args);
    }

    return {
        ActionSheet : {
            show : function(options) {
                log('show', options);
                if (!actionSheet) {
                    actionSheet = init();
                }

                $('#wr-actionsheet-title').text(options["title"] || '');
                $('#wr-actionsheet-btnlist').empty();

                var buttons = options["buttonLabels"];

                if (options["addDestructiveButtonWithLabel"]) {
                    buttons.unshift(options["addDestructiveButtonWithLabel"]);
                }

                for (var i = 0; i < buttons.length; i++) {
                    var btn = $(buttonTemplate).text(buttons[i]).data('btnIndex', i);
                    if (options["addDestructiveButtonWithLabel"] && i === 0) {
                        btn.css('color', '#f00');
                    }
                    $('#wr-actionsheet-btnlist').append(btn);
                }


                if (options["addCancelButtonWithLabel"]) {
                    var btn = $(buttonTemplate).text(options["addCancelButtonWithLabel"]).data('btnIndex', buttons.length);
                    $('#wr-actionsheet-btnlist').append(btn);
                }

                var p = new Promise(function(resolve, reject) {
                    $('#wr-actionsheet-btnlist button').click(function(e) {
                        e.preventDefault();
                        actionSheet.hide('slide', {direction: 'down', duration: 250});
                        var index = $(this).data('btnIndex');
                        if (index !== undefined) {
                            resolve($(this).data('btnIndex') + 1);    
                        } else {
                            reject();
                        }

                    });
                    actionSheet.show('slide', {direction: 'down', duration: 250});
                })

                return p;
            },

            hide : function() {                
                actionSheet && actionSheet.hide('slide', {direction: 'down', duration: 250});
            }
        }
    };
};