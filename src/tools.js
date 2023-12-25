export const isDecimal = (n) => {
    // This regex matches any number, including integers, decimals, floats, and doubles
    var regex = /^-?[0-9]*\.?[0-9]+$/;
    return regex.test(n);
}