import { useSQLiteContext } from "expo-sqlite";

export type ProductDatabase = {
    id: number,
    name: string,
    quantity: number
}
export function useProductDatabase () {
    
    const database = useSQLiteContext();

    async function create(data: Omit<ProductDatabase, "id">) {
        const query = "INSERT INTO products (name, quantity) VALUES ($name, $quantity)";
        const stmt = await database.prepareAsync(query);
        
        try {
            const result = await stmt.executeAsync({
                $name: data.name, 
                $quantity: data.quantity
            });

            const insertedRowId = result.lastInsertRowId.toLocaleString();

            return { insertedRowId };
        } catch (error) {
            throw error;
            
        } finally {
            await stmt.finalizeAsync()
        }
    }

    async function searchByName(name: String) {
        try {
            const query = "SELECT * FROM products WHERE name LIKE ?";
            return await database.getAllAsync<ProductDatabase>(query, `%${name}%`);
        } catch (error) {
            throw error;
            
        }
    }

    async function list() {
        const query = "SELECT * FROM products";
        
        try {
            const result = await database.getAllAsync<ProductDatabase>(query);

            return result;
        } catch (error) {
            console.log(error);
            
        } finally {
            // await database.finalizeAsync()
        }
    }

    async function update(data: ProductDatabase) {
        const query = "UPDATE products SET name = $name, quantity = $quantity WHERE id = $id";
        const stmt = await database.prepareAsync(query);
        
        try {
            const result = await stmt.executeAsync({
                $id: data.id, 
                $name: data.name,
                $quantity: data.quantity,
            });
        } catch (error) {
            throw error;
            
        } finally {
            await stmt.finalizeAsync()
        }
    }

    async function remove (id: Number) {
        try {
            const query = "DELETE FROM products WHERE id = " + id;
            await database.execAsync(query);
        } catch (error) {
            throw error;
        }
    }
    return {
        create,
        searchByName,
        list,
        update,
        remove
    }
}