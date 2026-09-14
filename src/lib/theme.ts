// Runs before the body is painted so a saved preference does not flash the other theme.
export const themeScript = `(function(){
  var media=window.matchMedia('(prefers-color-scheme: dark)');
  function apply(){
    var saved;try{saved=localStorage.getItem('dunhill-theme')}catch(e){}
    document.documentElement.dataset.theme=saved==='dark'||saved==='light'?saved:media.matches?'dark':'light';
  }
  apply();
  media.addEventListener('change',apply);
  window.addEventListener('storage',function(event){if(event.key==='dunhill-theme'||event.key===null)apply()});
})();`;
