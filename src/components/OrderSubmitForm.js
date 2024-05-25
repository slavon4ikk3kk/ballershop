import React, { useState } from "react";
import styles from "./OrderSubmitForm.module.css";

function OrderSubmitForm(props) {
    const [formValues, setFormValues] = useState({
        email: '',
        phone: '',
        name: '',
        surname: '',
        address: ''
      });
      const [isSubmitted, setIsSubmitted] = useState(false); // Track if form is submitted successfully
    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormValues({...formValues, [name]: value});
      console.log(formValues);
      console.log(validate(formValues));
    }
    const [formErrors, setFormErrors] = useState({}); //помилки що виникли при аналізі заповнених даних
    const validate = (values) => {
    const errors = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const regexPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    const regexName = /^[a-zA-Z ]{2,30}$/;
    const regexAddress = /^[a-zA-Z0-9\s,.'-]{3,}$/;
 
        if(!values.email) {
          errors.email = "Email is required";
        } else if(!regexEmail.test(values.email)){
          errors.email = "This is not a valid email format!";
        }
        if(!values.phone) {
          errors.phone = "Phone is required";
        } else if(!regexPhone.test(values.phone)){
          errors.phone = "This is not a valid phone format!";
        }
        if(!values.name) {
          errors.name = "Name is required";
        } else if(!regexName.test(values.name)){
          errors.name = "This is not a valid name format!";
        }
        if(!values.address) {
          errors.address = "Address is required";
        } else if(!regexAddress.test(values.address)){
          errors.address = "This is not a valid address format!";
        }
        return errors;
     }
    
  const handleSubmit = async (e) => { //функція що обробляє надсилання форми
    e.preventDefault(); //запобігаємо оновленню
    const errors = validate(formValues); //перервіряємо валідність даних
    if (Object.keys(errors).length === 0) { //якщо помилки є пустим об'єктом
      try { //пробуємо надіслати дані серверу
        const response = await fetch('http://localhost:5001/order/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
        
        if (response.ok) { //якщо запит успішний
          setIsSubmitted(true); // позначаємо що форму відправлено успішно
        } else {
          // перехоплюємо помилки
          throw new Error('Failed to submit order'); // помилки при виконанні запиту
        }
      } catch (error) {
        console.error('Error submitting order: ', error);// помилки при виконанні запиту
        alert('Error submitting order'); // спиваюче вікно
      }
    } else {
      setFormErrors(errors); // якщо є помилки їх вивожимо
    }
  };
    return (
        <div className={styles.submitForm}>
          <form onSubmit={handleSubmit}>
            <h2>Marketplace Form</h2>
            <div className={styles.formControl}>
              <label className={styles.label}>Email:</label>
              <br/>
              <input type="email" name="email" className={styles.input} onChange={handleChange}/>
              <p className={styles.error}></p>
            </div>
            <div className={styles.formControl}>
              <label className={styles.label}>Phone:</label>
              <br/>
              <input type="text" name="phone" className={styles.input} onChange={handleChange}/>
              <p className={styles.error}></p>
            </div>
            <div className={styles.formControl}>
              <label className={styles.label}>Name:</label>
              <br/>
              <input type="text" name="name" className={styles.input} onChange={handleChange}/>
              <p className={styles.error}></p>
            </div>
            <div className={styles.formControl}>
              <label className={styles.label}>Surname:</label>
              <br/>
              <input type="text" name="surname" className={styles.input} onChange={handleChange}/>
              <p className={styles.error}></p>
            </div>
            <div className={styles.formControl}>
              <label className={styles.label}>Address:</label>
              <br/>
              <input type="text" name="address" className={styles.input} onChange={handleChange} />
              <p className={styles.error}></p>
            </div>
            <button type="submit" className={styles.button} >Submit</button>
          </form>
        </div>
    );
};
export default OrderSubmitForm;