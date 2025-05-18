exports.retry = async (fn, maxRetries = 3, delay = 1000) => {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (err) {
            attempt++;
            if (attempt === maxRetries) throw err;
            await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt)));
        }
    }
};