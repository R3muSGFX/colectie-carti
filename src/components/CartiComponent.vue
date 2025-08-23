<script setup>
import { onMounted, ref } from 'vue';

import { CartiService } from '@/services/carti-service';

import { 
    Toolbar,
    Button,
    DataTable,
    Column,
    InputText,
    IconField,
    InputIcon
} from 'primevue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
// import { useToast } from 'primevue/usetoast';

onMounted(async () => {
    await CartiService.getCartiInitial();
    carti.value = CartiService.cartiSelect();
});

// const toast = useToast();
const dt = ref();
const carti = ref();
// const carteDialog = ref(false);
// const deleteProductDialog = ref(false);
// const deleteProductsDialog = ref(false);
// const carte = ref({});
const selectedCarti = ref();
// const submitted = ref(false);

const filters = ref();
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },

        titlu: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    };
};

initFilters();

const clearFilter = () => {
    initFilters();
};

// const formatDate = (value) => {
//     return value.toLocaleDateString('ro-RO', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//     });
// };

function openNew() {
    // carte.value = {};
    // submitted.value = false;
    // carteDialog.value = true;
}

// function hideDialog() {
//     carteDialog.value = false;
//     submitted.value = false;
// }

// function saveProduct() {
//     submitted.value = true;

//     if (carte?.value.name?.trim()) {
//         if (carte.value.id) {
//             carte.value.inventoryStatus = carte.value.inventoryStatus.value ? carte.value.inventoryStatus.value : carte.value.inventoryStatus;
//             cartes.value[findIndexById(carte.value.id)] = carte.value;
//             toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
//         } else {
//             carte.value.id = createId();
//             carte.value.code = createId();
//             carte.value.image = 'carte-placeholder.svg';
//             carte.value.inventoryStatus = carte.value.inventoryStatus ? carte.value.inventoryStatus.value : 'INSTOCK';
//             cartes.value.push(carte.value);
//             toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
//         }

//         carteDialog.value = false;
//         carte.value = {};
//     }
// }

// function editProduct(prod) {
//     carte.value = { ...prod };
//     carteDialog.value = true;
// }

// function confirmDeleteProduct(prod) {
//     carte.value = prod;
//     deleteProductDialog.value = true;
// }

// function deleteProduct() {
//     cartes.value = cartes.value.filter((val) => val.id !== carte.value.id);
//     deleteProductDialog.value = false;
//     carte.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
// }

// function findIndexById(id) {
//     let index = -1;
//     for (let i = 0; i < cartes.value.length; i++) {
//         if (cartes.value[i].id === id) {
//             index = i;
//             break;
//         }
//     }

//     return index;
// }

// function createId() {
//     let id = '';
//     var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (var i = 0; i < 5; i++) {
//         id += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return id;
// }

// function deleteselectedCarti() {
//     cartes.value = cartes.value.filter((val) => !selectedCarti.value.includes(val));
//     deleteProductsDialog.value = false;
//     selectedCarti.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
// }
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
                sortField="id"
                :sortOrder="1"
                :value="carti"  
                :paginator="true"
                :rows="10" 
                :filters="filters"
                filterDisplay="menu"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Afișare {first} din {last} din {totalRecords} cărți">
                <template #header>
                    <div class="flex">
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
                <Column field="titlu" header="Titlu" sortable style="min-width: 14rem">
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
                <Column header="Imagine">
                    <template #body="{ data }">
                        <div class="flex items-center gap-2">
                            <img :alt="data.titlu" :src="data.imagine" style="width: 16px" />
                        </div>
                    </template>
                </Column>
                <!--<Column field="rating" header="Reviews" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column> -->
            </DataTable>
        </div>

        <!-- <Dialog v-model:visible="carteDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="carte.image" :src="`https://primefaces.org/cdn/primevue/images/carte/${carte.image}`"
                    :alt="carte.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="carte.name" required="true" autofocus
                        :invalid="submitted && !carte.name" fluid />
                    <small v-if="submitted && !carte.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="carte.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                    <Select id="inventoryStatus" v-model="carte.inventoryStatus" :options="statuses"
                        optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>

                <div>
                    <span class="block font-bold mb-4">Category</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category1" v-model="carte.category" name="category"
                                value="Accessories" />
                            <label for="category1">Accessories</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category2" v-model="carte.category" name="category" value="Clothing" />
                            <label for="category2">Clothing</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category3" v-model="carte.category" name="category"
                                value="Electronics" />
                            <label for="category3">Electronics</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category4" v-model="carte.category" name="category" value="Fitness" />
                            <label for="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Price</label>
                        <InputNumber id="price" v-model="carte.price" mode="currency" currency="USD" locale="en-US"
                            fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Quantity</label>
                        <InputNumber id="quantity" v-model="carte.quantity" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog> -->

        <!-- <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="carte">Are you sure you want to delete <b>{{ carte.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="carte">Are you sure you want to delete the selected cartes?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteselectedCarti" />
            </template>
        </Dialog> -->
    </div>
</template>