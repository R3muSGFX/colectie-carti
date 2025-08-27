<script setup>
import { onMounted, ref, watch } from 'vue';

import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import router from '@/router';
import { CartiService } from '@/services/carti-service';

onMounted(() => {
    carti.value = CartiService.cartiSelect();
});

const toast = useToast();
const dt = ref();
const carti = ref();
const deleteCarteDialog = ref(false);
const carte = ref({});
const selectedCarte = ref();
const esteRandSelectat = ref(false);

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

    selectedCarte.value = null;
};

function incarcaDate() {
    carti.value = CartiService.cartiSelect();
    selectedCarte.value = null;
    initFilters();
    showSuccess('Datele au fost reîncărcate cu succes!');
}

function vizualizeaza() {
    if (!selectedCarte.value) {
        showError('Selectați o carte pentru vizualizare.');
        return;
    }

    router.push(`/carte/${selectedCarte.value.id}/vizualizare`);
}

function adauga() {
    navigateToCarte(0);
}

function modifica() {
    if (!selectedCarte.value) {
        showError('Selectați o carte pentru modificare.');
        return;
    }

    navigateToCarte(selectedCarte.value.id);
}

function navigateToCarte(id) {
    router.push(`/carte/${id}`);
}

function sterge() {
    if (!selectedCarte.value) {
        showError('Selectați o carte pentru ștergere.');
        return;
    }

    confirmDeleteCarte(selectedCarte.value);
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

watch(selectedCarte, (newVal) => {
    esteRandSelectat.value = !!newVal;
});

</script>

<template>
    <div>
        <div class="card">
            <Toolbar>
                <template #start>
                    <Button label="Reîncarcă" icon="pi pi-refresh" severity="primary" class="mr-2"
                        @click="incarcaDate" />
                    <Button label="Vizualizează" icon="pi pi-eye" severity="primary" 
                        @click="vizualizeaza" :disabled="!esteRandSelectat" />
                    <Divider layout="vertical" />
                    <Button label="Adaugă" icon="pi pi-plus" severity="secondary" variant="outlined" class="mr-2"
                        @click="adauga" />
                    <Button label="Modifică" icon="pi pi-pencil" severity="secondary" variant="outlined" class="mr-2"
                        @click="modifica" :disabled="!esteRandSelectat"/>
                    <Button label="Șterge" icon="pi pi-trash" severity="danger" variant="outlined"
                        @click="sterge" :disabled="!esteRandSelectat"/>
                </template>
            </Toolbar>

            <DataTable ref="dt" class="mt-3"
                dataKey="id"
                selectionMode="single"
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
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="navigateToCarte(slotProps.data.id)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCarte(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

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