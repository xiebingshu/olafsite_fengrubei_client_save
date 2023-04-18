<template>
  <el-container style="height: 100%">
    <el-aside class="el-aside-class" :class="{ 'el-aside-class1' : !isCollapse_later , 'el-aside-class2' : isCollapse_later }">
      <el-scrollbar style="height: 100%">
        <el-radio-group v-model="isCollapse" :class="{ 'el-radio-group-class1' : !isCollapse_later , 'el-radio-group-class2' : isCollapse_later }">
          <el-radio-button :label=false @click="push0">展开</el-radio-button>
          <el-radio-button :label=true @click="pull0">隐藏</el-radio-button>
        </el-radio-group>
        <el-menu class="el-menu-vertical"
                 default-active="this.$router.path"
                 :collapse="isCollapse"
                 @open="handleOpen"
                 @close="handleClose"
                 :unique-opened="true"
                 :router="true"
        >
          <el-menu-item index="/mainpage/project_management" :route="{ path: '/mainpage/project_management',query:{user:pathuser}}">
            <el-icon><document /></el-icon>
            <span>项目管理</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><location /></el-icon>
              <span>图谱管理</span>
            </template>
            <el-menu-item index="/mainpage/graph_management/entity_management" :route="{ path: '/mainpage/graph_management/entity_management',query:{user:pathuser}}">实体管理</el-menu-item>
            <el-menu-item index="/mainpage/graph_management/relationship_management" :route="{ path: '/mainpage/graph_management/relationship_management',query:{user:pathuser}}">关系管理</el-menu-item>
            <el-menu-item index="/mainpage/graph_management/data_management" :route="{ path: '/mainpage/graph_management/data_management',query:{user:pathuser}}">数据管理</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><location /></el-icon>
              <span>图谱构建</span>
            </template>
            <el-menu-item index="/mainpage/graph_construction/knowledge_extraction" :route="{ path: '/mainpage/graph_construction/knowledge_extraction',query:{user:pathuser}}">知识抽取</el-menu-item>
            <el-menu-item index="/mainpage/graph_construction/knowledge_fusion" :route="{ path: '/mainpage/graph_construction/knowledge_fusion',query:{user:pathuser}}">知识融合</el-menu-item>
            <el-sub-menu index="3-3">
              <template #title>图谱查询</template>
              <el-menu-item index="/mainpage/graph_construction/graph_query/graph_visualization" :route="{ path: '/mainpage/graph_construction/graph_query/graph_visualization',query:{user:pathuser}}">图谱可视化</el-menu-item>
              <el-menu-item index="/mainpage/graph_construction/graph_query/path_relationship" :route="{ path: '/mainpage/graph_construction/graph_query/path_relationship',query:{user:pathuser}}">路径关系</el-menu-item>
              <el-menu-item index="/mainpage/graph_construction/graph_query/detailed_information" :route="{ path: '/mainpage/graph_construction/graph_query/detailed_information',query:{user:pathuser}}">详细信息</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="/mainpage/dinosaur">
            <el-icon><setting /></el-icon>
            <span>休息一下</span>
          </el-menu-item>
          <el-menu-item index="/mainpage/about">
            <el-icon><setting /></el-icon>
            <span>关于</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-main>
    <el-container style="height: 100%">
      <el-header height="55px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in path1">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider  style="margin: 10px 0px"/>
        <el-row>
        <span>当前项目:</span>
        <el-dropdown size="small">
          <span class="el-dropdown-link">
            <span v-if="projectsStore.currentProject.index===-1"><span style="color: red">未选择</span></span>
            <span v-else>{{projectsStore.currentProject.name}}</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in projectsStore.projects" @click="select(item.index)">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        </el-row>
      </el-header>
      <el-main style="margin: 10px;padding: 5px;">
        <router-view></router-view>
      </el-main>
    </el-container>
    </el-main>
  </el-container>
  <el-dialog id="progress_valible" v-model="progress_valible" style="width:20%" :close-on-click-modal="false" :show-close="false">
    <div class="container">
      <div class="progress">
        <div class="percent"></div>
      </div>
      <div class="steps">
        <div class="step" ref="step0"></div>
        <div class="step" ref="step1"></div>
        <div class="step" ref="step2"></div>
        <div class="step" ref="step3"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import {onMounted, onUpdated, ref, toRaw, watch} from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import {useRoute} from "vue-router";
import {useProjectsStore} from "../../stores/projects";
import axios from "axios";
import Qs from "qs";
import {ElMessage} from "element-plus";
const isCollapse = ref(true)
const isCollapse_later = ref(true)
let timer: number | null | undefined =null;
const route=useRoute();
const step0 = ref(null);
const step1 = ref(null);
const step2 = ref(null);
const step3 = ref(null);
const step = ref([step0, step1, step2, step3]);
const steptime = ref(0);
const stepnum = ref(0);
const progress_valible = ref(false);
const progrem_get = ref(true);
const path0=ref('');
const path1=ref(Array());
const pathuser=ref(route.query.user);
const projectsStore=useProjectsStore();
const bread=["项目管理",
             "实体管理","关系管理", "数据管理",
             "知识抽取","知识融合","图谱可视化",
             "路径关系","详细信息","休息一下",
             "关于"]
path1.value.splice(0,0,"项目管理")
onUpdated(()=>{
  path0.value=(route.name as string)
  path1.value.splice(0);
  switch (path0.value) {
    case bread[0]: path1.value.splice(0,0,"项目管理");break;
    case bread[1]: path1.value.splice(0,0,"图谱管理","实体管理");break;
    case bread[2]: path1.value.splice(0,0,"图谱管理","关系管理");break;
    case bread[3]: path1.value.splice(0,0,"图谱管理","数据管理");break;
    case bread[4]: path1.value.splice(0,0,"图谱构建","知识抽取");break;
    case bread[5]: path1.value.splice(0,0,"图谱构建","知识融合");break;
    case bread[6]: path1.value.splice(0,0,"图谱构建","图谱查询","图谱可视化");break;
    case bread[7]: path1.value.splice(0,0,"图谱构建","图谱查询","路径关系");break;
    case bread[8]: path1.value.splice(0,0,"图谱构建","图谱查询","详细信息");break;
    case bread[9]: path1.value.splice(0,0,"休息一下");break;
    case bread[10]: path1.value.splice(0,0,"关于作者");break;
  }
})
onMounted(()=> {
  if(projectsStore.project_get == false) {
    ElMessage.success("获取项目");
    clearInterval(steptime.value);
    progress_valible.value = true
    steptime.value = window.setInterval(()=>{
      if(stepnum.value < 3){
        (step.value[stepnum.value].value as unknown as HTMLElement).classList.add('completed');
        (step.value[stepnum.value+1].value as unknown as HTMLElement).classList.add('selected');
        stepnum.value++;
      }
      if(stepnum.value == 3){
        (step.value[stepnum.value].value as unknown as HTMLElement).classList.add('selected');
      }
    },400)
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/project_get/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        username: pathuser.value,
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      for (var i = 0; i < res.data.count; i++) {
        projectsStore.pushProject(res.data.names[i], res.data.moods[i])
      }
      (step0.value as unknown as HTMLElement).classList.add('completed','selected');
      (step1.value as unknown as HTMLElement).classList.add('completed','selected');
      (step2.value as unknown as HTMLElement).classList.add('completed','selected');
      (step3.value as unknown as HTMLElement).classList.add('completed','selected');
      let tmptime = 0
      tmptime = window.setInterval(()=>{
        progress_valible.value = false;
        ElMessage.success('获取成功');
        clearInterval(steptime.value);
        for(i = 0; i < 4; i++){
          (step.value[i].value as unknown as HTMLElement).classList.remove('selected','completed');
        }
        stepnum.value = 0;
        clearInterval(tmptime);
      },400);
      projectsStore.project_get = true
    }).catch(err => {
      console.log(err)
    })
  }
})
watch(()=>projectsStore.currentProject.index,async (newProject,oldProject) => {
  if(newProject==-1 || newProject==oldProject){
    return;
  }
  if(projectsStore.projects[newProject].complete == false){
    projectsStore.projects[newProject].complete=true
    ElMessage.success("拉取项目信息");
    clearInterval(steptime.value);
    progress_valible.value = true
    steptime.value = window.setInterval(()=>{
      if(stepnum.value < 3){
        (step.value[stepnum.value].value as unknown as HTMLElement).classList.add('completed');
        (step.value[stepnum.value+1].value as unknown as HTMLElement).classList.add('selected');
        stepnum.value++;
      }
      if(stepnum.value == 3){
        (step.value[stepnum.value].value as unknown as HTMLElement).classList.add('selected');
      }
    },400)
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/entity_get/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        username:pathuser.value,
        project:projectsStore.currentProject.name
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      for(var i = 0; i<res.data.count; i++){
        const newEntities = JSON.parse(JSON.stringify(projectsStore.currentProject.entities));
        newEntities.splice(newEntities.length,0, {
          name: toRaw(res.data.names[i]),
          description: toRaw(res.data.descriptions[i]),
          attributes: [],
          index:newEntities.length});
        projectsStore.currentProject.entities = newEntities;
        projectsStore.updateEntity();
      }
    }).catch(err=>{
      console.log(err)
    })
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/data_get/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        username:pathuser.value,
        project:projectsStore.currentProject.name
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      for(var i = 0; i<res.data.count; i++){
        const newDatas = JSON.parse(JSON.stringify(projectsStore.currentProject.datas));
        newDatas.splice(newDatas.length,0, {
          name: toRaw(res.data.names[i]),
          description: toRaw(res.data.descriptions[i]),
          type: toRaw(res.data.types[i]),
          content: toRaw(res.data.texts[i]),
          index:newDatas.length});
        projectsStore.currentProject.datas = newDatas;
        projectsStore.updateData();
      }
    }).catch(err=>{
      console.log(err)
    })
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/rel_get/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        username: pathuser.value,
        project: projectsStore.currentProject.name
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      const newRelations = JSON.parse(JSON.stringify(projectsStore.currentProject.relations));
      newRelations.splice(0, newRelations.length)
      for(var i = 0; i<res.data.count; i++){
        newRelations.splice(newRelations.length,0, {
          name: res.data.names[i],
          description: res.data.descriptions[i],
          attributes: [],
          index:newRelations.length,
          obj:res.data.objs[i],
          sub:res.data.subs[i]});
        projectsStore.currentProject.relations = newRelations;
        projectsStore.updateRelation();
      }
    }).catch(err => {
      console.log(err)
    })
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/mission/mission_get/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        username:pathuser.value,
        project:projectsStore.currentProject.name
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      console.log(res.data.count);
      for(var i = 0; i<res.data.count; i++){
        const newMissions = JSON.parse(JSON.stringify(projectsStore.currentProject.missions));
        newMissions.splice(newMissions.length,0, {
          name: toRaw(res.data.names[i]),
          description: toRaw(res.data.descriptions[i]),
          entities:[],
          relations:[],
          datas:[],
          extraction_module:null,
          fusion_module:null,
          knowledge_base:null,
          index:newMissions.length});
        projectsStore.currentProject.missions = newMissions;
        projectsStore.updateMission();
      }
      (step0.value as unknown as HTMLElement).classList.add('completed','selected');
      (step1.value as unknown as HTMLElement).classList.add('completed','selected');
      (step2.value as unknown as HTMLElement).classList.add('completed','selected');
      (step3.value as unknown as HTMLElement).classList.add('completed','selected');
      let tmptime = 0
      tmptime = window.setInterval(()=>{
        progress_valible.value = false;
        ElMessage.success('拉取成功');
        clearInterval(steptime.value);
        for(i = 0; i < 4; i++){
          (step.value[i].value as unknown as HTMLElement).classList.remove('selected','completed');
        }
        stepnum.value = 0;
        clearInterval(tmptime);
      },400);
    }).catch(err=>{
      console.log(err)
    })
  }
})
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
function push0(){
  isCollapse_later.value=false;
  console.log(isCollapse_later.value)
}
function pull0(){
  timer=setTimeout(()=>{
    isCollapse_later.value=true;
    console.log(isCollapse_later.value)
    clearTimeout(1);
  },160)
}
/*下拉菜单选中*/
function select(index:number){
  projectsStore.updateProject2(index);
}
</script>

<style>
@import "MainPage.css";
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

