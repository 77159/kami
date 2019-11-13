<template>
  <div>
    <nav class="navTitle"><img @click="backHistory()" src="../../assets/fanhui@2x.png">{{title}}</nav>
<!--
<keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
-->
      <!--发送验证码-->
    <div class="registerBg" ref="wrapper" :style="{height: wrapperHeight + 'px'}" v-if="registerMobile">
        <div class="registerBox">
        <div class="telBox"><input placeholder="请输入手机号" v-model="redisterList.mobile" type="tel" maxlength="11"></div>
        <div class="passBox"><input placeholder="请输入4位验证码" v-model="redisterList.code" type="tel" maxlength="4">
            <span @click="sendCode(redisterList.mobile)" v-show="show">发送验证码</span>
            <span v-show="!show" class="count" style="float: right;">{{count}}s</span>
        </div>
        <button @click="next(redisterList)">下一步</button>
        <span class="agreement">
            <!--<input type="checkbox" v-model="redisterList.check">-->
            <img @click="inputChange()" :src="this.inputSrc">
            <!--<label  for="color-input-red"></label >-->
            <p>我已阅读并同意</p>
            <router-link :to="{path: '/userAgreement'}">用户注册登陆协议、</router-link>
            <router-link :to="{path: '/userPrivacy'}">用户隐私协议</router-link>
        </span>

        </div>
        <!--<img src="../../assets/loginIndex/zhuce-gif.png" :style="{height: wrapperHeight + 'px'}">-->
    </div>
    <!--输入密码-->
    <div class="setPassword" v-if="!registerMobile">
        <div class="hint">*&nbsp;请输入6-20位密码，必须包含数字与字母</div>
        <div class="telBox">输入密码<input placeholder="请输入登录密码" :type="this.redisterPList.pwdType" v-model="redisterList.password">
            <img @click="passwordChange()" :src="this.redisterPList.src" class="passwordEye">
        </div>
        <div class="passBox">再次确认<input placeholder="请输入登录密码" :type="this.redisterPList.pwdType2"  v-model="redisterList.passwordConfirm">
            <img @click="passwordChange2()" :src="this.redisterPList.src2" class="passwordEye">
        </div>
        <button @click="finish(redisterList)">完成</button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import {postRegisterCode,getToken,postRegister,postUserLogin,checkRegisterCode} from '../../requestAPI/requestAPI';

export default {
    data () {
        return {
            redisterList:{
                mobile:'',
                mid:11,
                accessToken:'',
                usid:'',
                password:'',
                passwordConfirm:'',
                check:true,
                code:'',
                regtype:'h5',
                os_type:'h5',
                "t": "",
	            "version_code": "42",
                channel: '',
                type:0,                //注册发送验证码
            },
            accessList:{
                account:'merchantapi',
                key:'rqw9qw0e980c4ybg2D0c24G3'
            },
            wrapperHeight:0,
            title:"注册",
            redisterPList:{
                src:require("../../assets/loginIndex/yincang@3x_02zi.png"),
                pwdType:"password",
                src2:require("../../assets/loginIndex/yincang@3x_02zi.png"),
                pwdType2:"password",
            },
            show: true,
            count: '',
            timer: null,
            registerMobile:true,
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
            },
            inputSrc:require("../../assets/loginIndex/gouxuan@3x.png"),

          postLogin: {
            mobile: '',
            password: '',
            loginSmsType: 0,
            registerLoginType: 3,
            accessToken: '',
            mid: 11
          }

        }
    },
    mounted() {
         //动态计算页面高度
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    created(){
        this.transmitToken();
        this.redisterList.channel = this.$route.query.utm_source;
//        Toast({message:this.redisterList.accessToken,duration: 500});
        /*console.log(this.redisterList.channel)*/
        /*获取token*/
        /*getToken(this.accessList).then(data => {
        if(data.result.code == 10000) {
              this.redisterList.accessToken = data.data.accessToken;

        }else {
                Toast({message:'正在加载中。。。',duration: 500});
                }
            })
        console.log(this.redisterList);*/
    },
    methods:{

        //获取登录页传过来的token
        transmitToken() {
            this.redisterList.accessToken = JSON.parse(localStorage.getItem('tokenStorage'));
           /* console.log(this.redisterList.accessToken);*/
          },
        //发送验证码
        sendCode(mobile){
            var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
            if(!reg.test(mobile)){
                Toast({message:'请输入正确的手机号',duration: 500});
            }else{
                /*console.log(this.redisterList);*/
                /*获取token*/
                /*getToken(this.accessList).then(data => {
                    if(data.result.code == 10000) {
                        this.redisterList.accessToken = data.data.accessToken;

                    }else {
                      Toast({message:'正在加载中。。。',duration: 500});
                    }
                })*/

                /*发送验证码*/
                postRegisterCode(this.redisterList).then(data => {
                    if(data.result.code == 10000) {
                        this.redisterList.mobile = mobile;
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
                       Toast({message:'请查收验证码',duration: 500});
                    }else {
                      Toast({message:data.result.msg,duration: 500});
                    }
                })
            };
        },

        backHistory(){
            this.$router.go(-1)
        },
        /*下一步 输入密码*/
        next(redisterList){

           /* console.log('this.redisterList.check', this.redisterList.check);*/
           var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
           if(this.redisterList.mobile==''||this.redisterList.code==''){
                Toast({ message: '手机号或验证码错误', duration: 1500});
           }else if(!reg.test(this.redisterList.mobile)){
                Toast({message:'请输入正确的手机号',duration: 500});s
           }else if(!this.redisterList.check){
                Toast({ message: '同意协议后请勾选', duration: 1500});
           }else{
               let params = {
                    mob:'',
                    type: 0,
                    code: '',
                    accessToken: '',
                    mid: '',
                }
                params.mob = this.redisterList.mobile
                params.code = this.redisterList.code
                params.accessToken = this.redisterList.accessToken
                params.mid = this.redisterList.mid

                checkRegisterCode(params).then(data => {
                    if(data.result.code == 10000){
                        this.registerMobile = !this.registerMobile;
                    } else {
                        Toast({ message: '验证码错误', duration: 500});
                    }
                })
           }

        },
        /*注册完成*/
        finish(redisterList){

            this.redisterList.t = (new Date()).valueOf();  //获取当前时间戳
            /*校验密码*/
            if (redisterList.password === ''||redisterList.passwordConfirm === '') {
              Toast({message:'请输入密码',duration: 500});
            }else if(redisterList.password != redisterList.passwordConfirm ){
                Toast({message:'两次密码不一致',duration: 500});
            }else{
                var reg=/^[0-9a-zA-Z]{6,20}$/i;
                if(!reg.test(redisterList.password)){
                    Toast({message:'密码格式有误',duration: 500});
                }else{
                    /*注册*/
                    postRegister(this.redisterList).then(data => {
                            if(data.result.code == 10000) {
                                Toast({message:'注册成功',duration: 500});

                              this.postLogin.mobile = this.redisterList.mobile;
                              this.postLogin.password = this.redisterList.password;
                              this.postLogin.accessToken = this.redisterList.accessToken;

                                //注册成功--获取登录信息
                               postUserLogin(this.postLogin).then(data => {
                                    if(data.result.code == 10000) {
                                        this.usList.id=data.data.profile.id;
                                        //存储id到localStorage
                                        localStorage.setItem('idStorage', JSON.stringify(this.usList.id));
                                        this.usList.id= JSON.parse(localStorage.getItem('idStorage'));
                                        this.$router.push({
                                           path: '/gatheringMine' ,
                                           /*query: {
                                               usid:this.usList.id,
                                               accessToken:this.redisterList.accessToken,
                                           }*/
                                        })
                                    }/*else if(data.result.code == 10010){
                                        Toast({ message: "token失效请重新登录", duration: 1500});
                                    }*/else{
                                        Toast({ message: data.result.msg, duration: 1500});
                                    }
                            });
                                /*this.$router.push({
                                    path: '/gatheringMine',
                                    query: {
                                       usid:this.usList.id,
                                       accessToken:this.usList.accessToken,
                                   }})*/
                            }else {
                              Toast({message: data.result.msg,duration: 500});
                            }
                        })
                }
            }
        },
        /*密码显示隐藏*/
        passwordChange(){
            this.redisterPList.pwdType = this.redisterPList.pwdType==='password'?'text':'password';
            this.redisterPList.src=this.redisterPList.src==require("../../assets/loginIndex/buyincang@3x_02zi.png")?require("../../assets/loginIndex/yincang@3x_02zi.png"):require("../../assets/loginIndex/buyincang@3x_02zi.png");
        },
        passwordChange2(){
            this.redisterPList.pwdType2 = this.redisterPList.pwdType2==='password'?'text':'password';
            this.redisterPList.src2=this.redisterPList.src2==require("../../assets/loginIndex/buyincang@3x_02zi.png")?require("../../assets/loginIndex/yincang@3x_02zi.png"):require("../../assets/loginIndex/buyincang@3x_02zi.png");
        },
        /*注册input切换*/
        inputChange(){
            /*alert(1)*/
            this.inputSrc = this.inputSrc==require("../../assets/loginIndex/gouxuan@3x.png")?require("../../assets/loginIndex/weixuan@3x.png"):require("../../assets/loginIndex/gouxuan@3x.png");
            this.redisterList.check = this.redisterList.check==true?false:true;

        }
    },
    /*beforeRouteLeave(to, from, next) {
     from.meta.keepAlive = false;
     next();
     }*/
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    *{
        margin: 0;
        padding: 0;
        outline:medium;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
    }
    .navTitle{
        width:100%;
        height: 43px;
        line-height: 43px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        color: #363636;
        border-bottom: 0.5px solid #C9C9C9;
        background:#fff;
    }
    .navTitle img{
        width: 12px;
        position: absolute;
        top: 10px;
        left: 5%;
    }
    .registerBg{
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #fff;
    }
    .registerBox{
        width: 80%;
        height: 295px;
        position: absolute;
        margin-top:30px;
        margin-left: 10%;
    }
    .registerBox .telBox,.registerBox .passBox{
        width: 100%;
        height: 51px;
        line-height: 51px;
        /*margin-left: 2.5%;*/
        border-bottom: 0.5px solid #DEDEDE;
    }
    .registerBox .telBox{
        background: url(../../assets/loginIndex/shouji@3x_zi.png) no-repeat;
        background-size: 14px;
        background-position:left center;
    }
    .registerBox .passBox{
        background: url(../../assets/loginIndex/mima@3x_zi.png) no-repeat;
        background-size: 14px;
        background-position:left center;
    }
    .registerBox .telBox input,.registerBox .passBox input{
        border: none;
        width: 55%;
        margin-left: 25px;
        caret-color:#7370FF;
        font-size: 14px;
        background-color: transparent;
        color: #5f5f5f;
    }
    .registerBg img{
       width: 14px;
       float: left;
        margin: 0 5% 0 0;
    }

    /*.registerBox input{
        border: none;
        width: 60%;
        margin-left: 30px;
        caret-color:#7370FF;
    }*/
    input::-webkit-input-placeholder{
            color:#bbb;
        }
    .registerBox .passBox span{
        font-size:14px;
        color: #a8a8a8;
        float: right;
        border-left: 0.5px solid #DEDEDE;
        padding: 0 10px;
        margin: 10px 0;
        line-height: 31px;
    }
    .registerBox button{
        width: 100%;
        /*margin-left: 2.5%;*/
        height: 49px;
        background: linear-gradient(to bottom, #f3deab , #e6c489);
        color: #66542f;
        font-size:17px;
        border: none;
        text-align: center;
        border-radius: 25px;
        box-shadow:8px 2px 12px rgba(79,61,157,0.24);
        margin-top: 33px;
    }
    .agreement{
        width: 90%;
        margin-left: 8%;
        display: inline-block;
        margin-top: 20px;
        font-size: 14px;
        line-height: 14px;
        text-align: center;
    }
    .agreement input{
        width: 5%;
        margin-left: 20px;
    }
    /*input样式*/
  /*  .agreement input[type="checkbox"]:checked +label::before{
        display: block;
        content: "\2714";
        text-align: center;
        font-size: 12px;
        color: #7370FF;
        width: 10px;
        height: 10px;
        line-height: 10px;

    }
    .agreement input[type="checkbox"] +label{
        display: block;
        width: 12px;
        height: 12px;
        cursor: pointer;
        position: absolute;
        bottom: 85px;
        left: 28px;
        background-color:#fff;
        border: 1px solid #7370FF;
        border-radius: 2px;
        color: #7370FF;
    }
    .agreement input[type="checkbox"]{
        visibility: hidden;
    }*/
    .agreement a{
        text-decoration: none;
        color: #649ede;
        margin-bottom: 18px;
        display: inline-block;
    }
    .agreement p{
        float: left;
    }
    .setPassword .hint{
        background-color: #FFFAF2;
        font-size: 12px;
        color: #FDC051;
        padding:10px 15px;
    }
    .setPassword .telBox,.setPassword .passBox{
        width: 95%;
        height: 51px;
        line-height: 51px;
        padding-left: 5%;
        border-bottom: 0.5px solid #DEDEDE;
        background-color: #fff;
    }
    .setPassword .clearTel{
        width: 15px;
        margin-top: 18px;
        float: right;
    }
    .setPassword input{
        border: none;
        width: 60%;
        margin-left: 20px;
        caret-color:#7370FF;
        font-size:14px;
        color: #5f5f5f;
    }
    input::-webkit-input-placeholder{
            color:#bbb;
        }
    .setPassword .passBox span{
        font-size:14px;
        color: #7370FF;
    }
    .setPassword button{
        width: 90%;
        margin: 0 5%;
        height: 51px;
        left: 51px;
        background: linear-gradient(to bottom, #f3deab , #e6c489);
        color: #66542f;
        font-size:17px;
        border: none;
        text-align: center;
        border-radius: 25px;
        box-shadow:8px 2px 12px rgba(79,61,157,0.24);
        margin-top: 33px;
    }
    .setPassword .passwordEye{
        width: 20px;
        float: right;
        margin-top: 22px;
        margin-right: 20px;
    }
</style>
