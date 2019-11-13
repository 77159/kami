<template>
  <div class="wrap">
    <div class="content">

      <div class="ruleDescription" @click="getRuleDescription">规则说明</div>

      <ul class="list">
        <li>
          <img src="../../assets/generalize/friendsdivision1.jpg" style="pointer-events: none;"/>
        </li>
        <li>
          <img src="../../assets/generalize/friendsdivision2.jpg" style="pointer-events: none;"/>
        </li>
        <li>
          <img src="../../assets/generalize/friendsdivision3.jpg" style="pointer-events: none;"/>
        </li>
        <li>
          <img src="../../assets/generalize/friendsdivision4.jpg" style="pointer-events: none;"/>
        </li>
      </ul>

      <div class="footerFunBtn">
        <div class="inviteFriends" @click=inviteFriends>
          <span>我邀请的好友</span>
          <img style="width: 16px; height: 16px; margin-left: 5px" src="../../assets/generalize/toRight.png" alt="">
        </div>
        <div class="myIncome" @click=myIncome>
          <span>我的收益</span>
          <img style="width: 16px; height: 16px; margin-left: 5px" src="../../assets/generalize/toRight.png" alt="">
        </div>
      </div>

      <div class="inviteNow" @click=inviteNow>立即邀请</div>
    </div>
  </div>
</template>

<script>
    export default {

      data () {
        return {

        }
      },
      created(){


      },
      mounted() {
      },
      computed: {

      },
      methods:{

        inviteFriends() {
          //添加给ios判断页面样式
          let u = navigator.userAgent;
          let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
          let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

          if(isAndroid) {
            window.webView.inviteFriends();
          }else if(isiOS) {
            window.webkit.messageHandlers.inviteFriends.postMessage('inviteFriends')
          }else {
          }
        },

        myIncome() {
          let u = navigator.userAgent;
          let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
          let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

          if(isAndroid) {
            window.webView.myIncome();
          }else if(isiOS) {
            window.webkit.messageHandlers.myIncome.postMessage('myIncome')
          }else {
          }
        },

        inviteNow() {
          let u = navigator.userAgent;
          let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
          let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

          if(isAndroid) {
            window.webView.inviteNow();
          }else if(isiOS) {
            window.webkit.messageHandlers.inviteNow.postMessage('inviteNow')
          }else {
          }
        },


        //规则说明页面
        getRuleDescription() {
          window.location.href = 'http://page.kamicard.com/web/ruledescription.html';
        },


      },
    }
</script>

<style scoped>
  .wrap{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .list{
    list-style: none;
  }
  .list li img{
    width: 100%;
    vertical-align:bottom;
    display: block;
  }

  .footerFunBtn{
    background: #FF3413;
    width: 100%;
    height: 2rem;
    padding-bottom: 0.5rem;
    color: #fff;
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .footerFunBtn div{
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .inviteNow{
    background: #FFC03A;
    width: 100%;
    height: 3rem;
    color: #D8332F;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ruleDescription{
    position: absolute;
    top: 10px;
    right: 10px;
    background: #DE3621;
    width: 65px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 12px;
    border-radius: 10px;
  }

</style>
