<script setup>
import {onMounted, ref} from 'vue'
import Log from './Log/Log.vue'
import LoginBackground from './LoginBackground/LoginBackground.vue'
  // 这个是我事先准备好的粒子插件
  //const particle={init:function(e){const t=document.getElementById(e),n=t.getContext("2d"),o=1;let a=t.width=window.innerWidth*o,c=t.height=window.innerHeight*o;const i=.05*a,s=.1*a,d=(e=1)=>Math.random()*e,l=Math.PI,r=2*l;let p=new Date;const h=(e,t,n)=>(1-n)*e+n*t,m=(e,t,n,o)=>{const a=e-n,c=t-o;return Math.sqrt(a*a+c*c)},y=new Array(400).fill({}).map(()=>({x:.5*a+Math.cos(d(r))*d(.5*a),y:.5*c+Math.sin(d(r))*d(.5*c),angle:d(r),speed:d(.15),normalSpeed:d(.15),oscAmplitudeX:d(2),oscSpeedX:.001+d(.008),oscAmplitudeY:d(2),oscSpeedY:.001+d(.008),connectDistance:d(i),color:{r:255,g:255,b:255}})),g=()=>{p=new Date,y.forEach(e=>{e.x+=(Math.cos(e.angle)+Math.cos(p*e.oscSpeedX)*e.oscAmplitudeX)*e.speed,e.y+=(Math.sin(e.angle)+Math.cos(p*e.oscSpeedY)*e.oscAmplitudeY)*e.speed,e.speed=h(e.speed,e.normalSpeed*o,.1),(e.x>a||e.x<0)&&(e.angle=l-e.angle),(e.y>c||e.y<0)&&(e.angle=-e.angle),d()<.005&&(e.oscAmplitudeX=d(2)),d()<.005&&(e.oscSpeedX=.001+d(.008)),d()<.005&&(e.oscAmplitudeY=d(2)),d()<.005&&(e.oscSpeedY=.001+d(.008)),e.x=Math.max(-.01,Math.min(e.x,a+.01)),e.y=Math.max(-.01,Math.min(e.y,c+.01))}),n.clearRect(0,0,a,c),y.map(e=>{y.filter(t=>e!=t&&!(m(e.x,e.y,t.x,t.y)>e.connectDistance)).map(t=>{const n=m(e.x,e.y,t.x,t.y);return e.speed=h(e.speed,e.speed+.05/e.connectDistance*n,.2),{p1:e,p2:t,color:e.color,opacity:Math.floor(100/e.connectDistance*(e.connectDistance-n))/100}}).forEach((e,t)=>{const o=Math.sin(p*e.p1.oscSpeedX);n.beginPath(),n.globalAlpha=e.opacity,n.moveTo(e.p1.x,e.p1.y),n.lineTo(e.p2.x,e.p2.y),n.strokeStyle=`rgb(\n\t\t\t\t\t${Math.floor(e.color.r*o)},\n\t\t\t\t\t${Math.floor(.5*e.color.g+.5*e.color.g*o)},\n\t\t\t\t\t${e.color.b}\n\t\t\t\t)`,n.lineWidth=4*e.opacity,n.stroke(),n.closePath()})}),window.requestAnimationFrame(g)};g(),window.addEventListener("mousemove",e=>{const t=e.layerX*o,n=e.layerY*o;y.forEach(e=>{const o=m(t,n,e.x,e.y);if(o<s&&o>0){e.angle=((e,t,n,o)=>Math.atan2(o-t,n-e))(t,n,e.x,e.y);const a=.1*(s-o);e.speed=h(e.speed,a,.2)}})}),window.addEventListener("resize",e=>{a=t.width=window.innerWidth*o,c=t.height=window.innerHeight*o})}};
  //onMounted(()=>{particle.init('my_canvas')})
</script>

<template>
  <body>
<!--    <canvas id="my_canvas"></canvas>-->
  <LoginBackground></LoginBackground>
    <Log></Log>
  </body>
</template>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
body{
  background-color: #000;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
canvas{
  width: 100%;
}
.text{
  color: #fff;
  letter-spacing: 2px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
