
<!--<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>-->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App'
}
    //ios10禁用双指缩放
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);

//ios10禁用手指双击缩放
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
  var now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
</script>

<style>
*{
    margin: 0;
    padding: 0;
   /* font-family: "微软雅黑";*/
    font-family: "Arial","Microsoft YaHei",sans-serif;
}
    body{
        height: 100%;
        background-color: #F6F6F6;
    }
    #app{
            max-width: 750px;
    }
    .navTitle{
        font-weight: bold;
    }
    @media (min-width: 750px){
        #app{
            width: 750px;
            position: absolute;
            left: 50%;
            margin-left: -375px;
        }
    }
</style>
