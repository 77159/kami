<!--添加信用卡-->
<template>
<div>
    <div class="box" >
        <nav class="navTitle">
            <img @click="backHistory()" src="../../assets/fanhui@2x.png">
            添加信用卡
        </nav>
        <div class="name title">
            姓名
            <span class="connect">{{userList.name}}</span>
        </div>
        <div class="idNumber title">
            身份证号
            <span class="connect">{{userList.card_no}}</span>
        </div>
        <div class="cardNumber title">
            信用卡号
            <span class="connect">
                <input placeholder="请输入信用卡号" ref="bank_credit_no" v-model="usList.bank_credit_no" @change="cardNumberChange">
                <img src="../../assets/gatheringMine/saoyisao.png">
                <input @change="creditCard($event)" type="file" capture="camera" ref="file" accept="image/*" class="takePhoto">
            </span>
        </div>
        <div class="bank title">
            银行
             <span class="connect"><input placeholder="所属银行" ref="bank_name" v-model="usList.bank_name"></span>
        </div>
        <div class="mobile title">
            预留手机号
             <span class="connect"><input placeholder="银行预留手机号" type="number" ref="mobile"></span>
        </div>
        <button class="next" @click="submitCreditCard">确认并提交</button>

    </div>
</div>
</template>

<script>
import axios from 'axios';
import { Toast,MessageBox } from 'mint-ui';
import {getAddtCreditCard,getPersonalData,getDepositCardBank} from '../../requestAPI/requestAPI';
export default {
    data () {
        return {
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                bank_no:'',            //获取银行名接口所需银行卡号
                bank_credit_no:'',     //添加信用卡接口所需银行卡号
                bank_name:'',
                mobile:'',
                t:'',
                bankId:'',             //添加信用卡传参bankId
            },
            dataList:{},
            userList:{
                name:'',
                card_no:''
            },
        }
    },
    created(){
        this.getUserData();
        /*个人资料*/
        getPersonalData(this.usList).then(data => {
                if(data.result.code == 10000){
                    this.userList = data.data;
                }else {
                  /*Toast({message:'正在加载中。。。',duration: 500});*/
                }
          }).catch(err => {
            Toast({message:'err。。。',duration: 500});
          });
    },
    mounted() {
         //动态计算页面高度
     /* this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;*/

    },
    methods:{
        backHistory(){
            this.$router.go(-1)
            /*this.$router.tabChange=false;*/
        },
        getUserData(){
            this.usList.accessToken = JSON.parse(localStorage.getItem('tokenStorage'));
            this.usList.usid = JSON.parse(localStorage.getItem('idStorage'));
        },
         /*base64转blob*/
        dataURLtoBlob(dataurl){
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr],{type:mime});
        },
        /*压缩图片代码*/
        scaleimg(img){
            let height=img.currentTarget.height;
            let width=img.currentTarget.width;
            let base64data='';
            let can=document.createElement("canvas");
            can.height=height;
            can.width=width;
            let casimg=can.getContext('2d');
            casimg.clearRect(0, 0,width,height);
            casimg.drawImage(img.currentTarget,0,0,width,height);
            base64data=can.toDataURL('image/jpeg');                                  //获取在canvas元素中的图片截图base64编码
            let size=Math.round(this.dataURLtoBlob(base64data, this.name).size/1024);              //获取压缩前的图片大小
           /* console.log(this.dataURLtoBlob(base64data).size);*/
            let maxsize=800;                                                        //设置压缩后的最大值
            if(size>maxsize){
                if(size<1300){
                    img.currentTarget.height=Math.round(height*(3/4));
                    img.currentTarget.width=Math.round(width*(3/4));
                    return this.scaleimg(img)
                }
                else if(size<1800){
                    img.currentTarget.height=Math.round(height*(2/3));
                    img.currentTarget.width=Math.round(width*(2/3));
                    return this.scaleimg(img)
                }
                else{
                    img.currentTarget.height=Math.round(height/2);
                    img.currentTarget.width=Math.round(width/2);
                    return this.scaleimg(img)
                }
            }
            else{
//                console.log('压缩后大小'+size);
                /*alert(size)*/
//                this.size = size;
                return base64data;
            }
        },
        /*扫描信用卡信息*/
        creditCard(e){
            Toast({ message: "加载中", duration: 500});
            event.preventDefault();//取消默认行为
            var name = e.target.files[0].name;
            var file = e.target.files[0];
            var filesize = file.size / 1024;
            var data = new FileReader();
            var img = new Image();
            var formatdata = "";
            data.onload = e1 => {
            img.onload = e => {
              /*console.log("压缩前大小" + this.dataURLtoBlob(e1.target.result).size / 1024);*/ //压缩前大小
             /* Toast({ message: this.dataURLtoBlob(e1.target.result).size, duration: 1500});*/
              if (/^image\/([a-zA-Z]|\*)+$/.test(file.type)) {
                formatdata = this.scaleimg(e);
               /* alert(this.dataURLtoBlob(formatdata,name).size)*/
                var config = {
                  headers: { "Content-Type": "multipart/form-data" }
                };
                var param = new FormData();
                param.append("file", this.dataURLtoBlob(formatdata),name);
                param.append('accessToken',this.usList.accessToken);//通过append向form对象添加数据
                param.append('usid',this.usList.usid);//通过append向form对象添加数据
                param.append('uptype',6);//6:银行卡识别
                param.append('mid',11);//通过append向form对象添加数据
                param.append('type','image');//通过append向form对象添加数据
                axios.post('https://main.kamicard.com/api.php/file/upload',param,config).then(data=>{
                   if(data.data.result.code == 10000) {
                       console.log(data.data.data.number)
                        this.usList.bank_no = data.data.data.number.replace(/\s|\xA0/g,"");
                        this.usList.bank_credit_no = data.data.data.number.replace(/\s|\xA0/g,"");
                        /*获取储蓄卡银行名*/
                        getDepositCardBank(this.usList).then(data => {
                            if(data.result.code == 10000){
                                for(var i = 0;i<data.data.length;i++){
                                    if(this.usList.bank_no.substring(0,11).indexOf(data.data[i].ka_bin)!=-1){
                                        this.usList.bank_name = data.data[i].bank;
                                        this.usList.bankId = data.data[i].bankId;
                                        break;
                                    }
                                }
                            }else {
                              Toast({message:data.result.msg,duration: 500});
                            }
                          }).catch(err => {
                            Toast({message:'err。。。',duration: 500});
                          });
                    }else{
                         Toast({ message: data.data.result.msg, duration: 1500});
                    }
                }).catch(err => {
                   Toast({message:err,duration: 5000});
                });
              }
            };
            img.src = e1.target.result
          };
          data.readAsDataURL(file) 　
        },
        /*提交信用卡*/
        submitCreditCard(){
            this.usList.bank_credit_no = this.$refs.bank_credit_no.value;
            this.usList.bank_name = this.$refs.bank_name.value;
            this.usList.mobile = this.$refs.mobile.value;
            this.usList.t =  Math.floor((new Date()).valueOf()/1000);

            var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
            if(this.usList.mobile==''){
                Toast({message:'请添加手机号',duration: 1000});
            }else if(!reg.test(this.usList.mobile)){
                Toast({message:'请输入正确的手机号',duration: 1000});
            }else{
                /*添加信用卡*/
                getAddtCreditCard(this.usList).then(data => {
                    // console.log(this.usList);
                    console.log(data);
                    if(data.result.code == 10000){
                    this.$router.go(-1)
                    }else if(data.result.code != 10000){
                        const html = `
                                <div style="text-align:left;line-height:1.5; font-size:14px">
                                <p>1、请确认卡号正确</p><p>2、持卡人为认证本人</p><p>3、手机号与银行预留手机号一致</p><p style='margin-top:10px;'>注：其它问题可联系客服帮助您</p>
                                </div>
                            `                           
                        MessageBox({
                            title: '添加卡片出现问题了哟~',
                            message: html,
                            confirmButtonText: '我知道了',
                        });
                    }
                }).catch(err => {
                    const html = `
                                <div style="text-align:left;line-height:1.5; font-size:14px">
                                <p>1、请确认卡号正确</p><p>2、持卡人为认证本人</p><p>3、手机号与银行预留手机号一致</p><p style='margin-top:10px;'>注：其它问题可联系客服帮助您</p>
                                </div>
                            `                           
                        MessageBox({
                            title: '添加卡片出现问题了哟~',
                            message: html,
                            confirmButtonText: '我知道了',
                        });
                });
            }
        },
        /*检测银行卡手动输入*/
        cardNumberChange(){
            this.usList.bank_no = this.$refs.bank_credit_no.value;
            console.log(this.usList);
            /*获取储蓄卡银行名*/
            getDepositCardBank(this.usList).then(data => {
                if(data.result.code == 10000){
                    for(var i = 0;i<data.data.length;i++){
                        if(this.usList.bank_no.substring(0,11).indexOf(data.data[i].ka_bin)!=-1){
                            this.usList.bank_name = data.data[i].bank;
                            this.usList.bankId = data.data[i].bankId;
                            break;
                        }
                    }
                }else {
                    Toast({message:data.result.msg,duration: 500});
                }
                }).catch(err => {
                Toast({message:'err。。。',duration: 500});
                });
        }
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

    .box .title{
        width: 92%;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        padding: 0 4%;
        color: #363636;
        font-size: 15px;
    }.box .name{
        margin-bottom: 1px;
    }.box .idNumber{
        margin-bottom: 10px;
    }
    .box .cardNumber{
        margin-bottom: 1px;
    }
    .box .bank{
        margin-bottom: 1px;
    }
    .box .connect{
        float:right;
        color: #5F5F5F;
        height: 50px;
    }
    .box .connect img{
        width: 27px;
        margin-top: 12px;
        margin-left: 10px;
        float: left;
    }
    .box .connect input{
        text-align: right;
        caret-color: #7370FF;
        float: left;
        height: 50px;
        border: 0;
        font-size: 15px;
    }
    .box .connect input[type="file"]{
         width: 55px;
        position: absolute;
        right: 0;
        opacity: 0;
    }
    .box .next{
        width: 92%;
        height: 50px;
        background: linear-gradient(to right, #f3deab , #e6c489);
        margin:7% 4%;
        border: 0;
        border-radius: 25px;
        color: #66542f;
        font-size: 17px;
        box-shadow: 8px 2px 12px rgba(79,61,157,0.24);
        /*background: url(../../assets/gatheringMine/tianjiabai-@3x.png) no-repeat;*/

    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        -webkit-appearance: none !important;
        margin: 0;
    }
     input::-webkit-input-placeholder{
        color:#BDBDBD;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color:#BDBDBD;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#BDBDBD;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
        color:#BDBDBD;
    }
</style>
