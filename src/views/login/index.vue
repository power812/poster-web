<template>
    <a-spin v-if="isLoading"></a-spin>
    <div class="login-page">
        <a-row>
            <a-col :span="12" class="aside">
                <div class="aside-inner">
                    <router-link to="/">
                        <img alt="power设计" src="../../assets/logo.png" class="logo-img" />
                    </router-link>
                    <h2>
                        心之所向，素履所往，
                        <br />
                        生如逆旅，一葦以航
                    </h2>
                    <span class="text-white-70">power, hope</span>
                </div>
            </a-col>
            <a-col :span="12" class="login-area">
                <a-form layout="vertical" :model="form" :rules="rules" ref="loginForm">
                    <h2>欢迎回来</h2>
                    <p class="subTitle">使用手机号码和验证码登录</p>
                    <a-form-item label="手机号码" required name="phoneNumber" v-bind="validateInfos.phoneNumber">
                        <a-input placeholder="手机号码" v-model:value="form.phoneNumber">
                            <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item label="验证码" required name="veriCode" v-bind="validateInfos.veriCode">
                        <a-input placeholder="四位验证码" v-model:value="form.veriCode">
                            <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" size="large" @click="login" :loading="userStore.loginButtonStatus">
                            登录
                        </a-button>
                        <a-button
                            :disabled="codeButtonDisabled"
                            size="large"
                            :style="{ marginLeft: '20px' }"
                            @click="sendVeriCode"
                        >
                            {{ counter === 60 ? '获取验证码' : `${counter}秒后重发` }}
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-col>
        </a-row>
    </div>
</template>
<script setup lang="ts">
import { Ref, reactive, ref, computed } from 'vue'
import { Rule } from 'ant-design-vue/es/form/interface'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { Form, message } from 'ant-design-vue'
import axios from 'axios'
import { useUserStore } from './../../store/user'
import { useGlobalStore } from './../../store/global'
import { useRouter } from 'vue-router'
const globalStore = useGlobalStore()
const isLoading = computed(() => globalStore.isLoading)
const router = useRouter()
const counter = ref(60)
const userStore = useUserStore()
const codeButtonDisabled = computed(() => {
    return !/^1[3-9]\d{9}$/.test(form.phoneNumber) || counter.value < 60
})
interface RuleFormInstance {
    validate: () => Promise<any>
}
const loginForm = ref() as Ref<RuleFormInstance>
const form = reactive({
    phoneNumber: '',
    veriCode: '',
})
const cellnumberValidator = (_rule: Rule, value: string) => {
    return new Promise((resolve, reject) => {
        if (!value) {
            reject('手机号码不能为空')
        }
        const passed = /^1[3-9]\d{9}$/.test(value.trim())
        setTimeout(() => {
            if (passed) {
                resolve('')
            } else {
                reject('手机号码格式不正确')
            }
        }, 500)
    })
}
const rules = reactive({
    phoneNumber: [
        // { required: true, message: '手机号码不能为空', trigger: 'blur' },
        // { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        { asyncValidator: cellnumberValidator, trigger: 'blur' },
    ],
    veriCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
})
const { validate, resetFields, validateInfos } = Form.useForm(form, rules)
let timer = 0
const startCounter = () => {
    if (counter.value < 60) return
    counter.value--
    timer = window.setInterval(() => {
        counter.value--
        if (counter.value <= 0) {
            clearInterval(timer)
            counter.value = 60
        }
    }, 1000)
}
// 发送验证码
const sendVeriCode = () => {
    startCounter()
    axios.post('/users/genVeriCode', { phoneNumber: form.phoneNumber }).then(() => {
        message.success('验证码已发送，请注意查收', 5)
        startCounter()
    })
}
// login

const login = async () => {
    const result = await validate()
    userStore.loginButtonStatus = true

    if (result) {
        await userStore.loginAndFetch(form)
        message.success('登录成功,2秒后跳转首页')
        router.push('/')
        resetFields()
    }
    userStore.loginButtonStatus = false
}
</script>
<style scoped lang="scss">
.logo-area {
    position: absolute;
    top: 30px;
    width: 150px;
}
.aside {
    height: 100vh;
    background-color: #1a1919;
    background-size: cover;
    background-repeat: no-repeat;
}
.aside .logo-img {
    width: 80px;
    margin-bottom: 20px;
}
.aside h2 {
    color: #cccccc;
    font-size: 29px;
}
.aside-inner {
    width: 60%;
    text-align: center;
}
.login-area {
    height: 100vh;
}
.login-area .ant-form {
    width: 350px;
}
.text-white-70 {
    color: #999;
    display: block;
    font-size: 19px;
}
.aside,
.login-area {
    display: flex !important;
    align-items: center;
    justify-content: center;
}
.login-area h2 {
    color: #333333;
    font-size: 29px;
}
.login-area .subTitle {
    color: #666666;
    font-size: 19px;
}
.login-area .ant-form-item-label {
    display: none;
}
.login-area .ant-input-prefix {
    left: auto;
    right: 30px;
    font-size: 19px;
}
.login-area .ant-input {
    font-size: 17px;
    padding: 20px 45px 20px 30px;
}
</style>
