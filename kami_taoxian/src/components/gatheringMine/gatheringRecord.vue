<!--收款记录-->
<template>
<div>
    <div ref="wrapper" :style="{height: wrapperHeight + 'px'}">
        <nav class="navTitle"><img @click="backHistory()" src="../../assets/fanhui@2x.png">收款记录</nav>
        <div class="connect" v-if="isRecord">
             <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="bottomAllLoaded" :auto-fill="false" ref="loadmore" :bottomPullText='bottomText' :bottomDropText="bottomDropText" :distance-index="1.2">
            <ul>
                <li v-for="(item,index) in pageList" :key="index">
                    <span>{{item.money}}</span>
                    <span>{{item.paytime}}</span>
                </li>
            </ul>
            </mt-loadmore>
        </div>
        <div class="noRecord" v-if="!isRecord">
            <!--<img src="../../assets/gatheringMine/noRecord.png" style="width:100%;margin-bottom:10%;">-->
            <img src="../../assets/gatheringMine/noRecordPic.png">
            <p>没有可查看的记录哦~</p>
        </div>
    </div>
</div>
</template>

<script>
import { Toast ,Loadmore} from 'mint-ui';
import {getGatheringRecord} from '../../requestAPI/requestAPI';
export default {
    data () {
        return {
            pageList:{
                money:'',
                paytime:'',
            },
            usList:{
                usid:'',
                mid:11,
                accessToken:'',
                t:'',
                type:3,
                os_type:'h5',
                "os":"3",
                page:0,
            },
            bottomAllLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
            wrapperHeight: 0,
            bottomText: '上拉加载更多',
            bottomDropText: '释放更新',
            isRecord:'',          //true:有记录
            /*tabChange:true,*/
        }
    },
    created(){
        this.loadPageList();
    },
    mounted() {
         //动态计算页面高度
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;

    },
    methods:{
        backHistory(){
            this.$router.go(-1)
            /*this.$router.tabChange=false;*/
        },
        /*上拉刷新*/
        loadBottom() {
            this.loadPageList();
            // 固定方法，查询完要调用一次，用于重新定位
            this.allLoaded = true;// 若数据已全部获取完毕
            this.$refs.loadmore.onBottomLoaded();
            /*setTimeout(() => {
                    this.$refs.loadmore.onBottomLoaded();
                }, 1500);*/
        },
        loadPageList(){
            this.usList.t = Math.floor((new Date()).valueOf()/1000);  //获取当前时间戳
            this.usList.usid = this.$route.query.usid;
            this.usList.accessToken = this.$route.query.accessToken;
            this.usList.page = parseInt(this.usList.page) + 1;
            getGatheringRecord(this.usList).then(data => {
              if(data.result.code == 10000){
                this.pageList = data.data.list;
                if(data.data==undefined){
                    this.isRecord=false;
                }else{
                    this.isRecord=true;
                }
              }else if(data.result.code == 99996) {
                this.bottomText = '没有更多了';
                this.bottomDropText = '没有更多了';
              }
        }).catch(err => {
          /*Toast({message:err,duration: 500});*/
        });
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
    }.navTitle button:nth-child(1){   
        height: 43px;
        line-height: 43px;
        font-size: 18px;
        float: left;
        border: none;
        background-color: #fff;
        padding-left: 10px;
        color: #7B5CFF;
    }.navTitle button:nth-child(2){   
        height: 43px;
        line-height: 43px;
        font-size: 18px;
        float: right;
        border: none;
        background-color: #fff;
        padding-right: 10px;
        color: #7B5CFF;
    }
    
    .connect li{
        width: 65%;
        height: 73px;
        line-height: 73px;
        margin: 5%;
        border-radius: 10px;
        padding-left: 25%;
        background: url(../../assets/gatheringMine/gatheringicon.png) no-repeat;
        background-size: 37px;
        background-position: 8%;
        background-color: #fff;
        color: #5F5F5F;
        font-size: 15px;
    }
    .connect li span:nth-child(2){
        color: #9A9A9A;
        font-size: 11px;
        float: right;
        padding-right: 5%;
    }
    
    .noRecord{
        height: 100%;
        background-color: #fff;
        /*background: url(../../assets/gatheringMine/noRecord.png) no-repeat;
        background-size: 100% 100%;*/
    }
    .noRecord img{
        width:60%;
        margin-left: 23%;
        margin-top: 40%;
    }
    .noRecord p{
        width:100%;
        text-align: center;
        color: #bdbdbd;
    }
</style>