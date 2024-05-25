import React, { useState, useEffect } from 'react';
import Product from './Product'; // Adjust the path based on your file structure
import './Products.css';
import { useFilters } from '../FilterContext';
import { useSearch } from '../SearchContext';

const Products = () => {
  const [products, setProducts] = useState([]); // Initialize state for products
  
  const {searchTerm} = useSearch();
  const { filters } = useFilters();
  useEffect(() => {
    // Fetch products when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/product');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data); // Update the state with the fetched products
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this effect runs only once after the initial render
  const filterAndSearchProducts = (products) => {

    return products.filter((product) => {
      // Filter by category, priceFrom, and priceTo
      if (filters.category!=="Catalogue"){
      if (filters.category && product.category !== filters.category) {
        return false;
      }
    }
      if (filters.priceFrom && product.price < parseFloat(filters.priceFrom)) {
        return false;
      }
      if (filters.priceTo && product.price > parseFloat(filters.priceTo)) {
        return false;
      }
      if(filters.state&&product.state !== filters.state) {
        return false;
      }
      // Additional filtering based on search term (e.g., by product name)
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      } 
      return true;
    });
  };
  const filteredProducts = filterAndSearchProducts(products);  
  return (
    <div className='products-div'>
      <h1>Trending items</h1>
      <div className="items">
        {filteredProducts.map((product) => (
          <Product
            className="item-wrapper"
            key={product.id}
            userId={product.user}
            accessToken={'sl.B0mqTOQXQcxIV-DtkDOLWKmY0Lpp3SLZs19pfPVPoVvZ38f5100KlAPpmRqHm9Y1KvljZfDwQxLxIEh36Oe-nteG6vjZ3LYvjHvtaTUT-WfqOJLplJYMaQ5nQ4BdfBMpZl4C8sRaGHlt'}
            imgSrc={product.productImage}
            itemName={product.name}
            condition={product.state}
            price={product.price}
            location={product.location}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
