import {defineStore} from 'pinia'
import {ref, toRaw,markRaw} from 'vue'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useProjectsStore = defineStore('Projects', () => {
    const projects=ref(Array());
    const count=ref(0)
    const user_complete=ref(false)
    const project_get = ref(false)
    const currentProject = ref({
        name: '',
        module: null as null | number,
        index: -1 as number,
        entities:[] as any,
        relations:[] as any,
        datas:[] as any,
        missions:[] as any,
    })
    const currentMission = ref({
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

    function pushProject(name0: string, module0: number){
        const tempIndex = count.value;
        projects.value.push({
            name: name0,
            module: module0,
            index: tempIndex,
            entities:[] as any,
            relations:[] as any,
            datas:[] as any,
            missions:[] as any,
            complete: false
        });
        count.value++;
    }
    function moveProject(num:number){
        projects.value.splice(num,1)
        count.value--;
        console.dir(num);
        console.dir(currentProject.value.index);
        if(currentProject.value.index==num){
            currentProject.value.index = -1;
            currentProject.value.module=null;
            currentProject.value.name='';
        }
        updateindex();
    }
    function updateProject(){
        // @ts-ignore
        currentProject.value={
            name: '',
            module: null as null | number,
            index: -1 as number,
            entities:[] as any,
            relations:[] as any,
            datas:[] as any,
            missions:[] as any
        }
    }
    function updateProject2(num :number){
        // @ts-ignore
        const project0=projects.value[num];
        currentProject.value.name=project0.name;
        currentProject.value.module=project0.module;
        currentProject.value.index=project0.index;
        currentProject.value.entities=project0.entities;
        currentProject.value.relations=project0.relations;
        currentProject.value.datas=project0.datas;
        currentProject.value.missions=project0.missions;
    }
    function updateindex(){
        for(let i=0;i<count.value;i++){
            const temp=i;
            // @ts-ignore
            projects.value[i].index=temp;
        }
    }
    function updateEntity(){
        for(let i=0;i<currentProject.value.entities.length;i++){
            currentProject.value.entities[i].index=i;
        }
        projects.value[currentProject.value.index].entities = JSON.parse(JSON.stringify(currentProject.value.entities))
    }
    function updateRelation(){
        for(let i=0;i<currentProject.value.relations.length;i++){
            currentProject.value.relations[i].index=i;
        }
        projects.value[currentProject.value.index].relations = JSON.parse(JSON.stringify(currentProject.value.relations))
    }
    function updateData(){
        for(let i=0;i<currentProject.value.datas.length;i++){
            currentProject.value.datas[i].index=i;
        }
        projects.value[currentProject.value.index].datas = JSON.parse(JSON.stringify(currentProject.value.datas))
    }
    function updateMission(){
        for(let i=0;i<currentProject.value.missions.length;i++){
            currentProject.value.missions[i].index=i;
        }
        projects.value[currentProject.value.index].missions = JSON.parse(JSON.stringify(currentProject.value.missions))
    }


    return{projects,user_complete,count,pushProject,moveProject,currentProject: currentProject,updateProject,updateProject2,updateEntity,updateRelation,updateData,updateMission,currentMission,project_get}
})