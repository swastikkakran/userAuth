import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => err.msg)
        throw new ApiError(422, "validation failed!", extractedErrors)
    }

    next()
}

export { validate }