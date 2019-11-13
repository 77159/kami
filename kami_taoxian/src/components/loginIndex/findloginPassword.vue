<template>
  <div>
      <nav class="navTitle"><img @click="backHistory()" src="../../assets/fanhui@2x.png">{{title}}</nav>
        <!--发送验证码-->
    <div class="findlLoginBox" ref="wrapper" :style="{height: wrapperHeight + 'px'}" v-if="registerMobile">
        <div class="telBox">手机号
            <input placeholder="请输入手机号" v-model="redisterList.mobile" type="tel" maxlength="11">
            <img @click="clearTel()" src="../../assets/loginIndex/guanbianniu@2x.png" class="clearTel" v-if="redisterList.mobile!=''">
        </div> 
        <div class="passBox">验证码<input placeholder="请输入验证码" v-model="redisterList.code" type="tel" maxlength="4">
            <span @click="sendCode(redisterList.mobile)" v-show="show">发送验证码</span>
            <span v-show="!show" class="count" style="float: right;">{{count}}s</span>
    </div> 

        <button @click="next(redisterList)">下一步</button> 
    </div>   
      <!--找回密码-->
    <div class="setPassword" ref="wrapper" :style="{height: wrapperHeight + 'px'}" v-if="!registerMobile">
        <div class="hint">*&nbsp;请输入6-20位密码，必须包含数字与字母（区分大小写）</div>
        <div class="telBox">输入密码<input placeholder="请输入登录密码" :type="this.redisterPList.pwdType" v-model="redisterList.password">
            <img @click="passwordChange()" :src="this.redisterPList.src" class="passwordEye">
        </div> 
        <div class="passBox">再次确认<input placeholder="请输入登录密码" :type="this.redisterPList.pwdType2"  v-model="passwordConfirm">
            <img @click="passwordChange2()" :src="this.redisterPList.src" class="passwordEye">
        </div> 
        <button @click="finish(redisterList)">完成</button> 
    </div>
      
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import {postFindPasswordCode,getToken,postFindPassword} from '../../requestAPI/requestAPI';
    
export default {
    data () {
        return {
           redisterList:{
                mobile:'',
                mid:11,
                accessToken:'',
                usid:'0',
                password:'',
                code:'',
            },
            accessList:{
                account:'merchantapi',
                key:'rqw9qw0e980c4ybg2D0c24G3'
            },
            passwordConfirm:'',
            show: true,
            count: '',
            timer: null,
            registerMobile:true,
            redisterPList:{
                src:require("../../assets/loginIndex/yincang@3x_02zi.png"),
                pwdType:"password",
                src2:require("../../assets/loginIndex/yincang@3x_02zi.png"),
                pwdType2:"password",
            },
            wrapperHeight:0,
            title:'找回登录密码'
        }
        
    },
    mounted() {
         //动态计算页面高度
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    },
    created(){
       this.transmitToken(); 
    },
    methods:{
        transmitToken() {
            this.redisterList.accessToken =  JSON.parse(localStorage.getItem('tokenStorage'));
           /* console.log(this.redisterList.accessToken);*/
          },
        /*清空手机号*/
        clearTel(){
            this.usertel='';
            this.redisterList.mobile='';
        },
        /*下一步*/
        /*next(){
            if(this.usertel==''||this.usercode==''){
                Toast({ message: '手机号或验证码为空', duration: 1500});
            }
        },*/
        backHistory(){
            this.$router.go(-1)
        },
        
        /*发送找回密码验证码*/
        sendCode(mobile){
            var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
            if(!reg.test(mobile)){
                Toast({message:'请输入正确的手机号',duration: 500});
            }else{
//                console.log(this.redisterList)
                /*获取token*/    
                /*getToken(this.accessList).then(data => {
                    if(data.result.code == 10000) {
                        this.redisterList.accessToken = data.data.accessToken;
                       
                    }else {
                      Toast({message:'正在加载中。。。',duration: 500});
                    }
                })
                */
                
                 /*发送验证码*/
                postFindPasswordCode(this.redisterList).then(data => {
                    if(data.result.code == 10000) {
                        this.redisterList.mobile = mobile;

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
        /*下一步--密码*/
        next(redisterList){
            var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
            if(this.redisterList.mobile==''||this.redisterList.code==''){
                Toast({ message: '手机号或验证码错误', duration: 1500});
           }else if(!reg.test(this.redisterList.mobile)){
                Toast({message:'请输入正确的手机号',duration: 500});    
           }else{
               this.registerMobile = !this.registerMobile;
               this.title='重置密码';
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
        /*找回密码完成*/
        finish(redisterList){
            /*校验密码*/
            if (redisterList.password === ''|| this.passwordConfirm === '') {
              Toast({message:'请输入密码',duration: 500});
            }else if(redisterList.password != this.passwordConfirm ){
                Toast({message:'两次密码不一致',duration: 500});      
            }else{
                console.log(this.redisterList);
                var reg=/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
                if(!reg.test(redisterList.password)){
                    Toast({message:'密码格式有误',duration: 500});
                }else{
                    postFindPassword(this.redisterList).then(data => {
                            if(data.result.code == 10000) {
                                Toast({message:'密码重置成功',duration: 500});
                                this.$router.push({ path: '/loginIndex' })
                            }else {
                              Toast({message:data.result.msg,duration: 500});
                            }
                        })
                }
            }     
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
    }
    .navTitle{
        width:100%;    
        height: 43px;
        line-height: 43px;
        text-align: center;
        font-size: 18px;
        color: #363636;
        border-bottom: 0.5px solid #C9C9C9;
        background:#fff;
    }
    
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
    .navTitle img{
        width: 12px;
        position: absolute;
        top: 10px;
        left: 5%;
    }
    .findlLoginBox{
        /*margin-top: 20px;*/
        background-color: #fff;
    }
    .findlLoginBox .telBox,.findlLoginBox .passBox{
        width: 97.5%;
        height: 51px;
        line-height: 51px;
        padding-left: 2.5%;
        border-bottom: 0.5px solid #DEDEDE;
        background-color: #fff;
    }
    .findlLoginBox .clearTel{
        width: 15px;
        margin-top: 18px;
        margin-right: 10px;
        float: right;
    }
    .findlLoginBox input{
        border: none;  
        width: 55%;
        margin-left: 20px;
        caret-color:#7370FF;
        font-size:14px;
        color: #5f5f5f;
    }
    input::-webkit-input-placeholder{
            color:#bbb;
        }
    .findlLoginBox .passBox span{
        font-size:14px;
        color: #a8a8a8;
        float: right;
        border-left: 0.5px solid #DEDEDE;
        padding: 0 10px;
        margin: 10px 0;
        line-height: 31px;
    }
    .findlLoginBox button{
        width: 90%;
        margin-left: 5%;
        height: 51px;
        left: 51px;
        background: linear-gradient(to bottom, #f3deab , #e6c489);
        color: #66542f;
        /* color: #fff; */
        font-size:17px;
        border: none;
        text-align: center;
        border-radius: 25px;
        box-shadow:8px 2px 12px rgba(79,61,157,0.24);
        margin-top: 33px;
    }
    .setPassword{
        background-color: #FFF;
    }
    .setPassword .hint{
        background-color: #FFFAF2;
        font-size: 12px;
        color: #FDC051;
        padding:10px 15px;
    }
    .setPassword .telBox,.setPassword .passBox{
        width: 92%;
        height: 51px;
        line-height: 51px;
        margin-left: 4%;
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
        width: 66%;
        margin-left: 20px;
        caret-color:#7370FF;
        font-size:14px;
    }
    input::-webkit-input-placeholder{
            color:#bbb;
        }
    .setPassword .passBox span{
        font-size:14px;
        color: #a8a8a8;
    }
    .setPassword button{
        width: 95%;
        margin-left: 2.5%;
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
    }
</style>