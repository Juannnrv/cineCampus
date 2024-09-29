import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CreateAccount from '../views/CreateAccount.vue'
import Login from '../views/Login.vue'
import Cinema from '../views/Cinema.vue'
import Detail from '../views/Detail.vue'
import Seats from '../views/Seats.vue'
import Order from '../views/Order.vue'
import Ticket from '../views/Tickets.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/createAccount', component: CreateAccount },
    { path: '/login', component: Login },
    { path: '/cine', component: Cinema },
    { path: '/detail/:id', component: Detail },
    { path: '/seats/:id', component: Seats },
    { path: '/order/:movieId/:showId', component: Order },
    { path: '/ticket/:movieId/:showId/:movementId', component: Ticket },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router