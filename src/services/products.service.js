/* eslint-disable no-param-reassign */

/**
 * @typedef {import('mongoose').FilterQuery<IProduct>} FilterQueryProduct
 * @typedef {import('../types').ProductType} ProductType
 * @typedef {import('../types').IProduct} IProduct
 * @typedef {import('../types').IProductModel} IProductModel
 * @typedef {import('../customErrors')} ResourceNotFoundError
 */

export default class ProductsService {
  /** @type IProductModel */
  #Product;

  /**
   * Constructs a new products service
   *
   * @param {IProductModel} Product - Product model
   */
  constructor(Product) {
    this.#Product = Product;
  }

  /**
   * Return list of products
   *
   * @param {FilterQueryProduct} filter Filter object
   * @param {number} limit Amount of products to return
   * @returns Products from database
   */
  async getProducts(filter = {}, opts = {}) {
    const SORT_OPTIONS = {
      ASC: { price: 1 },
      DESC: { price: -1 },
    };

    if (opts.sort) opts.sort = SORT_OPTIONS[opts.sort.toUpperCase()];

    Object.entries(opts).forEach(([optionName, optionValue]) => {
      if (typeof optionValue === 'undefined') delete opts[optionName];
    });

    const options = {
      limit: 10,
      page: 1,
      lean: false,
      ...opts,
    };

    const paginationResponse = await this.#Product.paginate(filter, options);

    const products = paginationResponse.docs;
    delete paginationResponse.docs;

    return {
      status: 'success',
      payload: {
        products,
        pagination: paginationResponse,
      },
    };
  }

  /**
   * Saves a product to the database
   *
   * @param {ProductType} request Data of the product to add
   * @returns Response after save
   */
  async saveProduct(request) {
    const product = new this.#Product(request);
    return product.save();
  }

  /**
   * Returns data of a product
   *
   * @param {IProduct['_id']} productId
   * @throws ResourceNotFoundError
   * @returns Product from database
   */
  async getProductById(productId) {
    return this.#Product.findByIdAndThrow(productId);
  }

  /**
   * Updates a product from the database
   *
   * @param {IProduct['_id']} productId
   * @param {Partial<ProductType>} request
   * @returns Response after saving
   */
  async updateProductById(productId, request) {
    const product = await this.#Product.findByIdAndThrow(productId);
    const newProduct = Object.assign(product, request);
    return newProduct.save();
  }

  /**
   * Deletes product from the database
   *
   * @param {IProduct['_id']} productId
   * @returns Response after deleting
   */
  async deleteProductById(productId) {
    const product = await this.#Product.findByIdAndThrow(productId);
    return product.deleteOne();
  }
}
