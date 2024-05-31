export const createResponse = (status: number, message: string, data?: any) => {
    return {
        status,
        message,
        data
    }
}

export const createErrorResponse = (status: number, message: string, error: any) => {
    return {
        status,
        message,
        error
    }
}