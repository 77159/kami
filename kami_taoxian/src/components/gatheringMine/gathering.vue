<!--gathering-->
<template>
  <div>
    <nav class="navTitle">取现</nav>
    
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
    /*data () {
        return {
            usertel:'',
            userpassword:'',
            wrapperHeight:0,
            
        }
    },*/
    mounted() {
         //动态计算页面高度
//      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        
    },
    /*methods:{
        next(){
            if(this.usertel==''||this.userpassword==''){
                Toast({ message: '手机号或验证码为空', duration: 1500});
            }
        },
        backHistory(){
            this.$router.go(-1)
        }
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
    footer{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 50px;
        border-top: 1px solid #C9C9C9;
    }
    footer li{
        width: 50%;
        float: left;
        text-align: center;
        padding: 8px 0 0;
    }
    footer li img{
        width: 22px;
    }
    footer li p{
        font-size: 12px;
        color: #666666;
    }
</style>