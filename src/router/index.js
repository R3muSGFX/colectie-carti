import { createRouter, createWebHistory } from "vue-router";

import AppLayout from "@/components/shared/AppLayout.vue";
import CarteItemComponent from "@/components/CarteItemComponent.vue";


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			component: AppLayout,
			children: [
				{
					path: "/dashboard",
					name: "Dashboard",
					component: () => import("@/components/Dashboard.vue"),
				},
				{
					path: "/carti",
					name: "carti",
					component: () => import("@/components/CartiComponent.vue"),
				},
				{
					path: "/carte/:id",
					name: "carte-detail",
					component: CarteItemComponent,
				},
				{
					path: "/carte/:id/vizualizare",
					name: "carte-detail-view",
					component: CarteItemComponent,
				},
				{
					path: "/about",
					name: "about",
					component: () => import("@/components/AboutComponent.vue"),
				},
			],
		},
	],
});

export default router;
