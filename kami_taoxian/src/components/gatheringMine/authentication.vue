<!--个人资料-->
<!--<meta http-equiv="X-UA-Compatible" content="ie=edge">-->
<template>
  <div>
      <nav class="navTitle">
          <img @click="backHistory()" src="../../assets/fanhui@2x.png">
          身份认证
          <button @click="toHelp()">帮助</button>
      </nav>
      <!--新手指引-->
      <!--<div class="flow" v-if="isFlow">
          <img src="../../assets/gatheringMine/newone.png">
          <button class="next" @click="knowFlow()">我知道了</button>
      </div>-->
      <!--身份验证-->
      <div class="authentication">
        <p class="tips">提示：请用手机横屏拍摄 <img src="../../assets/gatheringMine/iphone_pai.png" alt=""></p>
          <div class="takeCard">
            <ul>
                <li>
                    <input @change="cardFrontPic($event)" type="file" capture="camera" ref="file" accept="image/*" class="takePhoto">
                    <img src="../../assets/gatheringMine/shenfenzheng1.png" class="takeCradFront li01">
                    <img src="../../assets/gatheringMine/cameralogo.png" class="camera" v-if="!isCardPic">
                    <img :src="debitCard.idcard_photo" class="cardFrontPic" v-if="isCardPic">
                    <span class="takeCardText">请拍摄身份证正面</span>
                </li>
                <li>
                    <input @change="cardReversePic($event)" type="file" accept="image/*" capture="camera" class="takePhoto">
                    <img src="../../assets/gatheringMine/shenfenzheng2.png" class="takeCradFront li02">
                    <img src="../../assets/gatheringMine/cameralogo.png" class="camera" v-if="!isCardReversePic">
                    <img :src="debitCard.idcard_back_photo" class="cardReversePic" v-if="isCardReversePic">
                    <span class="takeCardText">请拍摄身份证反面</span>
                </li>
            </ul>
        </div>

        <div class="card title">
            姓名
            <span class="connect">
                <input placeholder="请输入您的姓名" type="text" :value="debitCard.card_name" ref="card_name">
            </span>
        </div>
        <div class="mobile title">
            身份证号
            <span class="connect">
                <input placeholder="请输入您的身份证号" :value="debitCard.card_no" ref="card_no" maxlength="18">
            </span>
        </div>
        <button class="nextToAddDepositCard" @click="toAddDepositCard">下一步</button>
      </div>

  </div>
</template>

<script>

import axios from 'axios';
import Qs from 'qs';
import lrz from 'lrz';
import vm from '../../main';
import { Toast } from 'mint-ui';
import {getPersonName,getPersonalData,postCardPic} from '../../requestAPI/requestAPI';
export default {
    data () {
        return {
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                /*type:'image',*/
                uptype:1,
                file:'',
                ofname:'',                 //返回的 文件
                /*headers:{'Content-Type':'multipart/form-data'},*/
            },
            /*title:'信用卡取现流程',*/
           /* isFlow:true, */                 //true：新手指引界面
            /*isAddDepositCard:false,*/
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
                fname:'',                 //返回的 文件
             },
            isCardPic:false,              //正面身份证
            isCardReversePic:false,       //反面身份证
            name: '',
            size: '',
        }
    },
    created(){
        this.getUserData();

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
        /*knowFlow(){
            this.title = "身份认证";
            this.isFlow = false;
        },*/
        toHelp(){
            this.$router.push({ path: '/helpCenter' })
        },
        /*next(){
            this.debitCard.card_name = this.$refs.card_name.value;
            this.debitCard.card_no= this.$refs.card_no.value;
            console.log(this.debitCard.card_name)
            console.log(this.debitCard.card_no)
        },*/
        /*base64转blob*/
        dataURLtoBlob(dataurl) {
            /*console.log(dataurl);*/
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
                this.size = size;
                return base64data;
            }
        },
        /*身份证正面*/
        cardFrontPic(e){
          event.preventDefault();//取消默认行为
          var name = e.target.files[0].name;
          console.log(name)
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
                param.append('uptype',1);//1:身份证正面
                param.append('mid',11);//通过append向form对象添加数据
                param.append('type','image');//通过append向form对象添加数据

               /* console.log(this.dataURLtoBlob(formatdata,name))*/
                Toast({ message: '正在上传，请稍后', duration: 500});
                //  待修改 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
                axios.post('https://main.kamicard.com/api.php/file/upload',param,config).then(data=>{

                   if(data.data.result.code == 10000) {
                       this.debitCard.idcard_photo =decodeURIComponent(data.data.data.url);
                       this.debitCard.fname =decodeURIComponent(data.data.data.fname);
                       this.debitCard.card_name =JSON.parse(data.data.data.ocrres).name;
                       this.debitCard.card_no =JSON.parse(data.data.data.ocrres).id_card_number;
                       this.debitCard.card_address =JSON.parse(data.data.data.ocrres).address;
                       this.isCardPic=true;
                       /*console.log(data.data.data);*/
                       /*console.log('身份证上传成功后返回图片路径:',this.debitCard.fname);*/
                       // Toast({ message: data.data.result.msg, duration: 1000});
                     Toast({ message: '上传成功', duration: 1000});
                    }else{
                        Toast({ message: data.data.result.msg, duration: 1000});
                    }
                }).catch(err => {
                    alert(err);
                })
                /*this.usList.file=this.dataURLtoBlob(formatdata,name);
                console.log(this.usList);
                postCardPic(this.usList).then(data => {
                    if(data.result.code == 10000) {
                        Toast({ message: data.result.msg, duration: 1500});
                    }else{
                         Toast({ message: data.result.msg, duration: 1500});
                    }
                })*/

              }
            };
            img.src = e1.target.result                                     //触发加载img load事件
          };
          /*this.$store.commit('showload',true)       */                   //触发加载动画
          data.readAsDataURL(file) 　
        },
        /*身份证背面*/
        cardReversePic(e){
            var name = e.target.files[0].name;
            /*console.log(name);*/
              var file = e.target.files[0];
              var filesize = file.size / 1024;
              var data = new FileReader();
              var img = new Image();
              var formatdata = "";
              data.onload = e1 => {
                img.onload = e => {
                  /*console.log("压缩前大小" + dataURLtoBlob(e1.target.result).size / 1024); //压缩前大小*/
                  if (/^image\/([a-zA-Z]|\*)+$/.test(file.type)) {
                    formatdata = this.scaleimg(e);
                    //#region 提交Blob格式图片文件
                    var config = {
                      headers: { "Content-Type": "multipart/form-data" }
                    };
                    var param = new FormData()
                    param.append("file", this.dataURLtoBlob(formatdata),name);
                    param.append('accessToken',this.usList.accessToken);//通过append向form对象添加数据
                    param.append('usid',this.usList.usid);//通过append向form对象添加数据
                    param.append('uptype',2);//2:身份背面
                    param.append('mid',11);//通过append向form对象添加数据
                    param.append('type','image');//通过append向form对象添加数据
                    Toast({ message: '正在上传，请稍后', duration: 500});
                    axios.post('https://main.kamicard.com/api.php/file/upload',param,config)
                        .then(data=>{
                       /* */
                           if(data.data.result.code == 10000) {
                               /*console.log(JSON.parse(data.data.data.ocrres));*/
                               this.debitCard.idcard_back_photo =decodeURIComponent(data.data.data.url);
                               this.debitCard.card_star_date =JSON.parse(data.data.data.ocrres).valid_date.split('-')[0];
                               this.debitCard.card_end_date =JSON.parse(data.data.data.ocrres).valid_date.split('-')[1];
                               /*this.ofname =decodeURIComponent(data.data.data.fname);*/
                               /*console.log(this.debitCard.card_star_date);
                               console.log(this.debitCard.card_end_date);*/
                               this.isCardReversePic=true;
                               // Toast({ message: data.data.result.msg, duration: 1000});
                             Toast({ message: '上传成功', duration: 1000});
                            }else{
                               Toast({ message: data.data.result.msg, duration: 1000});
                            }
                   })
                  }
                };
                img.src = e1.target.result                                     //触发加载img load事件
              };
              /*this.$store.commit('showload',true)       */                   //触发加载动画
              data.readAsDataURL(file)
         },
        /*下一步添加储蓄卡*/
        toAddDepositCard(){
            /*console.log(this.usList.usid);*/
            /*this.$router.push({
                path: '/addDepositcard' ,
                query: {
                    usid:this.usList.usid,
                    accessToken:this.usList.accessToken,
                    card_name:this.$refs.card_name.value,
                    card_no:this.$refs.card_no.value,
                }
            })*/
            /*判断是否填写完整*/
            if(this.$refs.card_name.value==""||this.$refs.card_no.value==""){
               Toast({ message: "请完整填写信息", duration: 1000});
            }else if(this.debitCard.idcard_photo==''){
                Toast({message:'请添加身份证正面照片',duration: 1000});
            }else if(this.debitCard.idcard_back_photo==''){
                Toast({message:'请添加身份证反面照片',duration: 1000});
            }else{
                /*console.log(this.$refs.card_name.value+this.$refs.card_no.value);*/
                this.$router.push({
                    path: '/addDepositcard' ,
                    query: {
                        usid:this.usList.usid,
                        accessToken:this.usList.accessToken,
                        card_name:this.$refs.card_name.value,
                        card_no:this.$refs.card_no.value,
                        card_address:this.debitCard.card_address,                    //身份证上的地址 card_address
                        card_star_date:this.debitCard.card_star_date,                  //身份证有效期开始时间 card_star_date
                        card_end_date:this.debitCard.card_end_date,                   //身份证有效期截止时间 card_end_date
                        idcard_photo:this.debitCard.idcard_photo,                    //身份证正面照片url idcard_photo
                        idcard_back_photo:this.debitCard.idcard_back_photo,               //身份证反面照片url idcard_back_photo
                        fname:this.debitCard.fname,               //返回服务器身份证图片路径
                    }
                })
            }
        }
    },
    /*beforeRouteEnter(to, from, next) {
              next(vm=>{
                if(from.path=="/helpCenter"){
                    vm.isFlow=false;
                  }
            });
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
        list-style: none;
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
        right: 16px;
        top: 13px;
    }
    .flow{
        background-color: #fff;
    }
    .flow img{
        width: 100%;
    }
    .flow .next{
        width:50%;
        height:44px;
        margin: 5% 25%;
        font-size:17px;
        background: linear-gradient(to right, #FFA35F , #FF7348);
        color: #fff;
        box-shadow: 2px 8px 12px rgba(255,121,75,0.24);
        border: none;
        border-radius: 25px;
    }
    .authentication .title{
        width: 92%;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        padding: 0 4%;
        color: #363636;
        font-size: 15px;
    }
    .authentication .tips{
       padding-left: 20px;
      line-height: 30px;
      font-size: 14px;
      color:#303030;
    }
    .authentication .tips img{
      display: inline-block;
      width: 20px;
      /*margin-left: 3px;*/
      vertical-align: middle;
      margin-top: -4px;
    }
    .authentication .card{
        margin-bottom: 1px;
    }.authentication .mobile{
        margin-bottom: 10px;
    }
    .authentication .bank{
        margin-bottom: 1px;
    }
    .authentication .kaihu{
        margin-bottom: 1px;
    }
    .authentication .connect{
        float:right;
        color: #5F5F5F;
        height: 50px;
        width: 70%;
    }.authentication .connect img{
        width: 8px;
        margin-top: 18px;
        margin-left: 10px;
        float: left;
    }.authentication .connect input{
        text-align: right;
        caret-color: #7370FF;
        float: left;
        height: 50px;
        border: 0;
        font-size: 15px;
        width: 100%;
        display: inline-block;
    }
    .authentication .connect input::placeholder{
      color: #bdbdbd;
    }
    .authentication .next{
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

    .authentication .takeCard{
        width: 100%;
        height: 180px;
        background-color: #fff;
        margin: 1px 0 10px;
    }
    .authentication .takeCard li{
        width: 41%;
        height: 100%;
        float: left;
        position: relative;
    }
    .authentication .takeCard .takeCradFront{
        width: 100%;
        height: 97px;
        margin:18px 0 23px;
    }
    .authentication .takeCard li:nth-child(1){
        padding:0 3% 0 6%;
    }
    .authentication .takeCard li:nth-child(1) .takePhoto{
        position: absolute;
        width: 80%;
        height: 97px;
        top: 20px;
        opacity: 0;
        z-index: 10;
        /*visibility: hidden;*/
    }
    .authentication .takeCard li:nth-child(1) .cardFrontPic{
        width: 75%;
        height: 85px;
        position: absolute;
        top: 24px;
        left: 16%;
    }
    .authentication .takeCard li:nth-child(2) .takePhoto{
        position: absolute;
        width: 80%;
        height: 97px;
        top: 20px;
        opacity: 0;
        z-index: 10;
        /*visibility: hidden;*/
    }
    .authentication .takeCard li:nth-child(2) .cardReversePic{
        width: 75%;
        height: 85px;
        position: absolute;
        top: 24px;
        left: 10%;
    }
    .authentication .takeCard li:nth-child(2){
        padding:0 6% 0 3%;
    }
    .authentication .takeCard .takeCardText{
        width: 100%;
        text-align: center;
        display: inline-block;
        font-size: 12px;
        color: #6c6c6c;
    }.authentication .takeCard .camera{
        width: 34px;
        height: 29px;
        position: absolute;
        top: 50px;
        left: 50%;
        margin-left: -17px;
    }


    .nextToAddDepositCard{
        width:90%;
        height:49px;
        margin-left: 5%;
        margin-top: 8%;
        font-size:17px;
        background: linear-gradient(to right, #f3deab , #e6c489);
        color: #66542f;
        box-shadow: 2px 8px 12px rgba(79,61,157,0.24);
        border: none;
        border-radius: 25px;
    }
</style>
