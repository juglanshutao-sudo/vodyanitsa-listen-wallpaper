'use strict';
window.VODYANITSA_RENDERER_VERSION='3.5.5 Dark.2';
const assetURL=p=>window.WALLPAPER_ASSETS?.[p]||p;
class WallpaperRenderer{
constructor(canvas){const versionLabel=document.getElementById('rendererVersion');if(versionLabel)versionLabel.textContent='壁纸设置 · v'+window.VODYANITSA_RENDERER_VERSION;this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true});if(!this.gl)throw Error('需要启用 WebGL / 硬件加速');this.tex={};this.images={};this.init();}
init(){const g=this.gl;const vs=`attribute vec2 a;varying vec2 uv;void main(){uv=vec2((a.x+1.)*.5,(1.-a.y)*.5);gl_Position=vec4(a,0.,1.);}`;
const fs=`precision highp float;
varying vec2 uv;uniform sampler2D tex,closedTex,cleanTex,maskTex,clothCleanTex,clothMaskTex,frontHairTex,hairCleanTex;uniform float mode,t,wind,blink,smile,energy,variant,depth;uniform vec2 mouse,gaze;
float sat(float x){return clamp(x,0.,1.);}float ss(float a,float b,float x){return smoothstep(a,b,x);}float bell(vec2 p,vec2 c,vec2 r){vec2 q=(p-c)/r;return exp(-dot(q,q)*2.);}
float edgeDistance(vec2 p,vec2 a,vec2 b){vec2 ab=b-a;return length(p-a-ab*clamp(dot(p-a,ab)/dot(ab,ab),0.,1.));}
float patch0(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(448.,578.),vec2(493.,585.)));
if(((578.>p.y)!=(585.>p.y))&&(p.x<(493.-448.)*(p.y-578.)/(585.-578.)+448.))inside=!inside;
d=min(d,edgeDistance(p,vec2(493.,585.),vec2(565.,618.)));
if(((585.>p.y)!=(618.>p.y))&&(p.x<(565.-493.)*(p.y-585.)/(618.-585.)+493.))inside=!inside;
d=min(d,edgeDistance(p,vec2(565.,618.),vec2(593.,596.)));
if(((618.>p.y)!=(596.>p.y))&&(p.x<(593.-565.)*(p.y-618.)/(596.-618.)+565.))inside=!inside;
d=min(d,edgeDistance(p,vec2(593.,596.),vec2(638.,649.)));
if(((596.>p.y)!=(649.>p.y))&&(p.x<(638.-593.)*(p.y-596.)/(649.-596.)+593.))inside=!inside;
d=min(d,edgeDistance(p,vec2(638.,649.),vec2(649.,770.)));
if(((649.>p.y)!=(770.>p.y))&&(p.x<(649.-638.)*(p.y-649.)/(770.-649.)+638.))inside=!inside;
d=min(d,edgeDistance(p,vec2(649.,770.),vec2(626.,832.)));
if(((770.>p.y)!=(832.>p.y))&&(p.x<(626.-649.)*(p.y-770.)/(832.-770.)+649.))inside=!inside;
d=min(d,edgeDistance(p,vec2(626.,832.),vec2(563.,836.)));
if(((832.>p.y)!=(836.>p.y))&&(p.x<(563.-626.)*(p.y-832.)/(836.-832.)+626.))inside=!inside;
d=min(d,edgeDistance(p,vec2(563.,836.),vec2(445.,822.)));
if(((836.>p.y)!=(822.>p.y))&&(p.x<(445.-563.)*(p.y-836.)/(822.-836.)+563.))inside=!inside;
d=min(d,edgeDistance(p,vec2(445.,822.),vec2(465.,747.)));
if(((822.>p.y)!=(747.>p.y))&&(p.x<(465.-445.)*(p.y-822.)/(747.-822.)+445.))inside=!inside;
d=min(d,edgeDistance(p,vec2(465.,747.),vec2(477.,664.)));
if(((747.>p.y)!=(664.>p.y))&&(p.x<(477.-465.)*(p.y-747.)/(664.-747.)+465.))inside=!inside;
d=min(d,edgeDistance(p,vec2(477.,664.),vec2(448.,578.)));
if(((664.>p.y)!=(578.>p.y))&&(p.x<(448.-477.)*(p.y-664.)/(578.-664.)+477.))inside=!inside;
return 1.-ss(12.,28.,inside?-d:d);}
float patch1(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(962.,635.),vec2(1001.,636.)));
if(((635.>p.y)!=(636.>p.y))&&(p.x<(1001.-962.)*(p.y-635.)/(636.-635.)+962.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1001.,636.),vec2(1048.,609.)));
if(((636.>p.y)!=(609.>p.y))&&(p.x<(1048.-1001.)*(p.y-636.)/(609.-636.)+1001.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1048.,609.),vec2(1081.,677.)));
if(((609.>p.y)!=(677.>p.y))&&(p.x<(1081.-1048.)*(p.y-609.)/(677.-609.)+1048.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1081.,677.),vec2(1110.,701.)));
if(((677.>p.y)!=(701.>p.y))&&(p.x<(1110.-1081.)*(p.y-677.)/(701.-677.)+1081.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1110.,701.),vec2(1170.,731.)));
if(((701.>p.y)!=(731.>p.y))&&(p.x<(1170.-1110.)*(p.y-701.)/(731.-701.)+1110.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1170.,731.),vec2(1224.,765.)));
if(((731.>p.y)!=(765.>p.y))&&(p.x<(1224.-1170.)*(p.y-731.)/(765.-731.)+1170.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1224.,765.),vec2(1194.,794.)));
if(((765.>p.y)!=(794.>p.y))&&(p.x<(1194.-1224.)*(p.y-765.)/(794.-765.)+1224.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1194.,794.),vec2(1115.,809.)));
if(((794.>p.y)!=(809.>p.y))&&(p.x<(1115.-1194.)*(p.y-794.)/(809.-794.)+1194.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1115.,809.),vec2(1012.,750.)));
if(((809.>p.y)!=(750.>p.y))&&(p.x<(1012.-1115.)*(p.y-809.)/(750.-809.)+1115.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1012.,750.),vec2(966.,715.)));
if(((750.>p.y)!=(715.>p.y))&&(p.x<(966.-1012.)*(p.y-750.)/(715.-750.)+1012.))inside=!inside;
d=min(d,edgeDistance(p,vec2(966.,715.),vec2(962.,635.)));
if(((715.>p.y)!=(635.>p.y))&&(p.x<(962.-966.)*(p.y-715.)/(635.-715.)+966.))inside=!inside;
return 1.-ss(12.,28.,inside?-d:d);}
float upperLeaf(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(945.,565.),vec2(961.,563.)));
if(((565.>p.y)!=(563.>p.y))&&(p.x<(961.-945.)*(p.y-565.)/(563.-565.)+945.))inside=!inside;
d=min(d,edgeDistance(p,vec2(961.,563.),vec2(959.,579.)));
if(((563.>p.y)!=(579.>p.y))&&(p.x<(959.-961.)*(p.y-563.)/(579.-563.)+961.))inside=!inside;
d=min(d,edgeDistance(p,vec2(959.,579.),vec2(948.,589.)));
if(((579.>p.y)!=(589.>p.y))&&(p.x<(948.-959.)*(p.y-579.)/(589.-579.)+959.))inside=!inside;
d=min(d,edgeDistance(p,vec2(948.,589.),vec2(945.,565.)));
if(((589.>p.y)!=(565.>p.y))&&(p.x<(945.-948.)*(p.y-589.)/(565.-589.)+948.))inside=!inside;
return 1.-ss(-2.0,2.0,inside?-d:d);}
float lowerLeaf(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(954.,586.),vec2(965.,580.)));
if(((586.>p.y)!=(580.>p.y))&&(p.x<(965.-954.)*(p.y-586.)/(580.-586.)+954.))inside=!inside;
d=min(d,edgeDistance(p,vec2(965.,580.),vec2(978.,583.)));
if(((580.>p.y)!=(583.>p.y))&&(p.x<(978.-965.)*(p.y-580.)/(583.-580.)+965.))inside=!inside;
d=min(d,edgeDistance(p,vec2(978.,583.),vec2(987.,590.)));
if(((583.>p.y)!=(590.>p.y))&&(p.x<(987.-978.)*(p.y-583.)/(590.-583.)+978.))inside=!inside;
d=min(d,edgeDistance(p,vec2(987.,590.),vec2(999.,607.)));
if(((590.>p.y)!=(607.>p.y))&&(p.x<(999.-987.)*(p.y-590.)/(607.-590.)+987.))inside=!inside;
d=min(d,edgeDistance(p,vec2(999.,607.),vec2(982.,605.)));
if(((607.>p.y)!=(605.>p.y))&&(p.x<(982.-999.)*(p.y-607.)/(605.-607.)+999.))inside=!inside;
d=min(d,edgeDistance(p,vec2(982.,605.),vec2(968.,597.)));
if(((605.>p.y)!=(597.>p.y))&&(p.x<(968.-982.)*(p.y-605.)/(597.-605.)+982.))inside=!inside;
d=min(d,edgeDistance(p,vec2(968.,597.),vec2(954.,586.)));
if(((597.>p.y)!=(586.>p.y))&&(p.x<(954.-968.)*(p.y-597.)/(586.-597.)+968.))inside=!inside;
return 1.-ss(-2.0,2.0,inside?-d:d);}
float foreheadSupport(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(857.,141.),vec2(872.,163.)));
if(((141.>p.y)!=(163.>p.y))&&(p.x<(872.-857.)*(p.y-141.)/(163.-141.)+857.))inside=!inside;
d=min(d,edgeDistance(p,vec2(872.,163.),vec2(902.,237.)));
if(((163.>p.y)!=(237.>p.y))&&(p.x<(902.-872.)*(p.y-163.)/(237.-163.)+872.))inside=!inside;
d=min(d,edgeDistance(p,vec2(902.,237.),vec2(865.,232.)));
if(((237.>p.y)!=(232.>p.y))&&(p.x<(865.-902.)*(p.y-237.)/(232.-237.)+902.))inside=!inside;
d=min(d,edgeDistance(p,vec2(865.,232.),vec2(835.,222.)));
if(((232.>p.y)!=(222.>p.y))&&(p.x<(835.-865.)*(p.y-232.)/(222.-232.)+865.))inside=!inside;
d=min(d,edgeDistance(p,vec2(835.,222.),vec2(848.,187.)));
if(((222.>p.y)!=(187.>p.y))&&(p.x<(848.-835.)*(p.y-222.)/(187.-222.)+835.))inside=!inside;
d=min(d,edgeDistance(p,vec2(848.,187.),vec2(857.,141.)));
if(((187.>p.y)!=(141.>p.y))&&(p.x<(857.-848.)*(p.y-187.)/(141.-187.)+848.))inside=!inside;
return 1.-ss(-2.0,2.0,inside?-d:d);}
float shoulderArea(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(879.,510.),vec2(1020.,510.)));
d=min(d,edgeDistance(p,vec2(1020.,510.),vec2(1020.,656.)));
if(((510.>p.y)!=(656.>p.y))&&(p.x<(1020.-1020.)*(p.y-510.)/(656.-510.)+1020.))inside=!inside;
d=min(d,edgeDistance(p,vec2(1020.,656.),vec2(879.,656.)));
d=min(d,edgeDistance(p,vec2(879.,656.),vec2(879.,510.)));
if(((656.>p.y)!=(510.>p.y))&&(p.x<(879.-879.)*(p.y-656.)/(510.-656.)+879.))inside=!inside;
return 1.-ss(-0.6,0.6,inside?-d:d);}
float shortLock(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(904.,490.),vec2(926.,490.)));
d=min(d,edgeDistance(p,vec2(926.,490.),vec2(929.,516.)));
if(((490.>p.y)!=(516.>p.y))&&(p.x<(929.-926.)*(p.y-490.)/(516.-490.)+926.))inside=!inside;
d=min(d,edgeDistance(p,vec2(929.,516.),vec2(934.,521.)));
if(((516.>p.y)!=(521.>p.y))&&(p.x<(934.-929.)*(p.y-516.)/(521.-516.)+929.))inside=!inside;
d=min(d,edgeDistance(p,vec2(934.,521.),vec2(940.,527.)));
if(((521.>p.y)!=(527.>p.y))&&(p.x<(940.-934.)*(p.y-521.)/(527.-521.)+934.))inside=!inside;
d=min(d,edgeDistance(p,vec2(940.,527.),vec2(945.,533.)));
if(((527.>p.y)!=(533.>p.y))&&(p.x<(945.-940.)*(p.y-527.)/(533.-527.)+940.))inside=!inside;
d=min(d,edgeDistance(p,vec2(945.,533.),vec2(950.,539.)));
if(((533.>p.y)!=(539.>p.y))&&(p.x<(950.-945.)*(p.y-533.)/(539.-533.)+945.))inside=!inside;
d=min(d,edgeDistance(p,vec2(950.,539.),vec2(957.,545.)));
if(((539.>p.y)!=(545.>p.y))&&(p.x<(957.-950.)*(p.y-539.)/(545.-539.)+950.))inside=!inside;
d=min(d,edgeDistance(p,vec2(957.,545.),vec2(965.,550.)));
if(((545.>p.y)!=(550.>p.y))&&(p.x<(965.-957.)*(p.y-545.)/(550.-545.)+957.))inside=!inside;
d=min(d,edgeDistance(p,vec2(965.,550.),vec2(976.,554.)));
if(((550.>p.y)!=(554.>p.y))&&(p.x<(976.-965.)*(p.y-550.)/(554.-550.)+965.))inside=!inside;
d=min(d,edgeDistance(p,vec2(976.,554.),vec2(986.,557.)));
if(((554.>p.y)!=(557.>p.y))&&(p.x<(986.-976.)*(p.y-554.)/(557.-554.)+976.))inside=!inside;
d=min(d,edgeDistance(p,vec2(986.,557.),vec2(976.,560.)));
if(((557.>p.y)!=(560.>p.y))&&(p.x<(976.-986.)*(p.y-557.)/(560.-557.)+986.))inside=!inside;
d=min(d,edgeDistance(p,vec2(976.,560.),vec2(963.,562.)));
if(((560.>p.y)!=(562.>p.y))&&(p.x<(963.-976.)*(p.y-560.)/(562.-560.)+976.))inside=!inside;
d=min(d,edgeDistance(p,vec2(963.,562.),vec2(953.,561.)));
if(((562.>p.y)!=(561.>p.y))&&(p.x<(953.-963.)*(p.y-562.)/(561.-562.)+963.))inside=!inside;
d=min(d,edgeDistance(p,vec2(953.,561.),vec2(944.,559.)));
if(((561.>p.y)!=(559.>p.y))&&(p.x<(944.-953.)*(p.y-561.)/(559.-561.)+953.))inside=!inside;
d=min(d,edgeDistance(p,vec2(944.,559.),vec2(937.,557.)));
if(((559.>p.y)!=(557.>p.y))&&(p.x<(937.-944.)*(p.y-559.)/(557.-559.)+944.))inside=!inside;
d=min(d,edgeDistance(p,vec2(937.,557.),vec2(932.,555.)));
if(((557.>p.y)!=(555.>p.y))&&(p.x<(932.-937.)*(p.y-557.)/(555.-557.)+937.))inside=!inside;
d=min(d,edgeDistance(p,vec2(932.,555.),vec2(928.,552.)));
if(((555.>p.y)!=(552.>p.y))&&(p.x<(928.-932.)*(p.y-555.)/(552.-555.)+932.))inside=!inside;
d=min(d,edgeDistance(p,vec2(928.,552.),vec2(924.,549.)));
if(((552.>p.y)!=(549.>p.y))&&(p.x<(924.-928.)*(p.y-552.)/(549.-552.)+928.))inside=!inside;
d=min(d,edgeDistance(p,vec2(924.,549.),vec2(921.,546.)));
if(((549.>p.y)!=(546.>p.y))&&(p.x<(921.-924.)*(p.y-549.)/(546.-549.)+924.))inside=!inside;
d=min(d,edgeDistance(p,vec2(921.,546.),vec2(918.,542.)));
if(((546.>p.y)!=(542.>p.y))&&(p.x<(918.-921.)*(p.y-546.)/(542.-546.)+921.))inside=!inside;
d=min(d,edgeDistance(p,vec2(918.,542.),vec2(916.,539.)));
if(((542.>p.y)!=(539.>p.y))&&(p.x<(916.-918.)*(p.y-542.)/(539.-542.)+918.))inside=!inside;
d=min(d,edgeDistance(p,vec2(916.,539.),vec2(914.,535.)));
if(((539.>p.y)!=(535.>p.y))&&(p.x<(914.-916.)*(p.y-539.)/(535.-539.)+916.))inside=!inside;
d=min(d,edgeDistance(p,vec2(914.,535.),vec2(912.,531.)));
if(((535.>p.y)!=(531.>p.y))&&(p.x<(912.-914.)*(p.y-535.)/(531.-535.)+914.))inside=!inside;
d=min(d,edgeDistance(p,vec2(912.,531.),vec2(910.,528.)));
if(((531.>p.y)!=(528.>p.y))&&(p.x<(910.-912.)*(p.y-531.)/(528.-531.)+912.))inside=!inside;
d=min(d,edgeDistance(p,vec2(910.,528.),vec2(908.,524.)));
if(((528.>p.y)!=(524.>p.y))&&(p.x<(908.-910.)*(p.y-528.)/(524.-528.)+910.))inside=!inside;
d=min(d,edgeDistance(p,vec2(908.,524.),vec2(906.,518.)));
if(((524.>p.y)!=(518.>p.y))&&(p.x<(906.-908.)*(p.y-524.)/(518.-524.)+908.))inside=!inside;
d=min(d,edgeDistance(p,vec2(906.,518.),vec2(904.,508.)));
if(((518.>p.y)!=(508.>p.y))&&(p.x<(904.-906.)*(p.y-518.)/(508.-518.)+906.))inside=!inside;
d=min(d,edgeDistance(p,vec2(904.,508.),vec2(904.,490.)));
if(((508.>p.y)!=(490.>p.y))&&(p.x<(904.-904.)*(p.y-508.)/(490.-508.)+904.))inside=!inside;
return 1.-ss(-0.6,0.6,inside?-d:d);}
float thinLock(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(890.,490.),vec2(903.,490.)));
d=min(d,edgeDistance(p,vec2(903.,490.),vec2(905.,522.)));
if(((490.>p.y)!=(522.>p.y))&&(p.x<(905.-903.)*(p.y-490.)/(522.-490.)+903.))inside=!inside;
d=min(d,edgeDistance(p,vec2(905.,522.),vec2(908.,530.)));
if(((522.>p.y)!=(530.>p.y))&&(p.x<(908.-905.)*(p.y-522.)/(530.-522.)+905.))inside=!inside;
d=min(d,edgeDistance(p,vec2(908.,530.),vec2(909.,535.)));
if(((530.>p.y)!=(535.>p.y))&&(p.x<(909.-908.)*(p.y-530.)/(535.-530.)+908.))inside=!inside;
d=min(d,edgeDistance(p,vec2(909.,535.),vec2(910.,540.)));
if(((535.>p.y)!=(540.>p.y))&&(p.x<(910.-909.)*(p.y-535.)/(540.-535.)+909.))inside=!inside;
d=min(d,edgeDistance(p,vec2(910.,540.),vec2(911.,545.)));
if(((540.>p.y)!=(545.>p.y))&&(p.x<(911.-910.)*(p.y-540.)/(545.-540.)+910.))inside=!inside;
d=min(d,edgeDistance(p,vec2(911.,545.),vec2(912.,550.)));
if(((545.>p.y)!=(550.>p.y))&&(p.x<(912.-911.)*(p.y-545.)/(550.-545.)+911.))inside=!inside;
d=min(d,edgeDistance(p,vec2(912.,550.),vec2(914.,557.)));
if(((550.>p.y)!=(557.>p.y))&&(p.x<(914.-912.)*(p.y-550.)/(557.-550.)+912.))inside=!inside;
d=min(d,edgeDistance(p,vec2(914.,557.),vec2(916.,563.)));
if(((557.>p.y)!=(563.>p.y))&&(p.x<(916.-914.)*(p.y-557.)/(563.-557.)+914.))inside=!inside;
d=min(d,edgeDistance(p,vec2(916.,563.),vec2(917.,565.)));
if(((563.>p.y)!=(565.>p.y))&&(p.x<(917.-916.)*(p.y-563.)/(565.-563.)+916.))inside=!inside;
d=min(d,edgeDistance(p,vec2(917.,565.),vec2(919.,570.)));
if(((565.>p.y)!=(570.>p.y))&&(p.x<(919.-917.)*(p.y-565.)/(570.-565.)+917.))inside=!inside;
d=min(d,edgeDistance(p,vec2(919.,570.),vec2(921.,574.)));
if(((570.>p.y)!=(574.>p.y))&&(p.x<(921.-919.)*(p.y-570.)/(574.-570.)+919.))inside=!inside;
d=min(d,edgeDistance(p,vec2(921.,574.),vec2(924.,577.)));
if(((574.>p.y)!=(577.>p.y))&&(p.x<(924.-921.)*(p.y-574.)/(577.-574.)+921.))inside=!inside;
d=min(d,edgeDistance(p,vec2(924.,577.),vec2(927.,580.)));
if(((577.>p.y)!=(580.>p.y))&&(p.x<(927.-924.)*(p.y-577.)/(580.-577.)+924.))inside=!inside;
d=min(d,edgeDistance(p,vec2(927.,580.),vec2(929.,583.)));
if(((580.>p.y)!=(583.>p.y))&&(p.x<(929.-927.)*(p.y-580.)/(583.-580.)+927.))inside=!inside;
d=min(d,edgeDistance(p,vec2(929.,583.),vec2(930.,586.)));
if(((583.>p.y)!=(586.>p.y))&&(p.x<(930.-929.)*(p.y-583.)/(586.-583.)+929.))inside=!inside;
d=min(d,edgeDistance(p,vec2(930.,586.),vec2(934.,590.)));
if(((586.>p.y)!=(590.>p.y))&&(p.x<(934.-930.)*(p.y-586.)/(590.-586.)+930.))inside=!inside;
d=min(d,edgeDistance(p,vec2(934.,590.),vec2(939.,594.)));
if(((590.>p.y)!=(594.>p.y))&&(p.x<(939.-934.)*(p.y-590.)/(594.-590.)+934.))inside=!inside;
d=min(d,edgeDistance(p,vec2(939.,594.),vec2(946.,598.)));
if(((594.>p.y)!=(598.>p.y))&&(p.x<(946.-939.)*(p.y-594.)/(598.-594.)+939.))inside=!inside;
d=min(d,edgeDistance(p,vec2(946.,598.),vec2(950.,600.)));
if(((598.>p.y)!=(600.>p.y))&&(p.x<(950.-946.)*(p.y-598.)/(600.-598.)+946.))inside=!inside;
d=min(d,edgeDistance(p,vec2(950.,600.),vec2(957.,603.)));
if(((600.>p.y)!=(603.>p.y))&&(p.x<(957.-950.)*(p.y-600.)/(603.-600.)+950.))inside=!inside;
d=min(d,edgeDistance(p,vec2(957.,603.),vec2(960.,604.)));
if(((603.>p.y)!=(604.>p.y))&&(p.x<(960.-957.)*(p.y-603.)/(604.-603.)+957.))inside=!inside;
d=min(d,edgeDistance(p,vec2(960.,604.),vec2(957.,605.)));
if(((604.>p.y)!=(605.>p.y))&&(p.x<(957.-960.)*(p.y-604.)/(605.-604.)+960.))inside=!inside;
d=min(d,edgeDistance(p,vec2(957.,605.),vec2(951.,603.)));
if(((605.>p.y)!=(603.>p.y))&&(p.x<(951.-957.)*(p.y-605.)/(603.-605.)+957.))inside=!inside;
d=min(d,edgeDistance(p,vec2(951.,603.),vec2(945.,601.)));
if(((603.>p.y)!=(601.>p.y))&&(p.x<(945.-951.)*(p.y-603.)/(601.-603.)+951.))inside=!inside;
d=min(d,edgeDistance(p,vec2(945.,601.),vec2(940.,599.)));
if(((601.>p.y)!=(599.>p.y))&&(p.x<(940.-945.)*(p.y-601.)/(599.-601.)+945.))inside=!inside;
d=min(d,edgeDistance(p,vec2(940.,599.),vec2(934.,595.)));
if(((599.>p.y)!=(595.>p.y))&&(p.x<(934.-940.)*(p.y-599.)/(595.-599.)+940.))inside=!inside;
d=min(d,edgeDistance(p,vec2(934.,595.),vec2(926.,591.)));
if(((595.>p.y)!=(591.>p.y))&&(p.x<(926.-934.)*(p.y-595.)/(591.-595.)+934.))inside=!inside;
d=min(d,edgeDistance(p,vec2(926.,591.),vec2(923.,587.)));
if(((591.>p.y)!=(587.>p.y))&&(p.x<(923.-926.)*(p.y-591.)/(587.-591.)+926.))inside=!inside;
d=min(d,edgeDistance(p,vec2(923.,587.),vec2(920.,584.)));
if(((587.>p.y)!=(584.>p.y))&&(p.x<(920.-923.)*(p.y-587.)/(584.-587.)+923.))inside=!inside;
d=min(d,edgeDistance(p,vec2(920.,584.),vec2(917.,581.)));
if(((584.>p.y)!=(581.>p.y))&&(p.x<(917.-920.)*(p.y-584.)/(581.-584.)+920.))inside=!inside;
d=min(d,edgeDistance(p,vec2(917.,581.),vec2(914.,577.)));
if(((581.>p.y)!=(577.>p.y))&&(p.x<(914.-917.)*(p.y-581.)/(577.-581.)+917.))inside=!inside;
d=min(d,edgeDistance(p,vec2(914.,577.),vec2(911.,574.)));
if(((577.>p.y)!=(574.>p.y))&&(p.x<(911.-914.)*(p.y-577.)/(574.-577.)+914.))inside=!inside;
d=min(d,edgeDistance(p,vec2(911.,574.),vec2(908.,570.)));
if(((574.>p.y)!=(570.>p.y))&&(p.x<(908.-911.)*(p.y-574.)/(570.-574.)+911.))inside=!inside;
d=min(d,edgeDistance(p,vec2(908.,570.),vec2(905.,565.)));
if(((570.>p.y)!=(565.>p.y))&&(p.x<(905.-908.)*(p.y-570.)/(565.-570.)+908.))inside=!inside;
d=min(d,edgeDistance(p,vec2(905.,565.),vec2(901.,559.)));
if(((565.>p.y)!=(559.>p.y))&&(p.x<(901.-905.)*(p.y-565.)/(559.-565.)+905.))inside=!inside;
d=min(d,edgeDistance(p,vec2(901.,559.),vec2(897.,551.)));
if(((559.>p.y)!=(551.>p.y))&&(p.x<(897.-901.)*(p.y-559.)/(551.-559.)+901.))inside=!inside;
d=min(d,edgeDistance(p,vec2(897.,551.),vec2(894.,542.)));
if(((551.>p.y)!=(542.>p.y))&&(p.x<(894.-897.)*(p.y-551.)/(542.-551.)+897.))inside=!inside;
d=min(d,edgeDistance(p,vec2(894.,542.),vec2(892.,533.)));
if(((542.>p.y)!=(533.>p.y))&&(p.x<(892.-894.)*(p.y-542.)/(533.-542.)+894.))inside=!inside;
d=min(d,edgeDistance(p,vec2(892.,533.),vec2(890.,490.)));
if(((533.>p.y)!=(490.>p.y))&&(p.x<(890.-892.)*(p.y-533.)/(490.-533.)+892.))inside=!inside;
return 1.-ss(-0.6,0.6,inside?-d:d);}
float topLeaf(vec2 p){float d=2000.;bool inside=false;
d=min(d,edgeDistance(p,vec2(945.,542.),vec2(973.,538.)));
if(((542.>p.y)!=(538.>p.y))&&(p.x<(973.-945.)*(p.y-542.)/(538.-542.)+945.))inside=!inside;
d=min(d,edgeDistance(p,vec2(973.,538.),vec2(964.,553.)));
if(((538.>p.y)!=(553.>p.y))&&(p.x<(964.-973.)*(p.y-538.)/(553.-538.)+973.))inside=!inside;
d=min(d,edgeDistance(p,vec2(964.,553.),vec2(945.,542.)));
if(((553.>p.y)!=(542.>p.y))&&(p.x<(945.-964.)*(p.y-553.)/(542.-553.)+964.))inside=!inside;
return 1.-ss(-2.0,2.0,inside?-d:d);}
float localInk(vec2 p,vec3 rgb){return mix(1.,1.-ss(.55,.75,rgb.r),shoulderArea(p));}
float fixedShoulder(vec2 p){return shoulderArea(p)*(1.-shortLock(p))*(1.-thinLock(p))*texture2D(clothCleanTex,p/vec2(1536.,900.)).a;}
float hairEdge(vec2 z){return variant<.5?583.+.55*(z.x-1310.):520.+.53*(z.x-1280.);}
float hairMask(vec2 coord){return texture2D(maskTex,coord).g;}
// Each main-character layer shares the same restrained head motion, keeping the neck and shoulders anchored.
void main(){vec2 q=(uv-.5)/1.016+.5-mouse*depth;vec2 p=q*vec2(1536.,900.);
if(mode>.5&&mode<2.5){float head=1.-ss(390.,565.,p.y);float angle=(.0032*sin(t*.43)+.0014*sin(t*.71+.8))*head;vec2 v=p-vec2(790.,430.);p-=vec2(-v.y,v.x)*angle;p.y-=.8*sin(t*.62)*head;q=p/vec2(1536.,900.);}
vec2 s=p;
if(mode>.5&&mode<1.5){
 // The two sides share one temporal phase: vertical rise/fall, no lateral travelling wave.
 float cycle=.86*sin(t*.68)+.14*sin(t*1.36+.25);
 float dl=length(p-vec2(632.,375.)),dr=length(p-vec2(985.,390.));
 float l=pow(sat(dl/670.),1.35)*(1.-ss(520.,650.,p.x))*ss(340.,500.,p.y);
 float r=pow(sat(dr/650.),1.30)*ss(965.,1100.,p.x)*ss(360.,520.,p.y);
 vec2 d=vec2(2.5*(r-l)*cycle,(l*39.+r*43.)*cycle);
 // Front curl follows the same breeze. The scalp and forehead seam stay attached.
 float f=ss(440.,740.,p.y)*exp(-pow((p.x-(710.+.24*(p.y-500.)))/125.,4.))*(1.-ss(790.,890.,p.y));
 float side=ss(380.,545.,p.y)*(1.-ss(590.,680.,p.y))*exp(-pow((p.x-925.)/48.,4.));
 d+=vec2(f*9.*cycle+side*2.8*cycle,f*8.*cycle+side*2.*cycle);
 // Gradual 320-pixel falloff avoids the former 45-pixel stretch strip at the bottom.
 d*=1.-.96*ss(580.,900.,p.y);
 float shoulderEdge=min(edgeDistance(p,vec2(510.,480.),vec2(510.,590.)),min(edgeDistance(p,vec2(510.,590.),vec2(488.,640.)),edgeDistance(p,vec2(488.,640.),vec2(460.,805.))));
 d*=ss(28.,85.,shoulderEdge);
 d*=ss(18.,85.,length(p-vec2(1148.,783.)));
 d*=wind;
 d.x*=ss(0.,48.,p.x)*(1.-ss(1465.,1536.,p.x));
 s-=d;q=s/vec2(1536.,900.);
}
if(mode>1.5&&mode<2.5){s-=gaze*vec2(3.,2.)*bell(p,vec2(872.,314.),vec2(26.,22.));

s.y+=smile*(1.2*bell(p,vec2(873.,335.),vec2(35.,8.))+.4*bell(p,vec2(843.,359.),vec2(38.,23.)));float m=bell(p,vec2(777.,386.),vec2(35.,15.));s.y+=m*smile*(3.*pow(abs((p.x-777.)/36.),.6)-.65);s.x=mix(s.x,777.+(s.x-777.)/1.05,m*smile);q=s/vec2(1536.,900.);}
// Singing base has no spatial deformation. Only the alpha-matted hair pass moves.
if(mode>4.5&&mode<5.5){vec2 z=q*vec2(2048.,variant<.5?1280.:1152.);float root=variant<.5?1340.:1308.;float free=ss(root,root+100.,z.x)*ss(0.,23.,hairEdge(z)-z.y);float phase=t*.85-(z.x-root)*.004;vec2 d=vec2(10.*sin(phase),18.*sin(phase-.6))*free*wind;q-=d/vec2(2048.,variant<.5?1280.:1152.);}
if(mode>5.5){vec2 size=vec2(2048.,variant<.5?1280.:1152.);vec2 z=q*size;bool pa=mode>6.5;
 vec2 root=pa?(variant<.5?vec2(490.,714.):vec2(556.,675.)):(variant<.5?vec2(735.,674.):vec2(690.,577.));
 float free=ss(35.,pa?270.:510.,length(z-root));float phase=t*(pa?.94:.79)-(root.x-z.x)*.004+(z.y-root.y)*.003;
 vec2 d=vec2((pa?6.:10.)*sin(phase+.4),(pa?15.:24.)*sin(phase))*free*wind;q-=d/size;
}
if(mode>3.5&&mode<4.5){float h=bell(q,vec2(.52,.81),vec2(.13,.19))*ss(.60,.72,q.y);q.x-=h*.003*wind*sin(t*.85-q.y*9.);q.y-=h*.004*wind*sin(t*.85-q.x*8.);}
vec4 color=texture2D(tex,q);
if(mode>.5&&mode<1.1){
 float patch=max(patch0(s),patch1(s));
 vec4 overlap=texture2D(hairCleanTex,q*vec2(1.,900./960.));
 overlap.a=1.-ss(210./255.,240./255.,min(overlap.r,min(overlap.g,overlap.b)));
 color=mix(color,overlap,patch);
}

// Remove the letter, shoulder and strap fragments from both moving hair passes.
if(mode>1.1&&mode<1.5){color.a=sat(color.a+texture2D(maskTex,q).a*max(shortLock(s),thinLock(s)));}
if(mode>.5&&mode<1.5){color.a*=(1.-fixedShoulder(s))*localInk(s,color.rgb);}
// Restore missing forehead support and the complete strap artwork from the user's original.
if(mode>1.5&&mode<2.5){
 vec4 ref=texture2D(cleanTex,(p/vec2(1536.,900.))*vec2(1.,900./960.));
 float forehead=foreheadSupport(p);
 // Only the missing ornament is restored, with the body plate's local offset and tint.
 vec2 ornamentP=p+vec2(-4.,1.);
 vec3 referenceRGB=texture2D(cleanTex,ornamentP/vec2(1536.,960.)).rgb;
 float top=topLeaf(ornamentP)*ss(.60,.73,referenceRGB.g);
 float ornament=max(top,max(upperLeaf(ornamentP),lowerLeaf(ornamentP)));
 vec3 ornamentRGB=texture2D(cleanTex,ornamentP/vec2(1536.,960.)).rgb+vec3(.14,.09,.05);
 color.rgb=mix(color.rgb,clamp(ornamentRGB,0.,1.),ornament);
 // Fill missing forehead with neighboring face color, not the cooler composite reference.
 vec3 skin=texture2D(tex,vec2(850.,245.)/vec2(1536.,900.)).rgb;
 float added=(1.-color.a)*forehead;
 float totalAlpha=color.a+added;
 color.rgb=(color.rgb*color.a+skin*added)/max(totalAlpha,.00001);
 color.a=totalAlpha;
}
// Complementary split masks must reconstruct the original hair alpha even at filtered seam pixels.
if(mode>.5&&mode<1.1){float frontAlpha=sat(texture2D(frontHairTex,q).a+texture2D(maskTex,q).a*max(shortLock(s),thinLock(s)))*(1.-fixedShoulder(s))*localInk(s,texture2D(frontHairTex,q).rgb);color.a=sat(color.a/max(1.-frontAlpha,.00001));}
if(mode>2.5&&mode<3.5){float matte=texture2D(maskTex,q).r;color.rgb=mix(color.rgb,texture2D(cleanTex,q).rgb,matte);float cloth=texture2D(clothMaskTex,q).b;color.rgb=mix(color.rgb,texture2D(clothCleanTex,q).rgb,cloth);}
if(mode>4.5&&mode<5.5){color.a=hairMask(q);}
if(mode>5.5){vec4 cm=texture2D(clothMaskTex,q);color.a=mode>6.5?cm.g:cm.r;}
if(mode>1.5&&mode<2.5&&blink>0.){
 // Moving eyelids cover a stationary iris. The open/closed contours are continuously morphed,
 // rather than squeezing the whole eye or swapping textures at 88% closure.
 float x=p.x,y=p.y,b=sat(blink);
 float m=ss(827.,838.,x)*(1.-ss(915.,925.,x))*ss(236.,250.,y)*(1.-ss(347.,360.,y));
 float openTop=282.8+.0094*(x-850.)*(x-850.);
 float closedLine=312.+.0082*(x-852.)*(x-852.);
 float v=(x-875.)/40.;float openBottom=max(openTop+1.,310.+24.*sqrt(max(0.,1.-v*v))+.25*(x-875.));
 float upper=mix(openTop,closedLine,b),lower=mix(openBottom,closedLine,b*b);
 float upperWeight=1.-ss(upper-.65,upper+.65,y),lowerWeight=ss(lower-.65,lower+.65,y);
 float skinFalloff=ss(236.,290.,y);
 vec2 a=p/vec2(1536.,900.),ao=a,bo=a,bc=a;
 ao.y-=(upper-openTop)*skinFalloff/900.;
 bo.y+=(openBottom-lower)/900.;bc.y+=(closedLine-lower)/900.;
 vec4 topColor=texture2D(tex,ao);
 bc.y+=10.*b/900.;vec4 bottomColor=mix(texture2D(tex,bo),texture2D(closedTex,bc),b);
 float total=upperWeight+lowerWeight;
 vec4 lids=(topColor*upperWeight+bottomColor*lowerWeight)/max(total,.0001);
 color=mix(color,lids,sat(total)*m);
}
if(mode>2.5&&mode<3.5){vec2 z=((uv-.5)/1.016+.5-mouse*depth)*vec2(2048.,variant<.5?1280.:1152.);vec2 center=variant<.5?vec2(1190.8,403.2):vec2(1174.8,364.6);vec2 r=z-center;r.y-=r.x*.06;float e=sat(energy),h=.55+4.1*e;float clean=1.-ss(.65,1.2,length(r/vec2(8.,6.)));vec3 skin=texture2D(tex,q+vec2(0.,12./(variant<.5?1280.:1152.))).rgb;color.rgb=mix(color.rgb,skin,clean);float shape=1.-ss(.7,1.1,length(r/vec2(4.4+1.5*e,h)));vec3 inside=mix(vec3(.40,.24,.22),vec3(.68,.39,.30),sat(r.y/(h*2.)+.45));color.rgb=mix(color.rgb,inside,shape*.85);float tooth=(1.-ss(.55,.9,abs(r.x)/4.))*ss(-h,-h+.7,r.y)*(1.-ss(-h+1.3,-h+1.8,r.y))*ss(.28,.5,e);color.rgb=mix(color.rgb,vec3(.97,.92,.77),tooth*.8);}
float beam=exp(-pow((uv.x-uv.y*.35-(.20+.055*sin(t*.18)))/.12,2.))*(.012+.008*sin(t*.26));color.rgb=mix(color.rgb,vec3(1.,.98,.88),beam);// Dark variant: grade only main-character highlights after all compositing.
// Alpha, UVs, hair masks, face motion, background and story/singing passes are untouched.
if(mode>.5&&mode<2.5){
 float luminance=dot(color.rgb,vec3(.2126,.7152,.0722));
 float highlight=smoothstep(.25,.75,luminance);
 color.rgb*=mix(vec3(1.),vec3(.79,.81,.83),highlight);
}
// Singing-page exposure only. Original textures and all mattes stay unchanged.
// Apply the same hue-preserving curve to base, hair, Traveler and Paimon passes.
if((mode>2.5&&mode<3.5)||mode>4.5){
 float singingLuma=dot(color.rgb,vec3(.2126,.7152,.0722));
 float singingExposure=variant<.5
  ? mix(.86,.96,smoothstep(.80,1.,singingLuma))
  : mix(.84,1.,smoothstep(.68,.95,singingLuma));
 color.rgb*=mix(1.,singingExposure,smoothstep(.04,.16,singingLuma));
}
gl_FragColor=color;}`;
const compile=(s,t)=>{let x=g.createShader(t);g.shaderSource(x,s);g.compileShader(x);if(!g.getShaderParameter(x,g.COMPILE_STATUS))throw Error(g.getShaderInfoLog(x));return x;};let p=g.createProgram();g.attachShader(p,compile(vs,g.VERTEX_SHADER));g.attachShader(p,compile(fs,g.FRAGMENT_SHADER));g.linkProgram(p);if(!g.getProgramParameter(p,g.LINK_STATUS))throw Error(g.getProgramInfoLog(p));g.useProgram(p);this.u={};for(let n of ['tex','closedTex','cleanTex','maskTex','clothCleanTex','clothMaskTex','frontHairTex','hairCleanTex','mode','t','wind','blink','smile','energy','variant','depth','mouse','gaze'])this.u[n]=g.getUniformLocation(p,n);let b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),g.STATIC_DRAW);let a=g.getAttribLocation(p,'a');g.enableVertexAttribArray(a);g.vertexAttribPointer(a,2,g.FLOAT,false,0,0);g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);}
async load(){await Promise.all(['main-reference','main-hair-overlap','main-bg','hair-rear','body','hair-front','closed','room','soldier','child','memories','sing-a','sing-b','sing-a-clean','sing-b-clean','sing-a-cloth-clean','sing-b-cloth-clean'].map(async n=>{let im=new Image();im.src=assetURL('assets/img/'+n+(['main-reference','main-hair-overlap','hair-rear','body','hair-front','closed','sing-a-clean','sing-b-clean','sing-a-cloth-clean','sing-b-cloth-clean'].includes(n)?'.png':'.webp'));await im.decode();this.images[n]=im;let g=this.gl,x=g.createTexture();g.bindTexture(g.TEXTURE_2D,x);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,im);this.tex[n]=x;}));for(let v=0;v<2;v++){let g=this.gl,c=createSingingMatte(this.images[v?'sing-b':'sing-a'],v,this.images[v?'sing-b-clean':'sing-a-clean']),x=g.createTexture();g.bindTexture(g.TEXTURE_2D,x);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,c);this.tex[v?'sing-b-mask':'sing-a-mask']=x;let cloth=createClothMatte(this.images[v?'sing-b':'sing-a'],v),cx=g.createTexture();g.bindTexture(g.TEXTURE_2D,cx);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,cloth);this.tex[v?'sing-b-cloth-mask':'sing-a-cloth-mask']=cx;}}
resize(w,h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}
draw(state,t,opt,m,blink,smile,energy){let g=this.gl,u=this.u;g.clearColor(.06,.17,.2,1);g.clear(g.COLOR_BUFFER_BIT);for(let [n,v] of Object.entries({t,wind:opt.wind/100,blink,smile,energy,variant:state.variant||0}))g.uniform1f(u[n],v);g.uniform2f(u.mouse,m.x,m.y);g.uniform2f(u.gaze,m.gazeX??m.x,m.gazeY??m.y);g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,this.tex.closed);g.uniform1i(u.closedTex,1);g.activeTexture(g.TEXTURE2);g.bindTexture(g.TEXTURE_2D,this.tex[state.page==='main'?'main-reference':state.variant?'sing-b-clean':'sing-a-clean']);g.uniform1i(u.cleanTex,2);g.activeTexture(g.TEXTURE3);g.bindTexture(g.TEXTURE_2D,this.tex[state.page==='main'?'hair-rear':state.variant?'sing-b-mask':'sing-a-mask']);g.uniform1i(u.maskTex,3);g.activeTexture(g.TEXTURE4);g.bindTexture(g.TEXTURE_2D,this.tex[state.page==='main'?'body':state.variant?'sing-b-cloth-clean':'sing-a-cloth-clean']);g.uniform1i(u.clothCleanTex,4);g.activeTexture(g.TEXTURE5);g.bindTexture(g.TEXTURE_2D,this.tex[state.variant?'sing-b-cloth-mask':'sing-a-cloth-mask']);g.uniform1i(u.clothMaskTex,5);g.activeTexture(g.TEXTURE6);g.bindTexture(g.TEXTURE_2D,this.tex['hair-front']);g.uniform1i(u.frontHairTex,6);g.activeTexture(g.TEXTURE7);g.bindTexture(g.TEXTURE_2D,this.tex['main-hair-overlap']);g.uniform1i(u.hairCleanTex,7);g.activeTexture(g.TEXTURE0);g.uniform1i(u.tex,0);const draw=(n,mode,d)=>{g.bindTexture(g.TEXTURE_2D,this.tex[n]);g.uniform1f(u.mode,mode);g.uniform1f(u.depth,d*opt.parallax/100);g.drawArrays(g.TRIANGLES,0,6);};if(state.page==='main'){draw('main-bg',0,.003);draw('hair-rear',1,.009);draw('body',2,.009);draw('hair-front',1.2,.009);}else if(state.page==='sing'){draw(state.variant?'sing-b':'sing-a',3,.006);draw(state.variant?'sing-b':'sing-a',7,.006);draw(state.variant?'sing-b':'sing-a',6,.006);draw(state.variant?'sing-b':'sing-a',5,.006);}else draw(state.story||'room',4,.003);}
}
