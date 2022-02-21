<template>
    <h6 class="text-center mb-3">ADMINISTRACIÓN DE AULAS</h6> <hr>

    <div>
    <form @submit.prevent="saveAula()">
        <div class="modal fade show" id="aulaModal" tabindex="-1" aria-hidden="true" v-show="showModal">

        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="aulaModalLabel">Aula id : {{aula.id_aula}}</h5>
                    <button type="button" class="btn-close" @click="hideModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-2">
                        <label for="tipo" class="col-sm-4 form-label">Nombre:</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control form-control-sm"
                                    id="nombre" required
                                    v-model.trim="aula.nombre"    
                            >   <!-- {{ aula.nombre }} -->
                        </div>
                    </div> 
                    <div class="row mb-2">
                        <label for='cap' class="col-sm-4 form-label">Capacidad:</label>
                        <div class="col-sm-8">
                            <input type="number" class="form-control form-control-sm"
                                    id="cap" required 
                                    v-model.number="aula.capacidad"
                            >    <!-- {{aula.capacidad}} -->
                        </div>
                    </div> 
                    <div class="row mb-2">
                        <label for="tipo" class="col-sm-4 form-label">Tipo Aula:</label>
                        <div class="col-sm-8">
                            <select class="form-select form-select-sm"
                                    id="tipo" required 
                                    v-model="aula.id_tipo_aula"
                            >
                                <option disabled :value="null">Elige Tipo Aula</option>
                                <option v-for="tipo in tipoAula" 
                                        :key="tipo.id_tipo_aula"
                                        :value="tipo.id_tipo_aula">
                                        {{ tipo.descripcion }}
                                </option>
                            </select> <!-- {{ aula.id_tipo_aula }} -->
                        </div>
                    </div>
                    <div class="row mb-2">
                        <label for="bloque" class="col-sm-4 form-label">Bloque:</label>
                        <div class="col-sm-8">
                            <select class="form-select form-select-sm"
                                    id="bloque" required
                                    v-model="aula.id_bloque" 
                            >
                                <option disabled :value="null">Elige Bloque</option>
                                <option v-for="bloque in bloques" 
                                    :key="bloque.id_bloque"
                                    :value="bloque.id_bloque">
                                    {{ bloque.nombre}}
                                </option>
                            </select> <!-- {{ aula.id_bloque }} -->
                        </div>
                    </div>           
                </div>
                <div class="modal-footer">                    
                    <button type="submit" class="btn btn-success btn-sm"><i class="fas fa-save"></i> {{showUpdateModal?'MODIFICAR':'GUARDAR'}}</button>
                    <button type="button" class="btn btn-primary btn-sm" @click="hideModal()"><i class="far fa-times-circle"></i> CANCELAR</button>
                </div>
            </div>
        </div>
        </div>
    </form> 
  </div>


    <div class="float-end mb-3">
        <button class="btn btn-new btn-sm" @click="openModal()">AÑADIR</button>
    </div>
    <div class="p-3"> 
        <table class="table table-hover table-sm table-bordered">
            <thead class="table-dark text-center">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">NOMBRE</th>
                    <th scope="col">TIPO AULA</th>
                    <th scope="col">CAP</th>
                    <th scope="col">BLOQUE</th>
                    <th scope="col">OPCIONES</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(aula, index) in aulas" :key="index">
                    <td class = "text-center"> {{ aula.id_aula }} </td>
                    <td> {{ aula.nombre }} </td>
                    <td class="text-center"> {{ aula.tipo_aula.descripcion }} </td>
                    <td class="text-center"> {{ aula.capacidad }} </td>
                    <td class="text-center"> {{ aula.bloque.nombre }} </td>
                    <td class="text-center">
                        <button class="btnactualizar" title="Actualizar" @click="editAula(aula)"> <i class="fas fa-recycle"></i> </button> 
                    </td> 
                </tr>
            </tbody>
        </table>
    </div>
    
</template>

<script>
import * as admAulasService from "@/services/admAulasService.js"; 

export default {
    name: 'IndexAulas',
    components: {},
    data () {
        return {
            aulas: [],
            bloques: [],
            tipoAula: [],
            aula: {
                id_tipo_aula: null,
                id_bloque: null,
                nombre: '',
                capacidad: 50
            },
            showModal: false,
            showUpdateModal: false,
        }
    },
    methods: {
        async getAulas() {
            try {
                let res = await admAulasService.getAulasTorre();
                this.aulas = res.data.data;    
                //console.log(res.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async getBloques(){
            try {
                let res = await admAulasService.getBloquesTorre()
                this.bloques = res.data.data
                //console.log(res.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async getTipoAula(){
            try {
                let res = await admAulasService.getTipoAulasTorre()
                this.tipoAula = res.data.data
                //console.log(res.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async saveAula() {
            if (this.showUpdateModal) {
                try {                     
                    let resAula = await admAulasService.updateAulaTorre(this.aula.id_aula, {
                        id_tipo_aula: this.aula.id_tipo_aula,
                        id_bloque: this.aula.id_bloque,
                        nombre: this.aula.nombre.toUpperCase(),
                        capacidad: this.aula.capacidad
                    })
                    this.hideModal()
                    this.getAulas()
                    //console.log(resAula);
                } catch (error) {
                    console.log(error);
                }
            } else {
                if (this.aula) {
                    try {
                        let igual = null
                        igual = this.aulas.find( res => {
                        if(res.nombre === this.aula.nombre)
                            return res
                        })
                        if(igual){
                            this.$swal({
                                position: 'center',
                                icon: 'warning',
                                title: 'FALLO!',
                                text: 'el aula con el nombre: '+igual.nombre+' YA EXISTE en la base de datos',
                                showConfirmButton: false,
                            })
                        }else{
                            let res = await admAulasService.createAulaTorre({
                                id_tipo_aula: this.aula.id_tipo_aula,
                                id_bloque: this.aula.id_bloque,
                                nombre: this.aula.nombre.toUpperCase(),
                                capacidad: this.aula.capacidad
                            });
                        }
                        
                        //console.log(res);
                        this.hideModal();
                        this.getAulas(); 
                    } catch (error) {
                        console.log(error);
                    }  
                } 
            }         
        },
        openModal(){
            this.showModal = true
        },
        hideModal() {
            this.showModal = false;
            this.showUpdateModal = false
            this.aula = {
                    id_tipo_aula: null,
                    id_bloque: null,
                    nombre: '',
                    capacidad: 50
            } 
        },
        editAula(data) {
            //console.log(data.id_aula);
            this.aula = data;
            this.showUpdateModal = true
            this.openModal()   
        },   
    },
    mounted() {
        this.getAulas()
        this.getTipoAula()
        this.getBloques()
    }
}
    
</script>

<style lang="scss" scoped>
.form-select{
    font-size: 12px;
}
input {
    text-transform:uppercase;
}
#aulaModal {
    display: block
}
.fa-recycle{
    color: green;
}
.btnactualizar:hover {
    background-color: #ff7300;
}
.btnactualizar {
   border-radius: 50%;
   border: none;
}
.btn-new {
    background-color: #00244e;
    border: none;
    color: white;
}
.btn-new:hover {
    background-color: #ff7300;
}
.fa-recycle:hover {
    background-color: #ff7300;
    color: white;
}

</style>
