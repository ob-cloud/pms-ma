import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login.vue")
  },
  {
    path: "/index",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/index.vue"),
    children: [
      {
        path: 'home',
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/indexHome.vue"),
      },
      {
        path: 'roomtype',
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/indexRoomType.vue"),
      },
      {
        path: 'revenue',
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/indexRevenue.vue"),
      },
      {
        path: 'indexOrderList',
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/indexOrderList.vue"),
      },
      {
        path: 'me',
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/indexMe.vue"),
      }
    ]
  },
  {
    path: "/setroomprice",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/setRoomPrice.vue")
  },
  {
    path: "/bookroomfolio",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/bookroomfolio.vue")
  },
  {
    path: "*",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
