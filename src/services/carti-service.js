export const CartiService = {
	storageKey: "cartiData",
	storageKeyPrimaryKey: "cartiPrimaryKey",

	async getCartiInitial() {
		let filePath = new URL("@/carti-db.json", import.meta.url).pathname;
		
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Nu am putut încărca fișierul din ${filePath}: ${response.statusText}`);
			}

			const data = await response.json();

			// Extragem valorile din local storage
			let existingData = localStorage.getItem(this.storageKey);
			let existingPrimaryKey = localStorage.getItem(this.storageKeyPrimaryKey);

			// Verificăm dacă avem valori în storage deja
			if (!existingData) {
				// Dacă nu avem, le adăugăm
				localStorage.setItem(this.storageKey, JSON.stringify(data));
			}

			if (!existingPrimaryKey) {
				localStorage.setItem(this.storageKeyPrimaryKey, JSON.stringify(data.length));
			}
		} catch (error) {
			console.error("A apărut o eroare:", error);
		}
	},

	cartiGetById(id) {
		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		return carti.find(carte => carte.id === id);
	},

	cartiGetCount() {
		return this.cartiSelect().length;
	},

	cartiSelect() {
		let storedData = localStorage.getItem(this.storageKey);
		return storedData ? JSON.parse(storedData) : [];
	},

	cartiInsert(carte) {
		let primaryKey = this.primaryKeyGet();
		primaryKey = primaryKey ? primaryKey + 1 : 1;

		let storedData = localStorage.getItem(this.storageKey);
		let carti = storedData ? JSON.parse(storedData) : [];
		carte.id = primaryKey;
		carti.push(carte);
		localStorage.setItem(this.storageKey, JSON.stringify(carti));

		this.primaryKeyUpdate(primaryKey);
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
	},



	primaryKeyGet() {
		let primaryKey = localStorage.getItem(this.storageKeyPrimaryKey);
		return primaryKey ? JSON.parse(primaryKey) : 0;
	},

	primaryKeyUpdate(newPrimaryKey) {
		localStorage.setItem(this.storageKeyPrimaryKey, JSON.stringify(newPrimaryKey));
	}
};
