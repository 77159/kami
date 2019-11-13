<!--添加储蓄卡-->
<template>
  <div class="container" ref="wrapper" :style="{height: wrapperHeight + 'px'}">
    <div class="title">
      <div class="titleTxt">
        <span>温馨提示：</span>
        <span>为了更有效的为您服务，请您在添加好友时备注您的姓名+手机号+等级，即可加群成功。</span>
      </div>
      <div style="text-align: center">
        <img src="../../assets/gatheringMine/intoBanner.jpg" alt="">
      </div>
    </div>

    <div class="funOne">
      <p class="funTitle">方法1：微信号添加卡小妹</p>
      <div class="contentTxt">
        <div class="tipsTxt">
          <p>1、复制微信号：W-H77777</p>
          <p>2、打开微信添加好友</p>
        </div>
        <div class="btn">
          <div v-clipboard:copy="message" v-clipboard:success="copyWX">复制微信号</div>
        </div>
      </div>
    </div>

    <div style="width: 100%; background: #F6F6F6; height: 8px; margin: 20px 0"></div>

    <div class="funTwo" style="padding-bottom: 50px; background: #fff">
      <p class="funTitle">方法2：二维码添加卡小妹</p>
      <div class="contentTxt">
        <img style="width: 40%; margin-top: 20px; margin-bottom: 20px" :src="this.shareUrl" alt="">
        <div class="btn">
          <a class="saveQRCode" :href="shareUrl" download="img">保存二维码</a>
        </div>
        <p style="font-size: 14px; color: #cdcdcd; margin-top: 8px">打开微信扫一扫添加好友</p>
      </div>
    </div>

  </div>
</template>

<script>

  import { Toast } from 'mint-ui';

  export default {
    data () {
      return {
        wrapperHeight: 0,
        message: 'W-H77777',
        shareUrl: "https://ioskamidownload.oss-cn-qingdao.aliyuncs.com/credit_h5/qrcode_h5.jpg",
      }
    },
    created(){

    },
    mounted() {
      this.wrapperHeight = document.documentElement.clientHeight + 50;
    },
    methods:{

      copyWX() {
        Toast({message: "复制成功", duration: 1000});
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .container{
    background: #fff;
  }
  .title{
    padding: 15px;
  }
  .title img{
    width: 95%;
    margin: 20px 0;
  }
  .titleTxt span{
    font-size: 12px;
  }
  .titleTxt span:nth-of-type(1){
    color: #FF6C54;
  }
  .titleTxt span:nth-of-type(2){
    color: #FDCE77;
  }

  .funOne{
    padding: 0 15px;
  }
  .funTwo{
    padding: 0 15px;
    margin-top: 20px;
  }
  .funTitle{
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
  }

  .contentTxt{
    text-align: center;
  }

  .tipsTxt{
    width: 50%;
    font-size: 12px;
    color: #c5c5c5;
    display: inline-block;
    margin: 20px 0;
  }

  .tipsTxt p{
    float: left;
    margin-bottom: 5px;
  }

  .btn div{
    display: inline-block;
    width: 50%;
    height: 25px;
    line-height: 25px;
    border: 1px solid #7875FF;
    border-radius: 20px;
    color: #7875FF;
    font-size: 14px;
  }

  .btn a{
    display: inline-block;
    width: 50%;
    height: 25px;
    line-height: 25px;
    border: 1px solid #7875FF;
    border-radius: 20px;
    color: #7875FF;
    font-size: 14px;
    text-decoration: none;
  }


</style>
