import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/login.vue")
  },
  {
    path: "/index",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/index.vue"),
    children: [
      {
        path: 'home',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexHome.vue"),
      },
      {
        path: 'roomtype',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexRoomType.vue"),
      },
      {
        path: 'revenue',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexRevenue.vue"),
      },
      {
        path: 'indexOrderList',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexOrderList.vue"),
      },
      {
        path: 'me',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexMe.vue"),
      }
    ]
  },
  {
    path: "/setroomprice",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/setRoomPrice.vue")
  },
  {
    path: "/bookroomfolio",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/bookroomfolio.vue")
  },
  {
    path: "/addtrans",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/addtrans.vue")
  },
  {
    path: "*",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/login.vue")
  }
];

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    next()
  } else {
    if(!localStorage.getItem('Login')) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

export default router;
