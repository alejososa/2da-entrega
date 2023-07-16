const { log } = require("console");
const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path;
    }
    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const infoARchivo = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(infoARchivo);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(obj) {
        try {          
            const productosPrevios = await this.getProducts();
            // id generator
            let id;
            if (!productosPrevios.length) {
                id = 1;
            } else {
                id = productosPrevios[productosPrevios.length - 1].id + 1;
            }
            //confirmacion de los campos
            if(!obj.title|| !obj.description|| !obj.price|| !obj.thumbnail|| !obj.code|| !obj.stock){
                console.log('Complete all fields');
                return;
            }
            //uso de codigo único
            
            productosPrevios.push({ ...obj, id });
            await fs.promises.writeFile(this.path, JSON.stringify(productosPrevios));
        } catch (error) {
            return error;
        }
    }

    async getProductById(id) {
        try {
            const productosPrevios = await this.getProducts();
            const producto = productosPrevios.find((u) => u.id === id);
            if (!producto) {
                return "no existe el producto";
            }
            return producto;
        } catch (error) {
            return error;
        }
    }

    async updateProduct(id, obj) {
        try {
            const productosPrevios = await this.getProducts();
            const productoIndex = productosPrevios.findIndex((u) => u.id === id);
            if (productoIndex === -1) {
                return "no existe ese id";
            }
            const producto = productosPrevios[productoIndex];
            productosPrevios[productoIndex] = { ...producto, ...obj };
            await fs.promises.writeFile(this.path, JSON.stringify(productosPrevios));
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(id) {
        try {
            const productosPrevios = await this.getProducts();
            const arregloSinProducto = productosPrevios.filter((u) => u.id !== id);
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(arregloSinProducto)
            );
        } catch (error) {
            return error;
        }
    }
}

//objeto a usar para el update
obj = {
    title: "campari",
    stock: 15,
};

async function test() {
    const manager = new ProductManager("productos.json");
    // agrega el producto con su nuevo id autoincrementable
/*
    await manager.addProduct({
        title:"manaos",
        description:"lala",
        price: 850,
        thumbnail:"no foto",
        code: "1235",
        stock: 1000
    })
*/
    //trae la lista de todos los productos del archivo .json
    //const productos= await manager.getProducts();

    //trae el producto con el id específico que se encuentra en el .json
    //const productos = await manager.getProductById(3);

    //borra un prodcuto específico por su id
    //await manager.deleteProduct(4);

    //actualiza un producto ya sea completo o una propiedad escpecífica sin alterar su id
    await manager.updateProduct(4,obj);

    //console.log(productos);
}
test();
