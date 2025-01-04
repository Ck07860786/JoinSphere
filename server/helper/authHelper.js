import bcrypt from 'bcryptjs'

export const hashedPassword = async(password)=>{
    try {
        const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password,saltRounds)
    return hashPassword
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async(password,hashPassword)=>{

    return bcrypt.compare(password,hashPassword)
        
}