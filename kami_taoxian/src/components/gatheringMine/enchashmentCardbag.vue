<!--取现卡包-->
<template>
<div>
    <div class="box" >
        <nav class="navTitle">
            <img @click="backHistory()" src="../../assets/fanhui@2x.png">
            <span :class="{tab:isTabA}" @click="chooseCreditCard()">信用卡</span>
            <span :class="{tab:isTabB}" @click="chooseDepositCard()">储蓄卡</span>
        </nav>
        <div class="creditCard" v-if="appear">
            <ul>
                <li v-for="(item, index) in creditDataList" :key="index" @touchstart="touchStartList(index)" @touchmove="touchMoveList(index)" @touchend="touchEndList(index)" :class="nowIndex==index?'leftdistance':''"
                    @click="clicknow(index)">
                    <!--:class="disX > 0?'leftdistance':''"-->
                    <img :src="item.logoUrl" class="bankLogo">
                    <div class="bankDetail">
                        <p class="bankName">{{item.bank_name}}</p>
                        <p class="bankNum">{{item.bank_no | formatBankNo}}</p>
                    </div>
                   <div :class="nowIndex==index?'deleteList':'nodelete'" @click="deleteCreditCard(index)">删除</div>
                </li>
            </ul>
            <router-link :to="{path: '/addcreditcard',query: {usid:this.usList.usid,accessToken:this.usList.accessToken}}" style="display:inline-block;width: 100%;">
                <button class="addCreditCard"><p>添加信用卡</p></button>
            </router-link>
        </div>
        
        <div class="depositCard" v-if="!appear">
            <ul>
                <li v-for="(item, index) in depositDataList" :key="index" @touchstart="touchStartList(index)" @touchmove="touchMoveList(index)" @touchend="touchEndList(index)" :class="nowIndex==index?'leftdistance':''"
                    @click="clicknow(index)">
                    <img :src="item.logoUrl" class="bankLogo">
                    <div class="bankDetail">
                        <p class="bankName">{{item.bankname}}</p>
                        <p class="bankNum">{{item.bank_no | formatBankNo}}</p>
                    </div>
                <div :class="nowIndex==index?'deleteList':'nodelete'" @click="deleteDepositcard(index)">删除</div>
                </li>
            </ul>
            <router-link :to="{path: '/addDepositcard',query: {usid:this.usList.usid,accessToken:this.usList.accessToken}}" style="display:inline-block;width: 100%;">
                <button class="addDepositCard"><p>添加储蓄卡</p></button>
            </router-link>
        </div>        
    </div>
</div>
</template>

<script>
import vm from '../../main';
import { Toast } from 'mint-ui';
import {getCreditCard,getDepositCard,postDeltCreditCard,postDelDepositCard} from '../../requestAPI/requestAPI';
export default {
    data () {
        return {
            isTabA:true,
            isTabB:false,
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                id:'',                  // 删除信用卡id 
                cardInfoId:'',          // 删除储蓄卡id 

            },
//            dataList:{
//                bankName: '',//银行名称
//                bankNo: '',//银行卡号
//                bankUrl: ""//银行logo
//            },
            creditDataList:[],             //信用卡列表
            depositDataList:[],            //储蓄卡列表
            appear:true,
            startX: 0,       //触摸位置
            moveX: 0,       //滑动时的位置
            disX: 0,       //移动距离
            txtStyle: '',
            delWidth: 200,
            top: '',
            zIndex: 'z-index:-1',
            nowIndex:-1,
        }
    },
    created(){
        this.getUserData();
        //获取信用卡数据
      getCreditCard(this.usList).then(data => {
          /* console.log(this.dataList);*/
            if(data.result.code == 10000){
                this.creditDataList = data.data;
                this.creditDataList.forEach((item, index) => {
                    if(item.logoUrl == null) {
                        item.logoUrl = require('../../assets/gatheringMine/MORENYINHANG@2X.png');
                    }
                })
            }else {
              /*Toast({message:'正在加载中。。。',duration: 500});*/
            }
      }).catch(err => {
        Toast({message:'err。。。',duration: 500});
      });
        //获取储蓄卡数据
        getDepositCard(this.usList).then(data => {
            if(data.result.code == 10000){
                this.depositDataList = data.data;
                this.depositDataList.forEach((item, index) => {
                    if(item.logoUrl == null) {
                        item.logoUrl = require('../../assets/gatheringMine/MORENYINHANG@2X.png');
                    }
                })
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
        //tab切换
        chooseCreditCard(){
            this.isTabA=true;
            this.isTabB=false;
            this.appear=true;
            this.nowIndex=-1;
        },
        chooseDepositCard(){
            this.isTabB=true;
            this.isTabA=false;
            this.appear=false;
            this.nowIndex=-1;
        },
        getUserData(){
            this.usList.accessToken = this.$route.query.accessToken;
            this.usList.usid = this.$route.query.usid;
        },
        touchStartList(index,ev){
//            console.log(index);
            ev = ev || event;
            if(ev.touches.length == 1){
                // 手指按下的时候记录按下的位置
                this.startX = ev.touches[0].clientX;
            }
        },
        touchEndList(index,ev){
            ev = ev || event;
            if(ev.changedTouches.length == 1){
                // 手指按下的时候记录按下的位置
                var endX = ev.changedTouches[0].clientX;
            }
        },
        touchMoveList(index,ev){
            ev = ev || event;
                if(ev.touches.length == 1) {
                    // 滑动过程中的实时位置
                    this.moveX = ev.touches[0].clientX
                    // 滑动过程中实时计算滑动距离
                    this.disX = this.startX - this.moveX;
                    // console.log('disX==>',this.disX)
                    // 如果是向右滑动或者只是点击，不改变滑动位置
                    if(this.disX < 0 || this.disX == 0) {
                        /*this.txtStyle = "transform:translateX(0rem)";*/
                    }else if (this.disX > 0) {
                        this.nowIndex=index;
//如果是向左滑动，则实时给这个根元素一个向左的偏移-left，当偏移量到达固定值delWidth时，固定元素的偏移量为 delWidth
                        /*this.txtStyle = "transform:translateX(-" + this.disX/100 + "rem)";
                        if (this.disX >= this.delWidth/100) {
                            this.txtStyle = "transform:translateX(-" + this.delWidth/100 + "rem)";
                            this.zIndex = "z-index:" + 10 + "rem";
                        }*/
                    }
                }
        },
        /*点击取消删除状态*/
        clicknow(index){
            this.nowIndex=-1;
        },
        /*删除信用卡*/
        deleteCreditCard(index){
            this.usList.id=this.creditDataList[index].id;
            if(this.creditDataList.length>1){
                postDeltCreditCard(this.usList).then(data => {
                    if(data.result.code == 10000){
                       Toast({message:data.result.msg,duration: 1000});
                       this.$router.go(0)
                    }else {
                      Toast({message:data.result.msg,duration: 1000});
                    }
              }).catch(err => {
                Toast({message:err,duration: 500});
              });
            }else{
                Toast({message:"只有一张卡片时，不能接解除绑定哟~~",duration: 1000});
            }
            
        },
        /*删除储蓄卡*/
        deleteDepositcard(index){
            this.usList.cardInfoId=this.depositDataList[index].id;
            /*console.log(this.usList)*/
            if(this.depositDataList.length>1){
                 postDelDepositCard(this.usList).then(data => {
                        if(data.result.code == 10000){
                           Toast({message:data.result.msg,duration: 1000});
                           this.$router.go(0)
                        }else {
                          Toast({message:data.result.msg,duration: 1000});
                        }
                  }).catch(err => {
                    Toast({message:err,duration: 500});
                  });
            }else{
                Toast({message:"只有一张卡片时，不能接解除绑定哟~~",duration: 1000});
            }
            
        },
    },
    filters: {
      formatBankNo: function (value) {
        return "**** **** **** "+value.substr(-4)
      }
    },
    beforeRouteEnter(to, from, next) { 
          next(vm=>{
              if(from.path=="/addcreditcard"){
                vm.isTabA=true;
                vm.isTabB=false;
                vm.appear=true;
              }else if(from.path=="/addDepositcard"){
                vm.isTabA=false;
                vm.isTabB=true;
                vm.appear=false;
              }
        });
         
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
        height: 100%;
    }
    .left-delete{
        width:100%;
        height:100px;
        background-color: #111;
        position:relative;
        z-index:2;
    }
    .move{
        position: relative;
        background-color: #fff;
        width: 100%;
        height: 100%;
    }
    .deleteIcon{
        width: 2rem;
        height:100%;
        position: absolute;
        right:0;
        top:0;
        /*background:url(./../../assets/main/4.png) no-repeat;*/
        background-size: contain;
        background-color: #ff0000;
    }
    .navTitle{
        width:100%;    
        height: 43px;
        line-height: 43px;
        text-align: center;
        font-size: 18px;
        color: #888;
        border-bottom: 1px solid #C9C9C9;
        background:#fff;
    }
    .navTitle img{
        width: 12px;
        position: absolute;
        top: 10px;
        left: 5%;
    }
    .navTitle span:nth-child(2){
        display: inline-block;
        margin-right: 15px;
    }.navTitle span:nth-child(3){
        display: inline-block;
        margin-left: 15px;
    }
    .navTitle .tab{
        height: 42px;
        color: #b08c4d;
        border-bottom: 2px solid #b08c4d;
    }
    
    .creditCard li{
        width: 92%;
        height: 90px;
        background-color: #fff;
        margin: 4%;
        border-radius: 10px;
        box-shadow:8px 2px 20px rgba(189,189,189,0.3);
    }.creditCard .bankLogo{
        width: 26px;
        margin: 20px;
        float: left;
    }.creditCard .bankLogo{
        width: 26px;
        margin: 20px 15px auto 20px;
        float: left;
    }.creditCard .bankDetail{
        float: left;
    }
    .creditCard .bankName{
        width: 100%;
        color: #363636;
        font-size: 15px;
        margin-top: 20px;
        margin-bottom: 10px;
        float: left;
    }
    .creditCard .bankNum{
        color: #363636;
        font-size: 18px;
    }
    .creditCard .addCreditCard{
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
    .creditCard .addCreditCard p{
        display: inline-block;
        padding-left: 25px;
        background: url(../../assets/gatheringMine/tianjiabai-@3x.png) no-repeat;
        background-size: 17px;
        background-position: 0 3.5px;
    }
    .leftdistance{
/*        margin-left: -50px;*/
        transform: translateX(-20%);
        transition: 0.3s;
    }
    .deleteList{
        width: 20%;
        /* margin-left: 10px; */
        /*margin-right: -24%;*/
        /*transform: translateX(122%);*/
        position: absolute;
        right: -24%;
        float: right;
        line-height: 90px;
        text-align: center;
        color: #fff;
        background-color: #7370FF;
        transition: 0.3s;
    }
    .nodelete{
        /*opacity: 0;
         width: 20%;
        transform: translateX(122%);
        
        float: right;*/
        display: none;
        transition: 0.3s;
    }
    
    /*储蓄卡*/
    .depositCard li{
        width: 92%;
        height: 90px;
        background-color: #fff;
        margin: 4%;
        border-radius: 10px;
        box-shadow:8px 2px 20px rgba(189,189,189,0.3);
    }.depositCard .bankLogo{
        width: 26px;
        margin: 20px;
        float: left;
    }.depositCard .bankLogo{
        width: 26px;
        margin: 20px 15px auto 20px;
        float: left;
    }.depositCard .bankDetail{
        float: left;
    }
    .depositCard .bankName{
        width: 100%;
        color: #363636;
        font-size: 15px;
        margin-top: 20px;
        margin-bottom: 10px;
        float: left;
    }
    .depositCard .bankNum{
        color: #363636;
        font-size: 18px;
    }
    .depositCard .addDepositCard{
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
    .depositCard .addDepositCard p{
        display: inline-block;
        padding-left: 25px;
        background: url(../../assets/gatheringMine/tianjiabai-@3x.png) no-repeat;
        background-size: 17px;
        background-position: 0 3.5px;
    }
    
</style>