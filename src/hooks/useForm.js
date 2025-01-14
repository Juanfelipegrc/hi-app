import { useState } from "react";


export const useForm = (initialValues = {}) => {

    const [formValues, setFormValues] = useState(initialValues);

    const onInputChange = ({target}) => {
        const {name, value} = target;

        setFormValues({
            ...formValues,
            [name] : value,
        })
    };


    const resetFormValues = () => {
        setFormValues(initialValues);
    };

    return {
        ...formValues,
        onInputChange,
        resetFormValues,
    }
}