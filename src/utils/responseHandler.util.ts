export const createResponse = (message: string, data?: any) => {
    return {
        message,
        data
    }
}

export const createErrorResponse = (message: string, error: any) => {
    return {
        message,
        error
    }
}