export function matchRegex(number: string){
    const regexPattern = new RegExp("^[0-9]{10}$");
    return regexPattern.test(number)
}