const productsSocket = (io) => {
    return (req, res, next) => {
        req.io = io;
        return next();
    };
};

export default productsSocket;
