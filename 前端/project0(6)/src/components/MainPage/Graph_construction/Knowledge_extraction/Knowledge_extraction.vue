<template>
  <el-container style="height: 100%;">
    <el-header height="220px">
      <el-scrollbar>
        <div class="scrollbar-flex-content">
          <div class="box"
               :style="{
            borderRadius: radius.type? `var(--el-border-radius-${radius.type})`: '',
            boxShadow: `var(${getCssVarName(shadow.type)})`,
            }"
               v-for="mission in projectsStore.currentProject.missions"
               :key="mission.name"
               style="flex-direction: column;"
               ref="missionbox"
          >
            <div class="background"></div>
            <div style="margin: 15px; font-size:20px; font-weight:650;">{{ mission.name }}</div>
            <div style="margin: 10px">
              <el-icon :size="20" color="#409EFC" style="margin: 0 13px" @click="edit(mission.index)"><Edit /></el-icon>
              <el-icon :size="20" color="#409EFC" style="margin: 0 13px" @click="delete0(mission.index)"><Delete /></el-icon>
            </div>
          </div>
          <div class="box"
               :style="{
        borderRadius: radius.type? `var(--el-border-radius-${radius.type})`: '',
        boxShadow: `var(${getCssVarName(shadow.type)})`,
      }">
            <el-icon size="45px" @click="createMission"><plus /></el-icon>
          </div>
        </div>
      </el-scrollbar>
    </el-header>
<!--    <el-divider  style="margin: 10px 0"/>-->
<!--    <el-main style="height: 100%;margin: 5px;padding: 5px;">-->
<!--      <el-row class="tac" style="height: 100%">-->
<!--        <el-col :span="4">-->
<!--          <div style="display: flex;flex-direction: column;">-->
<!--            <el-button type="primary" size="large" @click="choose0" style="margin: 30px 20px; flex-shrink: 0;" :disabled="!(currentMission.extraction_module==null)">选择任务参数</el-button>-->
<!--            <el-button type="primary" size="large" @click="extraction" style="margin: 30px 20px; flex-shrink: 0;" :disabled="!(currentMission.extraction_module==null)">开始实体抽取</el-button>-->
<!--            <el-button type="primary" size="large" @click="fusion" style="margin: 30px 20px; flex-shrink: 0;" :disabled="!(currentMission.fusion_module==null)">开始实体消歧</el-button>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="16" :offset="1">-->
<!--          <el-table :data="projectsStore.currentProject.missions"-->
<!--                    style="width: 100%;"-->
<!--                    :highlight-current-row="true"-->
<!--                    height="300"-->
<!--                    :row-style="{height:'10px'}"-->
<!--                    :cell-style="{padding:'12px 0px', textAlign: 'center'}"-->
<!--                    :header-cell-style="{textAlign: 'center'}">-->
<!--            <el-table-column label="任务名称" width="130">-->
<!--              <template #default="scope">-->
<!--                <el-popover data-effect="light" trigger="hover" placement="top" width="auto">-->
<!--                  <template #default>-->
<!--                    <div>任务名称: {{ scope.row.name }}</div>-->
<!--                    <div>任务描述: {{ scope.row.description }}</div>-->
<!--                  </template>-->
<!--                  <template #reference>-->
<!--                    <el-tag>{{ scope.row.name }}</el-tag>-->
<!--                  </template>-->
<!--                </el-popover>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="数据集" width="100">-->
<!--              <template #default="scope">-->
<!--                <span v-if="scope.row.datas.length!==0">已完成选择</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="实体集" width="100">-->
<!--              <template #default="scope">-->
<!--                <span v-if="scope.row.entities.length!==0">已完成选择</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="关系集" width="100">-->
<!--              <template #default="scope">-->
<!--                <span v-if="scope.row.relations.length!==0">已完成选择</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="抽取模型" width="120">-->
<!--              <template #default="scope">-->
<!--                <span>{{scope.row.extraction_module}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="消歧模型" width="120">-->
<!--              <template #default="scope">-->
<!--                <span>{{scope.row.fusion_module}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="消歧数据库" width="130">-->
<!--              <template #default="scope">-->
<!--                <span>{{scope.row.knowledge_base}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-main>-->
  </el-container>
  <el-dialog v-model="dialogFormVisible" title="新建任务" style="width: 25%; height: 35%" @closed="close1">
    <el-form :model="formMission">
      <el-form-item label="任务名称" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formMission.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="任务描述" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formMission.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createMissioncancel">取消</el-button>
        <el-button type="primary" @click="dataselect">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="selectdata" title="选择数据" style = "width: 70%" @closed="close2">
      <el-table :data="projectsStore.currentProject.datas"
                style="width: 100%;height: 60%"
                :highlight-current-row="true"
                height="450"
                :row-style="{height:'10px'}"
                :cell-style="{padding:'12px 0px', textAlign: 'center'}"
                :header-cell-style="{textAlign: 'center'}">
        <el-table-column label="数据名称" width="100">
          <template #default="scope">
            <el-popover data-effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>数据名称: {{ scope.row.name }}</div>
                <div>数据描述: {{ scope.row.description }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.name }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="数据类型" width="100">
          <template #default="scope">
            <span>{{datatype[scope.row.type]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" width="500" show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" round @click="before_extraction(scope.row.name)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    <button @click="creatMissionconfirm" class="importantbutton">开始抽取</button>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" :title="title[step]" style="width: 50%; text-align: center" >
    <el-transfer v-model="entity_select" :data="data1" :class="{notable:!transfer1show}"/>
    <el-transfer v-model="rel_select" :data="data2" :class="{notable:!transfer2show}"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="choosecancel">{{ cancel[step] }}</el-button>
        <el-button type="primary" @click="chooseconfirm">
          {{confirm[step]}}
        </el-button>
      </span>
    </template>
  </el-dialog>
<!--  <el-dialog v-model="dialogFormVisible3" title="选择实体抽取模型" style="width: 25%">-->
<!--    <el-form :model="formMission">-->
<!--      <el-form-item label="抽取模型" :label-width="formLabelWidth" style="width: 50%" :required="true">-->
<!--        <el-select v-model="formMission.extraction_module" placeholder="请选择模型" value="0">-->
<!--          <el-option label="A模型" value=1 />-->
<!--          <el-option label="B模型" value=2 />-->
<!--          <el-option label="C模型" value=3 />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <template #footer>-->
<!--      <span class="dialog-footer">-->
<!--        <el-button @click="extractioncancel">取消</el-button>-->
<!--        <el-button type="primary" @click="extractionconfirm">-->
<!--          抽取-->
<!--        </el-button>-->
<!--      </span>-->
<!--    </template>-->
<!--  </el-dialog>-->
<!--  <el-dialog v-model="dialogFormVisible4" title="选择实体消歧模型" style="width: 25%">-->
<!--    <el-form :model="formMission">-->
<!--      <el-form-item label="消歧模型" :label-width="formLabelWidth" style="width: 50%" :required="true">-->
<!--        <el-select v-model="formMission.fusion_module" placeholder="请选择模型" value="0">-->
<!--          <el-option label="A模型" value=1 />-->
<!--          <el-option label="B模型" value=2 />-->
<!--          <el-option label="C模型" value=3 />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="知识库" :label-width="formLabelWidth" style="width: 50%" :required="true">-->
<!--        <el-select v-model="formMission.knowledge_base" placeholder="请选择库" value="0">-->
<!--          <el-option label="百度" value=1 />-->
<!--          <el-option label="维基" value=2 />-->
<!--          <el-option label="谷歌" value=3 />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <template #footer>-->
<!--      <span class="dialog-footer">-->
<!--        <el-button @click="fusioncancel">取消</el-button>-->
<!--        <el-button type="primary" @click="fusionconfirm">-->
<!--          消歧-->
<!--        </el-button>-->
<!--      </span>-->
<!--    </template>-->
<!--  </el-dialog>-->
  <el-dialog id="important_progress" v-model="importantprogress" style="width:20%;
  right:10%;
  height:0;
  opacity: 100%;
  top:20%;
  background-color: #7e7e7f!important;
  border: 1px solid #7e7e7f!important;"
  :close-on-click-modal="false"
  :show-close="false">
    <div class="out">
      <div class="fade-in">
        <div class="container">
          <div class="one common"></div>
          <div class="two common"></div>
          <div class="three common"></div>
          <div class="four common"></div>
          <div class="five common"></div>
          <div class="six common"></div>
          <div class="seven common"></div>
          <div class="eight common"></div>
        </div>
      </div>
    </div>
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
import {useProjectsStore} from '../../../../stores/projects.js'
const datatype=['URL', '文本', '自动']
import {ElMessage} from "element-plus";
import axios from "axios";
import Qs from "qs";
import {useRoute} from "vue-router";
const pathuser=ref(useRoute().query.user);
const upload=reactive({
  mission_name:"",
  mission_description:"",
  data_name:""
})
const entities = ref<string[]>([])
const rels = ref<string[]>([])
const entity_names = ref([])
const entity_types = ref([])
const rel_objs = ref([])
const rel_subs = ref([])
const rel_types = ref([])
const dialogFormVisible = ref(false)
function close1() {  formMission.name= ''; formMission.description= '';}
function close2() {upload.data_name= ''; upload.mission_name= ''; upload.mission_description =''};
const dialogFormVisible2 = ref(false)
const formLabelWidth = '70px'
const projectsStore=useProjectsStore();
const textareaValue = ref(null);
const selectdata = ref(false);
const importantprogress = ref(false);
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

/*任务相关*/

/*新建任务*/
const formMission =reactive({
  name: '',
  description: '',
  entities: [],
  relations:[],
  datas:[],
  extraction_module: null as null | number,
  fusion_module: null as null | number,
  knowledge_base:null as null | number,
  index:-1
})
const currentMission =reactive({
  name: '',
  description: '',
  entities: [],
  relations:[],
  datas:[],
  extraction_module: null as null | number,
  fusion_module: null as null | number,
  knowledge_base:null as null | number,
  index:-1
})
const missionbox =ref<HTMLElement[]>([]);
function createMission(){
  if(projectsStore.currentProject.index==-1){
    ElMessage.error('请选择项目');
    return;
  }
  dialogFormVisible.value=true;
}
function createMissioncancel(){
  dialogFormVisible.value=false;
  close1();
}
function creatMissionconfirm(){
  ElMessage.success("开始抽取")
  importantprogress.value = true
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    // 有域名后端写法：url:'https://doubi.com/api/books'
    url: '/path/mission/mission_create/',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: Qs.stringify({
      user:pathuser.value,
      project:projectsStore.currentProject.name,
      mission_name:upload.mission_name,
      mission_description:upload.mission_description,
      data:upload.data_name
    }),
    // 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res.data)
    if(res.data.result==true){
      const newMissions = JSON.parse(JSON.stringify(projectsStore.currentProject.missions));
      newMissions.splice(newMissions.length,0, {
        name: toRaw(upload.mission_name),
        description: toRaw(upload.mission_description),
        entities:[],
        relations:[],
        datas:[],
        extraction_module:null,
        fusion_module:null,
        knowledge_base:null,
        index:newMissions.length});
      projectsStore.currentProject.missions = newMissions;
      projectsStore.updateMission();
      console.dir(projectsStore.currentProject);
      console.dir(projectsStore.projects[projectsStore.currentProject.index])
      dialogFormVisible.value = false;
      importantprogress.value = false;
      selectdata.value = false;
      entity_names.value= res.data.entity_names
      entity_types.value = res.data.entity_types
      rel_objs.value = res.data.rel_objs
      rel_subs.value = res.data.rel_subs
      rel_types.value = res.data.rel_types
      let i
      for(i = 0; i < entity_names.value.length ; i++ )
      {
        const entity = `${entity_names.value[i]}(${entity_types.value[i]})`;
        entities.value.push(entity)
      }
      for(i = 0; i < rel_objs.value.length ; i++ )
      {
        const rel = `${rel_objs.value[i]} (${rel_types.value[i]}) ${rel_subs.value[i]}`;
        rels.value.push(rel)
      }
      console.log(entities.value)
      console.log(rels.value)
      close1();
      close2();
      ElMessage({
        message: '抽取成功！',
        type: 'success',
        center:true
      })
      choose0()
      console.log(currentMission.entities)
      console.log(currentMission.relations)
    }
    else{
      importantprogress.value = false
      dialogFormVisible.value = false;
      close1();
      close2();
      ElMessage({
        message: '任务名称已存在',
        type: 'warning',
        center:true
      })
    }
  }).catch(err=>{
    console.log(err)
  })
}
function dataselect(){
  if(formMission.name==''){
    ElMessage.error('请输入任务名称');
    return;
  }
  upload.mission_name = formMission.name
  upload.mission_description = formMission.description
  dialogFormVisible.value=false;
  selectdata.value=true;
}
/*选择任务*/
function select(index: number) {
  if (index != currentMission.index) {
    if (currentMission.index != -1) {
      missionbox.value[currentMission.index].classList.remove('selected');
    }
    missionbox.value[index].classList.add('selected');
    currentMission.name=toRaw(projectsStore.currentProject.missions[index].name);
    currentMission.description=toRaw(projectsStore.currentProject.missions[index].description);
    currentMission.entities=JSON.parse(JSON.stringify(projectsStore.currentProject.missions[index].entities));
    // @ts-ignore
    currentMission.relations=toRaw(JSON.stringify(projectsStore.currentProject.missions[index].relations));
    // @ts-ignore
    currentMission.datas=toRaw(JSON.stringify(projectsStore.currentProject.missions[index].datas));
    currentMission.extraction_module=toRaw(projectsStore.currentProject.missions[index].extraction_module);
    currentMission.fusion_module=toRaw(projectsStore.currentProject.missions[index].fusion_module);
    currentMission.knowledge_base=toRaw(projectsStore.currentProject.missions[index].knowledge_base);
    currentMission.index=toRaw(index);
  }
  else{
    missionbox.value[currentMission.index].classList.remove('selected');
    currentMission.name='';
    currentMission.description='';
    currentMission.entities=[];
    // @ts-ignore
    currentMission.relations=[];
    // @ts-ignore
    currentMission.datas=[];
    currentMission.extraction_module=null;
    currentMission.fusion_module=null;
    currentMission.knowledge_base=null;
    currentMission.index=-1;
  }
}
/*删除任务*/
function delete0(index: number){
  projectsStore.currentProject.missions.splice(index,1);
  projectsStore.updateMission();
  currentMission.name='';
  currentMission.description='';
  currentMission.entities=[];
  // @ts-ignore
  currentMission.relations=[];
  // @ts-ignore
  currentMission.datas=[];
  currentMission.extraction_module=null;
  currentMission.fusion_module=null;
  currentMission.knowledge_base=null;
  currentMission.index=-1;
}
function before_extraction(index:string){
  upload.data_name = index
}
/*选择参数*/
interface Option {
  key: number
  label: string
  disabled: boolean
}
const generateData1 = () => {
  const data: Option[] = []
  for (let i = 0; i < entities.value.length; i++) {
      data.push({
        key: i,
        label: entities.value[i],
        disabled: false
      })
  }
  return data
}
const generateData2 = () => {
  const data: Option[] = []
  for (let i = 0; i < rels.value.length; i++) {
      data.push({
        key: i,
        label: rels.value[i],
        disabled: false
      })
  }
  return data
}
const data1 = ref<Option[]>([]);
const data2 = ref<Option[]>([]);
const transfer1show=ref(false);
const transfer2show=ref(false);
const transfer3show=ref(false);
const step=ref(0);
const missionselect = ref(false)
const title=['请选择实体','请选择关系'];
const confirm=['下一步','下一步','确定'];
const cancel=['取消','上一步','上一步'];
const entity_select = ref([])
const rel_select = ref([])
const entity_upload = ref<string[]>([])
const rel_upload = ref<string[]>([])
function choose0(){
  data1.value=generateData1();
  data2.value=generateData2();
  console.log(data1.value)
  console.log(data2.value)
  dialogFormVisible2.value=true;
  transfer1show.value=true;
}
function choosecancel(){
  if(step.value==0){
    transfer1show.value=false;
    dialogFormVisible2.value=false;
    entity_select.value = []
    rel_select.value = []
    return;
  }
  if(step.value==1){
    step.value--;
    transfer1show.value=true;
    transfer2show.value=false;
    return;
  }
}
function chooseconfirm(){
  if(step.value==0){
    for(let i = 0; i < entity_select.value.length; i++) {
      axios({
        // 接口网址：包含协议名，域名，端口和路由
        // 有域名后端写法：url:'https://doubi.com/api/books'
        url: '/path/project/entity_create/',
        // 请求方式，默认为get，可以不写
        method: 'post',
        // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
        data: Qs.stringify({
          user:pathuser.value,
          project:projectsStore.currentProject.name,
          entity_name:entity_names.value[entity_select.value[i]],
          entity_description:entity_types.value[entity_select.value[i]],
        }),
        // 成功请求回数据后，进入then，并用console.log打印结果
      }).then(res => {
        if(res.data=="True"){
          const newEntities = JSON.parse(JSON.stringify(projectsStore.currentProject.entities));
          newEntities.splice(newEntities.length,0, {
            name: toRaw(entity_names.value[entity_select.value[i]]),
            description: toRaw(entity_types.value[entity_select.value[i]]),
            attributes: [],
            index:newEntities.length});
          projectsStore.currentProject.entities = newEntities;
          projectsStore.updateEntity();
          ElMessage.success('更新实体成功')
        }
        else{
          ElMessage({
            message: '实体名称已存在',
            type: 'warning',
            center:true
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    step.value++;
    transfer1show.value=false;
    transfer2show.value=true;
    console.log(transfer2show.value)
  }
  if(step.value==1){
    for(let i = 0; i < rel_select.value.length; i++) {
      axios({
        // 接口网址：包含协议名，域名，端口和路由
        // 有域名后端写法：url:'https://doubi.com/api/books'
        url: '/path/project/rel_create/',
        // 请求方式，默认为get，可以不写
        method: 'post',
        // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
        data: Qs.stringify({
          user:pathuser.value,
          project:projectsStore.currentProject.name,
          relation_name:rel_types.value[rel_select.value[i]],
          relation_description:"",
          obj:rel_objs.value[rel_select.value[i]],
          sub:rel_subs.value[rel_select.value[i]]
        }),
        // 成功请求回数据后，进入then，并用console.log打印结果
      }).then(res => {
        if(res.data=='True'){
          const newRelations = JSON.parse(JSON.stringify(projectsStore.currentProject.relations));
          newRelations.splice(newRelations.length,0, {
            name: toRaw(rel_types.value[rel_select.value[i]]),
            description: '',
            attributes: [],
            index:newRelations.length,
            obj:toRaw(rel_objs.value[rel_select.value[i]]),
            sub:toRaw(rel_subs.value[rel_select.value[i]])});
          projectsStore.currentProject.relations = newRelations;
          projectsStore.updateRelation();
          close1();
          dialogFormVisible.value = false;
          ElMessage({
            message: '更新关系成功！',
            type: 'success',
            center:true
          })
        }
        else{
          close1();
          dialogFormVisible.value = false;
          ElMessage.error('关系已存在')
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    // dialogFormVisible2.value = false;
    // transfer2show.value=false;
    // step.value=0;
  }
}
/*开始抽取*/
const dialogFormVisible3=ref(false);
function extraction(){
  console.dir(currentMission);
  if(currentMission.datas.length==0 || currentMission.relations.length==0 || currentMission.entities.length==0){
    ElMessage.error('请先完成参数选择!');
    return;
  }
  if(!(currentMission.extraction_module==null)){
    ElMessage.error('您已完成选择，无法修改');
    return;
  }
  dialogFormVisible3.value=true;
}
function extractioncancel(){
  dialogFormVisible3.value=false;
  formMission.extraction_module=null;
}
function extractionconfirm(){
  if(formMission.extraction_module==null){
    ElMessage.error('请选择模型');
    return;
  }
  currentMission.extraction_module=toRaw(formMission.extraction_module);
  const newMissions = JSON.parse(JSON.stringify(projectsStore.currentProject.missions));
  newMissions[currentMission.index].extraction_module=toRaw(formMission.extraction_module);
  projectsStore.currentProject.missions = newMissions;
  projectsStore.updateMission();
  dialogFormVisible3.value = false;
  ElMessage({
    message: '创建成功！',
    type: 'success',
    center:true
  })
  console.dir(currentMission);
}
/*开始融合\消歧*/
const dialogFormVisible4=ref(false);
function fusion(){
  if(currentMission.extraction_module==null){
    ElMessage.error('请先完成实体抽取!');
    return;
  }
  if(!(currentMission.fusion_module==null)){
    ElMessage.error('您已完成选择，无法修改');
    return;
  }
  dialogFormVisible4.value=true;
}
function fusioncancel(){
  dialogFormVisible4.value=false;
  formMission.fusion_module=null;
  formMission.knowledge_base=null;
}
function fusionconfirm(){
  if(formMission.fusion_module==null){
    ElMessage.error('请选择模型');
    return;
  }
  if(formMission.knowledge_base==null){
    ElMessage.error('请选择数据库');
    return;
  }
  currentMission.fusion_module=toRaw(formMission.extraction_module);
  currentMission.knowledge_base=toRaw(formMission.knowledge_base);
  const newMissions = JSON.parse(JSON.stringify(projectsStore.currentProject.missions));
  newMissions[currentMission.index].fusion_module=toRaw(formMission.fusion_module);
  newMissions[currentMission.index].knowledge_base=toRaw(formMission.knowledge_base);
  projectsStore.currentProject.missions = newMissions;
  projectsStore.updateMission();
  dialogFormVisible4.value = false;
  ElMessage({
    message: '消歧成功！',
    type: 'success',
    center:true
  })
}







</script>

<style scoped>
.scrollbar-flex-content {
  display: flex;
}
.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}
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
.importantbutton{
  position: relative;
  width: 30%;
  height: 80px;
  margin: 1em 35%;
  padding: 0.5em 1em;
  font-size: 2em;
  text-transform: uppercase;
  border-radius: .3em;
  border: 0.1em solid #409EFC;
  background: white;

  box-shadow: inset 0 .1em rgba(255,255,255,0.1), 0 .1em .1em rgba(255,255,255,0.1), 0 0.2em rgba(255,255,255,0.1), 0 0 0 .2em rgba(0,0,0,0.1);

  color: #409EFC;
  text-shadow: 0 0.1em rgba(255,255,255,0.1), 0 -0.1em rgba(0,0,0,0.2);
}
.container {
  width: 40vw;
  height: 40vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
}

.common {
  height: 5vw;
  max-height: 100%;
  overflow: auto;
  width: 2vw;
  margin: auto;
  max-width: 100%;
  position: absolute;
  border-radius: 0vw 10vw 0vw 10vw;
  box-shadow: inset 0vw 0vw 0vw .1vw #31c2fb, 0vw 0vw 1.5vw 0vw #1b24c4;
}

.one {
  transform: rotate(45deg);
  left: 0;
  right: 0;
  top: 0;
  bottom: 7.5vw;
}

.two {
  transform: rotate(90deg);
  left: 5.5vw;
  right: 0;
  top: 0;
  bottom: 5.5vw;
}

.three {
  transform: rotate(135deg);
  left: 7.5vw;
  right: 0;
  top: 0;
  bottom: 0;
}

.four {
  transform: rotate(180deg);
  left: 5.5vw;
  right: 0;
  top: 5.5vw;
  bottom: 0;
}

.five {
  transform: rotate(225deg);
  left: 0;
  right: 0;
  top: 7.5vw;
  bottom: 0;
}

.six {
  transform: rotate(270deg);
  left: 0;
  right: 5.5vw;
  top: 5.5vw;
  bottom: 0;
}

.seven {
  transform: rotate(315deg);
  left: 0;
  right: 7.5vw;
  top: 0;
  bottom: 0;
}

.eight {
  transform: rotate(360deg);
  left: 0;
  right: 5.5vw;
  top: 0;
  bottom: 5.5vw;
}

.bar {
  width: 12vw;
  height: .25vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 16vw;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #1b24c4;
}

.progress {
  width: 12vw;
  height: .5vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #c9c9d2;
}

.one {
  animation: one 1s ease infinite;
  -moz-animation: one 1s ease infinite;
  /* Firefox */
  -webkit-animation: one 1s ease infinite;
  /* Safari and Chrome */
  -o-animation: one 1s ease infinite;
  /* Opera */
}

@keyframes one {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.two {
  animation: two 1s .125s ease infinite;
  -moz-animation: two 1s .125s ease infinite;
  /* Firefox */
  -webkit-animation: two 1s .125s ease infinite;
  /* Safari and Chrome */
  -o-animation: two 1s .125s ease infinite;
  /* Opera */
}

@keyframes two {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.three {
  animation: three 1s .25s ease infinite;
  -moz-animation: three 1s .25s ease infinite;
  /* Firefox */
  -webkit-animation: three 1s .25s ease infinite;
  /* Safari and Chrome */
  -o-animation: three 1s .25s ease infinite;
  /* Opera */
}

@keyframes three {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.four {
  animation: four 1s .375s ease infinite;
  -moz-animation: four 1s .375s ease infinite;
  /* Firefox */
  -webkit-animation: four 1s .375s ease infinite;
  /* Safari and Chrome */
  -o-animation: four 1s .375s ease infinite;
  /* Opera */
}

@keyframes four {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.five {
  animation: five 1s .5s ease infinite;
  -moz-animation: five 1s .5s ease infinite;
  /* Firefox */
  -webkit-animation: five 1s .5s ease infinite;
  /* Safari and Chrome */
  -o-animation: five 1s .5s ease infinite;
  /* Opera */
}

@keyframes five {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.six {
  animation: six 1s .625s ease infinite;
  -moz-animation: six 1s .625s ease infinite;
  /* Firefox */
  -webkit-animation: six 1s .625s ease infinite;
  /* Safari and Chrome */
  -o-animation: six 1s .625s ease infinite;
  /* Opera */
}

@keyframes six {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.seven {
  animation: seven 1s .750s ease infinite;
  -moz-animation: seven 1s .750s ease infinite;
  /* Firefox */
  -webkit-animation: seven 1s .750s ease infinite;
  /* Safari and Chrome */
  -o-animation: seven 1s .750s ease infinite;
  /* Opera */
}

@keyframes seven {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.eight {
  animation: eight 1s .875s ease infinite;
  -moz-animation: eight 1s .875s ease infinite;
  /* Firefox */
  -webkit-animation: eight 1s .875s ease infinite;
  /* Safari and Chrome */
  -o-animation: eight 1s .875s ease infinite;
  /* Opera */
}

@keyframes eight {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.container {
  animation: container 5s linear infinite;
  -moz-animation: container 5s linear infinite;
  /* Firefox */
  -webkit-animation: container 5s linear infinite;
  /* Safari and Chrome */
  -o-animation: container 5s linear infinite;
  /* Opera */
}

@keyframes container {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.progress {
  animation: progress 15s ease;
  -moz-animation: progress 15s ease;
  /* Firefox */
  -webkit-animation: progress 15s ease;
  /* Safari and Chrome */
  -o-animation: progress 15s ease;
  /* Opera */
}

@keyframes progress {
  0% {
    left: -24vw;
  }
  10% {
    left: -20vw;
  }
  30% {
    left: -16vw;
  }
  50% {
    left: -12vw;
  }
  65% {
    left: -10vw;
  }
  80% {
    left: -4vw;
  }
  100% {
    left: 0;
  }
}

.fade-in {
  animation: fade-in 2s ease;
  -moz-animation: fade-in 2s ease;
  /* Firefox */
  -webkit-animation: fade-in 2s ease;
  /* Safari and Chrome */
  -o-animation: fade-in 2s ease;
  /* Opera */
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.out {
  animation: out 2s 15s ease;
  -moz-animation: out 2s 15s ease;
  /* Firefox */
  -webkit-animation: out 2s 15s ease;
  /* Safari and Chrome */
  -o-animation: out 2s 15s ease;
  /* Opera */
}

@keyframes out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.importantbutton:active {
  text-shadow: 0 0 .3em #409EFC;
  top: 0.1em;
  box-shadow: inset 0 .1em rgba(255,255,255,0.1), 0 0.1em rgba(255,255,255,0.1), 0 -0.1em 0 .2em rgba(0,0,0,0.1);
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
  background-image: url("../../../../pictures/background/background1.jpg");
}
.box:nth-child(6n+2) .background{
  background-image: url("../../../../pictures/background/background2.jpg");
}
.box:nth-child(6n+3) .background{
  background-image: url("../../../../pictures/background/background3.jpg");
}
.box:nth-child(6n+4) .background{
  background-image: url("../../../../pictures/background/background4.jpg");
}
.box:nth-child(6n+5) .background{
  background-image: url("../../../../pictures/background/background5.jpg");
}
.box:nth-child(6n) .background{
  background-image: url("../../../../pictures/background/background6.jpg");
}
div .el-icon{
  color:#409EFC;
}
div .el-icon:hover{
  cursor:pointer;
}
.importantbutton:hover {
  text-shadow: 0 0 .3em white;
  color: white;
  background: #409EFC;
}
.selected{
  border-width: 2px;
  border-color: #409EFC
}
.notable{
  display: none;
}
</style>