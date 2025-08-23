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
					path: "/",
					name: "dashboard",
					component: () => import("@/components/Dashboard.vue"),
				},
				{
					path: "/carti",
					name: "carti",
					component: () => import("@/components/Carti.vue"),
				},
				{
					path: "/about",
					name: "about",
					component: () => import("@/components/About.vue"),
				},
			],
		},
	],
});

export default router;
