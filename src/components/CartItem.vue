<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" :alt="item.product.title" />
    </div>
    <!-- srcset="img/phone-square-3@2x.jpg 2x" -->
    <h3 class="product__title">{{ item.product.title }}</h3>
    <p class="product__info">Объем: <span>128GB</span></p>
    <span class="product__code">Артикул: {{ item.product.id }}</span>

    <div class="product__counter form__counter">
      <button
        type="button"
        aria-label="Убрать один товар"
        @click.prevent="minus(item.productId, item.amount)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count" />

      <button
        type="button"
        aria-label="Добавить один товар"
        @click.prevent="plus(item.productId, item.amount)"
      >
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.product.id)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
// import { mapMutations } from "vuex";

export default {
  filters: { numberFormat },
  props: ["item"],
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch("updatedCartProductAmount", {
          productId: this.item.productId,
          amount: value,
        });
      },
    },
  },
  methods: {
    // ...mapMutations({ deleteProduct: "deleteCartProduct" }),
    deleteProduct(id) {
      this.$store.dispatch("deleteCartProduct", id);
    },
    plus(productId, amount) {
      this.$store.dispatch("updatedCartProductAmount", {
        productId,
        amount: amount + 1,
      });
    },
    minus(productId, amount) {
      if (amount === 0) {
        this.$store.dispatch("updatedCartProductAmount", {
          productId,
          amount: 0,
        });
      } else {
        this.$store.dispatch("updatedCartProductAmount", {
          productId,
          amount: amount - 1,
        });
      }
    },
  },
};
</script>
