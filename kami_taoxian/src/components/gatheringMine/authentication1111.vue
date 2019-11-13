<!--添加储蓄卡-->
<template>
<div>
    <div class="box" >
        <nav class="navTitle">
            <img @click="backHistory()" src="../../assets/fanhui@2x.png">
            添加储蓄卡<button @click="toHelp()">帮助</button>
        </nav>
        <div class="takeCard">
            <ul>
                <li>
                    <input @change="depositCard($event)" type="file" ref="file" accept="image/*" class="takePhoto">
                    <img src="../../assets/gatheringMine/yinhangka1.png" class="takeCradFront li01">
                    <img src="../../assets/gatheringMine/cameralogo.png" class="camera" v-if="!isDepositCard">
                    <img :src="debitCard.bank_card_photo" class="depositCardPic" v-if="isDepositCard">
                    <span class="takeCardText">储蓄卡正面</span>
                </li>
                <li>
                    <input @change="depositIdCard($event)" type="file" accept="image/*" capture="camera" class="takePhoto">
                    <img src="../../assets/gatheringMine/yinhangka2.png" class="takeCradFront li02">
                    <img src="../../assets/gatheringMine/cameralogo.png" class="camera" v-if="!isDepositIdCard">
                    <img :src="debitCard.id_bank_card_photo" class="depositIdCardPic" v-if="isDepositIdCard">
                    <span class="takeCardText">手持储蓄卡与身份证照片</span>
                </li>
            </ul>
        </div>
        <div class="card title">
            储蓄卡号
            <span class="connect"><input placeholder="填写可使用的储蓄卡号码"></span>
        </div>
        <div class="mobile title">
            手机号
            <span class="connect"><input placeholder="办卡时的银行预留手机号"></span>
        </div>

        <div class="bank title">
            银行
             <span class="connect"><input placeholder="请输入所属银行"></span>
        </div>
        <div class="kaihu title">
            开户省市
             <span class="connect"><img src="../../assets/gatheringMine/xuanze-@3x.png"></span>
        </div>
        <div class="fenhang title">
            分行
             <span class="connect"><img src="../../assets/gatheringMine/xuanze-@3x.png"></span>
        </div>
        <button class="next">下一步</button>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import { Toast } from 'mint-ui';
import {getAddtCreditCard} from '../../requestAPI/requestAPI';
export default {
    data () {
        return {
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                card_name:'',
                card_no:'',
            },
            debitCard:{
                card_name:'',                       //身份证姓名 card_name*
                card_no:''	,                       //身份证号码 card_no*
                card_address:'',                    //身份证上的地址 card_address
                card_star_date:'',                  //身份证有效期开始时间 card_star_date
                card_end_date:'',                   //身份证有效期截止时间 card_end_date
                idcard_photo:'',                    //身份证正面照片url idcard_photo
                idcard_back_photo:'',               //身份证反面照片url idcard_back_photo
                bank_no:'',                         //银行卡号 bank_no*
                bank:'',                            //银行名称 bank
                province:'',                        //开户行所在省 province
                city:'',                            //开户所在城市 city
                bank_sub:'',                        //开户行支行 bank_sub
                bank_mobile:'',                     //银行预留手机号 bank_mobile*
                bank_card_photo:'',                 //银行卡照片 bank_card_photo
                id_bank_card_photo:'',              //手持银行卡url id_bank_card_photo
             },
            isDepositIdCard:false,              //正面身份证
            isDepositCard:false,       //烦面身份证
        }
    },
    created(){
        this.getUserData(this.usList);
//        console.log(this.usList)
        getAddtCreditCard(this.usList).then(data => {

                if(data.result.code == 10000){
                    this.dataList = data.data;
//                    console.log(this.dataList);
                }else {
                  /*Toast({message:'正在加载中。。。',duration: 500});*/
                }
          }).catch(err => {
            console.log(err);
            this.isLoading_hotBank = false;
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
            this.usList.accessToken = this.$route.query.accessToken;
            this.usList.usid = this.$route.query.usid;
            this.usList.card_name= this.$route.query.card_name;
            this.usList.card_no = this.$route.query.card_no;
        },
        toHelp(){
            this.$router.push({ path: '/helpCenter' })
        },
        /*base64转blob*/
        dataURLtoBlob(dataurl,filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr],filename,{type:mime});
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
        /*储蓄卡*/
        depositCard(e){
          event.preventDefault();//取消默认行为
          var name = e.target.files[0].name;
//          this.name = e.target.files[0].name;
          var file = e.target.files[0];
          var filesize = file.size / 1024;
          var data = new FileReader();
          var img = new Image();
          var formatdata = "";
          data.onload = e1 => {
            img.onload = e => {
              if (/^image\/([a-zA-Z]|\*)+$/.test(file.type)) {
                formatdata = this.scaleimg(e);
                var config = {
                  headers: { "Content-Type": "multipart/form-data" }
                };
                var param = new FormData();
                /*param.append("file", this.dataURLtoBlob(formatdata,name));
                param.append('accessToken',this.usList.accessToken);//通过append向form对象添加数据
                param.append('usid',this.usList.usid);//通过append向form对象添加数据
                param.append('mid',11);//通过append向form对象添加数据
                param.append('type','image');//通过append向form对象添加数据 */
                param.append('file',file);
                param.append('api_key','UyG7l1CYPTFqVio_TVr9b2_sS_5AvVEm');//通过append向form对象添加api_key
                param.append('api_secret','7ZRXciWumc1Yo1DSbUsL1k74yTV00n6z');//通过append向form对象添加api_secret
                /*axios.post('http://test-main.pcuion.com:8081/api.php/file/upload',param,config).then(data=>{
                   if(data.data.result.code == 10000) {
                       console.log(data.data);
                       this.debitCard.bank_card_photo = decodeURIComponent(data.data.data.url);
                       this.isDepositCard=true;
                       Toast({ message: data.data.result.msg, duration: 1500});
                    }else{
                         Toast({ message: data.data.result.msg, duration: 1500});
                    }
                })*/
                axios.post('https://api.megvii.com/faceid/v3/ocrbankcard',param,config).then(data=>{
                   if(data.data.result.code == 10000) {
                       console.log(data.data);
                       this.debitCard.bank_card_photo = decodeURIComponent(data.data.data.url);
                       this.isDepositCard=true;
                       Toast({ message: data.data.result.msg, duration: 1500});
                    }else{
                         Toast({ message: data.data.result.msg, duration: 1500});
                    }
                })


              }
            };
            img.src = e1.target.result
          };
          data.readAsDataURL(file) 　
        },
        /*储蓄卡&身份证*/
        depositIdCard(e){
            var name = e.target.files[0].name;
            /*console.log(name);*/
              var file = e.target.files[0];
              var filesize = file.size / 1024;
              var data = new FileReader();
              var img = new Image();
              var formatdata = "";
              data.onload = e1 => {
                img.onload = e => {
                  if (/^image\/([a-zA-Z]|\*)+$/.test(file.type)) {
                    formatdata = this.scaleimg(e);
                    var config = {
                      headers: { "Content-Type": "multipart/form-data" }
                    };
                    var param = new FormData()
                    param.append("file", this.dataURLtoBlob(formatdata,name));
                    param.append('accessToken',this.usList.accessToken);//通过append向form对象添加数据
                    param.append('usid',this.usList.usid);//通过append向form对象添加数据
                    param.append('mid',11);//通过append向form对象添加数据
                    param.append('type','image');//通过append向form对象添加数据
                    axios.post('http://test-main.kamicard.com:8081/api.php/file/upload',param,config)
                        .then(data=>{
                           if(data.data.result.code == 10000) {
                               this.debitCard.id_bank_card_photo=decodeURIComponent(data.data.data.url);
                               this.isDepositIdCard=true;
                               Toast({ message: data.data.result.msg, duration: 1500});
                            }else{
                               Toast({ message: data.data.result.msg, duration: 1500});
                            }
                   })
                  }
                };
                img.src = e1.target.result
              };
              data.readAsDataURL(file)
         },
    }
}
</script>

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
    .navTitle button{
        font-size: 15px;
        border: none;
        background-color: #fff;
        color: #6c6c6c;
        position: absolute;
        right: 10px;
        top: 13px;
    }
    .box .title{
        width: 92%;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        padding: 0 4%;
        color: #363636;
        font-size: 15px;
    }.box .card{
        margin-bottom: 1px;
    }.box .mobile{
        margin-bottom: 10px;
    }
    .box .bank{
        margin-bottom: 1px;
    }
    .box .kaihu{
        margin-bottom: 1px;
    }
    .box .connect{
        float:right;
        color: #5F5F5F;
        height: 50px;
    }.box .connect img{
        width: 8px;
        margin-top: 18px;
        margin-left: 10px;
        float: left;
    }.box .connect input{
        text-align: right;
        caret-color: #7370FF;
        float: left;
        height: 50px;
        border: 0;
    }
    .box .next{
        width: 92%;
        height: 50px;
        background: linear-gradient(to right, #8B89FF , #7B5CFF);
        margin:10% 4%;
        border: 0;
        border-radius: 25px;
        color: #fff;
        font-size: 17px;
        box-shadow: 8px 2px 12px rgba(79,61,157,0.24);
        /*background: url(../../assets/gatheringMine/tianjiabai-@3x.png) no-repeat;*/

    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        -webkit-appearance: none !important;
        margin: 0;
    }

    .box .takeCard{
        width: 100%;
        height: 180px;
        background-color: #fff;
        margin: 1px 0 10px;
    }.box .takeCard li{
        width: 41%;
        height: 100%;
        float: left;
        position: relative;
    }.box .takeCard .takeCradFront{
        width: 100%;
        height: 95px;
        margin:18px 0 23px;
    }.box .takeCard li:nth-child(1){
        padding:0 3% 0 6%;
    }.box .takeCard li:nth-child(2){
        padding:0 6% 0 3%;
    }
    .box .takeCard .takeCardText{
        width: 100%;
        text-align: center;
        display: inline-block;
        font-size: 12px;
        color: #6c6c6c;
    }.box .takeCard .camera{
        width: 34px;
        height: 29px;
        position: absolute;
        top: 50px;
        left: 50%;
        margin-left: -17px;
    }
    .box .takeCard li:nth-child(1) .takePhoto{
        position: absolute;
        width: 80%;
        height: 97px;
        top: 20px;
        opacity: 0;
        z-index: 10;
        /*visibility: hidden;*/
    }
    .box .takeCard li:nth-child(1) .depositCardPic{
        width: 75%;
        height: 85px;
        position: absolute;
        top: 24px;
        left: 15.5%;
    }
    .box .takeCard li:nth-child(2) .takePhoto{
        position: absolute;
        width: 80%;
        height: 97px;
        top: 20px;
        opacity: 0;
        z-index: 10;
        /*visibility: hidden;*/
    }
    .box .takeCard li:nth-child(2) .depositIdCardPic{
        width: 75%;
        height: 85px;
        position: absolute;
        top: 24px;
        left: 10%;
    }
</style>
