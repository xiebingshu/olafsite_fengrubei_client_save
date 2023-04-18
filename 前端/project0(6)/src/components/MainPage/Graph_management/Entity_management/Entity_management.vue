<template>
  <el-row  class="tac" style="height:100%;" gutter="0">
    <el-col :span="8">
      <el-row>
        <el-col :span="8">
          <div style="margin: 15px; font-size: 25px; font-weight: 450;">实体列表</div>
        </el-col>
        <el-col :span="4" :offset="9">
          <el-button style="margin: 15px 20px 25px" type="primary" size="large" @click="createEntity">新建实体</el-button>
        </el-col>
        <el-divider  style="margin: 10px 0"/>
      </el-row>
      <el-table :data="projectsStore.currentProject.entities"
                style="width: 100%;"
                :highlight-current-row="true"
                height="450"
                :row-style="{height:'10px'}"
                :cell-style="{padding:'12px 0px', textAlign: 'center'}"
                :header-cell-style="{textAlign: 'center'}"
                @current-change="handleEntityChange">
        <el-table-column label="实体名称" width="120">
          <template #default="scope">
            <el-popover data-effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>实体名称: {{ scope.row.name }}</div>
                <div>实体描述: {{ scope.row.description }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.name }}</el-tag>
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
          <div style="margin: 15px; font-size: 25px; font-weight: 450;">实体{{currentEntity.name}}属性列表</div>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button style="margin: 15px 20px 25px" type="primary" size="large" @click="createAttribute">新建属性</el-button>
        </el-col>
        <el-divider  style="margin: 10px 0px"/>
      </el-row>
      <el-table :data="currentEntity.attributes"
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
  <el-dialog v-model="dialogFormVisible" title="新建实体" style="width: 25%" @closed="close1">
    <el-form :model="formEntity">
      <el-form-item label="实体名称" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formEntity.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="实体描述" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formEntity.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createEntitycancel">取消</el-button>
        <el-button type="primary" @click="createEntityconfirm">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" title="编辑实体" style="width: 25%" @closed="close1">
    <el-form :model="formEntity">
      <el-form-item label="实体名称" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formEntity.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="实体描述" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formEntity.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible2=false;createEntitycancel();">取消</el-button>
        <el-button type="primary" @click="editEntityconfirm">
          修改
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible"
      width="30%"
  >
    <span>你确定要删除该实体吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false;deleteEntityconfirm();">
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
</template>

<script lang="ts" setup>
  import {useProjectsStore} from '../../../../stores/projects.js'
  import {ElMessage} from "element-plus";
  import {reactive, ref, toRaw, markRaw, Raw, watch} from "vue";
  import axios from "axios";
  import Qs from "qs";
  import {useRoute} from "vue-router";
  const pathuser=ref(useRoute().query.user);
  const projectsStore = useProjectsStore();
  const dialogFormVisible = ref(false)
  function close1(){formEntity.name ='';formEntity.description=''; formEntity.index=-1;formEntity.attributes=[];}
  const dialogFormVisible2 = ref(false)
  const dialogVisible = ref(false)
  const editsave = reactive({
    name:'',
    description:''
  })
  const formLabelWidth = '70px'
  /*实体*/
  interface Entity {
    name: string
    description: string
    index: number
    attributes: Attribute | null
  }
  const handleEdit = (index: number, row: Entity) => {
    dialogFormVisible2.value=true;
    formEntity.name = row.name;
    formEntity.description = row.description;
    formEntity.index = index;
  }
  const handleDelete = (index: number, row: Entity) => {
    dialogVisible.value=true;
    tempindex.value=index;
    tempentity.value=row;
    console.dir(index)
    console.dir(row)
    console.dir(tempindex)
    console.dir(tempentity)
  }
  const formEntity = reactive({
    name: '',
    description: '',
    attributes: [],
    index:-1
  });
  const currentEntity = reactive({
    name: '',
    description: '',
    attributes: [],
    index:-1
  });
  /*创建实体*/
  function createEntity(){
    if(projectsStore.currentProject.index==-1){
      ElMessage.error('请选择项目');
      return;
    }
    dialogFormVisible.value=true;
  }
  function createEntitycancel(){
    dialogFormVisible.value = false;
    close1();
  }
  function createEntityconfirm(){
    if(formEntity.name==''){
      ElMessage.error('请输入实体名称');
      return;
    }
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
        entity_name:formEntity.name,
        entity_description:formEntity.description
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      if(res.data=="True"){
        const newEntities = JSON.parse(JSON.stringify(projectsStore.currentProject.entities));
        newEntities.splice(newEntities.length,0, {
            name: toRaw(formEntity.name),
            description: toRaw(formEntity.description),
            attributes: [],
            index:newEntities.length});
        ElMessage({
          message: '创建成功！',
          type: 'success',
          center:true
        })
        projectsStore.currentProject.entities = newEntities;
        projectsStore.updateEntity();
        close1();
        dialogFormVisible.value = false;
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
  /*选择行*/
  function handleEntityChange(val : Entity) {
    if(val==null) {
      return;
    }
    console.dir(currentEntity);
    currentEntity.index = val.index;
    currentEntity.description = val.description;
    currentEntity.name=val.name;
    currentEntity.attributes=projectsStore.currentProject.entities[val.index].attributes;
    console.dir(val);
  }
  /*编辑*/
  function editEntityconfirm(){
    if(formEntity.name==''){
      ElMessage.error('请输入实体名称');
      return;
    }
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/entity_edit/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        user:pathuser.value,
        project:projectsStore.currentProject.name,
        entity_pastname:currentEntity.name,
        entity_newname:formEntity.name,
        entity_newdescription:formEntity.description
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      if(res.data=="True"){
        ElMessage({
          message: '编辑成功！',
          type: 'success',
          center:true
        })
        const newEntities = JSON.parse(JSON.stringify(projectsStore.currentProject.entities));
        newEntities[formEntity.index].name=toRaw(formEntity.name);
        newEntities[formEntity.index].description=toRaw(formEntity.description);
        projectsStore.currentProject.entities = newEntities;
        projectsStore.updateEntity();
        if(currentEntity.index==formEntity.index){
          currentEntity.index=-1;
          currentEntity.description='';
          currentEntity.name='';
          currentEntity.attributes=[];
        }
        close1();
        dialogFormVisible2.value = false;
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
  /*删除*/
  const tempindex = ref(-1);
  const tempentity=ref<Entity | null>(null);
  function deleteEntityconfirm(){
    console.dir(tempindex)
    console.dir(tempentity)
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      // 有域名后端写法：url:'https://doubi.com/api/books'
      url: '/path/project/entity_delete/',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: Qs.stringify({
        user:pathuser.value,
        project:projectsStore.currentProject.name,
        entity_name:currentEntity.name,
      }),
      // 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      if(res.data == "False"){
        ElMessage({
          message: '报错，是bug',
          type: 'warning',
          center:true
        })
      }
      if(currentEntity.index==(tempentity.value as Entity).index){
        currentEntity.index=-1;
        currentEntity.description='';
        currentEntity.name='';
        currentEntity.attributes=[];
      }
      projectsStore.currentProject.entities.splice(tempindex.value,1);
      projectsStore.updateEntity();
      ElMessage.success('删除成功')
    }).catch(err=>{
      console.log(err)
    })
  }



  /*上面是实体，下面是属性*/

  /*实体属性*/
  const datatype=['String', 'Number', 'Boolean']
  interface Attribute {
    name: string
    data_type:number |null
    empty:null | boolean
    index:number
    default:null | any
    description: string
  }
  const dialogFormVisible3 = ref(false)
  function close2(){formAttribute.name ='';formAttribute.description='';formAttribute.default=null;formAttribute.empty=null;formAttribute.index=-1;formAttribute.data_type=null;}
  const dialogFormVisible4 = ref(false)
  const dialogVisible2 = ref(false)
  const handleEdit2 = (index: number, row: Attribute) => {
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
    if(currentEntity.index==-1){
      ElMessage.error('请选择实体');
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
    const newAttributes = JSON.parse(JSON.stringify(currentEntity.attributes));
    newAttributes.splice(newAttributes.length,0, {
      name: toRaw(formAttribute.name),
      description: toRaw(formAttribute.description),
      data_type: toRaw(formAttribute.data_type),
      empty: toRaw(formAttribute.empty),
      default: toRaw(formAttribute.default),
      index:newAttributes.length});
    currentEntity.attributes = newAttributes;
    projectsStore.currentProject.entities[currentEntity.index].attributes = newAttributes;
    projectsStore.updateEntity();
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
    const newAttributes = JSON.parse(JSON.stringify(currentEntity.attributes));
    newAttributes[formAttribute.index].name= toRaw(formAttribute.name);
    newAttributes[formAttribute.index].description= toRaw(formAttribute.description);
    newAttributes[formAttribute.index].data_type= toRaw(formAttribute.data_type);
    newAttributes[formAttribute.index].empty= toRaw(formAttribute.empty);
    newAttributes[formAttribute.index].default= toRaw(formAttribute.default);
    currentEntity.attributes = newAttributes;
    projectsStore.currentProject.entities[currentEntity.index].attributes = newAttributes;
    projectsStore.updateEntity();
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
    projectsStore.currentProject.entities[currentEntity.index].attributes.splice(tempindex2.value, 1);
    projectsStore.updateEntity();
  }

</script>
<style scoped>
</style>