import Vue from 'vue'
import Router from 'vue-router'
import loginIndex from '@/components/loginIndex/loginIndex'
import findloginPassword from '@/components/loginIndex/findloginPassword'
import register from '@/components/loginIndex/register'
import userAgreement from '@/components/loginIndex/userAgreement'
import userPrivacy from '@/components/loginIndex/userPrivacy'
import gatheringMine from '@/components/gatheringMine/gatheringMine'
import mine from '@/components/gatheringMine/mine'
import gathering from '@/components/gatheringMine/gathering'
import enchashmentCardbag from '@/components/gatheringMine/enchashmentCardbag'
import addcreditcard from '@/components/gatheringMine/addcreditcard'
import addDepositcard from '@/components/gatheringMine/addDepositcard'
import helpCenter from '@/components/gatheringMine/helpCenter'
import gatheringRecord from '@/components/gatheringMine/gatheringRecord'
import authentication from '@/components/gatheringMine/authentication'
import intothegroup from '@/components/gatheringMine/intothegroup'


/*推广*/
import generalize from '@/components/generalize/generalize'
import generalize1 from '@/components/generalize/generalize1'
import lyingtomakemoney from '@/components/generalize/lyingtomakemoney'
import friendsdivision from '@/components/generalize/friendsdivision'


Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/loginIndex'
    },{
      path: '/loginIndex',
      component: loginIndex,
      meta:{
        title:'快捷取现'
      }
    },
      {
      path: '/findloginPassword',
      component: findloginPassword
    },
      {
      path: '/register',
      component: register,
      meta:{
        keepAlive: true,
        }
    },
      {
      path: '/userAgreement',
      component: userAgreement
    },
      {
      path: '/userPrivacy',
      component: userPrivacy
    },
      {
		path: "/gatheringMine",
        component: gatheringMine,
	},
      {
          path: '/mine',
          component: mine
    },
      {
          path: '/enchashmentCardbag',
          component: enchashmentCardbag
    },
      {
          path: '/addcreditcard',
          component: addcreditcard
    },
      {
          path: '/addDepositcard',
          component: addDepositcard,
          /*meta: {
            keepAlive: true,
          }*/
    },
      {
          path: '/helpCenter',
          component: helpCenter
    },
      {
          path: '/gatheringRecord',
          component: gatheringRecord
    },
      {
          path: '/authentication',
          component: authentication
    },
    {
      path: '/intothegroup',
      component: intothegroup
    },
    {
      path: '/generalize',
      component: generalize1,
      meta:{
       title:'快捷取现'
     }
      // {
      //     path: '/generalize',
      //     component: generalize,
      //     meta:{
      //      title:'快捷取现'
      //    }
    },
    {
      path: '/lyingtomakemoney',
      component: lyingtomakemoney,
      meta:{
        title:'躺着赚钱'
      }
    },
    {
      path: '/friendsdivision',
      component: friendsdivision,
      meta:{
        title:'好友分成奖励'
      }
    },


  ]
})
