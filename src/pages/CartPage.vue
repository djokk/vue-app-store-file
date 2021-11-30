<template>
  <main class="content container">
    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.productId" :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat }} ₽</span>
          </p>

          <router-link v-if="products.length != 0" tag="button" :to="{name: 'order'}" class="cart__button button button--primery" type="submit">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import { mapGetters } from "vuex";
import CartItem from "@/components/CartItem.vue";

export default {
  data() {
    return {};
  },
  filters: { numberFormat },
  computed: {
    ...mapGetters({ products: "cartDetailProducts", totalPrice: "cartTotalPrice" }),
  },
  components: {
    CartItem,
  },
};
</script>
