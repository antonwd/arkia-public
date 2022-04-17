export default function formValidate(values) {
    let errors = {};

    if (!values.firstName) {
      errors.firstName = 'שם פרטי הוא שדה חובה';
    } else if (values.firstName.length < 2) {
        errors.firstName = 'שם פרטי חייב להכיל לפחות 2 תווים';
    }

    if (!values.lastName) {
      errors.lastName = 'שם משפחה הוא שדה חובה';
    } else if (values.lastName.length < 2) {
        errors.lastName = 'שם משפחה חייב להכיל לפחות 2 תווים';
    }

    if (!values.firstNameEN) {
      errors.firstNameEN = 'שם פרטי באנגלית הוא שדה חובה';
    } else if (values.firstNameEN.length < 2) {
        errors.firstNameEN = 'שם פרטי באנגלית חייב להכיל לפחות 2 תווים';
    }

    if (!values.lastNameEN) {
      errors.lastNameEN = 'שם משפחה באנגלית הוא שדה חובה';
    } else if (values.lastNameEN.length < 2) {
        errors.lastNameEN = 'שם משפחה באנגלית חייב להכיל לפחות 2 תווים';
    }

    if (!values.phone) {
      errors.phone = 'חובה למלא מספר טלפון';
    } else if (values.phone.length < 9) {
        errors.phone = 'מספר טלפון חייב להכיל לפחות 9 תווים';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(values.phone)) {
      errors.phone = 'מספר הטלפון לא תקין';
    }

    if (!values.email) {
        errors.email = 'חובה להזין כתובת דוא׳׳ל';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'כתובת דוא׳׳ל לא תקינה';
    }
    
    return errors;
  };