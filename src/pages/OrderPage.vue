<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html">
            Корзина
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ products.length }} товара
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" title="ФИО" placeholder="Введите ваше полное имя" :error="formError.name"/>
            <BaseFormText v-model="formData.address" title="Адрес доставки" placeholder="Введите ваш адрес" :error="formError.address"/>
            <BaseFormText v-model="formData.phone" title="Телефон" placeholder="Введите ваш телефон" :error="formError.phone"/>
            <BaseFormText v-model="formData.email" title="Email" placeholder="Введите ваш Email" :error="formError.email"/>
            <BaseFormTextarea v-model="formData.comment" title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input v-model="delivery" class="options__radio sr-only" type="radio" name="delivery" value="0" checked="">
                  <span for="0" class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input v-model="delivery" class="options__radio sr-only" type="radio" name="delivery" value="500">
                  <span for="500" class="options__value">
                    Курьером <b>500 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input v-model="payment" class="options__radio sr-only" type="radio" name="pay" value="card">
                  <span for="card" class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input v-model="payment" class="options__radio sr-only" type="radio" name="pay" value="cash">
                  <span for="cash" class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li v-for="item in products" :key="item.productId" class="cart__order">
              <h3>{{ item.product.title }}</h3>
              <b>{{ item.product.price }} ₽</b>
              <span>Артикул: {{ item.productId }}</span>
            </li>
            <!-- <li class="cart__order">
              <h3>Гироскутер Razor Hovertrax 2.0ii</h3>
              <b>4 990 ₽</b>
              <span>Артикул: 150030</span>
            </li>
            <li class="cart__order">
              <h3>Электрический дрифт-карт Razor Lil’ Crazy</h3>
              <b>8 990 ₽</b>
              <span>Артикул: 150030</span>
            </li> -->
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: <b>{{ products.length }}</b> товара на сумму <b>{{ totalPrice }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div v-if="formErrorMessage" class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
    <Loading v-if="loading"/>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue'
import BaseFormTextarea from '@/components/BaseFormTextarea.vue'
import Loading from '@/components/Loading.vue'
import axios from "axios";
import { mapGetters } from "vuex";
import { API_BASE_URL } from '../config';

export default {
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      loading: false,
      delivery: '0',
      payment: 'card',
    }
  },
  components: {
    BaseFormText,
    BaseFormTextarea,
    Loading,
  },
  computed: {
    ...mapGetters({ products: "cartDetailProducts", totalPrice: "cartTotalPrice" }),
  },
  methods: {
    order() {
      this.formError = {}
      this.formErrorMessage = ''
      this.loading = true
      axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          this.$store.commit('resetCart')
          this.$store.commit('upadeOrderInfo', response.data)
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id } })
          this.loading = false
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.message
          this.loading = false
        })
    },
  },
}
</script>
