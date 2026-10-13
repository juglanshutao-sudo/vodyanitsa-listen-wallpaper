'use strict';
// Source-space vector mattes. Only loose locks are movable; face, shoulder,
// clothing and the background never enter this deformation pass.
const singingHairPaths=[
'M1306 480 C1346 520 1409 543 1453 584 C1480 609 1497 638 1491 680 L1484 676 C1494 638 1474 612 1454 592 C1470 622 1473 644 1461 663 L1445 653 C1458 627 1448 602 1429 579 C1396 548 1341 527 1306 501 Z',
'M1306 520 C1347 587 1390 595 1462 609 C1523 619 1589 635 1620 685 C1635 712 1631 735 1624 751 L1605 741 C1614 706 1594 674 1564 655 C1589 688 1599 716 1593 736 L1571 726 C1583 687 1544 657 1508 644 C1458 625 1380 633 1339 584 C1323 565 1311 543 1306 520 Z'
];
function createSingingMatte(original,variant,clean){
 const c=document.createElement('canvas');c.width=original.width;c.height=original.height;const w=c.width,h=c.height,g=c.getContext('2d',{willReadFrequently:true});
 if(variant)g.setTransform(.86,0,0,.92,153.4,-16.6);
 g.fillStyle=g.strokeStyle='white';g.lineWidth=26;g.lineJoin='round';for(const d of singingHairPaths){const p=new Path2D(d);g.fill(p);g.stroke(p);}g.resetTransform();
 const matte=g.getImageData(0,0,w,h);g.clearRect(0,0,w,h);g.drawImage(original,0,0);const src=g.getImageData(0,0,w,h).data;
 g.clearRect(0,0,w,h);g.drawImage(clean,0,0,w,h);const bg=g.getImageData(0,0,w,h).data;
 const smooth=(a,b,x)=>{let v=Math.max(0,Math.min(1,(x-a)/(b-a)));return v*v*(3-2*v);};
 let raw=new Float32Array(w*h);const x0=variant?1250:1270,x1=variant?1600:1660,y0=variant?405:460,y1=variant?700:790;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const j=y*w+x,i=j*4,r=src[i]/255,gg=src[i+1]/255,b=src[i+2]/255;
 const lum=((bg[i]-src[i])*.299+(bg[i+1]-src[i+1])*.587+(bg[i+2]-src[i+2])*.114)/255;
 const ink=(1-smooth(.79,.89,r))*smooth(-.065,.005,(gg+b)*.5-r)*(1-smooth(.065,.13,b-gg)*(1-smooth(.47,.58,r)))*smooth(.065,.13,lum);
 const edge=variant?520+.53*(x-1280):583+.55*(x-1310);raw[j]=matte.data[i+3]>.5&&ink>.27&&y<edge-3?1:0;}
 function filter(a,r,isMax){const b=new Float32Array(w*h);for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){let v=isMax?0:1;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){let k=a[(y+dy)*w+x+dx]||0;v=isMax?Math.max(v,k):Math.min(v,k);}b[y*w+x]=v;}return b;}
 const closed=filter(filter(raw,2,true),2,false),erase=filter(closed,1,true);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;let r=0,a=0;if(x>x0&&x<x1&&y>y0&&y<y1){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const weight=(dx===0?2:1)*(dy===0?2:1)/16;r+=erase[(y+dy)*w+x+dx]*weight;a+=closed[(y+dy)*w+x+dx]*weight;}}const root=variant?1308:1340,edge=variant?520+.53*(x-1280):583+.55*(x-1310),pin=smooth(root,root+25,x)*smooth(0,10,edge-y);matte.data[i]=Math.round(r*pin*255);matte.data[i+1]=Math.round(a*pin*255);matte.data[i+2]=0;matte.data[i+3]=255;}
 g.putImageData(matte,0,0);return c;
}
