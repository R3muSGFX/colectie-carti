export const CartiService = {
	storageKey: "cartiData",

	async getCartiInitial() {
		let filePath = new URL("@/carti-db.json", import.meta.url).pathname;
		
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
			}

			const data = await response.json();
			localStorage.setItem(this.storageKey, JSON.stringify(data));
		} catch (error) {
			console.error("❌ Error loading JSON:", error);
		}
	},

	cartiSelect() {
		let storedData = localStorage.getItem(this.storageKey);
		return storedData ? JSON.parse(storedData) : [];
	},

	cartiGetById(id) {
		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		return carti.find(carte => carte.id === id);
	},

	cartiInsert(carte) {
		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		carti.push(carte);
		localStorage.setItem(this.storageKey, JSON.stringify(carti));
	},

	cartiUpdate(id, updatedCarte) {
		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		let index = carti.findIndex(carte => carte.id === id);
		if (index !== -1) {
			carti[index] = { ...carti[index], ...updatedCarte };
			localStorage.setItem(this.storageKey, JSON.stringify(carti));
		}
	},

	cartiDelete(id) {
		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		carti = carti.filter(carte => carte.id !== id);
		localStorage.setItem(this.storageKey, JSON.stringify(carti));
	}
};
