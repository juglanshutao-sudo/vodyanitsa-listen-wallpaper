'use strict';
// Vector constraints in original-image coordinates; colors refine the garment edges.
// R=Traveler, G=Paimon, B=union used solely to reveal the stationary clean plate.
const clothPaths=[
 {traveler:'M742 662 C667 713 595 750 550 786 C489 838 440 857 378 865 C291 870 215 886 171 921 L148 975 L128 1074 C238 944 309 946 454 929 C513 898 556 862 578 826 C577 901 454 1022 317 1152 L417 1092 L448 1106 L611 1073 C674 1014 704 822 742 662 Z',paimon:'M504 701 C448 746 378 781 304 795 C215 810 143 789 87 759 L123 767 C109 748 96 713 114 696 C167 734 204 721 221 694 C231 676 249 678 247 702 C268 745 370 731 418 721 L504 701 Z'},
 {traveler:'M687 568 C654 588 631 643 593 676 C525 732 461 768 393 786 C307 806 285 784 226 761 C159 728 104 725 70 767 L44 794 C115 775 169 783 192 776 L208 769 C230 803 304 811 388 819 C514 819 615 716 655 661 L687 568 Z M690 572 C725 613 728 674 713 739 C700 805 668 830 616 851 C533 880 462 871 426 928 C407 956 401 984 400 1020 C387 966 396 917 423 887 C473 835 572 839 635 809 C688 781 703 658 690 572 Z',paimon:'M565 663 C494 718 446 736 381 739 C311 747 240 729 194 706 L236 715 C225 695 213 669 220 651 C262 677 297 687 319 654 C328 638 340 631 343 644 C342 679 401 692 439 684 L565 663 Z'}
];
function createClothMatte(original,variant){
 const w=original.width,h=original.height,c=document.createElement('canvas');c.width=w;c.height=h;
 const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(original,0,0);const src=g.getImageData(0,0,w,h).data;
 const channels=[];for(const key of ['traveler','paimon']){g.clearRect(0,0,w,h);g.fillStyle=g.strokeStyle='white';g.lineWidth=20;g.lineJoin='round';const path=new Path2D(clothPaths[variant][key]);g.fill(path);g.stroke(path);channels.push(g.getImageData(0,0,w,h).data);}
 const out=g.createImageData(w,h);const smooth=(a,b,v)=>{v=Math.max(0,Math.min(1,(v-a)/(b-a)));return v*v*(3-2*v);};
 const x0=20,x1=770,y0=555,y1=1190;let raw=[new Uint8Array(w*h),new Uint8Array(w*h)];
 for(let y=y0;y<Math.min(h-4,y1);y++)for(let x=x0;x<x1;x++){const j=y*w+x,i=j*4,r=src[i],gr=src[i+1],b=src[i+2],lum=.299*r+.587*gr+.114*b;const ink=variant?(lum<185):(gr>r-2&&b>r+1&&lum<185);for(let k=0;k<2;k++)raw[k][j]=channels[k][i+3]>64&&ink?1:0;}
 // Separable binary close fills print-grain pinholes without dragging wall pixels.
 function morph(a,r,max){let tmp=new Uint8Array(w*h),b=new Uint8Array(w*h);for(let y=y0-4;y<Math.min(h-4,y1+4);y++)for(let x=x0-4;x<x1+4;x++){let v=max?0:1;for(let d=-r;d<=r;d++)v=max?Math.max(v,a[y*w+x+d]):Math.min(v,a[y*w+x+d]);tmp[y*w+x]=v;}for(let y=y0-4;y<Math.min(h-4,y1+4);y++)for(let x=x0-4;x<x1+4;x++){let v=max?0:1;for(let d=-r;d<=r;d++)v=max?Math.max(v,tmp[(y+d)*w+x]):Math.min(v,tmp[(y+d)*w+x]);b[y*w+x]=v;}return b;}
 raw=raw.map(a=>morph(morph(a,3,true),3,false));const erase=raw.map(a=>morph(a,4,true));
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const j=y*w+x,i=j*4;let tr=0,pa=0,er=0;if(y>y0&&y<Math.min(h-4,y1)&&x>x0&&x<x1){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const k=(y+dy)*w+x+dx,weight=(dx===0?2:1)*(dy===0?2:1)/16;tr+=raw[0][k]*weight;pa+=raw[1][k]*weight;er+=Math.max(erase[0][k],erase[1][k])*weight;}}
 const tx=variant?690:735,ty=variant?577:674,px=variant?556:490,py=variant?675:714;
 const tpin=smooth(15,110,Math.hypot(x-tx,y-ty)),ppin=smooth(10,75,Math.hypot(x-px,y-py));tr*=tpin;pa*=ppin;
 out.data[i]=Math.round(tr*255);out.data[i+1]=Math.round(pa*255);out.data[i+2]=Math.round(er*Math.max(raw[0][j]?tpin:0,raw[1][j]?ppin:0,erase[0][j]?tpin:0,erase[1][j]?ppin:0)*255);out.data[i+3]=255;}
 g.putImageData(out,0,0);return c;
}
