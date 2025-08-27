import AppLayout from "@/components/shared/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";

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
					path: "/about",
					name: "about",
					component: () => import("@/components/AboutComponent.vue"),
				},
			],
		},
	],
});

export default router;
