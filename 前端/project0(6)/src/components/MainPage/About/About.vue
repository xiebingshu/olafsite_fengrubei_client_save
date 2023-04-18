<template >
  <div style="
    /* 100%窗口高度 */
    height: 100%;
    /* 弹性布局 水平+垂直居中 */
    display: flex;
    justify-content: center;
    align-items: center;">
    <div class="card">
      <div class="photo"><img src="../../../pictures/Mainpage/About/cx330.jpg" alt=""></div>
      <h1>Cx330</h1>
      <h2>前端 摸鱼好手</h2>
      <p>点检诗与傲骨</p>
      <p>白玉无瑕</p>
  <!--    <a href="#">了解更多</a>-->
    </div>
    <div class="card">
      <div class="photo"><img src="../../../pictures/Mainpage/About/xiebingshu.png" alt=""></div>
      <h1>谢秉书</h1>
      <h2>不知道前端还是后端 废物组长</h2>
      <p>人生最大的苦难往往来自于</p>
      <p>不自量力</p>
      <a href="#">了解更多</a>
    </div>
    <div class="card">
      <div class="photo"><img src="../images/op/asl/l.jpg" alt=""></div>
      <h1>路飞</h1>
      <h2>草帽小子</h2>
      <p>蒙奇·D·路飞，日本漫画《航海王》及其衍生作品中的男主角。是草帽海贼团的船长。</p>
      <a href="#">了解更多</a>
    </div>
    <div class="card">
      <div class="photo"><img src="../images/op/asl/s.jpg" alt=""></div>
      <h1>萨博</h1>
      <h2>革命军的二把手</h2>
      <p>萨博，日本漫画《航海王》及其衍生作品中的角色。是路飞与艾斯的结义兄弟。</p>
      <a href="#">了解更多</a>
    </div>
    <div class="card">
      <div class="photo"><img src="../images/op/asl/l.jpg" alt=""></div>
      <h1>路飞</h1>
      <h2>草帽小子</h2>
      <p>蒙奇·D·路飞，日本漫画《航海王》及其衍生作品中的男主角。是草帽海贼团的船长。</p>
      <a href="#">了解更多</a>
    </div>
    <div class="card">
      <div class="photo"><img src="../images/op/asl/s.jpg" alt=""></div>
      <h1>萨博</h1>
      <h2>革命军的二把手</h2>
      <p>萨博，日本漫画《航海王》及其衍生作品中的角色。是路飞与艾斯的结义兄弟。</p>
      <a href="#">了解更多</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "about"
}
</script>

<style scoped>
.card{
  /* 相对定位 */
  position: relative;
  width: 180px;
  height: 270px;
  bottom: 110px;
  margin: 15px;
  background-color: #758a99;
  border-radius: 12px;
  /* 溢出隐藏 */
  overflow: hidden;
  /* 弹性布局 */
  display: flex;
  /* 元素纵向排列 */
  flex-direction: column;
  /* 居中 */
  align-items: center;
  color: #fff;
  /* 阴影 */
  box-shadow: 0 0 18px rgba(0,0,0,0.5);
  /* 不让其被挤压 */
  flex-shrink: 0;
}
.card .photo img{
  width: 100%;
  height: 100%;
  /* 保持原有尺寸比例，裁切长边 */
  object-fit: cover;
}
/* 默认大图 */
.card .photo{
  /* 绝对定位 */
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 0%;
  overflow: hidden;
  /* 动画过渡 */
  transition: 0.5s;
}
/* 鼠标移入变小图 */
.card:hover .photo{
  top: 18px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(0,0,0,0.8);
}
/* 这里加个黑色到透明的渐变背景，可以更好的看清楚名字 */
.card .photo::before{
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,transparent 50%,#222);
}
.card h1{
  position: absolute;
  top: 222px;
  transition: 0.5s;
}
.card:hover h1{
  top: 102px;
}
.card h2{
  margin-top: 132px;
  width: 80%;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  font-size: 12px;
  text-align: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
}
.card p{
  width: 90%;
  text-align:center;
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 18px;
}
.card a{
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.5);
  padding: 8px 32px;
  border-radius: 8px;
}
.card a:hover{
  color: #fff;
  background-color: rgba(255,255,255,0.2);
}
</style>