import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js"

const healthCheck = asyncHandler(async (req, res) => {
    res.json(new ApiResponse(200, "healthcheck route established"))
})

export { healthCheck }