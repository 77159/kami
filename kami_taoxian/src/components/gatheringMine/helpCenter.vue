<!--添加储蓄卡-->
<template>
  <div>
    <div class="box">
      <nav class="navTitle" ref="wrapper2">
        <img @click="backHistory()" src="../../assets/fanhui@2x.png">
        帮助中心
      </nav>
      <div class="tabTitle" ref="wrapper">
        <ul class="tabs">
          <li class="li-tab" v-for="(item,index) in tabsParam" @click="toggleTabs(index)" :key="index">
            <a class="color_a"  :class="{active:index==nowIndex}">{{item}}</a>
          </li>
        </ul>
      </div>
      <div class="divTab" v-show="nowIndex===0">
        <ul>
          <li class="qusetionStyle" @click="toggleNewHelplist(0)" :class="{shouqibg:nowNewHelpIndex===0}">1.什么是信用卡收款（取现）</li>
          <li class="content" v-show="nowNewHelpIndex===0">通过APP，您可以将信用卡中的资金取到自己的储蓄卡中，每取现一笔资金会收取一定的费用。</li>
          <li class="qusetionStyle" @click="toggleNewHelplist(1)" :class="{shouqibg:nowNewHelpIndex===1}">2.为什么不能用别人信用卡取现</li>
          <li class="content" v-show="nowNewHelpIndex===1">为保证安全，首先需要完成身份认证，然后添加信用卡和储藏卡，持卡人姓名与认证本人一致。</li>
          <li class="qusetionStyle" @click="toggleNewHelplist(2)" :class="{shouqibg:nowNewHelpIndex===2}">3.APP中信用卡取现方法</li>
          <li class="content" v-show="nowNewHelpIndex===2">
            1）下载注册APP<br>
            2）点击首页上“立即取现”<br>
            3）根据提示操作（身份认证、添加信用卡、储蓄卡）<br>
            4）输入取现金额（金额不是整数有利于养卡，例如：564、2930、4011）<br>
            5）完成到账</li>
          <li class="qusetionStyle" @click="toggleNewHelplist(3)" :class="{shouqibg:nowNewHelpIndex===3}">4.取现金额限制</li>
          <li class="content" v-show="nowNewHelpIndex===3">单笔取现金额200-19999,当天单卡最大5万元，小提示：您可以添加多张信用卡可获得更多资金。</li>
          <li class="qusetionStyle" @click="toggleNewHelplist(4)" :class="{shouqibg:nowNewHelpIndex===4}">5.什么时间可以取现？</li>
          <li class="content" v-show="nowNewHelpIndex===4">建议每天9:00-22:00，实时到账。</li>
        </ul>
      </div>
      <div class="divTab" v-show="nowIndex===1">
        <ul>
          <li class="qusetionStyle" @click="toggleEnchashmentList(0)" :class="{shouqibg:nowEnchashmentIndex===0}">1.身份认证问题</li>
          <li class="content" v-show="nowEnchashmentIndex===0">为保证您的资金安全，初次取现的用户，需要本人身份证认证，下次取现无需要再认证。进行认证时，如果出现无法拍照，可能是您关闭了手机->设置->相机拍照权限，请开启权限后重试。</li>
          <li class="qusetionStyle" @click="toggleEnchashmentList(1)" :class="{shouqibg:nowEnchashmentIndex===1}">2.添加信用卡(储蓄卡)问题</li>
          <li class="content" v-show="nowEnchashmentIndex===1">只能添加认证本人信用卡(储蓄卡)，可添加多张，取现时可以随时更换。</li>
          <li class="qusetionStyle" @click="toggleEnchashmentList(2)" :class="{shouqibg:nowEnchashmentIndex===2}">3.支持哪些银行的信用卡</li>
          <li class="content" v-show="nowEnchashmentIndex===2">中国发行的具有银联标志的信用卡，取现时可点击费率后面的"问号图标"查看当前费率支持的银行。</li>

          <li class="qusetionStyle" @click="toggleEnchashmentList(4)" :class="{shouqibg:nowEnchashmentIndex===4}">4.取现结算到账时间</li>
          <li class="content" v-show="nowEnchashmentIndex===4">01:00-22:00期间持卡人刷卡支付后，秒结算，最快3秒到账。
            以下情况可能会有延迟，例如：银行卡信息有误，或银行系统问题，未及时到账，可能转至第二个工作日结算，请耐心等待。</li>
          <li class="qusetionStyle" @click="toggleEnchashmentList(5)" :class="{shouqibg:nowEnchashmentIndex===5}">5.储蓄卡遗失无法收款</li>
          <li class="content" v-show="nowEnchashmentIndex===5">您添加的储蓄卡遗失，并已通知银行冻结此卡，在此期间取现的金额无法打款到这张卡中，您需要更换或添加新的到账储蓄卡，并联系客服获得帮助。</li>
        </ul>
      </div>
      <div class="divTab" v-show="nowIndex===2">
        <ul>
          <li class="qusetionStyle" @click="toggleVipList(0)" :class="{shouqibg:nowVipIndex===0}">1.使用APP有什么好处</li>
          <li class="content" v-show="nowVipIndex===0">APP会不定期举行一些活动，活动的奖励金额会返现到您的账户余额，并可以提现。</li>
          <li class="qusetionStyle" @click="toggleVipList(1)" :class="{shouqibg:nowVipIndex===1}">2.什么是好友分成奖励</li>
          <li class="content" v-show="nowVipIndex===1">在活动期间，您邀请的好友每完成一笔取现，您都会获取相应的分成奖励，自动转到您的账户收益中，在APP中领取。</li>
          <li class="qusetionStyle" @click="toggleVipList(2)" :class="{shouqibg:nowVipIndex===2}">3.账户收怎样提现</li>
          <li class="content" v-show="nowVipIndex===2">满50元可以提现，两个工作日到账</li>
          <li class="qusetionStyle" @click="toggleVipList(4)" :class="{shouqibg:nowVipIndex===4}">4.取现费率</li>
          <li class="content" v-show="nowVipIndex===4">
            等级越高，享有取现费率越低<br />
            <table width="200" border="1" style="border:1px thin #CCC; border-collapse:collapse;">
              <tr>
                <td><strong>等级</strong></td>
                <td><strong>大额费率</strong></td>
                <td><strong>小额费率</strong></td>
              </tr>
              <tr>
                <td>普通用户</td>
                <td style="text-align: center">0.55%</td>
                <td style="text-align: center">0.36%</td>
              </tr>
              <tr>
                <td>黄金合伙人</td>
                <td align="center">0.53%</td>
                <td align="center">0.34%</td>
              </tr>
              <tr>
                <td>白金合伙人</td>
                <td align="center">0.51%</td>
                <td align="center">0.32%</td>
              </tr>
              <tr>
                <td>钻石合伙人</td>
                <td align="center">0.48%</td>
                <td align="center">0.30%</td>
              </tr>
            </table></li>
          <li class="qusetionStyle" @click="toggleVipList(3)" :class="{shouqibg:nowVipIndex===3}">5.如何成为合伙人</li>
          <li class="content" v-show="nowVipIndex===3">打开APP -> 我的 -> 邀请好友，选择任意邀请方式，分享给好友，好友通过您的邀请链接或二维码完成注册。
            <table width="200" border="1" style="border:1px thin #CCC; border-collapse:collapse;">
              <tr>
                <td><strong>等级</strong></td>
                <td><strong>所需邀请人数</strong></td>
              </tr>
              <tr>
                <td>普通用户</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>黄金合伙人</td>
                <td align="center">5人</td>
              </tr>
              <tr>
                <td>白金合伙人</td>
                <td align="center">15人</td>
              </tr>
              <tr>
                <td>钻石合伙人</td>
                <td align="center">30人</td>
              </tr>
            </table></li>

        </ul>
      </div>
      <div class="divTab divTab_2" v-show="nowIndex===3" :style="{height: this.wrapperHeight}">
        <!--<img src="../../assets/gatheringMine/newone.png" style="width: 100%;margin-top: 20px;">-->
        <img src="http://download.pcuion.com/credit_h5/rz2.png" style="width: 100%;">
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  export default {
    data () {
      return {
        isShouqi:false,
        tabsParam:['新手帮助','取现问题','费用与奖励','取现流程图'],//（这个也可以用对象key，value来实现）
        nowIndex:0,
        nowNewHelpIndex:-1,
        nowEnchashmentIndex:-1,
        nowVipIndex:-1,
        wrapperHeight: '',
      }
    },
    created(){

    },
    mounted() {
      //动态计算页面高度 navTitle
      this.wrapperHeight = (document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 44) + 'px';

    },
    methods:{
      backHistory(){
        this.$router.go(-1)
        /*this.$router.tabChange=false;*/
      },
      //tabTitle切换
      toggleTabs:function(index){
        this.nowIndex=index;
        this.nowNewHelpIndex=-1;
        this.nowEnchashmentIndex=-1;
        this.nowVipIndex=-1;
      },
      toggleNewHelplist:function(index){
        this.nowNewHelpIndex=this.nowNewHelpIndex==index?-1:index;
        this.isShouqi=true;
      },
      toggleEnchashmentList:function(index){
        this.nowEnchashmentIndex=this.nowEnchashmentIndex==index?-1:index;
        /*this.nowEnchashmentIndex=index;*/
        this.isShouqi=true;
      },
      toggleVipList:function(index){
        this.nowVipIndex=this.nowVipIndex==index?-1:index;
        /*this.nowVipIndex=index;*/
        this.isShouqi=true;
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  *{
    margin: 0;
    padding: 0;
    outline:medium;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    list-style: none;
  }
  .box{
    height: 100%;
  }
  .navTitle{
    width:100%;
    height: 43px;
    line-height: 43px;
    text-align: center;
    font-size: 18px;
    color: #363636;
    border-bottom: 1px solid #C9C9C9;
    background:#fff;
  }
  .navTitle img{
    width: 12px;
    position: absolute;
    top: 10px;
    left: 5%;
  }

  .box .active{
    height: 38px;
    line-height: 38px;
    display: inline-block;
    color: #b08c4d;
    border-bottom: 2px solid #b08c4d;
  }
  .box .tabTitle{
    width: 100%;
    height: 41px;
    line-height: 41px;
    background-color: #fff;
    margin-bottom: 1px;
  }
  .box .tabTitle li{
     width: 25%;
     float: left;
     text-align: center;
   }
   /* .box .tabTitle li .color_a{
     color: #888;
   } */
  .box .divTab{
    width: 100%;
    background-color: #fff;
  }
  .box .divTab .qusetionStyle{
    width: 90%;
    min-height: 14px;
    line-height: 24px;
    border-bottom: 1px solid #f3f3f3;
    text-align: left;
    vertical-align:middle;
    padding: 18px 5% 18px;
    font-size: 15px;
    float: left;
    background: url(../../assets/gatheringMine/gengduo@2x.png) 96% 50% no-repeat;
    background-size: 11px 6px;
    background-color: #fff;
    -webkit-tap-highlight-color: transparent;
  }
  .box .divTab .shouqibg{
    background: url(../../assets/gatheringMine/shouqi@2x.png) 96% 50% no-repeat;
    background-color: #fff;
    background-size: 11px 6px;
  }
  .box .divTab .content{
    background-color: #fff;
    width: 85%;
    min-height:24px;
    line-height:24px;
    border-bottom: 1px solid #f3f3f3;
    text-align: left;
    padding:16px 5% 16px 10%;
    font-size: 13px;
    /*display: none;*/
    color: #6C6C6C;
    float: left;
  }

  .box .divTab_2{
    /*height: 800px !important;*/
    background: #4c4c4c;
  }
</style>
