<!--个人资料-->
<template>
  <div><div class="box" >
    <div class="UserData"  v-if="appear">
        <nav class="navTitle"><img @click="backHistory()" src="../../assets/fanhui@2x.png">个人资料</nav>
        <div class="mineConnect">
            <ul>
                <li>
                    <span class="cardTitle">头像</span>
                    <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                    <img :src="dataList.headImage" class="userPic" v-if="isPic">
                    <input @change="changePortrait($event)" type="file" ref="file" accept="image/*" class="takePhoto">
                </li>
                <li @click="appear=false;">
                    <span class="cardTitle">昵称</span>
                    <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                    <span class="userName">{{dataList.nickname}}</span>
                </li>
                <li>
                    <span class="cardTitle">手机号</span>
                    <!--<img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">-->
                    <span class="userName" style="margin-right:20px;color:#BDBDBD;">{{this.dataList.mobile}}</span>
                </li>
            </ul>
        </div>
    </div>
    <div class="changeName" v-if="!appear">
        <nav class="navTitle">
            <button @click="delName">取消</button>
            修改昵称
            <button @click="upName()" :class="this.textColor==1?'addTextColor':'addTextColorNo'">完成</button>
        </nav>
        <input :value="usList.nickname" class="userName" ref="nickname" @input="changeColor()">
        <img src="../../assets/gatheringMine/guanbianniu@2x.png" class="delName" @click="usList.nickname='';">
    </div>
  </div></div>
</template>

<script>
import axios from 'axios';
import { Toast } from 'mint-ui';
import {getPersonName,getPersonalData} from '../../requestAPI/requestAPI';
export default {
    data () {
        return {
            dataList:{
                headImage:'',
                nickname:'',
                card_check:'',
                splitter_remain: 0,//分润余额
                recommended: '',//邀请人数
                recommended1: '',//升级所需人数
                creditCardNum: '',//信用卡个数
                savingCardNum:'',//储蓄卡个数
                level:'',//卡等级
                status:'',//认证情况
                mobile:'',
            },
            phoneNumber:'',
            /*wrapperHeight:0,*/
            appear:true,
            isPic:false,
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                nickname:'',
            },
            textColor:0,
            /*tabChange:true,*/
        }
    },
    created(){
        this.getUserData();
       /* this.isPic=false;*/
        /*加载个人资料*/
         getPersonalData(this.usList).then(data => {
             /*console.log(this.dataList);*/
            if(data.result.code == 10000){
                this.dataList = data.data;
                this.isPic=true;
                /*手机号隐藏*/
                var str1=this.dataList.mobile.substring(3,7);
                this.dataList.mobile =this.dataList.mobile.replace(str1,"****");
               /* console.log(this.dataList.mobile);*/
                this.usList.nickname =this.dataList.nickname;
                //判断是否更改过头像
                if(this.dataList.headImage==''){
                    this.dataList.headImage=require("../../assets/gatheringMine/morentouxiang@2x.png");
                }else{
                    this.dataList.headImage= decodeURIComponent(this.dataList.headImage);
                }
            }else {
                /*this.isPic=false;*/
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
            this.usList.accessToken = JSON.parse(localStorage.getItem('tokenStorage'));
            this.usList.usid = JSON.parse(localStorage.getItem('idStorage'));
        },
        delName(){
            this.appear=true;
            this.textColor=0;
        },
        upName(){
            this.usList.nickname = this.$refs.nickname.value;
            if(this.$refs.nickname.value==''){
               Toast({message:'昵称不能为空',duration: 500});
             }else{
                getPersonName(this.usList).then(data => {
                    if(data.result.code == 10000) {
                        Toast({message:'昵称修改成功',duration: 500});
                        this.appear=true;
                        this.$router.go(0);
                    }else{
                        Toast({message:'昵称修改失败',duration: 500});
                    }
                })
            }
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
        /*更换头像*/
        changePortrait(e){
          event.preventDefault();//取消默认行为
          var name = e.target.files[0].name;
          this.name = e.target.files[0].name;
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
                /*param.append("file", this.dataURLtoBlob(formatdata,name));
                param.append('accessToken',this.usList.accessToken);//通过append向form对象添加数据
                param.append('usid',this.usList.usid);//通过append向form对象添加数据
                param.append('uptype',1);//1:身份证正面
                param.append('mid',11);//通过append向form对象添加数据
                param.append('type','image');//通过append向form对象添加数据*/

               /* console.log(this.dataURLtoBlob(formatdata,name))*/
                param.append("file", this.dataURLtoBlob(formatdata),name);
                param.append('accessToken',this.usList.accessToken);//通过append向form对象添加数据
                param.append('usid',this.usList.usid);//通过append向form对象添加数据
                param.append('uptype',4);//4:头像
                param.append('type','image');//通过append向form对象添加数据
                Toast({ message: '正在上传，请稍后', duration: 500});
                axios.post('https://main.kamicard.com/api.php/file/upload',param,config).then(data=>{

                   if(data.data.result.code == 10000) {
                      /* console.log(decodeURIComponent(data.data.data.url));*/
                       /*console.log(data.data);*/
                       this.dataList.headImage = decodeURIComponent(data.data.data.url);
                       console.log('this.dataList.headImage', this.dataList.headImage);
                       /*this.debitCard.idcard_photo =decodeURIComponent(data.data.data.url);
                       this.ofname =decodeURIComponent(data.data.data.fname);
                       this.debitCard.card_name =decodeURIComponent(JSON.parse(data.data.data.ocrres).name);
                       this.debitCard.card_no =decodeURIComponent(JSON.parse(data.data.data.ocrres).id_card_number);
                       this.isCardPic=true;*/
//                       Toast({ message: data.data.result.msg, duration: 1500});
                    }else{
                         Toast({ message: data.data.result.msg, duration: 1500});
                    }
                })
                  .catch(err => {
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
        /*修改昵称输入框变化 完成变色*/
        changeColor(){
            this.textColor=1;
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
    .navTitle button:nth-child(1){
        height: 43px;
        line-height: 43px;
        font-size: 15px;
        float: left;
        border: none;
        background-color: #fff;
        padding-left: 10px;
        color: #6C6C6C;
    }
    .navTitle button:nth-child(2){
        height: 43px;
        line-height: 43px;
        font-size: 15px;
        float: right;
        border: none;
        background-color: #fff;
        padding-right: 10px;
        /*color: #BDBDBD;*/
    }
    .addTextColor{
        color: #6C6C6C;
    }
    .addTextColorNo{
        color: #BDBDBD;
    }



     .mineConnect{
        width: 100%;
        float: left;
        background-color: #fff;
    }
    .mineConnect li{
        width: 100%;
        height: 55px;
        border-bottom: 1px solid #f6f6f6;
    }
    .mineConnect .iconLeft{
        width: 44px;
        margin-left: 2%;
        margin-top: 9px;
        float: left;
    }
    .mineConnect .cardTitle{
        height: 55px;
        line-height: 55px;
        font-size: 15px;
        color: #363636;
        margin-left: 15px;
    }.mineConnect .cardText{
        height: 55px;
        line-height: 55px;
        font-size: 14px;
        color: #BDBDBD;
        float: right;
    }.mineConnect .moreRight{
        width: 8px;
        float: right;
        margin: 22px 20px 18px 10px;
    }
    .mineConnect .userPic{
        width:32px;
        height: 32px;
        border-radius: 28px;
        float: right;
        margin: 10px 0;
    }
    .mineConnect .userName{
        line-height: 55px;
        float: right;
        color: #BDBDBD;
        font-size: 15px;
        /*margin: 10px 0;*/
    }
    .mineConnect li:nth-child(1) .takePhoto{
        position: absolute;
        width: 90%;
        height: 55px;
        opacity: 0;
        z-index: 10;
    }

    .changeName .userName{
        height: 55px;
        /*line-height: 55px;*/
        border: none;
        width: 100%;
        font-size: 15px;
        color: #6C6C6C;
        margin-top: 5px;
        padding-left: 5px;
        background-color: #fff;
    }.changeName .delName{
        width: 18px;
        height: 18px;
        line-height: 55px;
        font-size: 15px;
        color: #363636;
        position: absolute;
        top: 67px;
        right: 10px;
        background-color: #fff;
    }
</style>
