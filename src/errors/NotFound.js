

const NotFound = (message) => {
    const error = new Error();
    error.name = 'NotFound';
    error.message =  message;
    return error;
}

export default NotFound;
