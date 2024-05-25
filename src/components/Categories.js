import React from 'react';
import { CATEGORIES } from '../CATEGORIES';
import Category from './Category';
import "./Categories.css";
const Categories = () => {
  return (
    <div className='categories'>
      {CATEGORIES.map((category) => (
      <Category className = "category-wrapper"
      key ={category.id}
      backgroundColor = {category.color}
      imageSrc = {category.categoryImageUrl}
      categoryName = {category.name}
      offerCount = {category.offers}/>
      ))}
    </div>
  )
}
export default Categories;
