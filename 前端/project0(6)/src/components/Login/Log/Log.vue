<template class="log0">
  <div class="container">
    <div class="form-box" ref="form_box">
      <!-- 注册 -->
      <div class="register-box hidden" ref="register_box">
        <h1>register</h1>
        <el-form
            ref="ruleFormRef"
            :model="registerAnswer"
            status-icon
            :rules="rules"
            style="width:70%;"
        >
          <el-form-item prop="name">
            <el-input type="text" v-model="registerAnswer.name" placeholder=用户名 autocomplete="off" />
          </el-form-item>
          <el-form-item prop="emailbox">
            <el-input type="email" v-model="registerAnswer.emailbox" placeholder=邮箱 autocomplete="off" />
          </el-form-item>
          <el-form-item  prop="password">
            <el-input type="password" v-model="registerAnswer.password" placeholder=密码 autocomplete="off" />
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input type="password" v-model.lazy="registerAnswer.repassword" placeholder=确认密码 autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div class="captcha">
          <input type="text" placeholder="验证码"><button ref="captchaButton" @click="capthaclick">{{captchaMessage.display}}</button>
        </div>

          <button @click="do_registerclick" style="margin-top: 15px">注册</button>
      </div>
      <!-- 登录 -->
      <div class="login-box" ref="login_box">
        <h1>login</h1>
        <input type="text" v-model="loginAnswer.name" placeholder="用户名">
        <input type="password" v-model="loginAnswer.password" placeholder="密码">
        <button @click="do_loginclick">登录</button>
      </div>
    </div>
    <div class="con-box left" ref="con_box_left">
      <h2>奥拉夫<span></span></h2>
      <p>知识图谱<span>自动构建</span>工具</p>
      <img src="../../../pictures/Login/Log/3.png" alt="">
      <p>已有账号</p>
      <button ref="login" @click="loginclick">去登录</button>
    </div>
    <div class="con-box right" ref="con_box_right">
      <h2>OLAF<span></span></h2>
      <p>Knowledge Graph <span>construction</span></p>
      <img src="../../../pictures/Login/Log/4.jpg" alt="">
      <p>没有账号？</p>
      <button ref="register" @click="registerclick">去注册</button>
    </div>
  </div>
</template>
// 要操作到的元素

<script setup>

import {computed, createApp, onMounted, reactive, ref, watch} from 'vue'
import Qs from 'qs'
import axios from 'axios'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRouter} from 'vue-router'
import {useProjectsStore} from '../../../stores/projects'
const projectsStore=useProjectsStore();
const login =ref(null);
const register=ref(null);
const form_box=ref(null);
const register_box=ref(null);
const login_box=ref(null);
const con_box_left=ref(null);
const con_box_right=ref(null);
const captchaButton=ref(null);
const register_log=ref(null);
const router=useRouter();
let timer=null;
let timer2=null;
let timer3=null;
let captchaTimer=null;
const captchaMessage=reactive({
  display:"发送验证码",
  mount:60,
  condition:true,
})
const registerAnswer=reactive({
  name:"",
  password:"",
  repassword:"",
  emailbox:"",
  captchaget:"",
  captchaanswer:"",
  submitemail:""

})
const loginAnswer=reactive({
  name:"",
  password:""
})
function do_loginclick(){
  if(loginAnswer.name==""){
    ElMessage({
      message: '请输入用户名',
      type: 'warning',
      center:true
    })
    return;
  }
  if(loginAnswer.password==""){
    ElMessage({
      message: '请输入密码',
      type: 'warning',
      center:true
    })
    return;
  }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    // 有域名后端写法：url:'https://doubi.com/api/books'
    url: '/path/user/login/',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: Qs.stringify({
      username:loginAnswer.name,
      pass:loginAnswer.password,
    }),
    // 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data=="True"){
      ElMessage({
        message: '登录成功！',
        type: 'success',
        center:true
      })
      router.push("/mainpage/project_management/?user="+loginAnswer.name);
    }
    else{
      ElMessage({
        message: '用户名或密码错误',
        type: 'error',
        center:true
      })
    }
  }).catch(err=>{
    console.log(err)
  })
}
const do_registerclick = () =>{
  if(registerAnswer.name===""){
    ElMessage({
      message: '请输入用户名',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.emailbox===""){
    ElMessage({
      message: '请输入邮箱',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.password===""){
    ElMessage({
      message: '请输入密码',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.repassword===""){
    ElMessage({
      message: '请确认密码',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.repassword!==registerAnswer.password){
    ElMessage({
      message: '两次密码不一致',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.captchaanswer!==registerAnswer.captchaget){
    ElMessage({
      message: '验证码不正确',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.emailbox!=registerAnswer.submitemail){
    ElMessage({
      message: '邮箱改变请重新获取验证码',
      type: 'warning',
      center:true
    })
    return;
  }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    // 有域名后端写法：url:'https://doubi.com/api/books'
    url: '/path/user/index/',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: Qs.stringify({
      username:registerAnswer.name,
      email:registerAnswer.emailbox,
      pass:registerAnswer.password,
    }),
    // 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data=="True"){
      ElMessage({
        message: '注册成功！',
        type: 'success',
        center:true
      })
      loginclick();
    }
    else{
      ElMessage({
        message: '用户名已存在！',
        type: 'warning',
        center:true
      })
    }
  }).catch(err=>{
    console.log(err)
  })
}
// 去注册按钮点击事件
function registerclick(){
  form_box.value.classList.add('mask');
  timer = setTimeout(() => {
    //需要定时执行的代码
    form_box.value.classList.remove('mask');
    con_box_right.value.classList.add('hidden2');
    clearTimeout(timer);
  }, 400);
  timer2 = setTimeout(() => {
    //需要定时执行的代码
    form_box.value.style.transform='translateX(80%)';
    login_box.value.classList.add('hidden');
    register_box.value.classList.remove('hidden');
    clearTimeout(timer2);
  }, 50);
  timer3 = setTimeout(() => {
    //需要定时执行的代码
    con_box_left.value.classList.remove('hidden2');
    clearTimeout(timer3);
  }, 100);

}
// 去登录按钮点击事件
function loginclick(){
  form_box.value.classList.add('mask');
  timer = setTimeout(() => {
    //需要定时执行的代码
    form_box.value.classList.remove('mask');
    con_box_left.value.classList.add('hidden2');
    clearTimeout(timer);
  }, 300);
  timer2 = setTimeout(() => {
    //需要定时执行的代码
    form_box.value.style.transform='translateX(0%)';
    register_box.value.classList.add('hidden');
    login_box.value.classList.remove('hidden');
    clearTimeout(timer2);
  }, 50);
  timer3 = setTimeout(() => {
    //需要定时执行的代码
    con_box_right.value.classList.remove('hidden2');
    clearTimeout(timer3);
  }, 250);
  resetForm();
}
function capthaclick(){
  if(registerAnswer.name===""){
    ElMessage({
      message: '请输入用户名',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.emailbox===""){
    ElMessage({
      message: '邮箱改变请重新获取验证码',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.password===""){
    ElMessage({
      message: '请输入密码',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.repassword===""){
    ElMessage({
      message: '请确认密码',
      type: 'warning',
      center:true
    })
    return;
  }
  if(registerAnswer.repassword!==registerAnswer.password){
    ElMessage({
      message: '两次密码不一致',
      type: 'warning',
      center:true
    })
    return;
  }
  if(captchaMessage.condition===true){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/user/captcha/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        email:registerAnswer.emailbox
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      console.log(res.data)
      registerAnswer.captchaget=res.data;
      registerAnswer.submitemail=registerAnswer.emailbox;
    }).catch(err=>{
      console.log(err)
    })
    captchaMessage.condition=false;
    captchaButton.value.classList.add('captchaSelected');
    captchaTimer = setInterval(()=>{
      captchaMessage.display=captchaMessage.mount+"s";
      captchaMessage.mount--;
      if (captchaMessage.mount <= 0) {
        captchaMessage.mount=60
        captchaMessage.condition = true;
        captchaMessage.display="发送验证码";
        captchaButton.value.classList.remove('captchaSelected');
        clearInterval(captchaTimer);
      }
    },1000)
  }
}
onMounted(()=>{
  con_box_left.value.classList.add('hidden2');
})


/*验证*/

const ruleFormRef = ref(null)

const checkname = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }else {
    callback()
  }
}
const checkEmail = (rule, value, callback) => {
  const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱格式'))
    }
  }, 100)
}

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerAnswer.repassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerAnswer.password) {
    callback(new Error("两次输入密码不一致"))
  } else {
    callback()
  }
}

const rules = reactive({
  name:[{ validator: checkname, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
  repassword: [{ validator: validatePass2, trigger: 'blur' }],
  emailbox: [{ validator: checkEmail, trigger: 'blur' }],
})
const resetForm = () => {
  ruleFormRef.value.resetFields();
}
</script>


<style scoped>
  @import './Log.css';
</style>