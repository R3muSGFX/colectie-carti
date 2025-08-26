export const CartiService = {
	storageKey: "cartiData",
	primaryKey: 0,

	async getCartiInitial() {
		let filePath = new URL("@/carti-db.json", import.meta.url).pathname;
		
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Nu am putut încărca fișierul din ${filePath}: ${response.statusText}`);
			}

			const data = await response.json();
			localStorage.setItem(this.storageKey, JSON.stringify(data));
			this.primaryKey = data.length > 0 ? Math.max(...data.map(carte => carte.id)) + 1 : 1;
		} catch (error) {
			console.error("A apărut o eroare:", error);
		}
	},

	cartiGetById(id) {
		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		return carti.find(carte => carte.id === id);
	},

	cartiSelect() {
		let storedData = localStorage.getItem(this.storageKey);
		return storedData ? JSON.parse(storedData) : [];
	},

	cartiInsert(carte) {
		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		carte.id = this.primaryKey++;
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
