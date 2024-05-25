import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext(); //створення контексту фільтрів

export const useFilters = () => useContext(FilterContext); //хук для використання контексту фільтрів

export const FilterProvider = ({ children }) => { //компонент, в який ми обгорнемо Layout щоб у ньому можна було користуватись контекстом
  const [filters, setFilters] = useState({
    category: 'Catalogue', //фільтр категорії
    material: '', //фільтр матеріалу
    brand: '', //фільтр бренду
    state: '', //фільтр стану
    size: '', //розміру
    priceFrom: '', //ціни (нижня межа)
    priceTo: '', //ціни (верхня межа)
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}> {/*експортуємо значення контексту*/} 
      {children}
    </FilterContext.Provider>
  );
};

// експортуємо окремо фільтри що втановлюються за замовченням
export const defaultFilters = {
  category: '',
  material: '',
  brand: '',
  state: '',
  size: '',
  priceFrom: '',
  priceTo: '',
};
