<template>
    <Panel>
        <template #header>
            <div class="flex items-center gap-2">
                <span class="font-bold">{{ titlu }}</span>
            </div>
        </template>
        
        <Fluid>
            <Fieldset legend="Detalii">
                <div class="flex flex-col gap-8 mt-6">
                    <FloatLabel>
                        <InputText id="titlu" v-model.trim="carte.titlu" :invalid="!carte.titlu"
                            required="true" :disabled="esteModVizualizare" fluid />
                        <label for="titlu" class="block font-bold mb-3">Titlu</label>
                        <small v-if="!carte.titlu" class="text-red-500">Titlu este necesar.</small>
                    </FloatLabel>
                </div>

                <div class="flex flex-col gap-8 mt-6">
                    <FloatLabel>
                        <Textarea id="descriere" v-model="carte.descriere" required="true" rows="3" cols="20"
                            :invalid="!carte.descriere" :disabled="esteModVizualizare" fluid />
                        <label for="descriere" class="block font-bold mb-3">Descriere</label>
                        <small v-if="!carte.descriere" class="text-red-500">Descrierea este
                            necesară.</small>
                    </FloatLabel>
                </div>

                <div class="flex flex-col gap-8 mt-6">
                    <FloatLabel>
                        <InputText id="autor" v-model.trim="carte.autor" required="true"
                            :invalid="!carte.autor" :disabled="esteModVizualizare" fluid />
                        <label for="autor" class="block font-bold mb-3">Autor</label>
                        <small v-if="!carte.autor" class="text-red-500">Autorul este necesar.</small>
                    </FloatLabel>
                </div>

                <div class="flex flex-col gap-8 mt-6">
                    <FloatLabel>
                        <InputText id="gen" v-model.trim="carte.gen" required="true" :invalid="!carte.gen"
                            :disabled="esteModVizualizare"fluid />
                        <label for="gen" class="block font-bold mb-3">Gen</label>
                        <small v-if="!carte.gen" class="text-red-500">Genul este necesar.</small>
                    </FloatLabel>
                </div>

                <div class="flex flex-col gap-8 mt-6">
                    <FloatLabel>
                        <InputNumber id="publicat" v-model="carte.publicat" :useGrouping="false" :min="0" :max="9999" :disabled="esteModVizualizare" fluid />
                        <label for="publicat" class="block font-bold mb-3">Anul publicării</label>
                    </FloatLabel>
                </div>
            </Fieldset>

            <Fieldset legend="Imagine">
                <div class="card flex justify-center">
                    <Image alt="Image" preview>
                        <template #previewicon>
                            <i class="pi pi-search"></i>
                        </template>
                        <template #image>
                            <img :src="carte.imagine" alt="image" width="250" />
                        </template>
                        <template #preview="slotProps">
                            <img :src="carte.imagine" alt="preview" :style="slotProps.style"
                                @click="slotProps.onClick" />
                        </template>
                    </Image>
                </div>

                <div class="col-span-full lg:col-span-6" v-if="!esteModVizualizare">
                    <FileUpload mode="advanced" :multiple="false" accept="image/*" :maxFileSize="10000000"
                        :fileLimit="1" :customUpload="true" :showUploadButton="false" @select="onFileSelect" />
                </div>
            </Fieldset>
        </Fluid>

        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2"  v-if="!esteModVizualizare">
                    <Button label="Anulează" icon="pi pi-times" severity="danger" iconPos="left" class="mr-2" @click="anuleaza" />
                    <Button label="Salvează" icon="pi pi-check" severity="primary" iconPos="right" @click="saveCarte" />
                </div>
                <div class="flex items-center gap-2"  v-if="esteModVizualizare">
                    <Button label="Înapoi" icon="pi pi-arrow-left" severity="secondary" iconPos="left" @click="anuleaza"></Button>
                </div>
            </div>
        </template>
    </Panel>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { CartiService } from '@/services/carti-service';

const route = useRoute();
const carteId = ref(route.params.id);

const carte = ref({
    id: 0,
    titlu: null,
    descriere: null,
    autor: null,
    gen: null,
    publicat: null,
    imagine: null,
});

const titlu = ref('');
const esteModVizualizare = ref(false);

// Fisiere
const srcBase64 = ref(null);

function incarcaDateCarte() {
    if (carteId.value !== 0) {
        carte.value = CartiService.cartiGetById(carteId.value);
        titlu.value = 'Modificare carte';

        if (route.path.includes('vizualizare')) {
            esteModVizualizare.value = true;
            titlu.value = 'Vizualizare carte';
        }
    } else {
        titlu.value = 'Adăugare carte';
    }
}

incarcaDateCarte();

function saveCarte() {
    submitted.value = true;

    try {
        // Dacă avem imagine din upload, o completăm
        if (srcBase64.value) {
            // Completăm valoarea base64 a imaginii
            carte.value.image = srcBase64.value;
        }

        if (carte.value.id && carte.value.id !== 0) {
            // Actualizăm cartea existentă
            CartiService.cartiUpdate(carte.value.id, carte.value);
            showSuccess('Cartea a fost actualizată cu succes!');
        } else {
            // Adăugăm cartea în "baza de date"
            CartiService.cartiInsert(carte.value);
            showSuccess('Cartea a fost adăugată cu succes!');
        }
        
        // Readucem toate valorile
        carti.value = CartiService.cartiSelect();

        // Închidem modalul
        carteDialog.value = false;
        carte.value = {};
    } catch (error) {
        showError('A apărut o eroare la adăugarea cărții.');
    }
}

function anuleaza() {
    route.back();
}

function onFileSelect(event) {
    try {
        const file = event.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            srcBase64.value = e.target.result;
        };

        reader.readAsDataURL(file);
    } catch (error) {
        showError('A apărut o eroare la încărcarea fișierului.');
        console.error(error);
    }
}

</script>