const { readFile, writeFile } = require('fs/promises');

class HeroRepository {
    constructor({ file }) {
        this.file = file;
    }

    async _currentFileContent() {
        try {
            const fileContent = await readFile(this.file, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error(`Error reading file ${this.file}:`, error);
            throw new Error(`Failed to read file: ${this.file}`);
        }
    }

    async _writeFileContent(content) {
        try {
            await writeFile(this.file, JSON.stringify(content, null, 2));
        } catch (error) {
            console.error(`Error writing file ${this.file}:`, error);
            throw new Error(`Failed to write file: ${this.file}`);
        }
    }

    async find(itemId) {
        try {
            const allItems = await this._currentFileContent();
            return itemId ? allItems.find(({ id }) => itemId === id) : allItems;
        } catch (error) {
            console.error('Error finding item:', error);
            throw new Error(`Failed to find item with id: ${itemId}`);
        }
    }

    async add(newItem) {
        try {
            const allItems = await this._currentFileContent();
            allItems.push(newItem);
            await this._writeFileContent(allItems);
            return newItem;
        } catch (error) {
            console.error('Error adding new item:', error);
            throw new Error('Failed to add new item');
        }
    }

    async remove(itemId) {
        try {
            const allItems = await this._currentFileContent();
            const itemIndex = allItems.findIndex(({ id }) => itemId === id);

            if (itemIndex === -1) {
                throw new Error(`Item with id ${itemId} not found`);
            }

            const [removedItem] = allItems.splice(itemIndex, 1);
            await this._writeFileContent(allItems);
            return removedItem;
        } catch (error) {
            console.error('Error removing item:', error);
            throw new Error(`Failed to remove item with id: ${itemId}`);
        }
    }
}

module.exports = HeroRepository;
