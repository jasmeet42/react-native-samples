type Product = {
    id: number,
    title: string,
    description: string,
    category?: string,   
    price: number,
    discountPercentage?: number,
    rating?: number,
    thumbnail: string
}

export default Product;