(function($) {
    "use strict";

    var pluginName = 'renderAjax';
    
    // get <head> , if not exist , get <body> , else get document
    var $head = jQuery('head');
    if($head.length < 1) {
        $head = jQuery('body');
        if($head.length < 1) {
            $head = jQuery(document);
        }
    }
    
    
    /**
     * Render All content/css/scripts
     * @param {String} data
     * @param {Array} options
     * @returns {void}
     */
    var _render = function(data , options) {
        var contents = [];
        var scripts  = [];
        var links = [];
        
        jQuery(data).each(function(){
            var $ele = jQuery(this);
            var nodeName = jQuery(this)[0].nodeName;
            if(nodeName === 'LINK' && $ele.attr('href') !== undefined) {
                links.push(this);
            }
            else if(nodeName === 'SCRIPT') {
                scripts.push(this);
            } else {
                contents.push(this);
            }
        });

        if(options.renderMode === 'replace') {
            jQuery(options.targetElement).html('');
        }
        _renderLinks(links);
        _renderHtml(options.targetElement , options.renderMode , contents);
        _renderScripts(scripts);
    };
    
    /**
     * Render HTML Content
     * @param {jQuery} targetElement
     * @param {String} mode
     * @param {Array} contents
     * @returns {void}
     */
    var _renderHtml = function(targetElement , mode , contents) {
        switch(mode) {
            case 'replace':
            case 'append':
                jQuery(targetElement).append(contents);
                break;
            case 'prepend':
                jQuery(targetElement).prepend(contents);
                break;
            default:
                console.log('Not support mode ' + mode);
        }
    };
    
    /**
     * Render javascript scripts
     * @param {Array} scripts
     * @returns {void}
     */
    var _renderScripts = function(scripts) {
        jQuery(scripts).each(function() {
            if(jQuery(this).attr('src') === undefined) {
                // run inline script
                jQuery.globalEval(jQuery(this).text());
            } else {
               // append script to head
               var script = this;
               var append = true;
               jQuery('script[src]').each(function(){
                   if(this.src === script.src) {
                       append = false;
                       return false;
                   }
               });
               if(append) { $head.append(this); }
            }
        });
    };
    
    /**
     * Render css files
     * @param {Array} links
     * @returns {void}
     */
    var _renderLinks = function(links) {
        jQuery(links).each(function() {
            var link = this;
            var append = true;
            jQuery('link[href]').each(function(){
                if(jQuery(this).attr('href') === jQuery(link).attr('href')) {
                    append = false;
                    return false;
                }
            });
            if(append) { $head.append(this); }
        });
    };

    
    /**
     * Render content via Ajax
     * @param {Array} options
     * @returns {void}
     */
    function renderAjax(options) {
        if(undefined === options.renderMode) {
            options.renderMode = 'replace';
        }
        
        if(undefined === options.targetElement) {
            throw new Exception("options.targetElement not define.");
            return;
        }
        
        jQuery.extend(options , {
            success : function(data, status, xhr) {
                // trigger event beforeRender
                if(jQuery.isFunction(options.beforeRender)) {
                    options.beforeRender(data,options);
                }
                // render content
                _render(data , options);
                // triger event afterRender
                if(jQuery.isFunction(options.afterRender)) {
                     options.afterRender(data,options);
                }
            }
        });
        jQuery.ajax(options);
    };


    jQuery.renderAjax = function(options) {
        return new renderAjax(options);
    };
})(jQuery);
