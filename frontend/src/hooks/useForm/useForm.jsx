import { useState, useEffect } from 'react'

const useForm = (submitFn, formValidate) => {
    
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clearHTMLtags = (input) => {
        return input.replace(/<[^>]*>/g, '')
    }

    const formHandleSubmit = (event) => {
        if (event) event.preventDefault();
        setIsSubmitting(true);
        setErrors(formValidate(formValues))
      };
    
    const formHandleChange = (event) => {  
        event.persist();

        let name = event.target.name;
        let val = clearHTMLtags(event.target.value);

        setFormValues({
            ...formValues,
            [name]:val,
        })
    }

    const formPrePopulate = (obj) => {
        if(Object.keys(obj).length !== 0) {
            setFormValues(obj)
        }
    }

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
          submitFn();
        }
      }, [errors]);


    return {
        formHandleChange,
        formHandleSubmit,
        formPrePopulate,
        formValues,
        errors,
    }
}

export default useForm