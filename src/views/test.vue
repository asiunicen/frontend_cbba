<template>
<div class="float-end mb-3">
        <button class="btn btn-new btn-sm" @click="openModal()">AÑADIR</button>
    </div>
  <div>
    <form >
        <div class="modal fade show" id="aulaModal" tabindex="-1" aria-hidden="true"
            v-show="showModal">

            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="aulaModalLabel">Aula</h5>
                    <button type="button" class="btn-close" @click="hideModal()"></button>
                </div>
                    <div class="modal-body">
                        <div class="row mb-2">
                                <label for="tipo" class="col-sm-4 form-label">Nombre:</label>
                            </div> 
                        
                            
                                    
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-sm" @click="hideModal()"><i class="far fa-times-circle"></i> CANCELAR</button>
                        <button type="submit" class="btn btn-success btn-sm"><i class="fas fa-save"></i>GUARDAR</button>
                    </div>
                </div>
            </div>
        </div>
    </form> 
  </div> 



</template>

<script>
//import { Modal } from 'bootstrap'

export default {
    name: 'test',
    data() {
        return {
            showModal: true,
           modal: null 
        }
    },
    methods: {
       
      
        openModal(){
            this.showModal = true
           
        },
        hideModal() {
            this.showModal = false;
            
        },
        
    }
   
    
}

</script>

<style  lang="scss" scoped>

</style>