class ProductManager {
  products = [];

  // shape of the product object
  #baseProduct = {
    id: null,
    title: null,
    description: null,
    price: null,
    thumbnail: null,
    code: null,
    stock: null,
  };

  addProduct(_product) {
    const newProduct = {
      ...this.#baseProduct,
      ..._product,
      id: this.products.length + 1,
    };

    if (
      Object.values(newProduct).some(
        (prop) => prop === null || typeof prop === 'undefined',
      )
    ) {
      throw new Error('Atributos faltantes');
    }

    const codeAlreadyExists = this.products.some(
      (product) => product.code === newProduct.code,
    );
    if (codeAlreadyExists) {
      throw new Error(`Producto con código ${newProduct.code} ya existe.`);
    }

    this.products.push(newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const foundProduct = this.products.find((product) => product.id === id);
    if (!foundProduct) throw new Error(`Producto con id ${id} no encontrado.`);
    return foundProduct;
  }
}

function main() {
  const product = new ProductManager();
  console.log('Productos:', product.getProducts());

  console.log('Añadiendo un producto');
  product.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });
  console.log('Añadiendo nuevo producto');
  product.addProduct({
    title: 'Nuevo producto',
    description: 'Otro producto',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'new-prod-1',
    stock: 25,
  });
  console.log('Debe haber dos productos con ids 1 y 2:', product.getProducts());

  console.log('Añadiendo el mismo producto de nuevo...');
  try {
    product.addProduct({
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'abc123',
      stock: 25,
    });
  } catch (e) {
    console.error(e);
  }

  console.log('Añadiendo producto sin llenar todos los atributos...');
  try {
    product.addProduct({
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: 200,
      thumbnail: 'Sin imagen',
    });
  } catch (e) {
    console.error(e);
  }

  console.log('Buscando el producto con id 1...');
  try {
    console.log('Un producto', product.getProductById(1));
  } catch (e) {
    console.error(e);
  }

  console.log('Buscando producto con id 19...');
  try {
    console.log('Un producto', product.getProductById(19));
  } catch (e) {
    console.error(e);
  }
}

main();

module.exports.ProductManager = ProductManager;
