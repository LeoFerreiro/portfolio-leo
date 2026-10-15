"""Shared lunar visuals: real browser renderers, fixed model UTC fixtures, no production test controls."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import ast,json,os,math
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'capturas/etapa4.7.5.3';OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('LUNAR_TEST_APP_URL','http://127.0.0.1:5185')
tree=ast.parse((ROOT/'tests/lunarScene.integration.py').read_text());PHASES=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='PHASES' for t in n.targets))
rows=json.loads((OUT/'matrix.json').read_text()) if os.environ.get('LUNAR_TEST_SKIP_MATRIX') else []
INIT='''{const original=setTimeout.bind(window),clear=clearTimeout.bind(window);window.__lunarTimers=new Map();window.setTimeout=(fn,d,...a)=>{const id=original(fn,d,...a);if(d===60000)window.__lunarTimers.set(id,fn);return id};window.clearTimeout=id=>{window.__lunarTimers.delete(id);clear(id)};}'''
with sync_playwright() as p:
 for off in ([] if os.environ.get('LUNAR_TEST_SKIP_MATRIX') else [True,False]):
  b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--disable-webgl'] if off else ['--enable-unsafe-swiftshader'])
  for width in [390,768,1024,1440]:
   for name,date in PHASES:
    q=b.new_page(viewport={'width':width,'height':900},device_scale_factor=1,reduced_motion='reduce');errors=[];q.on('pageerror',lambda e:errors.append(str(e)));q.route('**/api.emailjs.com/**',lambda r:r.abort());q.add_init_script(INIT+f'window.__time=Date.parse({json.dumps(date)});Date.now=()=>window.__time;');q.goto(URL)
    q.wait_for_selector('.lunar-fallback[data-ready="true"]',state='attached');q.wait_for_function("document.querySelector('.lunar-scene')?.dataset.state==="+json.dumps('fallback' if off else 'ready'))
    if not off:q.wait_for_selector('.lunar-visual[data-show-3d="true"]')
    q.evaluate('document.fonts.ready');phase=q.locator('.lunar-visual').get_attribute('data-phase-timestamp');canvas=q.locator('.lunar-fallback');assert canvas.get_attribute('data-phase-timestamp')==phase
    if not off:assert q.locator('.lunar-scene').get_attribute('data-phase-timestamp')==phase
    metrics=json.loads(canvas.get_attribute('data-metrics'));assert metrics['textured'];assert q.evaluate('window.__lunarTimers.size')==1
    opacity=q.locator('.space-stars-faint').evaluate('(n)=>Number(getComputedStyle(n).opacity)');main=q.locator('.space-stars-main').evaluate('(n)=>getComputedStyle(n).opacity');assert main=='1'
    count=int(q.locator('.lunar-scene').get_attribute('data-render-count') or 0);q.wait_for_timeout(100);assert int(q.locator('.lunar-scene').get_attribute('data-render-count') or 0)==count
    assert not q.evaluate('document.documentElement.scrollWidth>innerWidth');assert not errors
    if width in [390,1440] or name in ['nueva','cuarto-creciente','llena']:q.screenshot(path=str(OUT/(f'{width}-{name}-'+('2d' if off else '3d')+'.png')))
    rows.append({'width':width,'mode':'2d' if off else '3d','phase':name,'timestamp':phase,'metrics':metrics,'faintOpacity':opacity,'mainOpacity':main,'renderCount':count,'heroHeight':q.locator('#hero').evaluate('(n)=>n.offsetHeight'),'oneClock':True,'idleStable':True,'overflow':False,'errors':errors});(OUT/'matrix.json').write_text(json.dumps(rows,indent=2));q.close()
  b.close()
 # Real app: transition, shared minute update, hiding, failures, keyboard and touch.
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--enable-unsafe-swiftshader'])
 q=b.new_page(viewport={'width':1440,'height':900});errors=[];q.on('pageerror',lambda e:errors.append(str(e)));pending=[];q.route('**/assets/lunarScene-*.js',lambda r:pending.append(r));q.add_init_script(INIT+"window.__time=Date.parse('2026-10-18T16:13:19.496Z');Date.now=()=>window.__time;");q.goto(URL);q.wait_for_selector('.lunar-fallback[data-ready="true"]');q.wait_for_function("document.querySelector('.lunar-scene').dataset.state==='loading'");q.wait_for_timeout(100);assert pending
 bounds=q.locator('.eclipse-moon-frame').bounding_box();q.screenshot(path=str(OUT/'1440-carga-respaldo.png'))
 for route in pending:route.continue_()
 q.wait_for_selector('.lunar-visual[data-show-3d="true"]');assert bounds==q.locator('.eclipse-moon-frame').bounding_box();q.screenshot(path=str(OUT/'1440-primer-frame-3d.png'))
 initial=q.locator('.lunar-scene').get_attribute('data-solar-direction');q.mouse.move(1300,250);q.wait_for_function("""()=>{const n=document.querySelector('.lunar-scene').dataset.renderCount;if(!window.__idle||window.__idle.n!==n){window.__idle={n,t:performance.now()};return false}return performance.now()-window.__idle.t>400}""",polling=100);assert q.locator('.lunar-scene').get_attribute('data-solar-direction')==initial
 rest=int(q.locator('.lunar-scene').get_attribute('data-render-count'));q.wait_for_timeout(150);assert int(q.locator('.lunar-scene').get_attribute('data-render-count'))==rest
 # Artificial clock jump tests atomic shared state, not normal minute speed.
 q.evaluate('''()=>{window.__time+=86400000;const [id,fn]=[...window.__lunarTimers][0];clearTimeout(id);fn()}''');q.wait_for_function("document.querySelector('.lunar-fallback').dataset.phaseTimestamp===String(window.__time)");q.wait_for_function("document.querySelector('.lunar-scene').dataset.phaseTimestamp===String(window.__time)");assert q.evaluate('window.__lunarTimers.size')==1
 q.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))");assert q.evaluate('window.__lunarTimers.size')==0
 q.evaluate("window.__time+=60000;delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))");q.wait_for_function("document.querySelector('.lunar-fallback').dataset.phaseTimestamp===String(window.__time)");assert q.evaluate('window.__lunarTimers.size')==1
 q.evaluate('scrollTo({top:5000,behavior:"instant"})');q.wait_for_timeout(150);assert q.evaluate('window.__lunarTimers.size')==0;q.evaluate('scrollTo({top:0,behavior:"instant"})');q.wait_for_timeout(200);q.wait_for_selector('.lunar-visual[data-show-3d="true"]');assert q.evaluate('window.__lunarTimers.size')==1
 q.evaluate("document.querySelector('.lunar-scene canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()");q.wait_for_selector('.lunar-scene[data-state="fallback"]');q.wait_for_function("document.querySelector('.lunar-visual').getAttribute('data-show-3d')==='false'");assert q.locator('.lunar-fallback').is_visible();q.screenshot(path=str(OUT/'1440-contexto-perdido.png'));assert not errors;rows.append({'sharedMinuteAndVisibility':True,'matchingFirstFrameBounds':True,'pointerKeepsPhase':True,'contextLossDynamicFallback':True,'errors':errors});q.close()
 for failure in ['3d-texture','all-textures','module','limited','touch']:
  q=b.new_page(viewport={'width':390 if failure=='touch' else 1440,'height':900},has_touch=failure=='touch',is_mobile=failure=='touch');errs=[];q.on('pageerror',lambda e:errs.append(str(e)))
  if failure=='3d-texture':q.route('**/hero/lunar/*2k.webp',lambda r:r.abort())
  if failure=='all-textures':q.route('**/hero/lunar/*.webp',lambda r:r.abort())
  if failure=='module':q.route('**/assets/lunarScene-*.js',lambda r:r.abort())
  if failure=='limited':q.add_init_script("Object.defineProperty(navigator,'deviceMemory',{get:()=>2})")
  q.goto(URL);q.wait_for_selector('.lunar-fallback[data-ready="true"]',state='attached')
  if failure=='touch':
   q.wait_for_selector('.lunar-visual[data-show-3d="true"]');count=int(q.locator('.lunar-scene').get_attribute('data-render-count'));q.mouse.move(300,200);q.wait_for_timeout(100);assert int(q.locator('.lunar-scene').get_attribute('data-render-count'))==count
   toggle=q.get_by_role('button',name='Abrir menú');toggle.focus();q.keyboard.press('Enter');q.keyboard.press('Tab');q.keyboard.press('Escape');assert toggle.evaluate('(n)=>n===document.activeElement');q.locator('.eclipse-cta-primary').click();q.wait_for_timeout(900);assert q.evaluate('location.hash')=='#projects'
  else:
   q.wait_for_selector('.lunar-scene[data-state="fallback"]');assert q.locator('.lunar-fallback').is_visible();q.screenshot(path=str(OUT/f'fallo-{failure}.png'))
  if failure=='all-textures':assert q.locator('.lunar-fallback').get_attribute('data-quality')=='geometry-only'
  assert not errs;rows.append({'scenario':failure,'dynamicFallback':True,'errors':errs});q.close()
 b.close()
for width in [390,768,1024,1440]:
 for phase,_ in PHASES:
  pair=[r for r in rows if r.get('width')==width and r.get('phase')==phase];assert pair[0]['timestamp']==pair[1]['timestamp'];assert abs(pair[0]['faintOpacity']-pair[1]['faintOpacity'])<1e-10
(OUT/'pruebas.json').write_text(json.dumps(rows,indent=2));print('PASSED:',len(rows),'scenarios; shared timestamps and opacity match')
