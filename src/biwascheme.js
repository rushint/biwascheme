//for application


var BiwaScheme = {
  // load library and execute proc after loading
  // also used by js-load
  require: function(src, check, proc) {
    var script = document.createElement('script')
    script.src = src;
    document.body.appendChild(script);

    var checker = new Function("return !!(" + check + ")");

    if(checker()) proc();
    else          setTimeout(function(){ checker() ? proc() : setTimeout(arguments.callee, 10); }, 10);
  }
};

(function(){ //local namespace
  var require = BiwaScheme.require;

  // taken from prototype.js 1.6.0
  var readAttribute = function(element, name) {
    if (/*Prototype.Browser.IE*/ !!(window.attachEvent && !window.opera)){
      var t = {
        names: {
          'class': 'className',
          'for':   'htmlFor'
        },
        values: {
          _getAttr: function(element, attribute) {
            return element.getAttribute(attribute, 2);
          },
          _getAttrNode: function(element, attribute) {
            var node = element.getAttributeNode(attribute);
            return node ? node.value : "";
          },
          _getEv: function(element, attribute) {
            var attribute = element.getAttribute(attribute);
            return attribute ? attribute.toString().slice(23, -2) : null;
          },
          _flag: function(element, attribute) {
            return $(element).hasAttribute(attribute) ? attribute : null;
          },
          style: function(element) {
            return element.style.cssText.toLowerCase();
          },
          title: function(element) {
            return element.title;
          }
        }
      };
      if (t.values[name]) return t.values[name](element, name);
      if (t.names[name]) name = t.names[name];
      if (name.indexOf(':') > -1){
        return (!element.attributes || !element.attributes[name]) ? null :
         element.attributes[name].value;
      }
    }
    return element.getAttribute(name);
  }

  // main
  var script = (function(e){ 
    if(e.id == '_firebugConsole'){
      return arguments.callee(document.body);
    }
    else if(e.nodeName.toLowerCase() == 'script'){
      return e;
    }
    else{
      return arguments.callee(e.lastChild);
    }
  })(document);

  var src = readAttribute(script, 'src');
  var dir = src.match(/(.*)biwascheme.js/)[1];

  require(dir+'prototype.js', 'window.$$', function(){
  require(dir+'stackbase.js',     'window.BiwaScheme.CoreEnv', function(){
  require(dir+'r6rs_lib.js',      'window.BiwaScheme.CoreEnv["+"]', function(){
  require(dir+'webscheme_lib.js', 'window.BiwaScheme.CoreEnv["getelem"]', function(){
  require(dir+'extra_lib.js',     'window.BiwaScheme.CoreEnv["print"]', function(){
  require(dir+'dumper.js',     'window.BiwaScheme.Dumper', function(){
  require(dir+'io.js',            'window.JSIO', function(){
    var onError = function(e, state){
      puts(e.message); 
      if($("biwascheme-debugger")){
        var dumper = new BiwaScheme.Dumper($("biwascheme-debugger"));
        dumper.dump(new Hash(state));
        dumper.dump_move(1);
      }
      throw(e);
    }
    var intp = new BiwaScheme.Interpreter(onError);
    try{
      intp.evaluate(script.innerHTML, Prototype.emptyFunction);
    }
    catch(e){
      onError(e);
    }
  })})})})})})});
})();

//vim: set ft=javascript:
