<!--添加储蓄卡/未认证-->
<template>
<div>
    <div class="box" v-if="isFill">
        <nav class="navTitle">
            <img @click="backHistory()" src="../../assets/fanhui@2x.png">
            添加储蓄卡<button @click="toHelp()">帮助</button>
        </nav>

        <div class="takeCard">
            <ul>
                <li>
                    <input @change="depositCard($event)" type="file" capture="camera" ref="file" accept="image/*" class="takePhoto">
                    <img src="../../assets/gatheringMine/yinhangka1.png" class="takeCradFront li01">
                    <img src="../../assets/gatheringMine/cameralogo.png" class="camera" v-if="!isDepositCard">
                    <img :src="usList.bank_card_photo" class="depositCardPic" v-if="isDepositCard">
                    <span class="takeCardText">请拍摄储蓄卡正面</span>
                </li>
                <li>
                    <input @change="depositIdCard($event)" type="file" accept="image/*" capture="camera" class="takePhoto">
                    <img src="../../assets/gatheringMine/yinhangka2.png" class="takeCradFront li02">
                    <img src="../../assets/gatheringMine/cameralogo.png" class="camera" v-if="!isDepositIdCard">
                    <img :src="usList.id_bank_card_photo" class="depositIdCardPic" v-if="isDepositIdCard">
                    <span class="takeCardText">请手持身份证拍照</span>
                </li>
            </ul>
        </div>

        <div class="card title">
            储蓄卡号
            <span class="connect">
                <input placeholder="请输入银行卡号" ref="bank_no" v-model="fillList.bank_no" @change="fillCardId()">
            </span>
        </div>
        <div class="mobile title">
            手机号
            <span class="connect"><input placeholder="办卡时的银行预留手机号" ref="bank_mobile" v-model="fillList.bank_mobile" type="number"></span>
        </div>

        <div class="bank title">
            银行
             <span class="connect"><input placeholder="请输入所属银行" ref="bank" v-model="fillList.bank"></span>
        </div>
        <div class="kaihu title" @click="chooseSite">
            开户省市
             <span class="connect">
                 <img src="../../assets/gatheringMine/xuanze-@3x.png">
                 <div style="float:right;">{{usList.province}}&nbsp;{{usList.city}}</div>
            </span>
        </div>
        <div class="fenhang title" @click="toFill">
            开户支行
             <span class="connect">
                 <img src="../../assets/gatheringMine/xuanze-@3x.png">
                 <div style="float:right;overflow: hidden;width: 150px;text-overflow:ellipsis;white-space: nowrap;text-align: right;">{{usList.bank_sub}}</div>
            </span>
        </div>
        <button class="next" @click="nextToAdd">确认并提交</button>
        <mt-popup v-model="popupVisible" position="bottom" style="width:100%;">
            <div class="popupProvinceCity">
                <button class="cancel" @click="popupVisible=false">取消</button>
                <button class="sure" @click="chooseProvinceCity">完成</button>
            </div>
            <mt-picker :slots="slotProvince" @change="onValuesChange" class="slotCss"></mt-picker>
            <mt-picker :slots="slotCity" class="slotCss" @change="onValuesChangeCity"></mt-picker>
        </mt-popup>
    </div>
    <div class="searchBank" v-if="!isFill">
        <nav class="navTitle">
            <img @click="isFill=true" src="../../assets/fanhui@2x.png">添加储蓄卡
        </nav>
        <input placeholder="搜索" class="searchInput" ref="bank_sub" @input="inputBank" v-model="fillList.bankName">
        <img src="../../assets/gatheringMine/guanbianniu@2x.png" class="closeSearch" v-if="isClearBank" @click="clearSearch">
        <ul>
            <li v-for="(item, index) in bankList" :key="index" @click="selectdBank(index)" v-if="item.bank_sub!=''">
                {{item.bank_sub}}</li>
        </ul>
    </div>
    
</div>
</template>

<script>
import axios from 'axios';
import { Toast,MessageBox } from 'mint-ui';
import { Popup } from 'mint-ui';
import {
    getAddtDepositCard,
    getProvince,
    getCity,
    getDepositCardBank,
    getBank,
    getIdentity,
    getPersonalData,
    postToGetFaceToken
} from '../../requestAPI/requestAPI';
export default {
    data () {
        return {
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                os_type:'h5',
                card_name:'',                       //身份证姓名 card_name*
                card_no:''	,                       //身份证号码 card_no*
                card_address:'',                    //身份证上的地址 card_address
                card_star_date:'',                  //身份证有效期开始时间 card_star_date
                card_end_date:'',                   //身份证有效期截止时间 card_end_date
                idcard_photo:'',                    //身份证正面照片url idcard_photo
                idcard_back_photo:'',               //身份证反面照片url idcard_back_photo
                bank_no:'',                         //银行卡号 bank_no*
                bank:'',                            //银行名称 bank
                bank_name:'',                       //获取分行时银行名称
                province:'',                        //开户行所在省 province
                city:'',                            //开户所在城市 city
                bank_sub:'',                        //开户行支行 bank_sub
                bank_mobile:'',                     //银行预留手机号 bank_mobile*
                bank_card_photo:'',                 //银行卡照片 bank_card_photo
                id_bank_card_photo:'',              //手持银行卡url id_bank_card_photo
                t:'',
                fname:'',
                bankId:'',                          //添加储蓄卡传参bankId
            },
            isDepositIdCard:false,              //正面身份证
            isDepositCard:false,       //烦面身份证
            slotProvince: [{
                flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center'
            }],
            slotCity: [{
                flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center'
            }],
            popupVisible:false,
            isFill:true,
            bankList:{
                bank_sub:'',
            },
            // 储蓄卡绑定失败提示信息
            MessageBox1:[
                '1、请确认卡片号码是否正确',
                '2、持卡人姓名是否为认证本人',
                '3、手机号与银行预留手机号是否一致',
                '4、开户行是否正确',
                '注：其它问题可联系客服帮助您',
            ],
            // 信用卡绑定失败提示信息
            MessageBox2:[
                '1、请确认卡片号码是否正确',
                '2、持卡人姓名是否为认证本人',
                '3、手机号与银行预留手机号是否一致',
                '注：其它问题可联系客服帮助您',
            ],
            isClearBank:false,
            fillList:{
                bank_no:'',                         //储蓄卡号
                bank:'',                            //银行
                bankName:'',                        //分行
                bank_mobile:'',                     //银行预留手机号 bank_mobile*
            },
            status:'',    //用户认证状态
            faceList:{    //face++请求回来的参数
                token:'',
                biz_no:''
            }
        }
    },
    created(){
        this.getUserData(this.usList);
        /*console.log('页面加载时:', this.usList);*/
         this.usList.t =  Math.floor((new Date()).valueOf()/1000);  //获取当前时间戳
        /*加载个人资料数据*/
        getPersonalData(this.usList).then(data => {
            if(data.result.code == 10000){
                this.status = data.data.status;
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
            this.usList.card_name= this.$route.query.card_name;
            this.usList.card_no = this.$route.query.card_no;

            this.usList.card_address = this.$route.query.card_address;
            this.usList.card_star_date = this.$route.query.card_star_date;
            this.usList.card_end_date = this.$route.query.card_end_date;
            this.usList.idcard_photo = this.$route.query.idcard_photo;
            this.usList.idcard_back_photo = this.$route.query.idcard_back_photo;
            this.usList.fname = this.$route.query.fname;
        },
        toHelp(){
            this.$router.push({ path: '/helpCenter' })
        },
        /*base64转blob*/
        dataURLtoBlob(dataurl) {
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
        /*储蓄卡*/
        depositCard(e){
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
                param.append('uptype',6);//6:储蓄卡
                param.append('mid',11);//通过append向form对象添加数据
                param.append('type','image');//通过append向form对象添加数据
                Toast({ message: '正在上传，请稍后', duration: 500});
                axios.post('https://main.kamicard.com/api.php/file/upload',param,config).then(data=>{
                   if(data.data.result.code == 10000) {
                        Toast({ message: data.data.result.msg, duration: 1500});
                        /*console.log(data.data.data.number);*/
                        this.usList.bank_card_photo = decodeURIComponent(data.data.data.url);
                        this.isDepositCard=true;
                        this.usList.bank_no = data.data.data.number;
                        this.usList.bank_no = this.usList.bank_no.replace(/\s|\xA0/g,"");
                        this.fillList.bank_no = this.usList.bank_no.replace(/\s|\xA0/g,"");
                        /*获取储蓄卡银行名*/
                        getDepositCardBank(this.usList).then(data => {
                            if(data.result.code == 10000){
                                for(var i = 0;i<data.data.length;i++){
                                    if(this.usList.bank_no.substring(0,11).indexOf(data.data[i].ka_bin)!=-1){
                                        /*console.log(' data.data[i]:',  data.data[i]);*/
                                        this.usList.bank = data.data[i].bank;
                                        this.fillList.bank = data.data[i].bank;
                                        this.usList.bank_name = data.data[i].bank;
                                        this.usList.bankId = data.data[i].bankId;
                                        break;
                                    }
                                }
                            }else {
                              Toast({message:data.result.msg,duration: 500});
                            }
                          }).catch(err => {
                            Toast({message:err,duration: 500});
                          });
                    }else{
                         Toast({ message: data.data.result.msg, duration: 1500});
                    }
                }).catch(err => {
                   Toast({message:err,duration: 5000});
                });
                /*获取Face++传递过来的银行卡号*/
//                param.append('image',file);
//                param.append('api_key','x2WOuPBq7i_5tJSHJQei13jareJX62Cu');//通过append向form对象添加api_key
//                param.append('api_secret','_BAXUhnlEKOCy92K5Yjmd_ZSncebmd7t');//通过append向form对象添加api_secret
//                axios.post('https://api.megvii.com/faceid/v3/ocridcard',param,config).then(data=>{
////                    Toast({message:data,duration: 5000});
//                    this.usList.bank_card_photo = formatdata;
//                    this.isDepositCard=true;
//                    this.usList.bank_no = data.data.number;
//                    this.usList.bank_no = this.usList.bank_no.replace(/\s|\xA0/g,"");
//                    this.fillList.bank_no = this.usList.bank_no.replace(/\s|\xA0/g,"");
//                    /*获取储蓄卡银行名*/
//                    getDepositCardBank(this.usList).then(data => {
//                        if(data.result.code == 10000){
//                            for(var i = 0;i<data.data.length;i++){
//                                if(this.usList.bank_no.substring(0,11).indexOf(data.data[i].ka_bin)!=-1){
//                                    this.usList.bank = data.data[i].bank;
//                                    this.fillList.bank = data.data[i].bank;
//                                    this.usList.bank_name = data.data[i].bank;
//                                    break;
//                                }
//                            }
//                        }else {
//                          Toast({message:data.result.msg,duration: 500});
//                        }
//                      }).catch(err => {
//                        Toast({message:err,duration: 500});
//                      });
//                }).catch(err => {
//                   Toast({message:err,duration: 5000});
//                });
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
                    var size = this.dataURLtoBlob(formatdata,name).size;
                    var config = {
                      headers: { "Content-Type": "multipart/form-data" }
                    };
                    var param = new FormData()
                    param.append("file",this.dataURLtoBlob(formatdata),name);
                    param.append('accessToken',this.usList.accessToken);//通过append向form对象添加数据
                    param.append('usid',this.usList.usid);//通过append向form对象添加数据
                    param.append('mid',11);//通过append向form对象添加数据
                    param.append('type','image');//通过append向form对象添加数据
                    Toast({ message: '正在上传，请稍后', duration: 500});
                    axios.post('https://main.kamicard.com/api.php/file/upload',param,config)
                        .then(data=>{
                           if(data.data.result.code == 10000) {
                               this.usList.id_bank_card_photo=decodeURIComponent(data.data.data.url);
                               this.isDepositIdCard=true;
                               Toast({ message: data.data.result.msg, duration: 1000});
                            }else{
                               Toast({ message: data.data.result.msg, duration: 1000});
                            }
                   })
                  }
                };
                img.src = e1.target.result
              };
              data.readAsDataURL(file)
         },
        /*手动输入储蓄卡号*/
        fillCardId(){
            /*console.log(this.fillList.bank_no);*/
            /*获取储蓄卡银行名*/
            getDepositCardBank(this.usList).then(data => {
                if(data.result.code == 10000){
                    for(var i = 0;i<data.data.length;i++){
                        if(this.fillList.bank_no.substring(0,11).indexOf(data.data[i].ka_bin)!=-1){
                            /*console.log(' data.data[i]:',  data.data[i]);*/
                            this.usList.bank = data.data[i].bank;
                            this.fillList.bank = data.data[i].bank;
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
        },
        /*选择开户省市*/
        chooseSite(){
            this.popupVisible=true;
            /*获取省份信息*/
            getProvince(this.usList).then(data => {
                    if(data.result.code == 10000){
                        data.data.forEach((item, index) => {
                            this.slotProvince[0].values.push(item.province);
                        })
                    }else {
                      Toast({message:data.result.msg,duration: 1000});
                    }
              }).catch(err => {
                Toast({message:err,duration: 500});
              });

        },

        /*联动省份-城市*/
        onValuesChange(picker, values) {
          if (values[0]) {
              this.usList.province=values[0];
              /*联动获取城市*/
              getCity(this.usList).then(data => {
                        if(data.result.code == 10000){
                            data.data.forEach((item, index) => {
                                this.slotCity[0].values.push(item.city);
                            });
                        }else {
                          Toast({message:data.result.msg,duration: 1000});
                        }
                  }).catch(err => {
                    Toast({message:err,duration: 500});
                  });
              this.slotCity[0].values=[];
          }
        },
        onValuesChangeCity(picker, values) {
          if (values[0]) {
              this.usList.city=values[0];
          }
        },
        /*省份-城市 选择完成*/
        chooseProvinceCity(){
            /*this.debitCard.province=this.usList.province;
            this.debitCard.city=this.usList.city;*/
            this.popupVisible=false;
        },
        /*分行页面返回
        backToFill(){
            this.isFill=true;
        },*/
        /*去分行页面*/
        toFill(){
            /*console.log(this.usList);*/
            if(this.fillList.bank==""){
                Toast({message:'请先选择银行',duration: 1000});
            }else if(this.usList.province==''||this.usList.city==''){
                Toast({message:'请先选择开户省市',duration: 1000});
            }else{
                this.isFill=false;
                this.fillList.bankName='';
                this.isClearBank=false;
                /*获取分行*/
                getBank(this.usList).then(data => {
                    if(data.result.code == 10000){
                        this.bankList=data.data;
                    }else {
                      Toast({message:data.result.msg,duration: 1000});
                    }
                  }).catch(err => {
                    Toast({message:err,duration: 500});
                  });
            }
        },
        /*input变化*/
        inputBank(){
            getBank(this.usList).then(data => {
                    if(data.result.code == 10000){
                        this.bankList=data.data;
                        this.bankList.forEach((item, index) => {
//                 debugger
                    if(item.bank_sub.indexOf(this.$refs.bank_sub.value) == -1) {
                        item.bank_sub = '';
                    }else{
                        item.bank_sub = item.bank_sub;
                    }
                })
                    }else {
                      Toast({message:data.result.msg,duration: 1000});
                    }
                  }).catch(err => {
                    Toast({message:err,duration: 500});
                  });
            /*this.debitCard.bank_sub= this.$refs.bank_sub.value;*/
            /*Toast({message:this.$refs.bank_sub.value,duration: 2500});
            console.log(this.$refs.bank_sub.value);*/

            this.isClearBank=true;
            if(this.fillList.bankName==''){
                    getBank(this.usList).then(data => {
                    if(data.result.code == 10000){
                        this.bankList=data.data;
                    }else {
                        Toast({message:data.result.msg,duration: 1000});
                    }
                    }).catch(err => {
                    Toast({message:err,duration: 500});
                    });
               }
        },
        /*选择分行*/
        selectdBank(index){
            this.usList.bank_sub = this.bankList[index].bank_sub;
            this.fillList.bankName = this.bankList[index].bank_sub;
            this.isClearBank=true;
            this.isFill=true;
            /*console.log(this.debitCard.bank_sub);*/
        },
        /*清除搜索*/
        clearSearch(){
            this.$refs.bank_sub.value='';
            this.fillList.bankName='';
            getBank(this.usList).then(data => {
                if(data.result.code == 10000){
                    this.bankList=data.data;
                }else {
                  Toast({message:data.result.msg,duration: 500});
                }
              }).catch(err => {
                Toast({message:'err',duration: 500});
              });
        },
        /*下一步*/
        nextToAdd(){
            this.usList.bank_no= this.$refs.bank_no.value;
            this.usList.bank_mobile= this.$refs.bank_mobile.value;
            this.fillList.bank_mobile= this.$refs.bank_mobile.value;
            var reg=/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
            if(this.usList.bank_card_photo==''){
                Toast({message:'请添加储蓄卡正面',duration: 1000});
            }else if(this.usList.id_bank_card_photo==''){
                Toast({message:'请添加手持储蓄卡与身份证照片',duration: 1000});
            }else if(this.usList.bank_mobile==''){
                Toast({message:'请添加手机号',duration: 1000});
            }else if(!reg.test(this.usList.bank_mobile)){
                Toast({message:'请输入正确的手机号',duration: 1000});
            }else if(this.usList.province==''||this.usList.city==''){
                Toast({message:'请选择开户省市',duration: 1000});
            }else if(this.usList.bank_sub==''){
                Toast({message:'请选择分行',duration: 1000});
            }else{
                this.usList.t =  Math.floor((new Date()).valueOf()/1000);
                if(this.status!=1){  //除去认证成功
                    //四要素认证
                    getIdentity(this.usList).then(data => {
                        if(data.result.code == 10000){
                            Toast({message:data.result.msg,duration: 1000});
                            this.$router.push({
                                path: '/gatheringMine' ,
                                // query: {
                                //     accessToken:this.usList.accessToken,
                                //     usid:this.usList.usid,
                                // }
                            })
                             //四要素认证通过-请求对应Face++第一个接口
                            // postToGetFaceToken(this.usList).then(data => {
                            //     /*Toast({message:data.data.token,duration: 1000});*/
                            //     /*console.log('face++data.data:', data.data);*/
                            //     this.faceList.token = data.data.token;
                            //     this.faceList.biz_no = data.data.biz_no;
                            //     //存储biz_no到localStorage
                            //     localStorage.setItem('bizNoStorage', JSON.stringify(this.faceList.biz_no));
                            //     /*console.log('bizNoStorage:', bizNoStorage);*/
                            //     /*this.uslist.id= JSON.parse(localStorage.getItem('idStorage'));*/
                            //      window.location.href = 'https://api.megvii.com/faceid/lite/do?token=' + this.faceList.token;
                            //     /*if(data.result.code == 10000){
                            //         Toast({message:data.result.msg,duration: 1000});
                            //     }else{
                            //         Toast({message:data.result.msg,duration: 1000});
                            //     }*/
                            // }).catch(err => {
                            //     Toast({message:err,duration: 500});
                            // });
                        }else{
                            const html = `
                                    <div style="text-align:left;font-size:14px;line-height:1.5;">
                                    <p>1、请确认卡号与照片中保持一致</p><p>2、持卡人为认证本人</p><p>3、手机号与银行预留手机号一致</p><p>4、开户行正确</p>
                                    <p style='margin-top:10px;'>注：其它问题可点击右上角帮助</p>
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
                                <div style="text-align:left;font-size:14px; line-height:1.5;">
                                <p>1、请确认卡号与照片中保持一致</p><p>2、持卡人为认证本人</p><p>3、手机号与银行预留手机号一致</p><p>4、开户行正确</p>
                                <p style='margin-top:10px;'>注：其它问题可点击右上角帮助</p>
                                </div>
                            `                           
                        MessageBox({
                            title: '添加卡片出现问题了哟~',
                            message: html,
                            confirmButtonText: '我知道了',
                        });
                    });
                }else{
                    getAddtDepositCard(this.usList).then(data => {
                        if(data.result.code == 10000){
                            Toast({message:data.result.msg,duration: 1000});
                            this.$router.go(-1)
                        }else{
                          Toast({message:data.result.msg,duration: 1000});
                        }
                    }).catch(err => {
                        Toast({message:err,duration: 500});
                    });
                }
            }
        },
    },
   /* beforeEach(to, from, next) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      if (toDepth < fromDepth) {
        console.log('后退。。。')
        from.meta.keepAlive = false
        to.meta.keepAlive = true
      }
      next()
    }*/

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

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }
    .box{
        height: 100%;
    }
    .box input{
        font-size: 15px;
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
        width: 60%;
        float:right;
        color: #5F5F5F;
        height: 50px;
    }.box .connect img{
        width: 8px;
        margin-top: 18px;
        margin-left: 10px;
        float: right;
    }.box .connect input{
        text-align: right;
        caret-color: #7370FF;
        float: right;
        height: 50px;
        border: 0;
        width: 100%;
    }
    .box .next{
        width: 92%;
        height: 50px;
        background: linear-gradient(to right, #f3deab , #e6c489);
        margin:10% 4%;
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

    .slotCss{
        width: 50%;
        float: left;background-color: #F6F6F6;
    }
    .popupProvinceCity{
        float: left;
        width: 100%;
    }.popupProvinceCity .cancel{
        background-color: transparent;
        border: none;
        font-size: 18px;
        padding: 5px 20px;
        color: #7370FF;
        float: left;
    }
    .popupProvinceCity .sure{
        background-color: transparent;
        border: none;
        font-size: 18px;
        padding: 5px 20px;
        color: #7370FF;
        float: right;
    }

    .searchBank{
        background-color: #fff;
        height: 100%;
    }
    .searchInput{
        width: 88%;
        height: 30px;
        border-radius: 3px;
        border: 1px solid #ddd;
        padding-left: 7%;
        margin:5px 2.5%;
        background: url(../../assets/gatheringMine/search.png) no-repeat;
        background-size: 18px;
        background-position: 4px 6px;
        background-color: #fff;
        font-size: 16px;
    }
    .searchBank .closeSearch{
        position: absolute;
        top: 56px;
        right: 20px;
        width: 18px;
    }
    .searchBank li{
        width: 90%;
        margin: 0 5%;
        padding: 8px 0;
        border-bottom: 1px solid #f6f6f6;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
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
