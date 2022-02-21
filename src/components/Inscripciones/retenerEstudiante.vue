<template>
    <div class="container mt-5">
        <div class="container my-2 d-flex justify-content-end">
            <router-link :to="`/estudiante/${this.$route.params.id_datos_estudiante}`" class="link">
                <button class="btn btn-dark"><i class="fas fa-undo"></i> volver</button>
            </router-link>
            
        </div>

        <div v-show="deudas.length > 0" class="container">
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">ESTUDIANTE CON DEUDAS?</h4>
                <p>El estudiante <strong>{{this.$route.params.nombre}}</strong>, tiene deudas pendientes que pagar. Para realizar la pre-inscripcion, debe estar al dia con sus deudas.</p>
                <hr>
                <p class="mb-0">Una vez completado el pago de sus deudas, el sistema le habilitara para realizar la <strong>PRE-INSCRIPCION</strong> en la gestion <strong>{{this.$route.params.descripcion}}</strong>.</p>
            </div>
        </div>

        <div v-show="deudas.length > 0" class="container">
            <table class="table table-sm table-bordered table-hover">
                <thead class="table-dark">
                <tr>
                    <th class="text-center">Nº</th>
                    <th class="text-center">Gestión</th>
                    <th class="text-center">Item</th>
                    <th class="text-center">Deuda</th>                    
                </tr>
                </thead>
                <tbody>
                <tr v-for="(deuda, index) in deudas" :key="index">
                    <td class="text-center">{{index + 1}}</td>
                    <td class="text-center">{{deuda.descripcion}}</td>
                    <td class="text-center">{{deuda.id_item_seguimiento}}</td>
                    <td class="total">{{deuda.monto_deuda}}</td>
                </tr>
                <tr>    
                    <td colspan="3" class="text-center"><h5>Total Deuda a Pagar</h5></td>
                    <td class="total"><h5><strong>{{total}}</strong></h5></td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-show="documentos.length > 0" class="container">
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">ESTUDIANTE CON DOCUMENTOS PENDIENTES?</h4>
                <p>El estudiante <strong>{{this.$route.params.nombre}}</strong>, tiene documentos pendientes por entregar. Para poder inscribirse, pase por DAR a entregar sus documentos.</p>
                <hr>
                <p class="mb-0">Una vez completada la entrega de documentos pendientes, podrá realizar la <strong>PRE-INSCRIPCION</strong> en la gestion <strong>{{this.$route.params.descripcion}}</strong>.</p>
            </div>
        </div>

        <div v-show="documentos.length > 0" class="container">
            <table class="table table-sm table-bordered table-hover">
                <thead class="table-dark">
                <tr>
                    <th class="text-center">Nº</th>
                    <th class="text-center">Documento</th>
                    <th class="text-center">Descripcion</th>
                    <th class="text-center">Fecha Plazo</th>                    
                </tr>
                </thead>
                <tbody>
                <tr v-for="(doc, index) in documentos" :key="index">
                    <td class="text-center">{{index + 1}}</td>
                    <td class="text-center">{{doc.id_documento}}</td>
                    <td class="text-center">{{doc.descripcion}}</td>
                    <td class="text-center">{{doc.fecha_plazo}}</td>
                </tr>                
                </tbody>
            </table>
        </div>
    </div>
  
</template>

<script>

import * as tomaMaterias from '@/services/tomaMaterias.js'

export default {
    data(){
        return {
            deudas: [],
            total: 0,
            documentos: [],
        }
    },
    methods:{
        async cargarEstudianteDeudas(){
            try {
                let res = await tomaMaterias.getDeudaEstudiante(this.$route.params.id_estudiante, this.$route.params.id_gestion)
                let datos = res.data.data
                this.deudas = datos
            } catch (error) {
                console.log(error)
            }
        },
        async cargarDocumentosPendientes(){
            try {
                let res = await tomaMaterias.getDocumentosPendientes(this.$route.params.id_estudiante)
                let datos = res.data.data
                this.documentos = datos
                // console.log(this.documentos)
            } catch (error) {
                console.log(error)
            }
        },
        getTotal(){
            this.total = 0
            setTimeout(() => {
                if(this.deudas){
                    for (let index = 0; index < this.deudas.length; index++) {
                        const element = this.deudas[index];
                        this.total = this.total + element.monto_deuda
                    }
                }    
            }, 200);
            return this.total
        }
    },
    mounted(){
        this.cargarEstudianteDeudas()
        this.getTotal()
        this.cargarDocumentosPendientes()
    },  
}
</script>

<style  lang="scss" scope>
    .total{
        text-align: right;
        padding-right: 4rem;
    }
</style>