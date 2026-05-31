"use strict";

function validate(value, rule) {
    const type = rule.split(":")[0];
    const condition = rule.split(":")[1] ?? null;

    switch (type) {
        case "array":
            return Array.isArray(value);

        case "required":
            return !!value;
        case "email":
            const regEx =
                /^[\w.!?#$%&'=~|{}`+*^][\w\-.!?#$%&'=~|{}`+*^]*@((xn--)?[\w]+([-][\w]+)*\.)+[a-z]{2,}$/i;
            return value ? regEx.test(value) : true;

        case "date":
            return (
                new Date(value) !== "Invalid Date" && !isNaN(new Date(value))
            );

        case "string":
            return typeof value === "string";

        case "phone":
            const regex = /^(84|19|0[2|3|5|7|8|9])+([0-9]{6,10})\b/g;
            return regex.test(value);

        case "in":
            const conditions = condition.split(",");
            if (Array.isArray(value)) {
                return value.every((element) =>
                    conditions.includes(element.toString())
                );
            } else {
                return value && conditions.includes(value.toString());
            }

        case "integer":
            return !isNaN(value);

        case "min":
            return value.length >= parseInt(condition);

        case "max":
            return value.length <= parseInt(condition);

        default:
            return true;
    }
}

export function validateForm(formFields, rules) {
    let errors = {};
    for (const field of Object.entries(formFields)) {
        if (!validateField(field[1], rules[field[0]])) {
            errors[field[0]] = "";
        }
    }
    return errors;
}

export function validateField(value, rules) {
    if (rules === undefined) return true;

    let fieldIsValid = true;

    for (const rule of rules.split("|")) {
        const valid = validate(value, rule);
        if (!valid) {
            fieldIsValid = false;
            break;
        }
    }

    return fieldIsValid;
}
