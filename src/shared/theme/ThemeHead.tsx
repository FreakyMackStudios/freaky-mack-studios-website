import { DEFAULT_THEME, STORAGE_KEY, resolveTheme } from "./theme";

/**
 * Rendered in <head>. The <style> carries the default look (also the no-JS fallback); the inline script
 * applies the visitor's saved theme (or ?theme=light|dark, which is also saved) before first paint.
 */
export function ThemeHead() {
  const css = `:root{${Object.entries(resolveTheme(DEFAULT_THEME))
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
  const cfg = JSON.stringify({ d: DEFAULT_THEME, k: STORAGE_KEY, v: { light: resolveTheme("light"), dark: resolveTheme("dark") } });
  const script = `(function(){try{var C=${cfg},t=C.d,ok=function(v){return v==="light"||v==="dark"};
try{var s=localStorage.getItem(C.k);if(ok(s))t=s}catch(e){}
var q=new URLSearchParams(location.search).get("theme");if(ok(q)){t=q;try{localStorage.setItem(C.k,t)}catch(e){}}
var r=document.documentElement,v=C.v[t];r.setAttribute("data-theme",t);
for(var k in v)r.style.setProperty(k,v[k]);r.style.background=v["--ground"];
}catch(e){}})();`;
  return (
    <>
      <style>{css}</style>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
