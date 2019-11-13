<!--gathering-->
<template>
  <div>
    <!--<nav class="navTitle"></nav>-->
    <!--未身份认证时显示引导-->
    <!-- <div class="newGuide" v-if="isGuide"> -->
        <!-- <div class="imgBG">
        </div> -->
        <!--<img src="../../assets/gatheringMine/guidepic.png">-->
        <!-- <div class="newGuide_content">
            <div class="torenzheng" @click="torenzheng()">
            </div>
            <div class="quxiao" @click="newGuideTo()">
            </div>
        </div> -->
        <!-- <img src="http://download.pcuion.com/credit_h5/rz3.png"> -->
    <!-- </div> -->
    <div class="newGuide" @click="newGuideTo()" v-if="isGuide">
        <img src="http://download.pcuion.com/credit_h5/rz3.png">
        <!-- <img src="../../assets/gatheringMine/guidePic.png"> -->
        <div class="newGuide_content">
            <div class="torenzheng" @click="torenzheng()"></div>
            <div class="quxiao" @click="newGuideTo()"></div>
        </div>
    </div>
    <!--未身份认证时显示引导-->
    <div class="checkHint" @click="checkHintTo()" v-if="isCheck">
        <!--<img src="../../assets/gatheringMine/checkLoading.gif">-->
        <img src="http://download.kamicredit.com/credit_h5/checkLoading.1b92f5b.gif">
    </div>
    <!--取现-->
    <div class="gatheringBox" v-if="gatherChange">
        <!--<nav class="navTitle">取现</nav>-->
        <div class="showMoney">
            <div class="showMoneyConnect">
                <div class="showMoneyTitle">取现金额（元）</div>
                <div class="moneyNumber">
                    <a>￥</a>
                    <input placeholder="0.00" type="number" @input="oninput" ref="amount">
                </div>
                <div class="moneyHint">
                    <span style="float: left;line-height: 14px;">
                        费率{{gallerySelected.calcRateSelected}}%+{{gallerySelected.cashSelected}}元 <span style="color: #bdbdbd">{{gallerySelected.calcRateSelected < 0.4 ? '&nbsp;(单笔最高999元)' : '(单笔2万)'}}</span>
                    </span>
                    <img class="yiwen" src="../../assets/gatheringMine/bangzhu-weidianji@3x.png" @click="isBank=true">
                    <span @click="userClick=true">更换费率</span>
                    <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreIcon">
                </div>
            </div>
        </div>
        <div class="showCardConnect">
            <ul>
                <li @click="addCreditCardBtn(0)">
                    <span class="cardTitle">取现信用卡</span>
                    <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                    <span class="cardName">{{creditCardSelected.bank_name}}&nbsp;{{creditCardSelected.bank_no}}</span>
                    <img :src="creditCardSelected.bankLogo" class="bankLogo">
                </li>
                <li @click="addDepositCardBtn(0)" >
                    <span class="cardTitle">到账储蓄卡</span>
                    <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                    <span class="cardName">{{depositCardSelected.bankname}}&nbsp;{{depositCardSelected.bank_no}}</span>
                    <img :src="depositCardSelected.bankLogo" class="bankLogo">
                </li>
            </ul>
        </div>
        <!--<router-link :to="{path: '/thirdUrl'}" style="display:inline-block;width:100%">
              <button class="next" @click="">立即取现</button>
        </router-link>-->
        <button class="next" @click="toEnchashment">立即取现</button>
        <div class="safeTitle">银联认证，安全保障</div>

         <!--弹出？银行-->
    <div class="bankSupport" v-if="isBank">
        <div class="bankSupportConnent">
            <div class="bankSupportText">
                <!--{{gallerySelected.tdDescription}}-->
                <div class="bankTitle">当前收款方式支持的银行</div>
                <ul>
                    <li v-for="(item,index) in gallerySelected.tdDescription" style="text-align:center;color:#5F5F5F;font-size:15px;" :key="index">
                        {{item | clear}}</li>
                </ul>
            </div>
            <div class="bankSupportbtn" @click="isBank=false">确认</div>
        </div>

    </div>

    <!--选择收款方式-->
    <section class="paymentTerm" @click="userClick=false" v-if="userClick">
        <div class="chooseGallery">
            <div @click.stop="userClick=true" class="chooseTitle">
                选择取现费率
                <img src="../../assets/gatheringMine/guanbi@3x.png" @click.stop="userClick=false">
            </div>
            <ul>
                <li class="chooseConnent" style="margin-bottom: 1px;" v-for="(item,index) in galleryList" :key="index" @click="selectChannel(index)">
                    <span>费率{{item.calc_rate}}%+{{item.cash}}元 <span style="color: #bbb">&nbsp;{{item.calc_rate < 0.4 ? '(单笔最高999元)' : '(单笔2万)'}}</span></span>
                    <span :class="(item.name == ''||item.name == undefined) ? 'noClass' : 'discounts'">
                        <span class="discountsConnent">
                            {{item.name}}
                        </span>
                    </span>
                    <img src="../../assets/gatheringMine/xuanzhong@2x.png" :class="resultNum === index?'selectedPic':'noSelectedPic'">
                </li>
            </ul>
        </div>
    </section>

    <!--选择信用卡-->
    <mt-popup position="bottom" v-model="isAddCreditCard" style="background-color: #fff;">
            <div class="chooseTitle">
                选择信用卡
                <img src="../../assets/gatheringMine/guanbi@3x.png" @click.stop="isAddCreditCard=false">
            </div>
            <ul style="max-height:255px;overflow:auto;background-color: #fff;">
                <li class="chooseConnent" v-for="(item,index) in creditCardList" :key="index" @click="selectdCreditCard(index)"
                    v-if="isCreditCard">
                    <img :src="item.logoUrl" class="bankPic">
                    <span class="bankDetail">{{item.bank_name}}&nbsp;{{item.bank_no | interceptNum}}</span>
                    <img src="../../assets/gatheringMine/xuanzhong@2x.png" :class="creditCardNum === index?'selectedPic':'noSelectedPic'">
                </li>
                <li class="chooseConnent addNew" @click="addCreditCardBtn(1)">添加新的信用卡</li>
            </ul>
    </mt-popup>

    <!--选择储蓄卡-->
    <mt-popup position="bottom" v-model="isAddDepositCard" style="background-color: #fff;">
            <div class="chooseTitle">
                选择储蓄卡
                <img src="../../assets/gatheringMine/guanbi@3x.png" @click.stop="isAddDepositCard=false">
            </div>
            <ul style="max-height:255px;overflow:auto;background-color: #fff;">
                <li class="chooseConnent" v-for="(item,index) in depositCardList" :key="index"  @click="selectdDepositCard(index)"
                     v-if="isDepositCard">
                    <img :src="item.logoUrl" class="bankPic">
                    <span class="bankDetail">{{item.bankname}}&nbsp;{{item.bank_no | interceptNum}}</span>
                    <img src="../../assets/gatheringMine/xuanzhong@2x.png" :class="depositCardNum === index?'selectedPic':'noSelectedPic'">
                </li>
                <li class="chooseConnent addNew" @click="addDepositCardBtn(1)">添加新的储蓄卡</li>
            </ul>
    </mt-popup>
    </div>
    <!-- 办卡 iframe 中的 外部链接 被源网站设置不可被引用 无法解决 -->
    <!-- <div v-if="bankChange">
         <iframe id="mainIframe" name="mainIframe" :width="clientWidth" :height="clientHeight" src="http://page.kamicard.com/index?utm_source=km&type=km&isKami=0" frameborder="0" scrolling="no"></iframe>
    </div> -->
    <!--我的-->
    <div class="mineBox" v-if="mineChange">
        <div class="personDataBox">
            <ul>
                <!--跳转个人资料-->
                <router-link :to="{path: '/mine', query: {accessToken:this.usList.accessToken,usid:this.usList.usid}}" style="display:inline-block;width:85%">
                    <!--headImage:this.dataList.headImage,nickname:this.dataList.nickname,mobile:this.dataList.mobile,accessToken:this.usList.accessToken,usid:this.usList.usid-->
                    <li class="headpic">
                        <img :src="decodeURIComponent(this.dataList.headImage)" v-if="isPic">
                    </li>
                    <li class="personData">
                        <p class="personName">{{dataList.nickname}}</p>
                        <div class="vipBox"><img src="../../assets/gatheringMine/huiyuan@3x.png"><p class="personVip">{{dataList.level}}</p></div>
                    </li>
                </router-link>
                <!--身份认证-->
                <!--<router-link :to="{path: '/enchashmentFlow', query: {accessToken:this.usList.accessToken,usid:this.usList.usid}}" style="display:inline-block;width:15%">-->
                <li @click="toAuthentication()">
                    <div class="rzBox">
                    <img :src="this.rzPic">
                    <p class="rzText">{{dataList.status}}</p>
                    </div>
                </li>
                <!--</router-link>-->
                <!--<li class="shareTo">已邀请{{dataList.recommended}}人，还差{{dataList.recommended1}}人升级</li>-->
            </ul>
        </div>
        <div class="cutRule"></div>
        <div class="mineConnect">
            <ul>
                <router-link :to="{path: '/enchashmentCardbag', query: {accessToken:this.usList.accessToken,usid:this.usList.usid}}" style="display:inline-block;width:100%">
                    <li>
                        <img src="../../assets/gatheringMine/kabao@3x.png" class="iconLeft">
                        <span class="cardTitle">取现卡包</span>
                        <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                        <span class="cardText">{{dataList.creditCardNum}}张信用卡，{{dataList.savingCardNum}}张储蓄卡</span>
                    </li>
                </router-link>
                <router-link :to="{path: '/gatheringRecord',query: {accessToken:this.usList.accessToken,usid:this.usList.usid}}" style="display:inline-block;width:100%">
                    <li>
                        <img src="../../assets/gatheringMine/jilu@3x.png" class="iconLeft">
                        <span class="cardTitle">收款记录</span>
                        <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                    </li>
                </router-link>
                <router-link :to="{path: '/intothegroup'}" style="display:inline-block;width:100%">
                    <li>
                    <img src="../../assets/gatheringMine/intoicon.png" class="iconLeft" style="width: 22px;margin-left: 13.5px;margin-right: 10px;margin-top: 16.5px;">
                    <span class="cardTitle">我要入群</span>
                    <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                    </li>
                </router-link>
                <router-link :to="{path: '/helpCenter'}" style="display:inline-block;width:100%">
                    <li>
                        <img src="../../assets/gatheringMine/shezhi.png" class="iconLeft" style="width: 22px;margin-left: 13.5px;margin-right: 10px;margin-top: 16.5px;">
                        <span class="cardTitle">帮助中心</span>
                        <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                    </li>
                </router-link>
                <div class="cutRule"></div>
                <a  :href="downloadHref" style="display:inline-block; width:100%;">
                    <li>
                        <img src="../../assets/gatheringMine/renwu_402x.png" class="iconLeft" style="width: 22px;margin-left: 13.5px;margin-right: 10px;margin-top: 16.5px;">
                        <span class="cardTitle">任务中心</span>
                        <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                        <span class="downloadHint">解锁领现金</span>
                    </li>
                </a>
                <a :href="downloadHref" style="display:inline-block;width:100%">
                    <li>
                        <img src="../../assets/gatheringMine/yaoqing@2x.png" class="iconLeft" style="width: 22px;margin-left: 13.5px;margin-right: 10px;margin-top: 16.5px;">
                        <span class="cardTitle">下载APP</span>
                        <img src="../../assets/gatheringMine/xuanze-@3x.png" class="moreRight">
                        <span class="downloadHint">领取100元活动红包~</span>
                    </li>
                </a>
                
              <div style="width: 100%; padding-bottom:200px; text-align: center; padding-top: 20px">
                <a :href="downloadHref">
                  <img src="../../assets/gatheringMine/mybanner.png" alt="" style="width: 90%">
                </a>
              </div>

            </ul>
        </div>
    </div>

    <!--底部tab-->
    <footer>
        <ul>
            <li @click="changeTogGathering()">
                <img :src="this.tabpic.gatheringsrc">
                <p :class="gatherChange==true?'footerSelectColor':'footerColor'">我要取现</p>
            </li>
            <li @click="changeToBanka()">
                <a href="http://page.kamicard.com/index?utm_source=km&type=km&isKami=0">
                    <img :src="this.tabpic.banksrc" >
                    <p :class="bankChange==true?'footerSelectColor':'footerColor'">办卡</p>
                </a>             
            </li>
            <li @click="changeToMine()">
                <img :src="this.tabpic.minesrc" >
                <p :class="mineChange==true?'footerSelectColor':'footerColor'">个人中心</p>
            </li>    
        </ul>
    </footer>
  </div>
</template>

<script>
import Qs from 'qs'
import axios from 'axios';
import vm from '../../main';
import md5 from 'js-md5';
import { Toast,Popup, MessageBox } from 'mint-ui';
import {getPersonalData,getGalleryList,getIdentity,getDepositCard,getCreditCard,getAddtDepositCard,postLiteWeb,postConfidenceCoefficient} from '../../requestAPI/requestAPI';

export default {
    data () {
        return {
            /*切换tab的图片*/
            tabpic:{
               gatheringsrc:require("../../assets/gatheringMine/shoukuan@3x.png"),
               banksrc:require("../../assets/gatheringMine/bankaNoactive.png"),
               minesrc:require("../../assets/gatheringMine/wode@3x.png"),
            },
            iframeState:false,
            goBackState:false,
            clientHeight: '',
            clientWidth: '',
            /*tab切换*/
            gatherChange:true,
            bankChange:false,
            mineChange:false,
            /*通道列表数据*/
            galleryList:{
                calc_rate:'',
                cash:'',
                name:'',
                tdDescription:'',
            },
            /*储蓄卡数据*/
            depositCardList:{
                bankname:'',
                bank_no:'',
            },
            /*加载信用卡数据*/
            creditCardList:{
                bank_name:'',
                bank_no:'',
            },
            /*个人资料数据*/
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
            },
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                type:3,
                os_type:'h5',
                "os":"3",
                t:'',
                biz_no:'',       //置信度所需用户流水号
            },
            rzPic:'',        //我的 认证图标
            isGuide:false,    //true:未认证时显示新手指引
            isCheck:false,    //true:待审核时显示指引
            isPic:false,     //头像
            userClick:false,  //更多收款方式
            galleryIndex:0,  //当前选择通道
            depositCardIndex:0,  //当前选择储蓄卡
            creditCardIndex:0,  //当前选择信用卡
            gallerySelected:{
                calcRateSelected:'',
                cashSelected:'',
            },
            /*被选择的储蓄卡相关信息*/
            depositCardSelected:{
                bankname:'添加储蓄卡',
                bank_no:'',
                bankLogo:require('../../assets/gatheringMine/tianjiahui.png'),
            },
            /*被选择的信用卡相关信息*/
            creditCardSelected:{
                bank_name:'添加信用卡',
                bank_no:'',
                bankLogo:require('../../assets/gatheringMine/tianjiahui.png'),
            },
            isBank:'',       //？支持银行
            isAddDepositCard:false,
            isAddCreditCard:false,
            isCreditCard:'',
            isDepositCard:'',
            liteList:{                  //Face++身份验证所需

            },
            apiUrlList:[],
            apiUrl:'',                  //通道列表返回的url--api
            enchashmentUrl:'',                  //取现跳转第三方url

            enchashmentList:{              //post取现所需参数
                amount:'',	                  //金额（*该参数单元为分，界面中的数值需要乘以100后传给服务器）
                paybanknum:'',	              //信用卡卡号
                banknumber:'',                //储蓄卡卡号
            },
            downloadHref:'',                //下载url

        }
    },
    created(){
        console.log(window.location.href)
      let that = this;
      let str = window.location.href.split('?')[1];
      let enstringStr = "";
      let enstring = "";
      let token = "";
      let usid = "";
      let s = "ilovekamicredit2018";

      if(str != undefined) {
        if(str.indexOf('token=') > -1){
          this.usList.accessToken = str.split('token=')[1].split('&')[0];
          token = this.getQueryString('token');
        }
        if(str.indexOf('usid=') > -1){
          this.usList.usid = str.split('usid=')[1].split('&')[0];
          usid = this.getQueryString('usid');
        }
        if(str.indexOf('enstring=') > -1){
          enstring = this.getQueryString('enstring');
        }

        if(enstring && token && usid) {
          enstringStr = s + token + usid + s;
          if(enstring == md5(enstringStr)){
            localStorage.setItem("tokenStorage", JSON.stringify(token));
            localStorage.setItem("idStorage", JSON.stringify(usid));
          }else {
            Toast({message: '请重新登录', duration: 1500});
            var timer = setTimeout(function(){
              that.$router.push({
                path: '/loginIndex'
              })
            },1000);
          }
        }else {
          Toast({message: '请重新登录', duration: 1500});
          var timer = setTimeout(function(){
            that.$router.push({
              path: '/loginIndex'
            })
          },1000);
        }
      }else {
        this.getIdToken();
      }
        this.usList.t =  Math.floor((new Date()).valueOf()/1000);  //获取当前时间戳
    },
    mounted() {
        // 设置iframe的宽高 根据设备适配
        // this.clientHeight =   `${document.documentElement.clientHeight}` - 50 + 'px'
        // this.clientWidth =   `${document.documentElement.clientWidth}` + 'px'
        // console.log(this.clientHeight)
        // console.log(this.clientWidth)

        // console.dir(window.frames["mainIframe"]) 
        // let obj=document.getElementById("mainIframe").contentWindow;  
        // let ifmObj=obj.document.getElementsByTagName("html");  
        // console.dir(ifmObj)
        // ifmObj.click(); 
        // document.getElementsByTagName
        // document.getElementByTagname("html").style.height = 100%
        // this.gatherChange=true
      /*加载个人资料数据*/
      getPersonalData(this.usList).then(data => {
          console.log(this.usList)
          console.log(data)
        if(data.result.code == 10000){
          this.dataList = data.data;
          this.isPic=true;
          //判断会员等级
          if(this.dataList.level==1){
            this.dataList.level='普通用户';
          }else if(this.dataList.level==2){
            this.dataList.level='黄金合伙人';
          }else if(this.dataList.level==3){
            this.dataList.level='白金合伙人';
          }else if(this.dataList.level==4){
            this.dataList.level='钻石合伙人';
          }
          //判断认证情况
          if(this.dataList.status==0){
            this.dataList.status='未认证';
            this.isGuide=true;
            this.rzPic=require("../../assets/gatheringMine/weirenzheng@3x.png");
          }else if(this.dataList.status==1){
            this.dataList.status='已通过';
            this.rzPic=require("../../assets/gatheringMine/yitongguo@3x.png");
          }else if(this.dataList.status==2){
            this.dataList.status='资料未完善';
            this.isGuide=true;
            this.rzPic=require("../../assets/gatheringMine/weirenzheng@3x.png");
          }else if(this.dataList.status==3){
            this.dataList.status='待审核';
            this.isGuide=true;
            this.rzPic=require("../../assets/gatheringMine/shenhezhong@3x.png");
            // this.isCheck=true;
            //                  /*提交置信度*/
            // postConfidenceCoefficient(this.usList).then(data => {
            //     console.log(this.usList)
            //   if(data.result.code == 10000){
            //     Toast({message: data.result.msg, duration: 1500});
            //     this.isCheck=false;
            //   }else {
            //     Toast({message: data.result.msg, duration: 1500});
                // this.isCheck=false;
            //     /*this.isGuide=true;*/
            //   }
            // }).catch(err => {
            //   Toast({message:err,duration: 500});
            // });
            localStorage.removeItem('bizNoStorage');
          }else if(this.dataList.status==4){
            this.dataList.status='审核不通过';
            this.isGuide=true;
            this.rzPic=require("../../assets/gatheringMine/weidtongguo@3x.png");
          }else if(this.dataList.status== -1){
            this.dataList.status='冻结';
            this.isGuide=true;
            this.rzPic=require("../../assets/gatheringMine/weidtongguo@3x.png");
          }
          //判断是否更改过头像
          if(this.dataList.headImage==''){
            this.dataList.headImage=require("../../assets/gatheringMine/morentouxiang@2x.png");
          }
        }else {
          Toast({message: data.result.msg, duration: 1500});
        }
      }).catch(err => {
        Toast({message:err,duration: 500});
      });

      /*加载通道列表数据*/
      getGalleryList(this.usList).then(data => {
        if(data.result.code == 10000){
          this.galleryList = data.data;
          this.galleryList.forEach((item, index) => {
                //    if(item.name.indexOf('秒到 有积分') > -1) {
                //        item.name = '秒到 有积分';
                //    }else if(item.name.indexOf('有积分') > -1) {
                //        item.name = '有积分';
                //    }else if(item.name.indexOf('秒到') > -1) {
                //        item.name = '秒到';
                //    }else {
                //        item.name = '';
                //    }
                //    item.tdDescription=item.tdDescription.replace(/\r\n/g,'');\
            item.name = item.name.split(",")[1];
            this.apiUrlList.push(item.url);
          })
          this.gallerySelected.calcRateSelected = this.galleryList[this.galleryIndex].calc_rate;
          this.gallerySelected.cashSelected = this.galleryList[this.galleryIndex].cash;
          this.gallerySelected.tdDescription = this.galleryList[this.galleryIndex].tdDescription.split('\r\n');
          this.apiUrl = this.galleryList[this.galleryIndex].url;
        }else {
          Toast({message: data.result.msg, duration: 1500});
        }
      }).catch(err => {
        Toast({message:err,duration: 500});
      });

      /*加载储蓄卡列表数据*/
      getDepositCard(this.usList).then(data => {
        if(data.result.code == 10000){
          this.depositCardList = data.data;
          if(this.depositCardList!=''){
            this.depositCardSelected.bankLogo=require('../../assets/gatheringMine/MORENYINHANG@2X.png');
            this.isDepositCard=true;
          }else{
            this.isDepositCard=false;
          };
          this.depositCardList.forEach((item, index) => {
            item.bankname=item.bankname.split("银行")[0]+'银行';
            /*item.bank_no=item.bank_no.slice(-4);*/
            if(item.logoUrl == null) {
              item.logoUrl = require('../../assets/gatheringMine/MORENYINHANG@2X.png');
            }
          })

          this.depositCardSelected.bankname = this.depositCardList[this.depositCardIndex].bankname;
          this.depositCardSelected.bank_no = this.depositCardList[this.depositCardIndex].bank_no.slice(-4);
          this.depositCardSelected.bankLogo = this.depositCardList[this.depositCardIndex].logoUrl;
          this.enchashmentList.banknumber = this.depositCardList[this.depositCardIndex].bank_no;

        }else {
          /*Toast({ message: data.result.msg, duration: 1500});*/
        }
      }).catch(err => {
        Toast({message:err,duration: 500});
      });

      /*加载信用卡列表数据*/
      getCreditCard(this.usList).then(data => {
        if(data.result.code == 10000){
          this.creditCardList = data.data;
          if(this.creditCardList!=''){
            this.creditCardSelected.bankLogo=require('../../assets/gatheringMine/MORENYINHANG@2X.png')
            this.isCreditCard=true;
          }else{
            this.isCreditCard=false;
          };
          this.creditCardList.forEach((item, index) => {
            item.bank_name=item.bank_name.split("银行")[0]+'银行';
            /*item.bank_no=item.bank_no.slice(-4);*/
            if(item.logoUrl == null) {
              item.logoUrl = require('../../assets/gatheringMine/MORENYINHANG@2X.png');
            }
          })
          this.creditCardSelected.bank_name = this.creditCardList[this.creditCardIndex].bank_name;
          this.creditCardSelected.bank_no = this.creditCardList[this.creditCardIndex].bank_no.slice(-4);
          this.creditCardSelected.bankLogo = this.creditCardList[this.creditCardIndex].logoUrl;
          this.enchashmentList.paybanknum = this.creditCardList[this.creditCardIndex].bank_no;

        }else {
          this.creditCardList='';
          /*Toast({ message: data.result.msg, duration: 1500});*/
        }
      }).catch(err => {
        Toast({message:err,duration: 500});
      });
      this.getutmSource()

    },
    methods:{
        // 跳转到认证页
        torenzheng(){
            this.$router.push({
                path: '/authentication',
            })
        },
        getQueryString(name){
            var url = decodeURI(location.search);
            var object = {};
            if(url.indexOf('?') != -1){
            var str = url.substr(1);
            var strs = str.split('&');
            for(var i=0;i<strs.length;i++){
                object[strs[i].split('=')[0]] = strs[i].split('=')[1];
            }
            }
            return object[name];
        },
        /*新手指引蒙层*/
        newGuideTo(){
            this.isGuide=false;

            // this.$router.push({
            //     path: '/authentication',
            //     /*query: {
            //                accessToken:this.usList.accessToken,
            //                usid:this.usList.usid,
            //            }*/
            // })
        },
        /*获取传过来的usid token*/
        getIdToken(){
            this.usList.usid = JSON.parse(localStorage.getItem('idStorage'));
            /*this.usList.accessToken = this.$route.query.accessToken;*/
            this.usList.accessToken = JSON.parse(localStorage.getItem('tokenStorage'));
            /*console.log(' this.usList.accessToken', this.usList.accessToken);*/
            this.usList.biz_no = JSON.parse(localStorage.getItem('bizNoStorage'));
           /* console.log(this.redisterList.accessToken);*/
          },
        /*切换tab收款*/
        changeTogGathering(){     
            this.tabpic.banksrc =require("../../assets/gatheringMine/bankaNoactive.png");
            this.tabpic.minesrc = require("../../assets/gatheringMine/wode@3x.png");
            this.tabpic.gatheringsrc =require("../../assets/gatheringMine/shoukuan@3x.png");
            this.gatherChange=true;
            this.bankChange=false;
            this.mineChange=false;
        },
        /*切换tab办卡*/
        changeToBanka(){
            // this.tabpic.minesrc = require("../../assets/gatheringMine/wode@3x.png");
            // this.tabpic.banksrc = require("../../assets/gatheringMine/bankaActive.png");
            // this.tabpic.gatheringsrc = require("../../assets/gatheringMine/shoukuanweidianji@3x.png");
            // this.gatherChange=false;
            // this.bankChange=true;
            // this.mineChange=false;
        }, 
        /*切换tab我的*/
        changeToMine(){
            this.tabpic.minesrc = require("../../assets/gatheringMine/wodedianji@3x.png");
            this.tabpic.banksrc = require("../../assets/gatheringMine/bankaNoactive.png");
            this.tabpic.gatheringsrc = require("../../assets/gatheringMine/shoukuanweidianji@3x.png");
            this.gatherChange=false;
            this.bankChange=false;
            this.mineChange=true;
        },
        /*选择收款方式*/
        selectChannel(index){
            this.galleryIndex = index;
            this.gallerySelected.calcRateSelected = this.galleryList[this.galleryIndex].calc_rate;
            this.gallerySelected.cashSelected = this.galleryList[this.galleryIndex].cash;
            this.gallerySelected.tdDescription = this.galleryList[this.galleryIndex].tdDescription.split('\r\n');
            this.apiUrl = this.galleryList[this.galleryIndex].url;
        },
        /*选择信用卡*/
        selectdCreditCard(index){
            this.creditCardIndex = index;
            this.creditCardSelected.bank_name = this.creditCardList[this.creditCardIndex].bank_name;
            this.creditCardSelected.bank_no = this.creditCardList[this.creditCardIndex].bank_no.slice(-4);
            this.creditCardSelected.bankLogo = this.creditCardList[this.creditCardIndex].logoUrl;
            this.enchashmentList.paybanknum = this.creditCardList[this.creditCardIndex].bank_no;
            this.isAddCreditCard=false;
        },
        /*选择储蓄卡*/
        selectdDepositCard(index){
            this.depositCardIndex = index;
            this.depositCardSelected.bankname = this.depositCardList[this.depositCardIndex].bankname;
            this.depositCardSelected.bank_no = this.depositCardList[this.depositCardIndex].bank_no.slice(-4);
            this.depositCardSelected.bankLogo = this.depositCardList[this.depositCardIndex].logoUrl;
            this.enchashmentList.banknumber = this.depositCardList[this.depositCardIndex].bank_no;
            this.isAddDepositCard=false;
        },
        /*添加储蓄卡*/
        addDepositCardBtn(num){
            // console.log(num)
            if(num){
                this.$router.push({
                    path: '/addDepositcard' ,
                    query: {
                        accessToken:this.usList.accessToken,
                        usid:this.usList.usid,
                    }
                }) 
            }else{
                // console.log(this.depositCardSelected.bank_no)
                if(this.depositCardSelected.bank_no!=''){
                    //  console.log('111')
                    this.isAddDepositCard=true            
                }else{
                    this.$router.push({
                        path: '/addDepositcard' ,
                        query: {
                            accessToken:this.usList.accessToken,
                            usid:this.usList.usid,
                        }
                    }) 
                }       
            }
             
        },
        /*添加信用卡*/
        addCreditCardBtn(num){
            if(num){
                this.$router.push({
                    path: '/addcreditcard' ,
                    query: {
                        accessToken:this.usList.accessToken,
                        usid:this.usList.usid,
                    }
                }) 
            } else {
                 // console.log(this.creditCardSelected.bank_no)
                if(this.creditCardSelected.bank_no!=''){
                    //  console.log('111')
                    this.isAddCreditCard=true                   
                }else{
                    this.$router.push({
                        path: '/addcreditcard' ,
                        query: {
                            accessToken:this.usList.accessToken,
                            usid:this.usList.usid,
                        }
                    }) 
                }             
            }          
        },
        /*除"已通过" 跳转身份验证*/
        toAuthentication(){
            if(this.dataList.status!="已通过"){
                this.$router.push({
                        path: '/authentication' ,
                        query: {
                            accessToken:this.usList.accessToken,
                            usid:this.usList.usid,
                        }
                    })
                }
        },
        /*立即取现btn*/
        toEnchashment(){

          // MessageBox({
          //   title: '温馨提示',
          //   message: '首次使用请先进行身份认证，绑定本人的储蓄卡和信用卡。',
          //   showCancelButton: false,
          // });
          console.log(this.dataList.status)
          if(this.dataList.status=='未认证'||this.dataList.status=='资料未完善'){
            MessageBox.alert('首次使用请先进行身份认证，绑定本人的储蓄卡和信用卡。').then(action => {
              this.$router.push({
                path: '/authentication',
                /*query: {
                        accessToken:this.usList.accessToken,
                        usid:this.usList.usid,
                    }*/
              })
            });
          }

            this.enchashmentList.amount = this.$refs.amount.value*100;
            if(this.creditCardList==''){
               Toast({ message: "请添加信用卡", duration: 1500});
            }else{
             axios.post(
                 this.apiUrl,
                 Qs.stringify({
                     accessToken:this.usList.accessToken,
                     mid:this.usList.mid,
                     usid:this.usList.usid,
                     amount:this.enchashmentList.amount,
                     paybanknum:this.enchashmentList.paybanknum,
                     banknumber:this.enchashmentList.banknumber,
                 })
             ).then(data=>{
                 if(data.data.result.code == 10000){
                    this.enchashmentUrl = encodeURI(data.data.data.code_url);
                     axios.post(
                         this.enchashmentUrl,
                         Qs.stringify({
                             accessToken:this.usList.accessToken,
                             mid:this.usList.mid,
                             usid:this.usList.usid,
                         })
                     ).then(data=>{
                         if(data.data.result.code == 10000){
                            window.location.href = data.data.data.code_url;

                        }else {
                          Toast({ message: data.data.result.msg, duration: 1500});
                        }
                     })
                }else {
                  Toast({ message: data.data.result.msg, duration: 1500});
                }
             })
                }
        },
        /*限制input只能输入小数点后两位*/
        oninput(e) {
            // 通过正则过滤小数点后两位
          e.target.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
        },
        /*拼接url*/
        getutmSource(){
            var channel = window.location.href;
            /*http://page.kamicredit.com/download/kami_downloadApp.html?utm_source='+channel*/
            if(channel.indexOf('utm_source=')>-1){
                var str= channel.split('utm_source=');
                var channelNum= str[1];
                /*console.log(channelNum);*/
              //http://page.kamicard.com/download/kami_downloadApp.html?utm_source=H5_appdownload
                this.downloadHref='http://page.kamicard.com/download/kami_downloadApp.html?utm_source='+channelNum;
                /*console.log(this.creditHref);*/
            }else{
                this.downloadHref='http://page.kamicard.com/download/kami_downloadApp.html?utm_source=H5_appdownload';
            }
        },

    },
    computed:{
        resultNum(){
          return this.galleryIndex;
        },
        depositCardNum(){
          return this.depositCardIndex;
        },
        creditCardNum(){
          return this.creditCardIndex;
        },
    },
    filters: {
        /*截取显示卡号后四位*/
        interceptNum: function (value) {
            return value.slice(-4);
        },
        clear: function (value) {
            return value.replace(/(^\s*)|(\s*$)/g, "");
        }
    },
    /*判断哪里来的页面显示对应tab*/
     beforeRouteEnter(to, from, next) {
          next(vm=>{ if(from.path=="/mine"||from.path=="/enchashmentCardbag"||from.path=="/helpCenter"||from.path=="/gatheringRecord"||from.path=="http://page.kamicard.com/index?utm_source=km&type=km&isKami=0"||from.path=="/authentication"){
                vm.tabChange=false;
                vm.tabpic.minesrc = require("../../assets/gatheringMine/wode@3x.png");
                // vm.tabpic.banksrc = require("../../assets/gatheringMine/bankaActive.png");
                vm.tabpic.gatheringsrc = require("../../assets/gatheringMine/shoukuan@3x.png");
              }else if(from.path=="/generalize"){
                window.location.reload()
              }
        });
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
        /* background: rgb(246, 246, 246); */
         text-decoration:none;
        /*background-color: #F6F6F6;*/
    }
    /*新手指引蒙层*/
    .newGuide{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        position: absolute;
        z-index: 10;
        /* position: relative; */
    }
    .newGuide img{
        width: 80%;
        margin-top: 10%;
        margin-left: 10%;
        z-index: 11;
    }
  
    .newGuide .newGuide_content{    
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 12;
    }
    .newGuide_content .torenzheng{  
        position: absolute; 
        top: 15%;
        left: 10%; 
        width: 80%;
        height: 62%;
        opacity: 0;
        z-index: 998;
    }
    .newGuide_content .quxiao{  
        position: absolute; 
        top: 2%;
        left: 10%; 
        width: 80%;
        height: 14%;
        opacity: 0;
        z-index: 998;
    }
    
    /*待审核蒙层*/
    .checkHint{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        position: absolute;
        z-index: 10;
    }
    .checkHint img{
        width: 40%;
        z-index: 11;
        margin-top: 50%;
        margin-left: 30%;
    }

    .gatheringBox {
        position: relative;
        /*background-color: #fff;*/
    }.gatheringBox .navTitle{
        width:100%;
        height: 43px;
        line-height: 43px;
        text-align: center;
        font-size: 18px;
        color: #363636;
        border-bottom: 1px solid #C9C9C9;
        background:#fff;
    }
    .gatheringBox .showMoney{
        width: 100%;
        /*height: 190px;*/
        background-color: #F6F6F6;
        float: left;
    }
    .gatheringBox .showMoney .showMoneyConnect{
        width: 90%;
        height: 162px;
        margin-left: 5%;
        margin-top: 4%;
        margin-bottom: 6%;
        background-color: #fff;
        float: left;
        border-radius: 10px;
        box-shadow:8px 2px 20px rgba(189,189,189,0.3);
    }
    .gatheringBox .showMoney .showMoneyConnect .showMoneyTitle{
        margin-top: 25px;
        height: 15px;
        line-height: 15px;
        margin-left: 5%;
        font-size: 15px;
        color: #6C6C6C;
    }
    .gatheringBox .showMoney .showMoneyConnect .moneyNumber{
        width: 90%;
        height: 60px;
        margin-top: 20px;
        margin-left: 5%;
        font-weight: bold;
        border-bottom: 1px solid #f6f6f6;
    }
    .gatheringBox .showMoney .showMoneyConnect .moneyNumber a{
        font-size: 21px;
        font-weight: normal;
    }
    .gatheringBox .showMoney .showMoneyConnect .moneyNumber input{
        width: 85%;
        color: #363636;
        font-size: 40px;
        line-height: 60px;
        border: none;
    }.gatheringBox .showMoney .showMoneyConnect .moneyNumber input::-webkit-input-placeholder{
        color:#363636;
    }
    .gatheringBox .showMoney .showMoneyConnect .moneyHint{
        width: 90%;
        height: 14px;
        margin: 15px 5%;
/*        margin-left: 5%;*/
        font-size: 12px;
        color: #6C6C6C;
        float: left;
    }.gatheringBox .showMoney .showMoneyConnect .moneyHint a{
        color: #ff7964;
    }.gatheringBox .showMoney .showMoneyConnect .yiwen{
        width: 14px;
        float: left;
        margin-left: 3px;
        margin-top: 1px;
    }.gatheringBox .showMoney .showMoneyConnect .moneyHint span:nth-child(3){
        float: right;
        color: #BDBDBD;
    }.gatheringBox .showMoney .showMoneyConnect .moreIcon{
      position: absolute;
      right: 0;
                          top: 136px;
        width: 6px;
        margin: 18px 25px 20px 10px;
    }
    .gatheringBox .showCardConnect{
        width: 100%;
        float: left;
        background-color: #fff;
    }.gatheringBox .showCardConnect li{
        width: 100%;
        height: 51px;
        /*line-height: 61px;*/
        float: left;
        border-bottom: 1px solid #f6f6f6;
    }.gatheringBox .showCardConnect li .cardTitle{
        height: 51px;
        line-height: 51px;
        font-size: 15px;
        color: #363636;
        margin-left: 4%;
        float: left;
    }.gatheringBox .showCardConnect li .moreRight{
        width: 8px;
        float: right;
        margin: 18px 20px 20px 10px;
    }.gatheringBox .showCardConnect li .cardName{
        /*width: 8px;*/
        float: right;
        height: 51px;
        line-height: 51px;
        color: #BDBDBD;
        font-size: 15px;
       /* background: url(../../assets/gatheringMine/tianjiahui.png) no-repeat;
        background-size: 17px;
        background-position: 0 17px;
        padding-left: 27px;*/
    }.gatheringBox .showCardConnect li .bankLogo{
        width: 17px;
        margin-top: 17px;
        margin-right: 8px;
        float: right;
    }.gatheringBox .next{
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
    }.gatheringBox .safeTitle{
        margin-top: 3%;
        font-size:12px;
        text-align: center;
        color: #BDBDBD;
    }


    .paymentTerm{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        background-color: rgba(0,0,0,0.7);
        z-index: 10;
    }
    .chooseGallery{
        width: 100%;
        background-color: #E9E9E9;
        position: fixed;
        bottom: 0;
        z-index: 10;
    }
    .chooseTitle{
        width: 100%;
        height: 51px;
        line-height: 51px;
        text-align: center;
        /*background: url(../../assets/gatheringMine/guanbi.png) no-repeat;
        background-position: top 18px right 15px;
        background-size: 15px;*/
        background-color: #f3f3f3;
        color: #363636;
        font-size: 19px;
    }
    .chooseTitle img{
        margin-top: 18px;
        margin-right: 15px;
        float: right;
        width: 15px;
    }
    .chooseGallery ul{
        width: 100%;
        max-height: 254px;
        float: left;
        overflow: auto;
        background-color: #fff;
    }
    .chooseConnent{
        width: 95%;
        height: 51px;
        line-height: 51px;
        background-color: #fff;
        border-bottom: 0.5px solid #e8e8e8;
        margin-bottom: 0.5px;
        padding-left: 5%;
        font-size: 14px;
        color: #5F5F5F;
        float: left;
    }
    .addNew{
        width: 100%;
        text-align: center;
        padding-left: 0;
        background: url(../../assets/gatheringMine/tianjia.png) no-repeat;
        background-size: 17px;
        background-position: 33% 18px;
        background-color: #fff;
        font-size: 14px;
        color: #5F5F5F;
        border: none;
    }
    .chooseConnent .bankPic{
        width: 20px;
        margin-top: 16px;
        margin-right: 10px;
        float: left;
    }
    .chooseConnent .bankDetail{
        float: left;
        font-size: 14px;
        color: #5F5F5F;
    }
    .selectedPic{
        width: 21px;
        margin-top: 15px;
        margin-right: 15px;
        float: right;
    }
    .noSelectedPic{
        display: none;
    }
    .chooseGallery li .discounts{
        font-size: 11px;
        color: #FF6147;
        padding: 1px;
        background: linear-gradient(to right, #FF8658 , #FF6146);
        border-radius: 14px;
        margin-left: 3%;
    }
    .chooseGallery li .discountsConnent {
        font-size: 11px;
        color: #FF6147;
        padding: 0 6px;
        border-radius: 14px;
        background-color: #fff;
    }
    .noClass{

    }

    .bankSupport{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        background-color: rgba(0,0,0,0.7);
        z-index: 10;
    }
    .bankSupport .bankSupportConnent{
        width: 80%;
        margin-left: 10%;
        position: absolute;
        top: 10%;
        background-color: #fff;
        border-radius: 15px;
    }
    .bankSupport .bankSupportConnent .bankSupportText{
        padding:5%;
        float: left;
        overflow: auto;
        max-height: 300px;
        width: 90%;
    }
    .bankSupport .bankSupportConnent .bankSupportText .bankTitle{
        text-align: center;
        color: #363636;
        font-size: 18px;
        margin-top: 15px;
        margin-bottom: 20px;
    }
    .bankSupport .bankSupportConnent .bankSupportbtn{
        padding:5% 10%;
        width: 80%;
        float: left;
        text-align: center;
        border-top: 1px solid #dbdbdb;
        color: #7370FF;
    }
    .mint-popup{
        width: 100%;
    }
    /*我的*/
    .mineBox{
/*        display: none;*/
            width: 100%;
    }
    .mineBox .personDataBox{
        margin: 20px 0;
    }
    .mineBox .personDataBox .headpic{
        /*width: 100px;
        height: 100px;
        border-radius: 50px;*/
        float: left;
        width: 56px;
        height: 56px;
        margin:0 15px;
        border: 0;
    }
    .mineBox .personDataBox .headpic img{
        width:56px;
        height: 56px;
        border-radius: 28px;
        border: 0;
    }

    .mineBox .personData{
        /*width: 75%;*/
        float: left;
        position: relative;
    }
    .mineBox .personData .personName{
        width: 75%;
        color: #363636;
        height: 18px;
        margin-top: 5px;
        float: left;
    }
    .mineBox .personData .vipBox{
        width: 100px;
        height: 20px;
        line-height: 20px;
        background-color: rgba(255,250,274,0.3);
        border-radius: 10px;
        /*opacity: 0.33;*/
        margin-top: 10px;
        float: left;
    }
    .mineBox .personData .personVip{
        font-size: 12px;
        color: #DCB496;
        float: left;
    }
    .mineBox .personData .vipBox img{
        width: 17px;
        float: left;
        margin: 3px 2px 2px 5px;
    }
    .mineBox .rzBox{
        width: 75px;
        height: 30x;
        position: absolute;
        right: 0px;
        top: 15px;
        background-color: #fff9f5;
        border-radius: 17px 0 0 17px;
    }
    .mineBox .rzBox img{
        width: 12px;
        float: left;
        margin: 3px 3px 3px 20px;
    }
    .mineBox .rzBox .rzText{
        font-size: 12px;
        color: #dcb496;
        float: left;
    }

    .personDataBox .shareTo{
        width: 80%;
        height: 33px;
        line-height: 33px;
        float: left;
        margin: 20px 4%;
        color: #6C6C6C;
        font-size: 12px;
        background: url(../../assets/gatheringMine/yaoqing@3x.png) no-repeat;
        background-size: 16px;
        background-position: 16px;
        padding-left:12%;
        background-color: #f6f6f6;
        border-radius: 16px;
    }
    /*.personDataBox .shareTo img{
        width: 16px;
        padding-top: 11px;
        margin-left: 19px;
        margin-right: 10px;
    }*/

    .cutRule{
        height: 10px;
        width: 100%;
        background-color: #f6f6f6;
        float: left;
    }

    .mineBox{
            float: left;
        background-color: #fff;
    }.mineConnect{
        width: 100%;
        float: left;
    }
    .mineConnect li{
        width: 100%;
        height: 55px;
        border-bottom: 1px solid #f6f6f6;
    }
    .mineConnect .iconLeft{
        width: 22px;
        margin-left: 15px;
        margin-top: 19px;
        margin-right: 8px;
        float: left;
    }
    .mineConnect .cardTitle{
        height: 55px;
        line-height: 55px;
        font-size: 15px;
        color: #363636;
        margin-left: 3px;
    }
    .mineConnect .cardText{
        height: 55px;
        line-height: 55px;
        font-size: 14px;
        color: #BDBDBD;
        float: right;
    }
    .mineConnect .downloadHint{
        height: 55px;
        line-height: 55px;
        font-size: 14px;
        color: #ff0000;
        float: right;
    }
    .mineConnect .moreRight{
        width: 6px;
        float: right;
        margin: 22px 20px 22px 10px;
    }

    footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 49.5px;
        border-top: 0.5px solid #d9d9d9;
        background-color: #fff;
    }
    footer li{
        width: 33.3%;
        float: left;
        text-align: center;
        padding: 8px 0 0;
    }
    footer li img{
        width: 22px;
    }
    footer li p{
        font-size: 12px;
    }
    .footerColor{
        color: #888;
    }
    .footerSelectColor{
        color: #b08c4d;
    }
    /* #show-iframe{
        width: 100%;
        height: 667px;
    } */
    /* #mainIframe{
        width: 100%;
        height: 100%; */
        /* position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0; */
    /* } */
</style>
