<script setup>
import { onMounted, ref } from 'vue';

import { 
    Toolbar,
    Button,
    DataTable,
    Column,
    InputText,
    IconField,
    InputIcon,
    Rating,
    Textarea,
    Dialog
} from 'primevue';
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
const selectedCarti = ref();
const submitted = ref(false);

const filters = ref();
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        
        titlu: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        descriere: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

function openNew() {
    carte.value = {};
    submitted.value = false;
    carteDialog.value = true;
}

function hideDialog() {
    carteDialog.value = false;
    submitted.value = false;
}

function saveCarte() {
    submitted.value = true;

    carte.value.id = createId();
    
    try {
        // carte.value.image = // transform to base64

        CartiService.cartiInsert(carte.value);
        carti.value = CartiService.cartiSelect();

        showSuccess('Cartea a fost adăugată cu succes!');

        carteDialog.value = false;
        carte.value = {};
    } catch (error) {
        showError('A apărut o eroare la adăugarea cărții.');
    }
}

// function editProduct(prod) {
//     carte.value = { ...prod };
//     carteDialog.value = true;
// }

function confirmDeleteCarte(prod) {
    carte.value = prod;
    deleteCarteDialog.value = true;
}

function deleteCarte() {
    CartiService.cartiDelete(carte.value.id);
    carti.value = CartiService.cartiSelect();
    
    deleteCarteDialog.value = false;
    carte.value = {};

    showSuccess('Cartea a fost ștearsă cu succes!');
}

function createId() {
    let id = -1;
    
    // TODO: de adăugat logică pentru preluare ID din "baza de date"

    return id;
}

function showError(message) {
    toast.add({ severity: 'error', summary: 'Eroare', detail: message, life: 5000, group: 'tc' });
}

function showSuccess(message) {
    toast.add({ severity: 'success', summary: 'Succes', detail: message, life: 3000, group: 'tc' });
}

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Adaugă" icon="pi pi-plus" severity="secondary" @click="openNew" />
                </template>
            </Toolbar>

            <DataTable ref="dt"
                dataKey="id"
                v-model:selection="selectedCarti"
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
                <div>
                    <label for="titlu" class="block font-bold mb-3">Titlu</label>
                    <InputText id="titlu" v-model.trim="carte.titlu" required="true" autofocus
                        :invalid="submitted && !carte.titlu" fluid />
                    <small v-if="submitted && !carte.titlu" class="text-red-500">Titlu este necesar.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descriere</label>
                    <Textarea id="description" v-model="carte.description" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Anulează" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Salvează" icon="pi pi-check" @click="saveCarte" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteCarteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
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