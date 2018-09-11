// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'normalize.css';
import App from './App';
import router  from './router';
import oauthRouter from './router/oauthRouter';
import error from './router/error';
import store from './store';
import './common/element-ui';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if(store.state.login.role){ //判断role 是否存在
    if (store.state.login.newRouter.length !== 0) {
      next();
    } else {
      let newrouter;
      if (store.state.login.role === 'admin') {
        newrouter = oauthRouter;
      } else {
        let newchildren = oauthRouter[0].children.filter(route => {
          if (route.meta) {
            if (route.meta.role.indexOf(store.state.login.role) > 0) {
              return true
            }
            return false
          }else{
            return true
          }
        });
        console.log(newchildren);
        newrouter = oauthRouter;
        newrouter[0].children = newchildren
      }
      router.addRoutes(newrouter.concat(error));
      store.dispatch('roles',newrouter).then(() => {
        next({ ...to })
      });
    }
  }else{
    if (['/login'].indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
