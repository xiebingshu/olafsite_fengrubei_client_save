<template>
  <el-row  class="tac" style="height:100%;" gutter="0">
    <el-col :span="21" :offset="1">
      <el-row>
        <el-col :span="8">
          <div style="margin: 15px; font-size: 25px; font-weight: 450;">数据列表</div>
        </el-col>
        <el-col :span="4" :offset="9">
          <el-button style="margin: 15px 20px 25px" type="primary" size="large" @click="createData">新建数据</el-button>
        </el-col>
        <el-divider  style="margin: 10px 0"/>
      </el-row>
      <el-table :data="projectsStore.currentProject.datas"
                style="width: 100%;"
                :highlight-current-row="true"
                height="450"
                :row-style="{height:'10px'}"
                :cell-style="{padding:'12px 0px', textAlign: 'center'}"
                :header-cell-style="{textAlign: 'center'}">
        <el-table-column label="数据名称" width="120">
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
        <el-table-column label="数据类型" width="180">
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
  </el-row>
  <el-dialog v-model="dialogFormVisible" title="新建数据" style="width: 25%; top: 10%" @closed="close1">
    <el-form :model="formData">
      <el-form-item label="数据名称" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formData.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="数据描述" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formData.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="数据类型" :required=true :label-width="formLabelWidth" style="width: 50%">
        <el-select v-model="formData.type" placeholder="请选择模型" value="-1">
          <el-option label="文件" value=0 />
          <el-option label="文本" value=1 />
<!--          <el-option label="自动" value=2 />-->
        </el-select>
      </el-form-item>
<!--      <el-form-item label="数据内容" :required=true :label-width="formLabelWidth" style="width: 80%">-->
<!--        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 6}" v-model="formData.content" autocomplete="off" maxlength="70px"/>-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createDatacancel">取消</el-button>
        <el-button type="primary" @click="createDataconfirm">
          下一步
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogUpdateVisible1" title="输入数据" style="width: 25%; top: 10%" @closed="close2">
        <el-input type="textarea" v-model="textarea" maxlength="1000" show-word-limit resize="none" :rows="10" style="height: 200px"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadcancel">取消</el-button>
        <el-button type="primary" @click="uploadcreate">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogUpdateVisible2" title="上传文件" style="width: 25%; top: 10%" @closed="close2">
    <el-upload
        style="text-align: center;align-content: center"
        class="file-import"
        ref="uploadFile"
        action="#"
        accept=".txt"
        drag
        :auto-upload="true"
        :file-list="fileList"
        :limit="1"
        :before-upload="beforeUpload"
        :http-request="uploadMethod"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖至此处或点击上传</div>
      <el-progress style="width: 100%; margin-top: 30px" :text-inside="true" :stroke-width="20" :percentage="progressPercent" />
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadcancel">取消</el-button>
        <el-button type="primary" @click="uploadcreate">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible2" title="编辑数据" style="width: 25%">
    <el-form :model="formData">
      <el-form-item label="数据名称" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formData.name" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="数据描述" :label-width="formLabelWidth" style="width: 80%">
        <el-input v-model="formData.description" autocomplete="off" maxlength="70px"/>
      </el-form-item>
      <el-form-item label="数据类型" :required=true :label-width="formLabelWidth" style="width: 50%">
        <el-select v-model="formData.type" placeholder="请选择模型" value="-1">
          <el-option label="URL" value=0 />
          <el-option label="文本" value=1 />
          <el-option label="自动" value=2 />
        </el-select>
      </el-form-item>
      <el-form-item label="数据内容" :required=true :label-width="formLabelWidth" style="width: 80%">
        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 6}" v-model="formData.content" autocomplete="off" maxlength="70px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible2=false;createDatacancel();">取消</el-button>
        <el-button type="primary" @click="editDataconfirm">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible"
      width="30%"
  >
    <span>你确定要删除该数据吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false;deleteDataconfirm();">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const datatype=['URL', '文本', '自动']
import {computed, ref, reactive, toRaw, watch} from 'vue'
import {ElMessage} from "element-plus";
import {useProjectsStore} from '../../../../stores/projects.js'
const projectsStore = useProjectsStore();
const dialogFormVisible = ref(false)
function close1(){formData.name ='';formData.description=''; formData.index=-1;formData.type=null;formData.content='';}
function close2(){formData_save.name ='';formData_save.description=''; formData_save.index=-1;formData_save.type=null;formData_save.content='';fileList.value=[];progressPercent.value=0}
const dialogFormVisible2 = ref(false)
const dialogVisible = ref(false)
const dialogUpdateVisible1 = ref(false)
const dialogUpdateVisible2 = ref(false)
const formLabelWidth = '70px'
const formData =reactive({
  name: '',
  description: '',
  type: null as null| number,
  index: -1,
  content: ''
})
const formData_save = reactive({
  name: '',
  description: '',
  type: null as null| number,
  index: -1,
  content: ''
})
interface Data {
  name: string
  description: string
  type: null | number
  index: number
  content: string
}

/*const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)*/
const handleEdit = (index: number, row: Data) => {
  dialogFormVisible2.value=true;
  formData.name = row.name;
  formData.description = row.description;
  formData.content=row.content;
  formData.type=row.type;
  formData.index = index;
}
const handleDelete = (index: number, row: Data) => {
  dialogVisible.value=true;
  tempindex.value=index;
  tempdata.value=row;
}
function uploadcancel(){
  dialogUpdateVisible1.value = false
  dialogUpdateVisible2.value = false
  close1()

}
/*创建实体*/
function createData(){
  if(projectsStore.currentProject.index==-1){
    ElMessage.error('请选择项目');
    return;
  }
  dialogFormVisible.value=true;
}
function createDatacancel(){
  dialogFormVisible.value = false;
  close1();
}
function createDataconfirm(){
  if(formData.name==''){
    ElMessage.error('请输入数据名称');
    return;
  }
  if(formData.type==null){
    ElMessage.error('请输入数据类型');
    return;
  }
  if(formData.type==0){
    dialogUpdateVisible2.value = true
  }
  if(formData.type==1){
    dialogUpdateVisible1.value = true
  }
  formData_save.name = formData.name
  formData_save.type = formData.type
  progressPercent.value = 0
  formData_save.description = formData.description
  dialogFormVisible.value = false
}
function uploadcreate(){
  if(formData_save.type==1)
  {
    formData_save.content = textarea.value
    if(formData_save.content==""){
      ElMessage.error("请输入数据")
      return
    }
  }
  console.log(formData_save.content)
  console.log(formData_save.type)
  axios({
    url: '/path/project/file_upload/',
    method: 'post',
    data: Qs.stringify({
      username:pathuser.value,
      project:projectsStore.currentProject.name,
      name:formData_save.name,
      description:formData_save.description,
      type:formData_save.type,
      content:formData_save.content
    }),
  }).then(res => {
    if(res.data=="True"){
      const newDatas = JSON.parse(JSON.stringify(projectsStore.currentProject.datas));
      newDatas.splice(newDatas.length,0, {
        name: toRaw(formData_save.name),
        description: toRaw(formData_save.description),
        type: toRaw(formData_save.type),
        content: toRaw(formData_save.content),
        index:newDatas.length});
      projectsStore.currentProject.datas = newDatas;
      projectsStore.updateData();
      dialogUpdateVisible1.value = false
      dialogUpdateVisible2.value = false
      close1();
      close2();
      console.log(progressPercent.value)
      ElMessage({
        message: '创建成功！',
        type: 'success',
        center:true
      })
    }
  }).catch((err) => {
    dialogUpdateVisible1.value = false
    dialogUpdateVisible2.value = false
    close1();
    close2();
    console.log(err);
  });

}
/*编辑*/
function editDataconfirm(){
  if(formData.name==''){
    ElMessage.error('请输入数据名称');
    return;
  }
  if(formData.type==null){
    ElMessage.error('请输入数据类型');
    return;
  }
  if(formData.content==''){
    ElMessage.error('请输入数据内容');
    return;
  }
  const newDatas = JSON.parse(JSON.stringify(projectsStore.currentProject.datas));
  newDatas[formData.index]={
    name: toRaw(formData.name),
    description: toRaw(formData.description),
    type: toRaw(formData.type),
    content: toRaw(formData.content),
    index:toRaw(formData.index)};
  projectsStore.currentProject.datas = newDatas;
  projectsStore.updateData();
  close1();
  dialogFormVisible2.value = false;
  ElMessage({
    message: '创建成功！',
    type: 'success',
    center:true
  })
}
/*删除*/
const tempindex = ref(-1);
const tempdata=ref<Data | null>(null);
function deleteDataconfirm(){
  projectsStore.currentProject.datas.splice(tempindex.value,1);
  projectsStore.updateData();
}
const textarea = ref("");
const progressPercent = ref(0);
import { UploadFilled } from '@element-plus/icons-vue'
import axios from "axios";
import Qs from "qs";
import {useRoute} from "vue-router";
const pathuser=ref(useRoute().query.user);
const formdata = new FormData()
const fileList = ref([]);// 文件列表
let filetimer=ref(0)
const beforeUpload = (file: any) => {
  const strs = file.name.split('.')
  const suffix = strs[strs.length - 1]
  if (!['txt'].includes(suffix)) {
    ElMessage.warning('只能上传文本文件')
    return false
  } else {
    return true
  }
}
// const uploadMethod = (option :any) => {
//   progressPercent.value = 0;
//   let reader = new FileReader();
//   reader.readAsText(option.file,"utf-8");
//   reader.onload = (e) => {
//     if(e.target != null){
//       if(typeof(e.target.result)=="string"){
//         formData_save.content = e.target.result
//       }
//     }
//   }
//   formdata.append('file',fileList.value[0] as File)
//   console.log(formdata)
//   console.log(formdata.get('file'))
//   axios.post('/path/upload_file/', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   }).then(response => {
//     console.log(response.data)
//   })
//   filetimer.value = window.setInterval(()=>{
//     if(progressPercent.value <= 99){
//       progressPercent.value++;
//     }
//     else{
//       clearInterval(filetimer.value)
//     }
//   },10)
// }
const uploadMethod = (option :any) => {
  progressPercent.value = 0;
  let reader = new FileReader();
  reader.readAsText(option.file,"utf-8");
  reader.onload = (e) => {
    if(e.target != null){
      if(typeof(e.target.result)=="string"){
        formData_save.content = e.target.result
      }
      console.log(formData_save.content)
    }
  }
  filetimer.value = window.setInterval(()=>{
    if(progressPercent.value <= 99){
      progressPercent.value++;
    }
    else{
      clearInterval(filetimer.value)
    }
  },10)
}
</script>

<style scoped>

</style>