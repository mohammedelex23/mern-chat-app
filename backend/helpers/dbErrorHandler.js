
const getError = function (err) {
    let errors = {
        type: '',
        errors: []
    };
    if (err.code) {
        switch (err.code) {
            case 11000:
                errors.type = "authError"
                errors.errors.push({
                    name: "email",
                    message: "Email already exists"
                })
                break;
            default:
                errors.type = "NotImplemented";
                errors.errors.push = [{
                    name: "NotImplemented",
                    message: err.message || "Something went wrong"
                }];
        }
    } else {
        for (let errName in err.errors) {
            errors.type = "validationError";
            errors.errors.push({
                name: errName,
                message: err.errors[errName].message
            })
        }
    }
    return errors
}


module.exports = { getError };