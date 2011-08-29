(function( $ ){
  $.fn.Adaptorate = function(method, options) {
    var methods = {
      init  : function(opts) {
        breakpoints = (opts.breakpoints) ? opts.breakpoints : Array();
        for (var i = 0; i < breakpoints.length; i++) {
          if (!breakpoints[i].width.min) {
            breakpoints[i].width.min = 0;
          }
          if (!breakpoints[i].width.max) {
            breakpoints[i].width.max = 10000;
          }
        }
        var data = $(window).data('Adaptorate');
        if (!data) {
          $(window).bind('resize.Adaptorate', methods.update);
          var data = { 
            breakpoints : breakpoints,
            adapties    : this
          };
          if (opts && opts.retrieve) {
            data.retrieve = opts.retrieve;
          }
        }
        else {
          data.breakpoints  = data.breakpoints.concat(breakpoints);
          data.adapties     = data.adapties.add(this);
        }
        $(window).data('Adaptorate', data);
        if (opts && opts.retrieve) {
          $(this).filter('.retrieve').bind('adaptorateActivate', methods.retrieve);
        }
        methods.update();
      },
      
      update  : function() {
        var data  = $(window).data('Adaptorate');
        var width = $(window).width();
        var active_before;
        if (data && data.adapties) {
          active_before = $(data.adapties).filter('.active');
        }
        var active_classes = Array();
        var inactive_classes = Array();
        if (data && data.breakpoints) {
          var is_different_now    = false;
          var first_run           = (data.curent) ? false : true;
          var was                 = (data.current) ? data.current: {}; 
          data.current            = {};
          for (var i=0; i < data.breakpoints.length; i++) {
            var bp = data.breakpoints[i];
            if (width >= bp.width.min && width <= bp.width.max) {
              data.current[bp.name] = true;
              active_classes[active_classes.length] = '.' + bp.name;
            }
            else {
              data.current[bp.name] = false;
              inactive_classes[inactive_classes.length] = '.' + bp.name;
            }
            if ((was.hasOwnProperty(bp.name) && was[bp.name] != data.current[bp.name]) || first_run) {
              is_different_now = true;
            }
          }
          if (is_different_now) {
            var adapties      = data.adapties;
            active_classes    = active_classes.join(', ');
            inactive_classes  = inactive_classes.join(', ');
            $(adapties).filter(active_classes).addClass('active').not(active_before).trigger('adaptorateActivate');
            $(adapties).filter(inactive_classes).not(active_classes).removeClass('active');
            $(active_before).not('.active').trigger('adaptorateDeactivate');
            $('*').trigger('adaptorateChange', data.current, was);
          }
        }
        $(window).data('Adaptorate', data);
      },
      
      change : function(callback) {
        if (typeof(opts) === 'function') {
          callback = opts;
        }
        $(this).bind('adaptorateChange', callback);
      },
      
      retrieve: function() {
        var data = $(window).data('Adaptorate');
        if (data && data.retrieve) {
          var element_id = $(this).attr('id');
          $.get(data.retrieve, { element_id : element_id }, function(data) {
            $("#" + element_id).append(data);
            $("#" + element_id).unbind('adaptorateActivate', methods.retrieve);
          });
        }
      }
    }
    
    if (options && typeof(options) === 'object') {
      methods.init.apply(this, Array(options));
    }
    if(typeof(method) === 'object') {
      methods.init.apply(this, Array(method));
    }
    else if (methods[method]) {
      var slice_count = 1;
      if (options && typeof(options) === 'object') {
        slice_count = 2;
      }
      return methods[method].apply( this, Array.prototype.slice.call( arguments, slice_count ));
    }
  };
})( jQuery );


// Example
$(document).ready(function() { 
$('.adaptorate').Adaptorate({ breakpoints : [
  { name: 'mobile', width : { max : 480 }},
  { name: 'mid', width : { min : 480 }},
  { name: 'wide', width : { min : 1000}}],
  retrieve  : 'content.php'

  });
  $('#current_stats').bind('adaptorateChange', function(event, i_am, i_was) {
    var i_am_list = Array();
    for (thing in i_am) {
      if (i_am[thing]) {
        i_am_list[i_am_list.length] = thing;
      }
    }
    i_am_list = i_am_list.join(', ');
    $(this).html('<p><strong>Active breakpoints</strong>: ' + i_am_list + '</p>');
  });
});

