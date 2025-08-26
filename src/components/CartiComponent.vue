<script setup>
import { onMounted, ref, watch } from 'vue';

import { 
    Toolbar,
    Button,
    DataTable,
    Column,
    InputText,
    InputNumber,
    IconField,
    InputIcon,
    Rating,
    Textarea,
    Dialog,
    FileUpload,
    Image,
    Fieldset
} from 'primevue';
import Divider from 'primevue/divider';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import { CartiService } from '@/services/carti-service';

onMounted(async () => {
    await CartiService.getCartiInitial();
    carti.value = CartiService.cartiSelect();
});

const toast = useToast();
const dt = ref();
const carti = ref();
const carteDialog = ref(false);
const deleteCarteDialog = ref(false);
const carte = ref({});
const selectedCarte = ref();
const submitted = ref(false);
const esteRandSelectat = ref(false);

const filters = ref();
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        
        titlu: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        descriere: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    };
};

// Fisiere
const srcBase64 = ref(null);

initFilters();

const clearFilter = () => {
    initFilters();

    selectedCarte.value = null;
};

function incarcaDate() {
    carti.value = CartiService.cartiSelect();
    selectedCarte.value = null;
    dt.value.reset();
    initFilters();
    showSuccess('Datele au fost reîncărcate cu succes!');
}

function vizualizeaza() {
    if (!selectedCarte.value) {
        showError('Selectați o carte pentru vizualizare.');
        return;
    }


}

function adauga() {
    carte.value = {};
    submitted.value = false;
    carteDialog.value = true;
}

function modifica() {
    if (!selectedCarte.value) {
        showError('Selectați o carte pentru modificare.');
        return;
    }

    this.editCarte(selectedCarte.value);
}

function sterge() {
    if (!selectedCarte.value) {
        showError('Selectați o carte pentru ștergere.');
        return;
    }

    this.confirmDeleteCarte(selectedCarte.value);
}

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

function editCarte(entity) {
    carte.value = { ...entity };
    carteDialog.value = true;
}

function confirmDeleteCarte(entity) {
    carte.value = entity;
    deleteCarteDialog.value = true;
}

function deleteCarte() {
    CartiService.cartiDelete(carte.value.id);
    carti.value = CartiService.cartiSelect();
    
    deleteCarteDialog.value = false;
    carte.value = {};

    showSuccess('Cartea a fost ștearsă cu succes!');
}



function showError(message) {
    toast.add({ severity: 'error', summary: 'Eroare', detail: message, life: 5000, group: 'tc' });
}

function showSuccess(message) {
    toast.add({ severity: 'success', summary: 'Succes', detail: message, life: 3000, group: 'tc' });
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

function hideDialog() {
    carteDialog.value = false;
    submitted.value = false;
    carte.value = null;
    srcBase64.value = null;
}

watch(selectedCarte, (newVal) => {
    esteRandSelectat.value = !!newVal;
});

</script>

<template>
    <div>
        <div class="card">
            <Toolbar>
                <template #start>
                    <Button label="Reîncarcă" icon="pi pi-refresh" severity="primary" @click="incarcaDate" />
                    <Button label="Vizualizează" icon="pi pi-eye" severity="primary" 
                        @click="vizualizeaza" :disabled="!esteRandSelectat" />
                    <Divider layout="vertical" />
                    <Button label="Adaugă" icon="pi pi-plus" severity="secondary" variant="outlined" @click="adauga" />
                    <Button label="Modifică" icon="pi pi-pencil" severity="secondary" variant="outlined" 
                        @click="modifica" :disabled="!esteRandSelectat"/>
                    <Button label="Șterge" icon="pi pi-trash" severity="danger" variant="outlined" 
                        @click="sterge" :disabled="!esteRandSelectat"/>
                </template>
            </Toolbar>

            <DataTable ref="dt" class="mt-3"
                dataKey="id"
                selectionMode="single"
                :metaKeySelection="metaKey"
                v-model:selection="selectedCarte"
                :value="carti"
                sortField="id"
                :sortOrder="1"
                removableSort
                :paginator="true"
                :rows="10"
                v-model:filters="filters"
                filterDisplay="menu"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="De la {first} până la {last} (din totalul de {totalRecords} înregistrări)"
                resizableColumns
                columnResizeMode="fit"
                showGridlines>
                <template #header>
                    <div class="flex justify-between">
                        <Button type="button" icon="pi pi-filter-slash" label="Elimină filtre" variant="outlined" @click="clearFilter()" />
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Caută" />
                        </IconField>
                    </div>
                </template><!-- /header -->
                <template #empty>Nici o carte înregistrată.</template>

                <Column field="id" header="ID" sortable style="min-width: 8rem"></Column>
                <Column field="titlu" header="Titlu" sortable filterField="titlu" style="min-width: 14rem">
                    <template #body="{ data }">
                        {{ data.titlu }}
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Caută după titlu" />
                    </template>
                </Column>
                <Column field="descriere" header="Descriere" sortable style="min-width: 16rem">
                    <template #body="{ data }">
                        {{ data.descriere }}
                    </template>
                    <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" placeholder="Caută după descriere" />
                    </template>
                </Column>
                <Column field="rating" header="Rating" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />
                    </template>
                </Column>
                <Column header="Imagine">
                    <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <img :alt="data.titlu" :src="data.imagine" style="width: 16px" />
                        </div>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCarte(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCarte(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="carteDialog" :style="{ width: '450px' }" header="Adăugare carte" :modal="true">
            <div class="flex flex-col gap-6">
                <Fieldset legend="Detalii">
                    <div>
                        <label for="titlu" class="block font-bold mb-3">Titlu</label>
                        <InputText id="titlu" v-model.trim="carte.titlu" required="true" autofocus
                            :invalid="submitted && !carte.titlu" fluid />
                        <small v-if="submitted && !carte.titlu" class="text-red-500">Titlu este necesar.</small>
                    </div>
                    <div>
                        <label for="descriere" class="block font-bold mb-3">Descriere</label>
                        <Textarea id="descriere" v-model="carte.descriere" required="true" rows="3" cols="20" :invalid="submitted && !carte.descriere" fluid />
                        <small v-if="submitted && !carte.descriere" class="text-red-500">Descrierea este necesară.</small>
                    </div>
                    <div>
                        <label for="autor" class="block font-bold mb-3">Autor</label>
                        <InputText id="autor" v-model.trim="carte.autor" required="true" :invalid="submitted && !carte.autor" fluid />
                        <small v-if="submitted && !carte.autor" class="text-red-500">Autorul este necesar.</small>
                    </div>
                    <div>
                        <label for="gen" class="block font-bold mb-3">Gen</label>
                        <InputText id="gen" v-model.trim="carte.gen" required="true" :invalid="submitted && !carte.gen" fluid />
                        <small v-if="submitted && !carte.gen" class="text-red-500">Genul este necesar.</small>
                    </div>
                    <div>
                        <label for="publicat" class="block font-bold mb-3">Anul publicării</label>
                        <InputNumber id="publicat" v-model="carte.publicat" :useGrouping="false" :min="0" :max="9999" fluid />
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
                                <img :src="carte.imagine" alt="preview" :style="slotProps.style" @click="slotProps.onClick" />
                            </template>
                        </Image>
                    </div>
                    <div class="col-span-full lg:col-span-6">
                        <div class="card">
                            <div class="font-semibold text-xl mb-4">Imagine</div>
                            <FileUpload
                                mode="advanced"
                                :multiple="false"
                                accept="image/*"
                                :maxFileSize="10000000"
                                :fileLimit="1"
                                :customUpload="true"
                                :showUploadButton="false"
                                @select="onFileSelect"
                             />
                        </div>
                    </div>
                </Fieldset>
            </div>

            <template #footer>
                <Button label="Anulează" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Salvează" icon="pi pi-check" @click="saveCarte" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCarteDialog" :style="{ width: '450px' }" header="ATENȚIE" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="carte">Sunteți sigur că doriți să ștergeți cartea <b>{{ carte.titlu }}</b>?</span>
            </div>
            <template #footer>
                <Button label="Nu" icon="pi pi-times" text @click="deleteCarteDialog = false" />
                <Button label="Da" icon="pi pi-check" @click="deleteCarte" />
            </template>
        </Dialog>

    </div>
</template>