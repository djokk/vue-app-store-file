import Vue from 'vue';
import Vuex from 'vuex';
// import products from '@/data/products';
import axios from "axios";
import { Promise } from 'core-js';
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
  },
  mutations: {
    upadeOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo
    },
    resetCart(state) {
      state.cartProducts = []
      state.cartProductsData = []
    },
    updatedCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((iTem) => iTem.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updatedUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updatedCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
      }))
    },
  },
  getters: {
    orderInfo(state) {
      return state.orderInfo
    },
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);

        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        }
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('upadeOrderInfo', response.data)
        })
    },
    loadCart(context) {
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updatedUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updatedCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
    },
    addProductToCart(context, { productId, amount }) {
      return (new Promise((resolve) => setTimeout(resolve, 2000)))
        .then(() => axios
          .post(`${API_BASE_URL}/api/baskets/products`, {
            productId: productId,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            context.commit('updatedCartProductsData', response.data.items);
            context.commit('syncCartProducts');
          }))
    },
    updatedCartProductAmount(context, { productId, amount }) {
      context.commit('updatedCartProductAmount', { productId, amount });

      if (amount < 1) {
        return;
      }

      axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          productId: productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updatedCartProductsData', response.data.items);
        })
        .catch(() => { context.commit('syncCartProducts'); })
    },
    deleteCartProduct(context, productId) {
      axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            productId,
          },
        })
        .then((response) => {
          // context.dispatch('loadCart');
          context.commit('updatedCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .catch(() => { context.commit('syncCartProducts'); })
    },
  },
});
