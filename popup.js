var Overlay = function(container){
  this._container = container;
  this._focus_lst = [];
  this.is_focused;
  this._on_blur = function(){};
  this._on_focus = function(){};
  this._on_toggle = function(){};
  this.on_blur = function (funct) { this._on_blur = funct; };
  this.on_focus = function (funct) { this._on_focus = funct; };
  this.on_toggle = function (funct) { this._on_toggle = funct; };
  this.dialog;

  $(container).append("<div id='overlay' class='hidden'> </div>");
  this._overlay = $('#overlay');

  this.add = function(element){
    if (element instanceof Array){
      for (index in element){
        this._focus_lst.push(element[index]);
      }
    } else {
      this._focus_lst.push(element);
    }
  };


  this.remove_all = function(){
    this.blur();
    this._focus_lst = [];
  };

  this.remove = function(element){
    var index = this._focus_lst.indexOf(element);
    if (index !== -1){
      this._focus_lst.splice(index,1); 
    }
  };
  this.focus = function(){
    this._overlay.removeClass('hidden');
    for(index in this._focus_lst){
      this._focus_lst[index].addClass('focus');
    }
    this.is_focused = true;

    this._on_focus();
  };

  this.blur = function(){
    var $focus = $('.focus');
    $focus.removeClass('focus');

    this._overlay.addClass('hidden');
    this.is_focused = false;

    this._on_blur();
  };

  this.toggle_focus = function(){
    var $focus = $('.focus');
    if ($focus && $focus.length){
      this.blur(); 
    } else {
      this.focus();
    }

    this._on_toggle();
  };

  this.click = function(funct){
    this._overlay.click( function (){
      funct();
    });
  };

  this.is_tracked = function (element){
    return $in_array(element,this._focus_lst); 
  };

  return this;
};

var Window = function (name, options, content) {
  // Set unique identifier (no check will be made).
  if (name){
    this.name = name;
  } else {
    this.name = "window";
  }

  /***************************** 
  Set default options

  options = {
    custom:boolean, 
    draggable:boolean,
    resizable:boolean,
    title:[string,options],
    position:[xpos,ypos],
    buttons:{
      "name": [callback_upon_click,css{attr:val}],
      "name": [callback_upon_click,css{attr:val}]
    }
  }
  ******************************/
  this.options = {
      "custom" : false,
      "show" : false,
      "draggable" : false,
      "resizable" : false,
      "position" : [0,0]
  };

  // Parse options
  for ( option in options ){
    this.options[option] = options[option];
  }

  // Sets up the html for the element, and creates a jquery object out of the html.
  var html = "";
  if ( this.options['custom'] ) {
    html = content;  
  } else {
    html = "<div id='_popup'>"+
             "<div id='_popup_head'>" +
                "<div id='_head_floater_right'> </div>" + 
                "<div id='_title_container'>"; 
    if (this.options['title']){
      html +=     this.options['title'][0];
    }
    html +=     "</div>" +
                "<div id='_head_floater_right'> <div id='_popup_close'> </div> </div>" +
              "</div>";

    html +=   "<div id='_popup_content'>" + content + "</div>";
    
    var buttons = this.options['buttons'];
    if (buttons){
      html += "<div id='_popup_footer'>";
      for (key in buttons){
        var button = buttons[key],
            css = '';

        if ( button[1] != undefined ){
          for (attr in button[1]){
            css = attr + ":" + button[1][attr] + ";";
          }
        }
        html += "<input type='button' style='" + css  + "' value='" + key + "'>"; 
      }
      html += "</div>"; 
    }

    html += "</div>"; 
  }

  this._element = $(html);

  // returns the jquery object of the dom element that is the window.
  this.get_element = function () {
    return this._element;
  };
  
  // This function moves the element to the position on the page denoted by x and y
  this.move = function (x, y) {
    this._element.css('poisition','absolute').css('left',x).css('top',y);
  };

  // Add the element into the page and set up classes, and position;
  $('body').append(this._element);
  this._element.addClass('focus');
  if (!this.options['show']){
    this._element.addClass('hidden');
  }
  this.move(this.options['position'][0], this.options['position'][1]);

  // Hide the window element.
  this.hide = function () {
    this._element.addClass('hidden');
  };

  // Shows the window element. 
  this.show = function () {
    this._element.removeClass('hidden');
  };

  // Allows the user to change the content of the window.
  this.set_content = function (c) {
    if (this.options['custom']){
      this._element.html(c);
    } else {
      this._element.find("#_popup_content").text(c);      
    }
  };
  
  return this;
};

var Popup = function (){
  this._overlay = new Overlay($("html"));

  this.getOverlay = function () {
    return this._overlay;
  };

  this._window_lst = [];
  this.number = 0;

  this._indexOf(name) = function () {
    for ( var i = 0; i < this.number; i++ ) {
      if ( this._window_lst[i].name = name ) {
        return i;
      }
    }
    return -1;
  };

  this.get = function ( name ) {
    return this._window_lst[ this._indexOf(name) ];
  };
  
  this.remove = function ( name ) {
    this._window_lst.splice(this._indexOf(name),1);
  };
  
  this.create_window = function (options, content) {
    this._window_lst.push(new Window(name,options,content));
  };

  return this;
};
