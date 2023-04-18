<template>
<!--  <el-dialog v-model="router_display" title="数据库入口" style="text-align: center">-->
<!--    <el-link :underline="false" type="primary" :icon="Edit" href="http://localhost:7474/browser/">Neo4j入口</el-link>-->
<!--    <br>-->
<!--    <el-text class="mx-1" size="large" type="primary" style="margin-top: 50px;">Large</el-text>-->
<!--  </el-dialog>-->
  胜利往往在再坚持一下的努力当中
  <div id="myChart" style="height: 800px;">
  </div>
</template>

<script setup>
import axios from 'axios'
import {onMounted, ref, toRaw} from "vue";
import Qs from "qs";
import {ElMessage} from "element-plus";
import { Edit, View as IconView } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import {useRoute} from "vue-router";
import {useProjectsStore} from '../../../../../stores/projects'
const pathuser=ref(useRoute().query.user);
const router_display = ref(false)
const projectsStore=useProjectsStore();
const entitys = ref([])
const rels = ref([])
const labels = ref([])
const labels2 = ref([])
onMounted(()=>{
  entitys.value = []
  rels.value = []
  labels.value = []
  labels2.value = []
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
      entitys.value.push({
        name: res.data.names[i],
        category: res.data.descriptions[i]
      })
      if (labels.value.indexOf(res.data.descriptions[i]) === -1) {
        labels.value.push(res.data.descriptions[i])
        labels2.value.push({
          name: res.data.descriptions[i],
          symbolSize: 60,
        })
      }
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
    for(var i = 0; i<res.data.count; i++){
      rels.value.push({
        source: res.data.objs[i],
        target: res.data.subs[i],
        name: res.data.names[i],
      })
    }
    console.log(entitys.value)
    console.log(rels.value)
    console.log(labels.value)
    let myChart = echarts.init(document.getElementById("myChart"));
    myChart.setOption({
      backgroundColor: '#EEF1F3',
      color: ["#ee6666", "#91cc75", "#fac858", "#5470c6", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
      title: {
        text: "关系图谱",
        textStyle: {
          color: "#000",
          fontWeight: 700,
          left: "center"
        }
      },
      tooltip: {
        formatter: function(x) {
          return x.data.name;
        },
      },
      legend: [{ //图例
        x: "right",
        show: true,
        data: labels.value
      }],
      series: [{
        type: "graph",
        legendHoverLink: true,
        layout: "force",
        categories: labels2.value,
        force: {
          repulsion: [1000, 2000], //节点之间的斥力因子,支持设置成数组表达斥力的范围
          edgeLength: [60, 70],
          layoutAnimation: true,
          friction: 0.1, //节点的移动速度。取值范围 0 到 1。
        },
        symbolSize: 60,
        itemStyle: {
          shadowColor: "#666",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        draggable: true, //节点是否可拖拽，只在使用力引导布局的时候有用。
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 8],
        cursor: 'pointer',
        label: {
          show: true, // 图形上的文本标签， 可用于说明图形的一些数据信息， 比如值， 名称等
          fontStyle: "oblique",
          // position: "top",
          fontSize: 12,
          color: '#000', //如果设置为 'inherit'，则为视觉映射得到的颜色，如系列色。
          width: 100,
          overflow: "break", //文字超出宽度是否截断或者换行。配置width时有效
        },
        labelLayout: {
          moveOverlap: 'shiftX', //在标签重叠的时候是否挪动标签位置以防止重叠。
          draggable: true, //标签是否可以允许用户通过拖拽二次调整位置。
        },
        emphasis: {
          scale: true, //是否开启高亮后节点的放大效果。
          focus: 'adjacency'
        },
        lineStyle: {
          color: "#666",
          width: 2,
          curveness: 0, //关系线的曲度，支持从 0 到 1 的值，值越大曲度越大。
        },
        edgeLabel: {
          show: false,
          fontWeight: 800,
          color: "#000",
          formatter: function(x) {
            return x.data.name
          },
        },
        data: entitys.value,
        links: rels.value
      },
      ],
    });
    window.onresize = function () { // 自适应大小
      myChart.resize();
    };
  }).catch(err => {
    console.log(err)
  })
})
</script>

<style scoped>

</style>