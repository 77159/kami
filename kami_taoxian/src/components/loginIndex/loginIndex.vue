<template>
  <div class="container">
    <div class="loginBg" ref="wrapper" :style="{height: wrapperHeight + 'px'}">
      <!--<img src="../../assets/loginIndex/logo.gif" class="logoGif">-->
      <!--<img src="http://download.kamicredit.com/credit_h5/logo.9537a4a.png" class="logoGif">-->
      <div class="tabLogin">
        <ul>
          <li :class="isLogin==true?'isChoose':'noChoose'" @click="isLogin=true;" style="width: 45%">密码登录</li>
          <li :class="isLogin==true?'noChoose':'isChoose'" @click="isLogin=false;" style="width: 55%">验证码登录</li>
        </ul>
      </div>
      <!--密码登录-->
      <div class="loginBox" v-if="isLogin">
        <div class="telBox">
          <input placeholder="请输入手机号" v-model="userlist.mobile" type="tel" maxlength="11">
          <img @click="clearTel()" src="../../assets/loginIndex/close.png" class="clearTel" v-if="userlist.mobile!=''">
        </div>
        <div class="passBox">
          <input placeholder="请输入密码" :type="this.registration_data.pwdType" v-model="userlist.password">
          <!--<input placeholder="密码" type="text" v-model="userpassword" v-else>-->
          <img @click="passwordChange()" :src="this.registration_data.src" class="passwordEye">
          <router-link :to="{path: '/findloginPassword',query: {tokenStorage:this.userlist.accessToken}}">
            忘记密码
          </router-link>
        </div>
        <button @click="passwordLogin">登录</button>
        <div class="footerTab">
            <!--<a @click="isLogin=false">验证码登录</a>-->
            <router-link :to="{path: '/register', query: {tokenStorage:this.userlist.accessToken}}" style="float: right; margin-top:5px;">
                立即注册
            </router-link>
        </div>
      </div>
      <!--验证码登录-->
      <div class="noteLoginBox" v-if="!isLogin">
        <div class="telBox">
          <input placeholder="请输入手机号" v-model="userlist.mobile" type="tel" maxlength="11">
          <img @click="clearTel()" src="../../assets/loginIndex/close.png" class="clearTel" v-if="userlist.mobile!=''">
        </div>
        <div class="passBox">
          <input placeholder="请输入验证码" v-model="userlist.loginSmsCode" type="tel" maxlength="4">
          <!--<input placeholder="密码" type="text" v-model="userpassword" v-else>-->
          <!--<img @click="passwordChange()" :src="this.registration_data.src" class="passwordEye">-->
          <a @click="sendCode(userlist.mobile)" v-show="show">获取验证码</a>
          <a v-show="!show" class="count" style="float: right;">{{count}}s</a>
        </div>
        <button @click="codeLogin">登录</button>
        <div class="footerTab">
          <!--<a @click="isLogin=false">验证码登录</a>-->
          <router-link :to="{path: '/register', query: {tokenStorage:this.userlist.accessToken}}" style="float: right; margin-top:5px;">
            立即注册
          </router-link>
        </div>

      </div>
      <!--<div class="footerTab">-->
        <!--&lt;!&ndash;<a s>密码登录</a>&ndash;&gt;-->
        <!--<router-link :to="{path: '/register', query: {tokenStorage:this.userlist.accessToken, utm_source: urlList.urlUtm}}">-->
          <!--立即注册-->
        <!--</router-link>-->
      <!--</div>-->
      <!--<img src="../../assets/loginIndex/background.gif" :style="{height: wrapperHeight + 'px'}">-->
      <!--<img src="http://download.kamicredit.com/credit_h5/background.01b20ff.gif" :style="{height: wrapperHeight + 'px'}">-->
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  import { Toast } from 'mint-ui';
  import {postUserLogin,getToken,postRegisterCode,} from '../../requestAPI/requestAPI';


  export default {
    data () {
      return {
        wrapperHeight:0,
        passwordifDisplay:true,
        userlist:{
          mobile:'',
          password:'',
          accessToken:'',
          mid:11,
          type:1,                //登录发送验证码
          loginSmsType:'',	   //1:验证码登录 0:密码登录
          loginSmsCode:'',       //验证码在loginSmsType为1的时候此参数比传
        },
        accessList:{
          account:'merchantapi',
          key:'rqw9qw0e980c4ybg2D0c24G3'
        },
        registration_data:{
          pwdType:"password",
          src:require("../../assets/loginIndex/yincang@3x_02.png")
        },
        getTokenStorage:'',
        uslist:{
          id:'',
          t1:'',
          t2:'',
        },
        isLogin:false,
        count:'',
        show:true,
        urlList:{    //url拼接参数
          urlAll:'',             //所有参数
          urlUtm:'',             //通道
        },
      }
    },
    mounted() {
      //动态计算页面高度
      this.wrapperHeight = document.documentElement.clientHeight + 100;
    },
    created(){

      //取得URL中参数的值
      this.urlList.urlAll = window.location.href.split('?')[1];
      if(this.urlList.urlAll != undefined) {
        if(this.urlList.urlAll.indexOf('utm_source=')>-1){
          this.urlList.urlUtm = this.urlList.urlAll.split('utm_source=')[1].split('&')[0];
        }
      }

//        localStorage.clear();
      /*每23小时59分钟清一次localStorage*/
      /*setInterval(function(){
          localStorage.clear();
      }, 86340000);
      */

      this.userlist.accessToken = JSON.parse(localStorage.getItem('tokenStorage'));

      this.uslist.t1 = JSON.parse(localStorage.getItem('timeStorage'));
      this.uslist.t2 = Math.floor((new Date()).valueOf()/1000);  //获取当前时间戳
      if(this.uslist.t2-this.uslist.t1>=86340){
        this.storageClear()
        /*console.log('清除storage后内部token:',this.userlist.accessToken);*/
        /*Toast({ message: "登录超时，请重新登录", duration: 1500});*/
        /*localStorage中内容被清空 重新请求token*/
        getToken(this.accessList).then(data => {
          if(data.result.code == 10000) {
            this.userlist.accessToken = data.data.accessToken;
            /*console.log('重新获取token成功后台拿到的token:',this.userlist.accessToken);*/
            /*Toast({ message: this.userlist.accessToken, duration: 1500});*/
            localStorage.setItem('tokenStorage', JSON.stringify(this.userlist.accessToken));
            this.userlist.accessToken= JSON.parse(localStorage.getItem('tokenStorage'));
            //获取当前时间戳存localStorage
            localStorage.setItem('timeStorage', JSON.stringify(Math.floor((new Date()).valueOf()/1000)));
            /*每次请求到token23h59min后清本地token*/
            /*setInterval(() => {
              this.storageClear()
            },86340000);*/

            /* Toast({ message: data.result.msg, duration: 1500});*/
          }else{
            Toast({ message: data.result.msg, duration: 1500});
          }
        })
        /*console.log('重新获取token成功后storage内部token:',this.userlist.accessToken);*/
        /*this.$router.go(0)*/
      }/*else{
             Toast({ message: "不超过24小时", duration: 1500});
        }*/

      if(this.userlist.accessToken == null){
        getToken(this.accessList).then(data => {
          if(data.result.code == 10000) {
            this.userlist.accessToken = data.data.accessToken;
            /*Toast({ message: this.userlist.accessToken, duration: 1500});*/
            localStorage.setItem('tokenStorage', JSON.stringify(this.userlist.accessToken));
            this.userlist.accessToken= JSON.parse(localStorage.getItem('tokenStorage'));
            //获取当前时间戳存localStorage
            localStorage.setItem('timeStorage', JSON.stringify(Math.floor((new Date()).valueOf()/1000)));
            /*每次请求到token23h59min后清本地token*/
            setInterval(() => {
              this.storageClear()
            },86340000);

            /* Toast({ message: data.result.msg, duration: 1500});*/
          }else{
            Toast({ message: data.result.msg, duration: 1500});
          }
        })
      }
//        console.log(this.uslist.t1);
//        console.log(this.uslist.t2);
//        console.log(this.userlist.accessToken);
    },
    methods:{
      clearTel(){
        this.userlist.mobile='';
      },
      passwordLogin(){
        var reg=/^((1[3,5,8][0-9])|(14[5,7])|(166)|(17[0,6,7,8])|(19[7]))\d{8}$/;
        if(this.userlist.mobile==''||this.userlist.password==''){
          Toast({ message: '手机号或密码错误', duration: 1500});
        }else if(!reg.test(this.userlist.mobile)){
          Toast({message:'请输入正确的手机号',duration: 500});s
        }else{
          /*this.userlist.mobile = mobile;
          this.userlist.password = password;*/
          this.userlist.loginSmsType = 0;
          /*如果超时清除本地token-->点击登录重新获取token*/
//                if(this.userlist.accessToken == null){
//                       getToken(this.accessList).then(data => {
//                        if(data.result.code == 10000) {
//                            this.userlist.accessToken = data.data.accessToken;
//                            /*Toast({ message: this.userlist.accessToken, duration: 1500});*/
//                            localStorage.setItem('tokenStorage', JSON.stringify(this.userlist.accessToken));
//                            this.userlist.accessToken= JSON.parse(localStorage.getItem('tokenStorage'));
//                            //获取当前时间戳存localStorage
//                            localStorage.setItem('timeStorage', JSON.stringify(Math.floor((new Date()).valueOf()/1000)));
//                            /*每次请求到token23h59min后清本地token*/
//                            setInterval(() => {
//                              this.storageClear()
//                            },86340000);
//
//                           /* Toast({ message: data.result.msg, duration: 1500});*/
//                        }else{
//                             Toast({ message: data.result.msg, duration: 1500});
//                        }
//                    })
//                }
          //密码登录
          postUserLogin(this.userlist).then(data => {
            console.log(data)
            if(data.result.code == 10000) {
              this.uslist.id=data.data.profile.id;

              //存储id到localStorage
              localStorage.setItem('idStorage', JSON.stringify(this.uslist.id));
              this.uslist.id= JSON.parse(localStorage.getItem('idStorage'));

              this.$router.push({
                path: '/gatheringMine' ,
                /*query: {
                    usid:this.uslist.id,
                    accessToken:this.userlist.accessToken,
                }*/
              })
//                                Toast({ message: data.result.msg, duration: 1500});
            }/*else if(data.result.code == 10010){
                        this.storageClear();
                        Toast({ message: "请稍后再试", duration: 1500});
                    }*/else{
              Toast({ message: data.result.msg, duration: 1500});
            }
          });
        }
      },
      passwordChange(){
        this.registration_data.pwdType = this.registration_data.pwdType==='password'?'text':'password';
        this.registration_data.src=this.registration_data.src==require("../../assets/loginIndex/buyincang@3x_02.png")?require("../../assets/loginIndex/yincang@3x_02.png"):require("../../assets/loginIndex/buyincang@3x_02.png");
      },
      storageClear(){
        localStorage.clear();
      },
      /*验证码登录--发送验证码*/
      sendCode(mobile){
        var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
        if(!reg.test(mobile)){
          Toast({message:'请输入正确的手机号',duration: 500});
        }else{
          this.userlist.type=6
          postRegisterCode(this.userlist).then(data => {
            console.log('发送验证码',data)
            console.log(this.userlist)
            if(data.result.code == 10000) {
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
                  }
                }, 1000)
              }
              Toast({ message:"请查收验证码", duration: 1500});
            }else{
              Toast({ message: data.result.msg, duration: 1500});
            }
          });
        }
      },
      /*验证码登录*/
      codeLogin(){
        var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
        if(this.userlist.mobile==''||this.userlist.loginSmsCode==''){
          Toast({ message: '手机号或验证码错误', duration: 1500});
        }else if(!reg.test(this.userlist.mobile)){
          Toast({message:'请输入正确的手机号',duration: 500});
        }else{
          this.userlist.loginSmsType = 1;
          /*console.log(this.userlist);*/
          //post登录信息
          postUserLogin(this.userlist).then(data => {
            console.log('验证码登录',data)
            if(data.result.code == 10000) {
              this.uslist.id=data.data.profile.id;
              //存储id到localStorage
              localStorage.setItem('idStorage', JSON.stringify(this.uslist.id));
              this.uslist.id= JSON.parse(localStorage.getItem('idStorage'));

              this.$router.push({
                path: '/gatheringMine' ,
                /*query: {
                    usid:this.uslist.id,
                    accessToken:this.userlist.accessToken,
                }*/
              })
            }/*else if(data.result.code == 10010){
                        this.storageClear();
                        Toast({ message: "token失效请重新登录", duration: 1500});
                    }*/else{
              Toast({ message: data.result.msg, duration: 1500});
            }
          });
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container{
    background-color: #FFF;
  }
  *{
    margin: 0;
    padding: 0;
    outline:medium;
    text-decoration:none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    /*font-family: "微软雅黑";*/
  }
  .loginBg{
    width: 100%;
    /*height: 100%;*/
    position: relative;
    background-color: #FFF;
    background-image: url("../../assets/loginIndex/loginBg.jpg");
    background-repeat: no-repeat;
    background-size: 100%;
  }

  .loginBg .logoGif{
    width: 22%;
    position: absolute;
    margin-left:39%;
    margin-top: 12%;
  }
  .loginBg .tabLogin{
    width: 100%;
    height: 45px;
    position: absolute;
    margin-top: 78%;
    z-index: 99;
  }
  .loginBg .tabLogin ul{
    width: 49%;
    margin-left: 25.5%;
    float: left;
  }
  .loginBg .tabLogin ul li{
    list-style: none;
    float: left;
    /*width: 50%;*/
    line-height: 36px;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
  }
  .loginBg .tabLogin ul .noChoose{
    border-bottom: 1px solid #e8e8e8;
    color: #888888;
  }
  .loginBg .tabLogin ul .isChoose{
    border-bottom: 1px solid #87b4ea;
    color: #649ede;
  }

  .loginBox{
    width: 295px;
    height: 295px;
    position: absolute;
    left: 50%;
    margin-top: 80%;
    margin-left: -145.5px;
    font-family:Helvetica;
  }
  .loginBox .telBox,.loginBox .passBox{
    width: 100%;
    height: 51px;
    line-height: 51px;
    background-color: #fff;
    border-radius: 25.5px;
    border: 1px solid #eee;
  }
  .loginBox .telBox{
    margin:46px 0 15px;
  }
  .loginBox .telBox input,.loginBox .passBox input{
    border: none;
    width: 54%;
    margin-left: 25px;
    /*caret-color:#7370FF;*/
    height: 51px;
    float: left;
    border: 0;
    font-size:14px;
    outline:medium;
    background-color:transparent;
    color: #a8a8a8;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    caret-color:#fff;
  }
  .loginBox .telBox input{
    width: 80%;
  }
  .loginBox .passBox a{
    float: right;
    margin-top: 12.5px;
    margin-left: 10px;
    margin-right: 10px;
    border-left: 1px solid #eee;
    height: 25px;
    line-height: 25px;
    color: #a8a8a8;
    display: inline-block;
    font-size: 13px;
    padding: 0 10px;
  }
  .loginBox input::-webkit-input-placeholder{
    color:#a8a8a8;
  }
  .loginBox .clearTel{
    width: 15px;
  }
  .loginBox .passwordEye{
    width: 16px;
    opacity:0.4;
  }
  .loginBox button{
    width: 100%;
    height: 51px;
    left: 51px;
    background: linear-gradient(to bottom, #f3deab , #e6c489);
    color: #66542f;
    font-weight: 600;
    /* color: #FF5101; */
    font-size:17px;
    border: none;
    text-align: center;
    border-radius: 25px;
    box-shadow:8px 2px 12px rgba(79,61,157,0.24);
    margin-top: 30px;
  }

  .noteLoginBox{
    width: 295px;
    height: 295px;
    position: absolute;
    left: 50%;
    margin-top: 80%;
    margin-left: -145.5px;
  }
  .noteLoginBox .telBox,.noteLoginBox .passBox{
    width: 100%;
    height: 51px;
    line-height: 51px;
    /* color: #a8a8a8; */
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 25.5px;
  }
  .noteLoginBox .telBox{
    margin:46px 0 15px;
  }
  .noteLoginBox .telBox input,.noteLoginBox .passBox input{
    border: none;
    width: 55%;
    margin-left: 25px;
    /*caret-color:#7370FF;*/
    height: 51px;
    float: left;
    border: 0;
    font-size:14px;
    outline:medium;
    background-color: transparent;
    color: #a8a8a8;
    caret-color:#fff;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  .noteLoginBox .telBox input{
    width: 80%;
  }
  .noteLoginBox .passBox a{
    float: right;
    margin-top: 12.5px;
    margin-left: 10px;
    margin-right: 10px;
    border-left: 1px solid #eee;
    height: 25px;
    line-height: 25px;
    color: #a8a8a8;
    display: inline-block;
    font-size: 13px;
    padding: 0 10px;
  }
  .noteLoginBox input::-webkit-input-placeholder{
    color:#a8a8a8;
  }
  .noteLoginBox .clearTel{
    width: 15px;
  }
  .noteLoginBox .passwordEye{
    width: 16px;
  }
  .noteLoginBox button{
    width: 100%;
    height: 51px;
    left: 51px;
    background: linear-gradient(to bottom, #f3deab , #e6c489);
    color: #66542f;
    font-weight: 600;
    font-size:17px;
    border: none;
    text-align: center;
    border-radius: 25px;
    box-shadow:8px 2px 12px rgba(79,61,157,0.24);
    margin-top: 30px;
  }

  .footerTab {
    width: 100%;
    /*position: absolute;*/
    /*bottom: 8%;*/
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  .footerTab a{
    display: inline-block;
    /*width: 30%;*/
    height: 50px;
    /*margin-left: 40%;*/
    font-size: 14px;
    color: #a8a8a8;
    /*background: url(../../assets/loginIndex/zhuce.png) no-repeat;*/
    /*background-position: right;*/
    /*background-size: 10px;*/
    /*padding: 0 10px;*/
  }
</style>
