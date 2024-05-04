export async function isValidPassword(password:string, hased_password:string){
    return await hashedPassword(password) === hased_password
}


async function hashedPassword(password:string){
    const arrayBuffer = await crypto.subtle.digest("SHA-512",
        new TextEncoder().encode(password))

    return Buffer.from(arrayBuffer).toString("base64")
}