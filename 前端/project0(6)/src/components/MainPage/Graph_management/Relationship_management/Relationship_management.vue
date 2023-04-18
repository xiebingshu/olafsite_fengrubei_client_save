<template>
  <el-row  class="tac" style="height:100%;" gutter="0">
    <el-col :span="8">
      <el-row>
        <el-col :span="8">
          <div style="margin: 15px; font-size: 25px; font-weight: 450;">关系列表</div>
        </el-col>
        <el-col :span="4" :offset="9">
          <el-button style="margin: 15px 20px 25px" type="primary" size="large" @click="createRelation">新建关系</el-button>
        </el-col>
        <el-divider  style="margin: 10px 0"/>
      </el-row>
      <el-table :data="projectsStore.currentProject.relations"
                style="width: 100%;"
                :highlight-current-row="true"
                height="450"
                :row-style="{height:'10px'}"
                :cell-style="{padding:'12px 0px', textAlign: 'center'}"
                :header-cell-style="{textAlign: 'center'}"
                @current-change="handleRelationChange">
        <el-table-column label="关系名称" width="80">
          <template #default="scope">
            <el-popover data-effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>关系名称: {{ scope.row.name }}</div>
                <div>关系描述: {{ scope.row.description }}</div>
                <div>关系主体:{{ scope.row.obj }}</div>
                <div>关系客体:{{ scope.row.sub }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.name }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="关系主体" width="120">
          <template #default="scope">
            <el-popover data-effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>关系名称: {{ scope.row.name }}</div>
                <div>关系描述: {{ scope.row.description }}</div>
                <div>关系主体:{{ scope.row.obj }}</div>
                <div>关系客体:{{ scope.row.sub }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.obj }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="关系客体" width="120">
          <template #default="scope">
            <el-popover data-effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>关系名称: {{ scope.row.name }}</div>
                <div>关系描述: {{ scope.row.description }}</div>
                <div>关系主体:{{ scope.row.obj }}</div>
                <div>关系客体:{{ scope.row.sub }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.sub }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
            >
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="13" :offset="1">
      <el-row>
        <el-col :span="18">
          <div style="margin: 15px; font-size: 25px; font-weight: 450;">关系{{currentRelation.name}}属性列表</div>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button style="margin: 15px 20px 25px" type="primary" size="large" @click="createAttribute">新建属性</el-button>
        </el-col>
        <el-divider  style="margin: 10px 0px"/>
      </el-row>
      <el-table :data="currentRelation.attributes"
                style="width: 100%;"
                :highlight-current-row="true"
                height="450"
                :row-style="{height:'10px'}"
                :cell-style="{padding:'12px 0px', textAlign: 'center'}"
                :header-cell-style="{textAlign: 'center'}">
        <el-table-column label="属性名称" width="120">
          <template #default="scope">
            <el-popover data-effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>属性名称: {{ scope.row.name }}</div>
                <div>属性描述: {{ scope.row.description }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.name }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="数据类型" width="150">
          <template #default="scope">
            <span>{{datatype[ scope.row.data_type ]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="允许空值" width="150">
          <template #default="scope">
            <span v-if="scope.row.empty">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="默认值" width="150">
          <template #default="scope">
            <span>{{ scope.row.default }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit2(scope.$index, scope.row)"
            >编辑</el-button
            >
            <el-button
                size="small"
                type="danger"
                @click="handleDelete2(scope.$index, scope.row)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFormVisible" title="新建关系" style="width: 25%" @closed="close1">
    <el-form :model="formRelation">
      <el-form-item label="关系名称" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formRelation.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="关系描述" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formRelation.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="主体选择" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-select v-model="obj_select" class="m-2" placeholder="Select">
          <el-option
              v-for="item in data"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客体选择" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-select v-model="sub_select" class="m-2" placeholder="Select">
          <el-option
              v-for="item in data"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createRelationcancel">取消</el-button>
        <el-button type="primary" @click="createRelationconfirm">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" title="编辑关系" style="width: 25%" @closed="close1">
    <el-form :model="formRelation">
      <el-form-item label="关系名称" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formRelation.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="关系描述" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formRelation.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="主体选择" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-select v-model="obj_select" class="m-2" placeholder="Select">
          <el-option
              v-for="item in data"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客体选择" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-select v-model="sub_select" class="m-2" placeholder="Select">
          <el-option
              v-for="item in data"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible2=false;createRelationcancel();">取消</el-button>
        <el-button type="primary" @click="editRelationconfirm">
          修改
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible"
      width="30%"
  >
    <span>你确定要删除该关系吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false;deleteRelationconfirm();">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible3" title="新建属性" style="width: 25%" @closed="close2">
    <el-form :model="formAttribute">
      <el-form-item label="属性名称" :label-width="formLabelWidth" :required=true style="width: 80%">
        <el-input v-model="formAttribute.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="属性描述" :label-width="formLabelWidth"  style="width: 80%">
        <el-input v-model="formAttribute.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="数据类型" :label-width="formLabelWidth" :required=true style="width: 50%">
        <el-select v-model="formAttribute.data_type" placeholder="请选择" value="-1">
          <el-option label="String" value=0 />
          <el-option label="Number" value=1 />
          <el-option label="Boolean" value=2 />
        </el-select>
      </el-form-item>
      <el-form-item label="允许为空" :label-width="formLabelWidth" :required=true style="width: 50%">
        <el-select v-model="formAttribute.empty" placeholder="请选择">
          <el-option label="是" value=true />
          <el-option label="否" value=false />
        </el-select>
      </el-form-item>
      <el-form-item label="默认值" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formAttribute.default" autocomplete="off" maxlength="70px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createAttributecancel">取消</el-button>
        <el-button type="primary" @click="createAttributeconfirm">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible4" title="编辑属性" style="width: 25%" @closed="close2">
    <el-form :model="formAttribute">
      <el-form-item label="属性名称" :label-width="formLabelWidth" :required=true style="width: 80%">
        <el-input v-model="formAttribute.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="属性描述" :label-width="formLabelWidth"  style="width: 80%">
        <el-input v-model="formAttribute.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="数据类型" :label-width="formLabelWidth" :required=true style="width: 50%">
        <el-select v-model="formAttribute.data_type" placeholder="请选择" value="-1">
          <el-option label="String" value=0 />
          <el-option label="Number" value=1 />
          <el-option label="Boolean" value=2 />
        </el-select>
      </el-form-item>
      <el-form-item label="允许为空" :label-width="formLabelWidth" :required=true style="width: 50%">
        <el-select v-model="formAttribute.empty" placeholder="请选择">
          <el-option label="是" value=true />
          <el-option label="否" value=false />
        </el-select>
      </el-form-item>
      <el-form-item label="默认值" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formAttribute.default" autocomplete="off" maxlength="70px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible4=false;createAttributecancel();">取消</el-button>
        <el-button type="primary" @click="editAttributeconfirm">
          修改
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible2"
      width="30%"
  >
    <span>你确定要删除该属性吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false;deleteAttributeconfirm();">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
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
import {useProjectsStore} from '../../../../stores/projects.js'
import {ElMessage} from "element-plus";
import {reactive, ref, toRaw, markRaw, Raw, onMounted} from "vue";
import axios from "axios";
import Qs from "qs";
import {useRoute} from "vue-router";
const projectsStore = useProjectsStore();
const obj_select = ref('')
const step0 = ref(null);
const step1 = ref(null);
const step2 = ref(null);
const step3 = ref(null);
const step = ref([step0, step1, step2, step3]);
const steptime = ref(0);
const stepnum = ref(0);
const progress_valible = ref(false);
const sub_select = ref('')
interface Option {
  value: number
  label: string
}
const generateData = () => {
  const entities = JSON.parse(JSON.stringify(projectsStore.currentProject.entities));
  console.log(entities)
  const data: Option[] = []
  for (let i = 0; i < entities.length; i++) {
    data.push({
      value: entities[i].name,
      label: entities[i].name,
    })
  }
  return data
}
const dialogFormVisible = ref(false)
function close1(){formRelation.name ='';formRelation.description=''; formRelation.index=-1;formRelation.attributes=[]; obj_select.value='', sub_select.value=''}
const dialogFormVisible2 = ref(false)
const dialogVisible = ref(false)
const formLabelWidth = '70px'
const pathuser = ref(useRoute().query.user);
const editSave = reactive({
  name:'',
  description:'',
  obj:'',
  sub:''
})
/*关系*/
interface Relation {
  name: string
  description: string
  index: number
  attributes: Attribute | null
  obj: string
  sub: string
}
interface Relationget {
  name: string
  description: string
  obj: string
  sub: string
}
const handleEdit = (index: number, row: Relation) => {
  dialogFormVisible2.value=true;
  formRelation.name = row.name;
  formRelation.description = row.description;
  formRelation.index = index;
  obj_select.value = row.obj
  sub_select.value = row.sub
  editSave.name = row.name
  editSave.description = row.description
  editSave.sub = row.sub
  editSave.obj = row.obj
}
const handleDelete = (index: number, row: Relation) => {
  dialogVisible.value=true;
  tempindex.value=index;
  temprelation.value=row;
  console.log(temprelation.value)
}
const formRelation = reactive({
  name: '',
  description: '',
  attributes: [],
  index:-1,
  obj:'',
  sub:'',
});
const currentRelation = reactive({
  name: '',
  description: '',
  attributes: [],
  index:-1,
  obj:'',
  sub:'',
});
const data = ref<Option[]>([]);
/*创建关系*/
function createRelation(){
  if(projectsStore.currentProject.index==-1){
    ElMessage.error('请选择项目');
    return;
  }
  data.value = generateData()
  dialogFormVisible.value=true;
}

function createRelationcancel(){
  dialogFormVisible.value = false;
  close1();
}
onMounted(()=> {
    if(projectsStore.currentProject.name!=null)
    {
      ElMessage.success("关系获取");
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
      }).catch(err => {
        console.log(err)
      })
      data.value = generateData()
    }
  }
)
function createRelationconfirm(){
  if(formRelation.name==''){
    ElMessage.error('请输入关系名称');
    return;
  }
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
      relation_name:formRelation.name,
      relation_description:formRelation.description,
      obj:obj_select.value,
      sub:sub_select.value
    }),
    // 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data=='True'){
      const newRelations = JSON.parse(JSON.stringify(projectsStore.currentProject.relations));
      newRelations.splice(newRelations.length,0, {
        name: toRaw(formRelation.name),
        description: toRaw(formRelation.description),
        attributes: [],
        index:newRelations.length,
        obj:toRaw(obj_select.value),
        sub:toRaw(sub_select.value)});
      projectsStore.currentProject.relations = newRelations;
      projectsStore.updateRelation();
      close1();
      dialogFormVisible.value = false;
      ElMessage({
        message: '创建成功！',
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
/*选择行*/
function handleRelationChange(val : Relation) {
  if(val==null) {
    return;
  }
  currentRelation.index = val.index;
  currentRelation.description = val.description;
  currentRelation.name=val.name;
  currentRelation.attributes=projectsStore.currentProject.relations[val.index].attributes;
}
/*编辑*/
function editRelationconfirm(){
  console.log('begin')
  if(formRelation.name==''){
    ElMessage.error('请输入关系名称');
    return;
  }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    // 有域名后端写法：url:'https://doubi.com/api/books'
    url: '/path/project/rel_edit/',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: Qs.stringify({
      user:pathuser.value,
      project:projectsStore.currentProject.name,
      save_name: editSave.name,
      save_description: editSave.description,
      save_obj: editSave.obj,
      save_sub: editSave.sub,
      relation_name:formRelation.name,
      relation_description:formRelation.description,
      obj:obj_select.value,
      sub:obj_select.value
    }),
    // 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data=='True'){
      const newRelations = JSON.parse(JSON.stringify(projectsStore.currentProject.relations));
      newRelations[formRelation.index].name=toRaw(formRelation.name);
      newRelations[formRelation.index].description=toRaw(formRelation.description);
      newRelations[formRelation.index].obj=toRaw(obj_select.value)
      newRelations[formRelation.index].sub=toRaw(sub_select.value)
      projectsStore.currentProject.relations = newRelations;
      projectsStore.updateRelation();
      close1();
      dialogFormVisible2.value = false;
      ElMessage({
        message: '编辑成功！',
        type: 'success',
        center:true
      })
    }
  }).catch(err=>{
    console.log(err)
  })
}
/*删除*/
const tempindex = ref(-1);
const temprelation=ref<Relation | null>(null);
function deleteRelationconfirm(){
  if(temprelation.value != null) {
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/rel_delete/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        user:pathuser.value,
        project:projectsStore.currentProject.name,
        name: temprelation.value.name,
        obj:temprelation.value.obj,
        sub:temprelation.value.sub,
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      if(res.data=='True'){
        if(currentRelation.index==(temprelation.value as Relation).index){
          currentRelation.index=-1;
          currentRelation.description='';
          currentRelation.name='';
          currentRelation.attributes=[];
        }
        projectsStore.currentProject.relations.splice(tempindex.value,1);
        projectsStore.updateRelation();
        ElMessage({
          message: '删除成功！',
          type: 'success',
          center:true
        })
      }
    }).catch(err=>{
      console.log(err)
    })
  }
}



/*上面是关系，下面是属性*/

/*关系属性*/
const datatype=['String', 'Number', 'Boolean']
interface Attribute {
  name: string
  data_type:number |null
  empty:boolean | null
  index:number
  default:null | any
  description: string
}
const dialogFormVisible3 = ref(false)
function close2(){formAttribute.name ='';formAttribute.description='';formAttribute.default=null;formAttribute.empty=null;formAttribute.index=-1;formAttribute.data_type=null;}
const dialogFormVisible4 = ref(false)
const dialogVisible2 = ref(false)
const handleEdit2 = (index: number, row: Attribute) => {
  console.log(row)
  dialogFormVisible4.value=true;
  formAttribute.name = row.name;
  formAttribute.description = row.description;
  formAttribute.default=row.default;
  formAttribute.data_type=row.data_type;
  formAttribute.empty=row.empty;
  formAttribute.index = index;
}
const handleDelete2 = (index: number, row: Attribute) => {
  dialogVisible2.value=true;
  tempindex2.value=index;
  tempAttribute.value=row;
}
const formAttribute = reactive({
  name: '',
  data_type: null as null | number,
  empty:null as null | boolean,
  index:-1,
  default:null,
  description:''
});
/*创建属性*/
function createAttribute(){
  if(currentRelation.index==-1){
    ElMessage.error('请选择关系');
    return;
  }
  dialogFormVisible3.value=true;
}
function createAttributecancel(){
  dialogFormVisible3.value = false;
  formAttribute.name ='';
  formAttribute.description='';
  formAttribute.default=null;
  formAttribute.empty=null;
  formAttribute.index=-1;
  formAttribute.data_type=null;
}
function createAttributeconfirm(){
  if(formAttribute.name==''){
    ElMessage.error('请输入属性名称');
    return;
  }
  if(formAttribute.data_type==null){
    ElMessage.error('请选择数据类型');
    return;
  }
  if(formAttribute.empty==null){
    ElMessage.error('请选择是否允许为空');
    return;
  }
  const newAttributes = JSON.parse(JSON.stringify(currentRelation.attributes));
  newAttributes.splice(newAttributes.length,0, {
    name: toRaw(formAttribute.name),
    description: toRaw(formAttribute.description),
    data_type: toRaw(formAttribute.data_type),
    empty: toRaw(formAttribute.empty),
    default: toRaw(formAttribute.default),
    index:newAttributes.length});
  currentRelation.attributes = newAttributes;
  projectsStore.currentProject.relations[currentRelation.index].attributes = newAttributes;
  projectsStore.updateRelation();
  close2();
  dialogFormVisible3.value = false;
  ElMessage({
    message: '创建成功！',
    type: 'success',
    center:true
  })
}
/*编辑*/
function editAttributeconfirm(){
  if(formAttribute.name==''){
    ElMessage.error('请输入属性名称');
    return;
  }
  if(formAttribute.data_type==null){
    ElMessage.error('请选择数据类型');
    return;
  }
  if(formAttribute.empty==null){
    ElMessage.error('请选择是否允许为空');
    return;
  }
  const newAttributes = JSON.parse(JSON.stringify(currentRelation.attributes));
  newAttributes[formAttribute.index].name= toRaw(formAttribute.name);
  newAttributes[formAttribute.index].description= toRaw(formAttribute.description);
  newAttributes[formAttribute.index].data_type= toRaw(formAttribute.data_type);
  newAttributes[formAttribute.index].empty= toRaw(formAttribute.empty);
  newAttributes[formAttribute.index].default= toRaw(formAttribute.default);
  currentRelation.attributes = newAttributes;
  projectsStore.currentProject.relations[currentRelation.index].attributes = newAttributes;
  projectsStore.updateRelation();
  if(currentRelation.index==formRelation.index){
    currentRelation.index=-1;
    currentRelation.description='';
    currentRelation.name='';
    currentRelation.attributes=[];
  }
  close2();
  dialogFormVisible4.value = false;
  ElMessage({
    message: '修改成功！',
    type: 'success',
    center:true
  })
}
/*删除*/
const tempindex2 = ref(-1);
const tempAttribute=ref<Attribute | null>(null);
function deleteAttributeconfirm(){
  projectsStore.currentProject.relations[currentRelation.index].attributes.splice(tempindex2.value, 1);
  projectsStore.updateRelation();
}

</script>
<style scoped>
#progress_valible{
  position: fixed;
  showClose: "false";
  right:40%;
  height:1%;
  opacity: 100%;
  top:50%;
  background-color: #7e7e7f;
  border: 1px solid #7e7e7f;
}
#program_get{
  position: fixed;
  showClose: "false";
  right:40%;
  height:0;
  opacity: 100%;
  top:50%;
  background-color: #7e7e7f;
  border: 1px solid #7e7e7f;
}

#progress_valible .el-dialog__headerbtn{
  display: none;
}
#program_get .el-dialog__headerbtn{
  display: none;
}
body {
  margin: 0;
  padding: 0;
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.steps {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 200px;
}
.step {
  width: 20px;
  height: 20px;
  background: #fff;
  border: 2px solid #ccc9d2;
  border-radius: 50%;
  transition: background 1s;
}
.step.selected {
  border: 2px solid #4B81BD;
}
.step.completed {
  border: 2px solid #4B81BD;
  background: #4B81BD;
}
.progress {
  position: absolute;
  width: 100%;
  height: 50%;
  border-bottom: 2px solid #ACACA6;
  z-index: -1;
}
.percent {
  position: absolute;
  width: 0;
  height: 100%;
  border-bottom: 2px solid #4B81BD;
  z-index: 1;
  transition: width 1s;
}
</style>