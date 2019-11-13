<!--个人资料-->
<template>
  <div >
      <div class="box" :class="{noScroll: isAgreement}" id="generalize">
          <header>
              <!--<img src="../../assets/generalize/title.png">-->
              <img src="http://download.pcuion.com/credit_h5/title.png">
          </header>
          <div class="random">
              <div class="userNumber">
                  <span>已经有</span>
                  <div class="randomuserNum">{{randomuserNum}}</div>
                  <span>用户在使用</span>
              </div>
              <!--<div class="useMoney">
                 <div class="carousel-messagebox">
                      <transition-group tag="ul" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutUp">
                        <li v-show="idx == isCurrent" v-for="(item, idx) in messageList" :key="idx" :class="['carousel-message']">
                          <span class="good">用户{{item.user}}xxxx</span>
                          <span class="good">{{randomMobNum}} 通过信用卡取现</span>
                          <span class="good moneyNum">{{randomMoneyNum}}</span>
                          <span class="good">元</span>
                        </li>
                      </transition-group>
                    </div>
              </div>-->
              <div class="useMoney">
                <ul class="marquee_list" :class="{marquee_top:animate}">
                    <!--<li v-for="(item,index) in marqueeList">
                        {{item.name}}
                    </li>-->
                    <li v-for="(item, idx) in messageList" :key="idx">
                      <span class="good">用户{{item.user}}xxxx</span>
                      <span class="good">{{randomMobNum}} 通过信用卡取现</span>
                      <span class="good moneyNum">{{randomMoneyNum}}</span>
                      <span class="good">元</span>
                    </li>
                </ul>
                </div>
              </div>
          <div class="inputMessage">
              <input placeholder="请输入手机号" class="mobileConnet" id="code" v-model="codeList.mobile" type="tel" maxlength="11">
              <input placeholder="请输入短信验证码" type="tel" id="sendCode" v-model="registerList.code">
              <button class="sendCode" v-show="show" @click="sendCode">{{codeText}}</button>
              <button class="count" v-show="!show">{{count}}s</button>
              <button class="nextBtn" @click="nextBtn">{{btnText}}</button>
              <p class="hint">点击“{{btnText}}”按钮即同意<a @click="isAgreement=true">&lt;卡秘信用卡用户注册协议&gt;</a></p>
          </div>
          <div class="advantage">
              <ul>
                  <li class="simple">
                      <img src="../../assets/generalize/simple.png">
                      <p>无需POS机<br>绑卡即可</p>
                  </li>
                  <li class="fast">
                      <img src="../../assets/generalize/fast.png">
                      <p>秒到帐<br>更安全</p>
                  </li>
                  <li class="charge">
                      <img src="../../assets/generalize/charge.png">
                      <p>多条通道<br>最低0.30%</p>
                  </li>
                  <li class="register">
                      <img src="../../assets/generalize/register.png">
                      <p>分享升级<br>躺着赚钱</p>
                  </li>
              </ul>
          </div>
          <div class="hintBox">
              温馨提示：<br>1、取现金额不能超过信用卡余额。<br>2、具体费率以实际收款通道为准
          </div>
          <footer>山西野二金融服务外包有限公司<br>京ICP备14045959号-3</footer>
      </div>
      <div class="agreement" v-if="isAgreement" @click="isAgreement=false">
          <div class="connet" @click.stop="isAgreement=true">卡秘信用卡 - 用户注册协议

定义及解释
　　手机移动软件（以下简称本软件）：本软件是由卡秘信用卡（以下简称运营方）在改善商户体验、洞察移动支付行业消费需求的基础上为用户提供个人生活消费服务、信用管理、财富管理等服务的手机移动软件。

　　用户：在手机移动软件注册并经相关认证的自然人或单位。（简称“您”）
　　本协议是用户与本运营方之间关于用户下载、安装、使用本软件签署的法律协议。您一旦安装、复制、下载、访问或以其它方式使用本软件，代表您对本软件已有了充分的认知与了解，并熟悉本软件的相关规则及管理办法,并自行决定是否使用该软件，一旦使用将视为受本协议各项条款的约束。请务必认真阅读和理解本协议中规定的所有权利和限制。

　　本运营方有权根据法律、法规、政策及市场经济、环境等任何运营方所需适时修订本协议及各类规则等，并在本软件上公示，且无需征得您的事先同意。修订后的协议和规则一经公示即生效，成为本协议的一部分。如您继续登录或使用软件，即视为已阅读并接受修订后的协议。如您不能接受本协议约定，包括但不限于不能接受修订后的协议及各类规则等，则您应立即停止使用软件对您提供的服务，且本运营方无需承担由此等停用行为所遭受的任何损失。

1.  权利声明
1.1本软件的一切知识产权，以及与软件相关的所有信息内容，包括但不限于：文字描述及其组合、图像、图表、色彩、图标、图饰、界面设计、有关数据、附加程序、电子文档等均为本运营方所有，受著作权法和国际著作权条约以及其他知识产权法律法规的保护。

2.  权利限制
2.1个别授权：如需进行商业性的销售、复制、分发，包括但不限于软件销售、预装、捆绑等，必须获得本运营方的书面授权和许可。

2.2保留权利：本协议未明示授权的其他权利仍归本运营方所有，用户使用其他权利时必须获得本运营方的书面同意。

3.  许可范围
3.1本软件为用户提供使用服务，其所有权和运营权均归属本运营方所有。用户必须完全同意本协议内容，完成相应的注册程序，并经本运营方审核后，才能成为本软件的合格用户，从而获得本软件提供的服务。

3.2下载、安装和使用：用户可以非商业性、无限制数量地下载、安装及使用本软件。

4.  用户使用须知
4.1您必须是年满18周岁并具有完全民事权利能力和民事行为能力的自然人或依法设立并有效存续的企业法人或其他经济组织，否则，一经发现您非以上用户，本运营方有权立即终止向您提供任何服务、注销您的账户，并有权追究您使用本软件服务的一切法律责任，由此等停用行为所造成的任何损失由您自行承担。

4.2您须自行配备手机上网的所需设备，包括但不限于iPhone、安卓手机或其他必备上网装置。一旦在本软件注册成功，即成为本软件的合格用户。您应妥善保管在本软件的账号和密码。凡使用您的账号和密码登陆软件进行的一切操作，均视为您本人的行为，因账号和密码管理、使用不善等造成的损失由您本人承担，本软件对此不承担任何责任。</div>
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
            randomuserNum:2626000,   //已有用户人数
            randomMoneyNum:12000,   //取现金额
            randomMobNum:1000,   //手机号后四位
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
        setInterval(this.showMarquee, 2000)

      //取得URL中参数的值
      // this.urlList.urlAll = window.location.href.split('?')[1];
      // if(this.urlList.urlAll != undefined) {
      //   if(this.urlList.urlAll.indexOf('utm_source=')>-1){
      //     this.urlList.urlUtm = this.urlList.urlAll.split('utm_source=')[1].split('&')[0];
      //   }
      // }


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
            },500)},

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
            var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
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
    }
    .box{
        width:7.5rem;
        height: 18.83rem;
        /*background: url(../../assets/generalize/bg.jpg) no-repeat;*/
        background: url(http://download.pcuion.com/credit_h5/bg.jpg) no-repeat;
        background-size: 7.5rem 18.83rem;
        position: relative;
    }
    header img{
        width: 7.5rem;
        height: 5.12rem;
    }
    .box .random{
        width:7.5rem;
        height: 1.47rem;
        /*background: url(../../assets/generalize/randombg.png) no-repeat;*/
        background: url(http://download.pcuion.com/credit_h5/randombg.png) no-repeat;
        background-size: 7.5rem 1.47rem;
        position: absolute;
        top:4.5rem;
    }
    .box .random .userNumber span{
        display: inline-block;
        font-size: 0.24rem;
        color: #8a97ff;
        height: 0.96rem;
        line-height: 1.2rem;
        float: left;
    }
    .box .random .userNumber span:nth-child(1){
        margin-left: 1.2rem;
    }
    .box .random .userNumber span:nth-child(3){
        margin-left: 3.6rem;
    }
    .box .random .userNumber .randomuserNum{
        width:3.4rem;
        height: .61rem;
        line-height: 0.61rem;
        background: url(../../assets/generalize/numberbg.png) no-repeat;
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
      width: 5.25rem;
      height: 0.3rem;
      margin: 1rem auto 0;
      justify-content: center;
      align-items: center;
      display: block;
      position: relative;
      overflow: hidden;
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
      color:#8a97ff;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      display: block;
      font-size: 0.24rem;
      float: left;
    }
    .useMoney .moneyNum {
        color: #ffa459;
        font-size: 0.3rem;
        height: 0.3rem;
        line-height:0.3rem;
    }
    .inputMessage{
        width:7.5rem;
        height: 5.96rem;
        /*background: url(../../assets/generalize/inputbg.png) no-repeat;*/
        background: url(http://download.kamicredit.com/credit_h5/inputbg.png) no-repeat;
        background-size: 7.5rem 5.96rem;
        margin-top: 0.5rem;
        position: relative;
    }
    .inputMessage input{
        width:5.8rem;
        height: 1rem;
        margin-left: 0.54rem;
        border-radius: 0.5rem;
        padding-left: 0.6rem;
        border: 0;
        font-size: 0.3rem;
        color: #5f5f5f;
    }
    .inputMessage input:nth-child(1){
        margin-top: 0.8rem;
    }
    .inputMessage input:nth-child(2){
        margin-top: 0.3rem;
    }
    .inputMessage .sendCode{
        width: 2.07rem;
        height: 1rem;
        border: 0;
        background: url(../../assets/generalize/codebg.png) no-repeat;
        background-size: 2.07rem 1rem;
        font-size: 0.3rem;
        color: #fff;
        position: absolute;
        top: 2.155rem;
        right: 0.565rem;
    }
    .inputMessage .count{
        width: 2.07rem;
        height: 1rem;
        border: 0;
        background: url(../../assets/generalize/codebg.png) no-repeat;
        background-size: 2.07rem 1rem;
        font-size: 0.3rem;
        color: #fff;
        position: absolute;
        top: 2.11rem;
        right: 0.57rem;
    }
    .inputMessage .nextBtn{
        width:6.4rem;
        height: 1rem;
        margin-left: 0.54rem;
        border-radius: 0.5rem;
        border: 0;
        font-size: 0.4rem;
        color: #fff;
        background: linear-gradient(to right, #ff7a4f 0%,#ffa459 100%);
        font-weight: bold;
        letter-spacing:0.05rem;
        margin-top: 0.4rem;
    }
    .inputMessage .hint{
        width:7.5rem;
        height: 1.1rem;
        line-height: 1.1rem;
        text-align: center;
        border-radius: 0.5rem;
        border: 0;
        font-size: 0.24rem;
        color: #8a97ff;
    }
    .advantage{
        width:7.5rem;
        height: 3.64rem;
        background: url(../../assets/generalize/youshi@2x.png) no-repeat;
        background-size: 7.5rem 3.64rem;
    }
    .advantage ul{
        width: 6.65rem;
        height: 2.65rem;
        float: left;
        margin: 0.9rem 0.3rem 0;
    }
    .advantage ul li{
        width: 25%;
        float: left;
        text-align: center;
    }
    .advantage ul .simple img{
        width: 1.15rem;
        float: left;
        margin-left: 0.27rem;
    }
    .advantage ul .simple p{
        width: 100%;
        float: left;
        font-size: 0.24rem;
        color: #939393;
        text-align: center;
        margin-top: 0.32rem;
    }
    .advantage ul .fast img{
        width: 1.15rem;
        float: left;
        margin-left: 0.3rem;
    }
    .advantage ul .fast p{
        width: 100%;
        float: left;
        font-size: 0.24rem;
        color: #939393;
        text-align: center;
        margin-top: 0.32rem;
    }
    .advantage ul .charge img{
        width: 1.34rem;
        height: 1.38rem;
        float: left;
        margin-left: 0.2rem;
    }
    .advantage ul .charge p{
        width: 100%;
        float: left;
        font-size: 0.24rem;
        color: #939393;
        text-align: center;
        margin-top: 0.33rem;
    }
    .advantage ul .register img{
        width: 1.64rem;
        height: 1.37rem;
        float: left;
        margin-left: 0.04rem;
    }
    .advantage ul .register p{
        width: 100%;
        float: left;
        font-size: 0.24rem;
        color: #939393;
        text-align: center;
        margin-top: 0.34rem;
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
