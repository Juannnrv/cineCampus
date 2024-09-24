import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CreateAccount from '../views/CreateAccount.vue'
import Login from '../views/Login.vue'
import Cine from '../views/Cinema.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/createAccount', component: CreateAccount },
    { path: '/login', component: Login },
    { path: '/cine', component: Cine },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router