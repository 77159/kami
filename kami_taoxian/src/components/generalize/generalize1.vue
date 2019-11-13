<!--个人资料-->
<template>
  <div class="wrap">
      <div class="box" :class="{noScroll: isAgreement}" id="generalize">
        <header>
            <!--<img src="../../assets/generalize/title.png">-->
            <img src="../../assets/generalize/generalize_main.jpg">
        </header>
          
        <div class="title">
            <p>银联在线无卡收款 不是贷款 无需审核</p>
            <div class="title_tips">
                <div class="title_tips_option">
                    <img src="../../assets/generalize/generalize_yuan.png" alt="">
                    <span>低费率</span>
                </div>
                <div class="title_tips_option">
                    <img src="../../assets/generalize/generalize_yuan.png" alt="">
                    <span>秒到账</span>
                </div>
                <div class="title_tips_option">
                    <img src="../../assets/generalize/generalize_yuan.png" alt="">
                    <span>安全有保障</span>
                </div>
            </div>
        </div>
        <div class="quxian_button" @click='toquxian'>  
            <!-- <a href="http://credit.kamicard.com/loginIndex"></a> -->
            <p>立即取现</p>
        </div>
        <div class="options">
            <a href="http://page.kamicard.com/download/kami_downloadApp.html"></a>
            <div class="options_item">
                <img class="main_img" src="../../assets/generalize/generalize_option1.png" alt="">
                <span>收款记录</span>
            </div>
            <div class="options_item">
                <img class="tip_img1" src="../../assets/generalize/generalize_hongbao.png" alt="">
                <img class="main_img" src="../../assets/generalize/generalize_option2.png" alt="">
                <span>邀请好友</span>
            </div>
            <div class="options_item">
                <img class="tip_img2" src="../../assets/generalize/generalize_yi.png" alt="">
                <img class="main_img" src="../../assets/generalize/generalize_option3.png" alt="">
                <span>个人中心</span>
            </div>
            <div class="options_item">
                <img class="main_img" src="../../assets/generalize/generalize_option4.png" alt="">
                <span>APP下载</span>
            </div>
        </div>
        <div class="useMoney">
        <ul class="marquee_list" :class="{marquee_top:animate}">
            <li v-for="(item, idx) in messageList" :key="idx">
                <img src="../../assets/generalize/generalize_laba.png" alt="">
                <span class="good">用户{{item.user}}xxxx</span>
                <span class="good">{{randomMobNum}} 通过信用卡取现</span>
                <span class="good moneyNum">{{randomMoneyNum}}</span>
                <span class="good">元</span>
            </li>
        </ul>
        </div>
        </div>
  </div>
</template>

<script>
/*document.documentElement.style.fontSize = document.documentElement.clientWidth / 750*100 + 'px';*/

document.title = '卡秘信用卡'

import animate from 'animate.css';
import md5 from 'js-md5';
import { Toast } from 'mint-ui';
import {postCode,postRegister} from '../../requestAPI/requestAPI';

export default {
    data () {
        return {
            randomMobNum: 3741,
            randomMoneyNum: 6587,
            btnText:'',
            messageList:[
                {user: '177'},
                {user: '155'},
                {user: '138'},
                {user: '188'},
                {user: '159'},
                {user: '151'},
            ],
            isCurrent:0,
            show:true,   //发送验证码
            count:'',     //倒计时
            codeText:'获取验证码',
            urlList:{    //url拼接参数
              urlAll:'',             //所有参数
              urlUtype:'',             //需求
              urlUtm:'',               //注册渠道
            },
            isAgreement:false,
            codeList:{//发送验证码-取现
                mobile:'',          //手机号
                ul:1,               //固定值 1
                data:'',            //校验值
                mid:11,
                type:0,             //来自H5注册
            },
            codedownloadList:{//发送验证码-取现
                mobile:'',          //手机号
                mid:11,
            },
            registerList:{   //post注册
                mobile:'',          //手机号
                code:'',            //验证码
                ul:1,               //固定值 1
                data:'',            //校验值
                mid:11,
                check:1,            //协议
                regtype:'h5',
                channel: '',
            },
            registerdownloadList:{   //post注册
                mobile:'',          //手机号
                code:'',            //验证码
                mid:11,
                check:1,            //协议
                regtype:'h5',
                channel: '',
            },
            registeredList:{  //已注册返回值
                enstring:'',
                usid:'',
                token:'',
                defaultString:'',
            },
            animate: false,
        }
    },
    created(){
        this.remCss();
        this.getUrl();
        /*this.autoPlay();*/
        this.userRandom();
        // this.showMarquee()
        setInterval(this.showMarquee, 2000)

      //取得URL中参数的值
      this.urlList.urlAll = window.location.href.split('?')[1];
      if(this.urlList.urlAll != undefined) {
        if(this.urlList.urlAll.indexOf('utm_source=')>-1){
          this.urlList.urlUtm = this.urlList.urlAll.split('utm_source=')[1].split('&')[0];
        }
      }


    },
    mounted() {
    },
    computed: {

    },
    methods:{
        showMarquee() {
            this.animate = true;
            setTimeout(()=>{
                this.randomMoneyNum= Math.round(500+Math.random()*19499);
                this.randomMobNum= Math.round(1000+Math.random()*8999);
                this.messageList.push(this.messageList[0]);
                this.messageList.shift();
                this.animate = false;
            },500)
        },
        // 去取现页
        toquxian(){
            console.log('aaa')
            this.$router.push({
                path:'/loginIndex'
            })
        },
        //自动滚动
        autoPlay () {
          let length = this.messageList.length;
          if (this.isCurrent >= length) {
            this.isCurrent = 0;
            this.autoPlay();
          }else{
            setTimeout(()=>{
              this.isCurrent++;
              this.autoPlay();
              this.randomMoneyNum= Math.round(500+Math.random()*19499);
              this.randomMobNum= Math.round(1000+Math.random()*8999);
            }, 3000)
          }
        },
        //用户人数随机数
        userRandom(){
            setInterval(()=>{
                /*this.randomuserNum= Math.floor(this.randomuserNum+Math.random()*10);*/
                if(this.randomuserNum<9999990){
                    this.randomuserNum= Math.floor(this.randomuserNum+Math.random()*10);
                }else{
                    this.randomuserNum= Math.floor(2000000+Math.random()*10);
                }
            }, 5000)
        },
        //url获取参数
        getUrl(){
            this.urlList.urlAll = window.location.href.split('?')[1];

          if(this.urlList.urlAll != undefined) {
            if(this.urlList.urlAll.indexOf('utype=')>-1){
              this.urlList.urlUtype = this.urlList.urlAll.split('utype=')[1].split('&')[0];
              if(this.urlList.urlUtype==1){
                this.btnText = '立即取现';
              }else if(this.urlList.urlUtype==2){
                this.btnText = '立即下载';
              }
            }
            if(this.urlList.urlAll.indexOf('utm_source=')>-1){
              this.urlList.urlUtm = this.urlList.urlAll.split('utm_source=')[1].split('&')[0];
            }
          }

        },
        //发送验证码
        sendCode(){
            var reg=/^((1[3,5,8][0-9])|(14[5,7])|(166)|(17[0,6,7,8])|(19[7]))\d{8}$/;
            if(!reg.test(this.codeList.mobile)){
                Toast({message:'请输入正确的手机号',duration: 1000});
            }else{
                //取现
                if(this.urlList.urlUtype==1){
                    this.codeList.data = md5('kami2018'+this.codeList.mobile+'2018kami');  //生成校验值
                    /*发送验证码*/
                    postCode(this.codeList).then(data => {
                        if(data.result.code == 10000) {
                            if(data.data.state!=''){//已注册
                                Toast({message:data.data.msg,duration: 1000});
                                /*console.log(data.data);*/
                                this.registeredList.token = data.data.token;
                                this.registeredList.usid = data.data.usid;
                                this.registeredList.enstring = data.data.enstring;
                                this.registeredList.defaultString = md5('ilovekamicredit2018'+this.registeredList.token+this.registeredList.usid+'ilovekamicredit2018');
                                //校验匹配
                                if(this.registeredList.defaultString==this.registeredList.enstring){
                                    localStorage.setItem('tokenStorage', JSON.stringify(this.registeredList.token));
                                    localStorage.setItem('idStorage', JSON.stringify(this.registeredList.usid));
                                    setTimeout(()=>{this.$router.push({path: '/gatheringMine'})}, 1000)
                                }else{
                                    setTimeout(()=>{this.$router.push({path: '/loginIndex'})}, 1000);
                                }
                            }else{//未注册
                                Toast({message:'请查收验证码',duration: 1000});
                                    /*倒计时*/
                                    const TIME_COUNT = 60;
                                     if (!this.timer) {
                                       this.count = TIME_COUNT;
                                       this.show = false;
                                       this.timer = setInterval(() => {
                                       if (this.count > 0 && this.count <= TIME_COUNT) {
                                         this.count--;
                                        } else {
                                         this.show = true;
                                         clearInterval(this.timer);
                                         this.timer = null;
                                         this.codeText = '重新获取';
                                        }
                                       }, 1000)
                                      }
                            }
                        }else {
                          Toast({message:data.result.msg,duration: 500});
                        }
                    })
               }else{//下载
                   this.codedownloadList.mobile=this.codeList.mobile;
                   /*发送验证码*/
                    postCode(this.codedownloadList).then(data => {
                        if(data.result.code == 10000) {
                            Toast({message:'请查收验证码',duration: 1000});
                                //倒计时
                            const TIME_COUNT = 60;
                             if (!this.timer) {
                               this.count = TIME_COUNT;
                               this.show = false;
                               this.timer = setInterval(() => {
                               if (this.count > 0 && this.count <= TIME_COUNT) {
                                 this.count--;
                                } else {
                                 this.show = true;
                                 clearInterval(this.timer);
                                 this.timer = null;
                                 this.codeText = '重新获取';
                                }
                               }, 1000)
                              }
                        }else if(data.result.code == 99997) {
                          Toast({message:data.result.msg,duration: 500});
                            if(this.urlList.urlUtm==''){
                                window.location.href = 'http://page.kamicard.com/download/kami_downloadApp.html';
                            }else{
                                window.location.href = 'http://page.kamicard.com/download/kami_downloadApp.html?utm_source='+this.urlList.urlUtm;
                            }

                        }
                    })
               }
            }

        },

        //取现或下载btn
        nextBtn(){
            this.registerList.mobile=this.codeList.mobile;
          this.registerList.channel = this.urlList.urlUtm;
            if(this.registerList.mobile==''||this.registerList.code==''){
                Toast({ message: '手机号或验证码为空', duration: 1500});
           }else{
                //取现
                if(this.urlList.urlUtype==1){
                    this.registerList.data = md5('kami2018'+this.registerList.mobile+'2018kami');
                    postRegister(this.registerList).then(data => {
                        if(data.result.code == 10000) {
                            Toast({message:data.data.msg,duration: 1000});
                            this.registeredList.token = data.data.token;
                            this.registeredList.usid = data.data.usid;
                            this.registeredList.enstring = data.data.enstring;
                            this.registeredList.defaultString = md5('ilovekamicredit2018'+this.registeredList.token+this.registeredList.usid+'ilovekamicredit2018');
                            /*校验匹配*/
                            if(this.registeredList.defaultString==this.registeredList.enstring){
                                /*console.log("存本地连登")*/
                                localStorage.setItem('tokenStorage', JSON.stringify(this.registeredList.token));
                                localStorage.setItem('idStorage', JSON.stringify(this.registeredList.usid));
                                setTimeout(()=>{this.$router.push({path: '/gatheringMine'})}, 1000)
                            }else{
                                setTimeout(()=>{this.$router.push({path: '/loginIndex'})}, 1000);
                            }
                        }else {
                          Toast({message:data.result.msg,duration: 500});
                        }
                    })
                }else if(this.urlList.urlUtype==2){ //下载
                    /*alert("立即下载")*/
                    this.registerdownloadList.mobile=this.registerList.mobile;
                    this.registerdownloadList.code=this.registerList.code;
                    this.registerdownloadList.channel = this.urlList.urlUtm;
                    postRegister(this.registerdownloadList).then(data => {
                        if(data.result.code == 10000) {
                            Toast({message:data.result.msg,duration: 1000});
                            if(this.urlList.urlUtm==''){
                                window.location.href = 'http://page.kamicard.com/download/kami_downloadApp.html';
                            }else{
                                window.location.href = 'http://page.kamicard.com/download/kami_downloadApp.html?utm_source='+this.urlList.urlUtm;
                            }
                        }else {
                          Toast({message:data.result.msg,duration: 500});
                        }
                    })
                }
            }
        },
        remCss(){
            /*document.documentElement.style.fontSize = document.documentElement.clientWidth / 750*100 + 'px';*/
            fnResize();
                window.onresize = function () {
                  fnResize();
                }
                function fnResize() {
                  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
                  if (deviceWidth >= 750) {
                    deviceWidth = 750;
                  }
                  if (deviceWidth <= 320) {
                    deviceWidth = 320;
                  }
                  document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px';
                }

        }
    },
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

        /* align-items: center; */
    }
    .wrap{
        width: 7.5rem;
        height: 13.34rem;
        align-items: center;
        padding-top: 0.6rem;
        box-sizing: border-box;
        /* background: #fbfbfb; */
        background:#ffffff url('../../assets/generalize/bg_pos.jpg') top repeat-x;
        
    }
    .box{
        width:7.5rem;
        height: 12.6rem;
       
        background: #fff;
        position: relative;
    }
    header img{
        width: 7.5rem;
        height: 4.74rem;
        display: block;
        vertical-align: middle;
    }
    .box .random{
        width:7.5rem;
        height: 100%;
        /*background: url(../../assets/generalize/randombg.png) no-repeat;*/
        /* background: url(http://download.pcuion.com/credit_h5/randombg.png) no-repeat; */
        /* background-size: 7.5rem 1.47rem; */
        position: absolute;
        top:4.5rem;
    }
    .box .title{
        margin-top: 0.4rem;
        text-align: center;
    }
    .box .title p {
        /* margin-top: 0.2rem; */
        color: #333;
        font-size: 16px;
        font-weight: 500;
        width: 6rem;
        margin: 0.4rem auto 0.2rem;
    }
    .box  .title .title_tips{
        clear: both;
        overflow: hidden;
        display: block;
        font-size: 14px;
        color: #888;
        width: 4.5rem;
        height: 0.6rem;
        margin: 0 auto;
        /* display: flex; */
        /* margin-top: 0.2rem; */
    }
    .box  .title .title_tips .title_tips_option{
        /* flex: 1; */
        text-align: center;
        float: left;
        margin-left: 0.2rem;
    }
    .box  .title .title_tips .title_tips_option img{
        width: 6px;
        vertical-align: middle;
    }
    .quxian_button{
        margin: 0 auto;
        width: 5.72rem;
        height: 1.26rem;
        position: relative;
        background: url('../../assets/generalize/generalize_button.png') no-repeat;
        background-size: 5.72rem 1.26rem;
        text-align: center;
    }
    .quxian_button a {
        z-index: 20;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
    }
    .quxian_button p{
        height: 1.26rem;
        line-height: 1.26rem;
        font-size: 18px;
        font-weight: 700;
        font-family: 微软雅黑;
        color: #333;
        letter-spacing:3px;
    }
    .options {
        width: 7.5rem;
        height: 1.8rem;
        display: flex;
        margin-top: 1rem;
        position: relative;
        /* bottom: 1.6rem; */
        /* align-items: flex-start; */
        /* justify-content: center; */
    }
    .options a {
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
    }
    .options .options_item{
        text-align: center;
        flex: 1;
        width: 1rem;
        position: relative;
    }
    .options .options_item .tip_img2{
        position: absolute;
        top: 0.03rem;
        right: 0.3rem;
        width: 0.4rem;

    }
    .options .options_item .tip_img1{
        position: absolute;
        top: -0.15rem;
        right: 0.1rem;
        width: 0.8rem;
    }
    .options .options_item .main_img{
        width: 1rem;
        vertical-align: middle;
        display: inline-block;
    }
    .options .options_item span{
        display: inline-block;
        position: absolute;
        bottom: 0rem;
        left: 0.3rem;
        /* margin-top: -20px; */
        font-weight: 500;
        width: 1.4rem;
        font-size: 14px;
        color: #333;
    }
    .box .userNumber span{
        display: inline-block;
        font-size: 0.24rem;
        color: #888;
        height: 0.96rem;
        line-height: 1.2rem;
        float: left;
    }
    .box .userNumber span:nth-child(1){
        margin-left: 1.2rem;
    }
    .box .userNumber span:nth-child(3){
        margin-left: 3.6rem;
    }
    .box .userNumber .randomuserNum{
        width:3.4rem;
        height: .61rem;
        line-height: 0.61rem;
        /* background: url(../../assets/generalize/numberbg.png) no-repeat; */
        background-size: 3.4rem .61rem;
        position: absolute;
        top: 0.25rem;
        left:2.06rem;
        font-size: 0.59rem;
        letter-spacing:0.16rem;
        color: #fff;
        text-align: center;
        padding-left: 0.1rem;
        overflow:hidden;
    }

    .useMoney{
      width: 5.2rem; 
      height: 0.3rem;
      margin: 0.4rem auto 0;
      justify-content: center;
      align-items: center;
      display: block;
      position: relative;
      /* left: 1.15rem; */
      /* bottom: 0.6rem; */
      /* bottom: 0.4rem; */
      overflow: hidden;
    }
    /* .userMoney li{
        width: 100%;
        display: block;
        height: 0.3rem;
    } */
    .useMoney img{
        float: left;
        width: 0.3rem;
        margin-right: 0.1rem;
        vertical-align: middle;
    }
    .useMoney .carousel-messagebox {
      width:260px;
      height: 0.3rem;
    }
    .useMoney .carousel-message {
      width:220px;
      height: 0.3rem;
      line-height:0.3rem;
      font-size: 12px;
      position: absolute;
      color:#fff;
      display: -webkit-box;
      -webkit-box-pack: left;
      -webkit-box-align: center;
    }
    .useMoney .good {
      color:#888;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      display: block;
      font-size: 0.24rem;
      float: left;
    }
    .useMoney .moneyNum {
        color: #ffa459;
        font-size: 0.28rem;
        display: inline-block;
        text-align: center;
        width: 0.85rem;
        height: 0.3rem;
        line-height:0.3rem;
    }
    
    .hintBox{
        width: 6.92rem;
        height: 1.65rem;
        line-height: 0.45rem;
        padding-left: 0.58rem;
        font-size: 0.26rem;
        color: #6d7dfd;
        padding-top: 0.3rem;
    }
    footer{
        width: 7.5rem;
        /*height: 1.95rem;*/
        line-height: 0.36rem;
        font-size: 0.26rem;
        color: #6d7dfd;
        text-align: center;
        margin-top: 0.42rem;
    }
    .agreement{
        position: fixed;
        width: 7.5rem;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        z-index: 10px;
        top:0;
    }
    .agreement .connet{
        position: absolute;
        width: 68%;
        height: 400px;
        top: 50%;
        margin-top: -180px;
        margin-left: 15%;
        background-color: #fff;
        border-radius: 5px;
        overflow: auto;
        padding: 2%;
        font-size: 0.3rem;
    }
    .noScroll {
      overflow-y: hidden;
    }
    .marquee_top {
        transition: all 2s;
        margin-top: -30px;
    }
/*.marquee_list {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    }



.marquee_list li {
height: 30px;
line-height: 30px;
font-size: 14px;
padding-left: 20px;

}

.marquee_list li span {
padding: 0 2px;
}*/

</style>
