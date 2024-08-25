import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Providers',
      component: () => import(/* webpackChunkName:"alter" */ "@/components/AppProviders/AppProviders.vue"),
    }
  ]
})
