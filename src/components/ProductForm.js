
import React, { useState, useCallback, useContext } from 'react';
import { useAuth } from '../AuthContext';
import './ProductForm.css';

const SubmissionSuccess = () => (
  <div className="successMessage">
    Product added successfully!
  </div>
);

function ProductForm() {

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    category: '', // ДОДАЛАСЬ КАТЕГОРІЯ
    price: '',
    productImage: '', 
    imageUrls: [],
    location: '',
    cushioning: '',
    traction: '',
    supportive: '',
    lightweight: '',
    durability: '',
    signature: '',
    versatility: '',
   
    description: ''
  });
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user, logout } = useAuth();
  const onDrop = useCallback(async (acceptedFiles) => {
    const filesArray = Array.from(acceptedFiles);
    if (filesArray.length === 0) {
      return;
    }
    const filesToUpload = filesArray.map(file => uploadFile(file));
    const urls = await Promise.all(filesToUpload);
  
    setFormData(prevFormData => ({
      ...prevFormData,
      imageUrls: [...prevFormData.imageUrls, ...urls], 
      productImage: prevFormData.productImage || urls[0] 
    }));
  
    const newFileNames = urls; 
    setUploadedFileNames(prevFileNames => [...prevFileNames, ...newFileNames]);
  }, []);
  const uploadFile = async (file) => {
    const accessToken = `${process.env.REACT_APP_ACCESS_TOKEN}`; // Ensure to securely manage your access token
    const url = 'https://content.dropboxapi.com/2/files/upload';
    const formattedFileName = file.name.replace(/\//g, '-');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
  
      reader.onload = async () => {
        const fileContent = reader.result;
        const headers = {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: '/' + encodeURIComponent(formattedFileName),
            mode: 'add',
            autorename: true,
            mute: false,
            strict_conflict: false
          })
        };
  
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: fileContent
          });
  
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error('Failed to upload image: ' + errorData);
          }
  
          const data = await response.json();
          resolve(formattedFileName);
        } catch (error) {
          console.error('Error uploading image: ', error);
          reject(error);
        }
      };
    });
  };


  const onDragOver = (e) => {
    e.preventDefault(); 
  };

  const onDropHandler = (e) => {
    e.preventDefault(); 
    onDrop(e.dataTransfer.files); 
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value 
    }));
    console.log(formData)
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      alert("You must be logged in to submit a product.");
      return;
    }

    if (!formData.productImage && formData.imageUrls.length === 0) {
      alert("Please add at least one image for the product.");
      return;
    }
  
    try {

      const formDataWithUser = {
        ...formData,
        user: user,
      };
  
      const response = await fetch('http://localhost:5001/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithUser), 
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
  
      console.log('Product added successfully');
      setIsSubmitted(true);

    } catch (error) {
      console.error('There was a problem adding the product:', error);

    }
  };
  if (isSubmitted) {
    return <SubmissionSuccess />;
  }


  return (
    <form className="submitForm" onSubmit={handleSubmit}> 

    <h2>Add Product</h2> 
    <input name="name" type="text" placeholder="Name" onChange={handleChange} value={formData.name} required />

    <select name="category" onChange={handleChange} value={formData.category} required> 
                        <option value="">Select Category</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Rare items">Rare items</option>
                        <option value="Basketballs">Basketballs</option>
    </select>
    <select name="state" onChange={handleChange} value={formData.state} required>
      <option value="">Select State</option>
      <option value="new">New</option>
      <option value="used">Used</option>
    </select>
    <input name="price" type="number" placeholder="Price" onChange={handleChange} value={formData.price} required />

    <input name="location" type="text" placeholder="Location" onChange={handleChange} value={formData.location} required />

    <select name="cushioning" onChange={handleChange} value={formData.cushioning}>
      <option value="">Select Cushioning</option>
      <option value="Rolled Foam">Rolled Foam</option>
      <option value="Air Pillows">Air Pillows</option>
      <option value="Anti-Static">Anti-Static</option>
      <option value="Bubble Pouches">Bubble Pouches</option>
      <option value="other">Other</option>
    </select>
    <select name="traction" onChange={handleChange} value={formData.traction}>
      <option value="">Select Traction</option>
      <option value="Chain">Chain</option>
      <option value="Spiked">Spiked</option>
      <option value="Crampons">Crampons</option>
      <option value="other">Other</option>
    </select>
    <select name="supportive" onChange={handleChange} value={formData.supportive}>
      <option value="">Select Supportive</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
    <select name="lightweight" onChange={handleChange} value={formData.lightweight}>
      <option value="">Select Lightweight</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
    <select name="durability" onChange={handleChange} value={formData.durability}>
      <option value="">Select Durability</option>
      <option value="Yes">High</option>
      <option value="No">Mid</option>
      <option value="No">Low</option>
    </select>
    <input name="signature" type="text" placeholder="Signature" onChange={handleChange} value={formData.signature} />
    <select name="versatility" onChange={handleChange} value={formData.versatility}>
      <option value="">Select Versatility</option>
      <option value="Yes">Game Only</option>
      <option value="No">Game/Everyday wear</option>
    </select>
    <textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} required />
    
  
    <div
  className="dropArea"
  onDragOver={onDragOver}
  onDrop={onDropHandler}
>
{uploadedFileNames.length > 0 ? (
        <ul style={{ listStyleType: 'none' }}>
          {uploadedFileNames.map((fileName, index) => (
            <li key={index}>{fileName}</li>
          ))}
        </ul>
      ) : (
        "Drag and drop additional images here"
      )}
</div>
    <button type="submit">Submit</button>
  </form>
  );
}

export default ProductForm;
