const { gql } = require("apollo-server");

module.exports = gql`
  type Customer {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    token: String
    addresses: [Address]
  }
  type Admin {
    id: ID
    firstname: String!
    lastname: String!
    email: String!
    token: String
  }
  input CustomerDataInput {
    id: ID
    email: String
    password: String
    firstname: String
    lastname: String
  }
  type Product {
    _id: ID!
    title: String!
    image: String
    brand: String!
    description: String!
    price: Float!
    categories: [Category]!
  }

  input ProductInput{
    title: String!,
    image: String,
    brand: String,
    description: String,
    price: Float!
    categories: [ID]!
  }

  type CartItem{
    product_id: Product 
    price: Float
    quantity: Float
  }
  
  type Cart {
    _id: ID
    customer_id: Customer
    items: [CartItem]
    total: Float
  }
  type ShippingMethod {
    carrierCode: String
    rateId: String
  }
  type PaymentMethod {
    methodCode: String
  }

  input CustomerAddressInput {
    firstname: String
    lastname: String
    city: String
    address: String
    country: String
  }
  type Address {
    firstname: String
    lastname: String
    city: String
    address: String
    country: String
  }
  type Review {
    id: ID
    customer_id: Customer
    product_id: Product
    review: String!
    rating: Float!
    name: String!
    title: String
  }
  input ReviewInput {
    customer_id: ID!
    product_id: ID!
    review: String
    rating: Float
    title: String
  }
  type Category {
    id: ID!
    title: String!
    parent: ID!
  }
  type AdminCategoriesResult {
    items: [Category]
    total: Int
  }
  type CategoryProductsResult {
    products: [Product]
    total: Int
  }
  input CategoryInputData {
    title: String
    parent: ID
  }
  type ProductPagination{
    totalQty:Float
    pages:Float
    products:[Product]
  }

  type Slide {
    _id: ID
    name: String
    image: String
    content: String
    contentPosition: String
  }
  input SlideInput{
    name: String
    image: String
    content: String
    contentPosition: String
  }
  type Slider {
    id: ID
    title: String
    slides: [Slide]
  }
  input SliderInput{
    title: String
    slides: [SlideInput]
  }
  type Query {
    customers: [Customer]!
    customer: Customer!
    admin: Admin!
    adminCustomer(id: ID!): Customer!
    # products
    products(sort: Int, page: Int, sortBy: String): [Product]!
    searchProducts(find: String, page:Int): [Product]!
    productById(id:ID): Product!
    # categories
    categories: [Category]!
    categoryById(id:ID): Category!
    # adminCategory
     getCategoryProducts(categoryId: ID!): CategoryProductsResult!
     adminGetCategories: AdminCategoriesResult!
     adminGetCategory(categoryId: ID!): Category!
    # review
    reviewsOneProduct(productId: ID): [Review]!
    # cart
    oneCart(id: ID): Cart
    # Slider
    slider(id: String): Slider
    adminSlider(id: String): Slider
    adminSliders: [Slider]!

  }

  type Mutation {
    # customer
    register(
      firstname: String!
      lastname: String!
      password: String!
      email: String!
    ): Customer!
    updateCustomer(customerData: CustomerDataInput): Customer
    addCustomerAddress(customerAddressInput: CustomerAddressInput): Customer
    editCustomerAddres(
      customerAddressId: ID!
      customerAddressInput: CustomerAddressInput
    ): Customer
    removeCustomerAddress(customerAddressId: ID): Boolean
    login(email: String!, password: String!): Customer!

    adminLogin(email: String!, password: String!): Admin!
    adminAddCustomer(customerData: CustomerDataInput): Boolean
    adminDeleteCustomer(id: ID!): Boolean
    adminMassDeleteCustomers(customerIds: [String]): Boolean
    adminUpdateCustomer(id: ID!, customerData: CustomerDataInput): Boolean

    # product
    adminCreateProduct(productInput: ProductInput): Product!
    adminUpdateProduct(productId: ID!,productInput:ProductInput): Product
    adminDeleteProduct(id:ID!): Product!
    adminDeleteCategoryFromProduct(productId: ID, categories: [ID]): Product!
    # category
    adminAddCategory(categoryData: CategoryInputData!): Boolean
    adminUpdateCategory(
      categoryId: ID!
      categoryData: CategoryInputData!
    ): Boolean
    adminDeleteCategory(categoryId: ID!): Boolean

    # Review
    createReview(reviewInput: ReviewInput): Review!
    deleteReview(reviewId: ID): Review!
    adminDeleteReviews(reviewIds: [ID]): Boolean!

       # Cart
    addProductInCart(customer_id: ID,product_id:ID, quantity:Float,): Cart
    deleteProductFromCart(_id: ID, product_id: ID): Cart!
    deleteCart(cartId: ID): Cart!
    adminDeleteCarts(cartIds: [ID]): Cart!

    # Slider  ...# sliderInput 
    adminAddSlider(title: String, name: String, image: String): Slider! 
    adminUpdateSlider(sliderId: ID, title: String, name: String, image:String): Slider!
    # adminUpdateSlider(sliderId: ID, title: String, sliderInput: SliderDataInput): Slider!
    adminDeleteSlide( id: ID, slideId: ID): Slider!
    adminMassDeleteSlides(slideIds: [ID]): Slider! 
    adminDeleteSlider(sliderId: String): Slider! 
    adminMassDeleteSliders(sliderIds: [String]): Slider! 
  }
`;
