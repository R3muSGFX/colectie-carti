export const CartiService = {
	async getCartiInitial() {
		let storageKey = "cartiData";
		let filePath = new URL("@/carti-db.json", import.meta.url).pathname;
		
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
			}

			const data = await response.json();
			localStorage.setItem(storageKey, JSON.stringify(data));
		} catch (error) {
			console.error("❌ Error loading JSON:", error);
		}
	},

	cartiSelect() {
		let storageKey = "cartiData";
		let storedData = localStorage.getItem(storageKey);
		return storedData ? JSON.parse(storedData) : [];
	},

	cartiGetById(id) {
		let storageKey = "cartiData";
		let storedData = localStorage.getItem(storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		return carti.find(carte => carte.id === id);
	},

	cartiUpdate(id, updatedCarte) {
		let storageKey = "cartiData";
		let storedData = localStorage.getItem(storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		let index = carti.findIndex(carte => carte.id === id);
		if (index !== -1) {
			carti[index] = { ...carti[index], ...updatedCarte };
			localStorage.setItem(storageKey, JSON.stringify(carti));
		}
	},

	cartiDelete(id) {
		let storageKey = "cartiData";
		let storedData = localStorage.getItem(storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		carti = carti.filter(carte => carte.id !== id);
		localStorage.setItem(storageKey, JSON.stringify(carti));
	}
};
