const { readFile, writeFile } = require('fs/promises');

class HeroRepository {
    constructor({ file }) {
        this.file = file;
    }

    async _currentFileContent() {
        try {
            const fileContent = await readFile(this.file);
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error reading file ${this.file}:`, error);
            throw error;
        }
    }

    async find(itemId) {
        try {
            const allItems = await this._currentFileContent();
            if (!itemId) return allItems;
            return allItems.find(({ id }) => itemId === id);
        } catch (error) {
            console.error('Error finding item:', error);
            throw error;
        }
    }

    async add(newItem) {
        try {
            const allItems = await this._currentFileContent();
            allItems.push(newItem);
            await writeFile(this.file, JSON.stringify(allItems, null, 2));
            return newItem;
        } catch (error) {
            console.error('Error adding new item:', error);
            throw error;
        }
    }

    async remove(itemId) {
        try {
            let allItems = await this._currentFileContent();
            const itemIndex = allItems.findIndex(({ id }) => itemId === id);

            if (itemIndex === -1) {
                throw new Error(`Item with id ${itemId} not found`);
            }

            const [removedItem] = allItems.splice(itemIndex, 1);
            await writeFile(this.file, JSON.stringify(allItems, null, 2));
            return removedItem;
        } catch (error) {
            console.error('Error removing item:', error);
            throw error;
        }
    }
}

module.exports = HeroRepository;
