$.fn.togglepanels = function(){
	return this.each(function(){
		$(this).addClass("ui-accordion ui-accordion-icons ui-widget ui-helper-reset")
			.find("h3")
			.addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom")
			.hover(function() { $(this).toggleClass("ui-state-hover"); })
			.prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>')
			.click(function() {
				var that=$(this);
			  $(this)
				.toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom")
				.find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end()
				.next().slideToggle(400,function(){
					//$(this).parent().scrollTo(that);
				});
				
			  return false;
			})
			.next()
			.addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom")
			.hide();
	});
};

if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

String.prototype.format = function()
{
  var args = arguments;

  return this.replace(/{(\d+)}/g, function(match, number){
    return typeof args[number] != 'undefined' ? args[number] :
                                                '{' + number + '}';
  });
};

$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
        if (!this.options.title ) {
            title.html("&#160;");
        } else {
            title.html(this.options.title);
        }
    }
}));

/**
 * Returns whether the object has the class name
 * @param strClass Class name to check
 */
Element.prototype.ex_HasClassName= function(strClass){

   // if there is a class
   if ( this.className )
      {

      // the classes are just a space separated list, so first get the list
      var arrList = this.className.split(' ');

      // get uppercase class for comparison purposes
      var strClassUpper = strClass.toUpperCase();

      // find all instances and remove them
      for ( var i = 0; i < arrList.length; i++ )
         {

         // if class found
         if ( arrList[i].toUpperCase() == strClassUpper )
            {

            // we found it
            return true;
            }
         }

      }

   // if we got here then the class name is not there
   return false;

   };

/**
 * Adds the specified class name to the object.
 * @param strClass The class name to add
 */
Element.prototype.ex_AddClassName= function(strClass){
	// if there is a class
	if ( this.className ){
		// the classes are just a space separated list, so first get the list
		var arrList = this.className.split(' ');
		if (!this.ex_HasClassName(strClass)){

			arrList[arrList.length] = strClass;	// add the new class to end of list
			this.className = arrList.join(' ');	// assign modified class name attribute
		}

	}
	// if there was no class
	else{
		this.className = strClass;	// assign modified class name attribute
	}
};

$.extend({
    keys:    function(obj){
        var a = [];
        $.each(obj, function(k){ a.push(k) });
        return a;
    }
});

/**
 * Removes the specified class name from the object
 * @param strClass The class name to remove
 */
Element.prototype.ex_RemoveClassName = function(strClass){

   // if there is a class
   if ( this.className )
      {

      // the classes are just a space separated list, so first get the list
      var arrList = this.className.split(' ');

      // get uppercase class for comparison purposes
      var strClassUpper = strClass.toUpperCase();

      // find all instances and remove them
      for ( var i = 0; i < arrList.length; i++ )
         {

         // if class found
         if ( arrList[i].toUpperCase() == strClassUpper )
            {

            // remove array item
            arrList.splice(i, 1);

            // decrement loop counter as we have adjusted the array's contents
            i--;

            }

         }

      // assign modified class name attribute
      this.className = arrList.join(' ');

      }
   // if there was no class
   // there is nothing to remove

};

(function(window, $)
    {
        window.dnnModal = {
            load: function()
            {
                try
                {
                    if (parent.location.href !== undefined)
                    {
                        var windowTop = parent;
                        var parentTop = windowTop.parent;
                        if (typeof(parentTop.$find) != "undefined")
                        {
                            if (location.href.indexOf('popUp') == -1 || windowTop.location.href.indexOf("popUp") > -1)
                            {
                                var popup = windowTop.jQuery("#iPopUp");
                                var refresh = popup.dialog("option", "refresh");
                                var closingUrl = popup.dialog("option", "closingUrl");
                                var width = popup.dialog("option", "minWidth");
                                var height = popup.dialog("option", "minHeight");
                                var showReturn = popup.dialog("option", "showReturn");
                                if (!closingUrl)
                                {
                                    closingUrl = location.href;
                                }
                                if (popup.dialog('isOpen') === true)
                                {
                                    popup.dialog("option", {
                                        close: function(event, ui)
                                        {
                                            dnnModal.refreshPopup({
                                                url: closingUrl,
                                                width: width,
                                                height: height,
                                                showReturn: showReturn,
                                                refresh: refresh
                                            });
                                        }
                                    }).dialog('close');
                                }
                            } else
                            {
                                windowTop.jQuery("#iPopUp").dialog({
                                    autoOpen: false,
                                    title: document.title
                                });
                            }
                        }
                    }
                    return true;
                } catch (err)
                {
                    return false;
                }
            },
            show: function(url, showReturn, height, width, refresh, closingUrl)
            {
                var $modal = $("#iPopUp");
                if ($modal.length == 0)
                {
                    $modal = $("<iframe id=\"iPopUp\" src=\"about:blank\" scrolling=\"auto\" frameborder=\"0\"></iframe>");
                    $(document.body).append($modal);
                } else
                {
                    $modal.attr('src', 'about:blank');
                }
                $(document).find('html').css('overflow', 'hidden');
                $modal.dialog({
                    modal: true,
                    autoOpen: true,
                    dialogClass: "dnnFormPopup",
                    position: "center",
                    //minWidth:  width,
                    //minHeight: height,
                    //maxWidth: 1920,
                    //maxHeight: 1080,
                    width: screenwidth(70, width),
                    height: screenheight(70, height),
                    resizable: true,
                    closeOnEscape: true,
                    refresh: refresh,
                    showReturn: showReturn,
                    closingUrl: closingUrl,
                    close: function(event, ui) {
                        dnnModal.closePopUp(refresh, closingUrl);
                    }
                });
                var mask = dnn.addIframeMask($(".ui-widget-overlay")[0]);
                if (mask != null)
                {
                    mask.style.zIndex = 1;
                }
                if ($modal.parent().find('.ui-dialog-title').next('a.dnnModalCtrl').length === 0)
                {
                    var $dnnModalCtrl = $('<a class="dnnModalCtrl"></a>');
                    $modal.parent().find('.ui-dialog-titlebar-close').wrap($dnnModalCtrl);
                    var $dnnToggleMax = $('<a href="#" class="dnnToggleMax"><span>Max</span></a>');
                    $modal.parent().find('.ui-dialog-titlebar-close').before($dnnToggleMax);
                    $dnnToggleMax.click(function(e)
                        {
                            e.preventDefault();
                            var $window = $(window),
                                newHeight,
                                newWidth;
                            if ($modal.data('isMaximized'))
                            {
                                newHeight = $modal.data('height');
                                newWidth = $modal.data('width');
                                $modal.data('isMaximized', false);
                            } else
                            {
                                $modal.data('height', $modal.dialog("option", "minHeight"))
                                .data('width', $modal.dialog("option", "minWidth"))
                                .data('position', $modal.dialog("option", "position"));
                                newHeight = $window.height() - 46;
                                newWidth = $window.width() - 40;
                                $modal.data('isMaximized', true);
                            }
                            $modal.dialog({
                                height: newHeight,
                                width: newWidth
                            });
                            $modal.dialog({
                                position: 'center'
                            });
                        });
                }
                var showLoading = function()
                {
                    var loading = $("<div class=\"dnnLoading\"></div>");
                    loading.css({
                        width: $modal.width(),
                        height: $modal.height()
                    });
                    $modal.before(loading);
                };
                var hideLoading = function()
                {
                    $modal.prev(".dnnLoading").remove();
                };
                showLoading();
                $modal[0].src = url;
                $modal.bind("load", function()
                    {
                        hideLoading();
                    });
                if (showReturn.toString() == "true")
                {
                    return false;
                }
            },
            closePopUp: function(refresh, url)
            {
                var windowTop = parent; //needs to be assign to a varaible for Opera compatibility issues.
                var popup = windowTop.jQuery("#iPopUp");
                if (typeof refresh === "undefined" || refresh == null)
                {
                    refresh = true;
                }
                if (refresh.toString() == "true")
                {
                    if (typeof url === "undefined" || url == "")
                    {
                        url = windowTop.location.href;
                    }
                    windowTop.location.href = url;
                    if ($(".ui-widget-overlay").length > 0)
                    {
                        dnn.removeIframeMask($(".ui-widget-overlay")[0]);
                    }
                    popup.hide();
                } else
                {
                    if ($(".ui-widget-overlay").length > 0)
                    {
                        dnn.removeIframeMask($(".ui-widget-overlay")[0]);
                    }
                    popup.dialog('option', 'close', null).dialog('close');
                }
                $(windowTop.document).find('html').css('overflow', '');
            },

            refreshPopup: function(options)
            {
                var windowTop = parent;
                var windowTopTop = windowTop.parent;
                if (windowTop.location.href !== windowTopTop.location.href &&
                    windowTop.location.href !== options.url)
                {
                    windowTopTop.dnnModal.show(options.url, options.showReturn, options.height, options.width, options.refresh, options.closingUrl);
                } else
                {
                    dnnModal.closePopUp(options.refresh, options.url);
                }
            }
        };
        window.dnnModal.load();
    }(window, jQuery));



//perc is the percentage of the screen that you want to use from the available height of the screen

function screenheight(perc, preferredheight)

{

    av = $(window).height();

    perc = "." + perc;

    pix = av * perc;

    if (preferredheight)

    {

        if ((av - 50) > preferredheight)

        {

            return preferredheight;

        }

    }

    if (pix < 350)

        return 350;

    else

        return (pix); //returns of number of pixels

}

//perc is the percentage of the screen that you want to use from the available width of the screen

function screenwidth(perc, preferredwidth)

{

    av = $(window).width();

    perc = "." + perc;

    pix = av * perc;

    if (preferredwidth)

    {

        if ((av - 50) > preferredwidth)

        {

            return preferredwidth;

        }

    }

    if (pix < 350)

        return 350;

    else

        return (pix); //returns of number of pixels

}