<template style="display: flex;flex-direction: row;">
  <el-row >
  <div class="box"
       :style="{
          borderRadius: radius.type? `var(--el-border-radius-${radius.type})`: '',
          boxShadow: `var(${getCssVarName(shadow.type)})`,
          }"
       v-for="project in projectsStore.projects" :key="project.name"
       style="flex-direction: column;"
       ref="projectbox"
       >
    <div class="background"></div>
    <div style="margin: 15px; font-size:20px; font-weight:650;">{{ project.name }}</div>
    <div style="margin: 10px">
      <el-icon :size="20" color="#409EFC" style="margin: 0 13px" @click="select(project.index)"><Select /></el-icon>
      <el-icon :size="20" color="#409EFC" style="margin: 0 13px" @click="edit(project.index)"><Edit /></el-icon>
      <el-icon :size="20" color="#409EFC" style="margin: 0 13px" @click="delete0(project.index)"><Delete /></el-icon>
    </div>

  </div>
  <div class="box"
      :style="{
      borderRadius: radius.type? `var(--el-border-radius-${radius.type})`: '',
      boxShadow: `var(${getCssVarName(shadow.type)})`,
    }">
    <el-icon size="45px" @click="dialogFormVisible = true"><plus /></el-icon>
  </div>
  </el-row>
  <el-dialog v-model="dialogFormVisible" title="创建项目" style="width: 25%" @closed="close">
    <el-form :model="form">
      <el-form-item label="项目名称" :label-width="formLabelWidth" style="width: 80%" :required="true">
        <el-input v-model="form.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="图谱模型" :label-width="formLabelWidth" style="width: 50%" :required="true">
        <el-select v-model="form.module" placeholder="请选择模型" value="0">
          <el-option label="A模型" value=1 />
          <el-option label="B模型" value=2 />
          <el-option label="C模型" value=3 />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createcancel">取消</el-button>
        <el-button type="primary" @click="createconfirm">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" title="编辑项目" style="width: 25%" @closed="close">
    <el-form :model="form">
      <el-form-item label="项目名称" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="form.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="图谱模型" :label-width="formLabelWidth" style="width: 50%">
        <el-select v-model="form.module" placeholder="请选择模型" value="0">
          <el-option label="A模型" value=1 />
          <el-option label="B模型" value=2 />
          <el-option label="C模型" value=3 />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createcancel">取消</el-button>
        <el-button type="primary" @click="editconfirm">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, reactive, onUpdated, watchEffect, nextTick, toRaw, shallowReactive, onMounted, watch} from 'vue'
  import {
    Select,
    Edit,
    Plus,
    Delete
  } from "@element-plus/icons-vue";
  import {useProjectsStore} from '../../../stores/projects.js'
  import {ElMessage} from "element-plus";
  import axios from "axios";
  import Qs from "qs";
  import {useRoute} from "vue-router";
  const dialogFormVisible = ref(false)
  const dialogFormVisible2 = ref(false)
  function close() {form.name='';form.module=null; form.effective=false; form.index=-1;}
  const formLabelWidth = '70px'
  const pathuser=ref(useRoute().query.user);
  const editevidence = reactive({
    name:'',
    module: null as null | number
  });
  const projectsStore=useProjectsStore();
  const form = reactive({
    name: '',
    module: null as null | number,
    effective:false,
    index:-1
  });
  /*box的圆角和阴影设置*/
  const getCssVarName = (type: string) => {
    return `--el-box-shadow${type ? '-' : ''}${type}`
  }
  const shadow=ref({
    name: 'Lighter Shadow',
        type: 'lighter',
  },)
  const radius=ref({
    name: 'Large Radius',
    type: 'base',
  },)
  /*新建项目弹窗选项*/
  function createcancel(){
    dialogFormVisible.value = false;
    form.name ='';
    form.module=null;
  }
function createconfirm(){
  if(form.name==''){
    ElMessage.error('请输入完整项目名称');
    return;
  }
  if(form.module==null){
    ElMessage.error('请选择图谱模型');
    return;
  }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    // 有域名后端写法：url:'https://doubi.com/api/books'
    url: '/path/project/project_create/',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: Qs.stringify({
      user:pathuser.value,
      project_name:form.name,
      project_model:form.module
    }),
    // 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data=="True"){
      ElMessage({
        message: '创建成功！',
        type: 'success',
        center:true
      })
      dialogFormVisible.value = false;
      form.effective=true;
      projectsStore.pushProject(form.name,form.module as number);
      form.effective=false;
      form.name ='';
      form.module=null;
    }
    else{
      ElMessage({
        message: '项目名称已存在',
        type: 'warning',
        center:true
      })
    }
  }).catch(err=>{
    console.log(err)
  })
}
  const projectbox=ref<HTMLElement[]>([]);
  /*获取所有项目dom*/
  /*const boxes = ref<HTMLElement[]>([])*/
  /*三个按钮功能实现*/
/*  const projectbox = (el: any) => {
    boxes.value.push(el);
  }*/
  function select(index: number) {
    if (index != projectsStore.currentProject.index) {
      if (projectsStore.currentProject.index != -1) {
        projectbox.value[projectsStore.currentProject.index].classList.remove('selected');
      }
      projectbox.value[index].classList.add('selected');
      projectsStore.updateProject2(index);
    }
    else{
      projectbox.value[projectsStore.currentProject.index].classList.remove('selected');
      projectsStore.currentProject.index=-1;
      projectsStore.currentProject.name='';
      projectsStore.currentProject.module=null;
    }
  }
  function edit(index:number){
    editevidence.name=projectsStore.projects[index].name;
    editevidence.module=projectsStore.projects[index].module;
    form.name=projectsStore.projects[index].name;
    form.module=projectsStore.projects[index].module;
    form.index=index;
    dialogFormVisible2.value=true;
  }
  function editconfirm(){
    if(form.name==''){
      ElMessage.error('请输入完整项目名称');
      return;
    }
    if(form.module==null){
      ElMessage.error('请选择图谱模型');
      return;
    }
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/project_edit/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        user:pathuser.value,
        old_name:editevidence.name,
        old_model:editevidence.module,
        new_name:form.name,
        new_model:form.module
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
        if(res.data=="True")
        {
          dialogFormVisible2.value = false;
          form.effective=true;
          projectsStore.projects[form.index].name=form.name;
          projectsStore.projects[form.index].module=form.module;
          if(projectsStore.currentProject.index==form.index) {projectsStore.updateProject();}
          form.effective=false;
          form.name ='';
          form.module=null;
          form.index=-1;
          ElMessage({
            message: '编辑成功！',
            type: 'success',
            center:true
          })
        }
        else{
          dialogFormVisible2.value = false;
          form.effective=true;
          projectsStore.projects[form.index].name=form.name;
          projectsStore.projects[form.index].module=form.module;
          if(projectsStore.currentProject.index==form.index) {projectsStore.updateProject();}
          form.effective=false;
          form.name ='';
          form.module=null;
          form.index=-1;
          ElMessage({
            message: '网页的bug，重新登录可以解决（希望这个提示信息用不上）',
            type: 'warning',
            center:true
          })
        }
    }).catch(err=>{
      console.log(err)
    })
  }
  function delete0(index:number){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/project_delete/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        user:pathuser.value,
        name:projectsStore.projects[index].name
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      if(res.data=="True")
      {
        projectsStore.moveProject(index);
        ElMessage({
          message: '删除成功！',
          type: 'success',
          center:true
        })
      }
      else{
        ElMessage({
          message: '网页的bug，重新登录可以解决（希望这个提示信息用不上）',
          type: 'warning',
          center:true
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  /*页面切换后保持选中*/
  onMounted(()=>{
    if(projectsStore.currentProject.index!=-1){
      projectbox.value[projectsStore.currentProject.index].classList.add('selected');
    }

  })
</script>

<style scoped>
.box {
  flex-shrink: 0;
  height: 150px;
  width: 200px;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
  margin: 20px 25px;
  display:inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.background{
  height: 150px;
  width: 200px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 35%;
}
.box:nth-child(6n+1) .background{
  background-image: url("../../../pictures/background/background1.jpg");
}
.box:nth-child(6n+2) .background{
  background-image: url("../../../pictures/background/background2.jpg");
}
.box:nth-child(6n+3) .background{
  background-image: url("../../../pictures/background/background3.jpg");
}
.box:nth-child(6n+4) .background{
  background-image: url("../../../pictures/background/background4.jpg");
}
.box:nth-child(6n+5) .background{
  background-image: url("../../../pictures/background/background5.jpg");
}
.box:nth-child(6n) .background{
  background-image: url("../../../pictures/background/background6.jpg");
}
div .el-icon{
  color:#409EFC;
}
div .el-icon:hover{
  cursor:pointer;
}
.selected{
  border-width: 2px;
  border-color: #409EFC
}
</style>
