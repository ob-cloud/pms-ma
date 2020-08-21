import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login.html",
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
        path: 'home.html',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexHome.vue"),
      },
      {
        path: 'roomtype.html',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexRoomType.vue"),
      },
      {
        path: 'revenue.html',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexRevenue.vue"),
      },
      {
        path: 'indexOrderList.html',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexOrderList.vue"),
      },
      {
        path: 'me.html',
        component: () =>
          import(/* webpackChunkName: "pmsMa" */ "../views/indexMe.vue"),
      }
    ]
  },
  {
    path: "/setroomprice.html",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/setRoomPrice.vue")
  },
  {
    path: "/bookroomfolio.html",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/bookroomfolio.vue")
  },
  {
    path: "/addtrans.html",
    component: () =>
      import(/* webpackChunkName: "pmsMa" */ "../views/addtrans.vue")
  },
  {
    path: "*",
    redirect: "/login.html",
  }
];

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if(to.path === '/login.html'){
    next()
  } else {
    if(!localStorage.getItem('Login')) {
      next({
        path: '/login.html'
      })
    } else {
      next()
    }
  }
})

export default router;
