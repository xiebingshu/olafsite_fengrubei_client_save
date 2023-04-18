import {createRouter,createWebHashHistory} from 'vue-router'
// 1. 定义路由组件.
// 也可以从其他文件导入
/*import Login from '../components/Login/Login.vue'
import MainPage from '../components/MainPage/MainPage.vue'
import NotFound from '../components/NotFound/NotFound.vue'*/
const Login=()=>import('../components/Login/Login.vue')
const MainPage=()=>import('../components/MainPage/MainPage.vue')
const NotFound=()=>import('../components/NotFound/NotFound.vue')
const Dinosaur=()=>import('../components/MainPage/Dinosaur/Dinosaur.vue')
const Data_management=()=>import('../components/MainPage/Graph_management/Data_management/Data_management.vue')
const Entity_management=()=>import('../components/MainPage/Graph_management/Entity_management/Entity_management.vue')
const Relationship_management=()=>import('../components/MainPage/Graph_management/Relationship_management/Relationship_management.vue')
const Detailed_information=()=>import('../components/MainPage/Graph_construction/Graph_query/Detailed_information/Detailed_information.vue')
const Graph_visualization=()=>import('../components/MainPage/Graph_construction/Graph_query/Graph_visualization/Graph_visualization.vue')
const Path_relationship=()=>import('../components/MainPage/Graph_construction/Graph_query/Path_relationship/Path_relationship.vue')
const Knowledge_extraction=()=>import('../components/MainPage/Graph_construction/Knowledge_extraction/Knowledge_extraction.vue')
const Knowledge_fusion=()=>import('../components/MainPage/Graph_construction/Knowledge_fusion/Knowledge_fusion.vue')
const Project_management=()=>import('../components/MainPage/Project_management/Project_management.vue')
const About=()=>import('../components/MainPage/About/About.vue')

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    { path: '/login', component: Login },
    { path: '/mainpage',
      component: MainPage,
      children:[
          { path:'project_management',component: Project_management ,name:"项目管理"},


          { path:'graph_management/data_management',component: Data_management,name:"数据管理"},
          { path:'graph_management/entity_management',component: Entity_management,name:"实体管理"},
          { path:'graph_management/relationship_management',component: Relationship_management,name:"关系管理"},


          { path:'graph_construction/knowledge_extraction',component:Knowledge_extraction,name:"知识抽取"},
          { path:'graph_construction/knowledge_fusion',component:Knowledge_fusion,name:"知识融合"},

          { path:'graph_construction/graph_query/detailed_information',component:Detailed_information,name:"详细信息"},
          { path:'graph_construction/graph_query/graph_visualization',component:Graph_visualization,name:"图谱可视化"},
          { path:'graph_construction/graph_query/path_relationship',component:Path_relationship,name:"路径关系"},


          { path:'dinosaur',component:Dinosaur,name:"休息一下"},
          {path:'about',component:About,name:"关于"}
      ]},
    { path: '/:path(.*)', component: NotFound },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
export default router