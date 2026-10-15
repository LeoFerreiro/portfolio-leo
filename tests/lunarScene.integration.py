"""Isolated Chromium integration harness. Requires existing Playwright/Chromium.
Run with Vite dev on :5187 and production preview on :5185. No test UI ships.
Clock injection is a mount option; production app captures patch Date.now only in browser context.
Model dates below are regressions, NOT independent USNO/JPL ephemerides.
"""
from pathlib import Path
import json, math, os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'capturas/etapa4.7.5.3/regresion-4.7.5.2'
OUT.mkdir(parents=True, exist_ok=True)
DEV = os.environ.get('LUNAR_TEST_DEV_URL', 'http://127.0.0.1:5187')
APP = os.environ.get('LUNAR_TEST_APP_URL', 'http://127.0.0.1:5185')
PHASES = [
 ('nueva', '2026-10-10T15:50:36.724Z'),
 ('creciente-fino', '2026-10-11T22:09:40.010Z'),
 ('cuarto-creciente', '2026-10-18T16:13:19.496Z'),
 ('gibosa-creciente', '2026-10-22T15:20:36.414Z'),
 ('llena', '2026-10-26T04:12:15.538Z'),
 ('gibosa-menguante', '2026-10-29T11:24:28.379Z'),
 ('cuarto-menguante', '2026-10-03T13:25:33.710Z'),
 ('menguante-fino', '2026-10-09T10:14:44.719Z'),
]
rows = []
with sync_playwright() as p:
 browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--enable-unsafe-swiftshader'])
 for width in [390,1440]:
  for name,date in PHASES:
   q=browser.new_page(viewport={'width':width,'height':900}, reduced_motion='reduce', device_scale_factor=1)
   errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
   q.route('**/api.emailjs.com/**',lambda r:r.abort())
   q.add_init_script(f'Date.now = () => Date.parse({json.dumps(date)})')
   q.goto(APP);q.wait_for_selector('.lunar-scene[data-state="ready"]');q.evaluate('document.fonts.ready')
   host=q.locator('.lunar-scene');n=int(host.get_attribute('data-render-count'));q.wait_for_timeout(120);assert int(host.get_attribute('data-render-count'))==n
   q.mouse.move(width*.9,200);q.wait_for_timeout(100);assert int(host.get_attribute('data-render-count'))==n
   vec=json.loads(host.get_attribute('data-solar-direction'));fraction=float(host.get_attribute('data-illuminated-fraction'))
   assert abs(math.hypot(*vec)-1)<1e-10;assert abs(fraction-(1+vec[2])/2)<1e-10
   assert not q.evaluate('document.documentElement.scrollWidth>innerWidth');assert not errors
   q.screenshot(path=str(OUT/f'{width}-{name}.png'))
   rows.append({'width':width,'phase':name,'utc':date,'fraction':fraction,'solarDirection':vec,'renders':n,'reducedMotionStable':True,'heroHeight':q.locator('#hero').evaluate('(n)=>n.offsetHeight'),'errors':errors})
   q.close()
 # Isolated mount, without the application or production controls.
 q=browser.new_page(viewport={'width':1440,'height':900});errors=[];q.on('pageerror',lambda e:errors.append(str(e)))
 q.route('**/lunar-integration',lambda r:r.fulfill(content_type='text/html',body='<body style="margin:0;background:#070809"><section id="hero" style="height:900px"><div id="host" style="width:600px;height:600px"></div></section><div style="height:4000px"></div></body>'))
 q.goto(DEV+'/lunar-integration')
 q.evaluate('''async()=>{
 const original=window.setTimeout.bind(window),clear=window.clearTimeout.bind(window);
 window.__phaseTimers=new Map();window.setTimeout=(fn,delay,...args)=>{const id=original(fn,delay,...args);if(delay===60000)window.__phaseTimers.set(id,fn);return id};
 window.clearTimeout=(id)=>{window.__phaseTimers.delete(id);clear(id)};
 window.__time=Date.parse('2026-10-18T16:13:19.496Z');
 const {mountLunarScene}=await import('/src/components/ui/lunarScene.js');
 const {getLunarEphemeris}=await import('/src/components/ui/lunarEphemeris.js');window.__compute=getLunarEphemeris;
 const host=document.querySelector('#host');
 window.__dispose=mountLunarScene(host,{initialPhase:window.__compute(window.__time),onReady:()=>host.dataset.state='ready',onError:(r)=>host.dataset.reason=r});
 }''')
 q.wait_for_selector('#host[data-state="ready"]');q.wait_for_timeout(100)
 host=q.locator('#host');initial=int(host.get_attribute('data-render-count'));assert q.evaluate('window.__phaseTimers.size')==0
 q.wait_for_timeout(150);assert int(host.get_attribute('data-render-count'))==initial
 q.mouse.move(1300,250);q.wait_for_timeout(1300);assert int(host.get_attribute('data-render-count'))>initial
 solar=host.get_attribute('data-solar-direction');rest=int(host.get_attribute('data-render-count'));q.wait_for_timeout(150);assert int(host.get_attribute('data-render-count'))==rest;assert host.get_attribute('data-solar-direction')==solar
 q.screenshot(path=str(OUT/'integracion-puntero-derecha.png'))
 q.mouse.move(100,250);q.wait_for_timeout(1300);assert host.get_attribute('data-solar-direction')==solar;q.screenshot(path=str(OUT/'integracion-puntero-izquierda.png'))
 # Renderer consumes explicit snapshots; the shared clock is tested separately.
 q.evaluate('''()=>{window.__time+=60000;window.__dispose.updatePhase(window.__compute(window.__time))}''');q.wait_for_timeout(150)
 assert int(host.get_attribute('data-phase-timestamp'))==q.evaluate('window.__time');assert q.evaluate('window.__phaseTimers.size')==0
 q.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))")
 assert q.evaluate('window.__phaseTimers.size')==0
 frozen=int(host.get_attribute('data-render-count'));q.evaluate('window.__time+=86400000;window.__dispose.updatePhase(window.__compute(window.__time))');q.wait_for_timeout(100);assert int(host.get_attribute('data-render-count'))==frozen
 q.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))");q.wait_for_timeout(150);assert int(host.get_attribute('data-phase-timestamp'))==q.evaluate('window.__time');assert q.evaluate('window.__phaseTimers.size')==0
 q.evaluate('scrollTo({top:1500,behavior:"instant"})');q.wait_for_timeout(150);assert q.evaluate('window.__phaseTimers.size')==0
 q.evaluate('window.__time+=60000;window.__dispose.updatePhase(window.__compute(window.__time));scrollTo({top:0,behavior:"instant"})');q.wait_for_timeout(150);assert q.evaluate('window.__phaseTimers.size')==0;assert int(host.get_attribute('data-phase-timestamp'))==q.evaluate('window.__time')
 q.emulate_media(reduced_motion='reduce');q.wait_for_timeout(150);rest=int(host.get_attribute('data-render-count'));q.mouse.move(1200,200);q.wait_for_timeout(100);assert int(host.get_attribute('data-render-count'))==rest
 q.evaluate('window.__dispose()');assert q.locator('#host canvas').count()==0;assert q.evaluate('window.__phaseTimers.size')==0
 q.evaluate("document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('resize'))");q.wait_for_timeout(100);assert q.locator('#host canvas').count()==0;assert not errors
 rows.append({'integration':'isolated mount','pointerDoesNotChangeLight':True,'rendererHasNoMinuteTimer':True,'hiddenStops':True,'returnRecalculates':True,'offscreenStops':True,'disposeRemovesCanvasAndTimer':True,'errors':errors});q.close()
 # Touch remains neutral with real WebGL and clock.
 q=browser.new_page(viewport={'width':390,'height':900},has_touch=True,is_mobile=True);q.goto(APP);q.wait_for_selector('.lunar-scene[data-state="ready"]');n=int(q.locator('.lunar-scene').get_attribute('data-render-count'));q.mouse.move(300,200);q.wait_for_timeout(150);assert int(q.locator('.lunar-scene').get_attribute('data-render-count'))==n;rows.append({'touchStable':True});q.close();browser.close()
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--disable-webgl']);q=b.new_page(viewport={'width':390,'height':900});q.goto(APP);q.wait_for_selector('.lunar-scene[data-state="fallback"]');q.wait_for_selector('.lunar-fallback[data-ready="true"]');assert q.locator('.lunar-fallback').is_visible();q.screenshot(path=str(OUT/'390-respaldo-estatico-sin-webgl.png'));rows.append({'noWebGL':'dynamic fallback visible'});q.close();b.close()
(OUT/'integracion.json').write_text(json.dumps(rows,indent=2));print('Integration passed:',len(rows),'scenarios')
